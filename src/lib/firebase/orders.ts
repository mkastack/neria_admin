"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "./client";
import type {
  DeliveryMethod,
  FulfillmentStatus,
  Order,
  OrderStatus,
  PaymentMethod,
} from "@/src/lib/types";

/**
 * Resolves an `orders/{orderId}` doc into the admin's `Order` shape.
 *
 * The storefront's order doc (created by the createPaymentIntent Cloud
 * Function) carries fewer fields than the admin's interface — it has
 * `total` in cents, an `items` array of `{price, quantity, ...}`, a
 * `userId`/email, and a `status`. We widen the reader to fill in the
 * rest from sensible defaults.
 */
function toOrder(id: string, raw: DocumentData): Order {
  // The Cloud Function stores cents; the admin UI works in major units.
  // We pick `totalCents` if present, fall back to `total` interpreted
  // as cents too, and then convert to a major-unit value.
  const totalCents: number =
    typeof raw.totalCents === "number"
      ? raw.totalCents
      : typeof raw.total === "number"
        ? raw.total
        : 0;
  const subtotalCents: number =
    typeof raw.subtotalCents === "number"
      ? raw.subtotalCents
      : totalCents;
  const shippingCents: number =
    typeof raw.shippingCents === "number" ? raw.shippingCents : 0;
  const discountCents: number =
    typeof raw.discountCents === "number" ? raw.discountCents : 0;
  const taxCents: number = typeof raw.taxCents === "number" ? raw.taxCents : 0;

  const items = Array.isArray(raw.items) ? raw.items : [];
  const shippingAddress = (raw.shippingAddress ?? {}) as Record<
    string,
    unknown
  >;
  const customerName =
    typeof raw.customerName === "string"
      ? raw.customerName
      : typeof raw.customerEmail === "string"
        ? raw.customerEmail
        : "Customer";

  return {
    id,
    orderNumber:
      typeof raw.orderNumber === "string" ? raw.orderNumber : id.slice(0, 8),
    customer: {
      id: typeof raw.userId === "string" ? raw.userId : "",
      name: customerName,
      email: typeof raw.customerEmail === "string" ? raw.customerEmail : "",
      phone: typeof raw.customerPhone === "string" ? raw.customerPhone : "",
      avatar: undefined,
    },
    createdAt:
      raw.createdAt?.toDate?.()?.toISOString?.() ??
      (typeof raw.createdAt === "string" ? raw.createdAt : ""),
    items: items.map((it: DocumentData, idx: number) => ({
      id: typeof it.id === "string" ? it.id : `${id}-${idx}`,
      productId: typeof it.productId === "string" ? it.productId : "",
      name: typeof it.name === "string" ? it.name : "",
      variant: typeof it.variant === "string" ? it.variant : "",
      size: typeof it.size === "string" ? it.size : "",
      color: typeof it.color === "string" ? it.color : "",
      sku: typeof it.sku === "string" ? it.sku : "",
      price: typeof it.price === "number" ? it.price / 100 : 0,
      quantity: typeof it.quantity === "number" ? it.quantity : 1,
      image: typeof it.image === "string" ? it.image : "",
      total:
        typeof it.total === "number"
          ? it.total / 100
          : (typeof it.price === "number" ? it.price / 100 : 0) *
              (typeof it.quantity === "number" ? it.quantity : 1),
    })),
    paymentStatus: mapPaymentStatus(raw.status),
    fulfillmentStatus: mapFulfillmentStatus(raw.status),
    paymentMethod:
      typeof raw.paymentMethod === "string"
        ? (raw.paymentMethod as PaymentMethod)
        : ("Credit / Debit Card" as PaymentMethod),
    deliveryMethod:
      typeof raw.deliveryMethod === "string"
        ? (raw.deliveryMethod as DeliveryMethod)
        : ("Standard Delivery" as DeliveryMethod),
    deliveryAddress: {
      street: typeof shippingAddress.street === "string" ? shippingAddress.street : "",
      city: typeof shippingAddress.city === "string" ? shippingAddress.city : "",
      region:
        typeof shippingAddress.region === "string"
          ? shippingAddress.region
          : "",
      country:
        typeof shippingAddress.country === "string"
          ? shippingAddress.country
          : "",
      postalCode:
        typeof shippingAddress.postalCode === "string"
          ? shippingAddress.postalCode
          : undefined,
    },
    subtotal: subtotalCents / 100,
    discount: discountCents / 100,
    discountCode: typeof raw.discountCode === "string" ? raw.discountCode : undefined,
    shippingFee: shippingCents / 100,
    tax: taxCents / 100,
    total: totalCents / 100,
    notes: typeof raw.notes === "string" ? raw.notes : undefined,
    fraudRisk: "Low",
    timeline: [],
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
  };
}

function mapPaymentStatus(s: unknown): OrderStatus {
  if (typeof s !== "string") return "Pending";
  if (s === "paid" || s === "preparing" || s === "shipped" || s === "delivered")
    return "Paid";
  if (s === "refunded") return "Refunded";
  if (s === "cancelled") return "Failed";
  return "Pending";
}

function mapFulfillmentStatus(s: unknown): FulfillmentStatus {
  switch (s) {
    case "paid":
      return "Processing";
    case "preparing":
      return "Packed";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    case "refunded":
      return "Returned";
    default:
      return "Unfulfilled";
  }
}

export async function listOrders(): Promise<Order[]> {
  const snap = await getDocs(
    query(collection(db, "orders"), orderBy("createdAt", "desc")),
  );
  return snap.docs.map((d) => toOrder(d.id, d.data()));
}

export function useOrders(): { orders: Order[]; loading: boolean } {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  // Track seen order IDs so we can detect genuinely new orders
  const seenIds = useState<Set<string>>(() => new Set())[0];
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "orders"), orderBy("createdAt", "desc")),
      async (snap) => {
        const newOrders = snap.docs.map((d) => toOrder(d.id, d.data()));

        // Detect new orders (not seen before) after the first load
        if (!isFirstLoad.current) {
          const brandNew = newOrders.filter((o) => !seenIds.has(o.id));
          if (brandNew.length > 0) {
            try {
              const { createAdminNotification } = await import("./notifications");
              for (const o of brandNew) {
                await createAdminNotification({
                  category: "Orders",
                  title: `New order ${o.orderNumber}`,
                  description: `${o.customer.name} placed an order totalling $${o.total.toLocaleString()}.`,
                  actionUrl: `/admin/orders/${o.id}`,
                });
              }
            } catch (_) { /* non-critical */ }
          }
        }

        // Update seen IDs
        newOrders.forEach((o) => seenIds.add(o.id));
        isFirstLoad.current = false;

        setOrders(newOrders);
        setLoading(false);

      },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);
  return { orders, loading };
}

export async function getOrder(id: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, "orders", id));
  if (!snap.exists()) return null;
  return toOrder(snap.id, snap.data());
}

export async function updateOrderFulfillment(
  id: string,
  status: FulfillmentStatus,
): Promise<void> {
  await setDoc(
    doc(db, "orders", id),
    { fulfillmentStatus: status, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function updateOrderStatus(
  id: string,
  paymentStatus: OrderStatus,
  notes?: string,
): Promise<void> {
  await setDoc(
    doc(db, "orders", id),
    {
      paymentStatus,
      fulfillmentStatus: paymentStatus === "Refunded" ? "Returned" : "Unfulfilled",
      notes: notes || undefined,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function updateOrderDelivery(
  id: string,
  trackingNumber: string,
  fulfillmentStatus: FulfillmentStatus = "Shipped",
): Promise<void> {
  await setDoc(
    doc(db, "orders", id),
    {
      trackingNumber,
      fulfillmentStatus,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/** Real-time orders grouped by user — used by the customer detail page. */
export async function ordersForUser(uid: string): Promise<Order[]> {
  const q = query(collection(db, "orders"), where("userId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toOrder(d.id, d.data()));
}
