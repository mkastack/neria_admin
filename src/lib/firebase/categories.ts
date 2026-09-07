"use client";

import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
  type DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./client";

/** Shape of a doc in `cms/categories/{slug}`. */
export interface CategoryDoc {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  itemCount: number;
  badge?: string;
  position: number;
  visible: boolean;
  updatedAt?: number;
}

function toCategory(id: string, raw: DocumentData): CategoryDoc {
  return {
    id,
    name: typeof raw.name === "string" ? raw.name : id,
    slug: typeof raw.slug === "string" ? raw.slug : id,
    description: typeof raw.description === "string" ? raw.description : undefined,
    image: typeof raw.image === "string" ? raw.image : "",
    itemCount: typeof raw.itemCount === "number" ? raw.itemCount : 0,
    badge: typeof raw.badge === "string" ? raw.badge : undefined,
    position: typeof raw.position === "number" ? raw.position : 0,
    visible: raw.visible !== false,
    updatedAt:
      raw.updatedAt?.toMillis?.() ??
      (typeof raw.updatedAt === "number" ? raw.updatedAt : undefined),
  };
}

export function useCategories(): { categories: CategoryDoc[]; loading: boolean } {
  const [categories, setCategories] = useState<CategoryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "cms", "categories", "items"), orderBy("position", "asc")),
      (snap) => {
        setCategories(snap.docs.map((d) => toCategory(d.id, d.data())));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);
  return { categories, loading };
}

export async function upsertCategory(c: CategoryDoc): Promise<void> {
  await setDoc(
    doc(db, "cms", "categories", "items", c.slug),
    {
      name: c.name,
      slug: c.slug,
      description: c.description ?? "",
      image: c.image,
      itemCount: c.itemCount,
      badge: c.badge ?? null,
      position: c.position,
      visible: c.visible,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function renameCategory(oldSlug: string, category: CategoryDoc): Promise<void> {
  await upsertCategory(category);
  if (oldSlug === category.slug) return;

  const products = await getDocs(
    query(collection(db, "products"), where("category", "==", oldSlug)),
  );
  if (!products.empty) {
    const batch = writeBatch(db);
    products.docs.forEach((product) => {
      batch.update(product.ref, {
        category: category.slug,
        categoryName: category.name,
      });
    });
    await batch.commit();
  }

  await deleteCategory(oldSlug);
}

export async function deleteCategory(slug: string): Promise<void> {
  const { deleteDoc } = await import("firebase/firestore");
  await deleteDoc(doc(db, "cms", "categories", "items", slug));
}
