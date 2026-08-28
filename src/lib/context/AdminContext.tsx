'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  mockOrders, mockProducts, mockCustomers, mockDiscounts, 
  mockNotifications, mockActivityLogs, mockCollections, mockGiftCards,
  mockTransactions, mockRefunds, mockShippingZones, mockDeliveryRiders,
  mockReturnRequests, mockCampaigns, mockReviews, mockCommunityPosts,
  mockNewsletterSubscribers, mockStaff
} from '../mock-data';
import { 
  Order, Product, Customer, Discount, NotificationItem, 
  ActivityLog, Collection, GiftCard, Transaction, Refund,
  ShippingZone, DeliveryRide, ReturnRequest, Campaign, Review,
  CommunityPost, NewsletterSubscriber, StaffMember
} from '../types';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  crucial?: boolean; // if true, triggers logo loader
}

interface AdminContextType {
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
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Global logo loader
  isLoading: boolean;
  loaderMessage: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;

  // Live state mock collections
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

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<string>('Last 7 Days');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Logo loader state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loaderMessage, setLoaderMessage] = useState<string>('Saving your changes…');
  const loaderTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showLoader = (message = 'Saving your changes…') => {
    setLoaderMessage(message);
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsLoading(false);
  };

  // State instances for data
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
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
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivityLogs);

  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(prev => !prev);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);

    // If crucial action, show logo loader for 1.8 seconds
    if (toast.crucial) {
      const msg = toast.description ?? toast.title;
      showLoader(msg);
      if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current);
      loaderTimerRef.current = setTimeout(() => hideLoader(), 1800);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast({
      type: 'info',
      title: 'Notifications Cleared',
      description: 'All notifications marked as read.'
    });
  };

  const fulfillOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId || o.orderNumber === orderId) {
        return { ...o, fulfillmentStatus: 'Delivered' };
      }
      return o;
    }));
    addToast({
      type: 'success',
      title: 'Order Fulfilled ♡',
      description: `Order ${orderId} status updated to Delivered.`
    });
  };

  // Keyboard shortcut listener (Ctrl+K / Cmd+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AdminContext.Provider value={{
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
      setOrders,
      products,
      setProducts,
      customers,
      setCustomers,
      discounts,
      setDiscounts,
      notifications,
      setNotifications,
      collections,
      setCollections,
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
      setActivityLogs,
      markNotificationAsRead,
      markAllNotificationsRead,
      fulfillOrder
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
