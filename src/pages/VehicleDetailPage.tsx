import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDealership } from '../context/DealershipContext';
import { SeoHead } from '../components/ui/SeoHead';
import { VehicleCard } from '../components/ui/VehicleCard';
import { MobileBottomBar } from '../components/layout/MobileBottomBar';
import { getPublicVehicleBySlug, getSimilarVehicles, addRecentlyViewed, incrementVehicleViews, getRecentlyViewedIds, getPublicVehicles, createLead } from '../services/dataService';
import { Vehicle } from '../types';
import {
  MessageCircle,
  Phone,
  DollarSign,
  Calendar,
  Share2,
  Printer,
  Heart,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Gauge,
  Layers,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Calculator,
  Camera,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VehicleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    settings,
    formatPrice,
    favourites,
    toggleFavourite,
    compareList,
    toggleCompare,
    setActiveOfferVehicle,
    setActiveViewingVehicle,
    addToast
  } = useDealership();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [similarVehicles, setSimilarVehicles] = useState<Vehicle[]>([]);
  const [recentlyViewedVehicles, setRecentlyViewedVehicles] = useState<Vehicle[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Inline Quick Offer State
  const [inlineOffer, setInlineOffer] = useState<number | ''>('');
  const [inlineName, setInlineName] = useState('');
  const [inlinePhone, setInlinePhone] = useState('');
  const [inlineContactMethod, setInlineContactMethod] = useState<'WhatsApp' | 'Call' | 'Email'>('WhatsApp');
  const [inlineSubmitted, setInlineSubmitted] = useState(false);

  // Payment Estimator State
  const [depositPercent, setDepositPercent] = useState(25);
  const [termMonths, setTermMonths] = useState(36);
  const [interestRate, setInterestRate] = useState(12); // Illustrative 12% USD facility rate

  useEffect(() => {
    if (!slug) return;
    const v = getPublicVehicleBySlug(slug);
    if (!v) {
      navigate('/404', { replace: true });
      return;
    }
    setVehicle(v);
    setActiveImageIndex(0);
    setInlineOffer(Math.round(v.price * 0.95)); // Seed suggested initial offer at 95%

    // Track recently viewed and views count
    addRecentlyViewed(v.id);
    incrementVehicleViews(v.id);

    // Fetch similar vehicles
    const similar = getSimilarVehicles(v);
    setSimilarVehicles(similar);

    // Fetch recently viewed items
    const recentIds = getRecentlyViewedIds().filter(id => id !== v.id);
    const all = getPublicVehicles();
    const recent = recentIds.map(id => all.find(x => x.id === id)).filter(Boolean) as Vehicle[];
    setRecentlyViewedVehicles(recent.slice(0, 3));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, navigate]);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-[#C6A15B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isFav = favourites.includes(vehicle.id);
  const isCompared = compareList.includes(vehicle.id);
  const galleryImages = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [vehicle.coverImage];

  const cleanPhone = settings.phonePlaceholder.replace(/[^\d+]/g, '') || '+263770000000';
  const cleanWhatsApp = settings.whatsappPlaceholder.replace(/[^\d]/g, '') || '263770000000';
  const vehicleUrl = typeof window !== 'undefined' ? window.location.href : `https://borrowdaleautosales.co.zw/vehicle/${vehicle.slug}`;

  // WhatsApp Enquiry Link
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    `Hi Borrowdale Auto Sales, I am viewing the ${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.stockNo}) on your website. Is this vehicle currently available for a test drive in Borrowdale?`
  )}`;

  // Payment Calculation
  const depositAmount = (vehicle.price * depositPercent) / 100;
  const loanPrincipal = Math.max(0, vehicle.price - depositAmount);
  const monthlyInterestRate = interestRate / 100 / 12;
  const estimatedMonthly = monthlyInterestRate > 0
    ? (loanPrincipal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termMonths)) /
      (Math.pow(1 + monthlyInterestRate, termMonths) - 1)
    : loanPrincipal / termMonths;

  // Handle Share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle.year} ${vehicle.make} ${vehicle.model} - Borrowdale Auto Sales`,
          text: `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model} for sale in Harare:`,
          url: window.location.href,
        });
      } catch (err) {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Vehicle link copied to clipboard', 'info');
    }
  };

  // Handle Print Spec Sheet
  const handlePrint = () => {
    window.print();
  };

  // Inline Quick Offer Submission
  const handleInlineOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineOffer || !inlineName || !inlinePhone) {
      addToast('Please fill out all offer fields', 'error');
      return;
    }

    createLead({
      type: 'make_offer',
      status: 'New',
      customerName: inlineName.trim(),
      phone: inlinePhone.trim(),
      preferredContact: inlineContactMethod,
      vehicleId: vehicle.id,
      vehicleTitle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      vehicleStockNo: vehicle.stockNo,
      vehicleAskingPrice: vehicle.price,
      offerAmount: Number(inlineOffer),
      message: `Submitted inline offer on vehicle detail page.`,
      sourceUrl: `/vehicle/${vehicle.slug}`
    });

    setInlineSubmitted(true);
    confetti({ particleCount: 70, spread: 50 });
    addToast('Your offer has been submitted directly to the principal!', 'success');
  };

  // Quick Action: Request More Photos/Video
  const handleRequestMoreMedia = () => {
    const text = `Hi Borrowdale Auto Sales, could you please send me additional photos, undercarriage shots, and a cold-start walkaround video of the ${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.stockNo})?`;
    window.open(`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Google Schema.org Car JSON-LD
  const carSchema = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    'name': `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`,
    'description': vehicle.description,
    'image': vehicle.coverImage,
    'vehicleIdentificationNumber': vehicle.stockNo,
    'productionDate': vehicle.year.toString(),
    'brand': {
      '@type': 'Brand',
      'name': vehicle.make
    },
    'model': vehicle.model,
    'itemCondition': vehicle.condition === 'New'
      ? 'https://schema.org/NewCondition'
      : 'https://schema.org/UsedCondition',
    'mileageFromOdometer': {
      '@type': 'QuantitativeValue',
      'value': vehicle.mileage,
      'unitCode': 'KMT'
    },
    'fuelType': vehicle.fuel,
    'vehicleTransmission': vehicle.transmission,
    'bodyType': vehicle.bodyType,
    'offers': {
      '@type': 'Offer',
      'price': vehicle.price,
      'priceCurrency': 'USD',
      'availability': vehicle.status === 'Sold'
        ? 'https://schema.org/SoldOut'
        : 'https://schema.org/InStock',
      'seller': {
        '@type': 'AutoDealer',
        'name': 'Borrowdale Auto Sales',
        'telephone': settings.phonePlaceholder,
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Borrowdale, Harare',
          'addressCountry': 'ZW'
        }
      }
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://borrowdaleautosales.co.zw/'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Inventory',
        'item': 'https://borrowdaleautosales.co.zw/inventory'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        'item': vehicleUrl
      }
    ]
  };

  const h1Title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} for Sale in Harare`;

  return (
    <div className="min-h-screen bg-white text-gray-900 py-8 pb-24 md:pb-16 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title={`${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} for Sale in Harare | US$${vehicle.price.toLocaleString('en-US')} | Borrowdale Auto Sales`}
        description={`Inspect this ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} in Borrowdale, Harare. US$${vehicle.price.toLocaleString('en-US')}, ${vehicle.mileage.toLocaleString('en-US')}km, verified service history. Make an offer or WhatsApp us now.`}
        ogType="product"
        ogImage={vehicle.coverImage}
        canonicalUrl={vehicleUrl}
        schemaJsonLd={[carSchema, breadcrumbSchema]}
      />

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb row & Share / Print actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 no-print">
          <nav className="flex items-center gap-2 text-xs text-gray-500 font-mono">
            <Link to="/" className="hover:text-[#C6A15B]">Home</Link>
            <span>/</span>
            <Link to="/inventory" className="hover:text-[#C6A15B]">Inventory</Link>
            <span>/</span>
            <Link to={`/cars/${vehicle.make.toLowerCase()}`} className="hover:text-[#C6A15B]">{vehicle.make}</Link>
            <span>/</span>
            <span className="text-[#C6A15B] truncate max-w-[200px] sm:max-w-none">{vehicle.stockNo}</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavourite(vehicle.id)}
              className={`p-2 rounded-[2px] border text-xs flex items-center gap-1.5 transition-colors shadow-xs ${
                isFav
                  ? 'bg-[#B3261E] border-[#B3261E] text-white'
                  : 'bg-white border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isFav ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => toggleCompare(vehicle.id)}
              className={`p-2 rounded-[2px] border text-xs flex items-center gap-1.5 transition-colors shadow-xs ${
                isCompared
                  ? 'bg-[#C6A15B] border-[#C6A15B] text-gray-950 font-bold'
                  : 'bg-white border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isCompared ? 'Compared' : 'Compare'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-[2px] bg-white border border-gray-300 text-gray-600 hover:text-gray-900 text-xs flex items-center gap-1.5 shadow-xs"
              aria-label="Share listing"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-[2px] bg-white border border-gray-300 text-gray-600 hover:text-gray-900 text-xs flex items-center gap-1.5 shadow-xs"
              aria-label="Print spec sheet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Spec Sheet</span>
            </button>
          </div>
        </div>

        {/* Printable Header Banner */}
        <div className="hidden print-only mb-6 border-b-2 border-black pb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wider">{settings.dealershipName}</h1>
              <p className="text-sm font-semibold">{settings.addressPlaceholder} | {settings.phonePlaceholder}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono font-bold">Stock Ref: {vehicle.stockNo}</span>
              <p className="text-xl font-bold">US${vehicle.price.toLocaleString('en-US')}</p>
            </div>
          </div>
        </div>

        {/* Top Split Layout: Gallery on Left, Pricing & Primary CTAs on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* ==================== GALLERY (7 cols) ==================== */}
          <div className="lg:col-span-7 space-y-3">
            {/* Main Stage Image */}
            <div className="relative aspect-[16/10] bg-gray-100 rounded-[3px] overflow-hidden border border-gray-200 shadow-sm">
              <img
                src={galleryImages[activeImageIndex] || vehicle.coverImage}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} view ${activeImageIndex + 1}`}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-500 hover:scale-102"
                onClick={() => setLightboxOpen(true)}
              />

              {/* Status and Demo Badges */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10 pointer-events-none">
                {vehicle.status === 'Sold' ? (
                  <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-[#B3261E] text-white rounded-[2px] shadow-md">
                    SOLD
                  </span>
                ) : vehicle.status === 'Reserved' ? (
                  <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-[#EA580C] text-white rounded-[2px] shadow-md">
                    RESERVED
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-white/95 text-gray-900 border border-gray-200 rounded-[2px] shadow-sm">
                    {vehicle.condition}
                  </span>
                )}
                {vehicle.isDemo && (
                  <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider bg-gray-950/85 text-[#C6A15B] border border-[#C6A15B]/40 rounded-[2px]">
                    DEMO – REPLACE IN ADMIN
                  </span>
                )}
              </div>

              {/* Expand Lightbox Button */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-3 right-3 p-2 rounded-[2px] bg-white/90 text-gray-800 backdrop-blur-sm border border-gray-200 hover:text-[#C6A15B] transition-colors shadow-sm"
                aria-label="Expand Fullscreen Lightbox"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Image Prev / Next Navigation Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((activeImageIndex - 1 + galleryImages.length) % galleryImages.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-gray-800 flex items-center justify-center hover:bg-white transition-colors shadow-md"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((activeImageIndex + 1) % galleryImages.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-gray-800 flex items-center justify-center hover:bg-white transition-colors shadow-md"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`aspect-[16/10] rounded-[2px] overflow-hidden border transition-all ${
                      activeImageIndex === i
                        ? 'border-[#C6A15B] ring-2 ring-[#C6A15B] scale-102 shadow-xs'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Media Request */}
            <div className="pt-2 flex items-center justify-between text-xs text-gray-600 bg-gray-50 border border-gray-200 p-3 rounded-[2px]">
              <span>Need a personalized video walkaround or specific photos?</span>
              <button
                onClick={handleRequestMoreMedia}
                className="text-[#C6A15B] hover:underline font-semibold flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Request on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* ==================== PRICING & PRIMARY CTAs (5 cols) ==================== */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-white border border-gray-200 rounded-[4px] p-6 md:p-8 space-y-6 shadow-md">
              {/* Title & Stock No */}
              <div className="border-b border-gray-100 pb-5">
                <div className="flex items-center justify-between text-xs font-mono text-gray-500 mb-1.5">
                  <span>Stock: <strong className="text-gray-900">{vehicle.stockNo}</strong></span>
                  <span className="text-[#C6A15B] uppercase font-sans font-semibold tracking-wider">{vehicle.location}</span>
                </div>
                <h1 className="font-heading text-3xl sm:text-4xl font-black uppercase leading-tight text-gray-900">
                  {h1Title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 font-sans">
                  {vehicle.trim}
                </p>
              </div>

              {/* Price Block */}
              <div className="bg-slate-50 border border-gray-200 p-4 rounded-[3px]">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1">
                  Selling Price (USD)
                </span>
                {vehicle.hidePrice || vehicle.isPriceOnRequest ? (
                  <div>
                    <span className="font-heading text-3xl font-bold text-[#C6A15B]">
                      Price On Request
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Direct confidential quotation available via sales desk.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-heading text-4xl sm:text-5xl font-black text-gray-900">
                        {formatPrice(vehicle.price, false)}
                      </span>
                      {vehicle.wasPrice && vehicle.wasPrice > vehicle.price && (
                        <span className="text-sm sm:text-base text-gray-400 line-through font-mono">
                          US${vehicle.wasPrice.toLocaleString('en-US')}
                        </span>
                      )}
                    </div>
                    {/* Optional secondary ZiG display */}
                    {settings.currency.secondaryEnabled && (
                      <span className="block text-xs font-mono text-gray-500 mt-1">
                        Equivalent: approx. ZiG {Math.round(vehicle.price * settings.currency.usdToZigRate).toLocaleString('en-US')}
                      </span>
                    )}
                    {vehicle.isPriceNegotiable && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#0E7A33]/10 text-[#0E7A33] border border-[#0E7A33]/20 text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Price Negotiable • Serious Offers Welcomed</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-3">
                {/* 1. WhatsApp Button (Primary) */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-[2px] bg-[#0E7A33] text-white font-heading text-lg font-bold uppercase tracking-wider hover:bg-[#0E7A33]/90 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp About This Car</span>
                </a>

                {/* 2. Make an Offer Button */}
                <button
                  onClick={() => setActiveOfferVehicle(vehicle)}
                  className="w-full py-3.5 px-4 rounded-[2px] bg-[#C6A15B] text-gray-950 font-heading text-lg font-bold uppercase tracking-wider hover:bg-[#A8843F] hover:text-white transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <DollarSign className="w-5 h-5" />
                  <span>Make An Offer</span>
                </button>

                {/* 3. Book Viewing & Call Row */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setActiveViewingVehicle(vehicle)}
                    className="py-2.5 px-3 rounded-[2px] bg-white border border-gray-300 text-gray-800 font-heading text-xs font-bold uppercase tracking-wider hover:border-[#C6A15B] hover:text-[#C6A15B] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Calendar className="w-4 h-4 text-[#C6A15B]" />
                    <span>Book Viewing</span>
                  </button>

                  <a
                    href={`tel:${cleanPhone}`}
                    className="py-2.5 px-3 rounded-[2px] bg-white border border-gray-300 text-gray-800 font-heading text-xs font-bold uppercase tracking-wider hover:border-[#C6A15B] hover:text-[#C6A15B] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Phone className="w-4 h-4 text-[#C6A15B]" />
                    <span>Call Showroom</span>
                  </a>
                </div>
              </div>

              {/* Trust Checklist */}
              <div className="pt-2 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C6A15B] shrink-0" />
                  <span>Clear title, verified chassis & ZIMRA documentation in order</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C6A15B] shrink-0" />
                  <span>Private viewings ready at Borrowdale showroom today</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== SPECS & DESCRIPTION GRID ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Key Specs Grid & Features Checklist (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Key Specs Grid */}
            <div className="bg-white border border-gray-200 rounded-[4px] p-6 sm:p-8 shadow-sm">
              <h2 className="font-heading text-2xl font-bold uppercase mb-6 flex items-center gap-2 text-gray-900">
                <Gauge className="w-5 h-5 text-[#C6A15B]" />
                <span>Vehicle Specifications</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                {[
                  { label: 'Year', value: vehicle.year },
                  { label: 'Mileage', value: `${vehicle.mileage.toLocaleString('en-US')} km` },
                  { label: 'Fuel Type', value: vehicle.fuel },
                  { label: 'Transmission', value: vehicle.transmission },
                  { label: 'Drivetrain', value: vehicle.drivetrain },
                  { label: 'Engine', value: vehicle.engineSize },
                  { label: 'Body Type', value: vehicle.bodyType },
                  { label: 'Condition', value: vehicle.condition },
                  { label: 'Exterior Color', value: vehicle.exteriorColor },
                  { label: 'Interior Color', value: vehicle.interiorColor },
                  { label: 'Seating Capacity', value: `${vehicle.seats} Passengers` },
                  { label: 'Doors', value: `${vehicle.doors} Doors` },
                ].map((spec, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-gray-200 rounded-[2px]">
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">
                      {spec.label}
                    </span>
                    <strong className="text-xs text-gray-900 font-sans mt-0.5 block truncate">
                      {spec.value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Detailed Description & Provenance */}
            <div className="bg-white border border-gray-200 rounded-[4px] p-6 sm:p-8 shadow-sm">
              <h2 className="font-heading text-2xl font-bold uppercase mb-4 text-gray-900">
                Dealership Notes & Overview
              </h2>
              <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                <p>{vehicle.description}</p>
                {vehicle.serviceHistory && (
                  <div className="p-4 bg-slate-50 border-l-3 border-[#C6A15B] rounded-[2px] text-xs">
                    <strong className="block text-gray-900 font-bold uppercase mb-1">
                      Service History & Inspection Verification
                    </strong>
                    <p className="text-gray-600">{vehicle.serviceHistory}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Features Checklist Grouped */}
            <div className="bg-white border border-gray-200 rounded-[4px] p-6 sm:p-8 shadow-sm">
              <h2 className="font-heading text-2xl font-bold uppercase mb-6 flex items-center gap-2 text-gray-900">
                <Layers className="w-5 h-5 text-[#C6A15B]" />
                <span>Installed Equipment & Packages</span>
              </h2>

              <div className="space-y-6">
                {/* Safety */}
                {vehicle.features.safety && vehicle.features.safety.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#C6A15B] mb-2.5">
                      Safety & Assistance Systems
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {vehicle.features.safety.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0E7A33] shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comfort */}
                {vehicle.features.comfort && vehicle.features.comfort.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#C6A15B] mb-2.5">
                      Interior & Occupant Comfort
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {vehicle.features.comfort.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0E7A33] shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech */}
                {vehicle.features.tech && vehicle.features.tech.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#C6A15B] mb-2.5">
                      Infotainment & Cockpit Technology
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {vehicle.features.tech.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0E7A33] shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exterior */}
                {vehicle.features.exterior && vehicle.features.exterior.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#C6A15B] mb-2.5">
                      Exterior & Wheels
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {vehicle.features.exterior.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0E7A33] shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Inline Quick Offer Teaser & Finance Estimator (5 cols) */}
          <div className="lg:col-span-5 space-y-8 no-print">
            {/* Inline Make an Offer Form */}
            <div className="bg-white border-2 border-[#C6A15B]/40 rounded-[4px] p-6 sm:p-8 shadow-md">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
                Direct Negotiation
              </span>
              <h2 className="font-heading text-2xl font-bold uppercase mt-1 mb-2 text-gray-900">
                Submit An Offer On This Car
              </h2>
              <p className="text-xs text-gray-600 mb-5">
                Tell us what you would like to pay in USD. Offers go directly to the dealership principal.
              </p>

              {inlineSubmitted ? (
                <div className="p-4 bg-[#0E7A33]/10 border border-[#0E7A33] rounded text-center text-xs text-gray-900">
                  <CheckCircle2 className="w-8 h-8 text-[#0E7A33] mx-auto mb-2" />
                  <strong className="block text-sm mb-1 text-[#0E7A33]">Offer Transmitted</strong>
                  We have received your offer of US${Number(inlineOffer).toLocaleString('en-US')}. Our team will WhatsApp you shortly.
                </div>
              ) : (
                <form onSubmit={handleInlineOfferSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-gray-700 mb-1">
                      Proposed Price (US$)*
                    </label>
                    <input
                      type="number"
                      required
                      min={1000}
                      step={500}
                      value={inlineOffer}
                      onChange={e => setInlineOffer(e.target.value ? Number(e.target.value) : '')}
                      placeholder={`e.g. ${Math.round(vehicle.price * 0.95)}`}
                      className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-gray-700 mb-1">
                        Full Name*
                      </label>
                      <input
                        type="text"
                        required
                        value={inlineName}
                        onChange={e => setInlineName(e.target.value)}
                        placeholder="e.g. Tendai"
                        className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-xs text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-gray-700 mb-1">
                        Phone / WhatsApp*
                      </label>
                      <input
                        type="tel"
                        required
                        value={inlinePhone}
                        onChange={e => setInlinePhone(e.target.value)}
                        placeholder="077..."
                        className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-xs text-gray-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-[2px] bg-[#C6A15B] text-gray-950 font-heading text-base font-bold uppercase tracking-wider hover:bg-[#A8843F] hover:text-white transition-colors shadow-xs"
                  >
                    Transmit My Offer
                  </button>

                  <span className="block text-[10px] text-center text-gray-500">
                    Non-binding • Privacy protected • Immediate response
                  </span>
                </form>
              )}
            </div>

            {/* Illustrative Finance Estimator */}
            <div className="bg-white border border-gray-200 rounded-[4px] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-[#C6A15B]">
                <Calculator className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Facility Estimator
                </span>
              </div>
              <h2 className="font-heading text-2xl font-bold uppercase text-gray-900 mb-1">
                Payment Estimator
              </h2>
              <p className="text-xs text-gray-600 mb-5">
                Calculate illustrative monthly repayments for corporate or private banking facilities.
              </p>

              <div className="space-y-4 text-xs">
                {/* Deposit Slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Deposit: {depositPercent}%</span>
                    <span className="font-mono text-gray-900 font-semibold">US${Math.round(depositAmount).toLocaleString('en-US')}</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    step={5}
                    value={depositPercent}
                    onChange={e => setDepositPercent(Number(e.target.value))}
                    className="w-full accent-[#C6A15B]"
                  />
                </div>

                {/* Term */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Term:</span>
                    <span className="font-mono text-gray-900 font-semibold">{termMonths} Months</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[12, 24, 36, 48].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTermMonths(m)}
                        className={`py-1.5 rounded-[2px] border text-xs font-mono ${
                          termMonths === m
                            ? 'bg-[#C6A15B] border-[#C6A15B] text-gray-950 font-bold'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculated Result */}
                <div className="p-4 bg-slate-50 border border-gray-200 rounded-[2px] text-center">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">
                    Estimated Monthly Repayment
                  </span>
                  <strong className="font-heading text-3xl font-black text-[#C6A15B] mt-1 block">
                    US${Math.round(estimatedMonthly).toLocaleString('en-US')} / mo
                  </strong>
                  <span className="text-[10px] text-gray-500 block mt-1">
                    Illustrative calculation only. Excludes bank facility fees and insurance.
                  </span>
                </div>

                <Link
                  to="/finance"
                  className="block text-center py-2 text-xs font-semibold text-[#C6A15B] hover:underline"
                >
                  Learn more about vehicle financing in Zimbabwe →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== SIMILAR VEHICLES ==================== */}
        {similarVehicles.length > 0 && (
          <div className="mb-14 no-print">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
                  Comparable Stock
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase text-gray-900">
                  Similar Vehicles in Showroom
                </h3>
              </div>
              <Link to="/inventory" className="text-xs text-[#C6A15B] hover:underline font-semibold">
                View All Inventory →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarVehicles.map(v => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        )}

        {/* ==================== RECENTLY VIEWED ==================== */}
        {recentlyViewedVehicles.length > 0 && (
          <div className="mb-12 no-print">
            <h3 className="font-heading text-xl font-bold uppercase text-gray-700 mb-4">
              Recently Viewed By You
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentlyViewedVehicles.map(v => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Gallery Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 backdrop-blur-md">
          <div className="flex justify-between items-center text-xs text-gray-300">
            <span className="font-mono">
              {activeImageIndex + 1} / {galleryImages.length} • {vehicle.year} {vehicle.make} {vehicle.model}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded bg-white/20 text-white hover:text-[#C6A15B]"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center p-4">
            <img
              src={galleryImages[activeImageIndex]}
              alt={`Full size ${activeImageIndex + 1}`}
              className="max-h-[80vh] max-w-full object-contain rounded"
            />

            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((activeImageIndex - 1 + galleryImages.length) % galleryImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-[#C6A15B] hover:text-gray-950 transition-colors shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((activeImageIndex + 1) % galleryImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-[#C6A15B] hover:text-gray-950 transition-colors shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="flex justify-center gap-2 overflow-x-auto py-2">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`w-14 h-10 rounded border overflow-hidden shrink-0 ${
                  activeImageIndex === i ? 'border-[#C6A15B] ring-2 ring-[#C6A15B]' : 'border-transparent opacity-50'
                }`}
              >
                <img src={img} alt="Thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Bottom Action Bar (Sticky) */}
      <MobileBottomBar vehicle={vehicle} />
    </div>
  );
};
