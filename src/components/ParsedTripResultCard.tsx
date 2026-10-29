import React from 'react';
import { PlaneLanding, PlaneTakeoff } from 'lucide-react';
import type { ParsedTripIntent } from '../types';

interface ParsedTripResultCardProps {
  result: ParsedTripIntent;
  onOpenStep: (step: 'outbound' | 'return') => void;
}

export const ParsedTripResultCard: React.FC<ParsedTripResultCardProps> = ({ result, onOpenStep }) => {
  const destinationName = result.destinationCity === 'milano' ? 'Milan' : 'Rome';
  const airportLabel = result.destinationCity === 'milano' ? 'Milan BGY/MXP' : 'Rome FCO';

  return (
    <section aria-labelledby="parsed-trip-result-heading" className="mt-8 relative z-10 max-w-3xl mx-auto bg-white text-stone-900 rounded-2xl p-5 sm:p-6 shadow-2xl border-2 border-amber-400 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Synchronized Match
              </span>
              <span className="text-xs font-bold text-stone-500">{destinationName}, Italy</span>
            </div>
            <h2 id="parsed-trip-result-heading" className="text-base sm:text-lg font-bold font-serif text-stone-900 mt-0.5">
              {result.summary}
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
            <PlaneLanding className="w-3.5 h-3.5 text-emerald-700" />
            Outbound Arrival ({result.outboundDate})
          </div>
          <div className="text-xs text-stone-700 space-y-1">
            <p>• <strong>{result.traveler1Origin}:</strong> Direct flight to {airportLabel}</p>
            <p>• <strong>{result.traveler2Origin}:</strong> Direct flight to {airportLabel}</p>
            <p className="text-emerald-800 font-semibold pt-0.5">⏱️ Both land within ~75 min of each other!</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
            <PlaneTakeoff className="w-3.5 h-3.5 text-amber-700" />
            Return Takeoff ({result.returnDate})
          </div>
          <div className="text-xs text-stone-700 space-y-1">
            <p>• <strong>➔ {result.traveler1Origin}:</strong> Return flight in the evening</p>
            <p>• <strong>➔ {result.traveler2Origin}:</strong> Return flight in the evening</p>
            <p className="text-amber-800 font-semibold pt-0.5">⏱️ Coordinated departures on the same date!</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/70 leading-relaxed mb-4">
        💡 <strong>Rendezvous Logistics:</strong> {result.whyThisTrip}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <p className="text-xs text-stone-500 font-medium">
          Review complete flight numbers, baggage limits, and booking options:
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="home-open-outbound-btn"
            onClick={() => onOpenStep('outbound')}
            className="px-4 py-2 rounded-xl bg-[#2F241C] hover:bg-[#3D2E24] text-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs border border-[#523E30]"
          >
            <PlaneLanding className="w-3.5 h-3.5 text-emerald-400" />
            Step 1: View Outbound Flights
          </button>
          <button
            id="home-open-return-btn"
            onClick={() => onOpenStep('return')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <PlaneTakeoff className="w-3.5 h-3.5" />
            Step 2: View Return Flights
          </button>
        </div>
      </div>
    </section>
  );
};
