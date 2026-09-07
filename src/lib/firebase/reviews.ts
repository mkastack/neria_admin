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
import type { Review } from "@/src/lib/types";

function toReview(id: string, raw: DocumentData): Review {
  return {
    id,
    productName: typeof raw.productName === "string" ? raw.productName : "Product",
    productImage: typeof raw.productImage === "string" ? raw.productImage : "",
    customerName: typeof raw.customerName === "string" ? raw.customerName : (typeof raw.name === "string" ? raw.name : "Verified Customer"),
    customerAvatar:
      typeof raw.customerAvatar === "string" && raw.customerAvatar
        ? raw.customerAvatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            (typeof raw.customerName === "string" && raw.customerName) || "Customer"
          )}&background=FFD8EA&color=FF4FA3&size=80`,
    rating: typeof raw.rating === "number" ? raw.rating : 5,
    title: typeof raw.title === "string" ? raw.title : "",
    content: typeof raw.content === "string" ? raw.content : (typeof raw.comment === "string" ? raw.comment : ""),
    date:
      raw.createdAt?.toDate?.()?.toISOString?.() ??
      (typeof raw.createdAt === "string" ? raw.createdAt : (typeof raw.date === "string" ? raw.date : new Date().toISOString())),
    status: (raw.status ?? "Approved") as Review["status"],
    featured: !!raw.featured,
    adminReply: typeof raw.adminReply === "string" ? raw.adminReply : undefined,
  };
}

export function useReviews(): { reviews: Review[]; loading: boolean } {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "reviews"),
      (snap) => {
        const list = snap.docs.map((d) => toReview(d.id, d.data()));
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setReviews(list);
        setLoading(false);
      },
      (err) => {
        console.warn("[reviews] Real-time listener error:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { reviews, loading };
}

export async function createReviewInDB(review: Omit<Review, "id"> & { id?: string }): Promise<string> {
  const id = review.id || `rev-${Date.now()}`;
  await setDoc(doc(db, "reviews", id), {
    ...review,
    id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return id;
}

export async function updateReviewInDB(id: string, updates: Partial<Review>): Promise<void> {
  await updateDoc(doc(db, "reviews", id), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteReviewInDB(id: string): Promise<void> {
  await deleteDoc(doc(db, "reviews", id));
}
