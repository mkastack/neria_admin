"use client";

/**
 * Admin-side Firestore listener for the `newsletter` collection.
 *
 * The commerce Cloud Function (subscribeToNewsletter) writes docs keyed by
 * lowercased email. Each doc has: { email, name?, source, optedIn, updatedAt }.
 * Signed-in users who opt-in via their account page also land here.
 *
 * Firestore rule:  match /newsletter/{email} { allow read, write: if false; }
 * → Direct CLIENT reads are DENIED. Admin reads use the Admin SDK (or we need
 *   to update rules). For now we query `newsletter_admin` (a mirror collection
 *   written by the Cloud Function for admin use), falling back to the raw
 *   `newsletter` collection if the admin SDK has the appropriate claim.
 *
 * FALLBACK STRATEGY: The admin reads `newsletter` with the admin claim.
 * The Firestore rule for newsletter must be opened for admin reads:
 *   allow read: if request.auth != null && request.auth.token.admin == true;
 *
 * That rules update is done in the commerce repo's firestore.rules.
 */

import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./client";

export interface NewsletterDoc {
  id: string;           // document id = lowercased email
  email: string;
  name: string;
  source: string;       // 'footer' | 'homepage' | 'checkout' | 'popup' | 'account' etc.
  optedIn: boolean;
  updatedAt: string;
}

/**
 * Real-time listener for newsletter subscribers (admin only).
 * Requires `admin` custom claim on the auth token.
 */
export function useNewsletterSubscribers(max = 200): {
  subscribers: NewsletterDoc[];
  loading: boolean;
} {
  const [subscribers, setSubscribers] = useState<NewsletterDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "newsletter"), limit(max)),
      (snap) => {
        const docs = snap.docs
          .map((d) => {
            const raw = d.data();
            return {
              id: d.id,
              email: typeof raw.email === "string" ? raw.email : d.id,
              name: typeof raw.name === "string" ? raw.name : "",
              source: typeof raw.source === "string" ? raw.source : "unknown",
              optedIn: raw.optedIn === true,
              updatedAt:
                raw.updatedAt?.toDate?.()?.toISOString?.() ??
                raw.updatedAt ??
                "",
            } as NewsletterDoc;
          })
          .filter((d) => d.optedIn);
        setSubscribers(docs);
        setLoading(false);
      },
      (err) => {
        console.warn("[newsletter] Firestore read failed (needs admin claim):", err.code);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [max]);

  return { subscribers, loading };
}
