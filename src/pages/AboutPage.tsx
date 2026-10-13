import React from 'react';
import { useDealership } from '../context/DealershipContext';
import { SeoHead } from '../components/ui/SeoHead';
import { Link } from 'react-router-dom';
import { MapPin, CheckCircle2, MessageCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, content } = useDealership();
  const cleanWhatsApp = settings.whatsappPlaceholder.replace(/[^\d]/g, '') || '263770000000';

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="About Us | Premier Car Dealership in Borrowdale, Harare"
        description="Learn about Borrowdale Auto Sales: curated premium motorcars, uncompromising provenance checks, transparent USD pricing, and personalized service in Harare, Zimbabwe."
        canonicalUrl="https://borrowdaleautosales.co.zw/about"
      />

      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
            Borrowdale • Harare • Zimbabwe
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase mt-1 mb-4 text-gray-900">
            Distinction In Every Handover
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Borrowdale Auto Sales was established to give discerning Zimbabwean motorists a refreshingly straightforward, professional car-buying experience. No inflated markups, no vague provenance, no pressure.
          </p>
        </div>

        {/* Location Advantage */}
        <div className="bg-white border border-gray-200 rounded-[4px] p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
                The Address
              </span>
              <h2 className="font-heading text-3xl font-extrabold uppercase mt-1 mb-4 text-gray-900">
                The Borrowdale Advantage
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                Situated in Harare’s northern suburbs along Borrowdale Road (opposite Sam Levy’s Village), our showroom offers a discreet, secure, and relaxed environment to inspect high-end motorcars.
              </p>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                Unlike chaotic roadside lots, viewings are conducted in private bays with complete peace of mind, cold drinks, and direct consultation with senior decision-makers.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#C6A15B] font-semibold">
                <MapPin className="w-4 h-4" />
                <span>{settings.addressPlaceholder}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-[3px] border border-gray-200 space-y-4 text-xs">
              <h3 className="font-heading text-xl font-bold uppercase text-gray-900">
                What We Stand For
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7A33] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 block">Provenance Over Quantity</strong>
                    <span className="text-gray-600">We only buy and consign vehicles whose chassis numbers, service books, and ZIMRA clearances check out 100%.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7A33] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 block">Honest USD Pricing</strong>
                    <span className="text-gray-600">We quote realistic market rates upfront and give buyers the space to submit serious counter-offers.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7A33] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 block">Documentation Handled</strong>
                    <span className="text-gray-600">We ensure complete change-of-ownership peace of mind, from CID clearance to CVR blue book issuance.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {content.whyUs.map((pillar, idx) => (
            <div key={idx} className="p-6 rounded-[3px] bg-slate-50 border border-gray-200 shadow-xs">
              <span className="font-mono text-xs text-[#C6A15B] font-bold">0{idx + 1}</span>
              <h3 className="font-heading text-xl font-bold uppercase text-gray-900 mt-2 mb-1">
                {pillar.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-6">
          <h3 className="font-heading text-2xl font-bold uppercase mb-4 text-gray-900">
            Meet Us In Borrowdale
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/inventory"
              className="w-full sm:w-auto px-8 py-3 bg-[#C6A15B] text-gray-950 font-heading text-base font-bold uppercase tracking-wider rounded-[2px] hover:bg-[#A8843F] hover:text-white transition-colors shadow-xs"
            >
              Browse Current Showroom Stock
            </Link>
            <a
              href={`https://wa.me/${cleanWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3 bg-[#0E7A33] text-white font-heading text-base font-bold uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-2 hover:bg-[#0E7A33]/90 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message Us on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
