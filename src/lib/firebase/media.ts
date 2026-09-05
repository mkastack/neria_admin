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
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./client";
import type { MediaAssetItem } from "@/src/lib/types";

function toMedia(id: string, raw: DocumentData): MediaAssetItem {
  return {
    id,
    name: raw.name ?? id,
    url: raw.url ?? "",
    type: (raw.type ?? "image") as MediaAssetItem["type"],
    sizeBytes: typeof raw.sizeBytes === "number" ? raw.sizeBytes : 0,
    width: typeof raw.width === "number" ? raw.width : 0,
    height: typeof raw.height === "number" ? raw.height : 0,
    folder: raw.folder ?? "Uploads",
    altText: raw.altText ?? "",
    createdAt: raw.createdAt ?? "",
    usedInCount: typeof raw.usedInCount === "number" ? raw.usedInCount : 0,
    usedInLocations: Array.isArray(raw.usedInLocations)
      ? (raw.usedInLocations as string[])
      : [],
  };
}

export function useMediaAssets(): { assets: MediaAssetItem[]; loading: boolean } {
  const [assets, setAssets] = useState<MediaAssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "media"), orderBy("createdAt", "desc")),
      (snap) => {
        setAssets(snap.docs.map((d) => toMedia(d.id, d.data())));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);
  return { assets, loading };
}

export interface UploadMediaInput {
  file: File;
  name: string;
  altText: string;
  folder: string;
  type: MediaAssetItem["type"];
}

/**
 * Uploads a file to Storage under `media/{id}.{ext}` and writes the
 * matching meta doc to Firestore. Returns the new asset's id + URL.
 *
 * Caller is responsible for setting `usedInCount` / `usedInLocations`
 * later if needed (we start at zero).
 */
export async function uploadMedia({
  file,
  name,
  altText,
  folder,
  type,
}: UploadMediaInput): Promise<MediaAssetItem> {
  const id = `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const ext = file.name.split(".").pop() || "bin";
  const path = `media/${id}.${ext}`;
  const ref = storageRef(storage, path);
  await uploadBytes(ref, file, {
    contentType: file.type || "application/octet-stream",
    cacheControl: "public, max-age=3600",
  });
  const url = await getDownloadURL(ref);
  const meta: MediaAssetItem = {
    id,
    name,
    url,
    type,
    sizeBytes: file.size,
    width: 0,
    height: 0,
    folder,
    altText,
    createdAt: new Date().toISOString().split("T")[0],
    usedInCount: 0,
    usedInLocations: [],
  };
  await setDoc(doc(db, "media", id), {
    ...meta,
    createdAt: serverTimestamp(),
  });
  return meta;
}

/** Deletes both the Firestore doc and the Storage object. */
export async function deleteMedia(id: string, url: string): Promise<void> {
  await deleteDoc(doc(db, "media", id));
  try {
    if (url) {
      // Storage ref from a download URL: parse the path component
      // and re-build a ref so we can delete it.
      const path = decodeURIComponent(
        url.split("/o/")[1]?.split("?")[0] ?? "",
      );
      if (path) await deleteObject(storageRef(storage, path));
    }
  } catch {
    // Best-effort — the file may already be gone.
  }
}
