/**
 * cmsKeyToSection
 *
 * Bridges the `data-cms-key="..."` attributes on the live commerce site
 * to the admin's `activeSectionId` system.
 *
 * When the user clicks an annotated element inside the iframe, the
 * commerce site's EditModeOverlay posts a `cms:select` message with the
 * key. The admin looks the key up here to know which section to highlight
 * in the property panel.
 *
 * How to add a new editable element:
 *   1. In `neria_commerce`, add `data-cms-key="some.key"` to the element.
 *   2. Add `some.key` here mapped to the matching `activeSectionId`.
 *   3. The right-side property panel will populate automatically.
 *
 * Section id convention:
 *   - `sec-*`  → homepage section (renders in `homepageSections[]`)
 *   - `pg-*`   → per-page element on a non-homepage route
 *   - `announcements`, `footer`, `navigation`, `popup`, `theme` → singletons
 *
 * Unknown keys still produce a "selected" event, they just map to null
 * and the editor silently ignores them.
 */

export type CmsKeyMap = Record<string, string>;

export const cmsKeyToSection: CmsKeyMap = {
  // ───── Announcement bar ─────
  'announcement.emoji': 'announcements',
  'announcement.message': 'announcements',
  'announcement.linkText': 'announcements',

  // ───── Promotional popup ─────
  'popup.title': 'popup',
  'popup.subtitle': 'popup',
  'popup.description': 'popup',
  'popup.primaryButtonText': 'popup',
  'popup.secondaryButtonText': 'popup',
  'popup.promoCode': 'popup',
  'popup.badgeText': 'popup',

  // ───── Navigation (structured singletons) ─────
  'navigation.logoText': 'navigation',
  'navigation.menuItems.nav-shop.label': 'navigation',
  'navigation.menuItems.nav-new.label': 'navigation',
  'navigation.menuItems.nav-collections.label': 'navigation',
  'navigation.menuItems.nav-community.label': 'navigation',
  'navigation.menuItems.nav-journal.label': 'navigation',
  'navigation.menuItems.nav-about.label': 'navigation',

  // ───── Footer (structured singletons) ─────
  'footer.brandBio': 'footer',
  'footer.copyrightText': 'footer',
  'footer.newsletterHeading': 'footer',
  'footer.newsletterBody': 'footer',

  // ───── Per-page: homepage (pg-home) ─────
  // The commerce site is the source of truth — these keys are added
  // directly to the existing homepage JSX. Editable by the admin via the
  // standard sidebar text editor.
  'pg-home-hero-badge': 'pg-home',
  'pg-home-hero-title-line-1': 'pg-home',
  'pg-home-hero-title-line-2': 'pg-home',
  'pg-home-hero-description': 'pg-home',
  'pg-home-hero-cta-shop': 'pg-home',
  'pg-home-hero-cta-club': 'pg-home',
  'pg-home-trust-card-1-title': 'pg-home',
  'pg-home-trust-card-1-body': 'pg-home',
  'pg-home-trust-card-2-title': 'pg-home',
  'pg-home-trust-card-2-body': 'pg-home',
  'pg-home-trust-card-3-title': 'pg-home',
  'pg-home-trust-card-3-body': 'pg-home',
  'pg-home-catalog-badge': 'pg-home',
  'pg-home-catalog-title-line-1': 'pg-home',
  'pg-home-catalog-title-line-2': 'pg-home',
  'pg-home-catalog-body': 'pg-home',
  'pg-home-newsletter-badge': 'pg-home',
  'pg-home-newsletter-title-line-1': 'pg-home',
  'pg-home-newsletter-title-line-2': 'pg-home',
  'pg-home-newsletter-body': 'pg-home',
  'pg-home-newsletter-success': 'pg-home',
  'pg-home-newsletter-unsubscribe': 'pg-home',
  'pg-home-newsletter-input-placeholder': 'pg-home',
  'pg-home-note-to-self': 'pg-home',
  'pg-home-note-line-1': 'pg-home',
  'pg-home-note-line-2': 'pg-home',
  'pg-home-note-line-3': 'pg-home',

  // ───── Per-page: nav (pg-nav) ─────
  'pg-nav-top-banner': 'pg-nav',
  'pg-nav-top-banner-code-prefix': 'pg-nav',
  'pg-nav-top-banner-code': 'pg-nav',
  'pg-nav-brand-italic': 'pg-nav',
  'pg-nav-brand-caps': 'pg-nav',
  'pg-nav-link-shop': 'pg-nav',
  'pg-nav-link-trending': 'pg-nav',
  'pg-nav-link-bundles': 'pg-nav',
  'pg-nav-link-shop-mobile': 'pg-nav',
  'pg-nav-link-trending-mobile': 'pg-nav',
  'pg-nav-link-bundles-mobile': 'pg-nav',
  'pg-nav-search-placeholder': 'pg-nav',
  'pg-nav-signin-cta': 'pg-nav',
  'pg-nav-mobile-signin': 'pg-nav',
  'pg-nav-mobile-bag': 'pg-nav',

  // ───── Per-page: footer (pg-footer) ─────
  'pg-footer-brand-italic': 'pg-footer',
  'pg-footer-brand-caps': 'pg-footer',
  'pg-footer-brand-bio': 'pg-footer',
  'pg-footer-brand-tag-1': 'pg-footer',
  'pg-footer-brand-tag-2': 'pg-footer',
  'pg-footer-col-shop-title': 'pg-footer',
  'pg-footer-col-shop-link-1': 'pg-footer',
  'pg-footer-col-shop-link-2': 'pg-footer',
  'pg-footer-col-shop-link-3': 'pg-footer',
  'pg-footer-col-shop-link-4': 'pg-footer',
  'pg-footer-col-care-title': 'pg-footer',
  'pg-footer-col-care-link-1': 'pg-footer',
  'pg-footer-col-care-link-2': 'pg-footer',
  'pg-footer-col-care-link-3': 'pg-footer',
  'pg-footer-col-care-link-4': 'pg-footer',
  'pg-footer-newsletter-title': 'pg-footer',
  'pg-footer-newsletter-body': 'pg-footer',
  'pg-footer-tag-shipping': 'pg-footer',
  'pg-footer-tag-secure': 'pg-footer',
  'pg-footer-copyright': 'pg-footer',

  // ───── Per-page: shop ─────
  'pg-shop-header-badge': 'pg-shop',
  'pg-shop-header-title': 'pg-shop',
  'pg-shop-header-subtitle': 'pg-shop',
  'pg-shop-cat-all': 'pg-shop',
  'pg-shop-cat-hoodies': 'pg-shop',
  'pg-shop-cat-tops': 'pg-shop',
  'pg-shop-cat-dresses': 'pg-shop',
  'pg-shop-cat-bags': 'pg-shop',
  'pg-shop-cat-accessories': 'pg-shop',
  'pg-shop-cat-stationery': 'pg-shop',
  'pg-shop-cat-home': 'pg-shop',
  'pg-shop-sort-featured': 'pg-shop',
  'pg-shop-sort-price-asc': 'pg-shop',
  'pg-shop-sort-price-desc': 'pg-shop',
  'pg-shop-sort-rating': 'pg-shop',
  'pg-shop-filter-btn': 'pg-shop',
  'pg-shop-filter-price-label': 'pg-shop',
  'pg-shop-filter-reset': 'pg-shop',
  'pg-shop-empty-title': 'pg-shop',
  'pg-shop-empty-cta': 'pg-shop',
  'pg-shop-error-title': 'pg-shop',

  // ───── Per-page: product ─────
  'pg-product-reviews-count': 'pg-product',
  'pg-product-color-label': 'pg-product',
  'pg-product-size-label': 'pg-product',
  'pg-product-size-guide-cta': 'pg-product',
  'pg-product-size-guide-title': 'pg-product',
  'pg-product-size-guide-body': 'pg-product',
  'pg-product-size-guide-foot': 'pg-product',
  'pg-product-packing': 'pg-product',
  'pg-product-added': 'pg-product',
  'pg-product-add-to-bag': 'pg-product',
  'pg-product-trust-shipping': 'pg-product',
  'pg-product-trust-quality': 'pg-product',
  'pg-product-trust-returns': 'pg-product',
  'pg-product-acc-details': 'pg-product',
  'pg-product-acc-shipping': 'pg-product',
  'pg-product-shipping-line-1': 'pg-product',
  'pg-product-shipping-line-2': 'pg-product',
  'pg-product-shipping-line-3': 'pg-product',
  'pg-product-pair-eyebrow': 'pg-product',
  'pg-product-pair-title': 'pg-product',
  'pg-product-pair-body': 'pg-product',
  'pg-product-related-title': 'pg-product',

  // ───── Per-page: cart ─────
  'pg-cart-title': 'pg-cart',
  'pg-cart-subtitle': 'pg-cart',
  'pg-cart-continue': 'pg-cart',
  'pg-cart-gift-note': 'pg-cart',
  'pg-cart-summary-title': 'pg-cart',
  'pg-cart-promo-placeholder': 'pg-cart',
  'pg-cart-promo-apply': 'pg-cart',
  'pg-cart-summary-subtotal': 'pg-cart',
  'pg-cart-summary-discount': 'pg-cart',
  'pg-cart-summary-shipping': 'pg-cart',
  'pg-cart-summary-shipping-free': 'pg-cart',
  'pg-cart-summary-total': 'pg-cart',
  'pg-cart-checkout-cta': 'pg-cart',
  'pg-cart-secure-checkout': 'pg-cart',
  'pg-cart-empty-title': 'pg-cart',
  'pg-cart-empty-body': 'pg-cart',
  'pg-cart-empty-cta': 'pg-cart',

  // ───── Per-page: checkout ─────
  'pg-checkout-step-contact': 'pg-checkout',
  'pg-checkout-step-delivery': 'pg-checkout',
  'pg-checkout-step-payment': 'pg-checkout',
  'pg-checkout-step-review': 'pg-checkout',
  'pg-checkout-summary-title': 'pg-checkout',
  'pg-checkout-promo-discount': 'pg-checkout',
  'pg-checkout-delivery-label': 'pg-checkout',
  'pg-checkout-total-label': 'pg-checkout',
  'pg-checkout-confirming-title': 'pg-checkout',
  'pg-checkout-confirming-body': 'pg-checkout',
  'pg-checkout-review-title': 'pg-checkout',
  'pg-checkout-review-body': 'pg-checkout',
  'pg-checkout-fail-title': 'pg-checkout',
  'pg-checkout-fail-body': 'pg-checkout',
  'pg-checkout-fail-try-again': 'pg-checkout',
  'pg-checkout-fail-edit-shipping': 'pg-checkout',

  // ───── Per-page: account ─────
  'pg-account-loading': 'pg-account',
  'pg-account-verification-title': 'pg-account',
  'pg-account-orders-title': 'pg-account',
  'pg-account-orders-body': 'pg-account',
  'pg-account-orders-cta': 'pg-account',

  // ───── Per-page: trending ─────
  'pg-trending-header-eyebrow': 'pg-trending',
  'pg-trending-header-title': 'pg-trending',
  'pg-trending-header-body': 'pg-trending',
  'pg-trending-explore-cta': 'pg-trending',
  'pg-trending-tag-all': 'pg-trending',
  'pg-trending-tag-tops': 'pg-trending',
  'pg-trending-tag-bags': 'pg-trending',
  'pg-trending-tag-accessories': 'pg-trending',

  // ───── Per-page: auth ─────
  'pg-auth-loading': 'pg-auth',
  'pg-auth-signin-welcome-title': 'pg-auth',
  'pg-auth-signin-welcome-body': 'pg-auth',
  'pg-auth-signin-continue-shopping': 'pg-auth',
  'pg-auth-signup-welcome-title': 'pg-auth',
  'pg-auth-signup-welcome-body': 'pg-auth',
  'pg-auth-signup-welcome-code': 'pg-auth',
  'pg-auth-reset-inbox-title': 'pg-auth',
  'pg-auth-reset-inbox-body': 'pg-auth',
  'pg-auth-form-title': 'pg-auth',
  'pg-auth-form-subtitle': 'pg-auth',
  'pg-auth-google-cta': 'pg-auth',
  'pg-auth-submit-cta': 'pg-auth',

  // ───── Per-page: orders ─────
  'pg-orders-loading': 'pg-orders',
  'pg-orders-title': 'pg-orders',
  'pg-orders-subtitle': 'pg-orders',
  'pg-orders-back-account': 'pg-orders',
  'pg-orders-search-placeholder': 'pg-orders',
  'pg-orders-empty-heading': 'pg-orders',
  'pg-orders-empty-body': 'pg-orders',
  'pg-orders-empty-cta': 'pg-orders',
  'pg-orders-error-title': 'pg-orders',
  'pg-orders-error-body': 'pg-orders',
  'pg-orders-error-cta': 'pg-orders',

  // ───── Per-page: order detail ─────
  'pg-order-loading': 'pg-order',
  'pg-order-notfound-title': 'pg-order',
  'pg-order-notfound-body': 'pg-order',
  'pg-order-notfound-cta': 'pg-order',
  'pg-order-welcome': 'pg-order',
  'pg-order-welcome-body': 'pg-order',
  'pg-order-welcome-cta': 'pg-order',
  'pg-order-success-title': 'pg-order',
  'pg-order-success-body': 'pg-order',
  'pg-order-label': 'pg-order',
  'pg-order-eta': 'pg-order',
  'pg-order-shipping-label': 'pg-order',
  'pg-order-payment-label': 'pg-order',
  'pg-order-payment-status': 'pg-order',
  'pg-order-total-label': 'pg-order',
  'pg-order-dust-bag-note': 'pg-order',
  'pg-order-track-cta': 'pg-order',
  'pg-order-shop-cta': 'pg-order',

  // ───── Per-page: order track ─────
  'pg-ordertrack-title': 'pg-orderTrack',
  'pg-ordertrack-body': 'pg-orderTrack',
  'pg-ordertrack-input-placeholder': 'pg-orderTrack',
};

/**
 * Inverse lookup: given a section id, return the keys that map to it.
 * Used by the property panel to render a "Currently editing on the
 * page" hint.
 */
export function sectionToCmsKeys(sectionId: string): string[] {
  return Object.entries(cmsKeyToSection)
    .filter(([, sid]) => sid === sectionId)
    .map(([key]) => key);
}

/**
 * The "generic" section id used when an unknown key is clicked. We don't
 * currently have one in the existing schema, so this returns null and the
 * editor silently ignores unknown keys.
 *
 * Recognised dynamic prefixes (matched by `startsWith`):
 *   - `pg-<page>-*` → `<page>` (e.g. `pg-shop-cat-all` → `pg-shop`,
 *     `pg-product-add-to-bag` → `pg-product`, `pg-order-welcome` → `pg-order`,
 *     `pg-ordertrack-title` → `pg-ordertrack`)
 *   - `navigation.menuItems.*.label` → `navigation`
 *   - `footer.*.*.label` (any column / link id combo) → `footer`
 *
 * Anything else that isn't in the static map returns null and the editor
 * silently ignores it.
 */
export function resolveCmsKey(key: string): string | null {
  if (cmsKeyToSection[key]) return cmsKeyToSection[key];
  if (key.startsWith('pg-')) {
    // Strip the `pg-` prefix and take the next `-`-separated segment as
    // the section id. E.g. `pg-shop-cat-all` → `pg-shop`,
    // `pg-order-welcome-cta` → `pg-order`, `pg-ordertrack-title` →
    // `pg-ordertrack`. The remainder (everything after the section id) is
    // the field name on the page text config.
    const rest = key.slice(3);
    const dashIdx = rest.indexOf('-');
    if (dashIdx > 0) {
      return rest.slice(0, dashIdx);
    }
    return rest; // e.g. `pg-home` with no suffix
  }
  if (key.startsWith('navigation.menuItems.') && key.endsWith('.label')) {
    return 'navigation';
  }
  if (key.startsWith('footer.') && key.endsWith('.label')) {
    return 'footer';
  }
  return null;
}

/**
 * Given a `pg-<page>-<field>` key, return the `<page>` and `<field>` parts.
 * Returns null if the key is not a per-page text key.
 *
 * E.g. `pg-shop-cat-all` → `{ page: 'shop', field: 'cat-all' }`
 *      `pg-order-welcome-cta` → `{ page: 'order', field: 'welcome-cta' }`
 *      `pg-ordertrack-title` → `{ page: 'orderTrack', field: 'title' }`
 */
export function splitPageTextKey(key: string): { page: string; field: string } | null {
  if (!key.startsWith('pg-')) return null;
  const rest = key.slice(3);
  const dashIdx = rest.indexOf('-');
  if (dashIdx <= 0) return null;
  return { page: rest.slice(0, dashIdx), field: rest.slice(dashIdx + 1) };
}
