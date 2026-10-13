import React, { useState, useMemo } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { useDealership } from '../context/DealershipContext';
import { SeoHead } from '../components/ui/SeoHead';
import { VehicleCard } from '../components/ui/VehicleCard';
import { createLead } from '../services/dataService';
import {
  Filter,
  X,
  RotateCcw,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Car
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { vehicles, categories, addToast } = useDealership();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorySlug } = useParams<{ categorySlug?: string }>();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sourcing Form State (for empty state)
  const [sourcingName, setSourcingName] = useState('');
  const [sourcingPhone, setSourcingPhone] = useState('');
  const [sourcingDetails, setSourcingDetails] = useState('');
  const [sourcingSubmitted, setSourcingSubmitted] = useState(false);

  // Read URL query params
  const searchQuery = searchParams.get('q') || '';
  const selectedMake = searchParams.get('make') || '';
  const selectedBody = searchParams.get('body') || '';
  const selectedCondition = searchParams.get('condition') || '';
  const selectedFuel = searchParams.get('fuel') || '';
  const selectedTransmission = searchParams.get('transmission') || '';
  const selectedDrivetrain = searchParams.get('drivetrain') || '';
  const selectedBudget = searchParams.get('budget') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 250000;
  const maxMileageParam = searchParams.get('maxMileage') ? Number(searchParams.get('maxMileage')) : 120000;

  // Active Category from route if any
  const activeCategory = useMemo(() => {
    if (!categorySlug) return null;
    return categories.find(c => c.slug === categorySlug) || null;
  }, [categorySlug, categories]);

  // URL updating helper
  const updateQuery = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Filter computation
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      // Category filter from URL route
      if (activeCategory && !v.categoryIds.includes(activeCategory.id)) {
        return false;
      }
      // Text search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const match =
          v.title.toLowerCase().includes(query) ||
          v.make.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query) ||
          v.stockNo.toLowerCase().includes(query);
        if (!match) return false;
      }
      // Make
      if (selectedMake && v.make !== selectedMake) return false;
      // Body
      if (selectedBody && v.bodyType !== selectedBody) return false;
      // Condition
      if (selectedCondition && v.condition !== selectedCondition) return false;
      // Fuel
      if (selectedFuel && v.fuel !== selectedFuel) return false;
      // Transmission
      if (selectedTransmission && v.transmission !== selectedTransmission) return false;
      // Drivetrain
      if (selectedDrivetrain && v.drivetrain !== selectedDrivetrain) return false;
      // Max price
      if (v.price > maxPriceParam) return false;
      // Max mileage
      if (v.mileage > maxMileageParam) return false;
      // Budget Chips
      if (selectedBudget === 'under-30k' && v.price >= 30000) return false;
      if (selectedBudget === '30k-60k' && (v.price < 30000 || v.price > 60000)) return false;
      if (selectedBudget === '60k-100k' && (v.price < 60000 || v.price > 100000)) return false;
      if (selectedBudget === '100k-plus' && v.price < 100000) return false;

      return true;
    });
  }, [
    vehicles,
    activeCategory,
    searchQuery,
    selectedMake,
    selectedBody,
    selectedCondition,
    selectedFuel,
    selectedTransmission,
    selectedDrivetrain,
    maxPriceParam,
    maxMileageParam,
    selectedBudget
  ]);

  // Sorting
  const sortedVehicles = useMemo(() => {
    const list = [...filteredVehicles];
    switch (sortParam) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'mileage':
        return list.sort((a, b) => a.mileage - b.mileage);
      case 'year':
        return list.sort((a, b) => b.year - a.year);
      case 'newest':
      default:
        return list.sort((a, b) => new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime());
    }
  }, [filteredVehicles, sortParam]);

  // Calculate live counts for options
  const availableMakes = useMemo(() => {
    const map = new Map<string, number>();
    vehicles.forEach(v => {
      map.set(v.make, (map.get(v.make) || 0) + 1);
    });
    return Array.from(map.entries())
      .filter(([_, count]) => count > 0)
      .sort((a, b) => a[0].localeCompare(b[0]));
  }, [vehicles]);

  const availableBodyTypes = useMemo(() => {
    const map = new Map<string, number>();
    vehicles.forEach(v => {
      map.set(v.bodyType, (map.get(v.bodyType) || 0) + 1);
    });
    return Array.from(map.entries())
      .filter(([_, count]) => count > 0)
      .sort((a, b) => a[0].localeCompare(b[0]));
  }, [vehicles]);

  const availableFuels = useMemo(() => {
    const map = new Map<string, number>();
    vehicles.forEach(v => {
      map.set(v.fuel, (map.get(v.fuel) || 0) + 1);
    });
    return Array.from(map.entries()).filter(([_, count]) => count > 0);
  }, [vehicles]);

  const availableDrivetrains = useMemo(() => {
    const map = new Map<string, number>();
    vehicles.forEach(v => {
      map.set(v.drivetrain, (map.get(v.drivetrain) || 0) + 1);
    });
    return Array.from(map.entries()).filter(([_, count]) => count > 0);
  }, [vehicles]);

  // Active filter chip indicators
  const activeFilterChips = [
    searchQuery && { label: `Search: "${searchQuery}"`, key: 'q' },
    selectedMake && { label: `Make: ${selectedMake}`, key: 'make' },
    selectedBody && { label: `Body: ${selectedBody}`, key: 'body' },
    selectedCondition && { label: `Condition: ${selectedCondition}`, key: 'condition' },
    selectedFuel && { label: `Fuel: ${selectedFuel}`, key: 'fuel' },
    selectedTransmission && { label: `Transmission: ${selectedTransmission}`, key: 'transmission' },
    selectedDrivetrain && { label: `Drivetrain: ${selectedDrivetrain}`, key: 'drivetrain' },
    selectedBudget && { label: `Budget: ${selectedBudget}`, key: 'budget' },
    maxPriceParam < 250000 && { label: `Under US$${maxPriceParam.toLocaleString('en-US')}`, key: 'maxPrice' },
  ].filter(Boolean) as { label: string; key: string }[];

  const handleSourcingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourcingName || !sourcingPhone) return;

    createLead({
      type: 'sourcing',
      status: 'New',
      customerName: sourcingName.trim(),
      phone: sourcingPhone.trim(),
      preferredContact: 'WhatsApp',
      message: sourcingDetails.trim() || 'Looking for specific vehicle not currently listed in stock.',
      sourceUrl: '/inventory'
    });

    setSourcingSubmitted(true);
    addToast('Sourcing request received! Our procurement desk will contact you on WhatsApp.', 'success');
  };

  const pageTitle = activeCategory
    ? `${activeCategory.name} for Sale in Harare | Borrowdale Auto Sales`
    : 'Premium Car Inventory in Borrowdale, Harare | Borrowdale Auto Sales';

  const pageDesc = activeCategory
    ? activeCategory.description
    : 'Browse all available hand-picked luxury SUVs, double cabs, and executive sedans in Borrowdale, Harare. Honest USD prices, WhatsApp negotiation, and private viewings.';

  return (
    <div className="min-h-screen bg-white text-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title={pageTitle}
        description={pageDesc}
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : 'https://borrowdaleautosales.co.zw/inventory'}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 font-mono">
            <Link to="/" className="hover:text-[#C6A15B]">Home</Link>
            <span>/</span>
            <span className="text-[#C6A15B]">Inventory</span>
            {activeCategory && (
              <>
                <span>/</span>
                <span className="text-gray-900">{activeCategory.name}</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-tight text-gray-900">
                {activeCategory ? activeCategory.name : 'Showroom Inventory'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
                {activeCategory ? activeCategory.description : 'Explore verified luxury SUVs, double cabs, and executive sedans in Borrowdale, Harare.'}
              </p>
            </div>

            {/* Quick Count Badge */}
            <div className="text-xs font-mono text-gray-700 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-[2px] self-start md:self-auto shadow-xs">
              Showing <strong className="text-[#C6A15B] font-bold">{sortedVehicles.length}</strong> matching{' '}
              {sortedVehicles.length === 1 ? 'vehicle' : 'vehicles'}
            </div>
          </div>
        </div>

        {/* Budget Chips Strip */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 shrink-0 mr-1">
            Budget Bands:
          </span>
          {[
            { label: 'All Budgets', value: '' },
            { label: 'Under US$30k', value: 'under-30k' },
            { label: 'US$30k – US$60k', value: '30k-60k' },
            { label: 'US$60k – US$100k', value: '60k-100k' },
            { label: 'US$100k+', value: '100k-plus' },
          ].map(chip => (
            <button
              key={chip.value}
              onClick={() => updateQuery('budget', chip.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-[2px] border transition-colors shrink-0 ${
                selectedBudget === chip.value
                  ? 'bg-[#C6A15B] border-[#C6A15B] text-gray-950 font-bold shadow-xs'
                  : 'bg-white border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-400'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Active Filter Chips & Clear All */}
        {activeFilterChips.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-[2px]">
            <span className="text-xs font-semibold text-gray-600">Active Filters:</span>
            {activeFilterChips.map(chip => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-white border border-gray-200 text-gray-800 rounded-[2px] shadow-xs"
              >
                <span>{chip.label}</span>
                <button
                  onClick={() => updateQuery(chip.key, null)}
                  className="text-gray-400 hover:text-gray-900"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#C6A15B] hover:underline font-semibold ml-auto flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* Search, Sort and Mobile Filter Toggle Row */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50 border border-gray-200 p-3 rounded-[2px]">
          {/* Keyword Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search make, model, stock no..."
              value={searchQuery}
              onChange={e => updateQuery('q', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-[2px] pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Filter Sheet Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 text-xs font-semibold rounded-[2px] text-gray-900 shadow-xs"
            >
              <Filter className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Filters ({activeFilterChips.length})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={sortParam}
                onChange={e => updateQuery('sort', e.target.value)}
                className="bg-white border border-gray-300 text-xs text-gray-900 rounded-[2px] px-3 py-2 focus:outline-none focus:border-[#C6A15B]"
              >
                <option value="newest">Sort: Newest Listed</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="mileage">Mileage: Lowest First</option>
                <option value="year">Year: Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content: Left Filter Drawer & Vehicle Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-gray-50 border border-gray-200 p-5 rounded-[2px] self-start shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2 font-heading text-lg font-bold uppercase tracking-wider text-gray-900">
                <SlidersHorizontal className="w-4 h-4 text-[#C6A15B]" />
                <span>Filters</span>
              </div>
              {activeFilterChips.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-[#C6A15B] hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Condition Filter */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                Condition
              </span>
              <div className="space-y-1.5">
                {(['all', 'Certified', 'Pre-owned', 'New'] as const).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateQuery('condition', c === 'all' ? null : c)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-[2px] transition-colors flex items-center justify-between ${
                      (c === 'all' && !selectedCondition) || selectedCondition === c
                        ? 'bg-[#C6A15B] text-gray-950 font-bold shadow-xs'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span>{c === 'all' ? 'All Conditions' : c}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Make Filter */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                Make ({availableMakes.length})
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => updateQuery('make', null)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-[2px] transition-colors flex items-center justify-between ${
                    !selectedMake ? 'bg-[#C6A15B] text-gray-950 font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>All Makes</span>
                </button>
                {availableMakes.map(([makeName, count]) => (
                  <button
                    key={makeName}
                    type="button"
                    onClick={() => updateQuery('make', makeName)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-[2px] transition-colors flex items-center justify-between ${
                      selectedMake === makeName ? 'bg-[#C6A15B] text-gray-950 font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span>{makeName}</span>
                    <span className="font-mono text-[11px] opacity-75">({count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Body Type Filter */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                Body Type ({availableBodyTypes.length})
              </span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => updateQuery('body', null)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-[2px] transition-colors flex items-center justify-between ${
                    !selectedBody ? 'bg-[#C6A15B] text-gray-950 font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>All Body Types</span>
                </button>
                {availableBodyTypes.map(([bodyName, count]) => (
                  <button
                    key={bodyName}
                    type="button"
                    onClick={() => updateQuery('body', bodyName)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-[2px] transition-colors flex items-center justify-between ${
                      selectedBody === bodyName ? 'bg-[#C6A15B] text-gray-950 font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span>{bodyName}</span>
                    <span className="font-mono text-[11px] opacity-75">({count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                <span>Max Price (USD)</span>
                <span className="text-[#C6A15B] font-mono font-bold">
                  US${maxPriceParam.toLocaleString('en-US')}
                </span>
              </div>
              <input
                type="range"
                min={20000}
                max={250000}
                step={5000}
                value={maxPriceParam}
                onChange={e => updateQuery('maxPrice', e.target.value)}
                className="w-full accent-[#C6A15B]"
              />
            </div>

            {/* Fuel Type */}
            {availableFuels.length > 0 && (
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Fuel Type
                </span>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => updateQuery('fuel', null)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-[2px] ${
                      !selectedFuel ? 'bg-[#C6A15B] text-gray-950 font-bold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    All Fuels
                  </button>
                  {availableFuels.map(([fuelName, count]) => (
                    <button
                      key={fuelName}
                      type="button"
                      onClick={() => updateQuery('fuel', fuelName)}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-[2px] flex items-center justify-between ${
                        selectedFuel === fuelName ? 'bg-[#C6A15B] text-gray-950 font-bold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>{fuelName}</span>
                      <span className="font-mono text-[11px] opacity-75">({count})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Drivetrain */}
            {availableDrivetrains.length > 0 && (
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Drivetrain
                </span>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => updateQuery('drivetrain', null)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-[2px] ${
                      !selectedDrivetrain ? 'bg-[#C6A15B] text-gray-950 font-bold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    All Drivetrains
                  </button>
                  {availableDrivetrains.map(([driveName, count]) => (
                    <button
                      key={driveName}
                      type="button"
                      onClick={() => updateQuery('drivetrain', driveName)}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-[2px] flex items-center justify-between ${
                        selectedDrivetrain === driveName ? 'bg-[#C6A15B] text-gray-950 font-bold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>{driveName}</span>
                      <span className="font-mono text-[11px] opacity-75">({count})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Vehicle Grid & Empty State */}
          <main className="lg:col-span-3">
            {sortedVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedVehicles.map(vehicle => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              /* Friendly Empty State with Interactive Sourcing Form */
              <div className="bg-white border-2 border-gray-200 rounded-[4px] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
                <Car className="w-12 h-12 text-[#C6A15B] mx-auto mb-3" />
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase mb-2 text-gray-900">
                  No Exact Matches Currently On The Floor
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                  We frequently source vehicles privately before they reach the showroom floor. Tell us what you are looking for, and our Borrowdale team will locate it for you.
                </p>

                {sourcingSubmitted ? (
                  <div className="p-4 bg-[#0E7A33]/10 border border-[#0E7A33] rounded text-sm text-[#0E7A33] font-semibold">
                    Thank you! Your sourcing request has been routed to our Harare purchasing team. We will message you on WhatsApp as soon as a matching car is located.
                  </div>
                ) : (
                  <form onSubmit={handleSourcingSubmit} className="space-y-3 max-w-md mx-auto text-left text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-gray-700 mb-1">
                        Your Name*
                      </label>
                      <input
                        type="text"
                        required
                        value={sourcingName}
                        onChange={e => setSourcingName(e.target.value)}
                        placeholder="e.g. Tinashe Chitepo"
                        className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-gray-700 mb-1">
                        WhatsApp / Phone (+263)*
                      </label>
                      <input
                        type="tel"
                        required
                        value={sourcingPhone}
                        onChange={e => setSourcingPhone(e.target.value)}
                        placeholder="e.g. 077 345 6789"
                        className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-gray-700 mb-1">
                        Vehicle You Need (Make, Model, Budget)
                      </label>
                      <textarea
                        rows={3}
                        value={sourcingDetails}
                        onChange={e => setSourcingDetails(e.target.value)}
                        placeholder="e.g. Looking for a clean 2022 Toyota Prado TX-L or Hilux Legend under US$65k."
                        className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-[2px] bg-[#C6A15B] text-gray-950 font-heading text-sm font-bold uppercase tracking-wider hover:bg-[#A8843F] hover:text-white transition-colors"
                    >
                      Find Me This Car
                    </button>
                  </form>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-[#C6A15B] hover:underline font-semibold"
                  >
                    Or reset all filters to view full inventory
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end flex-col">
          <div className="bg-white border-t border-gray-200 rounded-t-xl max-h-[85vh] overflow-y-auto p-5 text-sm space-y-5 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="font-heading text-xl font-bold uppercase text-gray-900">
                Filter Vehicles
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-gray-500 p-1"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Condition */}
            <div>
              <span className="block text-xs font-semibold uppercase text-gray-700 mb-2">Condition</span>
              <div className="grid grid-cols-2 gap-2">
                {(['all', 'Certified', 'Pre-owned', 'New'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => updateQuery('condition', c === 'all' ? null : c)}
                    className={`py-2 px-3 text-xs rounded border ${
                      (c === 'all' && !selectedCondition) || selectedCondition === c
                        ? 'bg-[#C6A15B] border-[#C6A15B] text-gray-950 font-bold'
                        : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    {c === 'all' ? 'All' : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Make */}
            <div>
              <span className="block text-xs font-semibold uppercase text-gray-700 mb-2">Make</span>
              <select
                value={selectedMake}
                onChange={e => updateQuery('make', e.target.value || null)}
                className="w-full bg-white border border-gray-300 text-xs p-2.5 rounded text-gray-900"
              >
                <option value="">All Makes</option>
                {availableMakes.map(([m, count]) => (
                  <option key={m} value={m}>{m} ({count})</option>
                ))}
              </select>
            </div>

            {/* Body */}
            <div>
              <span className="block text-xs font-semibold uppercase text-gray-700 mb-2">Body Type</span>
              <select
                value={selectedBody}
                onChange={e => updateQuery('body', e.target.value || null)}
                className="w-full bg-white border border-gray-300 text-xs p-2.5 rounded text-gray-900"
              >
                <option value="">All Body Types</option>
                {availableBodyTypes.map(([b, count]) => (
                  <option key={b} value={b}>{b} ({count})</option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold uppercase rounded-[2px]"
              >
                Reset All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 bg-[#C6A15B] text-gray-950 text-xs font-bold uppercase rounded-[2px]"
              >
                Apply Filters ({sortedVehicles.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
