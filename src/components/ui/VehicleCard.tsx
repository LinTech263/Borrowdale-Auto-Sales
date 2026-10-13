import React from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../../types';
import { useDealership } from '../../context/DealershipContext';
import { Heart, Scale, MessageCircle, Gauge, Fuel, Cog, ArrowUpRight } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const {
    settings,
    formatPrice,
    favourites,
    toggleFavourite,
    compareList,
    toggleCompare,
    setActiveOfferVehicle
  } = useDealership();

  const isFav = favourites.includes(vehicle.id);
  const isCompared = compareList.includes(vehicle.id);

  // Calculate "Listed x days ago"
  const daysAgo = Math.max(
    0,
    Math.floor((Date.now() - new Date(vehicle.listedDate).getTime()) / (1000 * 60 * 60 * 24))
  );

  // Pre-filled WhatsApp link
  const cleanPhone = settings.whatsappPlaceholder.replace(/[^\d]/g, '') || '263770000000';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hi Borrowdale Auto Sales, I am inquiring about the ${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.stockNo}) priced at US$${vehicle.price.toLocaleString('en-US')}. Is it still available for viewing?`
  )}`;

  return (
    <div className="group bg-white border border-gray-200 rounded-[3px] shadow-xs hover:shadow-xl hover:border-[#C6A15B] transition-all duration-300 flex flex-col h-full overflow-hidden relative">
      {/* Image Container with slow hover zoom */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Link to={`/vehicle/${vehicle.slug}`} className="block w-full h-full">
          <img
            src={vehicle.coverImage}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} for sale in Harare`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          {/* Status Badge */}
          {vehicle.status === 'Sold' ? (
            <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-[#B3261E] text-white rounded-[2px] shadow-sm">
              SOLD
            </span>
          ) : vehicle.status === 'Reserved' ? (
            <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-[#EA580C] text-white rounded-[2px] shadow-sm">
              RESERVED
            </span>
          ) : vehicle.status === 'Coming Soon' ? (
            <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-sky-600 text-white rounded-[2px] shadow-sm">
              ARRIVING SOON
            </span>
          ) : (
            <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-white/95 text-gray-900 border border-gray-200 rounded-[2px] shadow-xs">
              {vehicle.condition}
            </span>
          )}

          {/* Demo Badge */}
          {vehicle.isDemo && (
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider bg-gray-900/90 text-[#C6A15B] border border-[#C6A15B]/40 rounded-[2px] shadow-xs">
              DEMO
            </span>
          )}
        </div>

        {/* Top Right Actions: Favourite and Compare */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <button
            onClick={() => toggleFavourite(vehicle.id)}
            aria-label={isFav ? 'Remove from saved favourites' : 'Save to favourites'}
            className={`w-8 h-8 rounded-[2px] flex items-center justify-center backdrop-blur-md transition-colors shadow-xs ${
              isFav
                ? 'bg-[#B3261E] text-white'
                : 'bg-white/90 text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => toggleCompare(vehicle.id)}
            aria-label={isCompared ? 'Remove from compare' : 'Compare vehicle'}
            className={`w-8 h-8 rounded-[2px] flex items-center justify-center backdrop-blur-md transition-colors shadow-xs ${
              isCompared
                ? 'bg-[#C6A15B] text-white'
                : 'bg-white/90 text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
            title="Compare up to 3 vehicles"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Days ago pill on bottom-right of image */}
        <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none">
          <span className="text-[11px] font-medium px-2 py-0.5 bg-gray-950/75 backdrop-blur-sm text-gray-200 rounded-[2px]">
            {daysAgo === 0 ? 'Listed today' : `Listed ${daysAgo}d ago`}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-white">
        <div>
          {/* Stock No & Body Type */}
          <div className="flex items-center justify-between text-xs text-gray-500 font-mono mb-1">
            <span>{vehicle.stockNo}</span>
            <span className="text-[#C6A15B] font-sans font-semibold uppercase tracking-wider">{vehicle.bodyType}</span>
          </div>

          {/* Vehicle Title */}
          <Link to={`/vehicle/${vehicle.slug}`} className="block group-hover:text-[#C6A15B] transition-colors">
            <h3 className="font-heading text-xl font-bold leading-tight line-clamp-1 text-gray-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 font-sans">
              {vehicle.trim}
            </p>
          </Link>

          {/* Spec Badges Row */}
          <div className="grid grid-cols-3 gap-1.5 py-3 my-2 border-y border-gray-100 text-xs text-gray-600">
            <div className="flex items-center gap-1.5 truncate">
              <Gauge className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
              <span className="truncate">{vehicle.mileage.toLocaleString('en-US')} km</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Fuel className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
              <span className="truncate">{vehicle.fuel}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Cog className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
          </div>
        </div>

        {/* Pricing Block and Action CTAs */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <div>
              {vehicle.hidePrice || vehicle.isPriceOnRequest ? (
                <span className="font-heading text-lg font-bold text-[#C6A15B]">
                  Price On Request
                </span>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-2xl font-bold text-gray-900">
                      {formatPrice(vehicle.price, false)}
                    </span>
                    {vehicle.wasPrice && vehicle.wasPrice > vehicle.price && (
                      <span className="text-xs text-gray-400 line-through font-mono">
                        US${vehicle.wasPrice.toLocaleString('en-US')}
                      </span>
                    )}
                  </div>
                  {/* Secondary ZiG note if configured */}
                  {settings.currency.secondaryEnabled && (
                    <span className="text-[11px] text-gray-500 font-mono">
                      approx. ZiG {Math.round(vehicle.price * settings.currency.usdToZigRate).toLocaleString('en-US')}
                    </span>
                  )}
                </div>
              )}
            </div>

            {vehicle.isPriceNegotiable && !vehicle.hidePrice && (
              <span className="text-[11px] text-[#0E7A33] font-medium bg-[#0E7A33]/10 px-1.5 py-0.5 rounded-[2px] border border-[#0E7A33]/20">
                Negotiable
              </span>
            )}
          </div>

          {/* Quick CTAs */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-[2px] bg-[#0E7A33] text-white hover:bg-[#0E7A33]/90 transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => setActiveOfferVehicle(vehicle)}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-semibold rounded-[2px] border border-[#C6A15B] text-[#C6A15B] hover:bg-[#C6A15B] hover:text-white transition-colors"
            >
              <span>Make Offer</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
