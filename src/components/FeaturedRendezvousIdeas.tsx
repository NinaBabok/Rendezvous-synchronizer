import React from 'react';
import { ArrowRight, ChevronRight, MapPin, PlaneLanding, PlaneTakeoff, Sparkles } from 'lucide-react';
import type { ProposedTripDate } from '../data/flightScheduleDatabase';
import type { DestinationCity } from '../types';

interface FeaturedRendezvousIdeasProps {
  traveler1Origin: string;
  traveler2Origin: string;
  proposedMilan: ProposedTripDate;
  proposedRome: ProposedTripDate;
  onSelectTrip: (destination: DestinationCity, outboundDate: string, returnDate: string) => void;
  onCompareDestinations: () => void;
}

interface RendezvousIdea {
  destination: DestinationCity;
  dates: ProposedTripDate;
  label: string;
  title: string;
  arrivalAirport: string;
  arrivalBadge: string;
  traveler2Arrival: string;
  traveler1Arrival: string;
  arrivalMeetingTip: string;
  returnBadge: string;
  traveler2ReturnAirport: string;
  traveler2Return: string;
  traveler1ReturnAirport: string;
  traveler1Return: string;
  returnMeetingTip: string;
  totalPrice: string;
}

function shortOrigin(origin: string): string {
  return origin.trim().split(/\s+/)[0] ?? origin;
}

export const FeaturedRendezvousIdeas: React.FC<FeaturedRendezvousIdeasProps> = ({
  traveler1Origin,
  traveler2Origin,
  proposedMilan,
  proposedRome,
  onSelectTrip,
  onCompareDestinations,
}) => {
  const origin1 = shortOrigin(traveler1Origin);
  const origin2 = shortOrigin(traveler2Origin);
  const ideas: RendezvousIdea[] = [
    {
      destination: 'milano',
      dates: proposedMilan,
      label: 'MILAN (MILANO) • 4-DAY LONG WEEKEND',
      title: 'The Milan & Lake Como Rendezvous',
      arrivalAirport: 'BGY',
      arrivalBadge: '1 hr 15 min Arrival Gap',
      traveler2Arrival: 'Ryanair lands at 12:45',
      traveler1Arrival: 'Ryanair lands at 14:00',
      arrivalMeetingTip: 'Meet directly at Bergamo Airport arrivals cafe and take the direct express coach to Milano Centrale together!',
      returnBadge: 'Evening Departures',
      traveler2ReturnAirport: 'BGY',
      traveler2Return: 'Ryanair departs 17:50 ➔ arrives 19:05',
      traveler1ReturnAirport: 'MXP',
      traveler1Return: 'easyJet departs 18:50 ➔ arrives 20:20',
      returnMeetingTip: 'Enjoy Sunday morning together, then head to your respective airport coaches at 15:00 from Milano Centrale!',
      totalPrice: '~€198 combined',
    },
    {
      destination: 'roma',
      dates: proposedRome,
      label: 'ROME (ROMA) • 4-DAY LONG WEEKEND',
      title: 'The Roman Holiday Rendezvous',
      arrivalAirport: 'FCO',
      arrivalBadge: 'Same Airport (FCO)',
      traveler2Arrival: 'Ryanair lands at 14:15',
      traveler1Arrival: 'Ryanair lands at 15:20',
      arrivalMeetingTip: 'Meet directly at Rome Fiumicino Terminal 3 and ride the Leonardo Express train together to Roma Termini!',
      returnBadge: 'Depart from Same FCO',
      traveler2ReturnAirport: 'FCO',
      traveler2Return: 'Ryanair departs 15:45 ➔ arrives 17:00',
      traveler1ReturnAirport: 'FCO',
      traveler1Return: 'Ryanair departs 16:30 ➔ arrives 18:25',
      returnMeetingTip: 'Travel to FCO together on Sunday afternoon, check in together, and say goodbye at security!',
      totalPrice: '~€215 combined',
    },
  ];

  return (
    <section aria-labelledby="featured-rendezvous-heading" className="space-y-4 mt-8 pt-8 border-t border-stone-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 id="featured-rendezvous-heading" className="text-xl sm:text-2xl font-bold font-serif text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            Popular Meetup Ideas for {origin1} &amp; {origin2}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Pre-calculated flight combinations with tightest arrival coordination and seamless returns.
          </p>
        </div>

        <button
          id="home-compare-cities-link"
          onClick={onCompareDestinations}
          className="text-xs font-bold text-stone-700 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
        >
          Compare Destination Details <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ideas.map((idea) => {
          const isMilan = idea.destination === 'milano';
          const destinationLabel = isMilan ? 'milan' : 'rome';

          return (
            <article
              key={idea.destination}
              className={isMilan
                ? 'bg-white rounded-2xl border-2 border-amber-300/80 p-5 sm:p-6 shadow-xs relative overflow-hidden flex flex-col justify-between'
                : 'bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all'}
            >
              {isMilan && (
                <div className="absolute top-0 right-0 bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                  ⭐ Top Direct Match
                </div>
              )}

              <div>
                <div className={`flex items-center gap-2 text-xs font-bold mb-1 ${isMilan ? 'text-amber-800' : 'text-rose-800'}`}>
                  <MapPin className={`w-3.5 h-3.5 ${isMilan ? 'text-amber-600' : 'text-rose-600'}`} />
                  {idea.label}
                </div>
                <h3 className="text-lg font-bold font-serif text-stone-900">{idea.title}</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  📅 <strong>{idea.dates.outboundFormatted} ➔ {idea.dates.returnFormatted}</strong>
                </p>

                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                    <div className="font-bold text-emerald-950 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <PlaneLanding className="w-3.5 h-3.5 text-emerald-600" />
                        Outbound ({idea.dates.outboundFormatted.split(',')[0] ?? idea.dates.outboundFormatted}):
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        {idea.arrivalBadge}
                      </span>
                    </div>
                    <div className="mt-1 text-stone-600 text-[11px] leading-relaxed">
                      • <strong>{origin2} ➔ {idea.arrivalAirport}:</strong> {idea.traveler2Arrival}<br />
                      • <strong>{origin1} ➔ {idea.arrivalAirport}:</strong> {idea.traveler1Arrival}<br />
                      <span className="text-emerald-800 font-semibold">📍 {idea.arrivalMeetingTip}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                    <div className="font-bold text-amber-950 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <PlaneTakeoff className="w-3.5 h-3.5 text-amber-600" />
                        Return ({idea.dates.returnFormatted.split(',')[0] ?? idea.dates.returnFormatted}):
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                        {idea.returnBadge}
                      </span>
                    </div>
                    <div className="mt-1 text-stone-600 text-[11px] leading-relaxed">
                      • <strong>{idea.traveler2ReturnAirport} ➔ {origin2}:</strong> {idea.traveler2Return}<br />
                      • <strong>{idea.traveler1ReturnAirport} ➔ {origin1}:</strong> {idea.traveler1Return}<br />
                      <span className="text-amber-800 font-semibold">📍 {idea.returnMeetingTip}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-400">Total Roundtrip for Both:</span>
                  <div className="text-base font-extrabold text-stone-900">{idea.totalPrice}</div>
                </div>

                <button
                  id={isMilan ? 'select-milan-package-btn' : 'select-rome-package-btn'}
                  onClick={() => onSelectTrip(idea.destination, idea.dates.outboundDate, idea.dates.returnDate)}
                  className="px-4 py-2 rounded-xl bg-[#2F241C] hover:bg-[#3D2E24] text-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs border border-[#523E30]"
                >
                  <span>Select &amp; View Flights</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
              <span className="sr-only">Featured rendezvous in {destinationLabel}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
};