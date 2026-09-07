"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./client";
import type { Customer } from "@/src/lib/types";
import { ordersForUser } from "./orders";

function toCustomer(id: string, raw: DocumentData): Customer {
  const name =
    (typeof raw.name === "string" && raw.name.trim()) ||
    (typeof raw.displayName === "string" && raw.displayName.trim()) ||
    `${raw.firstName || ""} ${raw.lastName || ""}`.trim() ||
    (typeof raw.email === "string" ? raw.email.split("@")[0] : "Customer");

  const phone =
    typeof raw.phone === "string"
      ? raw.phone
      : typeof raw.phoneNumber === "string"
        ? raw.phoneNumber
        : "";

  const address =
    typeof raw.address === "string"
      ? raw.address
      : typeof raw.shippingAddress?.street === "string"
        ? raw.shippingAddress.street
        : typeof raw.shippingAddress?.address === "string"
          ? raw.shippingAddress.address
          : "";

  const city =
    typeof raw.city === "string"
      ? raw.city
      : typeof raw.shippingAddress?.city === "string"
        ? raw.shippingAddress.city
        : "";

  const region =
    typeof raw.region === "string"
      ? raw.region
      : typeof raw.shippingAddress?.region === "string"
        ? raw.shippingAddress.region
        : typeof raw.shippingAddress?.state === "string"
          ? raw.shippingAddress.state
          : "";

  const joinedDate =
    raw.createdAt?.toDate?.()?.toISOString?.() ??
    (typeof raw.createdAt === "string"
      ? raw.createdAt
      : typeof raw.createdAt === "number"
        ? new Date(raw.createdAt).toISOString()
        : new Date().toISOString());

  const totalSpent = typeof raw.totalSpent === "number" ? raw.totalSpent : 0;
  const ordersCount = typeof raw.ordersCount === "number" ? raw.ordersCount : 0;
  let segment: Customer["segment"] = "New";
  if (totalSpent > 1000 || ordersCount >= 5) segment = "VIP";
  else if (ordersCount > 1) segment = "Returning";

  return {
    id,
    name,
    email: typeof raw.email === "string" ? raw.email : "",
    phone,
    avatar:
      typeof raw.photoURL === "string" && raw.photoURL
        ? raw.photoURL
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FFD8EA&color=FF4FA3&size=160`,
    ordersCount,
    totalSpent,
    lastOrderDate:
      typeof raw.lastOrderDate === "string" ? raw.lastOrderDate : "",
    segment,
    address,
    city,
    region,
    notes: Array.isArray(raw.notes) ? raw.notes : [],
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
    joinedDate,
    wishlistCount: typeof raw.wishlistCount === "number" ? raw.wishlistCount : 0,
  };
}

/**
 * Real-time subscription to all customers (users who signed up on storefront).
 */
export function useCustomers(): { customers: Customer[]; loading: boolean } {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const unsub = onSnapshot(
      collection(db, "users"),
      async (snap) => {
        const list: Customer[] = [];
        for (const d of snap.docs) {
          const data = d.data();
          const roleStr = typeof data.role === "string" ? data.role.toLowerCase() : "";
          const isStaff =
            [
              "super_admin",
              "store_manager",
              "order_manager",
              "inventory_manager",
              "marketing_manager",
              "customer_support",
              "finance_viewer",
              "admin",
            ].includes(roleStr) || roleStr.includes("manager");

          // Skip staff — they are in staff/roles
          if (isStaff) continue;

          list.push(toCustomer(d.id, data));
        }

        // Fetch order stats for customers
        const ordersSnap = await getDocs(collection(db, "orders")).catch(() => null);
        if (ordersSnap) {
          const ordersByUser = new Map<string, { count: number; spent: number; lastDate: string }>();
          for (const od of ordersSnap.docs) {
            const o = od.data();
            const uid = o.userId || o.customer?.id;
            const email = (o.customerEmail || o.customer?.email || "").toLowerCase().trim();
            const total = typeof o.total === "number" ? o.total / 100 : (typeof o.totalCents === "number" ? o.totalCents / 100 : 0);
            const date = o.createdAt?.toDate?.()?.toISOString?.() ?? (typeof o.createdAt === "string" ? o.createdAt : "");

            const updateMap = (key: string) => {
              if (!key) return;
              const prev = ordersByUser.get(key) || { count: 0, spent: 0, lastDate: "" };
              prev.count += 1;
              prev.spent += total;
              if (!prev.lastDate || date > prev.lastDate) prev.lastDate = date;
              ordersByUser.set(key, prev);
            };

            if (uid) updateMap(uid);
            if (email) updateMap(email);
          }

          for (const c of list) {
            const stats = ordersByUser.get(c.id) || ordersByUser.get(c.email.toLowerCase().trim());
            if (stats) {
              c.ordersCount = stats.count;
              c.totalSpent = Math.round(stats.spent);
              c.lastOrderDate = stats.lastDate;
              if (c.totalSpent > 1000 || c.ordersCount >= 5) c.segment = "VIP";
              else if (c.ordersCount > 1) c.segment = "Returning";
            }
          }
        }

        if (!cancelled) {
          list.sort(
            (a, b) =>
              new Date(b.lastOrderDate || b.joinedDate || 0).getTime() -
              new Date(a.lastOrderDate || a.joinedDate || 0).getTime(),
          );
          setCustomers(list);
          setLoading(false);
        }
      },
      (err) => {
        console.warn("[customers] Real-time listener error:", err);
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

/** Real-time subscription to a single customer profile */
export function useCustomer(id: string): { customer: Customer | null; loading: boolean } {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setCustomer(null);
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(
      doc(db, "users", id),
      async (snap) => {
        if (!snap.exists()) {
          setCustomer(null);
          setLoading(false);
          return;
        }

        const base = toCustomer(snap.id, snap.data());
        const userOrders = await ordersForUser(id).catch(() => []);
        const totalSpent = userOrders.reduce((acc, o) => acc + (o.total ?? 0), 0);
        const lastOrderDate =
          userOrders
            .map((o) => o.createdAt)
            .filter((s) => !!s)
            .sort()
            .at(-1) ?? "";

        base.ordersCount = userOrders.length;
        base.totalSpent = totalSpent;
        base.lastOrderDate = lastOrderDate;
        if (totalSpent > 1000 || userOrders.length >= 5) base.segment = "VIP";
        else if (userOrders.length > 1) base.segment = "Returning";

        setCustomer(base);
        setLoading(false);
      },
      (err) => {
        console.warn("[customer] Real-time listener error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [id]);

  return { customer, loading };
}

export async function addCustomerNoteInDB(
  customerId: string,
  note: { id: string; text: string; author: string; timestamp: string }
): Promise<void> {
  const snap = await getDoc(doc(db, "users", customerId));
  const currentNotes = snap.exists() && Array.isArray(snap.data()?.notes) ? snap.data()?.notes : [];
  await setDoc(
    doc(db, "users", customerId),
    {
      notes: [note, ...currentNotes],
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
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
