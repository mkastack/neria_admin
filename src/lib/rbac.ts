/**
 * Role-Based Access Control (RBAC) for the Neria admin dashboard.
 *
 * The Firestore rules still gate writes on the `admin` custom claim
 * (a hard server-side boundary). This module layers *finer-grained*
 * per-role gating on top of that, in the admin UI, so each staff
 * member only sees and does the things their job requires.
 *
 * Roles are stored in `users/{uid}.role` (see `src/lib/firebase/users.ts`)
 * and assigned by the super admin via the Staff / Roles pages.
 *
 * - The super admin can do everything, including editing roles and
 *   viewing the activity log.
 * - The store manager can do everything except the staff/roles page
 *   and the activity log.
 * - Other roles are scoped to their area (orders, inventory, marketing,
 *   customer support, finance).
 */

export const STAFF_ROLES = [
  "super_admin",
  "store_manager",
  "order_manager",
  "inventory_manager",
  "marketing_manager",
  "customer_support",
  "finance_viewer",
] as const;

export type Role = (typeof STAFF_ROLES)[number] | "customer";

export const ALL_ROLES: Role[] = [
  "customer",
  ...STAFF_ROLES,
];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  store_manager: "Store Manager",
  order_manager: "Order Manager",
  inventory_manager: "Inventory Manager",
  marketing_manager: "Marketing Manager",
  customer_support: "Customer Support",
  finance_viewer: "Finance Viewer",
  customer: "Customer",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  super_admin:
    "Full access — can publish storefront, manage staff, and view audit logs.",
  store_manager:
    "Full operational access, but cannot edit staff roles or see audit logs.",
  order_manager:
    "Orders, refunds, returns, customers (read), and shipping zones.",
  inventory_manager:
    "Products and inventory (add/edit stock and catalog).",
  marketing_manager:
    "Storefront CMS, categories, journal, reviews, and newsletter.",
  customer_support:
    "Customers and orders (limited) — replies, refunds, returns.",
  finance_viewer:
    "Read-only on finance, transactions, reports, and analytics.",
  customer: "Regular customer (no admin access).",
};

/** A permission is a verb:resource pair. Keep this list small and stable. */
export type Action =
  | "dashboard:read"
  | "orders:read"
  | "orders:write"
  | "orders:fulfill"
  | "products:read"
  | "products:write"
  | "customers:read"
  | "customers:write"
  | "discounts:read"
  | "discounts:write"
  | "cms:read"
  | "cms:publish"
  | "categories:write"
  | "navigation:write"
  | "theme:write"
  | "media:write"
  | "journal:write"
  | "reviews:moderate"
  | "newsletter:write"
  | "campaigns:write"
  | "shipping:write"
  | "finance:read"
  | "analytics:read"
  | "reports:read"
  | "activity:read"
  | "staff:read"
  | "roles:write"
  | "settings:write";

/**
 * Permission matrix — the single source of truth for what each role
 * can do. Used by:
 *   - the sidebar to hide nav items
 *   - the `<Can>` component to hide buttons
 *   - the per-page guards to redirect when role lacks access
 */
export const PERMISSIONS: Record<Role, Action[]> = {
  super_admin: [
    "dashboard:read",
    "orders:read",
    "orders:write",
    "orders:fulfill",
    "products:read",
    "products:write",
    "customers:read",
    "customers:write",
    "discounts:read",
    "discounts:write",
    "cms:read",
    "cms:publish",
    "categories:write",
    "navigation:write",
    "theme:write",
    "media:write",
    "journal:write",
    "reviews:moderate",
    "newsletter:write",
    "campaigns:write",
    "shipping:write",
    "finance:read",
    "analytics:read",
    "reports:read",
    "activity:read",
    "staff:read",
    "roles:write",
    "settings:write",
  ],
  store_manager: [
    "dashboard:read",
    "orders:read",
    "orders:write",
    "orders:fulfill",
    "products:read",
    "products:write",
    "customers:read",
    "customers:write",
    "discounts:read",
    "discounts:write",
    "cms:read",
    "cms:publish",
    "categories:write",
    "navigation:write",
    "theme:write",
    "media:write",
    "journal:write",
    "reviews:moderate",
    "newsletter:write",
    "campaigns:write",
    "shipping:write",
    "finance:read",
    "analytics:read",
    "reports:read",
    "settings:write",
    // No activity:read, staff:read, or roles:write — owner-only.
  ],
  order_manager: [
    "dashboard:read",
    "orders:read",
    "orders:write",
    "orders:fulfill",
    "customers:read",
    "shipping:write",
    "analytics:read",
  ],
  inventory_manager: [
    "dashboard:read",
    "products:read",
    "products:write",
    "analytics:read",
  ],
  marketing_manager: [
    "dashboard:read",
    "products:read",
    "cms:read",
    "cms:publish",
    "categories:write",
    "navigation:write",
    "theme:write",
    "media:write",
    "journal:write",
    "reviews:moderate",
    "newsletter:write",
    "campaigns:write",
  ],
  customer_support: [
    "dashboard:read",
    "orders:read",
    "customers:read",
    "customers:write",
  ],
  finance_viewer: [
    "dashboard:read",
    "finance:read",
    "analytics:read",
    "reports:read",
  ],
  customer: [],
};

/** Returns true if the role is permitted to perform the action. */
export function can(role: Role | null | undefined, action: Action): boolean {
  if (!role) return false;
  return PERMISSIONS[role]?.includes(action) ?? false;
}

/** Returns true if the role holds any of the listed actions. */
export function canAny(
  role: Role | null | undefined,
  actions: Action[],
): boolean {
  return actions.some((a) => can(role, a));
}

/** Maps an admin sidebar href to the permission needed to see it. */
export const NAV_PERMISSIONS: Record<string, Action> = {
  "/admin": "dashboard:read",
  "/admin/orders": "orders:read",
  "/admin/products": "products:read",
  "/admin/categories": "categories:write",
  "/admin/inventory": "products:read",
  "/admin/customers": "customers:read",
  "/admin/discounts": "discounts:read",
  "/admin/gift-cards": "discounts:read",
  "/admin/website": "cms:read",
  "/admin/website/editor": "cms:publish",
  "/admin/website/homepage": "cms:publish",
  "/admin/website/pages": "cms:publish",
  "/admin/website/navigation": "navigation:write",
  "/admin/website/announcements": "cms:publish",
  "/admin/website/popups": "cms:publish",
  "/admin/website/brand": "cms:publish",
  "/admin/website/theme": "theme:write",
  "/admin/website/footer": "cms:publish",
  "/admin/website/seo": "cms:publish",
  "/admin/website/media": "media:write",
  "/admin/website/history": "cms:read",
  "/admin/payments": "finance:read",
  "/admin/transactions": "finance:read",
  "/admin/refunds": "orders:write",
  "/admin/shipping": "shipping:write",
  "/admin/delivery": "orders:read",
  "/admin/returns": "orders:write",
  "/admin/campaigns": "campaigns:write",
  "/admin/promotions": "campaigns:write",
  "/admin/banners": "cms:publish",
  "/admin/reviews": "reviews:moderate",
  "/admin/community": "reviews:moderate",
  "/admin/newsletter": "newsletter:write",
  "/admin/analytics": "analytics:read",
  "/admin/reports": "reports:read",
  "/admin/finance": "finance:read",
  "/admin/staff": "staff:read",
  "/admin/roles": "roles:write",
  "/admin/activity": "activity:read",
  "/admin/notifications": "dashboard:read",
  "/admin/settings": "settings:write",
};
