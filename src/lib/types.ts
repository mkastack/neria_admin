export type OrderStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';
export type FulfillmentStatus = 'Unfulfilled' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
export type DeliveryMethod = 'Standard Delivery' | 'Express Delivery' | 'In-Store Pickup';
export type PaymentMethod = 'Stripe (Card)' | 'Stripe (Apple Pay)' | 'Stripe (Google Pay)' | 'Shop Pay' | 'PayPal' | 'Credit / Debit Card' | 'Bank Transfer';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  variant: string;
  size: string;
  color: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  total: number;
}

export interface TimelineEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  description?: string;
  staffNote?: string;
  icon?: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  createdAt: string;
  items: OrderItem[];
  paymentStatus: OrderStatus;
  fulfillmentStatus: FulfillmentStatus;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: {
    street: string;
    city: string;
    region: string;
    country: string;
    postalCode?: string;
  };
  subtotal: number;
  discount: number;
  discountCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  notes?: string;
  fraudRisk: 'Low' | 'Medium' | 'High';
  timeline: TimelineEvent[];
  tags: string[];
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: 'Dresses' | 'Tops' | 'Sets' | 'Accessories' | 'Hoodies' | 'Other';
  collection: string;
  price: number;
  compareAtPrice?: number;
  cost: number;
  sku: string;
  barcode?: string;
  stock: number;
  lowStockThreshold: number;
  trackQuantity: boolean;
  allowBackorder: boolean;
  status: 'Active' | 'Draft' | 'Archived';
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  salesCount: number;
  revenue: number;
  rating: number;
  reviewsCount: number;
  updatedAt: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  bannerImage: string;
  productsCount: number;
  status: 'Active' | 'Draft' | 'Scheduled';
  sales: number;
  revenue: number;
  updatedAt: string;
  productIds: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  segment: 'New' | 'Returning' | 'VIP' | 'At Risk';
  address: string;
  city: string;
  region: string;
  notes: Array<{ id: string; text: string; author: string; timestamp: string }>;
  tags: string[];
  joinedDate: string;
  wishlistCount: number;
}

export interface Discount {
  id: string;
  code: string;
  type: 'Percentage' | 'Fixed Amount' | 'Free Shipping' | 'Buy X Get Y' | 'Collection Discount';
  value: number;
  minSpend?: number;
  usageCount: number;
  usageLimit?: number;
  status: 'Active' | 'Scheduled' | 'Expired';
  startDate: string;
  endDate?: string;
  applicableTo: 'All Products' | 'Specific Collections' | 'Specific Products';
}

export interface GiftCard {
  id: string;
  code: string;
  customerName?: string;
  customerEmail?: string;
  initialValue: number;
  balance: number;
  status: 'Active' | 'Redeemed' | 'Expired' | 'Disabled';
  createdAt: string;
  expiresAt: string;
}

export interface Transaction {
  id: string;
  transactionNumber: string;
  orderNumber: string;
  customerName: string;
  method: PaymentMethod;
  type: 'Charge' | 'Refund' | 'Adjustment';
  amount: number;
  fee: number;
  net: number;
  status: 'Success' | 'Pending' | 'Failed';
  reference: string;
  date: string;
}

export interface Refund {
  id: string;
  refundNumber: string;
  orderNumber: string;
  customerName: string;
  reason: 'Defective Item' | 'Wrong Size' | 'Customer Changed Mind' | 'Order Cancelled' | 'Late Delivery';
  amount: number;
  status: 'Completed' | 'Pending' | 'Rejected';
  date: string;
  restocked: boolean;
  notes?: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  regions: string[];
  standardRate: number;
  expressRate: number;
  estimatedDelivery: string;
  status: 'Active' | 'Inactive';
}

export interface DeliveryRide {
  id: string;
  trackingNumber: string;
  orderNumber: string;
  customerName: string;
  address: string;
  riderName?: string;
  riderPhone?: string;
  status: 'Awaiting Assignment' | 'Assigned' | 'Picked Up' | 'In Transit' | 'Delivered';
  pickupTime?: string;
  estimatedDelivery: string;
  coordinates: { x: number; y: number };
}

export interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: string[];
  reason: string;
  status: 'Requested' | 'Approved' | 'In Transit' | 'Received' | 'Refunded' | 'Rejected';
  requestedAt: string;
  refundAmount: number;
  images?: string[];
  adminNotes?: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'Email' | 'Banner' | 'Homepage Collection' | 'Promo' | 'Social';
  status: 'Active' | 'Scheduled' | 'Completed' | 'Draft';
  startDate: string;
  endDate: string;
  audience: string;
  revenue: number;
  clicks: number;
  conversionRate: number;
  message: string;
  ctaText: string;
  ctaLink: string;
}

export interface Review {
  id: string;
  productName: string;
  productImage: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Flagged' | 'Hidden';
  featured: boolean;
  adminReply?: string;
}

export interface CommunityPost {
  id: string;
  username: string;
  avatar: string;
  image: string;
  caption: string;
  taggedProducts: string[];
  status: 'Approved' | 'Pending' | 'Featured' | 'Reported';
  likesCount: number;
  date: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string;
  joinedDate: string;
  source: 'Footer Signup' | 'Checkout' | 'Popup Modal' | 'Social Link';
  status: 'Active' | 'Unsubscribed' | 'VIP';
  totalCampaignsReceived: number;
  openRate: number;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Super Admin' | 'Store Manager' | 'Order Manager' | 'Inventory Manager' | 'Marketing Manager' | 'Customer Support' | 'Finance Viewer';
  lastActive: string;
  status: 'Active' | 'Invited' | 'Suspended';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  staffName: string;
  staffAvatar: string;
  action: 'Created' | 'Updated' | 'Deleted' | 'Exported' | 'Fulfilled' | 'Refunded';
  resource: 'Product' | 'Order' | 'Discount' | 'Customer' | 'Settings' | 'Campaign' | 'Inventory';
  description: string;
  ipAddress: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  category: 'Orders' | 'Inventory' | 'Payments' | 'Returns' | 'Reviews' | 'System';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// ==========================================
// STOREFRONT NO-CODE CMS & WEBSITE EDITOR TYPES
// ==========================================

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export type SectionType = 
  | 'hero' 
  | 'new_arrivals' 
  | 'categories' 
  | 'featured_collection' 
  | 'neria_girl' 
  | 'best_sellers' 
  | 'journal' 
  | 'bunny_moment' 
  | 'seen_in_neria' 
  | 'newsletter'
  | 'custom_banner'
  | 'rich_text';

export type BunnyMood = 
  | 'default' 
  | 'happy' 
  | 'shopping' 
  | 'sleeping' 
  | 'love' 
  | 'celebration' 
  | 'empty_cart' 
  | 'wishlist' 
  | 'newsletter' 
  | 'thank_you' 
  | 'seasonal';

export interface BunnyAsset {
  id: string;
  name: string;
  mood: BunnyMood;
  svgIcon?: string;
  imageUrl: string;
  category: string;
  usedIn: string[];
}

export interface MediaAssetItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'icon' | 'bunny' | 'product' | 'campaign';
  sizeBytes: number;
  width: number;
  height: number;
  folder: string;
  altText: string;
  createdAt: string;
  usedInCount: number;
  usedInLocations: string[];
}

export interface AnnouncementItem {
  id: string;
  message: string;
  emoji: string;
  linkText?: string;
  linkUrl?: string;
  bgColor: string;
  textColor: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  priority: number;
}

export interface NavDropdownItem {
  id: string;
  label: string;
  url: string;
  badge?: string;
  image?: string;
}

export interface NavMenuItem {
  id: string;
  label: string;
  url: string;
  highlight?: boolean;
  badge?: string;
  isMegaMenu?: boolean;
  featuredImage?: string;
  featuredTitle?: string;
  featuredSubtitle?: string;
  dropdownItems?: NavDropdownItem[];
}

export interface PopupConfig {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  description: string;
  image: string;
  emoji: string;
  bunnyMood: BunnyMood;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  promoCode?: string;
  bgColor: string;
  textColor: string;
  type: 'newsletter' | 'discount' | 'new_collection' | 'sale' | 'custom';
  trigger: 'instant' | 'delay_5s' | 'scroll_50' | 'exit_intent';
  frequency: 'every_visit' | 'once_per_day' | 'once_per_week' | 'once_ever';
  active: boolean;
}

export interface HeroSectionContent {
  smallLabel: string;
  mainHeading: string;
  headingEmoji: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  desktopImage: string;
  mobileImage: string;
  overlayOpacity: number;
  textPosition: 'left' | 'center' | 'right';
  verticalPosition: 'top' | 'center' | 'bottom';
  headingColor: string;
  descriptionColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  badgeText: string;
  bunnyMood: BunnyMood;
  showBunny: boolean;
}

export interface ProductSectionContent {
  heading: string;
  subtitle: string;
  sourceType: 'automatic' | 'manual' | 'collection';
  automaticRule: 'newest' | 'bestsellers' | 'highest_rated' | 'featured';
  selectedCollectionId?: string;
  selectedProductIds: string[];
  limit: number;
  showPrice: boolean;
  showColor: boolean;
  showWishlist: boolean;
  showQuickAdd: boolean;
  showNewBadge: boolean;
  ctaText?: string;
  ctaLink?: string;
}

export interface CategoryItemConfig {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: number;
  badge?: string;
  url: string;
  visible: boolean;
}

export interface CategoriesSectionContent {
  heading: string;
  subtitle: string;
  categories: CategoryItemConfig[];
}

export interface FeaturedCollectionSectionContent {
  collectionLabel: string;
  collectionName: string;
  description: string;
  primaryImage: string;
  secondaryImage: string;
  buttonText: string;
  buttonLink: string;
  bgColor: string;
  textColor: string;
  layout: 'image_left' | 'image_right' | 'full_width' | 'editorial_split';
  bunnyMood: BunnyMood;
  showBunny: boolean;
}

export interface NeriaGirlItem {
  id: string;
  imageUrl: string;
  customerName: string;
  handle: string;
  caption: string;
  taggedProduct?: string;
  handwrittenNote?: string;
}

export interface NeriaGirlSectionContent {
  heading: string;
  subtitle: string;
  tagline: string;
  bunnyMood: BunnyMood;
  items: NeriaGirlItem[];
}

export interface JournalArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: string;
  status: 'Published' | 'Draft' | 'Scheduled';
}

export interface JournalSectionContent {
  heading: string;
  subtitle: string;
  articleIds: string[];
}

export interface BunnyMomentSectionContent {
  heading: string;
  message: string;
  submessage: string;
  bunnyMood: BunnyMood;
  buttonText: string;
  buttonLink: string;
  bgColor: string;
}

export interface NewsletterSectionContent {
  heading: string;
  description: string;
  inputPlaceholder: string;
  buttonText: string;
  successMessage: string;
  bunnyMood: BunnyMood;
  bgColor: string;
  textColor: string;
}

export interface SectionConfig {
  id: string;
  name: string;
  type: SectionType;
  enabled: boolean;
  position: number;
  content: any; // Type safe casting per section type
}

export interface BrandSettingsConfig {
  brandName: string;
  tagline: string;
  primaryLogoUrl: string;
  secondaryLogoUrl: string;
  faviconUrl: string;
  bunnyLogoUrl: string;
  socialHandles: {
    instagram: string;
    tiktok: string;
    pinterest: string;
    twitter: string;
    youtube: string;
    whatsapp: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    whatsapp: string;
    location: string;
    hours: string;
  };
}

export interface ThemeColorsConfig {
  primary: string; // Search blue / signature pink
  secondary: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  border: string;
  accent: string;
  success: string;
  warning: string;
  sale: string;
  buttonBg: string;
  buttonText: string;
}

export interface TypographyConfig {
  headingFont: string;
  bodyFont: string;
  baseFontSize: number;
  headingScale: 'compact' | 'normal' | 'large';
  buttonCornerRadius: 'square' | 'rounded' | 'pill' | 'soft';
}

export interface FooterColumn {
  id: string;
  title: string;
  links: Array<{ id: string; label: string; url: string }>;
}

export interface FooterConfig {
  brandBio: string;
  columns: FooterColumn[];
  showNewsletter: boolean;
  showSocials: boolean;
  showPaymentMethods: boolean;
  copyrightText: string;
  bottomLinks: Array<{ id: string; label: string; url: string }>;
}

export interface PageBlock {
  id: string;
  type: 'heading' | 'text' | 'image' | 'image_text' | 'faq' | 'size_guide' | 'quote' | 'divider';
  content: any;
}

export interface PageConfig {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: 'Published' | 'Draft';
  lastEdited: string;
  blocks: PageBlock[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface SEOConfig {
  siteTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  ogImage: string;
  keywords: string[];
  googleSiteVerification?: string;
}

export interface PublishVersion {
  id: string;
  versionNumber: number;
  publishedAt: string;
  publishedBy: string;
  changeSummary: string[];
  configSnapshot: StorefrontConfig;
}

export interface StorefrontConfig {
  brand: BrandSettingsConfig;
  theme: {
    colors: ThemeColorsConfig;
    typography: TypographyConfig;
  };
  announcements: {
    enabled: boolean;
    autoRotate: boolean;
    rotationInterval: number;
    items: AnnouncementItem[];
  };
  navigation: {
    logoText: string;
    menuItems: NavMenuItem[];
    searchPlaceholder: string;
  };
  homepageSections: SectionConfig[];
  pages: PageConfig[];
  popup: PopupConfig;
  footer: FooterConfig;
  seo: SEOConfig;
  /**
   * Per-page editable text. Mirrors `PageTextConfig` in
   * `neria_commerce/app/lib/firebase/cms.ts`. Empty by default.
   */
  pageText?: PageTextConfig;
  version: number;
  lastUpdated: string;
}

/**
 * Per-page editable text. Each slot is a free-form key→string map
 * whose keys mirror the `pg-<page>-<field>` annotation suffixes in the
 * commerce site. The admin editor saves values here when the user
 * clicks a `pg-*` element in the iframe and types a new value.
 */
export type PageTextConfig = {
  home?: Record<string, string>;
  nav?: Record<string, string>;
  footer?: Record<string, string>;
  shop?: Record<string, string>;
  product?: Record<string, string>;
  cart?: Record<string, string>;
  checkout?: Record<string, string>;
  account?: Record<string, string>;
  trending?: Record<string, string>;
  auth?: Record<string, string>;
  orders?: Record<string, string>;
  order?: Record<string, string>;
  orderTrack?: Record<string, string>;
  [key: string]: Record<string, string> | undefined;
};
