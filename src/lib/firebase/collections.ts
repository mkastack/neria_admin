"use client";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./client";
import type { Collection } from "@/src/lib/types";

function toCollection(id: string, raw: DocumentData): Collection {
  return {
    id,
    name: raw.name ?? "",
    slug: raw.slug ?? id,
    description: raw.description ?? "",
    coverImage: raw.coverImage ?? "",
    bannerImage: raw.bannerImage ?? "",
    productsCount: typeof raw.productsCount === "number" ? raw.productsCount : 0,
    status: (raw.status ?? "Active") as Collection["status"],
    sales: typeof raw.sales === "number" ? raw.sales : 0,
    revenue: typeof raw.revenue === "number" ? raw.revenue : 0,
    updatedAt: raw.updatedAt?.toDate?.()?.toISOString?.() ?? "",
    productIds: Array.isArray(raw.productIds) ? raw.productIds : [],
  };
}

export function useCollections(): { collections: Collection[]; loading: boolean } {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "collections"), orderBy("name", "asc")),
      (snap) => {
        setCollections(snap.docs.map((d) => toCollection(d.id, d.data())));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);
  return { collections, loading };
}

export async function upsertCollection(c: Collection): Promise<void> {
  await setDoc(
    doc(db, "collections", c.id || crypto.randomUUID()),
    {
      ...c,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
