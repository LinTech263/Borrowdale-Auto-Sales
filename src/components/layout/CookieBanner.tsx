import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('bas_cookie_consent');
    if (!consent) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('bas_cookie_consent', 'accepted');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 bg-[#16181B] border-t border-[#23272C] shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-start sm:items-center gap-2.5 text-[#9AA0A8]">
          <ShieldCheck className="w-5 h-5 text-[#C6A15B] shrink-0" />
          <p className="leading-relaxed">
            We use essential local session storage to remember your saved vehicles, offer calculations, and preferred currency.
            No invasive cross-site tracking. Read our{' '}
            <Link to="/privacy" className="text-[#C6A15B] underline hover:text-white">
              Zimbabwe Data Privacy Notice
            </Link>.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleAccept}
            className="w-full sm:w-auto px-5 py-2 bg-[#C6A15B] text-[#0A0A0B] font-semibold uppercase tracking-wider rounded-[2px] hover:bg-[#C6A15B]/90 transition-colors"
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
