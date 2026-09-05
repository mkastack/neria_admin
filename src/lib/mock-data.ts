import { 
  Order, Product, Collection, Customer, Discount, GiftCard, 
  Transaction, Refund, ShippingZone, DeliveryRide, ReturnRequest, 
  Campaign, Review, CommunityPost, NewsletterSubscriber, StaffMember, 
  ActivityLog, NotificationItem 
} from './types';

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Pink Bunny Oversized Hoodie',
    slug: 'pink-bunny-oversized-hoodie',
    description: 'Ultra-soft heavyweight fleece hoodie featuring custom Neria bunny embroidery on the chest and plush bunny ears on the hood. Perfect for cozy days.',
    shortDescription: 'Plush fleece hoodie with signature bunny ears embroidery.',
    category: 'Hoodies',
    collection: 'Bunny Love',
    price: 420,
    compareAtPrice: 480,
    cost: 190,
    sku: 'NER-HOD-001',
    barcode: '6001239841',
    stock: 24,
    lowStockThreshold: 10,
    trackQuantity: true,
    allowBackorder: false,
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80'
    ],
    variants: [
      { id: 'v-1', size: 'S', color: 'Baby Pink', sku: 'NER-HOD-001-S', price: 420, cost: 190, stock: 8, status: 'In Stock' },
      { id: 'v-2', size: 'M', color: 'Baby Pink', sku: 'NER-HOD-001-M', price: 420, cost: 190, stock: 12, status: 'In Stock' },
      { id: 'v-3', size: 'L', color: 'Baby Pink', sku: 'NER-HOD-001-L', price: 420, cost: 190, stock: 4, status: 'Low Stock' }
    ],
    tags: ['Best Seller', 'Bunny', 'Fleece', 'Cozy'],
    salesCount: 142,
    revenue: 59640,
    rating: 4.9,
    reviewsCount: 38,
    updatedAt: '2026-08-27T14:20:00Z',
    createdAt: '2026-06-10T10:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'Strawberry Sweetheart Tiered Dress',
    slug: 'strawberry-sweetheart-tiered-dress',
    description: 'Dreamy organza tiered mini dress with subtle strawberry floral jacquard pattern, sweetheart neckline, and delicate puff sleeves.',
    shortDescription: 'Delicate tiered organza dress in strawberry blush jacquard.',
    category: 'Dresses',
    collection: 'Strawberry Girl',
    price: 580,
    compareAtPrice: 650,
    cost: 260,
    sku: 'NER-DRS-002',
    stock: 14,
    lowStockThreshold: 8,
    trackQuantity: true,
    allowBackorder: false,
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80'
    ],
    variants: [
      { id: 'v-4', size: 'XS', color: 'Blush', sku: 'NER-DRS-002-XS', price: 580, cost: 260, stock: 3, status: 'Low Stock' },
      { id: 'v-5', size: 'S', color: 'Blush', sku: 'NER-DRS-002-S', price: 580, cost: 260, stock: 6, status: 'In Stock' },
      { id: 'v-6', size: 'M', color: 'Blush', sku: 'NER-DRS-002-M', price: 580, cost: 260, stock: 5, status: 'In Stock' }
    ],
    tags: ['New', 'Summer', 'Party', 'Romantic'],
    salesCount: 89,
    revenue: 51620,
    rating: 4.8,
    reviewsCount: 22,
    updatedAt: '2026-08-26T11:15:00Z',
    createdAt: '2026-07-01T09:30:00Z'
  },
  {
    id: 'prod-3',
    name: 'Soft Girl Pastel Knit Cardigan',
    slug: 'soft-girl-pastel-knit-cardigan',
    description: 'Chunky knit cropped cardigan adorned with pearlescent heart buttons and soft ribbing. Available in pastel baby pink and powder blue.',
    shortDescription: 'Cropped chunky knit cardigan with pearl heart buttons.',
    category: 'Tops',
    collection: 'Soft Girl',
    price: 340,
    cost: 150,
    sku: 'NER-TOP-003',
    stock: 5,
    lowStockThreshold: 10,
    trackQuantity: true,
    allowBackorder: true,
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80'
    ],
    variants: [
      { id: 'v-7', size: 'S', color: 'Powder Blue', sku: 'NER-TOP-003-BLU-S', price: 340, cost: 150, stock: 2, status: 'Low Stock' },
      { id: 'v-8', size: 'M', color: 'Powder Blue', sku: 'NER-TOP-003-BLU-M', price: 340, cost: 150, stock: 3, status: 'Low Stock' }
    ],
    tags: ['Knitwear', 'Cardigan', 'Soft Girl'],
    salesCount: 110,
    revenue: 37400,
    rating: 4.7,
    reviewsCount: 19,
    updatedAt: '2026-08-27T09:00:00Z',
    createdAt: '2026-05-18T14:00:00Z'
  },
  {
    id: 'prod-4',
    name: 'Bow Obsessed Satin Hair Clip Set',
    slug: 'bow-obsessed-satin-hair-clip-set',
    description: 'Handcrafted set of 4 silk satin oversized hair bow clips in baby pink, ivory cream, dusty rose, and midnight navy.',
    shortDescription: 'Set of 4 handcrafted silk satin oversized hair bow clips.',
    category: 'Accessories',
    collection: 'Bow Obsessed',
    price: 160,
    compareAtPrice: 190,
    cost: 45,
    sku: 'NER-ACC-004',
    stock: 48,
    lowStockThreshold: 15,
    trackQuantity: true,
    allowBackorder: false,
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'
    ],
    variants: [
      { id: 'v-9', size: 'One Size', color: 'Multi Pastel', sku: 'NER-ACC-004-OS', price: 160, cost: 45, stock: 48, status: 'In Stock' }
    ],
    tags: ['Accessories', 'Hair', 'Bows', 'Gift Idea'],
    salesCount: 230,
    revenue: 36800,
    rating: 5.0,
    reviewsCount: 54,
    updatedAt: '2026-08-28T01:00:00Z',
    createdAt: '2026-04-12T12:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'Cozy Bunny Cloud Pajama Lounge Set',
    slug: 'cozy-bunny-cloud-pajama-set',
    description: 'Silky modal two-piece pajama set with delicate contrast piping, chest pocket bunny embroidery, and relaxed drawstring shorts.',
    shortDescription: 'Silky modal 2-piece lounge set with contrast piping.',
    category: 'Sets',
    collection: 'Cozy Bunny',
    price: 390,
    cost: 165,
    sku: 'NER-SET-005',
    stock: 0,
    lowStockThreshold: 10,
    trackQuantity: true,
    allowBackorder: false,
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80'
    ],
    variants: [
      { id: 'v-10', size: 'S', color: 'Cream', sku: 'NER-SET-005-S', price: 390, cost: 165, stock: 0, status: 'Out of Stock' },
      { id: 'v-11', size: 'M', color: 'Cream', sku: 'NER-SET-005-M', price: 390, cost: 165, stock: 0, status: 'Out of Stock' }
    ],
    tags: ['Pajamas', 'Lounge', 'Sleepwear'],
    salesCount: 76,
    revenue: 29640,
    rating: 4.9,
    reviewsCount: 16,
    updatedAt: '2026-08-27T18:45:00Z',
    createdAt: '2026-06-25T16:20:00Z'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'NER-2048',
    customer: {
      id: 'cust-1',
      name: 'Avery Sinclair',
      email: 'avery.sinclair@gmail.com',
      phone: '+1 (212) 555-0182',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'
    },
    createdAt: '2026-08-28T01:45:00Z',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        name: 'Pink Bunny Oversized Hoodie',
        variant: 'Baby Pink / M',
        size: 'M',
        color: 'Baby Pink',
        sku: 'NER-HOD-001-M',
        price: 420,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&q=80',
        total: 420
      },
      {
        id: 'item-2',
        productId: 'prod-4',
        name: 'Bow Obsessed Satin Hair Clip Set',
        variant: 'Multi Pastel / One Size',
        size: 'One Size',
        color: 'Multi Pastel',
        sku: 'NER-ACC-004-OS',
        price: 160,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&q=80',
        total: 160
      }
    ],
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Processing',
    paymentMethod: 'Stripe (Apple Pay)',
    deliveryMethod: 'Express Delivery',
    deliveryAddress: {
      street: '226 W 26th St, Apt 4B',
      city: 'New York',
      region: 'NY',
      country: 'United States'
    },
    subtotal: 580,
    discount: 58,
    discountCode: 'NERIA10',
    shippingFee: 35,
    tax: 0,
    total: 557,
    notes: 'Please ring intercom 4B on arrival.',
    fraudRisk: 'Low',
    tags: ['VIP Customer', 'Express'],
    timeline: [
      { id: 't-1', title: 'Order Placed', time: '01:45 AM', date: 'Aug 28, 2026', description: 'Customer placed order via website checkout.', completed: true },
      { id: 't-2', title: 'Payment Confirmed', time: '01:46 AM', date: 'Aug 28, 2026', description: 'Stripe PaymentIntent pi_3OH7Kx2eZvKYlo2C0XYZ confirmed.', completed: true },
      { id: 't-3', title: 'Processing at Fulfillment Hub', time: '02:10 AM', date: 'Aug 28, 2026', description: 'Items picked from shelf B4 & packed.', completed: true },
      { id: 't-4', title: 'Dispatch & Courier Handover', time: 'Pending', date: 'Aug 28, 2026', description: 'Handed off to UPS overnight courier.', completed: false },
      { id: 't-5', title: 'Delivered', time: 'Pending', date: 'Aug 28, 2026', description: 'Customer signature upon delivery.', completed: false }
    ]
  },
  {
    id: 'ord-2',
    orderNumber: 'NER-2047',
    customer: {
      id: 'cust-2',
      name: 'Abigail Park',
      email: 'abigail.park@outlook.com',
      phone: '+1 (310) 555-0149',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80'
    },
    createdAt: '2026-08-27T22:15:00Z',
    items: [
      {
        id: 'item-3',
        productId: 'prod-2',
        name: 'Strawberry Sweetheart Tiered Dress',
        variant: 'Blush / S',
        size: 'S',
        color: 'Blush',
        sku: 'NER-DRS-002-S',
        price: 580,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80',
        total: 580
      }
    ],
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Shipped',
    paymentMethod: 'Credit / Debit Card',
    deliveryMethod: 'Standard Delivery',
    deliveryAddress: {
      street: '8421 Sunset Blvd, Apt 12',
      city: 'Los Angeles',
      region: 'CA',
      country: 'United States'
    },
    subtotal: 580,
    discount: 0,
    shippingFee: 45,
    tax: 0,
    total: 625,
    fraudRisk: 'Low',
    tags: ['West Coast'],
    timeline: [
      { id: 't-6', title: 'Order Placed', time: '10:15 PM', date: 'Aug 27, 2026', completed: true },
      { id: 't-7', title: 'Payment Confirmed', time: '10:16 PM', date: 'Aug 27, 2026', completed: true },
      { id: 't-8', title: 'Packed & Sealed', time: '11:00 PM', date: 'Aug 27, 2026', completed: true },
      { id: 't-9', title: 'Shipped via UPS Ground', time: '06:30 AM', date: 'Aug 28, 2026', description: 'Tracking #1Z999AA10123456784', completed: true },
      { id: 't-10', title: 'Delivered', time: 'Pending', date: 'Aug 28, 2026', completed: false }
    ]
  },
  {
    id: 'ord-3',
    orderNumber: 'NER-2046',
    customer: {
      id: 'cust-3',
      name: 'Jessica Bell',
      email: 'jess.bell@icloud.com',
      phone: '+1 (404) 555-0119',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80'
    },
    createdAt: '2026-08-27T19:30:00Z',
    items: [
      {
        id: 'item-4',
        productId: 'prod-3',
        name: 'Soft Girl Pastel Knit Cardigan',
        variant: 'Powder Blue / S',
        size: 'S',
        color: 'Powder Blue',
        sku: 'NER-TOP-003-BLU-S',
        price: 340,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&q=80',
        total: 680
      }
    ],
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    paymentMethod: 'Stripe (Card)',
    deliveryMethod: 'Standard Delivery',
    deliveryAddress: {
      street: '1100 Peachtree St NE',
      city: 'Atlanta',
      region: 'GA',
      country: 'United States'
    },
    subtotal: 680,
    discount: 50,
    discountCode: 'WELCOME50',
    shippingFee: 25,
    tax: 0,
    total: 655,
    fraudRisk: 'Low',
    tags: ['Completed'],
    timeline: [
      { id: 't-11', title: 'Order Placed', time: '07:30 PM', date: 'Aug 27, 2026', completed: true },
      { id: 't-12', title: 'Payment Confirmed', time: '07:31 PM', date: 'Aug 27, 2026', completed: true },
      { id: 't-13', title: 'Dispatched', time: '08:15 PM', date: 'Aug 27, 2026', completed: true },
      { id: 't-14', title: 'Delivered', time: '09:20 PM', date: 'Aug 27, 2026', description: 'Received by customer.', completed: true }
    ]
  },
  {
    id: 'ord-4',
    orderNumber: 'NER-2045',
    customer: {
      id: 'cust-4',
      name: 'Emily Marsh',
      email: 'emily.marsh@gmail.com',
      phone: '+1 (312) 555-0177',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80'
    },
    createdAt: '2026-08-27T16:00:00Z',
    items: [
      {
        id: 'item-5',
        productId: 'prod-4',
        name: 'Bow Obsessed Satin Hair Clip Set',
        variant: 'Multi Pastel / One Size',
        size: 'One Size',
        color: 'Multi Pastel',
        sku: 'NER-ACC-004-OS',
        price: 160,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&q=80',
        total: 480
      }
    ],
    paymentStatus: 'Pending',
    fulfillmentStatus: 'Unfulfilled',
    paymentMethod: 'PayPal',
    deliveryMethod: 'Standard Delivery',
    deliveryAddress: {
      street: '400 N Michigan Ave, Apt 2201',
      city: 'Chicago',
      region: 'IL',
      country: 'United States'
    },
    subtotal: 480,
    discount: 0,
    shippingFee: 25,
    tax: 0,
    total: 505,
    fraudRisk: 'Medium',
    tags: ['Awaiting PayPal Capture'],
    timeline: [
      { id: 't-15', title: 'Order Placed', time: '04:00 PM', date: 'Aug 27, 2026', completed: true },
      { id: 't-16', title: 'Payment Verification Pending', time: '04:05 PM', date: 'Aug 27, 2026', description: 'Awaiting PayPal authorization capture.', completed: false }
    ]
  },
  {
    id: 'ord-5',
    orderNumber: 'NER-2044',
    customer: {
      id: 'cust-5',
      name: 'Kayla Addison',
      email: 'kayla.addison@yahoo.com',
      phone: '+1 (206) 555-0122',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80'
    },
    createdAt: '2026-08-27T12:10:00Z',
    items: [
      {
        id: 'item-6',
        productId: 'prod-1',
        name: 'Pink Bunny Oversized Hoodie',
        variant: 'Baby Pink / S',
        size: 'S',
        color: 'Baby Pink',
        sku: 'NER-HOD-001-S',
        price: 420,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&q=80',
        total: 420
      }
    ],
    paymentStatus: 'Refunded',
    fulfillmentStatus: 'Returned',
    paymentMethod: 'Stripe (Card)',
    deliveryMethod: 'Standard Delivery',
    deliveryAddress: {
      street: '1424 11th Ave, Apt 305',
      city: 'Seattle',
      region: 'WA',
      country: 'United States'
    },
    subtotal: 420,
    discount: 0,
    shippingFee: 25,
    tax: 0,
    total: 445,
    notes: 'Size S returned for exchange.',
    fraudRisk: 'Low',
    tags: ['Refund Processed'],
    timeline: [
      { id: 't-17', title: 'Order Placed', time: '12:10 PM', date: 'Aug 27, 2026', completed: true },
      { id: 't-18', title: 'Delivered', time: '02:40 PM', date: 'Aug 27, 2026', completed: true },
      { id: 't-19', title: 'Return Initiated & Received', time: '05:20 PM', date: 'Aug 27, 2026', completed: true },
      { id: 't-20', title: 'Refund Dispatched $445', time: '06:00 PM', date: 'Aug 27, 2026', completed: true }
    ]
  }
];

export const mockCollections: Collection[] = [
  {
    id: 'col-1',
    name: 'Bunny Love',
    slug: 'bunny-love',
    description: 'Our iconic signature collection featuring bespoke rabbit motifs, plush textures, and baby pink hues.',
    coverImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=1200&q=80',
    productsCount: 12,
    status: 'Active',
    sales: 340,
    revenue: 142800,
    updatedAt: '2026-08-27T10:00:00Z',
    productIds: ['prod-1', 'prod-5']
  },
  {
    id: 'col-2',
    name: 'Strawberry Girl',
    slug: 'strawberry-girl',
    description: 'Sweet berry shades, romantic ruffles, organza silhouettes and floral charm for the ultimate daydream aesthetic.',
    coverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&q=80',
    productsCount: 8,
    status: 'Active',
    sales: 184,
    revenue: 96400,
    updatedAt: '2026-08-26T14:30:00Z',
    productIds: ['prod-2']
  },
  {
    id: 'col-3',
    name: 'Soft Girl',
    slug: 'soft-girl',
    description: 'Cozy pastel cardigans, pleated skirts, pearly buttons and everyday comfort tailored for feminine grace.',
    coverImage: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&q=80',
    productsCount: 15,
    status: 'Active',
    sales: 290,
    revenue: 98600,
    updatedAt: '2026-08-25T16:00:00Z',
    productIds: ['prod-3']
  },
  {
    id: 'col-4',
    name: 'Bow Obsessed',
    slug: 'bow-obsessed',
    description: 'From statement hair clips to ribbon-embellished accessories and ties. Because you can never have enough bows.',
    coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80',
    productsCount: 9,
    status: 'Active',
    sales: 420,
    revenue: 67200,
    updatedAt: '2026-08-28T00:30:00Z',
    productIds: ['prod-4']
  },
  {
    id: 'col-5',
    name: 'Cozy Bunny',
    slug: 'cozy-bunny',
    description: 'Pure modal loungewear, fluffy slippers and sleep essentials designed for the softest bedtime rituals.',
    coverImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80',
    productsCount: 6,
    status: 'Active',
    sales: 115,
    revenue: 44850,
    updatedAt: '2026-08-27T12:00:00Z',
    productIds: ['prod-5']
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Avery Sinclair',
    email: 'avery.sinclair@gmail.com',
    phone: '+1 (212) 555-0182',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    ordersCount: 8,
    totalSpent: 4320,
    lastOrderDate: '2026-08-28T01:45:00Z',
    segment: 'VIP',
    address: '226 W 26th St, Apt 4B',
    city: 'New York',
    region: 'NY',
    notes: [
      { id: 'n-1', text: 'VIP client. Prefers size M hoodies. Loves strawberry gift packaging.', author: 'Neria Admin', timestamp: '2026-08-20T10:00:00Z' }
    ],
    tags: ['VIP', 'High Spender', 'Brand Lover'],
    joinedDate: '2026-02-14T08:00:00Z',
    wishlistCount: 6
  },
  {
    id: 'cust-2',
    name: 'Abigail Park',
    email: 'abigail.park@outlook.com',
    phone: '+1 (310) 555-0149',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
    ordersCount: 4,
    totalSpent: 2190,
    lastOrderDate: '2026-08-27T22:15:00Z',
    segment: 'Returning',
    address: '8421 Sunset Blvd, Apt 12',
    city: 'Los Angeles',
    region: 'CA',
    notes: [
      { id: 'n-2', text: 'Requests express overnight for dresses.', author: 'Kofi Staff', timestamp: '2026-07-15T14:30:00Z' }
    ],
    tags: ['West Coast', 'Dress Lover'],
    joinedDate: '2026-04-10T11:20:00Z',
    wishlistCount: 3
  },
  {
    id: 'cust-3',
    name: 'Jessica Bell',
    email: 'jess.bell@icloud.com',
    phone: '+1 (404) 555-0119',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    ordersCount: 1,
    totalSpent: 655,
    lastOrderDate: '2026-08-27T19:30:00Z',
    segment: 'New',
    address: '1100 Peachtree St NE',
    city: 'Atlanta',
    region: 'GA',
    notes: [],
    tags: ['First Time Buyer'],
    joinedDate: '2026-08-27T19:00:00Z',
    wishlistCount: 2
  },
  {
    id: 'cust-4',
    name: 'Emily Marsh',
    email: 'emily.marsh@gmail.com',
    phone: '+1 (312) 555-0177',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    ordersCount: 2,
    totalSpent: 890,
    lastOrderDate: '2026-08-27T16:00:00Z',
    segment: 'Returning',
    address: '400 N Michigan Ave, Apt 2201',
    city: 'Chicago',
    region: 'IL',
    notes: [],
    tags: ['Accessories'],
    joinedDate: '2026-06-01T09:15:00Z',
    wishlistCount: 4
  }
];

export const mockDiscounts: Discount[] = [
  {
    id: 'disc-1',
    code: 'NERIA10',
    type: 'Percentage',
    value: 10,
    minSpend: 200,
    usageCount: 148,
    usageLimit: 500,
    status: 'Active',
    startDate: '2026-08-01',
    endDate: '2026-09-30',
    applicableTo: 'All Products'
  },
  {
    id: 'disc-2',
    code: 'WELCOME50',
    type: 'Fixed Amount',
    value: 50,
    minSpend: 300,
    usageCount: 89,
    status: 'Active',
    startDate: '2026-01-01',
    applicableTo: 'All Products'
  },
  {
    id: 'disc-3',
    code: 'BUNNYFREESHIP',
    type: 'Free Shipping',
    value: 0,
    minSpend: 500,
    usageCount: 210,
    status: 'Active',
    startDate: '2026-07-01',
    applicableTo: 'All Products'
  }
];

export const mockGiftCards: GiftCard[] = [
  {
    id: 'gc-1',
    code: 'NER-GIFT-9920-BLSH',
    customerName: 'Avery Sinclair',
    customerEmail: 'avery.sinclair@gmail.com',
    initialValue: 500,
    balance: 240,
    status: 'Active',
    createdAt: '2026-08-15T10:00:00Z',
    expiresAt: '2027-08-15T10:00:00Z'
  },
  {
    id: 'gc-2',
    code: 'NER-GIFT-4412-PINK',
    customerName: 'Kayla Addison',
    customerEmail: 'kayla.addison@yahoo.com',
    initialValue: 350,
    balance: 0,
    status: 'Redeemed',
    createdAt: '2026-07-20T12:00:00Z',
    expiresAt: '2027-07-20T12:00:00Z'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    transactionNumber: 'TX-99824',
    orderNumber: 'NER-2048',
    customerName: 'Avery Sinclair',
    method: 'Stripe (Apple Pay)',
    type: 'Charge',
    amount: 557,
    fee: 5.57,
    net: 551.43,
    status: 'Success',
    reference: 'pi_3OH7Kx2eZvKYlo2C0XYZ',
    date: '2026-08-28T01:46:00Z'
  },
  {
    id: 'tx-2',
    transactionNumber: 'TX-99823',
    orderNumber: 'NER-2047',
    customerName: 'Abigail Park',
    method: 'Stripe (Card)',
    type: 'Charge',
    amount: 625,
    fee: 12.50,
    net: 612.50,
    status: 'Success',
    reference: 'pi_3OH6Rt2eZvKYlo2C0ABC',
    date: '2026-08-27T22:16:00Z'
  },
  {
    id: 'tx-3',
    transactionNumber: 'TX-99822',
    orderNumber: 'NER-2044',
    customerName: 'Kayla Addison',
    method: 'Stripe (Card)',
    type: 'Refund',
    amount: 445,
    fee: 0,
    net: -445,
    status: 'Success',
    reference: 're_3OH5Yk2eZvKYlo2C0DEF',
    date: '2026-08-27T18:00:00Z'
  }
];

export const mockRefunds: Refund[] = [
  {
    id: 'ref-1',
    refundNumber: 'REF-201',
    orderNumber: 'NER-2044',
    customerName: 'Kayla Addison',
    reason: 'Wrong Size',
    amount: 445,
    status: 'Completed',
    date: '2026-08-27T18:00:00Z',
    restocked: true,
    notes: 'Exchanged for Size M in showroom.'
  }
];

export const mockShippingZones: ShippingZone[] = [
  {
    id: 'zone-1',
    name: 'Northeast US',
    regions: ['New York', 'New Jersey', 'Massachusetts', 'Pennsylvania', 'Connecticut', 'Washington DC'],
    standardRate: 25,
    expressRate: 40,
    estimatedDelivery: 'Same Day - 24 Hours',
    status: 'Active'
  },
  {
    id: 'zone-2',
    name: 'Southeast US',
    regions: ['Florida', 'Georgia', 'North Carolina', 'South Carolina', 'Virginia', 'Tennessee'],
    standardRate: 35,
    expressRate: 50,
    estimatedDelivery: '24 - 48 Hours',
    status: 'Active'
  },
  {
    id: 'zone-3',
    name: 'West Coast US',
    regions: ['California', 'Washington', 'Oregon', 'Nevada', 'Arizona'],
    standardRate: 45,
    expressRate: 70,
    estimatedDelivery: '1 - 2 Business Days',
    status: 'Active'
  },
  {
    id: 'zone-4',
    name: 'Midwest & Mountain',
    regions: ['Illinois', 'Texas', 'Colorado', 'Utah', 'Michigan', 'Minnesota'],
    standardRate: 55,
    expressRate: 90,
    estimatedDelivery: '2 - 4 Business Days',
    status: 'Active'
  }
];

export const mockDeliveryRiders: DeliveryRide[] = [
  {
    id: 'del-1',
    trackingNumber: 'RIDE-8812',
    orderNumber: 'NER-2048',
    customerName: 'Avery Sinclair',
    address: '226 W 26th St, New York',
    riderName: 'Marcus Reeves',
    riderPhone: '+1 (212) 555-0210',
    status: 'In Transit',
    estimatedDelivery: '03:15 AM',
    coordinates: { x: 48, y: 35 }
  },
  {
    id: 'del-2',
    trackingNumber: 'RIDE-8810',
    orderNumber: 'NER-2046',
    customerName: 'Jessica Bell',
    address: '1100 Peachtree St NE, Atlanta',
    riderName: 'Devon Carter',
    riderPhone: '+1 (404) 555-0192',
    status: 'Delivered',
    estimatedDelivery: '09:20 PM',
    coordinates: { x: 62, y: 55 }
  }
];

export const mockReturnRequests: ReturnRequest[] = [
  {
    id: 'ret-1',
    returnNumber: 'RET-109',
    orderNumber: 'NER-2044',
    customerName: 'Kayla Addison',
    customerEmail: 'kayla.addison@yahoo.com',
    items: ['Pink Bunny Oversized Hoodie - S'],
    reason: 'Needs size exchange to Medium',
    status: 'Refunded',
    requestedAt: '2026-08-27T15:00:00Z',
    refundAmount: 445,
    adminNotes: 'Returned in pristine condition with tags intact.'
  }
];

export const mockCampaigns: Campaign[] = [
  {
    id: 'cmp-1',
    name: 'Strawberry Girl Season Launch',
    type: 'Homepage Collection',
    status: 'Active',
    startDate: '2026-08-15',
    endDate: '2026-09-15',
    audience: 'All Store Visitors',
    revenue: 96400,
    clicks: 14200,
    conversionRate: 4.8,
    message: 'Discover dreamy strawberry jacquards & romantic organza ruffles.',
    ctaText: 'Shop Strawberry Girl ♡',
    ctaLink: '/collections/strawberry-girl'
  },
  {
    id: 'cmp-2',
    name: 'Cozy Bunny VIP Early Access',
    type: 'Email',
    status: 'Active',
    startDate: '2026-08-20',
    endDate: '2026-09-01',
    audience: 'VIP & Newsletter Club',
    revenue: 44850,
    clicks: 3900,
    conversionRate: 6.2,
    message: 'Silky modal sets with bunny embroidery. Limited quantities only.',
    ctaText: 'Unlock Early Access',
    ctaLink: '/collections/cozy-bunny'
  }
];

export const mockReviews: Review[] = [
  {
    id: 'rev-1',
    productName: 'Pink Bunny Oversized Hoodie',
    productImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&q=80',
    customerName: 'Avery S.',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    rating: 5,
    title: 'The softest hoodie I own! ♡',
    content: 'Literally never taking this off. The bunny ears are so adorable and the fleece is super thick and cozy. Worth every dollar!',
    date: '2026-08-25',
    status: 'Approved',
    featured: true,
    adminReply: 'Thank you so much darling! We hope it keeps you extra cozy ♡'
  },
  {
    id: 'rev-2',
    productName: 'Strawberry Sweetheart Tiered Dress',
    productImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80',
    customerName: 'Abigail P.',
    customerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
    rating: 5,
    title: 'Pure fairytale vibes ✨',
    content: 'Wore this for my birthday photoshoot and received endless compliments. The sweetheart cut is so flattering.',
    date: '2026-08-26',
    status: 'Approved',
    featured: true
  }
];

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    username: '@avery.sinclair',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80',
    caption: 'Sunday brunch styled in @neriacollective strawberry sweetheart dress 🍓✨',
    taggedProducts: ['Strawberry Sweetheart Tiered Dress', 'Bow Obsessed Satin Hair Clip Set'],
    status: 'Featured',
    likesCount: 842,
    date: '2026-08-26'
  },
  {
    id: 'post-2',
    username: '@jessicab_ny',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80',
    caption: 'Living in this pink bunny hoodie forever 🐰💕',
    taggedProducts: ['Pink Bunny Oversized Hoodie'],
    status: 'Approved',
    likesCount: 615,
    date: '2026-08-27'
  }
];

export const mockNewsletterSubscribers: NewsletterSubscriber[] = [
  {
    id: 'sub-1',
    email: 'avery.sinclair@gmail.com',
    name: 'Avery Sinclair',
    joinedDate: '2026-02-14',
    source: 'Footer Signup',
    status: 'VIP',
    totalCampaignsReceived: 24,
    openRate: 88
  },
  {
    id: 'sub-2',
    email: 'abigail.park@outlook.com',
    name: 'Abigail Park',
    joinedDate: '2026-04-10',
    source: 'Checkout',
    status: 'Active',
    totalCampaignsReceived: 18,
    openRate: 72
  },
  {
    id: 'sub-3',
    email: 'jess.bell@icloud.com',
    name: 'Jessica Bell',
    joinedDate: '2026-08-27',
    source: 'Popup Modal',
    status: 'Active',
    totalCampaignsReceived: 2,
    openRate: 100
  }
];

export const mockStaff: StaffMember[] = [
  {
    id: 'st-1',
    name: 'Neria Founder',
    email: 'founder@neriacollective.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    role: 'Super Admin',
    lastActive: 'Just now',
    status: 'Active',
    createdAt: '2026-01-01'
  },
  {
    id: 'st-2',
    name: 'Chloe Asante',
    email: 'chloe.asante@neriacollective.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
    role: 'Store Manager',
    lastActive: '15 mins ago',
    status: 'Active',
    createdAt: '2026-02-10'
  },
  {
    id: 'st-3',
    name: 'Devon Carter',
    email: 'devon.c@neriacollective.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    role: 'Inventory Manager',
    lastActive: '1 hour ago',
    status: 'Active',
    createdAt: '2026-03-01'
  }
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'act-1',
    staffName: 'Neria Founder',
    staffAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    action: 'Fulfilled',
    resource: 'Order',
    description: 'Updated order #NER-2048 to Processing & dispatched to courier.',
    ipAddress: '24.104.18.42',
    timestamp: '10 mins ago'
  },
  {
    id: 'act-2',
    staffName: 'Chloe Asante',
    staffAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
    action: 'Created',
    resource: 'Discount',
    description: 'Created promotional discount code #NERIA10 for 10% off.',
    ipAddress: '24.104.18.91',
    timestamp: '45 mins ago'
  },
  {
    id: 'act-3',
    staffName: 'Devon Carter',
    staffAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    action: 'Updated',
    resource: 'Inventory',
    description: 'Adjusted stock for Pink Bunny Oversized Hoodie (+20 units).',
    ipAddress: '24.104.18.7',
    timestamp: '2 hours ago'
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    category: 'Orders',
    title: 'New Order #NER-2048',
    description: 'Avery Sinclair paid $557 via Apple Pay.',
    timestamp: '5 mins ago',
    read: false,
    actionUrl: '/admin/orders/ord-1'
  },
  {
    id: 'notif-2',
    category: 'Inventory',
    title: 'Low Stock Alert',
    description: 'Soft Girl Pastel Knit Cardigan (S) only 2 units remaining.',
    timestamp: '35 mins ago',
    read: false,
    actionUrl: '/admin/inventory'
  },
  {
    id: 'notif-3',
    category: 'Reviews',
    title: 'New 5-Star Review',
    description: 'Avery S. left a review on Pink Bunny Oversized Hoodie.',
    timestamp: '2 hours ago',
    read: true,
    actionUrl: '/admin/reviews'
  },
  {
    id: 'notif-4',
    category: 'Payments',
    title: 'Daily Payout Settlement',
    description: '$18,450 Stripe payout processed to Chase Business Checking.',
    timestamp: '4 hours ago',
    read: true,
    actionUrl: '/admin/payments'
  }
];

export const mockRevenueTrend = [
  { date: 'Aug 22', revenue: 4800, orders: 12, aov: 400 },
  { date: 'Aug 23', revenue: 6200, orders: 15, aov: 413 },
  { date: 'Aug 24', revenue: 5100, orders: 11, aov: 463 },
  { date: 'Aug 25', revenue: 8400, orders: 19, aov: 442 },
  { date: 'Aug 26', revenue: 7300, orders: 16, aov: 456 },
  { date: 'Aug 27', revenue: 9800, orders: 22, aov: 445 },
  { date: 'Aug 28', revenue: 7320, orders: 17, aov: 430 }
];

export const mockSalesByCategory = [
  { name: 'Hoodies', value: 35, revenue: 59640, color: '#FF4FA3' },
  { name: 'Dresses', value: 28, revenue: 51620, color: '#FF80BF' },
  { name: 'Tops', value: 18, revenue: 37400, color: '#CBE7FA' },
  { name: 'Accessories', value: 12, revenue: 36800, color: '#FFD8EA' },
  { name: 'Sets', value: 7, revenue: 29640, color: '#263550' }
];

export const mockLiveFeed = [
  { id: 'lf-1', text: 'Someone from Brooklyn, NY added Pink Bunny Hoodie to cart', time: 'Just now', icon: 'cart' },
  { id: 'lf-2', text: 'Order #NER-2048 confirmed ($557)', time: '2m ago', icon: 'order' },
  { id: 'lf-3', text: 'Jessica B. added Strawberry Sweetheart Dress to wishlist', time: '8m ago', icon: 'wishlist' },
  { id: 'lf-4', text: 'Soft Girl Cardigan (Powder Blue) marked Low Stock (2 left)', time: '18m ago', icon: 'stock' },
  { id: 'lf-5', text: 'Order #NER-2046 delivered in Atlanta, GA', time: '30m ago', icon: 'delivery' }
];
