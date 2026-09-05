"use client";

import React from "react";
import { useCurrentRole } from "@/src/lib/hooks/useCurrentRole";
import { can, type Action } from "@/src/lib/rbac";

/**
 * Renders `children` only if the current staff role is permitted to
 * perform the given action. Use it to gate buttons, menu items, and
 * any other UI that should disappear for roles lacking permission.
 *
 *   <Can action="orders:write">
 *     <Button>Mark as Shipped</Button>
 *   </Can>
 *
 * Pass `fallback` to render something else when the user lacks
 * permission (e.g. a tooltip explaining why the button is hidden).
 */
export function Can({
  action,
  children,
  fallback = null,
}: {
  action: Action;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { role } = useCurrentRole();
  if (!can(role, action)) return <>{fallback}</>;
  return <>{children}</>;
}

/**
 * Variant for inline conditional rendering in list/map code, where
 * a component wrapper is awkward.
 *
 *   {canCurrent("orders:write") && <Button>...</Button>}
 */
export function useCan(action: Action): boolean {
  const { role } = useCurrentRole();
  return can(role, action);
}
