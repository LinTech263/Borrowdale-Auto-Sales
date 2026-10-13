import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useDealership } from '../context/DealershipContext';
import { SeoHead } from '../components/ui/SeoHead';
import { VehicleCard } from '../components/ui/VehicleCard';
import { MessageCircle } from 'lucide-react';

export const LocalLandingPage: React.FC = () => {
  const location = useLocation();
  const { vehicles, content, settings } = useDealership();

  // Extract path slug (e.g. "used-cars-borrowdale-harare")
  const pathSlug = location.pathname.replace(/^\//, '');

  const customCopy = content.landingPagesCopy[pathSlug] || {
    title: 'Vehicles for Sale in Borrowdale, Harare | Borrowdale Auto Sales',
    metaDesc: 'Explore premium vehicles for sale in Borrowdale, Harare. Honest USD prices, WhatsApp negotiation, and private showroom viewings.',
    h1: 'Quality Vehicles for Sale in Harare',
    introHtml: '<p>Hand-picked premium stock ready for inspection at our Borrowdale showroom.</p>'
  };

  // Determine matching vehicles based on path
  const matchingVehicles = vehicles.filter(v => {
    if (pathSlug === 'used-cars-borrowdale-harare') {
      return v.condition === 'Pre-owned' || v.condition === 'Certified';
    }
    if (pathSlug === 'luxury-cars-for-sale-harare') {
      return v.price >= 80000 || v.categoryIds.includes('cat-suv') || v.categoryIds.includes('cat-prestige-sports');
    }
    if (pathSlug === 'suvs-for-sale-harare') {
      return v.bodyType === 'SUV';
    }
    if (pathSlug === 'double-cabs-for-sale-zimbabwe') {
      return v.bodyType === 'Double Cab' || v.bodyType === 'Pick-up';
    }
    if (pathSlug === 'mercedes-benz-for-sale-zimbabwe') {
      return v.make.toLowerCase().includes('mercedes');
    }
    return true;
  });

  const cleanWhatsApp = settings.whatsappPlaceholder.replace(/[^\d]/g, '') || '263770000000';

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title={customCopy.title}
        description={customCopy.metaDesc}
        canonicalUrl={`https://borrowdaleautosales.co.zw/${pathSlug}`}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header Breadcrumb & Introduction */}
        <div className="mb-10 max-w-4xl">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 font-mono">
            <Link to="/" className="hover:text-[#C6A15B]">Home</Link>
            <span>/</span>
            <span className="text-[#C6A15B]">{pathSlug}</span>
          </div>

          <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
            Harare • Borrowdale Showroom
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase mt-1 mb-4 text-gray-900">
            {customCopy.h1}
          </h1>

          <div
            className="text-xs sm:text-sm text-gray-600 leading-relaxed prose max-w-none"
            dangerouslySetInnerHTML={{ __html: customCopy.introHtml }}
          />
        </div>

        {/* Stock Grid */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
            <h2 className="font-heading text-2xl font-bold uppercase text-gray-900">
              Available Matching Stock ({matchingVehicles.length})
            </h2>
            <Link to="/inventory" className="text-xs text-[#C6A15B] hover:underline font-semibold">
              View All Showroom Inventory →
            </Link>
          </div>

          {matchingVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingVehicles.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-gray-200 rounded-[4px] p-10 text-center max-w-lg mx-auto">
              <p className="text-sm text-gray-600 mb-4">
                No matching vehicles currently on the floor for this specific category.
              </p>
              <Link
                to="/inventory"
                className="px-6 py-2.5 bg-[#C6A15B] text-gray-950 text-xs font-bold uppercase rounded-[2px] hover:bg-[#A8843F] hover:text-white"
              >
                Browse Full Inventory
              </Link>
            </div>
          )}
        </div>

        {/* Location & Trust Footer Band */}
        <div className="bg-slate-50 border border-gray-200 rounded-[4px] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase text-gray-900">
              Inspect Cars in Borrowdale Today
            </h3>
            <p className="text-xs text-gray-600 mt-1 max-w-lg leading-relaxed">
              {settings.addressPlaceholder}. Private viewings and cold-start inspections arranged by appointment on WhatsApp.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hi Borrowdale Auto Sales, I am inquiring regarding vehicles from ${customCopy.h1}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#0E7A33] text-white font-heading text-sm font-bold uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-2 hover:bg-[#0E7A33]/90 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Showroom Desk</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
