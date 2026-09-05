"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./client";
import type { Role } from "@/src/lib/rbac";

/**
 * Shape of a Neria staff / customer profile doc in `users/{uid}`.
 *
 * The storefront's `onUserCreate` Cloud Function creates the doc with
 * `{name, email, photoURL, createdAt}`; the admin can layer a `role`
 * on top via `setUserRole()`.
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL: string | null;
  role: Role | null;
  createdAt: number | null;
  // Free-form bag of any other fields the storefront might write
  // (rewardsCode, lastOrderAt, etc.) — surfaced read-only to the admin.
  extras: Record<string, unknown>;
}

function toUserProfile(id: string, raw: DocumentData): UserProfile {
  const known = ["name", "email", "photoURL", "role", "createdAt"];
  const extras: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw ?? {})) {
    if (!known.includes(k)) extras[k] = v;
  }
  const createdAtMs =
    raw?.createdAt?.toMillis?.() ??
    (typeof raw?.createdAt === "number" ? raw.createdAt : null);
  return {
    id,
    name: typeof raw?.name === "string" ? raw.name : "",
    email: typeof raw?.email === "string" ? raw.email : "",
    photoURL:
      typeof raw?.photoURL === "string" && raw.photoURL
        ? raw.photoURL
        : null,
    role: (raw?.role as Role | undefined) ?? null,
    createdAt: createdAtMs,
    extras,
  };
}

/** One-shot fetch of a user profile. Returns null if the doc doesn't exist. */
export async function getUserProfile(
  uid: string,
): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return toUserProfile(snap.id, snap.data());
}

/**
 * Subscribes to a single user profile. Returns `null` while loading or
 * if the doc is missing.
 */
export function useUserProfile(uid: string | null): {
  profile: UserProfile | null;
  loading: boolean;
} {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = onSnapshot(doc(db, "users", uid), (snap) => {
      setProfile(snap.exists() ? toUserProfile(snap.id, snap.data()) : null);
      setLoading(false);
    });
    return () => unsub();
  }, [uid]);

  return { profile, loading };
}

/**
 * Subscribes to the full list of users (staff + customers).
 *
 * For "customers only" views, pass a role filter — Firestore can't
 * `where("role", "==", null)` directly, so we filter in-memory.
 */
export function useUsers(filter?: {
  staffOnly?: boolean;
  customersOnly?: boolean;
}): { users: UserProfile[]; loading: boolean } {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "users"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        let list = snap.docs.map((d) => toUserProfile(d.id, d.data()));
        if (filter?.staffOnly) {
          list = list.filter(
            (u) =>
              u.role != null &&
              [
                "super_admin",
                "order_manager",
                "inventory_manager",
                "marketing_manager",
                "customer_support",
                "finance_viewer",
                "store_manager",
              ].includes(u.role),
          );
        } else if (filter?.customersOnly) {
          list = list.filter(
            (u) => u.role == null || u.role === "customer",
          );
        }
        list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        setUsers(list);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, [filter?.staffOnly, filter?.customersOnly]);

  return { users, loading };
}

/** Assigns a role to a user. Super-admin only — enforced in the UI. */
export async function setUserRole(uid: string, role: Role | null) {
  await setDoc(
    doc(db, "users", uid),
    {
      role,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/**
 * Looks up a user by email so the grant-admin script (or a support
 * flow) can resolve an address into a uid without round-tripping
 * through the Firebase Admin SDK.
 *
 * Firestore can't query by email efficiently on its own, so this
 * walks `users/` once and matches in memory. Fine for our scale
 * (a few hundred customers); if that grows, add a top-level
 * `usersByEmail/{lowerEmail}` index doc.
 */
export async function findUserByEmail(
  email: string,
): Promise<UserProfile | null> {
  const target = email.trim().toLowerCase();
  const snap = await getDocs(collection(db, "users"));
  for (const d of snap.docs) {
    const data = d.data();
    if (typeof data?.email === "string" && data.email.toLowerCase() === target) {
      return toUserProfile(d.id, data);
    }
  }
  return null;
}

/** Convenience: returns true if a user holds a staff role. */
export function isStaff(profile: UserProfile | null): boolean {
  return (
    !!profile?.role &&
    profile.role !== "customer"
  );
}

/** Convenience: returns true if a user is a super-admin. */
export function isSuperAdmin(profile: UserProfile | null): boolean {
  return profile?.role === "super_admin";
}
