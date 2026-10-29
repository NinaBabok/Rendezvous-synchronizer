import React, { useState } from 'react';
import { ShieldCheck, Users, ExternalLink, HelpCircle, ChevronDown, ChevronUp, PlaneTakeoff, Sparkles } from 'lucide-react';

interface BookingRoleExplainerProps {
  className?: string;
  defaultExpanded?: boolean;
}

export const BookingRoleExplainer: React.FC<BookingRoleExplainerProps> = ({ 
  className = '', 
  defaultExpanded = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-gradient-to-r from-amber-50/90 via-stone-50 to-orange-50/70 rounded-2xl border border-amber-200/90 p-4 sm:p-5 shadow-xs text-stone-900 transition-all ${className}`}>
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#3D2E24] text-amber-200 flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-200 text-stone-900">
                How Booking Works
              </span>
              <span className="text-xs font-semibold text-stone-600">
                We Match • You Book Direct With Each Airline
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold font-serif text-stone-900 mt-0.5">
              Important: Each traveler books their own flight on the airline’s website
            </h4>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-stone-700 hover:text-amber-800 flex items-center gap-1 shrink-0 p-1.5 rounded-lg hover:bg-amber-100/60 transition-colors cursor-pointer"
          aria-label={isExpanded ? "Collapse explanation" : "Expand explanation"}
        >
          <span className="hidden sm:inline">{isExpanded ? 'Hide Details' : 'Read How It Works'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-3.5 border-t border-amber-200/70 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 text-xs">
            {/* Pillar 1: Our Role */}
            <div className="p-3.5 rounded-xl bg-white/90 border border-stone-200/80 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-stone-900 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[11px] font-black">
                  1
                </span>
                <span>Our Role: The Matchmaker</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                We are an <strong>intermediary coordinator</strong>. We search hundreds of route combinations to discover the mutual destination and synchronized flight times where you and your friend land together without waiting hours. We do <strong>not</strong> sell tickets or collect customer payments.
              </p>
            </div>

            {/* Pillar 2: Independent Booking */}
            <div className="p-3.5 rounded-xl bg-white/90 border border-stone-200/80 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-stone-900 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center text-[11px] font-black">
                  2
                </span>
                <span>Each Books Directly</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Once you pick your ideal flight match, <strong>each traveler books their own flight separately</strong> on the airline's official page (e.g. Ryanair, Volotea, Croatia Airlines) using the direct links below.
              </p>
            </div>

            {/* Pillar 3: Official Protection */}
            <div className="p-3.5 rounded-xl bg-white/90 border border-stone-200/80 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-stone-900 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-[11px] font-black">
                  3
                </span>
                <span>Official Airline Guarantee</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Booking direct means <strong>0% middleman fees</strong>, official luggage add-ons, transparent customer service, and full European passenger rights (EU261) covered directly by the carrier.
              </p>
            </div>
          </div>

          <div className="mt-3 py-2 px-3 bg-amber-100/60 rounded-xl flex items-center justify-between text-[11px] text-amber-900 font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              Tip: Click <strong>"Share with Companion"</strong> below so both travelers have the exact flight numbers ready before booking!
            </span>
            <span className="hidden sm:inline font-bold text-amber-800">100% Free Coordination</span>
          </div>
        </div>
      )}
    </div>
  );
};
