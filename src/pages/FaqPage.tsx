import React, { useState } from 'react';
import { useDealership } from '../context/DealershipContext';
import { SeoHead } from '../components/ui/SeoHead';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const { content, settings } = useDealership();
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const cleanWhatsApp = settings.whatsappPlaceholder.replace(/[^\d]/g, '') || '263770000000';

  const filteredFaqs = content.faqs.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': content.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Frequently Asked Questions | Borrowdale Auto Sales Harare"
        description="Get answers about car buying, negotiating prices, booking test drives, trade-ins, and paperwork at Borrowdale Auto Sales in Harare, Zimbabwe."
        canonicalUrl="https://borrowdaleautosales.co.zw/faq"
        schemaJsonLd={faqSchema}
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
            Help & Transparency
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase mt-1 mb-3 text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
            Everything you need to know about purchasing, trading, and viewing cars with us in Borrowdale.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md mx-auto">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions (e.g. trade-in, test drive, paperwork)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-[2px] pl-9 pr-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#C6A15B]"
          />
        </div>

        {/* Accordion */}
        <div className="space-y-3 mb-12">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="bg-white border border-gray-200 rounded-[3px] overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-heading text-lg sm:text-xl font-bold uppercase tracking-wide text-gray-900 hover:text-[#C6A15B] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C6A15B] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions? */}
        <div className="bg-slate-50 border border-gray-200 rounded-[4px] p-6 sm:p-8 text-center shadow-xs">
          <h3 className="font-heading text-2xl font-bold uppercase mb-2 text-gray-900">
            Have a question not listed here?
          </h3>
          <p className="text-xs text-gray-600 max-w-md mx-auto mb-5 leading-relaxed">
            Our team is always online on WhatsApp to answer specific questions regarding vehicles, paperwork, or valuations.
          </p>
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hi Borrowdale Auto Sales, I have a question regarding vehicle purchases in Harare.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[2px] bg-[#0E7A33] text-white font-heading text-sm font-bold uppercase tracking-wider hover:bg-[#0E7A33]/90 transition-colors shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ask Us On WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
