"use client";

import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./client";
import type { NotificationItem } from "@/src/lib/types";
import type { DocumentData } from "firebase/firestore";

function toNotification(id: string, raw: DocumentData): NotificationItem {
  return {
    id,
    category: (raw.category ?? "Orders") as NotificationItem["category"],
    title: raw.title ?? "New Event",
    description: raw.description ?? "",
    timestamp:
      raw.createdAt?.toDate?.()?.toISOString?.() ??
      raw.timestamp ??
      new Date().toISOString(),
    read: raw.read === true,
    actionUrl: raw.actionUrl,
  };
}

/** Real-time stream of the last `max` admin notifications. */
export function useAdminNotifications(max: number = 30): {
  notifications: NotificationItem[];
  loading: boolean;
} {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, "adminNotifications"),
        orderBy("createdAt", "desc"),
        limit(max),
      ),
      (snap) => {
        setNotifications(snap.docs.map((d) => toNotification(d.id, d.data())));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, [max]);

  return { notifications, loading };
}

/** Mark a single notification as read in Firestore. */
export async function markNotificationReadInDB(id: string): Promise<void> {
  await updateDoc(doc(db, "adminNotifications", id), { read: true });
}

/** Mark all notifications as read in Firestore. */
export async function markAllNotificationsReadInDB(): Promise<void> {
  const snap = await getDocs(
    query(
      collection(db, "adminNotifications"),
      orderBy("createdAt", "desc"),
      limit(50),
    ),
  );
  await Promise.all(
    snap.docs
      .filter((d) => !d.data().read)
      .map((d) =>
        updateDoc(doc(db, "adminNotifications", d.id), { read: true }),
      ),
  );
}

/** Create a new admin notification — called whenever a key event happens (new order, low stock, etc.). */
export async function createAdminNotification(input: {
  category: NotificationItem["category"];
  title: string;
  description: string;
  actionUrl?: string;
}): Promise<void> {
  const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  await setDoc(doc(db, "adminNotifications", id), {
    ...input,
    read: false,
    createdAt: serverTimestamp(),
  });
}
