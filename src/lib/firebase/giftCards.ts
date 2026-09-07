"use client";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./client";
import type { GiftCard } from "@/src/lib/types";

function toGiftCard(id: string, raw: DocumentData): GiftCard {
  return {
    id,
    code: typeof raw.code === "string" ? raw.code : id,
    customerName: typeof raw.customerName === "string" ? raw.customerName : "VIP Customer",
    customerEmail: typeof raw.customerEmail === "string" ? raw.customerEmail : "",
    initialValue: typeof raw.initialValue === "number" ? raw.initialValue : (typeof raw.amount === "number" ? raw.amount : 0),
    balance: typeof raw.balance === "number" ? raw.balance : (typeof raw.initialValue === "number" ? raw.initialValue : 0),
    status: (raw.status ?? "Active") as GiftCard["status"],
    createdAt:
      raw.createdAt?.toDate?.()?.toISOString?.() ??
      (typeof raw.createdAt === "string" ? raw.createdAt : new Date().toISOString()),
    expiresAt:
      raw.expiresAt?.toDate?.()?.toISOString?.() ??
      (typeof raw.expiresAt === "string" ? raw.expiresAt : undefined),
  };
}

export function useGiftCards(): { giftCards: GiftCard[]; loading: boolean } {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "giftCards"),
      (snap) => {
        const list = snap.docs.map((d) => toGiftCard(d.id, d.data()));
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setGiftCards(list);
        setLoading(false);
      },
      (err) => {
        console.warn("[giftCards] Real-time listener error:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { giftCards, loading };
}

export async function createGiftCardInDB(card: Omit<GiftCard, "id"> & { id?: string }): Promise<string> {
  const id = card.id || `gc-${Date.now()}`;
  const ref = doc(db, "giftCards", id);
  await setDoc(ref, {
    ...card,
    id,
    balanceCents: Math.round(card.balance * 100),
    initialValueCents: Math.round(card.initialValue * 100),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return id;
}

export async function updateGiftCardInDB(id: string, updates: Partial<GiftCard>): Promise<void> {
  const data: Record<string, unknown> = {
    ...updates,
    updatedAt: serverTimestamp(),
  };
  if (typeof updates.balance === "number") {
    data.balanceCents = Math.round(updates.balance * 100);
  }
  await updateDoc(doc(db, "giftCards", id), data);
}

export async function deleteGiftCardInDB(id: string): Promise<void> {
  await deleteDoc(doc(db, "giftCards", id));
}
