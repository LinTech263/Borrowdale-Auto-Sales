import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDealership } from '../../context/DealershipContext';
import { BrandLogo } from '../ui/BrandLogo';
import { createLead } from '../../services/dataService';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, addToast } = useDealership();
  const [alertPhone, setAlertPhone] = useState('');
  const [alertCategory, setAlertCategory] = useState('All New Arrivals');
  const [subscribed, setSubscribed] = useState(false);

  const cleanPhone = settings.phonePlaceholder.replace(/[^\d+]/g, '') || '+263770000000';
  const cleanWhatsApp = settings.whatsappPlaceholder.replace(/[^\d]/g, '') || '263770000000';

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertPhone.trim()) return;

    createLead({
      type: 'new_arrivals',
      status: 'New',
      customerName: 'Alert Subscriber',
      phone: alertPhone.trim(),
      preferredContact: 'WhatsApp',
      message: `Subscribed for WhatsApp stock alerts: ${alertCategory}`
    });

    setSubscribed(true);
    addToast('Subscribed to WhatsApp new arrival alerts', 'success');
  };

  return (
    <footer className="bg-[#0A0A0B] border-t border-[#23272C] text-[#9AA0A8] text-sm pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <BrandLogo variant="wordmark" />
            <p className="text-xs leading-relaxed text-[#9AA0A8]">
              Premier address for hand-picked executive motorcars in Borrowdale, Harare. Transparent pricing, rigorous mechanical provenance, and direct WhatsApp communication.
            </p>
            <div className="pt-1 flex items-center gap-3">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-[#16181B] border border-[#23272C] flex items-center justify-center text-[#F5F2EB] hover:text-[#C6A15B] hover:border-[#C6A15B] transition-colors text-xs font-bold"
                aria-label="Facebook Page"
              >
                f
              </a>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-[#16181B] border border-[#23272C] flex items-center justify-center text-[#F5F2EB] hover:text-[#C6A15B] hover:border-[#C6A15B] transition-colors text-xs font-bold"
                aria-label="Instagram Page"
              >
                in
              </a>
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-[#16181B] border border-[#23272C] flex items-center justify-center text-[#0E7A33] hover:border-[#0E7A33] transition-colors"
                aria-label="WhatsApp Dealership"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: NAP (Name, Address, Phone, Hours) */}
          <div className="space-y-3.5">
            <h4 className="font-heading text-base font-bold uppercase tracking-wider text-[#F5F2EB]">
              Borrowdale Showroom
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.addressPlaceholder}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C6A15B] shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-[#F5F2EB] transition-colors font-mono">
                  {settings.phonePlaceholder}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#0E7A33] shrink-0" />
                <a
                  href={`https://wa.me/${cleanWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F5F2EB] transition-colors font-mono"
                >
                  {settings.whatsappPlaceholder}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C6A15B] shrink-0" />
                <a href={`mailto:${settings.emailPlaceholder}`} className="hover:text-[#F5F2EB] transition-colors">
                  {settings.emailPlaceholder}
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.hoursPlaceholder}</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick & Curated Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-base font-bold uppercase tracking-wider text-[#F5F2EB]">
              Explore Harare Stock
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/inventory" className="hover:text-[#C6A15B] transition-colors">
                  All Showroom Vehicles
                </Link>
              </li>
              <li>
                <Link to="/inventory/luxury-suvs" className="hover:text-[#C6A15B] transition-colors">
                  Luxury SUVs (LC300, Defender, G63)
                </Link>
              </li>
              <li>
                <Link to="/inventory/double-cabs" className="hover:text-[#C6A15B] transition-colors">
                  4x4 Double Cabs (Hilux, Raptor)
                </Link>
              </li>
              <li>
                <Link to="/used-cars-borrowdale-harare" className="hover:text-[#C6A15B] transition-colors">
                  Used Cars Borrowdale Harare
                </Link>
              </li>
              <li>
                <Link to="/sell-your-car" className="hover:text-[#C6A15B] transition-colors">
                  Trade-In & Vehicle Valuation
                </Link>
              </li>
              <li>
                <Link to="/finance" className="hover:text-[#C6A15B] transition-colors">
                  Finance Calculator & Facilities
                </Link>
              </li>
              <li>
                <Link to="/guides" className="hover:text-[#C6A15B] transition-colors">
                  Zimbabwe Motoring Guides
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#C6A15B] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: WhatsApp Stock Alerts */}
          <div className="space-y-3">
            <h4 className="font-heading text-base font-bold uppercase tracking-wider text-[#F5F2EB]">
              New Arrival Alerts
            </h4>
            <p className="text-xs leading-relaxed text-[#9AA0A8]">
              Receive first notice when rare Land Cruisers, Raptors, or Mercedes-Benz stock lands in Borrowdale before public listing.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#0E7A33]/15 border border-[#0E7A33]/40 rounded text-xs text-[#F5F2EB] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0E7A33] shrink-0" />
                <span>You will receive instant alerts for incoming stock.</span>
              </div>
            ) : (
              <form onSubmit={handleAlertSubmit} className="space-y-2 text-xs">
                <input
                  type="tel"
                  required
                  placeholder="Your WhatsApp (+263 77...)"
                  value={alertPhone}
                  onChange={e => setAlertPhone(e.target.value)}
                  className="w-full bg-[#16181B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#C6A15B]"
                />
                <select
                  value={alertCategory}
                  onChange={e => setAlertCategory(e.target.value)}
                  className="w-full bg-[#16181B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#C6A15B]"
                >
                  <option value="All New Arrivals">All New Arrivals</option>
                  <option value="Luxury SUVs Only">Luxury SUVs (Land Cruiser, Range Rover)</option>
                  <option value="Double Cabs Only">Double Cabs (Hilux, Raptor, D-Max)</option>
                  <option value="Executive Sedans">Executive Sedans (Mercedes, BMW)</option>
                </select>
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-[2px] bg-[#C6A15B] text-[#0A0A0B] font-heading text-xs font-bold uppercase tracking-wider hover:bg-[#C6A15B]/90 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join VIP WhatsApp Alert List</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal & Admin Link */}
        <div className="pt-8 border-t border-[#23272C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9AA0A8]">
          <div>
            © {new Date().getFullYear()} {settings.legalEntityName}. All rights reserved. Registered in Zimbabwe.
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link to="/privacy" className="hover:text-[#F5F2EB] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#F5F2EB] transition-colors">
              Terms & Conditions
            </Link>
            <Link
              to="/admin/dashboard"
              className="hover:text-[#C6A15B] transition-colors flex items-center gap-1 font-mono"
            >
              <Shield className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Dealer Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
