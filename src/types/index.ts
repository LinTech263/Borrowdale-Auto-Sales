export type Condition = 'New' | 'Pre-owned' | 'Certified';
export type VehicleStatus = 'Available' | 'Reserved' | 'Sold' | 'Coming Soon' | 'Draft';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
export type Transmission = 'Automatic' | 'Manual' | 'Dual-Clutch';
export type Drivetrain = '4WD' | 'AWD' | 'RWD' | 'FWD';
export type BodyType = 'SUV' | 'Double Cab' | 'Sedan' | 'Pick-up' | 'Hatchback' | 'Minibus/Van' | 'Coupe';

export interface Vehicle {
  id: string;
  stockNo: string;
  slug: string;
  title: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  condition: Condition;
  status: VehicleStatus;
  categoryIds: string[];
  bodyType: BodyType;
  price: number;
  wasPrice?: number;
  isPriceNegotiable: boolean;
  isPriceOnRequest: boolean;
  hidePrice: boolean;
  mileage: number; // in km
  fuel: FuelType;
  transmission: Transmission;
  drivetrain: Drivetrain;
  engineSize: string; // e.g. "3.3L V6 Twin-Turbo"
  exteriorColor: string;
  interiorColor: string;
  seats: number;
  doors: number;
  location: string;
  featured: boolean;
  images: string[];
  coverImage: string;
  videoUrl?: string;
  description: string;
  features: {
    safety: string[];
    comfort: string[];
    tech: string[];
    exterior: string[];
  };
  serviceHistory?: string;
  listedDate: string; // ISO
  viewsCount: number;
  soldDate?: string; // If sold
  seoTitle?: string;
  seoDescription?: string;
  isDemo?: boolean;
}

// Stored in private collection/storage; NEVER leaked to public client
export interface VehiclePrivate {
  vehicleId: string;
  vin: string;
  costPrice: number;
  markupType: 'percentage' | 'fixed';
  markupValue: number;
  computedSellingPrice: number;
  marginAmount: number;
  marginPercent: number;
  roundingRule: 50 | 100 | 500;
  manualOverridePrice?: number;
  priceHistory: {
    date: string;
    oldPrice: number;
    newPrice: number;
    changedBy: string;
    reason: string;
  }[];
  internalNotes?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  defaultMarkupPercent: number;
  isActive: boolean;
  showOnHome: boolean;
  sortOrder: number;
}

export type LeadType = 'make_offer' | 'enquiry' | 'book_viewing' | 'trade_in' | 'finance' | 'sourcing' | 'callback' | 'new_arrivals';
export type LeadStatus = 'New' | 'Contacted' | 'Negotiating' | 'Viewing Booked' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  type: LeadType;
  status: LeadStatus;
  createdAt: string;
  customerName: string;
  phone: string;
  email?: string;
  preferredContact: 'WhatsApp' | 'Call' | 'Email';
  bestTimeToContact?: string;
  vehicleId?: string;
  vehicleTitle?: string;
  vehicleStockNo?: string;
  vehicleAskingPrice?: number;
  offerAmount?: number;
  hasTradeIn?: boolean;
  tradeInDetails?: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: string;
    askingValuation?: number;
  };
  needsFinance?: boolean;
  message?: string;
  sourcingDetails?: {
    budget: string;
    makeModelDesired: string;
    yearRange: string;
  };
  viewingDateTime?: string;
  assignedStaff?: string;
  internalNotes: string[];
  counterOfferAmount?: number;
  sourceUrl?: string;
}

export interface SiteSettings {
  dealershipName: string;
  legalEntityName: string;
  tagline: string;
  phonePlaceholder: string;
  whatsappPlaceholder: string;
  emailPlaceholder: string;
  addressPlaceholder: string;
  hoursPlaceholder: string;
  locationCoordinates: { lat: number; lng: number };
  googleMapsUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  currency: {
    primary: 'USD';
    secondaryEnabled: boolean;
    secondaryCurrency: 'ZiG';
    usdToZigRate: number; // e.g. 26.5
  };
  brandColors: {
    obsidian: string;
    graphite: string;
    gunmetal: string;
    brass: string;
    ember: string;
    brandGreen: string;
    brandOrange: string;
  };
  defaultCategoryMarkup: number; // e.g. 12%
  notificationEmails: string;
  analytics: {
    ga4Id: string;
    metaPixelId: string;
    searchConsoleCode: string;
  };
}

export interface PageLayoutSettings {
  // Hero Visuals & Gradient
  heroGradientOpacity: 'subtle' | 'light' | 'medium' | 'dark';
  heroSearchBoxPosition: 'below_cta' | 'floating' | 'hidden';
  heroShowBadge: boolean;
  heroBadgeText: string;
  heroCtaPrimaryText: string;
  heroCtaSecondaryText: string;

  // Home Page Section Order & Visibility
  homeSectionsOrder: string[];
  homeSectionsEnabled: Record<string, boolean>;

  // Headings & Text Customizations for Home
  featuredVehiclesTitle: string;
  featuredVehiclesSubtitle: string;
  featuredVehiclesCount: number;
  featuredGridCols: 3 | 4;

  bodyTypesTitle: string;
  bodyTypesSubtitle: string;

  budgetTitle: string;
  budgetSubtitle: string;

  recentlyAddedTitle: string;
  recentlyAddedSubtitle: string;

  makeOfferTeaserTitle: string;
  makeOfferTeaserSubtitle: string;
  makeOfferTeaserDesc: string;
  makeOfferTeaserButtonText: string;

  sellCarBandTitle: string;
  sellCarBandSubtitle: string;
  sellCarBandButtonText: string;

  recentlySoldTitle: string;
  recentlySoldSubtitle: string;

  // Inventory Page Customization
  inventoryTitle: string;
  inventorySubtitle: string;
  inventoryFilterPosition: 'left' | 'top';
  inventoryGridCols: 3 | 4;

  // Vehicle Detail Customization
  vehicleDetailSidebarPosition: 'right' | 'left';
  vehicleDetailShowCalculator: boolean;
  vehicleDetailShowSpecsTable: boolean;
  vehicleDetailCtaText: string;

  // Sell Page Customization
  sellPageTitle: string;
  sellPageSubtitle: string;
  sellPageButtonText: string;

  // Finance Page Customization
  financePageTitle: string;
  financePageSubtitle: string;

  // About Page Customization
  aboutPageTitle: string;
  aboutPageStoryHeading: string;
  aboutPagePillarsHeading: string;

  // Contact Page Customization
  contactPageTitle: string;
  contactPageSubtitle: string;
}

export interface SiteContent {
  heroHeadingOption: 'A' | 'B';
  heroH1_A: string;
  heroH1_B: string;
  heroTagline: string;
  heroSub: string;
  trustBar: { icon: string; title: string; subtitle: string }[];
  whyUs: { title: string; subtitle: string; description: string }[];
  howBuyingWorks: { step: number; title: string; desc: string }[];
  faqs: { id: string; question: string; answer: string; confirmWithOwnerPolicy: boolean }[];
  testimonials: { id: string; clientName: string; vehiclePurchased: string; comment: string; date: string; consentGiven: boolean }[];
  partnerLogos: { id: string; name: string; logoUrl: string }[];
  landingPagesCopy: Record<string, { title: string; metaDesc: string; h1: string; introHtml: string }>;
  layouts?: PageLayoutSettings;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  summary: string;
  readingTime: string;
  publishedDate: string;
  author: string;
  coverImage: string;
  contentMarkdown: string;
  targetKeywords: string[];
}

export interface UserRole {
  role: 'owner' | 'sales_staff';
  name: string;
  email: string;
}
