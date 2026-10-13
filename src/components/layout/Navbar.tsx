import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDealership } from '../../context/DealershipContext';
import { BrandLogo } from '../ui/BrandLogo';
import { MessageCircle, Phone, Heart, Scale, Menu, X, Shield, RefreshCw } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    settings,
    favourites,
    compareList,
    currencyDisplay,
    setCurrencyDisplay,
    adminUser
  } = useDealership();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const cleanPhone = settings.phonePlaceholder.replace(/[^\d+]/g, '') || '+263770000000';
  const cleanWhatsApp = settings.whatsappPlaceholder.replace(/[^\d]/g, '') || '263770000000';
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    'Hi Borrowdale Auto Sales, I am browsing your showroom vehicles online. Please assist me with current availability.'
  )}`;

  const navLinks = [
    { name: 'Inventory', path: '/inventory' },
    { name: 'Sell Your Car', path: '/sell-your-car' },
    { name: 'Finance', path: '/finance' },
    { name: 'About', path: '/about' },
    { name: 'Guides', path: '/guides' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/inventory') return location.pathname.startsWith('/inventory') || location.pathname.startsWith('/cars/');
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 text-gray-900 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <BrandLogo variant="compact" isLight={true} />

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-gray-600">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors hover:text-[#C6A15B] py-1 border-b-2 font-medium ${
                isActive(link.path)
                  ? 'text-gray-950 border-[#C6A15B] font-bold'
                  : 'border-transparent text-gray-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Currency Switcher (if admin enabled secondary ZiG) */}
          {settings.currency.secondaryEnabled && (
            <button
              onClick={() => setCurrencyDisplay(currencyDisplay === 'USD' ? 'ZiG' : 'USD')}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-bold rounded border border-gray-300 bg-gray-50 text-gray-800 hover:border-[#C6A15B]"
              title={`Switch display to ${currencyDisplay === 'USD' ? 'ZiG' : 'USD'}`}
            >
              <RefreshCw className="w-3 h-3 text-[#C6A15B]" />
              <span>{currencyDisplay}</span>
            </button>
          )}

          {/* Favourites Icon */}
          <Link
            to="/favourites"
            aria-label="View saved vehicles"
            className="relative p-2 text-gray-600 hover:text-gray-950 rounded transition-colors"
          >
            <Heart className="w-4 h-4" />
            {favourites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B3261E] text-white text-[10px] font-bold flex items-center justify-center">
                {favourites.length}
              </span>
            )}
          </Link>

          {/* Compare Icon */}
          <Link
            to="/compare"
            aria-label="Compare vehicles"
            className="relative p-2 text-gray-600 hover:text-gray-950 rounded transition-colors"
          >
            <Scale className="w-4 h-4" />
            {compareList.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C6A15B] text-white text-[10px] font-bold flex items-center justify-center">
                {compareList.length}
              </span>
            )}
          </Link>

          {/* Mobile Click-to-Call */}
          <a
            href={`tel:${cleanPhone}`}
            className="sm:hidden p-2 text-gray-600 hover:text-[#0E7A33] rounded transition-colors"
            aria-label="Call Dealership"
          >
            <Phone className="w-4 h-4" />
          </a>

          {/* Desktop Phone display */}
          <a
            href={`tel:${cleanPhone}`}
            className="hidden xl:flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-950 font-mono"
          >
            <Phone className="w-3.5 h-3.5 text-[#0E7A33]" />
            <span>{settings.phonePlaceholder}</span>
          </a>

          {/* Primary WhatsApp CTA button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-heading font-bold uppercase tracking-wider rounded-[2px] bg-[#0E7A33] text-white hover:bg-[#0E7A33]/90 transition-all shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Us</span>
          </a>

          {/* Admin badge if logged in */}
          {adminUser && (
            <Link
              to="/admin/dashboard"
              className="hidden md:flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded bg-amber-50 text-amber-800 border border-amber-200"
            >
              <Shield className="w-3 h-3 text-[#C6A15B]" />
              <span>Admin</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-950 rounded"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 text-sm font-semibold uppercase tracking-wider rounded ${
                  isActive(link.path)
                    ? 'bg-gray-100 text-[#C6A15B] border-l-2 border-[#C6A15B]'
                    : 'text-gray-700 hover:text-gray-950'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-semibold uppercase tracking-wider text-gray-700 hover:text-gray-950"
            >
              Compare Vehicles ({compareList.length})
            </Link>
            <Link
              to="/favourites"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-semibold uppercase tracking-wider text-gray-700 hover:text-gray-950"
            >
              Saved Favourites ({favourites.length})
            </Link>
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-semibold uppercase tracking-wider text-[#C6A15B] hover:text-gray-950"
            >
              Dealer Portal {adminUser ? '• Logged In' : '• Sign In'}
            </Link>
          </nav>

          <div className="pt-2 border-t border-gray-200 flex flex-col gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-[2px] bg-[#0E7A33] text-white font-heading text-base font-bold uppercase tracking-wider"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Dealership Desk</span>
            </a>
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-[2px] border border-gray-300 text-gray-900 font-heading text-base font-bold uppercase tracking-wider"
            >
              <Phone className="w-4 h-4 text-[#0E7A33]" />
              <span>Call Showroom</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
