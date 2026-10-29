import React, { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, X, ChevronRight, Tag, ShieldCheck, Wifi, Train, Plane, Heart } from 'lucide-react';

interface AdItem {
  id: string;
  category: string;
  title: string;
  highlight: string;
  tagText: string;
  ctaText: string;
  url: string;
  icon: React.ReactNode;
  bgBadge: string;
}

const SPONSORED_DEALS: AdItem[] = [
  {
    id: 'esim-italy',
    category: 'eSIM Partner',
    title: 'Europe Travel eSIM',
    highlight: 'Stay connected upon landing — 15% off unlimited data with code RENDEZVOUS',
    tagText: '15% OFF',
    ctaText: 'Get eSIM',
    url: 'https://airalo.com',
    icon: <Wifi className="w-3.5 h-3.5 text-sky-600" />,
    bgBadge: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  {
    id: 'airport-express',
    category: 'Airport Transfer',
    title: 'Milan & Rome Airport Express',
    highlight: 'Direct coaches from Bergamo/Malpensa & Leonardo Express from €9.90',
    tagText: 'BEST VALUE',
    ctaText: 'Book Transfer',
    url: 'https://www.terravision.eu',
    icon: <Train className="w-3.5 h-3.5 text-orange-600" />,
    bgBadge: 'bg-orange-50 text-orange-800 border-orange-200',
  },
  {
    id: 'travel-insurance',
    category: 'Travel Safe',
    title: 'Dual-Flight Trip Shield',
    highlight: 'Flight delay & luggage protection for both travelers starting at €1.80/day',
    tagText: 'RECOMMENDED',
    ctaText: 'Check Price',
    url: 'https://safetywing.com',
    icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
    bgBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
];

interface DiscreetAdBannerProps {
  onOpenTipModal?: () => void;
  onOpenAdvertiseModal?: () => void;
}

export const DiscreetAdBanner: React.FC<DiscreetAdBannerProps> = ({ 
  onOpenTipModal,
  onOpenAdvertiseModal 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Auto rotate sponsored deals every 8 seconds
  useEffect(() => {
    if (isDismissed || isMinimized) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SPONSORED_DEALS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isDismissed, isMinimized]);

  if (isDismissed) {
    return (
      <div className="fixed bottom-4 right-4 z-50 pb-[env(safe-area-inset-bottom)] mb-4 sm:mb-0 flex items-center gap-1.5">
        {onOpenAdvertiseModal && (
          <button
            onClick={onOpenAdvertiseModal}
            className="px-2.5 py-1 rounded-full bg-[#FAF6F0] hover:bg-[#F3E9DD] text-[11px] text-stone-700 border border-[#DFC9B7] shadow-md flex items-center gap-1 transition-all cursor-pointer"
            title="Advertise on this site"
          >
            <span>📢 Advertise</span>
          </button>
        )}
        <button
          onClick={() => setIsDismissed(false)}
          className="px-2.5 py-1 rounded-full bg-[#FAF6F0] hover:bg-[#F3E9DD] text-[11px] text-stone-800 border border-[#DFC9B7] shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          title="Show sponsored travel deals"
        >
          <Tag className="w-3 h-3 text-orange-600" />
          <span>Travel Deals</span>
        </button>
      </div>
    );
  }

  const deal = SPONSORED_DEALS[currentIndex];

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (deal.id === 'esim-italy') {
      navigator.clipboard?.writeText('RENDEZVOUS');
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2500);
    }
    // Open referral simulation or link
    window.open(deal.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside
      aria-label="Sponsored travel deals and support banner"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E6D8CA] bg-[#FAF6F0]/95 backdrop-blur-md text-stone-800 shadow-xl transition-all duration-300 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs mb-2 sm:mb-0">
        {/* Left side: Sponsored indicator & deal details */}
        <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto overflow-hidden">
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-stone-700 border border-[#DDC6B3] px-1.5 py-0.5 rounded bg-[#F2E7DC]">
            Ad
          </span>

          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${deal.bgBadge}`}>
              {deal.icon}
              <span>{deal.tagText}</span>
            </span>

            <div className="truncate text-stone-600 text-xs">
              <span className="font-bold text-stone-900 mr-1.5">{deal.title}:</span>
              <span className="text-stone-600 hidden md:inline">{deal.highlight}</span>
              <span className="text-stone-600 md:hidden truncate">{deal.highlight.split('—')[0]}</span>
            </div>
          </div>
        </div>

        {/* Right side: Action CTA + Advertise + Tip creator shortcut + Dismiss */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {copiedCoupon && (
            <span className="text-[11px] text-emerald-600 font-bold animate-pulse">
              Code RENDEZVOUS copied!
            </span>
          )}

          <a
            href={deal.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <span>{deal.ctaText}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {onOpenAdvertiseModal && (
            <button
              onClick={onOpenAdvertiseModal}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF6F0] hover:bg-[#F3E9DD] text-stone-800 text-[11px] font-semibold border border-[#DFC9B7] transition-colors cursor-pointer shadow-2xs"
              title="Configure Google AdSense or request a paid direct banner"
            >
              <span>📢 Ads &amp; AdSense</span>
            </button>
          )}

          {onOpenTipModal && (
            <button
              onClick={onOpenTipModal}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F5ECE2] hover:bg-[#EBDCCF] text-stone-900 text-xs font-semibold border border-[#DFC9B7] transition-colors cursor-pointer shadow-2xs"
              title="Support the creator"
            >
              <span>☕ Tip</span>
            </button>
          )}

          <div className="flex items-center border-l border-[#E6D8CA] pl-2 ml-1">
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-[#EBDCCF]/60 transition-colors cursor-pointer"
              title="Dismiss banner"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
