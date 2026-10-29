import React from 'react';
import { 
  Train, 
  Clock, 
  Euro, 
  MapPin, 
  Coffee, 
  ShieldCheck, 
  Users,
  Sparkles
} from 'lucide-react';
import { DestinationCity, SynchronizedMatch } from '../types';
import { CITY_COMPARISON } from '../data/flightScheduleDatabase';
import { POPULAR_CITIES } from '../data/cities';

interface AirportTransitGuideProps {
  destinationCity: DestinationCity;
  destinationName?: string;
  traveler1Origin?: string;
  traveler2Origin?: string;
  currentOutboundMatch?: SynchronizedMatch;
  onSelectDestination: (city: DestinationCity, customName?: string) => void;
}

export const AirportTransitGuide: React.FC<AirportTransitGuideProps> = ({
  destinationCity,
  destinationName,
  traveler1Origin,
  traveler2Origin,
  currentOutboundMatch,
  onSelectDestination,
}) => {
  const cityData = CITY_COMPARISON[destinationCity];

  const t1Full = traveler1Origin?.trim() || 'Traveler 1 City';
  const t2Full = traveler2Origin?.trim() || 'Traveler 2 City';
  const t1Short = t1Full.split(' (')[0];
  const t2Short = t2Full.split(' (')[0];

  const rawDestName = destinationName?.trim() || cityData.name;
  const destShort = rawDestName.split(' (')[0];

  // Look up custom city in POPULAR_CITIES
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

  // Build airport cards dynamically if custom city, or use detailed cityData.airports for Milan/Rome
  const airportsToDisplay = isCustomCity && matchedCityMeta
    ? matchedCityMeta.airportCodes.map((code, idx) => ({
        code,
        name: matchedCityMeta.airportNames?.[idx] || `${destShort} International Airport (${code})`,
        distanceToCenterKm: idx === 0 ? 18 : 35,
        transitToCenterMinutes: idx === 0 ? 30 : 45,
        transitCostEur: idx === 0 ? 10 : 14,
        transitType: idx === 0 ? `Express Train / Airport Coach to ${destShort} Center` : `Direct Airport Shuttle to ${destShort} Central Station`,
        terminal: 'Main International Arrivals Terminal',
      }))
    : cityData.airports;

  return (
    <div className="space-y-8 mb-10 animate-fadeIn">
      {/* City Airport Header Personalized */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Personalized Transit &amp; Meeting Points
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-900 inline-flex items-center gap-1">
                <Users className="w-3 h-3 text-orange-700" />
                {t1Short} + {t2Short} ➔ {destShort}
              </span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-stone-900 mt-1.5">
              Airport &amp; Rendezvous Guide for {rawDestName}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Everything <strong>Traveler 1 (from {t1Full})</strong> and <strong>Traveler 2 (from {t2Full})</strong> need to know about meeting at {destShort} arrivals and transferring into the city center together.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="switch-to-milan-airports-btn"
              onClick={() => onSelectDestination('milano', 'Milan (Milano)')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                destinationCity === 'milano' && !isCustomCity
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Milan (BGY / MXP / LIN)
            </button>
            <button
              id="switch-to-rome-airports-btn"
              onClick={() => onSelectDestination('roma', 'Rome (Roma)')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                destinationCity === 'roma' && !isCustomCity
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Rome (FCO / CIA)
            </button>
          </div>
        </div>

        {/* Airport Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {airportsToDisplay.map((airport) => (
            <div
              key={airport.code}
              className="bg-stone-50 rounded-xl p-5 border border-stone-200/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-black text-stone-900 font-mono">
                    {airport.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                    {airport.distanceToCenterKm} km to center
                  </span>
                </div>
                <h3 className="text-sm font-bold text-stone-800 leading-tight">
                  {airport.name}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  {airport.terminal ? `Terminals: ${airport.terminal}` : 'Single passenger terminal'}
                </p>

                <div className="mt-4 pt-3 border-t border-stone-200/60 space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-stone-700">
                    <Train className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                    <span><strong>Transit:</strong> {airport.transitType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span><strong>Time:</strong> ~{airport.transitToCenterMinutes} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <Euro className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span><strong>Cost:</strong> ~€{airport.transitCostEur} per person</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rendezvous Scenarios Step-by-Step Personalized */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-stone-900 font-serif mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-600" />
          Recommended Meeting Protocol for {t1Short} &amp; {t2Short} in {destShort}
        </h3>

        {isCustomCity ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/80 text-xs text-stone-800 space-y-2">
              <div className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                <Coffee className="w-4 h-4 text-emerald-700" />
                Scenario: Both Landing at {airportsToDisplay[0]?.name || destShort} ({airportsToDisplay[0]?.code})
              </div>
              <p>
                <strong>1. Arrival from {t1Full} &amp; {t2Full}:</strong>{' '}
                {currentOutboundMatch
                  ? `Traveler 1 lands at ${currentOutboundMatch.toulouseFlight.arrivalTime} and Traveler 2 lands at ${currentOutboundMatch.zagrebFlight.arrivalTime}. `
                  : ''}
                After collecting checked or cabin bags, follow signs to the main public Arrivals Concourse.
              </p>
              <p>
                <strong>2. Terminal Meeting Spot:</strong> Whoever lands first grabs a coffee at the main Arrivals Café right outside customs exit doors and connects to the free terminal Wi-Fi to message the second traveler.
              </p>
              <p>
                <strong>3. Shared Transfer to {destShort} Center:</strong> Once reunited, head together to the airport express train or coach platform (~{airportsToDisplay[0]?.transitToCenterMinutes || 30} minutes into central {destShort}).
              </p>
            </div>
          </div>
        ) : destinationCity === 'roma' ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/80 text-xs text-stone-800 space-y-2">
              <div className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                <Coffee className="w-4 h-4 text-emerald-700" />
                Scenario: {t1Short} &amp; {t2Short} Both Landing at Rome Fiumicino (FCO)
              </div>
              <p>
                <strong>1. Baggage Claim &amp; Exit:</strong> After collecting bags from the {t1Short} and {t2Short} flights, follow signs to Terminal 3 or Terminal 1 main Arrivals Hall.
              </p>
              <p>
                <strong>2. Meeting Spot:</strong> Meet at <em>"Caffè Kimbo"</em> or the central pharmacy in the public arrivals area. Free high-speed Wi-Fi (<em>"Airport Free Wi-Fi"</em>) is available everywhere without registration.
              </p>
              <p>
                <strong>3. Express Train to City:</strong> Walk together down the covered walkway (5 minutes) directly to the on-site Fiumicino Aeroporto train station. Board the <strong>Leonardo Express</strong> (departs every 15 min, non-stop to Roma Termini in 32 minutes, €14 per ticket).
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs text-stone-800 space-y-2">
              <div className="font-bold text-amber-950 text-sm flex items-center gap-2">
                <Train className="w-4 h-4 text-amber-700" />
                Scenario A: Traveler from {t2Short} Lands at Bergamo (BGY) &amp; Traveler from {t1Short} Lands at Malpensa (MXP)
              </div>
              <p>
                <strong>1. Traveler from {t2Full} at Bergamo (BGY):</strong> Right outside arrivals gate exit, buy a ticket for the <strong>Orio Shuttle</strong> or <strong>Terravision bus</strong> (€10). Buses leave every 15–20 minutes and drop off directly at <em>Milano Centrale</em> (Piazza Luigi di Savoia side) in 50 minutes.
              </p>
              <p>
                <strong>2. Traveler from {t1Full} at Malpensa (MXP):</strong> Head downstairs inside Terminal 1/2 directly to the Malpensa Express train platform. Take the train to <em>Milano Centrale</em> (51 minutes, €13).
              </p>
              <p>
                <strong>3. Rendezvous Hub:</strong> Meet inside <strong>Milano Centrale Main Concourse</strong> by the historic central clock or at the <em>Motta Milano 1928 Cafe</em> on the ground floor. Both transit lines from {t1Short} and {t2Short} flights arrive right here!
              </p>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/80 text-xs text-stone-800 space-y-2">
              <div className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                <Coffee className="w-4 h-4 text-emerald-700" />
                Scenario B: Both {t1Short} &amp; {t2Short} Flights Landing at the Same Airport (BGY or MXP)
              </div>
              <p>
                When both flights from <strong>{t1Full}</strong> and <strong>{t2Full}</strong> land at the same Milan terminal, meet at the main arrivals espresso bar directly opposite the exit doors, grab your bags, and take one shared express coach or train into central Milan together.
              </p>
            </div>
          </div>
        )}

        {/* Traveler comfort & peace-of-mind tips */}
        <div className="mt-6 pt-5 border-t border-stone-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Smooth Rendezvous Tips for {t1Short} &amp; {t2Short} Travelers:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-700">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <div className="font-bold text-stone-900 mb-1">📶 Free Airport Wi-Fi</div>
              All arrival terminals in {destShort} provide instant, free 1-click Wi-Fi so both travelers from {t1Short} and {t2Short} can WhatsApp call as soon as airplane mode is turned off.
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <div className="font-bold text-stone-900 mb-1">🧳 Luggage &amp; Waiting Lounge</div>
              Whoever lands first can grab a coffee in the public arrivals hall right outside baggage claim so the second traveler walks straight out to meet them.
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <div className="font-bold text-stone-900 mb-1">🎟️ Contactless Express Transit</div>
              You can tap your bank card or phone (Apple/Google Pay) directly at the airport express train turnstiles or shuttle kiosks for fast side-by-side boarding.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
