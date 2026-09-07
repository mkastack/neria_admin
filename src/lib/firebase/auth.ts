"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User,
  type UserCredential,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./client";

const googleProvider = new GoogleAuthProvider();

export interface AuthResult {
  user: User;
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult> {
  const cred: UserCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return { user: cred.user };
}

export async function signInWithGoogle(): Promise<AuthResult> {
  const cred = await signInWithPopup(auth, googleProvider);
  return { user: cred.user };
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Sends a password-reset email using the Cloud Function deployed from
 * `neria_commerce/functions`. Mirrors the storefront's flow so admins
 * see the same branded email.
 */
export async function requestAdminPasswordReset(
  email: string,
): Promise<void> {
  // Defer-import to avoid pulling functions at module load when not used.
  const { functions } = await import("./client");
  const { httpsCallable } = await import("firebase/functions");
  const callable = httpsCallable<
    { email: string },
    { success: boolean }
  >(functions, "requestPasswordReset");
  await callable({ email });
}

/**
 * Subscribes to the currently signed-in Firebase Auth user.
 *
 * Returns `{ user: null, loading: true }` on first render and
 * `{ user: null, loading: false }` after the initial auth state
 * resolution if the visitor is signed out.
 *
 * The Firestore-side `users/{uid}.role` (and the `admin` custom
 * claim) are surfaced separately via `useCurrentStaff` so this hook
 * stays cheap and synchronous.
 */
export function useAuthUser(): { user: User | null; loading: boolean } {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, loading };
}

/**
 * Returns `true` once we've confirmed the signed-in user holds the
 * `admin: true` custom claim. Auth tokens are force-refreshed on
 * mount so a recently granted claim (via `npm run grant:admin`)
 * shows up without a hard re-login.
 */
export function useIsAdmin(): {
  isAdmin: boolean;
  loading: boolean;
  user: User | null;
} {
  const { user, loading } = useAuthUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setIsAdmin(false);
      setResolved(true);
      return;
    }

    // Defer-import firestore helpers to avoid cycles
    let unsubUserDoc: (() => void) | null = null;

    async function checkAccess() {
      try {
        // 1. Check custom claim token
        const token = await user!.getIdToken(/* forceRefresh */ true);
        const claims = JSON.parse(atob(token.split(".")[1] ?? ""));
        if (claims.admin) {
          if (!cancelled) {
            setIsAdmin(true);
            setResolved(true);
          }
          return;
        }
      } catch (_) {}

      // 2. Real-time check of users/{uid} doc
      try {
        const { db } = await import("./client");
        const { doc, onSnapshot } = await import("firebase/firestore");
        unsubUserDoc = onSnapshot(
          doc(db, "users", user!.uid),
          (snap) => {
            if (cancelled) return;
            const data = snap.data();
            const role = (typeof data?.role === "string" ? data.role : "").toLowerCase();
            const hasAdminRole = [
              "super_admin",
              "store_manager",
              "order_manager",
              "inventory_manager",
              "marketing_manager",
              "customer_support",
              "finance_viewer",
              "admin",
            ].includes(role);

            if (hasAdminRole) {
              setIsAdmin(true);
              setResolved(true);
            } else {
              // Also check staff collection by email
              import("firebase/firestore").then(({ collection, getDocs, query, where }) => {
                const userEmail = (user!.email || "").toLowerCase().trim();
                if (!userEmail) {
                  setIsAdmin(false);
                  setResolved(true);
                  return;
                }
                const q = query(collection(db, "staff"), where("email", "==", userEmail));
                getDocs(q)
                  .then((s) => {
                    if (cancelled) return;
                    setIsAdmin(!s.empty);
                    setResolved(true);
                  })
                  .catch(() => {
                    if (cancelled) return;
                    setIsAdmin(false);
                    setResolved(true);
                  });
              });
            }
          },
          () => {
            if (!cancelled) {
              setIsAdmin(false);
              setResolved(true);
            }
          }
        );
      } catch {
        if (!cancelled) {
          setIsAdmin(false);
          setResolved(true);
        }
      }
    }

    setResolved(false);
    void checkAccess();

    return () => {
      cancelled = true;
      if (unsubUserDoc) unsubUserDoc();
    };
  }, [user]);

  return {
    isAdmin: resolved && isAdmin,
    loading: loading || !resolved,
    user,
  };
}

/**
 * Maps raw Firebase Auth error codes to friendly, on-brand copy.
 * Mirrors `neria_commerce/app/lib/firebase/auth.ts` so both apps
 * surface the same wording.
 */
export function friendlyAuthError(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "That email already has a Neria account — try signing in instead.";
    case "auth/invalid-email":
      return "That email address doesn't look quite right.";
    case "auth/weak-password":
      return "Please choose a password with at least 6 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "That email and password combination doesn't match our records.";
    case "auth/too-many-requests":
      return "Too many attempts — please wait a moment and try again.";
    case "auth/popup-closed-by-user":
      return "The sign-in window was closed before finishing.";
    default:
      return "Something went wrong — please try again in a moment.";
  }
}

// Re-export for callers that want the `createUserWithEmailAndPassword`
// helper to provision a brand-new staff account from the admin app
// (currently unused — staff are typically created via the storefront
// sign-up flow — but kept here for completeness).
export async function createStaffAccount(
  email: string,
  password: string,
): Promise<AuthResult> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return { user: cred.user };
}
