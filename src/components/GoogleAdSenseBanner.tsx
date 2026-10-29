import React, { useEffect, useState } from 'react';
import { Sparkles, DollarSign, HelpCircle, ExternalLink, ShieldCheck } from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface GoogleAdSenseBannerProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
  onOpenAdSenseGuide?: () => void;
}

export const GoogleAdSenseBanner: React.FC<GoogleAdSenseBannerProps> = ({
  slot = '1234567890',
  format = 'auto',
  className = '',
  onOpenAdSenseGuide,
}) => {
  const [adClient, setAdClient] = useState<string>(() => {
    const envClientId = (import.meta as any).env?.VITE_ADSENSE_CLIENT_ID;
    return (
      (envClientId as string) ||
      localStorage.getItem('adsense_client_id') ||
      ''
    );
  });

  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [hasAdError, setHasAdError] = useState(false);

  useEffect(() => {
    // If a valid publisher ID exists, load the official Google AdSense script
    if (adClient && adClient.startsWith('ca-pub-')) {
      try {
        const existingScript = document.getElementById('adsense-script');
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = 'adsense-script';
          script.async = true;
          script.crossOrigin = 'anonymous';
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
          document.head.appendChild(script);
        }

        // Push ad unit
        if (window.adsbygoogle) {
          window.adsbygoogle.push({});
          setIsAdLoaded(true);
        } else {
          window.adsbygoogle = [];
          window.adsbygoogle.push({});
          setIsAdLoaded(true);
        }
      } catch (err) {
        console.warn('AdSense notice:', err);
        setHasAdError(true);
      }
    }
  }, [adClient, slot]);

  // If live AdSense is active and configured
  if (adClient && adClient.startsWith('ca-pub-') && !hasAdError) {
    return (
      <div className={`w-full overflow-hidden my-6 text-center ${className}`}>
        <div className="text-[10px] tracking-wider uppercase text-stone-400 font-semibold mb-1">
          Advertisement
        </div>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adClient}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Preview / Pre-approval placeholder banner
  return (
    <div
      className={`w-full my-6 rounded-2xl border border-dashed border-stone-300/80 bg-stone-100/60 p-4 sm:p-5 transition-all text-center relative overflow-hidden group hover:border-amber-400/80 hover:bg-amber-50/30 ${className}`}
    >
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Google AdSense Display Ad Slot</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-stone-200 text-stone-700">
            {format.toUpperCase()} (Responsive)
          </span>
        </div>

        <p className="text-xs text-stone-600 max-w-md">
          This slot will automatically serve live targeted travel, airline, and hotel ads once your AdSense account is approved.
        </p>

        {onOpenAdSenseGuide && (
          <button
            type="button"
            onClick={onOpenAdSenseGuide}
            className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-800 text-xs font-medium hover:bg-stone-50 hover:text-amber-800 transition-all cursor-pointer shadow-xs"
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            <span>How to activate Google AdSense &amp; earn money</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </button>
        )}
      </div>
    </div>
  );
};
