import React from 'react';
import { 
  Plane, 
  Clock, 
  Euro, 
  Sparkles, 
  ExternalLink, 
  Share2, 
  ShieldCheck, 
  Luggage, 
  MessageSquare,
  ArrowRight,
  Coffee,
  Train,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { SynchronizedMatch } from '../types';
import { formatMinutesDiff } from '../utils';

interface ReturnFlightCardProps {
  match: SynchronizedMatch;
  onShare: (match: SynchronizedMatch) => void;
  onOpenConciergeWithContext: (prompt: string) => void;
}

export const ReturnFlightCard: React.FC<ReturnFlightCardProps> = ({
  match,
  onShare,
  onOpenConciergeWithContext,
}) => {
  const {
    date,
    destinationCity,
    toulouseFlight,
    zagrebFlight,
    arrivalDifferenceMinutes,
    sameDestinationAirport,
    syncRating,
    syncDescription,
    meetingLocationTip,
    totalCombinedPriceEur,
    bothDirect,
    firstArrival,
  } = match;

  const cityName = destinationCity === 'milano' ? 'Milan' : 'Rome';

  const dateFormatted = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden transition-all">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-base shrink-0">
            🛫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Return Departure Itinerary
              </span>
              <span className="text-stone-500">•</span>
              <span className="text-xs text-stone-300 font-medium">
                {cityName} ➔ Home
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-serif text-white flex items-center gap-2">
              {dateFormatted}
            </h3>
          </div>
        </div>

        {/* Sync Rating Tag */}
        <div className="flex items-center gap-2.5">
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
              syncRating === 'perfect'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : syncRating === 'great'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-stone-800 text-stone-300 border border-stone-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>
              {arrivalDifferenceMinutes === 0
                ? 'Simultaneous departures!'
                : `Departures ~${formatMinutesDiff(arrivalDifferenceMinutes)} apart`}
            </span>
          </div>

          <button
            id="share-return-flight-btn"
            onClick={() => onShare(match)}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Send to Mom</span>
          </button>
        </div>
      </div>

      {/* Sync Strategy Highlight Bar */}
      <div className="bg-amber-50/80 border-b border-amber-100 px-5 sm:px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-950">
        <div className="flex items-start sm:items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Departure Coordination:</strong> {syncDescription}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-medium text-stone-600 text-[11px]">
          <span>Combined Total Return:</span>
          <strong className="text-stone-900 text-sm font-bold">~€{totalCombinedPriceEur}</strong>
        </div>
      </div>

      {/* Dual Flight Cards: Nikolina & Mom Side-by-Side */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --- TRAVELER 1: NIKOLINA (Milan/Rome -> Toulouse TLS) --- */}
        <div className="bg-stone-50/70 rounded-2xl p-5 border border-stone-200/80 flex flex-col justify-between relative group hover:border-amber-300 transition-all">
          <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-stone-900 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
            Traveler 1 • Toulouse (TLS) Return
          </div>

          <div>
            {/* Airline and Flight info */}
            <div className="flex items-center justify-between mt-1 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center font-bold text-xs text-stone-800 shadow-2xs">
                  {toulouseFlight.airlineCode}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 leading-tight">
                    {toulouseFlight.airline}
                  </h4>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {toulouseFlight.flightNumber}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-extrabold text-stone-900">
                  €{toulouseFlight.estimatedPriceEur}
                </span>
                <span className="block text-[10px] text-stone-400">est. one-way</span>
              </div>
            </div>

            {/* Flight Timetable */}
            <div className="bg-white rounded-xl p-4 border border-stone-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-black font-mono text-stone-900">
                    {toulouseFlight.departureTime}
                  </div>
                  <div className="text-xs font-bold text-stone-700">
                    {cityName} ({toulouseFlight.originAirport})
                  </div>
                </div>

                <div className="flex-1 px-4 flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-stone-400 mb-1">
                    {Math.floor(toulouseFlight.durationTotalMinutes / 60)}h{' '}
                    {toulouseFlight.durationTotalMinutes % 60}m
                  </span>
                  <div className="w-full flex items-center">
                    <div className="h-0.5 flex-1 bg-stone-300"></div>
                    <Plane className="w-3.5 h-3.5 text-stone-600 mx-1 rotate-90" />
                    <div className="h-0.5 flex-1 bg-stone-300"></div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 mt-1">
                    {toulouseFlight.isDirect ? 'Direct Flight' : '1-Stop Connection'}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black font-mono text-stone-900">
                    {toulouseFlight.arrivalTime}
                  </div>
                  <div className="text-xs font-bold text-stone-700">
                    Toulouse (TLS)
                  </div>
                </div>
              </div>

              {/* Luggage / note */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center gap-1">
                  <Luggage className="w-3 h-3 text-stone-400" />
                  {toulouseFlight.baggageNote}
                </span>
                <span className="px-2 py-0.5 bg-stone-100 rounded text-[10px] font-semibold text-stone-600">
                  {toulouseFlight.cabinClass}
                </span>
              </div>
            </div>
          </div>

          {/* Traveler 1 Independent Booking Action */}
          <div className="mt-4 pt-3 border-t border-stone-200/60 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-stone-600 px-1 font-medium">
              <span className="flex items-center gap-1 font-bold text-stone-800">
                <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px]">1</span>
                Traveler 1: Book return
              </span>
              <span className="text-stone-500 font-mono text-[10px]">Dep. {toulouseFlight.originAirport}</span>
            </div>
            <a
              id={`book-toulouse-return-${match.date}`}
              href={toulouseFlight.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl text-xs font-bold text-amber-200 bg-[#3D2E24] hover:bg-[#4D3A2E] border border-[#594537] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs group"
            >
              <span>Book Traveler 1 Return ({toulouseFlight.airline} → TLS)</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <p className="text-[10px] text-center text-stone-500">
              Direct booking on airline website / Google Flights
            </p>
          </div>
        </div>

        {/* --- TRAVELER 2: COMPANION (Milan/Rome -> Zagreb ZAG) --- */}
        <div className="bg-stone-50/70 rounded-2xl p-5 border border-stone-200/80 flex flex-col justify-between relative group hover:border-amber-300 transition-all">
          <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
            Traveler 2 • Zagreb (ZAG) Return
          </div>

          <div>
            {/* Airline and Flight info */}
            <div className="flex items-center justify-between mt-1 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center font-bold text-xs text-amber-800 shadow-2xs">
                  {zagrebFlight.airlineCode}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 leading-tight">
                    {zagrebFlight.airline}
                  </h4>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {zagrebFlight.flightNumber}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-extrabold text-stone-900">
                  €{zagrebFlight.estimatedPriceEur}
                </span>
                <span className="block text-[10px] text-stone-400">est. one-way</span>
              </div>
            </div>

            {/* Flight Timetable */}
            <div className="bg-white rounded-xl p-4 border border-stone-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-black font-mono text-stone-900">
                    {zagrebFlight.departureTime}
                  </div>
                  <div className="text-xs font-bold text-stone-700">
                    {cityName} ({zagrebFlight.originAirport})
                  </div>
                </div>

                <div className="flex-1 px-4 flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-stone-400 mb-1">
                    {Math.floor(zagrebFlight.durationTotalMinutes / 60)}h{' '}
                    {zagrebFlight.durationTotalMinutes % 60}m
                  </span>
                  <div className="w-full flex items-center">
                    <div className="h-0.5 flex-1 bg-stone-300"></div>
                    <Plane className="w-3.5 h-3.5 text-stone-600 mx-1 rotate-90" />
                    <div className="h-0.5 flex-1 bg-stone-300"></div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 mt-1">
                    {zagrebFlight.isDirect ? 'Direct Flight' : '1-Stop Connection'}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black font-mono text-stone-900">
                    {zagrebFlight.arrivalTime}
                  </div>
                  <div className="text-xs font-bold text-stone-700">
                    Zagreb (ZAG)
                  </div>
                </div>
              </div>

              {/* Luggage / note */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center gap-1">
                  <Luggage className="w-3 h-3 text-stone-400" />
                  {zagrebFlight.baggageNote}
                </span>
                <span className="px-2 py-0.5 bg-stone-100 rounded text-[10px] font-semibold text-stone-600">
                  {zagrebFlight.cabinClass}
                </span>
              </div>
            </div>
          </div>

          {/* Traveler 2 Independent Booking Action */}
          <div className="mt-4 pt-3 border-t border-stone-200/60 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-stone-600 px-1 font-medium">
              <span className="flex items-center gap-1 font-bold text-stone-800">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px]">2</span>
                Traveler 2: Book return
              </span>
              <span className="text-stone-500 font-mono text-[10px]">Dep. {zagrebFlight.originAirport}</span>
            </div>
            <a
              id={`book-zagreb-return-${match.date}`}
              href={zagrebFlight.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl text-xs font-bold text-amber-200 bg-[#3D2E24] hover:bg-[#4D3A2E] border border-[#594537] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs group"
            >
              <span>Book Traveler 2 Return ({zagrebFlight.airline} → ZAG)</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <p className="text-[10px] text-center text-stone-500">
              Direct booking on airline website / Google Flights
            </p>
          </div>
        </div>
      </div>

      {/* Direct Booking & Intermediary Policy Banner */}
      <div className="mx-6 mb-4 px-4 py-3 bg-stone-100/90 rounded-xl border border-stone-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-700">
        <div className="flex items-start sm:items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed">
            <strong className="text-stone-900">How we work:</strong> We are your meeting matchmaker — we coordinate the synchronized schedule and destination. <strong>Each traveler purchases their own ticket directly on the operating airline’s site.</strong> We never collect payment.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 shrink-0">
          Direct Airline Price
        </span>
      </div>

      {/* Farewell & Airport Logistics Tip Section */}
      <div className="bg-stone-50 border-t border-stone-200 px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5 text-xs text-stone-700">
          <Coffee className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="text-stone-900">Departure &amp; Farewell Logistics:</strong>{' '}
            <span>{meetingLocationTip}</span>
          </div>
        </div>

        <button
          id="ask-concierge-about-return-btn"
          onClick={() =>
            onOpenConciergeWithContext(
              `We are planning our return flight on ${dateFormatted} from ${cityName}. Traveler 1 departs to TLS at ${toulouseFlight.departureTime} from ${toulouseFlight.originAirport} and Traveler 2 departs to ZAG at ${zagrebFlight.departureTime} from ${zagrebFlight.originAirport}. What is the best schedule for checking out of the hotel and airport transfers?`
            )
          }
          className="shrink-0 px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>Ask AI Concierge</span>
        </button>
      </div>
    </div>
  );
};
