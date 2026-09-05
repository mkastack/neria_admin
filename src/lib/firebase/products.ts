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
  return {
    id,
    name: raw.name ?? "",
    slug: raw.slug ?? "",
    description: raw.description ?? "",
    shortDescription: raw.shortDescription ?? "",
    category: (raw.category ?? "Other") as Product["category"],
    collection: raw.collection ?? "",
    price: typeof raw.price === "number" ? raw.price : 0,
    compareAtPrice:
      typeof raw.compareAtPrice === "number" ? raw.compareAtPrice : undefined,
    cost: typeof raw.cost === "number" ? raw.cost : 0,
    sku: raw.sku ?? "",
    barcode: raw.barcode ?? undefined,
    stock: typeof raw.stock === "number" ? raw.stock : 0,
    lowStockThreshold:
      typeof raw.lowStockThreshold === "number" ? raw.lowStockThreshold : 5,
    trackQuantity: raw.trackQuantity !== false,
    allowBackorder: !!raw.allowBackorder,
    status: (raw.status ?? "Active") as Product["status"],
    images: Array.isArray(raw.images) ? raw.images : [],
    variants: Array.isArray(raw.variants)
      ? (raw.variants as ProductVariant[])
      : [],
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    salesCount: typeof raw.salesCount === "number" ? raw.salesCount : 0,
    revenue: typeof raw.revenue === "number" ? raw.revenue : 0,
    rating: typeof raw.rating === "number" ? raw.rating : 0,
    reviewsCount:
      typeof raw.reviewsCount === "number" ? raw.reviewsCount : 0,
    updatedAt: raw.updatedAt ?? "",
    createdAt: raw.createdAt ?? "",
  };
}

/** One-shot fetch of the entire catalog (small enough for this brand). */
export async function listProducts(): Promise<Product[]> {
  const snap = await getDocs(collection(db, "products"));
  return snap.docs.map((d) => toProduct(d.id, d.data()));
}

/** Live subscription to the catalog. Used by the products list page. */
export function useProducts(): { products: Product[]; loading: boolean } {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "products"), orderBy("updatedAt", "desc")),
      (snap) => {
        setProducts(snap.docs.map((d) => toProduct(d.id, d.data())));
        setLoading(false);
      },
      () => setLoading(false),
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
