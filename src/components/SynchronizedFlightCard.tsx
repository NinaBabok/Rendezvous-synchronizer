import React, { useState } from 'react';
import { 
  Plane, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Luggage, 
  ExternalLink, 
  CheckCircle2, 
  Share2, 
  Calendar,
  AlertCircle,
  Sparkles,
  Coffee,
  Train,
  ShieldCheck
} from 'lucide-react';
import { SynchronizedMatch } from '../types';
import { formatMinutesDiff } from '../utils';

interface SynchronizedFlightCardProps {
  match: SynchronizedMatch;
  onShare: (match: SynchronizedMatch) => void;
  onOpenConciergeWithContext: (prompt: string) => void;
}

export const SynchronizedFlightCard: React.FC<SynchronizedFlightCardProps> = ({
  match,
  onShare,
  onOpenConciergeWithContext,
}) => {
  const [showReturn, setShowReturn] = useState(false);
  const { toulouseFlight, zagrebFlight, date, destinationCity } = match;

  const formatDateTitle = (dStr: string) => {
    const d = new Date(dStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getAirlineColor = (code: string) => {
    switch (code) {
      case 'FR':
        return 'bg-blue-600 text-white'; // Ryanair
      case 'U2':
        return 'bg-amber-500 text-white'; // easyJet
      case 'OU':
        return 'bg-sky-700 text-white'; // Croatia Airlines
      case 'AF':
        return 'bg-indigo-900 text-white'; // Air France
      case 'LH':
        return 'bg-yellow-600 text-white'; // Lufthansa
      default:
        return 'bg-stone-800 text-white';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs mb-8">
      {/* Header bar */}
      <div className="bg-stone-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-stone-800 rounded-lg text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
              Selected Rendezvous Date
            </span>
            <h2 className="text-lg font-bold font-serif">{formatDateTitle(date)}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-stone-400">Combined Outbound Cost</div>
            <div className="text-base font-extrabold text-amber-300">
              €{match.totalCombinedPriceEur} total
            </div>
          </div>
          <button
            id="share-itinerary-btn"
            onClick={() => onShare(match)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors cursor-pointer shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share with Mom
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className={`px-6 py-3.5 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
        match.syncRating === 'perfect'
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          : match.syncRating === 'great'
          ? 'bg-amber-50/80 border-amber-200 text-amber-950'
          : 'bg-stone-100/90 border-stone-200 text-stone-800'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-ping"></span>
          <p className="text-xs sm:text-sm font-semibold">
            {match.syncDescription}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            Arrival Gap: <span className="text-stone-900">{formatMinutesDiff(match.arrivalDifferenceMinutes)}</span>
          </span>
          {match.sameDestinationAirport && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Same Airport ({toulouseFlight.destinationAirport})
            </span>
          )}
        </div>
      </div>

      {/* Side-by-Side Dual Flight Details */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* Vertical divider on large screens */}
        <div className="hidden lg:block absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-px bg-stone-200"></div>

        {/* Flight 1: Nikolina (Toulouse) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Traveler 1 (Your Flight)</span>
                <h3 className="text-base font-bold text-stone-900">Toulouse (TLS) ✈️ {destinationCity === 'milano' ? 'Milan' : 'Rome'}</h3>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getAirlineColor(toulouseFlight.airlineCode)}`}>
              {toulouseFlight.airline} • {toulouseFlight.flightNumber}
            </span>
          </div>

          {/* Time & Route Bar */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-stone-900">{toulouseFlight.departureTime}</div>
                <div className="text-xs font-bold text-stone-600">Toulouse-Blagnac</div>
                <div className="text-[11px] text-stone-400">TLS • Terminal 1</div>
              </div>

              <div className="flex-1 px-4 flex flex-col items-center">
                <span className="text-[11px] font-semibold text-stone-500 mb-1">
                  {Math.floor(toulouseFlight.durationTotalMinutes / 60)}h {toulouseFlight.durationTotalMinutes % 60}m
                </span>
                <div className="w-full flex items-center">
                  <div className="w-2 h-2 rounded-full bg-stone-400"></div>
                  <div className="flex-1 h-0.5 bg-stone-300 relative">
                    <Plane className="w-3.5 h-3.5 text-stone-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                </div>
                <span className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded ${
                  toulouseFlight.isDirect ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                }`}>
                  {toulouseFlight.isDirect ? 'Direct Flight' : `1-Stop (${toulouseFlight.layoverAirport})`}
                </span>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-rose-700">{toulouseFlight.arrivalTime}</div>
                <div className="text-xs font-bold text-stone-800">
                  {toulouseFlight.destinationAirport === 'MXP' ? 'Malpensa (MXP)' : 
                   toulouseFlight.destinationAirport === 'BGY' ? 'Bergamo (BGY)' :
                   toulouseFlight.destinationAirport === 'LIN' ? 'Linate (LIN)' : 'Fiumicino (FCO)'}
                </div>
                <div className="text-[11px] text-stone-400">Arrivals Hall</div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-600">
              <span className="flex items-center gap-1">
                <Luggage className="w-3.5 h-3.5 text-stone-400" />
                {toulouseFlight.baggageNote}
              </span>
              <span className="font-bold text-stone-900 text-sm">~€{toulouseFlight.estimatedPriceEur}</span>
            </div>
          </div>

          {/* Traveler 1 Independent Booking Action */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-stone-600 px-1 font-medium">
              <span className="flex items-center gap-1 font-bold text-stone-800">
                <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px]">1</span>
                Traveler 1: Book independently
              </span>
              <span className="text-stone-500 font-mono text-[10px]">Official Airline / Google Flights</span>
            </div>
            <a
              id="book-toulouse-flight-btn"
              href={toulouseFlight.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#3D2E24] hover:bg-[#4D3A2E] text-amber-200 border border-[#594537] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs group"
            >
              <span>Book Traveler 1 Flight ({toulouseFlight.airline} • TLS → {toulouseFlight.destinationAirport})</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <p className="text-[10px] text-center text-stone-500">
              Opens carrier page in new tab • You purchase directly from the operating airline in your name
            </p>
          </div>
        </div>

        {/* Flight 2: Mom (Zagreb) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Traveler 2 (Companion)</span>
                <h3 className="text-base font-bold text-stone-900">Zagreb (ZAG) ✈️ {destinationCity === 'milano' ? 'Milan' : 'Rome'}</h3>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getAirlineColor(zagrebFlight.airlineCode)}`}>
              {zagrebFlight.airline} • {zagrebFlight.flightNumber}
            </span>
          </div>

          {/* Time & Route Bar */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-stone-900">{zagrebFlight.departureTime}</div>
                <div className="text-xs font-bold text-stone-600">Zagreb Tuđman</div>
                <div className="text-[11px] text-stone-400">ZAG • Main Terminal</div>
              </div>

              <div className="flex-1 px-4 flex flex-col items-center">
                <span className="text-[11px] font-semibold text-stone-500 mb-1">
                  {Math.floor(zagrebFlight.durationTotalMinutes / 60)}h {zagrebFlight.durationTotalMinutes % 60}m
                </span>
                <div className="w-full flex items-center">
                  <div className="w-2 h-2 rounded-full bg-stone-400"></div>
                  <div className="flex-1 h-0.5 bg-stone-300 relative">
                    <Plane className="w-3.5 h-3.5 text-stone-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                </div>
                <span className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded ${
                  zagrebFlight.isDirect ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                }`}>
                  {zagrebFlight.isDirect ? 'Direct Flight' : `1-Stop (${zagrebFlight.layoverAirport})`}
                </span>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-amber-700">{zagrebFlight.arrivalTime}</div>
                <div className="text-xs font-bold text-stone-800">
                  {zagrebFlight.destinationAirport === 'MXP' ? 'Malpensa (MXP)' : 
                   zagrebFlight.destinationAirport === 'BGY' ? 'Bergamo (BGY)' :
                   zagrebFlight.destinationAirport === 'LIN' ? 'Linate (LIN)' : 'Fiumicino (FCO)'}
                </div>
                <div className="text-[11px] text-stone-400">Arrivals Hall</div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-600">
              <span className="flex items-center gap-1">
                <Luggage className="w-3.5 h-3.5 text-stone-400" />
                {zagrebFlight.baggageNote}
              </span>
              <span className="font-bold text-stone-900 text-sm">~€{zagrebFlight.estimatedPriceEur}</span>
            </div>
          </div>

          {/* Traveler 2 Independent Booking Action */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-stone-600 px-1 font-medium">
              <span className="flex items-center gap-1 font-bold text-stone-800">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px]">2</span>
                Traveler 2: Book independently
              </span>
              <span className="text-stone-500 font-mono text-[10px]">Official Airline / Google Flights</span>
            </div>
            <a
              id="book-zagreb-flight-btn"
              href={zagrebFlight.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#3D2E24] hover:bg-[#4D3A2E] text-amber-200 border border-[#594537] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs group"
            >
              <span>Book Traveler 2 Flight ({zagrebFlight.airline} • ZAG → {zagrebFlight.destinationAirport})</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <p className="text-[10px] text-center text-stone-500">
              Opens carrier page in new tab • Your companion purchases directly from their airline in their name
            </p>
          </div>
        </div>
      </div>

      {/* Direct Booking & Intermediary Policy Banner */}
      <div className="mx-6 mb-4 px-4 py-3 bg-stone-100/90 rounded-xl border border-stone-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-700">
        <div className="flex items-start sm:items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed">
            <strong className="text-stone-900">How we work:</strong> We are your meeting matchmaker — we synchronize the flight schedules and destinations. <strong>Each traveler buys their own ticket directly on the operating airline’s website.</strong> We do not take payments or charge booking markups.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 shrink-0">
          Direct Airline Price
        </span>
      </div>

      {/* Rendezvous Meeting Logistics Box */}
      <div className="mx-6 mb-6 p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-600 rounded-lg text-white shrink-0 mt-0.5">
            {match.sameDestinationAirport ? <Coffee className="w-4 h-4" /> : <Train className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Rendezvous &amp; Arrival Logistics
            </h4>
            <p className="text-xs text-stone-700 mt-1 leading-relaxed">
              {match.meetingLocationTip}
            </p>
          </div>
        </div>

        <button
          id="ask-concierge-logistics-btn"
          onClick={() => onOpenConciergeWithContext(`How should my travel companion and I coordinate our arrival in ${destinationCity === 'milano' ? 'Milan' : 'Rome'} on ${date}? One of us arrives at ${toulouseFlight.arrivalTime} and the other at ${zagrebFlight.arrivalTime}.`)}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Ask Concierge Meeting Strategy
        </button>
      </div>

      {/* Optional Return Trip Accordion */}
      {match.returnMatch && (
        <div className="border-t border-stone-200 px-6 py-4 bg-stone-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-700">
                Want a full 3-day long weekend package?
              </span>
              <span className="text-xs text-stone-500">
                (Return on {match.returnMatch.returnDate})
              </span>
            </div>
            <button
              id="toggle-return-trip-btn"
              onClick={() => setShowReturn(!showReturn)}
              className="text-xs font-bold text-stone-900 hover:text-amber-700 underline cursor-pointer"
            >
              {showReturn ? 'Hide Return Flights' : 'Show Synchronized Return Flights (+€' + (match.returnMatch.totalRoundtripPriceEur - match.totalCombinedPriceEur) + ')'}
            </button>
          </div>

          {showReturn && (
            <div className="mt-4 pt-4 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs">
                <div className="font-bold text-stone-900 mb-1">
                  Traveler 1's Return: {match.returnMatch.toulouseReturn.destinationCity.toUpperCase()} → TLS
                </div>
                <div className="text-stone-600 flex justify-between">
                  <span>{match.returnMatch.toulouseReturn.airline} ({match.returnMatch.toulouseReturn.flightNumber})</span>
                  <span className="font-bold">{match.returnMatch.toulouseReturn.departureTime} → {match.returnMatch.toulouseReturn.arrivalTime}</span>
                </div>
                <div className="mt-2 text-right font-extrabold text-stone-900">
                  ~€{match.returnMatch.toulouseReturn.estimatedPriceEur}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs">
                <div className="font-bold text-stone-900 mb-1">
                  Traveler 2's Return: {match.returnMatch.zagrebReturn.destinationCity.toUpperCase()} → ZAG
                </div>
                <div className="text-stone-600 flex justify-between">
                  <span>{match.returnMatch.zagrebReturn.airline} ({match.returnMatch.zagrebReturn.flightNumber})</span>
                  <span className="font-bold">{match.returnMatch.zagrebReturn.departureTime} → {match.returnMatch.zagrebReturn.arrivalTime}</span>
                </div>
                <div className="mt-2 text-right font-extrabold text-stone-900">
                  ~€{match.returnMatch.zagrebReturn.estimatedPriceEur}
                </div>
              </div>

              <div className="sm:col-span-2 text-center text-xs font-bold text-stone-700 pt-1">
                Total Round-Trip Estimated Cost for Both Travelers: <span className="text-amber-700 text-sm font-black">€{match.returnMatch.totalRoundtripPriceEur}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
