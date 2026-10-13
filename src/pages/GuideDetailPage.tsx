import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDealership } from '../context/DealershipContext';
import { SeoHead } from '../components/ui/SeoHead';
import { getGuideBySlug } from '../services/dataService';
import { ArrowLeft, Clock, Calendar, Share2, MessageCircle } from 'lucide-react';

export const GuideDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { settings, addToast } = useDealership();

  const guide = slug ? getGuideBySlug(slug) : null;
  const cleanWhatsApp = settings.whatsappPlaceholder.replace(/[^\d]/g, '') || '263770000000';

  if (!guide) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-heading text-4xl font-bold uppercase mb-3">Guide Not Found</h1>
        <Link to="/guides" className="text-xs text-[#C6A15B] underline">
          Return to All Guides
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: guide.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Article link copied to clipboard', 'info');
    }
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': guide.title,
    'description': guide.summary,
    'image': [guide.coverImage],
    'datePublished': guide.publishedDate,
    'author': {
      '@type': 'Organization',
      'name': 'Borrowdale Auto Sales'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Borrowdale Auto Sales',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://borrowdaleautosales.co.zw/logo.svg'
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title={`${guide.title} | Borrowdale Auto Sales`}
        description={guide.summary}
        ogType="article"
        ogImage={guide.coverImage}
        canonicalUrl={`https://borrowdaleautosales.co.zw/guides/${guide.slug}`}
        schemaJsonLd={articleSchema}
      />

      <article className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <Link
            to="/guides"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#C6A15B] transition-colors font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Guides</span>
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* Title & Metadata */}
        <header className="mb-8">
          <div className="flex items-center gap-3 text-xs text-[#C6A15B] mb-3 font-mono font-semibold">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {guide.publishedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {guide.readingTime}
            </span>
            <span>•</span>
            <span>{guide.author}</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase leading-tight text-gray-900 mb-4">
            {guide.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed italic border-l-2 border-[#C6A15B] pl-4">
            {guide.summary}
          </p>
        </header>

        {/* Featured Image */}
        <div className="aspect-[16/9] rounded-[4px] overflow-hidden border border-gray-200 mb-10 bg-gray-100 shadow-sm">
          <img src={guide.coverImage} alt={guide.title} className="w-full h-full object-cover" />
        </div>

        {/* Body Content */}
        <div className="prose max-w-none text-gray-800 text-sm sm:text-base leading-relaxed space-y-6">
          {guide.contentMarkdown.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="font-heading text-2xl font-bold uppercase text-[#C6A15B] pt-4 border-t border-gray-100">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n- ');
              return (
                <ul key={index} className="space-y-2 list-disc list-inside text-xs sm:text-sm text-gray-700">
                  {items.map((item, idx) => (
                    <li key={idx}>{item.replace('- ', '')}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Closing Inventory CTA */}
        <div className="mt-12 p-8 bg-slate-50 border border-gray-200 rounded-[4px] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h3 className="font-heading text-2xl font-bold uppercase text-gray-900">
              Inspect Inspected Cars in Borrowdale
            </h3>
            <p className="text-xs text-gray-600 mt-1 max-w-md">
              Every vehicle on our showroom floor has been vetted against this exact checklist. View available stock today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/inventory"
              className="px-6 py-2.5 bg-[#C6A15B] text-gray-950 font-heading text-sm font-bold uppercase tracking-wider rounded-[2px] hover:bg-[#A8843F] hover:text-white"
            >
              Browse Inventory
            </Link>
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hi Borrowdale Auto Sales, I just read your guide "${guide.title}" and would like to ask a question.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-[#0E7A33] text-white font-heading text-sm font-bold uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-1.5 hover:bg-[#0E7A33]/90"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </article>
    </div>
  );
};
