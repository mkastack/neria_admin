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
import type { ShippingZone } from "@/src/lib/types";

function toShippingZone(id: string, raw: DocumentData): ShippingZone {
  return {
    id,
    name: typeof raw.name === "string" ? raw.name : "Shipping Zone",
    regions: Array.isArray(raw.regions) ? (raw.regions as string[]) : [],
    standardRate: typeof raw.standardRate === "number" ? raw.standardRate : 0,
    expressRate: typeof raw.expressRate === "number" ? raw.expressRate : 0,
    estimatedDelivery: typeof raw.estimatedDelivery === "string" ? raw.estimatedDelivery : "1 - 2 Business Days",
    status: (raw.status ?? "Active") as ShippingZone["status"],
  };
}

export function useShippingZones(): { shippingZones: ShippingZone[]; loading: boolean } {
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "shipping_zones"),
      (snap) => {
        const list = snap.docs.map((d) => toShippingZone(d.id, d.data()));
        setShippingZones(list);
        setLoading(false);
      },
      (err) => {
        console.warn("[shipping] Real-time listener error:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { shippingZones, loading };
}

export async function createShippingZoneInDB(zone: Omit<ShippingZone, "id"> & { id?: string }): Promise<string> {
  const id = zone.id || `zone-${Date.now()}`;
  const ref = doc(db, "shipping_zones", id);
  await setDoc(ref, {
    ...zone,
    id,
    standardRateCents: Math.round(zone.standardRate * 100),
    expressRateCents: Math.round(zone.expressRate * 100),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return id;
}

export async function updateShippingZoneInDB(id: string, updates: Partial<ShippingZone>): Promise<void> {
  const data: Record<string, unknown> = {
    ...updates,
    updatedAt: serverTimestamp(),
  };
  if (typeof updates.standardRate === "number") {
    data.standardRateCents = Math.round(updates.standardRate * 100);
  }
  if (typeof updates.expressRate === "number") {
    data.expressRateCents = Math.round(updates.expressRate * 100);
  }
  await updateDoc(doc(db, "shipping_zones", id), data);
}

export async function deleteShippingZoneInDB(id: string): Promise<void> {
  await deleteDoc(doc(db, "shipping_zones", id));
}
