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
  type DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./client";
import type { ActivityLog } from "@/src/lib/types";

function toLog(id: string, raw: DocumentData): ActivityLog {
  return {
    id,
    staffName: raw.staffName ?? "Unknown",
    staffAvatar: raw.staffAvatar ?? "",
    action: (raw.action ?? "Updated") as ActivityLog["action"],
    resource: (raw.resource ?? "Settings") as ActivityLog["resource"],
    description: raw.description ?? "",
    ipAddress: raw.ipAddress ?? "",
    timestamp: raw.timestamp?.toDate?.()?.toISOString?.() ?? "",
  };
}

export function useActivityLogs(max: number = 50): {
  logs: ActivityLog[];
  loading: boolean;
} {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, "activity"),
        orderBy("timestamp", "desc"),
        limit(max),
      ),
      (snap) => {
        setLogs(snap.docs.map((d) => toLog(d.id, d.data())));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, [max]);
  return { logs, loading };
}

export async function recordActivity(input: {
  staffName: string;
  staffAvatar?: string;
  action: ActivityLog["action"];
  resource: ActivityLog["resource"];
  description: string;
  ipAddress?: string;
}): Promise<void> {
  const id = `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  await setDoc(doc(db, "activity", id), {
    ...input,
    timestamp: serverTimestamp(),
  });
}
