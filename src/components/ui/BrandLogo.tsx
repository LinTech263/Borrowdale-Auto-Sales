import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  variant?: 'full' | 'wordmark' | 'compact' | 'symbol';
  isLight?: boolean;
  className?: string;
  linkToHome?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  isLight = false,
  className = '',
  linkToHome = true
}) => {
  const content = (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {variant === 'wordmark' ? (
        // Editorial luxury wordmark variant
        <div className="flex flex-col items-start leading-none tracking-normal">
          <span
            className={`font-heading text-2xl md:text-3xl font-extrabold tracking-[0.18em] ${
              isLight ? 'text-[#0A0A0B]' : 'text-[#F5F2EB]'
            }`}
          >
            BORROWDALE
          </span>
          <div className="w-full flex items-center gap-2 my-1">
            <span className="h-[1px] flex-1 bg-[#C6A15B]/50" />
            <span
              className={`font-serif-accent text-xs md:text-sm tracking-[0.12em] uppercase ${
                isLight ? 'text-[#4A5568]' : 'text-[#9AA0A8]'
              }`}
            >
              Auto Sales
            </span>
            <span className="h-[1px] flex-1 bg-[#C6A15B]/50" />
          </div>
        </div>
      ) : variant === 'compact' ? (
        // Compact header variant with crisp emblem + wordmark
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded bg-[#16181B] border border-[#23272C] flex items-center justify-center overflow-hidden shrink-0 shadow-sm group">
            <svg viewBox="0 0 100 100" className="w-8 h-8">
              <path d="M 12 38 C 24 16 54 10 82 18 C 58 20 32 28 22 42 Z" fill="#0E7A33" />
              <path d="M 45 88 C 72 86 92 78 96 58 C 88 74 68 88 45 88 Z" fill="#EA580C" />
              <text x="50" y="62" fontFamily="'Barlow Condensed', sans-serif" fontWeight="900" fontSize="38" fill={isLight ? '#0A0A0B' : '#F5F2EB'} textAnchor="middle">BAS</text>
            </svg>
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#0E7A33] via-[#C6A15B] to-[#EA580C]" />
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1 font-heading text-lg md:text-xl font-bold tracking-[0.16em]">
              <span className={isLight ? 'text-[#0A0A0B]' : 'text-[#F5F2EB]'}>BORROWDALE</span>
            </div>
            <span className="font-serif-accent text-[11px] text-[#C6A15B] tracking-wider uppercase font-semibold">
              Auto Sales
            </span>
          </div>
        </div>
      ) : variant === 'symbol' ? (
        // Standalone Icon
        <div className="w-10 h-10 rounded bg-[#16181B] border border-[#23272C] flex items-center justify-center p-1">
          <img src="/favicon.svg" alt="BAS Emblem" className="w-8 h-8 object-contain" />
        </div>
      ) : (
        // Full official logo with green/orange swooshes and BAS metallic lettering
        <div className="flex items-center gap-3">
          <div className="h-10 md:h-12 w-auto flex items-center">
            <img
              src="/logo.svg"
              alt="Borrowdale Auto Sales"
              className="h-10 md:h-12 w-auto object-contain filter drop-shadow-sm"
            />
          </div>
        </div>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link to="/" className="focus:outline-none focus:ring-1 focus:ring-[#C6A15B] rounded transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
};
