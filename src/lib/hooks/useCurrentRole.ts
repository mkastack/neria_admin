"use client";

import { useAuthUser, useIsAdmin } from "@/src/lib/firebase/auth";
import { useUserProfile } from "@/src/lib/firebase/users";
import type { Role } from "@/src/lib/rbac";

/**
 * Returns the role for the current user, derived from the
 * `users/{uid}.role` Firestore doc.
 *
 * - `null` while we're still resolving the auth/profile state.
 * - `null` if the user is signed out.
 * - `"customer"` (or another role) once the profile is loaded.
 *
 * Use this in the sidebar and via `<Can>` to gate UI.
 */
export function useCurrentRole(): {
  role: Role | null;
  loading: boolean;
  isAdmin: boolean;
} {
  const { user, loading: authLoading } = useAuthUser();
  const { isAdmin, loading: claimLoading } = useIsAdmin();
  const { profile, loading: profileLoading } = useUserProfile(user?.uid ?? null);

  return {
    role: profile?.role ?? null,
    loading: authLoading || claimLoading || profileLoading,
    isAdmin,
  };
}
