import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDealership } from '../context/DealershipContext';
import { SeoHead } from '../components/ui/SeoHead';
import { Search, MessageCircle, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { settings } = useDealership();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const cleanWhatsApp = settings.whatsappPlaceholder.replace(/[^\d]/g, '') || '263770000000';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/inventory?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/inventory');
    }
  };

  return (
    <div className="min-h-[80vh] bg-white text-gray-900 flex items-center justify-center py-16 px-4">
      <SeoHead
        title="Page Not Found | Borrowdale Auto Sales"
        description="The page you requested could not be found. Search our Borrowdale car inventory or contact us on WhatsApp."
      />

      <div className="bg-white border border-gray-200 rounded-[4px] p-8 sm:p-12 text-center max-w-xl mx-auto shadow-md">
        <span className="font-heading text-7xl sm:text-8xl font-black text-[#C6A15B] block mb-2">
          404
        </span>
        <h1 className="font-heading text-3xl font-extrabold uppercase mb-2 text-gray-900">
          Page Not Located
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mb-8 leading-relaxed">
          The vehicle listing or page you were looking for may have been moved, sold, or updated. Search our live inventory or ask our sales desk directly.
        </p>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative mb-6 max-w-md mx-auto">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search make or model (e.g. Land Cruiser, Raptor)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-[2px] pl-9 pr-24 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#C6A15B]"
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-3 bg-[#C6A15B] text-gray-950 font-heading font-bold uppercase text-xs rounded-[2px] hover:bg-[#A8843F] hover:text-white"
          >
            Search
          </button>
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 border border-gray-200 text-gray-800 font-heading text-xs font-bold uppercase rounded-[2px] flex items-center justify-center gap-2 hover:bg-gray-200"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hi Borrowdale Auto Sales, I could not find the vehicle I was looking for on your website.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#0E7A33] text-white font-heading text-xs font-bold uppercase rounded-[2px] flex items-center justify-center gap-2 hover:bg-[#0E7A33]/90 shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ask Us On WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
