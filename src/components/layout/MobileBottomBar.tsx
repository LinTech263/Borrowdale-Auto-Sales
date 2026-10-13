import React from 'react';
import { Vehicle } from '../../types';
import { useDealership } from '../../context/DealershipContext';
import { Phone, MessageCircle, DollarSign } from 'lucide-react';

interface MobileBottomBarProps {
  vehicle: Vehicle;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ vehicle }) => {
  const { settings, setActiveOfferVehicle } = useDealership();

  const cleanPhone = settings.phonePlaceholder.replace(/[^\d+]/g, '') || '+263770000000';
  const cleanWhatsApp = settings.whatsappPlaceholder.replace(/[^\d]/g, '') || '263770000000';
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    `Hi Borrowdale Auto Sales, I am interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.stockNo}) listed at US$${vehicle.price.toLocaleString('en-US')}.`
  )}`;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-2.5 px-3 flex items-center gap-2 shadow-2xl">
      {/* Call Button */}
      <a
        href={`tel:${cleanPhone}`}
        className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-[2px] bg-slate-50 border border-gray-200 text-gray-800 active:bg-gray-100 transition-colors shadow-xs"
      >
        <Phone className="w-4 h-4 text-[#C6A15B] mb-0.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Call</span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-[2px] bg-[#0E7A33] text-white active:bg-[#0E7A33]/90 transition-colors shadow-sm"
      >
        <MessageCircle className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp</span>
      </a>

      {/* Make an Offer Button */}
      <button
        onClick={() => setActiveOfferVehicle(vehicle)}
        className="flex-[1.4] flex flex-col items-center justify-center py-2 px-1 rounded-[2px] bg-[#C6A15B] text-gray-950 active:bg-[#A8843F] transition-colors shadow-sm"
      >
        <div className="flex items-center gap-0.5 mb-0.5 font-bold">
          <DollarSign className="w-3.5 h-3.5" />
          <span className="text-[10px] uppercase tracking-wider font-heading text-xs">Make Offer</span>
        </div>
        <span className="text-[9px] font-medium leading-none opacity-80">Instant Review</span>
      </button>
    </div>
  );
};
