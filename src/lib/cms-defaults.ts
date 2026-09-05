import {
  StorefrontConfig,
  BunnyAsset,
  MediaAssetItem,
  JournalArticleItem,
  PublishVersion
} from './types';

export const initialBunnyAssets: BunnyAsset[] = [
  {
    id: 'bunny-default',
    name: 'Default Signature Bunny',
    mood: 'default',
    imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200&q=80',
    category: 'Signature',
    usedIn: ['Homepage Hero', 'Navigation Logo']
  },
  {
    id: 'bunny-happy',
    name: 'Happy Bouncing Bunny',
    mood: 'happy',
    imageUrl: 'https://images.unsplash.com/photo-1591382696684-38c427c7547a?w=200&q=80',
    category: 'Mascot',
    usedIn: ['Order Success', 'Announcement Bar']
  },
  {
    id: 'bunny-shopping',
    name: 'Shopping Bag Bunny',
    mood: 'shopping',
    imageUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&q=80',
    category: 'Commerce',
    usedIn: ['Checkout', 'Cart Drawer']
  },
  {
    id: 'bunny-sleeping',
    name: 'Cozy Sleeping Bunny',
    mood: 'sleeping',
    imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200&q=80',
    category: 'Mascot',
    usedIn: ['No Orders State', 'Night Mode']
  },
  {
    id: 'bunny-love',
    name: 'Heart & Love Bunny',
    mood: 'love',
    imageUrl: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=200&q=80',
    category: 'Emotions',
    usedIn: ['Wishlist', 'Newsletter Banner']
  },
  {
    id: 'bunny-celebration',
    name: 'Celebration Confetti Bunny',
    mood: 'celebration',
    imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=200&q=80',
    category: 'Promotions',
    usedIn: ['Birthday Drops', 'Sale Campaigns']
  },
  {
    id: 'bunny-empty-cart',
    name: 'Lonely Cart Bunny',
    mood: 'empty_cart',
    imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200&q=80',
    category: 'Empty States',
    usedIn: ['Empty Cart View']
  },
  {
    id: 'bunny-wishlist',
    name: 'Wishlist Dreaming Bunny',
    mood: 'wishlist',
    imageUrl: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=200&q=80',
    category: 'Empty States',
    usedIn: ['Empty Wishlist View']
  },
  {
    id: 'bunny-newsletter',
    name: 'Love Letter Bunny',
    mood: 'newsletter',
    imageUrl: 'https://images.unsplash.com/photo-1591382696684-38c427c7547a?w=200&q=80',
    category: 'Marketing',
    usedIn: ['Newsletter Section', 'Welcome Popup']
  },
  {
    id: 'bunny-thank-you',
    name: 'Bowing Thank You Bunny',
    mood: 'thank_you',
    imageUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&q=80',
    category: 'Commerce',
    usedIn: ['Order Confirmation']
  },
  {
    id: 'bunny-seasonal',
    name: 'Seasonal Bloom Bunny',
    mood: 'seasonal',
    imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=200&q=80',
    category: 'Seasonal',
    usedIn: ['Spring Collection']
  }
];

export const initialMediaAssets: MediaAssetItem[] = [
  {
    id: 'media-hero-1',
    name: 'hero_campaign_blue_hour.jpg',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=85',
    type: 'campaign',
    sizeBytes: 1240000,
    width: 1920,
    height: 1080,
    folder: 'Campaigns',
    altText: 'Neria Collective Soft Luxury Summer Campaign in Blue Hour',
    createdAt: '2026-08-20',
    usedInCount: 2,
    usedInLocations: ['Homepage Hero', 'Collections Page']
  },
  {
    id: 'media-hero-mobile',
    name: 'hero_campaign_mobile.jpg',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85',
    type: 'campaign',
    sizeBytes: 680000,
    width: 1080,
    height: 1350,
    folder: 'Campaigns',
    altText: 'Neria Soft Girl Lookbook Mobile View',
    createdAt: '2026-08-22',
    usedInCount: 1,
    usedInLocations: ['Homepage Hero Mobile']
  },
  {
    id: 'media-feat-collection',
    name: 'featured_blue_hour_capsule.jpg',
    url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=85',
    type: 'campaign',
    sizeBytes: 940000,
    width: 1200,
    height: 1500,
    folder: 'Campaigns',
    altText: 'The Blue Hour Capsule Collection Spotlight',
    createdAt: '2026-08-25',
    usedInCount: 1,
    usedInLocations: ['Homepage Featured Collection']
  },
  {
    id: 'media-cat-dresses',
    name: 'category_dresses.jpg',
    url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=85',
    type: 'product',
    sizeBytes: 420000,
    width: 800,
    height: 1000,
    folder: 'Categories',
    altText: 'Dresses Category Card',
    createdAt: '2026-08-15',
    usedInCount: 2,
    usedInLocations: ['Shop By Category', 'Navigation Mega Menu']
  },
  {
    id: 'media-cat-tops',
    name: 'category_tops.jpg',
    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=85',
    type: 'product',
    sizeBytes: 390000,
    width: 800,
    height: 1000,
    folder: 'Categories',
    altText: 'Tops Category Card',
    createdAt: '2026-08-15',
    usedInCount: 2,
    usedInLocations: ['Shop By Category', 'Navigation Mega Menu']
  },
  {
    id: 'media-cat-sets',
    name: 'category_sets.jpg',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=85',
    type: 'product',
    sizeBytes: 460000,
    width: 800,
    height: 1000,
    folder: 'Categories',
    altText: 'Sets Category Card',
    createdAt: '2026-08-15',
    usedInCount: 2,
    usedInLocations: ['Shop By Category', 'Navigation Mega Menu']
  },
  {
    id: 'media-popup-banner',
    name: 'popup_softgirl_discount.jpg',
    url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=85',
    type: 'campaign',
    sizeBytes: 350000,
    width: 800,
    height: 800,
    folder: 'Marketing',
    altText: 'Discount Popup Model Image',
    createdAt: '2026-08-28',
    usedInCount: 1,
    usedInLocations: ['Promotional Popup']
  }
];

export const initialJournalArticles: JournalArticleItem[] = [
  {
    id: 'art-1',
    title: 'The Art of Soft Dressing: Styling Neria Silk Sets',
    slug: 'art-of-soft-dressing',
    excerpt: 'Explore how muted pastels, powder blues, and delicate textures create an effortlessly commanding aura.',
    content: 'Softness is not quietness. In this season’s editorial, we dive into how intentional draping and delicate tones become your most empowered everyday statement.',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80',
    category: 'Style Notes',
    author: 'Neria Editorial',
    publishDate: 'Aug 28, 2026',
    readTime: '4 min read',
    status: 'Published'
  },
  {
    id: 'art-2',
    title: 'Behind the Seams: The Making of the Blue Hour Capsule',
    slug: 'behind-the-seams-blue-hour',
    excerpt: 'A glimpse into our design studio in New York, curating custom organic cottons and bespoke ribbon finishes.',
    content: 'Every stitch in our Blue Hour drop was selected to flatter all silhouettes while upholding sustainable atelier craftsmanship and small-batch production.',
    coverImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=80',
    category: 'Atelier Stories',
    author: 'Avery Osei',
    publishDate: 'Aug 24, 2026',
    readTime: '6 min read',
    status: 'Published'
  },
  {
    id: 'art-3',
    title: 'Neria Girls Around the Globe: New York to Los Angeles',
    slug: 'neria-girls-globe',
    excerpt: 'How our community pairs high-waist pleats with oversized knits across four fashion capitals.',
    content: 'Street style snapshots from girls wearing Neria with unbothered confidence, chunky loafers, and signature bunny pins.',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80',
    category: 'Community',
    author: 'Chloe Vance',
    publishDate: 'Aug 18, 2026',
    readTime: '3 min read',
    status: 'Published'
  }
];

export const defaultStorefrontConfig: StorefrontConfig = {
  brand: {
    brandName: 'Neria Collective',
    tagline: 'Soft looks. Loud presence.',
    primaryLogoUrl: '',
    secondaryLogoUrl: '',
    faviconUrl: '',
    bunnyLogoUrl: '',
    socialHandles: {
      instagram: 'https://instagram.com/neriacollective',
      tiktok: 'https://tiktok.com/@neriacollective',
      pinterest: 'https://pinterest.com/neriacollective',
      twitter: 'https://twitter.com/neriacollective',
      youtube: 'https://youtube.com/@neriacollective',
      whatsapp: 'https://wa.me/12125550100'
    },
    contactInfo: {
      email: 'care@neriacollective.com',
      phone: '+1 (212) 555-0100',
      whatsapp: '+1 (212) 555-0101',
      location: '226 W 26th St, New York, NY 10001, USA',
      hours: 'Mon — Sat: 9:00 AM — 7:00 PM EST'
    }
  },
  theme: {
    colors: {
      primary: '#FF4FA3',
      secondary: '#CBE7FA',
      background: '#FFF4F8',
      surface: '#FFFFFF',
      text: '#263550',
      mutedText: '#667085',
      border: '#F2F3F5',
      accent: '#FFD8EA',
      success: '#027A48',
      warning: '#B54708',
      sale: '#E63E90',
      buttonBg: '#FF4FA3',
      buttonText: '#FFFFFF'
    },
    typography: {
      headingFont: 'Outfit, sans-serif',
      bodyFont: 'Inter, sans-serif',
      baseFontSize: 16,
      headingScale: 'normal',
      buttonCornerRadius: 'rounded'
    }
  },
  announcements: {
    enabled: true,
    autoRotate: true,
    rotationInterval: 5,
    items: [
      {
        id: 'ann-1',
        message: 'New pieces just landed ♡ Free delivery on orders over $500',
        emoji: '♡',
        linkText: 'Shop New Arrivals',
        linkUrl: '/admin/website/editor?page=shop',
        bgColor: '#263550',
        textColor: '#FFFFFF',
        active: true,
        priority: 1
      },
      {
        id: 'ann-2',
        message: 'The Blue Hour Capsule is live 🩵 Limited quantities available',
        emoji: '🩵',
        linkText: 'Explore Capsule',
        linkUrl: '/admin/website/editor?page=collections',
        bgColor: '#FF4FA3',
        textColor: '#FFFFFF',
        active: true,
        priority: 2
      },
      {
        id: 'ann-3',
        message: 'Join the Neria Club for 15% off your first luxury order ✨',
        emoji: '✨',
        linkText: 'Sign Up',
        linkUrl: '#newsletter',
        bgColor: '#FFF4F8',
        textColor: '#FF4FA3',
        active: true,
        priority: 3
      }
    ]
  },
  navigation: {
    logoText: 'NERIA COLLECTIVE',
    searchPlaceholder: 'Search curated dresses, sets, corsets, bunnies...',
    menuItems: [
      {
        id: 'nav-shop',
        label: 'Shop',
        url: '/shop',
        isMegaMenu: true,
        featuredImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
        featuredTitle: 'New Season Silhouette Drop',
        featuredSubtitle: 'Explore dreamy pieces tailored for warm sunsets and crisp evenings.',
        dropdownItems: [
          { id: 'drop-all', label: 'All Collections', url: '/shop' },
          { id: 'drop-dresses', label: 'Dresses & Gowns', url: '/shop/dresses', badge: 'Hot' },
          { id: 'drop-sets', label: 'Matching Sets', url: '/shop/sets' },
          { id: 'drop-tops', label: 'Corsets & Tops', url: '/shop/tops' },
          { id: 'drop-bottoms', label: 'Skirts & Pants', url: '/shop/bottoms' },
          { id: 'drop-acc', label: 'Silk Accessories & Bunny Pins', url: '/shop/accessories' }
        ]
      },
      {
        id: 'nav-new',
        label: 'New In',
        url: '/new-in',
        highlight: true,
        badge: 'Drop 04'
      },
      {
        id: 'nav-collections',
        label: 'Collections',
        url: '/collections',
        dropdownItems: [
          { id: 'col-blue-hour', label: 'The Blue Hour Capsule 🩵', url: '/collections/blue-hour', badge: 'New' },
          { id: 'col-soft-girl', label: 'Soft Girl Era Essentials ♡', url: '/collections/soft-girl' },
          { id: 'col-best-sellers', label: 'Iconic Best Sellers ⭐', url: '/collections/best-sellers' }
        ]
      },
      {
        id: 'nav-community',
        label: 'Neria Girls ♡',
        url: '/neria-girls'
      },
      {
        id: 'nav-journal',
        label: 'Journal',
        url: '/journal'
      },
      {
        id: 'nav-about',
        label: 'Our Story',
        url: '/about'
      }
    ]
  },
  homepageSections: [
    {
      id: 'sec-hero',
      name: 'Hero Banner',
      type: 'hero',
      enabled: true,
      position: 1,
      content: {
        smallLabel: 'Neria Summer Capsule Drop 04',
        mainHeading: 'Soft looks. Loud presence.',
        headingEmoji: '♡',
        description: 'Thoughtfully tailored essentials designed to feel effortless, sweet, and unforgettable. Designed in New York with global softness.',
        primaryButtonText: 'Shop New Arrivals',
        primaryButtonLink: '/shop',
        secondaryButtonText: 'Explore Lookbook',
        secondaryButtonLink: '/collections',
        desktopImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=85',
        mobileImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85',
        overlayOpacity: 25,
        textPosition: 'left',
        verticalPosition: 'center',
        headingColor: '#FFFFFF',
        descriptionColor: '#F8F8FA',
        buttonBgColor: '#FF4FA3',
        buttonTextColor: '#FFFFFF',
        badgeText: 'Curated Autumn Drop',
        bunnyMood: 'love',
        showBunny: true
      }
    },
    {
      id: 'sec-categories',
      name: 'Shop By Category',
      type: 'categories',
      enabled: true,
      position: 2,
      content: {
        heading: 'Curated Categories',
        subtitle: 'Find your next favorite silhouette organized by mood and occasion.',
        categories: [
          { id: 'cat-1', name: 'Dresses', slug: 'dresses', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=85', itemCount: 28, badge: 'Popular', url: '/shop/dresses', visible: true },
          { id: 'cat-2', name: 'Matching Sets', slug: 'sets', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=85', itemCount: 19, badge: 'Trending', url: '/shop/sets', visible: true },
          { id: 'cat-3', name: 'Tops & Corsets', slug: 'tops', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=85', itemCount: 34, url: '/shop/tops', visible: true },
          { id: 'cat-4', name: 'Skirts & Bottoms', slug: 'bottoms', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=85', itemCount: 16, url: '/shop/bottoms', visible: true },
          { id: 'cat-5', name: 'Bunny Pins & Acc', slug: 'accessories', image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=800&q=85', itemCount: 12, badge: 'Sweet', url: '/shop/accessories', visible: true }
        ]
      }
    },
    {
      id: 'sec-new-arrivals',
      name: 'New Arrivals',
      type: 'new_arrivals',
      enabled: true,
      position: 3,
      content: {
        heading: 'Freshly Dropped Pieces 🩵',
        subtitle: 'Just landed from our atelier. Limited edition runs made with love.',
        sourceType: 'manual',
        automaticRule: 'newest',
        selectedProductIds: ['prod-1', 'prod-2', 'prod-3', 'prod-4'],
        limit: 4,
        showPrice: true,
        showColor: true,
        showWishlist: true,
        showQuickAdd: true,
        showNewBadge: true,
        ctaText: 'View All New Arrivals →',
        ctaLink: '/shop?filter=new'
      }
    },
    {
      id: 'sec-featured-col',
      name: 'Featured Collection: The Blue Hour',
      type: 'featured_collection',
      enabled: true,
      position: 4,
      content: {
        collectionLabel: 'Capsule Drop 04 Spotlight',
        collectionName: 'The Blue Hour Collection 🩵',
        description: 'Powder blue silk crepe, delicate contrast stitching, and romantic ruffles designed to make you feel like main character poetry.',
        primaryImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=85',
        secondaryImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=85',
        buttonText: 'Discover Blue Hour Capsule',
        buttonLink: '/collections/blue-hour',
        bgColor: '#EBF4FC',
        textColor: '#263550',
        layout: 'editorial_split',
        bunnyMood: 'happy',
        showBunny: true
      }
    },
    {
      id: 'sec-best-sellers',
      name: 'Best Sellers',
      type: 'best_sellers',
      enabled: true,
      position: 5,
      content: {
        heading: 'Most Loved by Neria Girls ⭐',
        subtitle: 'Our viral signature silhouettes that sell out drop after drop.',
        sourceType: 'automatic',
        automaticRule: 'bestsellers',
        selectedProductIds: ['prod-5', 'prod-6', 'prod-7', 'prod-8'],
        limit: 4,
        showPrice: true,
        showColor: true,
        showWishlist: true,
        showQuickAdd: true,
        showNewBadge: false,
        ctaText: 'Shop All Best Sellers',
        ctaLink: '/shop?sort=popular'
      }
    },
    {
      id: 'sec-neria-girl',
      name: 'Seen on Neria Girls (UGC)',
      type: 'neria_girl',
      enabled: true,
      position: 6,
      content: {
        heading: 'The Neria Girl Community ♡',
        subtitle: 'Tag @neriacollective on Instagram & TikTok to be featured on our storefront.',
        tagline: 'Soft, confident, and unapologetically stylish.',
        bunnyMood: 'love',
        items: [
          {
            id: 'ugc-1',
            imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
            customerName: 'Avery Boateng',
            handle: '@averyboateng',
            caption: 'The way this blue dress moves in the breeze is everything 🩵',
            taggedProduct: 'Cloud Mini Dress in Sky',
            handwrittenNote: '10/10 fit ♡'
          },
          {
            id: 'ugc-2',
            imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80',
            customerName: 'Kiki Marshall',
            handle: '@kikimarshall',
            caption: 'Neria set for weekend brunch in SoHo 🌸',
            taggedProduct: 'Silk Linen Pleated Set',
            handwrittenNote: 'Obsessed with the fabric!'
          },
          {
            id: 'ugc-3',
            imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80',
            customerName: 'Sena Bell',
            handle: '@sena.style',
            caption: 'Golden hour in my favorite corset top ✨',
            taggedProduct: 'Soft Boned Satin Corset',
            handwrittenNote: 'Pure luxury ♡'
          },
          {
            id: 'ugc-4',
            imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80',
            customerName: 'Dani O.',
            handle: '@dani_o',
            caption: 'Unboxing day! The bunny packaging melted my heart 🐰',
            taggedProduct: 'Signature Ribbon Tote',
            handwrittenNote: 'Cutest package ever'
          }
        ]
      }
    },
    {
      id: 'sec-journal',
      name: 'Neria Journal Articles',
      type: 'journal',
      enabled: true,
      position: 7,
      content: {
        heading: 'The Neria Journal ✍️',
        subtitle: 'Style guides, atelier stories, and styling musings from our creative directors.',
        articleIds: ['art-1', 'art-2', 'art-3']
      }
    },
    {
      id: 'sec-bunny-moment',
      name: 'Bunny Mascot Moment',
      type: 'bunny_moment',
      enabled: true,
      position: 8,
      content: {
        heading: 'Made for your softest era. 🐰',
        message: 'Every Neria Collective order arrives in our signature pink keepsake box, complete with handwritten care notes and an exclusive enamel bunny pin.',
        submessage: 'Free luxury gift wrapping included on all orders over $800.',
        bunnyMood: 'celebration',
        buttonText: 'Discover Our Brand Story',
        buttonLink: '/about',
        bgColor: '#FFF4F8'
      }
    },
    {
      id: 'sec-newsletter',
      name: 'Newsletter Club',
      type: 'newsletter',
      enabled: true,
      position: 9,
      content: {
        heading: 'Come into the Neria world. ♡',
        description: 'Secret archive drops, private fashion previews, and early VIP access straight to your inbox.',
        inputPlaceholder: 'Enter your sweetest email address...',
        buttonText: 'Join the Neria Club',
        successMessage: 'Welcome to the club sweet girl! Check your inbox for 15% off. 🩵',
        bunnyMood: 'newsletter',
        bgColor: '#263550',
        textColor: '#FFFFFF'
      }
    }
  ],
  popup: {
    id: 'pop-welcome-1',
    title: 'Unlock 15% Off Your First Order ♡',
    subtitle: 'Welcome to the Neria Collective sisterhood.',
    badgeText: 'Exclusive Welcome Gift',
    description: 'Join our VIP insider list today for private drops, surprise bunny gifts, and instant 15% savings across all collections.',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=85',
    emoji: '🎀',
    bunnyMood: 'shopping',
    primaryButtonText: 'Claim 15% Off Code',
    primaryButtonLink: '#claim',
    secondaryButtonText: 'Maybe later',
    promoCode: 'SOFTGIRL15',
    bgColor: '#FFFFFF',
    textColor: '#263550',
    type: 'discount',
    trigger: 'delay_5s',
    frequency: 'once_per_day',
    active: true
  },
  pages: [
    {
      id: 'page-about',
      slug: 'about',
      title: 'Our Story & Brand Atelier',
      description: 'The philosophy of Neria Collective: redefining modern femininity through softness and power.',
      status: 'Published',
      lastEdited: '2026-08-28',
      seoTitle: 'Our Story — Neria Collective Atelier New York',
      seoDescription: 'Discover the heart behind Neria Collective, our commitment to artisanal small-batch craftsmanship and soft luxury aesthetics.',
      blocks: [
        {
          id: 'blk-1',
          type: 'heading',
          content: { title: 'Soft looks. Loud presence.', subtitle: 'Our Philosophy' }
        },
        {
          id: 'blk-2',
          type: 'text',
          content: { text: 'Neria Collective was founded on the belief that femininity is a potent superpower. We design wardrobe staples that marry delicate romantic textures with sharp, contemporary silhouettes.' }
        },
        {
          id: 'blk-3',
          type: 'image_text',
          content: {
            heading: 'Crafted in New York with Global Softness',
            text: 'Every collection is engineered in our New York studio in small batches to eliminate textile waste and preserve artisanal tailoring quality.',
            image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&q=80',
            layout: 'image_left'
          }
        }
      ]
    },
    {
      id: 'page-contact',
      slug: 'contact',
      title: 'Contact & Customer Concierge',
      description: 'Get in touch with our styling team and client concierge.',
      status: 'Published',
      lastEdited: '2026-08-25',
      seoTitle: 'Contact Us — Neria Collective Client Care',
      seoDescription: 'Reach Neria Collective client concierge via WhatsApp, phone or email.',
      blocks: [
        {
          id: 'blk-c1',
          type: 'heading',
          content: { title: 'We would love to hear from you ♡', subtitle: 'Customer Concierge' }
        },
        {
          id: 'blk-c2',
          type: 'text',
          content: { text: 'Whether you need sizing advice, order tracking, or styling assistance for a special occasion, our client care specialists are here for you.' }
        }
      ]
    },
    {
      id: 'page-faq',
      slug: 'faq',
      title: 'Frequently Asked Questions',
      description: 'Everything you need to know regarding orders, shipping, sizing, and care instructions.',
      status: 'Published',
      lastEdited: '2026-08-29',
      seoTitle: 'FAQ — Neria Collective Sizing, Shipping & Orders',
      seoDescription: 'Find quick answers regarding delivery timeframes, exchanges, and payment methods.',
      blocks: [
        {
          id: 'blk-f1',
          type: 'faq',
          content: {
            category: 'Orders & Payments',
            items: [
              { question: 'What payment methods do you accept?', answer: 'We accept Visa, Mastercard, American Express, Apple Pay, Google Pay, Shop Pay, and PayPal — all processed securely through Stripe.' },
              { question: 'Can I cancel or modify my order after placing it?', answer: 'Orders are processed quickly within 2 hours. Please contact our client concierge promptly if you need changes.' },
              { question: 'How long does delivery take in the US?', answer: 'Standard shipping arrives in 3–5 business days. Express overnight is available at checkout for most US ZIP codes.' },
              { question: 'Do you ship internationally?', answer: 'Yes! We ship worldwide via DHL Express with tracking in 3–5 business days.' }
            ]
          }
        }
      ]
    },
    {
      id: 'page-shipping',
      slug: 'shipping-returns',
      title: 'Shipping & Returns Policy',
      description: 'Clear information on dispatch timelines, rates, and our 14-day exchange guarantee.',
      status: 'Published',
      lastEdited: '2026-08-20',
      seoTitle: 'Shipping & Exchanges Policy — Neria Collective',
      seoDescription: 'Read our fast delivery timelines and seamless 14-day exchange process.',
      blocks: [
        {
          id: 'blk-s1',
          type: 'heading',
          content: { title: 'Delivery & Hassle-Free Exchanges', subtitle: 'Shipping Policy' }
        },
        {
          id: 'blk-s2',
          type: 'text',
          content: { text: 'We take immense pride in ensuring your pieces arrive beautifully wrapped. All unworn items with tags intact qualify for exchange within 14 days of delivery.' }
        }
      ]
    },
    {
      id: 'page-size-guide',
      slug: 'size-guide',
      title: 'Official Size Guide',
      description: 'Accurate body measurement charts for dresses, sets, tops, and skirts.',
      status: 'Published',
      lastEdited: '2026-08-15',
      seoTitle: 'Size Guide & Measurements — Neria Collective',
      seoDescription: 'Find your perfect fit with our comprehensive US size conversion chart.',
      blocks: [
        {
          id: 'blk-sg1',
          type: 'size_guide',
          content: {
            category: 'Dresses & Tops',
            rows: [
              { size: 'XS (US 0)', bust: '31 - 32"', waist: '24 - 25"', hips: '34 - 35"' },
              { size: 'S (US 2)', bust: '33 - 34"', waist: '26 - 27"', hips: '36 - 37"' },
              { size: 'M (US 4)', bust: '35 - 36"', waist: '28 - 29"', hips: '38 - 39"' },
              { size: 'L (US 6)', bust: '37 - 39"', waist: '30 - 32"', hips: '40 - 42"' },
              { size: 'XL (US 8)', bust: '40 - 42"', waist: '33 - 35"', hips: '43 - 45"' }
            ]
          }
        }
      ]
    }
  ],
  footer: {
    brandBio: 'Neria Collective is a New York–based soft luxury womenswear label crafting modern silhouettes for unapologetic presence.',
    showNewsletter: true,
    showSocials: true,
    showPaymentMethods: true,
    copyrightText: '© 2026 Neria Collective Inc. All rights reserved. Made with love in New York ♡',
    columns: [
      {
        id: 'col-shop',
        title: 'Shop Silhouettes',
        links: [
          { id: 'fl-1', label: 'All Dresses', url: '/shop/dresses' },
          { id: 'fl-2', label: 'Matching Sets', url: '/shop/sets' },
          { id: 'fl-3', label: 'Corsets & Tops', url: '/shop/tops' },
          { id: 'fl-4', label: 'The Blue Hour Drop', url: '/collections/blue-hour' },
          { id: 'fl-5', label: 'Bunny Pins & Gifts', url: '/shop/accessories' }
        ]
      },
      {
        id: 'col-info',
        title: 'Customer Care',
        links: [
          { id: 'fl-6', label: 'Track Order', url: '/track' },
          { id: 'fl-7', label: 'Shipping & Delivery', url: '/shipping-returns' },
          { id: 'fl-8', label: '14-Day Exchanges', url: '/shipping-returns#returns' },
          { id: 'fl-9', label: 'Official Size Guide', url: '/size-guide' },
          { id: 'fl-10', label: 'Frequently Asked Questions', url: '/faq' }
        ]
      },
      {
        id: 'col-brand',
        title: 'The Neria World',
        links: [
          { id: 'fl-11', label: 'Our Story & Atelier', url: '/about' },
          { id: 'fl-12', label: 'Seen on Neria Girls', url: '/neria-girls' },
          { id: 'fl-13', label: 'Editorial Journal', url: '/journal' },
          { id: 'fl-14', label: 'Sustainability Pledge', url: '/about#sustainability' },
          { id: 'fl-15', label: 'Careers & Internships', url: '/careers' }
        ]
      }
    ],
    bottomLinks: [
      { id: 'bl-1', label: 'Privacy Policy', url: '/privacy' },
      { id: 'bl-2', label: 'Terms of Service', url: '/terms' },
      { id: 'bl-3', label: 'Cookie Preferences', url: '/cookies' }
    ]
  },
  seo: {
    siteTitle: 'Neria Collective — Soft Looks. Loud Presence.',
    titleTemplate: '%s | Neria Collective',
    defaultDescription: 'Shop soft luxury silhouettes, corsets, matching silk sets, and viral dresses designed in New York for women with commanding presence.',
    ogImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=85',
    keywords: ['neria collective', 'women fashion usa', 'soft girl fashion', 'silk sets new york', 'corset dress', 'luxury womenswear']
  },
  /**
   * Per-page editable text. Mirrors `neria_commerce/app/lib/firebase/cms.ts`
   * `PageTextConfig`. Empty by default — the admin's editor pushes
   * values here when the user clicks and types in the property panel.
   */
  pageText: {},
  version: 28,
  lastUpdated: '2026-09-02 05:00 EST'
};

export const initialPublishHistory: PublishVersion[] = [
  {
    id: 'ver-28',
    versionNumber: 28,
    publishedAt: 'Sep 2, 2026 at 04:30 AM',
    publishedBy: 'Avery Osei (Super Admin)',
    changeSummary: [
      'Updated Homepage Hero Heading to "Soft looks. Loud presence. ♡"',
      'Added Blue Hour Capsule promotion banner to Announcement bar',
      'Refreshed Neria Girl UGC community grid with 4 new snapshots',
      'Applied Powder Blue (#CBE7FA) secondary brand accent'
    ],
    configSnapshot: defaultStorefrontConfig
  },
  {
    id: 'ver-27',
    versionNumber: 27,
    publishedAt: 'Aug 26, 2026 at 11:15 AM',
    publishedBy: 'Michael Addison (Store Manager)',
    changeSummary: [
      'Activated 15% discount popup modal with code SOFTGIRL15',
      'Configured 4 featured products in New Arrivals section',
      'Added Size Guide modal link in navigation'
    ],
    configSnapshot: defaultStorefrontConfig
  },
  {
    id: 'ver-26',
    versionNumber: 26,
    publishedAt: 'Aug 18, 2026 at 09:00 PM',
    publishedBy: 'Avery Osei (Super Admin)',
    changeSummary: [
      'Launched Summer Drop 04 collection spotlight',
      'Updated footer contact phone and WhatsApp concierge hours'
    ],
    configSnapshot: defaultStorefrontConfig
  }
];
