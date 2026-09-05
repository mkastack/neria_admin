"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useAuthUser } from "@/src/lib/firebase/auth";
import { useUserProfile } from "@/src/lib/firebase/users";
import { useProducts } from "@/src/lib/firebase/products";
import { useOrders } from "@/src/lib/firebase/orders";
import { useCustomers } from "@/src/lib/firebase/customers";
import { useCollections } from "@/src/lib/firebase/collections";
import { usePromoCodes } from "@/src/lib/firebase/promoCodes";
import { useActivityLogs } from "@/src/lib/firebase/activity";
import { useCategories } from "@/src/lib/firebase/categories";
import { useMediaAssets } from "@/src/lib/firebase/media";
import {
  useAdminNotifications,
  markNotificationReadInDB,
  markAllNotificationsReadInDB,
} from "@/src/lib/firebase/notifications";
import {
  mockGiftCards,
  mockTransactions,
  mockRefunds,
  mockShippingZones,
  mockDeliveryRiders,
  mockReturnRequests,
  mockCampaigns,
  mockReviews,
  mockCommunityPosts,
  mockNewsletterSubscribers,
  mockStaff,
  mockDiscounts,
} from "@/src/lib/mock-data";
import {
  type Order,
  type Product,
  type Customer,
  type Discount,
  type NotificationItem,
  type ActivityLog,
  type Collection,
  type GiftCard,
  type Transaction,
  type Refund,
  type ShippingZone,
  type DeliveryRide,
  type ReturnRequest,
  type Campaign,
  type Review,
  type CommunityPost,
  type NewsletterSubscriber,
  type StaffMember,
} from "@/src/lib/types";
import type { Role } from "@/src/lib/rbac";
import { can, type Action } from "@/src/lib/rbac";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
  crucial?: boolean;
}

interface AdminContextType {
  // Auth
  currentUserId: string | null;
  currentUserName: string;
  currentUserAvatar: string;
  currentRole: Role | null;
  can: (action: Action) => boolean;

  // UI shell state
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (val: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebar: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (val: boolean) => void;
  toggleMobileSidebar: () => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (val: boolean) => void;
  isHelpOpen: boolean;
  setIsHelpOpen: (val: boolean) => void;

  dateRange: string;
  setDateRange: (range: string) => void;

  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;

  isLoading: boolean;
  loaderMessage: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;

  // Firestore-backed state
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  discounts: Discount[];
  setDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  collections: Collection[];
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
  giftCards: GiftCard[];
  setGiftCards: React.Dispatch<React.SetStateAction<GiftCard[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  refunds: Refund[];
  setRefunds: React.Dispatch<React.SetStateAction<Refund[]>>;
  shippingZones: ShippingZone[];
  setShippingZones: React.Dispatch<React.SetStateAction<ShippingZone[]>>;
  deliveryRiders: DeliveryRide[];
  setDeliveryRiders: React.Dispatch<React.SetStateAction<DeliveryRide[]>>;
  returnRequests: ReturnRequest[];
  setReturnRequests: React.Dispatch<React.SetStateAction<ReturnRequest[]>>;
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  communityPosts: CommunityPost[];
  setCommunityPosts: React.Dispatch<React.SetStateAction<CommunityPost[]>>;
  newsletterSubscribers: NewsletterSubscriber[];
  setNewsletterSubscribers: React.Dispatch<React.SetStateAction<NewsletterSubscriber[]>>;
  staff: StaffMember[];
  setStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  activityLogs: ActivityLog[];
  setActivityLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;

  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  fulfillOrder: (orderId: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

/**
 * AdminProvider is the runtime store for the admin app.
 *
 * It's now **dual-sourced**:
 *
 *   - `orders`, `products`, `customers`, `collections`, `discounts`
 *     come from Firestore listeners (see `src/lib/firebase/*.ts`).
 *   - `giftCards`, `transactions`, `refunds`, `shippingZones`,
 *     `deliveryRiders`, `returnRequests`, `campaigns`, `reviews`,
 *     `communityPosts`, `newsletterSubscribers`, `staff`,
 *     `activityLogs` keep their mock-data shape for now; the pages
 *     that surface them will be wired to Firestore in the next
 *     phase. Keeping the shape stable means the existing UI keeps
 *     working without rewrites.
 *
 * The local `setX` setters stay exposed so individual pages can
 * apply optimistic updates where the listener hasn't fired yet.
 */
export function AdminProvider({ children }: { children: React.ReactNode }) {
  // Auth
  const { user: authUser } = useAuthUser();
  const { profile } = useUserProfile(authUser?.uid ?? null);

  // Firestore-backed lists
  const { products, loading: productsLoading } = useProducts();
  const { orders, loading: ordersLoading } = useOrders();
  const { customers, loading: customersLoading } = useCustomers();
  const { collections, loading: collectionsLoading } = useCollections();
  const { discounts, loading: discountsLoading } = usePromoCodes();
  const { logs: activityLogs } = useActivityLogs(50);
  const { categories } = useCategories();
  const { assets: mediaAssets } = useMediaAssets();

  // Local state (unchanged from the original AdminContext)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<string>("Last 7 Days");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loaderMessage, setLoaderMessage] = useState<string>("Saving your changes…");
  const loaderTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Still-mock collections (kept local so existing pages render).
  const [giftCards, setGiftCards] = useState<GiftCard[]>(mockGiftCards);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [refunds, setRefunds] = useState<Refund[]>(mockRefunds);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>(mockShippingZones);
  const [deliveryRiders, setDeliveryRiders] = useState<DeliveryRide[]>(mockDeliveryRiders);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(mockReturnRequests);
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>(mockNewsletterSubscribers);
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const { notifications, loading: notificationsLoading } = useAdminNotifications(30);
  // setNotifications kept for context compat — mutations go through Firestore helpers
  const setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>> = () => {};

  const showLoader = (message = "Saving your changes…") => {
    setLoaderMessage(message);
    setIsLoading(true);
  };
  const hideLoader = () => setIsLoading(false);

  const toggleSidebar = () => setIsSidebarCollapsed((p) => !p);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen((p) => !p);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => removeToast(id), 4000);
    if (toast.crucial) {
      const msg = toast.description ?? toast.title;
      showLoader(msg);
      if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current);
      loaderTimerRef.current = setTimeout(() => hideLoader(), 1800);
    }
  };
  const removeToast = (id: string) => setToasts((p) => p.filter((t) => t.id !== id));

  const markNotificationAsRead = (id: string) => {
    markNotificationReadInDB(id).catch(console.error);
  };
  const markAllNotificationsRead = () => {
    markAllNotificationsReadInDB().catch(console.error);
    addToast({ type: "info", title: "Notifications Cleared", description: "All notifications marked as read." });
  };

  const fulfillOrder = async (orderId: string) => {
    // Defer the import to avoid a hard dependency cycle.
    const { updateOrderFulfillment } = await import("@/src/lib/firebase/orders");
    try {
      await updateOrderFulfillment(orderId, "Delivered");
      addToast({
        type: "success",
        title: "Order Fulfilled ♡",
        description: `Order ${orderId} status updated to Delivered.`,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Couldn't fulfill order",
        description: err instanceof Error ? err.message : "Unknown error.",
      });
    }
  };

  // Cmd/Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Setters on Firestore-backed fields are no-ops locally; mutations
  // must go through the dedicated `firebase/*.ts` helpers. We keep the
  // setter signatures around so existing optimistic-update code
  // (where present) still type-checks.
  // Note: React.Dispatch<SetStateAction<T>> IS the setter function;
  // its parameter is `value: SetStateAction<T>`, not the Dispatch itself.
  const noopSet = <T,>(_value: React.SetStateAction<T>): void => {
    /* no-op; use dedicated firebase helpers */
  };

  const value = useMemo<AdminContextType>(
    () => ({
      currentUserId: authUser?.uid ?? null,
      currentUserName:
        profile?.name ||
        authUser?.displayName ||
        authUser?.email?.split("@")[0] ||
        "Admin",
      currentUserAvatar:
        profile?.photoURL || authUser?.photoURL || "",
      currentRole: profile?.role ?? null,
      can: (action: Action) => can(profile?.role, action),

      isSidebarCollapsed,
      setIsSidebarCollapsed,
      toggleSidebar,
      isMobileSidebarOpen,
      setIsMobileSidebarOpen,
      toggleMobileSidebar,
      isSearchOpen,
      setIsSearchOpen,
      isNotificationsOpen,
      setIsNotificationsOpen,
      isHelpOpen,
      setIsHelpOpen,
      dateRange,
      setDateRange,
      toasts,
      addToast,
      removeToast,
      isLoading,
      loaderMessage,
      showLoader,
      hideLoader,

      orders,
      setOrders: noopSet<Order[]>,
      products,
      setProducts: noopSet<Product[]>,
      customers,
      setCustomers: noopSet<Customer[]>,
      discounts,
      setDiscounts: noopSet<Discount[]>,
      notifications,
      setNotifications,
      collections,
      setCollections: noopSet<Collection[]>,
      giftCards,
      setGiftCards,
      transactions,
      setTransactions,
      refunds,
      setRefunds,
      shippingZones,
      setShippingZones,
      deliveryRiders,
      setDeliveryRiders,
      returnRequests,
      setReturnRequests,
      campaigns,
      setCampaigns,
      reviews,
      setReviews,
      communityPosts,
      setCommunityPosts,
      newsletterSubscribers,
      setNewsletterSubscribers,
      staff,
      setStaff,
      activityLogs,
      setActivityLogs: noopSet<ActivityLog[]>,

      markNotificationAsRead,
      markAllNotificationsRead,
      fulfillOrder,
    }),
    [
      authUser?.uid,
      authUser?.displayName,
      authUser?.email,
      authUser?.photoURL,
      profile?.name,
      profile?.photoURL,
      profile?.role,
      isSidebarCollapsed,
      isMobileSidebarOpen,
      isSearchOpen,
      isNotificationsOpen,
      isHelpOpen,
      dateRange,
      toasts,
      isLoading,
      loaderMessage,
      orders,
      products,
      customers,
      discounts,
      notifications,
      collections,
      giftCards,
      transactions,
      refunds,
      shippingZones,
      deliveryRiders,
      returnRequests,
      campaigns,
      reviews,
      communityPosts,
      newsletterSubscribers,
      staff,
      activityLogs,
      // categories + media are not surfaced through AdminContext today;
      // pages that need them can read from useCategories() / useMediaAssets()
      // directly.
      categories,
      mediaAssets,
    ],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within an AdminProvider");
  return ctx;
}
