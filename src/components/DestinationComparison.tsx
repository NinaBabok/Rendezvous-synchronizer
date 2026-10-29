import React from 'react';
import { 
  Sun, 
  Plane, 
  MapPin, 
  Heart, 
  Check, 
  X, 
  ArrowRight, 
  Sparkles,
  Users,
  Calendar,
  Compass,
  Clock
} from 'lucide-react';
import { DestinationCity, SynchronizedMatch } from '../types';
import { CITY_COMPARISON } from '../data/flightScheduleDatabase';
import { POPULAR_CITIES } from '../data/cities';
import { formatMinutesDiff } from '../utils';

interface DestinationComparisonProps {
  currentDestination: DestinationCity;
  destinationName?: string;
  traveler1Origin?: string;
  traveler2Origin?: string;
  selectedOutboundDate?: string;
  selectedReturnDate?: string;
  currentOutboundMatch?: SynchronizedMatch;
  onSelectDestination: (city: DestinationCity, customName?: string) => void;
  onOpenConciergeWithContext: (prompt: string) => void;
  onGoToAirportsTab?: () => void;
}

export const DestinationComparison: React.FC<DestinationComparisonProps> = ({
  currentDestination,
  destinationName,
  traveler1Origin,
  traveler2Origin,
  selectedOutboundDate,
  selectedReturnDate,
  currentOutboundMatch,
  onSelectDestination,
  onOpenConciergeWithContext,
  onGoToAirportsTab,
}) => {
  const milan = CITY_COMPARISON.milano;
  const rome = CITY_COMPARISON.roma;

  const t1Full = traveler1Origin?.trim() || 'Traveler 1 City';
  const t2Full = traveler2Origin?.trim() || 'Traveler 2 City';
  const t1Short = t1Full.split(' (')[0];
  const t2Short = t2Full.split(' (')[0];

  const rawDestName = destinationName?.trim() || (currentDestination === 'roma' ? 'Rome' : 'Milan');
  const destShort = rawDestName.split(' (')[0];

  // Look up city metadata in POPULAR_CITIES if user picked a custom city
  const matchedCityMeta = POPULAR_CITIES.find(
    (c) =>
      c.name.toLowerCase() === rawDestName.toLowerCase() ||
      c.city.toLowerCase() === destShort.toLowerCase() ||
      (c.localName && c.localName.toLowerCase() === destShort.toLowerCase())
  );

  const isCustomCity =
    matchedCityMeta &&
    matchedCityMeta.id !== 'milan' &&
    matchedCityMeta.id !== 'rome';

  const primaryHubData = currentDestination === 'roma' ? rome : milan;
  const primaryAirports = matchedCityMeta?.airportCodes?.length
    ? matchedCityMeta.airportCodes.join(', ')
    : currentDestination === 'roma'
    ? 'FCO, CIA'
    : 'BGY, MXP, LIN';

  const formatDateNice = (dStr?: string) => {
    if (!dStr) return '';
    const d = new Date(dStr);
    if (isNaN(d.getTime())) return dStr;
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8 mb-10 animate-fadeIn">
      {/* Personalized Hero Overview Card */}
      <div className="bg-gradient-to-br from-[#FAF5EE] via-[#F4EBE0] to-[#FFF9F3] text-stone-900 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm border border-[#E6D6C6]">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/15 text-orange-900 border border-orange-300/80 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              Personalized Travel Guide
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-stone-800 border border-stone-200/90 inline-flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              {t1Short} &amp; {t2Short} ➔ {destShort}
            </span>
            {selectedOutboundDate && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-stone-700 border border-stone-200/90 inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                {formatDateNice(selectedOutboundDate)}
                {selectedReturnDate ? ` – ${formatDateNice(selectedReturnDate)}` : ''}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif mt-3.5 tracking-tight text-stone-900">
            Your Personalized Rendezvous Guide for {destShort}
            {matchedCityMeta?.country ? `, ${matchedCityMeta.country}` : ''}
          </h2>
          <p className="text-sm sm:text-base text-stone-700 mt-2 max-w-3xl leading-relaxed">
            Custom-tailored for <strong>Traveler 1 departing from {t1Full}</strong> and{' '}
            <strong>Traveler 2 departing from {t2Full}</strong> meeting in <strong>{rawDestName}</strong>.
            Explore your synchronized arrival breakdown, airport transit logistics, and curated highlights for your trip together.
          </p>

          {/* Personalized Dual-Origin Route Breakdown Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Traveler 1 Route Card */}
            <div className="bg-white/95 rounded-2xl p-4 border border-[#E2D2C2] shadow-2xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-orange-700 flex items-center justify-between">
                <span>Traveler 1 Route</span>
                <Plane className="w-3.5 h-3.5 text-orange-600" />
              </div>
              <div className="text-base font-bold text-stone-900 mt-1">
                {t1Full} ➔ {destShort}
              </div>
              {currentOutboundMatch ? (
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  Suggested carrier: <strong>{currentOutboundMatch.toulouseFlight.airline}</strong> • Departs{' '}
                  <strong>{currentOutboundMatch.toulouseFlight.departureTime}</strong>, lands at{' '}
                  <strong>{currentOutboundMatch.toulouseFlight.arrivalTime}</strong> ({primaryAirports.split(',')[0]}).
                </p>
              ) : (
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  Direct &amp; 1-stop connections available into {primaryAirports}.
                </p>
              )}
            </div>

            {/* Traveler 2 Route Card */}
            <div className="bg-white/95 rounded-2xl p-4 border border-[#E2D2C2] shadow-2xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center justify-between">
                <span>Traveler 2 Route</span>
                <Plane className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-base font-bold text-stone-900 mt-1">
                {t2Full} ➔ {destShort}
              </div>
              {currentOutboundMatch ? (
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  Suggested carrier: <strong>{currentOutboundMatch.zagrebFlight.airline}</strong> • Departs{' '}
                  <strong>{currentOutboundMatch.zagrebFlight.departureTime}</strong>, lands at{' '}
                  <strong>{currentOutboundMatch.zagrebFlight.arrivalTime}</strong> ({primaryAirports.split(',')[0]}).
                </p>
              ) : (
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  Direct &amp; 1-stop connections available into {primaryAirports}.
                </p>
              )}
            </div>

            {/* Rendezvous Sync Status Card */}
            <div className="bg-emerald-50/90 rounded-2xl p-4 border border-emerald-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center justify-between">
                  <span>Arrival Synchronization</span>
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <div className="text-base font-bold text-emerald-950 mt-1">
                  {currentOutboundMatch
                    ? `${formatMinutesDiff(currentOutboundMatch.arrivalDifferenceMinutes)} Landing Gap`
                    : `Coordinated at ${destShort}`}
                </div>
                <p className="text-xs text-emerald-900/90 mt-1 leading-relaxed">
                  Both travelers from {t1Short} and {t2Short} can meet directly at the terminal coffee lounge and take one shared transfer into central {destShort}.
                </p>
              </div>
              {onGoToAirportsTab && (
                <button
                  onClick={onGoToAirportsTab}
                  className="mt-2.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 cursor-pointer underline"
                >
                  <span>View {destShort} Terminal Meeting Point</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              id="view-synchronized-flights-for-dest-btn"
              onClick={() => onSelectDestination(currentDestination, rawDestName)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-md ring-2 ring-orange-400/40 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>View Synchronized Flights for {t1Short} &amp; {t2Short} ➔ {destShort}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <button
              id="ask-concierge-custom-route-btn"
              onClick={() =>
                onOpenConciergeWithContext(
                  `Create a personalized 4-day rendezvous travel guide and itinerary in ${rawDestName} for two travelers flying in from ${t1Full} and ${t2Full}${
                    selectedOutboundDate ? ` from ${selectedOutboundDate} to ${selectedReturnDate || ''}` : ''
                  }. Include the best neighborhood to stay, airport transit tips, and relaxed dining spots.`
                )
              }
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#2F241C] hover:bg-[#3D2E24] text-amber-200 border border-[#523E30] transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Generate Custom AI Itinerary for {destShort}</span>
            </button>
          </div>
        </div>
      </div>

      {/* If user selected a custom European city outside Milan/Rome, show a dedicated Personalized Spotlight card */}
      {isCustomCity && matchedCityMeta && (
        <div className="bg-white rounded-2xl border-2 border-amber-400/80 p-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                Selected Meeting Destination Spotlight
              </span>
              <h3 className="text-2xl font-bold font-serif text-stone-900 mt-0.5">
                {matchedCityMeta.name}, {matchedCityMeta.country}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {matchedCityMeta.description || `European rendezvous hub for ${t1Short} and ${t2Short}.`}
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 shrink-0">
              Airports: {matchedCityMeta.airportCodes.join(' / ')}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs text-stone-700">
              <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-orange-600" />
                Route Logistics for {t1Short} &amp; {t2Short}
              </div>
              <p>
                <strong>From {t1Full}:</strong> Flights arrive into{' '}
                {matchedCityMeta.airportNames?.[0] || matchedCityMeta.airportCodes[0]} with synchronized morning and afternoon slots.
              </p>
              <p>
                <strong>From {t2Full}:</strong> Coordinated arrivals into{' '}
                {matchedCityMeta.airportNames?.[0] || matchedCityMeta.airportCodes[0]} so both travelers can meet right outside baggage claim.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2 text-xs text-stone-800">
              <div className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-700" />
                Why {destShort} Works for Your Reunion
              </div>
              <ul className="space-y-1.5 pl-1">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Direct express rail or coach link from {matchedCityMeta.airportCodes[0]} straight to the historic city center.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Walkable neighborhoods, vibrant café culture, and easy accommodation options for two travelers sharing a getaway.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Side by side comparison cards personalized for t1Short & t2Short */}
      <div>
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900">
              Compare Top Synchronized Hubs for {t1Short} &amp; {t2Short}
            </h3>
            <p className="text-xs text-stone-500">
              See how our highest-frequency direct hubs compare for travelers flying from {t1Full} and {t2Full}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Milan Card */}
          <div className={`rounded-2xl border p-6 transition-all ${
            currentDestination === 'milano' && !isCustomCity
              ? 'bg-white border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
              : 'bg-white border-stone-200 hover:border-stone-300'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  {currentDestination === 'milano' && !isCustomCity ? '★ Your Selected Hub' : 'Hub Option A'}
                </span>
                <h3 className="text-2xl font-bold font-serif text-stone-900 mt-0.5">{milan.name}</h3>
                <p className="text-xs text-stone-500 mt-1">{milan.tagline}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xl">
                🇮🇹
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                  <Sun className="w-3.5 h-3.5 text-amber-600" />
                  Typical Weather
                </div>
                <div className="text-sm font-bold text-stone-900 mt-1">{milan.weatherOctober.avgTemp}</div>
                <div className="text-[11px] text-stone-500">{milan.weatherOctober.sunshineHours}h sun / day • Crisp</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                  <Plane className="w-3.5 h-3.5 text-sky-600" />
                  Airports
                </div>
                <div className="text-sm font-bold text-stone-900 mt-1">BGY, MXP, LIN</div>
                <div className="text-[11px] text-stone-500">Ryanair + easyJet</div>
              </div>
            </div>

            {/* Flight availability summary personalized */}
            <div className="mt-5 p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-stone-800 space-y-1.5">
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-amber-700" /> Route Fit for {t1Short} &amp; {t2Short}:
              </div>
              <p><strong>From {t2Full}:</strong> {milan.directFlightAvailability.fromZagreb}</p>
              <p><strong>From {t1Full}:</strong> {milan.directFlightAvailability.fromToulouse}</p>
              <p className="text-amber-900 font-medium pt-1 border-t border-amber-200/50">
                💡 {milan.directFlightAvailability.verdict}
              </p>
            </div>

            {/* Highlights */}
            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> Top Experiences Together in Milan:
              </h4>
              <ul className="text-xs text-stone-700 space-y-1.5 pl-1">
                {milan.highlightsForMomTrip.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pros & Cons */}
            <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-1 gap-2">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Pros:</span>
                {milan.pros.map((pro, i) => (
                  <div key={i} className="text-xs text-stone-700 flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 mt-2">
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Cons:</span>
                {milan.cons.map((con, i) => (
                  <div key={i} className="text-xs text-stone-600 flex items-start gap-1.5">
                    <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100">
              <button
                id="choose-milano-decision-btn"
                onClick={() => onSelectDestination('milano', 'Milan (Milano)')}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  currentDestination === 'milano' && !isCustomCity
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                }`}
              >
                <span>Select Milan for {t1Short} &amp; {t2Short}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Rome Card */}
          <div className={`rounded-2xl border p-6 transition-all ${
            currentDestination === 'roma' && !isCustomCity
              ? 'bg-white border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
              : 'bg-white border-stone-200 hover:border-stone-300'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  {currentDestination === 'roma' && !isCustomCity ? '★ Your Selected Hub' : 'Hub Option B'}
                </span>
                <h3 className="text-2xl font-bold font-serif text-stone-900 mt-0.5">{rome.name}</h3>
                <p className="text-xs text-stone-500 mt-1">{rome.tagline}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xl">
                🏛️
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                  <Sun className="w-3.5 h-3.5 text-amber-600" />
                  Typical Weather
                </div>
                <div className="text-sm font-bold text-stone-900 mt-1">{rome.weatherOctober.avgTemp}</div>
                <div className="text-[11px] text-stone-500">{rome.weatherOctober.sunshineHours}h sun / day • Mild &amp; Warm</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                  <Plane className="w-3.5 h-3.5 text-sky-600" />
                  Airports
                </div>
                <div className="text-sm font-bold text-stone-900 mt-1">FCO (Fiumicino)</div>
                <div className="text-[11px] text-stone-500">Same airport for both!</div>
              </div>
            </div>

            {/* Flight availability summary personalized */}
            <div className="mt-5 p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/60 text-xs text-stone-800 space-y-1.5">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-emerald-700" /> Route Fit for {t1Short} &amp; {t2Short}:
              </div>
              <p><strong>From {t2Full}:</strong> {rome.directFlightAvailability.fromZagreb}</p>
              <p><strong>From {t1Full}:</strong> {rome.directFlightAvailability.fromToulouse}</p>
              <p className="text-emerald-900 font-medium pt-1 border-t border-emerald-200/50">
                🌟 {rome.directFlightAvailability.verdict}
              </p>
            </div>

            {/* Highlights */}
            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> Top Experiences Together in Rome:
              </h4>
              <ul className="text-xs text-stone-700 space-y-1.5 pl-1">
                {rome.highlightsForMomTrip.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pros & Cons */}
            <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-1 gap-2">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Pros:</span>
                {rome.pros.map((pro, i) => (
                  <div key={i} className="text-xs text-stone-700 flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 mt-2">
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Cons:</span>
                {rome.cons.map((con, i) => (
                  <div key={i} className="text-xs text-stone-600 flex items-start gap-1.5">
                    <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100">
              <button
                id="choose-roma-decision-btn"
                onClick={() => onSelectDestination('roma', 'Rome (Roma)')}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  currentDestination === 'roma' && !isCustomCity
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                }`}
              >
                <span>Select Rome for {t1Short} &amp; {t2Short}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Final Verdict Banner Personalized */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-amber-600 text-white rounded-xl font-bold shrink-0 mt-1">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-950 font-serif">
              Personalized Rendezvous Recommendation for {t1Short} &amp; {t2Short}
            </h4>
            <p className="text-xs text-stone-700 mt-1 leading-relaxed">
              For travelers flying from <strong>{t1Full}</strong> and <strong>{t2Full}</strong> to{' '}
              <strong>{rawDestName}</strong>, we recommend booking flights that land within a 45–75 minute window so you can meet right at arrivals and share a single transfer into the city center.
            </p>
          </div>
        </div>

        <button
          id="ask-concierge-comparison-btn"
          onClick={() =>
            onOpenConciergeWithContext(
              `Give us a personalized 4-day travel guide for ${rawDestName} for two travelers flying from ${t1Full} and ${t2Full}. What are the best areas to stay, airport transit tips, and must-see spots?`
            )
          }
          className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold bg-[#2F241C] hover:bg-[#3D2E24] text-amber-200 border border-[#523E30] transition-colors cursor-pointer shadow-xs"
        >
          Ask AI for {destShort} Itinerary
        </button>
      </div>
    </div>
  );
};
