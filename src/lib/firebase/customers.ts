"use client";

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  type DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./client";
import type { Customer } from "@/src/lib/types";
import { ordersForUser } from "./orders";

function toCustomer(id: string, raw: DocumentData): Customer {
  return {
    id,
    name: typeof raw.name === "string" ? raw.name : "",
    email: typeof raw.email === "string" ? raw.email : "",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    avatar:
      typeof raw.photoURL === "string" && raw.photoURL
        ? raw.photoURL
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            (typeof raw.name === "string" && raw.name) || "Neria",
          )}&background=FFD8EA&color=FF4FA3&size=160`,
    ordersCount: typeof raw.ordersCount === "number" ? raw.ordersCount : 0,
    totalSpent: typeof raw.totalSpent === "number" ? raw.totalSpent : 0,
    lastOrderDate:
      typeof raw.lastOrderDate === "string" ? raw.lastOrderDate : "",
    segment: "New",
    address: typeof raw.address === "string" ? raw.address : "",
    city: typeof raw.city === "string" ? raw.city : "",
    region: typeof raw.region === "string" ? raw.region : "",
    notes: [],
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
    joinedDate: raw.createdAt?.toDate?.()?.toISOString?.() ?? "",
    wishlistCount: typeof raw.wishlistCount === "number" ? raw.wishlistCount : 0,
  };
}

/**
 * Real-time subscription to all customers (users without a staff role).
 *
 * We compute ordersCount / totalSpent by joining against `orders/`
 * client-side — Firestore doesn't do server-side joins, and the
 * catalog is small enough that this is fast. If the user base ever
 * grows past a few thousand, switch to an aggregation trigger that
 * maintains `users/{uid}.lifetimeCents` server-side.
 */
export function useCustomers(): { customers: Customer[]; loading: boolean } {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const unsub = onSnapshot(
      query(collection(db, "users")),
      async (snap) => {
        const list: Customer[] = [];
        for (const d of snap.docs) {
          const data = d.data();
          // Skip staff — they're surfaced in /admin/staff, not here.
          if (
            typeof data.role === "string" &&
            data.role !== "customer"
          )
            continue;
          const orders = await ordersForUser(d.id).catch(() => []);
          const totalSpent = orders.reduce(
            (acc, o) => acc + (o.total ?? 0),
            0,
          );
          const lastOrderDate =
            orders
              .map((o) => o.createdAt)
              .filter((s) => !!s)
              .sort()
              .at(-1) ?? "";
          list.push(
            toCustomer(d.id, {
              ...data,
              ordersCount: orders.length,
              totalSpent,
              lastOrderDate,
            }),
          );
        }
        if (!cancelled) {
          setCustomers(
            list.sort(
              (a, b) =>
                new Date(b.lastOrderDate ?? 0).getTime() -
                new Date(a.lastOrderDate ?? 0).getTime(),
            ),
          );
          setLoading(false);
        }
      },
      () => {
        if (!cancelled) setLoading(false);
      },
    );
    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  return { customers, loading };
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const snap = await getDoc(doc(db, "users", id));
  if (!snap.exists()) return null;
  const orders = await ordersForUser(id).catch(() => []);
  const totalSpent = orders.reduce((acc, o) => acc + (o.total ?? 0), 0);
  const lastOrderDate =
    orders
      .map((o) => o.createdAt)
      .filter((s) => !!s)
      .sort()
      .at(-1) ?? "";
  return toCustomer(snap.id, {
    ...snap.data(),
    ordersCount: orders.length,
    totalSpent,
    lastOrderDate,
  });
}
