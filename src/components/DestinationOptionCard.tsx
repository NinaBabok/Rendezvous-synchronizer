import React from 'react';
import { ArrowRight, Check, Heart, Plane, Sun, X } from 'lucide-react';
import type { CityComparisonData, DestinationCity } from '../types';

interface DestinationOptionCardProps {
  city: CityComparisonData;
  isSelected: boolean;
  optionLabel: string;
  airportLabel: string;
  airportNote: string;
  weatherNote: string;
  verdictIcon: string;
  traveler1Short: string;
  traveler2Short: string;
  traveler1Full: string;
  traveler2Full: string;
  onSelect: (city: DestinationCity, name: string) => void;
}

export const DestinationOptionCard: React.FC<DestinationOptionCardProps> = ({
  city,
  isSelected,
  optionLabel,
  airportLabel,
  airportNote,
  weatherNote,
  verdictIcon,
  traveler1Short,
  traveler2Short,
  traveler1Full,
  traveler2Full,
  onSelect,
}) => {
  const isMilan = city.city === 'milano';
  const accent = isMilan ? 'amber' : 'emerald';
  const selectedClass = isSelected
    ? 'bg-white border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
    : 'bg-white border-stone-200 hover:border-stone-300';
  const routeClass = isMilan
    ? 'bg-amber-50/60 border-amber-200/60 text-amber-950'
    : 'bg-emerald-50/60 border-emerald-200/60 text-emerald-950';
  const verdictClass = isMilan
    ? 'text-amber-900 border-amber-200/50'
    : 'text-emerald-900 border-emerald-200/50';

  return (
    <article className={`rounded-2xl border p-6 transition-all ${selectedClass}`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            {isSelected ? '★ Your Selected Hub' : optionLabel}
          </span>
          <h3 className="text-2xl font-bold font-serif text-stone-900 mt-0.5">{city.name}</h3>
          <p className="text-xs text-stone-500 mt-1">{city.tagline}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xl">
          {isMilan ? '🇮🇹' : '🏛️'}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            Typical Weather
          </div>
          <div className="text-sm font-bold text-stone-900 mt-1">{city.weatherOctober.avgTemp}</div>
          <div className="text-[11px] text-stone-500">
            {city.weatherOctober.sunshineHours}h sun / day • {weatherNote}
          </div>
        </div>

        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <Plane className="w-3.5 h-3.5 text-sky-600" />
            Airports
          </div>
          <div className="text-sm font-bold text-stone-900 mt-1">{airportLabel}</div>
          <div className="text-[11px] text-stone-500">{airportNote}</div>
        </div>
      </div>

      <div className={`mt-5 p-3.5 rounded-xl border text-xs text-stone-800 space-y-1.5 ${routeClass}`}>
        <div className="font-bold flex items-center gap-1.5">
          <Plane className={`w-3.5 h-3.5 ${isMilan ? 'text-amber-700' : 'text-emerald-700'}`} />
          Route Fit for {traveler1Short} &amp; {traveler2Short}:
        </div>
        <p><strong>From {traveler2Full}:</strong> {city.directFlightAvailability.fromZagreb}</p>
        <p><strong>From {traveler1Full}:</strong> {city.directFlightAvailability.fromToulouse}</p>
        <p className={`font-medium pt-1 border-t ${verdictClass}`}>
          {verdictIcon} {city.directFlightAvailability.verdict}
        </p>
      </div>

      <div className="mt-5 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500" /> Top Experiences Together in {isMilan ? 'Milan' : 'Rome'}:
        </h4>
        <ul className="text-xs text-stone-700 space-y-1.5 pl-1">
          {city.highlightsForMomTrip.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-1 gap-2">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Pros:</span>
          {city.pros.map((pro) => (
            <div key={pro} className="text-xs text-stone-700 flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{pro}</span>
            </div>
          ))}
        </div>

        <div className="space-y-1 mt-2">
          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Cons:</span>
          {city.cons.map((con) => (
            <div key={con} className="text-xs text-stone-600 flex items-start gap-1.5">
              <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>{con}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-stone-100">
        <button
          id={`choose-${city.city}-decision-btn`}
          onClick={() => onSelect(city.city, city.name)}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
            isSelected ? 'bg-amber-500 text-stone-950 shadow-xs' : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
          }`}
        >
          <span>Select {isMilan ? 'Milan' : 'Rome'} for {traveler1Short} &amp; {traveler2Short}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
