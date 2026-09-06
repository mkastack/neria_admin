"use client";

import {
  collection,
  deleteDoc,
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
import type { Discount } from "@/src/lib/types";

function toDiscount(id: string, raw: DocumentData): Discount {
  return {
    id,
    code: typeof raw.code === "string" ? raw.code : id,
    type: (raw.type ?? "Percentage") as Discount["type"],
    value: typeof raw.value === "number" ? raw.value : 0,
    minSpend: typeof raw.minSpend === "number" ? raw.minSpend : undefined,
    usageCount: typeof raw.usageCount === "number" ? raw.usageCount : 0,
    usageLimit: typeof raw.usageLimit === "number" ? raw.usageLimit : undefined,
    status: (raw.status ?? "Active") as Discount["status"],
    startDate: raw.startDate ?? "",
    endDate: raw.endDate ?? undefined,
    applicableTo: (raw.applicableTo ?? "All Products") as Discount["applicableTo"],
  };
}

export function usePromoCodes(): { discounts: Discount[]; loading: boolean } {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "promoCodes"), orderBy("code", "asc")),
      (snap) => {
        setDiscounts(snap.docs.map((d) => toDiscount(d.id, d.data())));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);
  return { discounts, loading };
}

export async function upsertPromoCode(d: Discount): Promise<void> {
  // Codes are the doc id so the storefront can resolve a code in O(1)
  // via getDoc(promoCodes, code).
  const id = d.code.toUpperCase();
  await setDoc(
    doc(db, "promoCodes", id),
    {
      ...d,
      code: id,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function deletePromoCode(code: string): Promise<void> {
  const id = code.toUpperCase();
  await deleteDoc(doc(db, "promoCodes", id));
}

