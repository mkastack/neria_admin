"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit as fsLimit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./client";
import type { Product, ProductVariant } from "@/src/lib/types";

/**
 * Resolves a product doc into the admin's `Product` shape.
 *
 * The admin's `Product` interface is richer than the storefront's
 * public `Product` shape (it carries cost, stock, salesCount, etc.)
 * so we widen the reader to pull those extra fields when present.
 */
function toProduct(id: string, raw: DocumentData): Product {
  const price =
    typeof raw.price === "number"
      ? raw.price
      : typeof raw.priceCents === "number"
        ? raw.priceCents / 100
        : 0;

  const compareAtPrice =
    typeof raw.compareAtPrice === "number"
      ? raw.compareAtPrice
      : typeof raw.compareAtPriceCents === "number"
        ? raw.compareAtPriceCents / 100
        : undefined;

  const images = Array.isArray(raw.images)
    ? (raw.images.filter((img: unknown) => typeof img === "string" && img.trim().length > 0) as string[])
    : typeof raw.image === "string" && raw.image
      ? [raw.image]
      : [];

  const createdAt =
    raw.createdAt?.toDate?.()?.toISOString?.() ??
    (typeof raw.createdAt === "string" ? raw.createdAt : "");

  const updatedAt =
    raw.updatedAt?.toDate?.()?.toISOString?.() ??
    (typeof raw.updatedAt === "string" ? raw.updatedAt : createdAt);

  return {
    id,
    name: raw.name ?? "",
    slug: raw.slug ?? "",
    description: raw.description ?? "",
    shortDescription: raw.shortDescription ?? "",
    category: (raw.category ?? "Other") as Product["category"],
    collection: raw.collection ?? "",
    price,
    compareAtPrice,
    cost: typeof raw.cost === "number" ? raw.cost : 0,
    sku: raw.sku ?? "",
    barcode: raw.barcode ?? undefined,
    stock: typeof raw.stock === "number" ? raw.stock : 0,
    lowStockThreshold:
      typeof raw.lowStockThreshold === "number" ? raw.lowStockThreshold : 5,
    trackQuantity: raw.trackQuantity !== false,
    allowBackorder: !!raw.allowBackorder,
    status: (raw.status ?? "Active") as Product["status"],
    images,
    variants: Array.isArray(raw.variants)
      ? (raw.variants as ProductVariant[])
      : [],
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    salesCount: typeof raw.salesCount === "number" ? raw.salesCount : 0,
    revenue: typeof raw.revenue === "number" ? raw.revenue : 0,
    rating: typeof raw.rating === "number" ? raw.rating : 0,
    reviewsCount:
      typeof raw.reviewsCount === "number" ? raw.reviewsCount : 0,
    updatedAt,
    createdAt,
  };
}

/** One-shot fetch of the entire catalog (small enough for this brand). */
export async function listProducts(): Promise<Product[]> {
  const snap = await getDocs(collection(db, "products"));
  const list = snap.docs.map((d) => toProduct(d.id, d.data()));
  return list.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());
}

/** Live subscription to the catalog. Used by the products and inventory pages. */
export function useProducts(): { products: Product[]; loading: boolean } {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "products"),
      (snap) => {
        const list = snap.docs.map((d) => toProduct(d.id, d.data()));
        list.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());
        setProducts(list);
        setLoading(false);
      },
      (err) => {
        console.warn("[products] Real-time listener error:", err);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);
  return { products, loading };
}

/** Fetches a single product by Firestore doc id. */
export async function getProduct(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return null;
  return toProduct(snap.id, snap.data());
}

/** Fetches a single product by its URL slug (used for cross-link previews). */
export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  const q = query(collection(db, "products"), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return toProduct(snap.docs[0].id, snap.docs[0].data());
}

/**
 * Creates a new product. We accept the admin's full `Product` shape
 * and only persist the canonical fields the rest of the app expects
 * (anything the storefront's reader at
 * `neria_commerce/app/lib/firebase/products.ts` doesn't know about
 * will just live in the doc as extra fields).
 */
export async function createProduct(p: Omit<Product, "id">): Promise<string> {
  const ref = doc(collection(db, "products"));
  await setDoc(ref, {
    ...p,
    priceCents: Math.round(p.price * 100), // dollars → cents for the storefront
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  // Fire a real-time notification so the admin bell updates instantly
  try {
    const { createAdminNotification } = await import("./notifications");
    await createAdminNotification({
      category: "Inventory",
      title: `New product added: ${p.name}`,
      description: `"${p.name}" is now live on the storefront.`,
      actionUrl: `/admin/products/${ref.id}`,
    });
  } catch (_) { /* non-critical */ }
  return ref.id;
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>,
): Promise<void> {
  await setDoc(
    doc(db, "products", id),
    {
      ...updates,
      priceCents:
        typeof updates.price === "number"
          ? Math.round(updates.price * 100)
          : undefined,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, "products", id));
}

/** Convenience: returns the N most-recently-updated products. */
export async function recentProducts(n: number): Promise<Product[]> {
  const q = query(
    collection(db, "products"),
    orderBy("updatedAt", "desc"),
    fsLimit(n),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toProduct(d.id, d.data()));
}
