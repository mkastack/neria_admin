# Neria Admin — Operations Dashboard

Internal dashboard for [Neria Collective](https://neriacollective.com). Lets non-developers (the founder, ops, marketing) manage **orders, products, customers, categories, journal articles, promo codes, media, the storefront content, and staff roles** without touching code.

Built with **Next.js 16** (App Router), **Firebase Auth / Firestore / Storage / Cloud Functions**, **Tailwind CSS v4**, and **Framer Motion**.

> The storefront at `../neria_commerce` is the source of truth for *layout, structure, motion, fonts, and color tokens*. This app only owns *content* (text, images, button labels, theme overrides, etc.) — it never re-implements the homepage, it edits the data the storefront reads.

---

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in your Firebase keys
npm run dev
```

The admin runs at <http://localhost:3001> (or whatever port you choose — keep it different from the storefront so you can run both side-by-side). Open it, sign in with an email that has the `admin: true` custom claim.

### Environment variables

Create `.env.local`:

| Key | Where to find it |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | same |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | same |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | same |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | same |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | same |

These are the same keys as the storefront — both apps point at the same Firebase project.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the local dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the project |
| `npm run typecheck` | TypeScript-only check |

Seed scripts and the `grant:admin` command live in **`neria_commerce/scripts/`** — see that repo's README for the full list.

---

## Roles & permissions

The admin uses a **two-layer** permission model:

1. **Custom claim** (`admin: true` on the Firebase Auth user) — the security boundary. Without this, Firestore rejects all writes regardless of what the UI does.
2. **Role** (`users/{uid}.role`) — the UX boundary. Each role hides nav items and disables actions the user shouldn't have.

| Role | What they can do |
|---|---|
| `super_admin` | Everything (roles, staff, all admin pages) |
| `store_manager` | Everything *except* roles + activity log |
| `order_manager` | Orders, refunds, returns, shipping, customer read |
| `inventory_manager` | Products, inventory, collections |
| `marketing_manager` | CMS (homepage, footer, navigation, theme, SEO, popups, announcements), categories, journal, reviews moderation, newsletter |
| `customer_support` | Customers, orders (limited), returns |
| `finance_viewer` | Read-only on finance, transactions, analytics |

The role enum, permission matrix, and `<Can>` component live in `src/lib/rbac.ts` and `src/components/auth/Can.tsx`.

### Promote yourself to super admin

From the `neria_commerce` directory:

```bash
npm run grant:admin -- you@example.com
```

This sets the `admin: true` custom claim **and** writes `role: "super_admin"` to `users/{uid}`. You'll need to sign out and back in (or call `getIdToken(true)`) for the new claims to take effect on the client.

---

## Project structure

```
app/
  admin/                  ← All dashboard routes
    login/                ← Email + Google sign-in
    forgot-password/
    page.tsx              ← Dashboard overview
    orders/               ← Order list + detail
    products/             ← Product list, new, edit
    customers/            ← Customer list + detail
    collections/
    discounts/            ← Promo codes
    website/              ← Storefront CMS
      editor/             ← Visual editor (the heart of the app)
      categories/         ← Editable category CRUD
      brand/, navigation/, footer/, theme/, seo/, announcements/, popups/, pages/, history/, media/
    roles/                ← Staff + role management
    activity/             ← Audit log
    settings/             ← Admin preferences
  preview/                ← Public-facing preview of the storefront
src/
  lib/
    firebase/             ← Firebase SDK wrappers
    rbac.ts               ← Role + permission matrix
    cms-defaults.ts       ← The default storefront config (mirrored in commerce)
    context/
      AdminContext.tsx    ← Real-time Firestore subscriptions
      StorefrontCmsContext.tsx ← CMS config + sections + pages
      AuthContext.tsx
  components/
    layout/               ← Sidebar, header, layout shell
    storefront/           ← Content-only preview renderer
    editor/               ← Visual editor panels
    auth/                 ← <Can> component
    ui/                   ← Primitives (StatCard, StatusBadge, EmptyState, …)
```

---

## The visual editor (`/admin/website/editor`)

Three-pane layout:

- **Left sidebar** — section hierarchy. Add, reorder, enable/disable, duplicate, delete sections.
- **Center canvas** — a **content-only preview** of the storefront. Renders the *same* typography and color tokens the real site uses, but only the editable fields (heading, subheading, button text, image, etc.). Layout, motion, hover effects, and decorative chrome are owned by `neria_commerce/app/` and don't show up here — on purpose. The point is "show the admin what their content will look like", not "rebuild the homepage".
- **Right panel** — property inspector for the selected section. Edits auto-save to Firestore with a 1.2s debounce.
- **Top bar** — viewport switcher (desktop / tablet / mobile), preview mode, publish.

When the admin clicks **Publish**, the current config is snapshotted to `cms/publishHistory/list` and `version` is bumped on `cms/config/main`. The storefront picks up the change on its next page load (or sooner if it has the listener open).

---

## Categories

The storefront's category strip is no longer hardcoded. It reads from `cms/categories/items/{slug}` and falls back to the previous list when the doc is empty.

The admin's category editor lives at **`/admin/website/categories`** and supports:

- Rename, re-slug, change image
- Drag-to-reorder via up/down arrows (writes to `position`)
- Show / hide (writes to `visible`)
- Badge text (e.g. "New", "Trending")
- Delete (blocked if `itemCount > 0` so you can't orphan products)

The first time you run the app, run `npm run seed:categories` from the `neria_commerce` directory to load the seven default categories.

---

## Media library

`/admin/website/media` is a real file-upload library now. Uploads go to Firebase Storage at `media/{id}.{ext}` and write a matching meta doc to Firestore. The storefront reads the meta doc to find the URL.

Constraints (enforced in `storage.rules`):

- ≤ 10 MB per file
- `image/*` or `video/*` only
- Admin claim required to write

---

## Security

- **All writes** go through `useStorefrontCms()` or the helper modules in `src/lib/firebase/`. The Firestore rules (in `neria_commerce/firestore.rules`) gate every collection.
- **No role in the user doc** can grant write access the custom claim doesn't already allow. A `finance_viewer` cannot write to `products/` even if they tamper with the user doc.
- **Never** read or display Firebase service-account keys in client code. Seed scripts and the grant-admin command use the Admin SDK from a Node process — keep them out of `app/`.

---

## What's intentionally NOT here

- **Analytics dashboards** (GA4 / Mixpanel integrations, big-data charts) — out of scope for this round.
- **Email/push notification fan-out** — only transactional order emails via the existing SMTP.
- **Drag-and-drop image cropping** — admin uploads are stored as-is. Cropping happens in the design tool before upload.
- **Multi-store / multi-tenant** — single-tenant.

---

## License

Proprietary — Neria Collective, all rights reserved.
