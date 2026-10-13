import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDealership } from '../context/DealershipContext';
import { SeoHead } from '../components/ui/SeoHead';
import { VehicleCard } from '../components/ui/VehicleCard';
import { Condition, BodyType } from '../types';
import { heroShowroomSlides } from '../data/seedData';
import {
  ShieldCheck,
  FileText,
  Calendar,
  MessageCircle,
  Search,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  DollarSign,
  Car,
  ExternalLink,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { vehicles, content, settings, guides } = useDealership();
  const navigate = useNavigate();

  // Search Bar State
  const [conditionTab, setConditionTab] = useState<'All' | Condition>('All');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedBody, setSelectedBody] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Hero Showroom Carousel State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const slideCount = heroShowroomSlides.length;
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    slideTimerRef.current = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % slideCount);
    }, 5500);

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [isPlaying, slideCount]);

  const handleNextSlide = () => {
    setCurrentSlideIndex(prev => (prev + 1) % slideCount);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex(prev => (prev - 1 + slideCount) % slideCount);
  };

  // Available Makes & Body types with counts
  const makes = Array.from(new Set(vehicles.map(v => v.make))).sort();
  const bodyTypes: { type: BodyType; label: string }[] = [
    { type: 'SUV', label: 'SUV' },
    { type: 'Double Cab', label: 'Double Cab' },
    { type: 'Sedan', label: 'Sedan' },
    { type: 'Coupe', label: 'Coupe / Sports' },
    { type: 'Pick-up', label: 'Pick-up' },
    { type: 'Hatchback', label: 'Hatchback' },
    { type: 'Minibus/Van', label: 'Minibus / Van' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (conditionTab !== 'All') params.set('condition', conditionTab);
    if (selectedMake) params.set('make', selectedMake);
    if (selectedBody) params.set('body', selectedBody);
    if (selectedBudget) params.set('budget', selectedBudget);
    navigate(`/inventory?${params.toString()}`);
  };

  // Filtered vehicle subsets
  const featuredVehicles = vehicles.filter(v => v.featured && v.status === 'Available');
  const recentlyAdded = [...vehicles]
    .filter(v => v.status === 'Available')
    .sort((a, b) => new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime())
    .slice(0, 6);
  const recentlySold = vehicles.filter(v => v.status === 'Sold');

  const cleanWhatsApp = settings.whatsappPlaceholder.replace(/[^\d]/g, '') || '263770000000';
  const cleanPhone = settings.phonePlaceholder.replace(/[^\d+]/g, '') || '+263770000000';
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    'Hi Borrowdale Auto Sales, I am browsing your showroom vehicles online. Please assist me with your current stock.'
  )}`;

  // FAQ schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': content.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  const heroH1 = content.heroHeadingOption === 'A' ? content.heroH1_A : content.heroH1_B;
  const activeSlide = heroShowroomSlides[currentSlideIndex];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SeoHead
        title="Borrowdale Auto Sales | Premium Cars for Sale in Harare"
        description="Browse hand-picked premium and pre-owned cars in Borrowdale, Harare. Transparent pricing, easy offers, WhatsApp support. View stock or make an offer today."
        canonicalUrl="https://borrowdaleautosales.co.zw/"
        schemaJsonLd={faqSchema}
      />

      {/* ==================== 1. HERO SECTION WITH SHOWROOM CAROUSEL ==================== */}
      <section
        className="relative min-h-[92vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-16 pb-20 overflow-hidden border-b border-gray-200"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {/* Background Showroom Carousel Images */}
        <div className="absolute inset-0 z-0 bg-gray-950 overflow-hidden">
          {heroShowroomSlides.map((slide, index) => {
            const isActive = index === currentSlideIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`w-full h-full object-cover object-center transition-transform duration-7000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>
            );
          })}

          {/* Luxury Showroom Overlay Gradient */}
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-gray-950/80 via-gray-950/70 to-gray-950/90 pointer-events-none" />
          <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(198,161,91,0.25),rgba(0,0,0,0.6))] pointer-events-none" />
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="absolute inset-y-0 left-3 sm:left-6 flex items-center z-30 pointer-events-auto">
          <button
            onClick={handlePrevSlide}
            aria-label="Previous Showroom View"
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all shadow-lg hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-3 sm:right-6 flex items-center z-30 pointer-events-auto">
          <button
            onClick={handleNextSlide}
            aria-label="Next Showroom View"
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all shadow-lg hover:scale-105"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Content Box */}
        <div className="relative z-30 max-w-5xl mx-auto text-center mt-4">
          {/* Active Showroom Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-[#C6A15B]/50 backdrop-blur-md mb-6 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#0E7A33] animate-pulse" />
            <span className="font-sans text-xs uppercase tracking-wider text-white font-medium">
              {activeSlide.badge || 'Borrowdale Showroom Floor'}
            </span>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-[#C6A15B] text-xs font-serif-accent italic">
              {activeSlide.title}
            </span>
          </div>

          {/* Accent Tagline */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-[1px] w-8 bg-[#C6A15B]" />
            <span className="font-serif-accent text-lg sm:text-2xl text-[#C6A15B] tracking-wide font-normal">
              {content.heroTagline}
            </span>
            <span className="h-[1px] w-8 bg-[#C6A15B]" />
          </div>

          {/* Main H1 Heading */}
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.95] text-white drop-shadow-md mb-6">
            {heroH1}
          </h1>

          {/* Sub-headline */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-200 font-normal leading-relaxed mb-8 drop-shadow-sm">
            {content.heroSub}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
            <Link
              to="/inventory"
              className="w-full sm:w-auto px-8 py-3.5 rounded-[2px] bg-[#C6A15B] text-gray-950 font-heading text-lg font-bold uppercase tracking-wider hover:bg-[#A8843F] hover:text-white transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <span>Browse Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-[2px] bg-[#0E7A33] text-white font-heading text-lg font-bold uppercase tracking-wider hover:bg-[#0E7A33]/90 transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Us Now</span>
            </a>
          </div>

          {/* Inline Filter Search Bar with Glass effect */}
          <div className="w-full max-w-4xl mx-auto bg-white/95 border border-gray-200 rounded-[4px] p-4 sm:p-5 shadow-2xl backdrop-blur-md text-left text-gray-900">
            {/* Condition Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 mb-4 border-b border-gray-200 pb-3 overflow-x-auto">
              {(['All', 'New', 'Pre-owned', 'Certified'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setConditionTab(tab)}
                  className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-colors shrink-0 ${
                    conditionTab === tab
                      ? 'bg-[#C6A15B] text-gray-950 font-bold shadow-xs'
                      : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'All' ? 'All Conditions' : tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Make Select */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Make
                </label>
                <select
                  value={selectedMake}
                  onChange={e => setSelectedMake(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 text-xs rounded-[2px] px-3 py-2.5 focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                >
                  <option value="">All Makes</option>
                  {makes.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Body Type Select */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Body Type
                </label>
                <select
                  value={selectedBody}
                  onChange={e => setSelectedBody(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 text-xs rounded-[2px] px-3 py-2.5 focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                >
                  <option value="">All Body Types</option>
                  {bodyTypes.map(b => (
                    <option key={b.type} value={b.type}>{b.label}</option>
                  ))}
                </select>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Budget (USD)
                </label>
                <select
                  value={selectedBudget}
                  onChange={e => setSelectedBudget(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 text-xs rounded-[2px] px-3 py-2.5 focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                >
                  <option value="">Any Budget</option>
                  <option value="under-30k">Under US$30,000</option>
                  <option value="30k-60k">US$30,000 – US$60,000</option>
                  <option value="60k-100k">US$60,000 – US$100,000</option>
                  <option value="100k-plus">US$100,000+</option>
                </select>
              </div>

              {/* Search Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-[2px] bg-[#C6A15B] text-gray-950 font-heading text-base font-bold uppercase tracking-wider hover:bg-[#A8843F] hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Stock</span>
                </button>
              </div>
            </form>
          </div>

          {/* Carousel Slide Indicators and Controls */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white/70 hover:text-white p-1 transition-colors"
              title={isPlaying ? 'Pause Showroom Carousel' : 'Play Showroom Carousel'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <div className="flex items-center gap-1.5">
              {heroShowroomSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  aria-label={`Jump to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlideIndex
                      ? 'w-8 bg-[#C6A15B]'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
            <span className="text-white/70 font-mono text-xs">
              {currentSlideIndex + 1} / {slideCount}
            </span>
          </div>
        </div>
      </section>

      {/* ==================== 2. TRUST BAR ==================== */}
      <section className="bg-slate-50 border-b border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {content.trustBar.map((item, idx) => {
            const icons = [ShieldCheck, FileText, Calendar, MessageCircle];
            const Icon = icons[idx % icons.length];
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded bg-white border border-gray-200 shadow-xs flex items-center justify-center text-[#C6A15B] shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading text-base font-bold uppercase tracking-wide text-gray-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-snug mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== 3. FEATURED VEHICLES ==================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-gray-200">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
              Hand-Picked Selection
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase mt-1 text-gray-900">
              Featured Showroom Stock
            </h2>
          </div>
          <Link
            to="/inventory"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C6A15B] hover:text-[#A8843F] transition-colors"
          >
            <span>View All Available Stock</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVehicles.slice(0, 6).map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {/* ==================== 4. BROWSE BY BODY TYPE ==================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
              Categorized Stock
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase mt-1 text-gray-900">
              Browse By Body Type
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              Filter by vehicle architecture tailored to executive transport or Zimbabwean off-road driving.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {bodyTypes.slice(0, 6).map(b => {
              const count = vehicles.filter(v => v.bodyType === b.type && v.status === 'Available').length;
              return (
                <Link
                  key={b.type}
                  to={`/inventory?body=${encodeURIComponent(b.type)}`}
                  className="bg-white border border-gray-200 rounded-[3px] p-5 text-center flex flex-col items-center justify-center group hover:border-[#C6A15B] hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded bg-slate-50 border border-gray-200 flex items-center justify-center text-[#C6A15B] group-hover:scale-110 group-hover:bg-[#C6A15B]/10 transition-transform mb-3">
                    <Car className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading text-lg font-bold uppercase tracking-wide text-gray-900 group-hover:text-[#C6A15B] transition-colors">
                    {b.label}
                  </h4>
                  <span className="text-xs text-gray-500 font-mono mt-1">
                    {count} {count === 1 ? 'vehicle' : 'vehicles'}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 5. SHOP BY BUDGET ==================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
              Direct Price Filtering
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase mt-1 text-gray-900">
              Shop By Budget
            </h2>
          </div>
          <span className="text-xs text-gray-500">
            Prices listed in honest USD with transparent documentation
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Under US$30,000', query: 'under-30k', sub: 'Compact SUVs & Hatchbacks' },
            { label: 'US$30,000 – US$60,000', query: '30k-60k', sub: 'Fortuner, Hilux & E-Class' },
            { label: 'US$60,000 – US$100,000', query: '60k-100k', sub: 'Raptor & Executive Saloons' },
            { label: 'US$100,000+', query: '100k-plus', sub: 'Land Cruiser 300, G63 & Range Rover' },
          ].map(band => (
            <Link
              key={band.query}
              to={`/inventory?budget=${band.query}`}
              className="bg-white border border-gray-200 rounded-[3px] p-5 flex flex-col justify-between group hover:border-[#C6A15B] hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between text-[#C6A15B] mb-2">
                <DollarSign className="w-5 h-5" />
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-heading text-xl font-bold uppercase text-gray-900 group-hover:text-[#C6A15B] transition-colors">
                {band.label}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {band.sub}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================== 6. RECENTLY ADDED ==================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0E7A33]">
                Fresh Floor Arrivals
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase mt-1 text-gray-900">
                Recently Added to Showroom
              </h2>
            </div>
            <Link
              to="/inventory"
              className="text-xs font-semibold uppercase tracking-wider text-[#C6A15B] hover:text-[#A8843F]"
            >
              See All Fresh Stock →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyAdded.slice(0, 3).map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 7. WHY BORROWDALE AUTO SALES ==================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
            Our Standards
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase mt-1 text-gray-900">
            Why Borrowdale Auto Sales
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            Rigorous engineering standards paired with uptown Borrowdale service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.whyUs.map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-[3px] p-6 flex flex-col justify-between shadow-xs hover:border-[#C6A15B] transition-all">
              <div>
                <span className="font-mono text-xs text-[#C6A15B] font-bold">0{idx + 1}</span>
                <h3 className="font-heading text-2xl font-bold uppercase mt-2 mb-1 text-gray-900">
                  {item.title}
                </h3>
                <span className="inline-block text-xs font-serif-accent text-[#C6A15B] mb-3">
                  {item.subtitle}
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 8. HOW BUYING WORKS ==================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
              Seamless Workflow
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase mt-1 text-gray-900">
              How Buying Works
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              Four straightforward steps from first WhatsApp enquiry to keys in your hand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {content.howBuyingWorks.map(step => (
              <div key={step.step} className="p-6 rounded-[3px] bg-white border border-gray-200 shadow-xs relative">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-[#C6A15B] text-[#C6A15B] font-heading text-xl font-bold flex items-center justify-center mb-4">
                  {step.step}
                </div>
                <h3 className="font-heading text-xl font-bold uppercase text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 9. MAKE AN OFFER EXPLAINER ==================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center bg-white">
        <div className="bg-white border-2 border-[#C6A15B]/40 rounded-[4px] p-8 sm:p-12 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[radial-gradient(circle,rgba(198,161,91,0.15),transparent_70%)] pointer-events-none" />
          
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
            Interactive Price Negotiation
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase mt-1 mb-4 text-gray-900">
            See It. Price It. Make Your Offer.
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Seen a car you like on our floor? Tell us what you’d pay. We’ll come back to you personally without awkward sales pressure. Non-binding, direct to the dealership principal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/inventory"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#C6A15B] text-gray-950 font-heading text-lg font-bold uppercase tracking-wider rounded-[2px] hover:bg-[#A8843F] hover:text-white transition-colors shadow-md"
            >
              Choose a Vehicle to Make an Offer
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-white border border-gray-300 text-gray-900 font-heading text-lg font-bold uppercase tracking-wider rounded-[2px] hover:border-[#C6A15B] hover:text-[#C6A15B] transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageCircle className="w-5 h-5 text-[#0E7A33]" />
              <span>Discuss via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* ==================== 10. SELL OR TRADE IN CTA BAND ==================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
              Immediate Settlement
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase mt-1 text-white">
              Your Car Has Value. Let’s Put a Number On It.
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
              Send a few details and photos. We’ll respond with a valuation and a trade-in offer on your next car at our Borrowdale showroom.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              to="/sell-your-car"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C6A15B] text-gray-950 font-heading text-lg font-bold uppercase tracking-wider rounded-[2px] hover:bg-[#A8843F] hover:text-white transition-colors shadow-lg"
            >
              <span>Get My Valuation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== 11. RECENTLY SOLD GALLERY ==================== */}
      {recentlySold.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B3261E]">
                Proof of Turnover
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase mt-1 text-gray-900">
                Sold. Delivered. Smiling.
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                A look at cars that recently found new owners in Harare and beyond.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlySold.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>
      )}

      {/* ==================== 12. TESTIMONIALS (Admin-managed) ==================== */}
      {content.testimonials.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
                Client Experiences
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase mt-1 text-gray-900">
                From Our Clients
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.testimonials.map(t => (
                <div key={t.id} className="bg-white border border-gray-200 rounded-[3px] p-6 flex flex-col justify-between shadow-xs">
                  <p className="text-xs text-gray-700 italic leading-relaxed mb-4">
                    "{t.comment}"
                  </p>
                  <div>
                    <strong className="block text-sm font-bold text-gray-900">{t.clientName}</strong>
                    <span className="text-xs text-[#C6A15B] font-medium">{t.vehiclePurchased}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== 13. BUYING GUIDES TEASER ==================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-200">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
              Market Insights & Diligence
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase mt-1 text-gray-900">
              Zimbabwe Motoring Guides
            </h2>
          </div>
          <Link
            to="/guides"
            className="text-xs font-semibold uppercase tracking-wider text-[#C6A15B] hover:text-[#A8843F]"
          >
            All Guides ({guides.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.slice(0, 3).map(guide => (
            <Link
              key={guide.id}
              to={`/guides/${guide.slug}`}
              className="bg-white border border-gray-200 rounded-[3px] overflow-hidden group flex flex-col shadow-xs hover:border-[#C6A15B] hover:shadow-md transition-all"
            >
              <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                <img
                  src={guide.coverImage}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-[#C6A15B] mb-2 font-mono">
                    <span>{guide.publishedDate}</span>
                    <span>•</span>
                    <span>{guide.readingTime}</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold uppercase group-hover:text-[#C6A15B] transition-colors leading-snug text-gray-900">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {guide.summary}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#C6A15B] mt-4 flex items-center gap-1">
                  Read Full Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================== 14. FAQ ACCORDION ==================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
              Common Questions
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase mt-1 text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              Straight answers on pricing, viewings, test drives, and documentation in Harare.
            </p>
          </div>

          <div className="space-y-3">
            {content.faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-gray-200 rounded-[3px] overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-heading text-lg sm:text-xl font-bold uppercase tracking-wide text-gray-900 hover:text-[#C6A15B] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#C6A15B] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 15. LOCATION BLOCK ==================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Details & Actions */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
              Physical Address
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase mt-1 mb-6 text-gray-900">
              Our Borrowdale Showroom
            </h2>

            <div className="space-y-4 text-xs sm:text-sm mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C6A15B] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900 text-sm">Borrowdale Address</strong>
                  <span className="text-gray-600">{settings.addressPlaceholder}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#C6A15B] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900 text-sm">Viewing Hours</strong>
                  <span className="text-gray-600">{settings.hoursPlaceholder}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#C6A15B] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900 text-sm">Direct Desk</strong>
                  <a href={`tel:${cleanPhone}`} className="text-gray-600 hover:text-[#C6A15B] font-mono">
                    {settings.phonePlaceholder}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#0E7A33] text-white font-heading text-sm font-bold uppercase tracking-wider rounded-[2px] flex items-center gap-2 hover:bg-[#0E7A33]/90 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Desk</span>
              </a>

              <a
                href={`tel:${cleanPhone}`}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-800 font-heading text-sm font-bold uppercase tracking-wider rounded-[2px] flex items-center gap-2 hover:border-[#C6A15B] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C6A15B]" />
                <span>Call Showroom</span>
              </a>

              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white border border-gray-300 text-[#C6A15B] font-heading text-sm font-bold uppercase tracking-wider rounded-[2px] flex items-center gap-2 hover:border-[#C6A15B] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="relative aspect-video rounded overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
            <iframe
              title="Borrowdale Auto Sales Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15194.887265267253!2d31.077222!3d-17.755416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a4f009df344f%3A0x6b1f237efb8e235a!2sSam%20Levy&#39;s%20Village!5e0!3m2!1sen!2szw!4v1700000000000!5m2!1sen!2szw"
              className="w-full h-full border-0 contrast-105"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded border border-gray-200 text-xs shadow-md">
              <span className="font-heading font-bold text-gray-900 uppercase">Borrowdale Showroom</span>
              <p className="text-[10px] text-gray-500">Opposite Sam Levy’s Village</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 16. FINAL CTA BAND ==================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-gray-200 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
            Ready When You Are
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase mt-1 mb-4 text-white">
            Your Next Car Is Already On Our Floor. Come And See It.
          </h2>
          <p className="text-sm text-gray-300 max-w-xl mx-auto mb-8">
            View our live Borrowdale inventory online or reach out on WhatsApp to lock in your private appointment today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/inventory"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#C6A15B] text-gray-950 font-heading text-lg font-bold uppercase tracking-wider rounded-[2px] hover:bg-[#A8843F] hover:text-white transition-colors shadow-lg"
            >
              View Inventory
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0E7A33] text-white font-heading text-lg font-bold uppercase tracking-wider rounded-[2px] hover:bg-[#0E7A33]/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
