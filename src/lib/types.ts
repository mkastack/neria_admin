export type OrderStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';
export type FulfillmentStatus = 'Unfulfilled' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
export type DeliveryMethod = 'Standard Delivery' | 'Express Delivery' | 'In-Store Pickup';
export type PaymentMethod = 'MTN Mobile Money' | 'Telecel Cash' | 'Credit / Debit Card' | 'Bank Transfer' | 'Cash on Delivery';

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
