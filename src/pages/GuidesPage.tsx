import React from 'react';
import { Link } from 'react-router-dom';
import { useDealership } from '../context/DealershipContext';
import { SeoHead } from '../components/ui/SeoHead';
import { ArrowRight, Clock, Calendar } from 'lucide-react';

export const GuidesPage: React.FC = () => {
  const { guides } = useDealership();

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Zimbabwe Car Buying & Ownership Guides | Borrowdale Auto Sales"
        description="Comprehensive guides for vehicle buyers in Zimbabwe: how to inspect used cars in Harare, SUV vs double cab comparisons, trade-in advice, and ZIMRA paperwork checklists."
        canonicalUrl="https://borrowdaleautosales.co.zw/guides"
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
            Automotive Knowledge Engine
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase mt-1 mb-3 text-gray-900">
            Zimbabwe Motoring Guides
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            Practical, field-tested advice from our Borrowdale team covering inspections, paperwork, and model comparisons in Harare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {guides.map(guide => (
            <Link
              key={guide.id}
              to={`/guides/${guide.slug}`}
              className="bg-white border border-gray-200 rounded-[4px] overflow-hidden group flex flex-col justify-between shadow-xs hover:border-[#C6A15B] hover:shadow-lg transition-all"
            >
              <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                <img
                  src={guide.coverImage}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-[#C6A15B] mb-2 font-mono">
                    <span className="flex items-center gap-1 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      {guide.publishedDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {guide.readingTime}
                    </span>
                  </div>

                  <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase group-hover:text-[#C6A15B] transition-colors leading-tight mb-3 text-gray-900">
                    {guide.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {guide.summary}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#C6A15B]">
                  <span>Read In-Depth Guide</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
