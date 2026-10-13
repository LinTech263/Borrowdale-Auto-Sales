import React, { useState } from 'react';
import { useDealership } from '../../context/DealershipContext';
import { MessageCircle, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useDealership();
  const [showTooltip, setShowTooltip] = useState(true);
  const location = useLocation();

  // If on vehicle detail page on mobile, the mobile bottom bar is used instead
  const isVehicleDetailPage = location.pathname.startsWith('/vehicle/');

  const cleanWhatsApp = settings.whatsappPlaceholder.replace(/[^\d]/g, '') || '263770000000';
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    'Hi Borrowdale Auto Sales, I am browsing your premium vehicles online. Please assist me with stock details.'
  )}`;

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 flex items-end flex-col gap-2 ${
        isVehicleDetailPage ? 'hidden md:flex' : 'flex'
      }`}
    >
      {/* Tooltip prompt */}
      {showTooltip && (
        <div className="bg-[#16181B] border border-[#23272C] text-[#F5F2EB] text-xs py-2 px-3 rounded shadow-2xl flex items-center gap-2 max-w-xs animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-[#0E7A33] animate-pulse" />
          <span className="font-medium">Direct WhatsApp desk open. Questions?</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-[#9AA0A8] hover:text-white p-0.5"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Borrowdale Auto Sales"
        className="w-13 h-13 rounded-full bg-[#0E7A33] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform border border-white/20"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
};
