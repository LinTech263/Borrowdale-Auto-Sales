import React from 'react';
import { Link } from 'react-router-dom';
import { useDealership } from '../context/DealershipContext';
import { SeoHead } from '../components/ui/SeoHead';
import { VehicleCard } from '../components/ui/VehicleCard';
import { Heart, ArrowRight } from 'lucide-react';

export const FavouritesPage: React.FC = () => {
  const { vehicles, favourites } = useDealership();

  const favVehicles = vehicles.filter(v => favourites.includes(v.id));

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Your Saved Vehicles | Borrowdale Auto Sales"
        description="View your saved favourites at Borrowdale Auto Sales in Harare, Zimbabwe."
        canonicalUrl="https://borrowdaleautosales.co.zw/favourites"
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B3261E]">
              Private Shortlist
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black uppercase mt-1 text-gray-900">
              Saved Vehicles ({favVehicles.length})
            </h1>
          </div>
          <Link
            to="/inventory"
            className="text-xs text-[#C6A15B] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Explore More Inventory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {favVehicles.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-[4px] p-12 text-center max-w-lg mx-auto shadow-sm">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold uppercase mb-2 text-gray-900">No Saved Vehicles</h2>
            <p className="text-xs text-gray-500 mb-6">
              You haven't saved any vehicles yet. Click the heart icon on any vehicle card to save it to your private shortlist.
            </p>
            <Link
              to="/inventory"
              className="px-6 py-2.5 bg-[#C6A15B] text-gray-950 font-heading text-sm font-bold uppercase tracking-wider rounded-[2px] hover:bg-[#A8843F] hover:text-white"
            >
              Browse Showroom Inventory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
