"use client";

import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./client";
import type { StorefrontConfig, PublishVersion } from "@/src/lib/types";
import { defaultStorefrontConfig, initialPublishHistory } from "@/src/lib/cms-defaults";

/**
 * Single source of truth for the storefront CMS in Firestore.
 *
 * Path scheme (Firestore requires even-segment paths):
 *   - `cms/config`               → StorefrontConfig
 *   - `cms/publishHistory`       → { items: PublishVersion[] }
 *   - `cms/pages/items/{slug}`   → PageConfig
 *   - `cms/categories/items/{slug}` → CategoryDoc
 *   - `cms/journal/items/{id}`   → JournalArticleItem
 *
 * The admin's `StorefrontCmsContext` and the commerce storefront's
 * `app/lib/firebase/cms.ts` both subscribe to the same docs.
 */

export function useStorefrontConfig(): {
  config: StorefrontConfig;
  loading: boolean;
} {
  const [config, setConfig] = useState<StorefrontConfig>(defaultStorefrontConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "cms", "config"),
      (snap) => {
        if (snap.exists()) {
          setConfig({ ...defaultStorefrontConfig, ...snap.data() } as StorefrontConfig);
        }
        setLoading(false);
      },
      (err) => {
        // Surface the rejection instead of falling through silently —
        // most often this means a firestore.rules mismatch (e.g. a new
        // collection that wasn't granted access in the deployed rules).
        console.error("[cms] cms/config snapshot failed:", err);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  return { config, loading };
}

export async function saveStorefrontConfig(
  config: StorefrontConfig,
): Promise<void> {
  await setDoc(doc(db, "cms", "config"), {
    ...config,
    lastUpdated: serverTimestamp(),
  });
}

export function usePublishHistory(): { history: PublishVersion[]; loading: boolean } {
  const [history, setHistory] = useState<PublishVersion[]>(initialPublishHistory);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "cms", "publishHistory"),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as { items?: PublishVersion[] };
          setHistory(Array.isArray(data.items) ? data.items : initialPublishHistory);
        }
        setLoading(false);
      },
      (err) => {
        console.error("[cms] cms/publishHistory snapshot failed:", err);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);
  return { history, loading };
}

export async function appendPublishHistory(version: PublishVersion): Promise<void> {
  // We store the history as a single doc with an `items` array, ordered
  // newest-first. This keeps the editor's `/admin/website/history` page
  // to a single getDoc and avoids small-docs fan-out.
  const ref = doc(db, "cms", "publishHistory");
  const { getDoc } = await import("firebase/firestore");
  const snap = await getDoc(ref);
  const existing = snap.exists()
    ? (snap.data() as { items?: PublishVersion[] }).items ?? []
    : [];
  await setDoc(
    ref,
    { items: [version, ...existing].slice(0, 50) },
    { merge: true },
  );
}

/**
 * Subscribes to a single page doc (e.g. about, faq, shipping).
 * Falls back to `null` if the doc doesn't exist — the caller
 * decides whether to render "no content yet" or fall back to a default.
 */
export function usePageDoc(slug: string): {
  page: DocumentData | null;
  loading: boolean;
} {
  const [page, setPage] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!slug) return;
    const unsub = onSnapshot(
      doc(db, "cms", "pages", "items", slug),
      (snap) => {
        setPage(snap.exists() ? snap.data() : null);
        setLoading(false);
      },
      (err) => {
        console.error(`[cms] cms/pages/items/${slug} snapshot failed:`, err);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [slug]);
  return { page, loading };
}
