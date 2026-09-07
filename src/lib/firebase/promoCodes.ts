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
      collection(db, "promoCodes"),
      (snap) => {
        const list = snap.docs.map((d) => toDiscount(d.id, d.data()));
        list.sort((a, b) => (a.code || "").localeCompare(b.code || ""));
        setDiscounts(list);
        setLoading(false);
      },
      (err) => {
        console.warn("[promoCodes] Real-time listener error:", err);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);
  return { discounts, loading };
}

export async function upsertPromoCode(d: Discount): Promise<void> {
  const id = d.code.toUpperCase().trim();
  const payload = {
    ...d,
    id,
    code: id,
    updatedAt: serverTimestamp(),
  };

  // Write to promoCodes
  await setDoc(doc(db, "promoCodes", id), payload, { merge: true });

  // Also write to discounts collection for backward compatibility
  try {
    await setDoc(doc(db, "discounts", id), payload, { merge: true });
  } catch (_) {}
}

export async function deletePromoCode(code: string): Promise<void> {
  const id = code.toUpperCase().trim();
  await deleteDoc(doc(db, "promoCodes", id));
  try {
    await deleteDoc(doc(db, "discounts", id));
  } catch (_) {}
}

