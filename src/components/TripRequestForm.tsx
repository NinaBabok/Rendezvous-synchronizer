import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Compass,
  MapPin,
  PlaneTakeoff,
  Sparkles,
  Users,
} from 'lucide-react';
import type { FormEvent } from 'react';
import type { ProposedTripDate } from '../data/flightScheduleDatabase';
import type { CityItem } from '../data/cities';
import { CityAutocomplete } from './CityAutocomplete';

interface TripRequestFormState {
  origin1: string;
  origin2: string;
  destinationText: string;
  outboundDate: string;
  returnDate: string;
  today: string;
  proposedDate: ProposedTripDate | null;
  validationError: string | null;
  naturalQuery: string;
  isParsing: boolean;
}

interface TripRequestFormActions {
  onOrigin1Change: (value: string) => void;
  onOrigin2Change: (value: string) => void;
  onDestinationChange: (value: string, city?: CityItem) => void;
  onOutboundDateChange: (value: string) => void;
  onReturnDateChange: (value: string) => void;
  onClearDates: () => void;
  onApplyProposedDates: () => void;
  onLaunchSynchronizer: () => void;
  onNaturalQueryChange: (value: string) => void;
  onSubmitNaturalQuery: (event: FormEvent<HTMLFormElement>) => void;
}

interface TripRequestFormProps {
  state: TripRequestFormState;
  actions: TripRequestFormActions;
}

export const TripRequestForm: React.FC<TripRequestFormProps> = ({ state, actions }) => (
  <div className="pt-4 max-w-3xl mx-auto text-left">
    <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-[#E2D2C2] p-5 sm:p-7 shadow-xl shadow-stone-900/5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CityAutocomplete
          id="input-origin-1"
          label="Traveler 1 (Your Departure City)"
          icon={<PlaneTakeoff className="w-3.5 h-3.5 text-orange-600" />}
          value={state.origin1}
          placeholder="e.g. Paris"
          datalistId="origin1-datalist"
          onChange={actions.onOrigin1Change}
        />
        <CityAutocomplete
          id="input-origin-2"
          label="Traveler 2 (Companion's Departure City)"
          icon={<Users className="w-3.5 h-3.5 text-orange-600" />}
          value={state.origin2}
          placeholder="e.g. Zagreb"
          datalistId="origin2-datalist"
          onChange={actions.onOrigin2Change}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#E8DACB]">
        <CityAutocomplete
          id="input-meeting-destination"
          label="Meeting Destination City"
          icon={<MapPin className="w-3.5 h-3.5 text-orange-600" />}
          value={state.destinationText}
          placeholder="e.g. Milan"
          datalistId="destinations-datalist"
          onChange={actions.onDestinationChange}
        />

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-orange-600" />
            Trip Dates (Any Month &amp; Year)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-[11px] font-semibold text-stone-600">
              Departure:
              <input
                id="input-departure-date"
                type="date"
                value={state.outboundDate}
                min={state.today}
                onChange={(event) => actions.onOutboundDateChange(event.target.value)}
                className="mt-1 w-full bg-[#FAF7F2] hover:bg-white focus:bg-white text-stone-900 border border-stone-300 rounded-xl px-2.5 py-2 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-500"
              />
            </label>
            <label className="text-[11px] font-semibold text-stone-600">
              Return:
              <input
                id="input-return-date"
                type="date"
                value={state.returnDate}
                min={state.outboundDate || state.today}
                onChange={(event) => actions.onReturnDateChange(event.target.value)}
                className="mt-1 w-full bg-[#FAF7F2] hover:bg-white focus:bg-white text-stone-900 border border-stone-300 rounded-xl px-2.5 py-2 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-500"
              />
            </label>
          </div>

          {state.proposedDate && (
            <div className="mt-2.5 p-3 rounded-xl bg-amber-50/90 border border-amber-200/90 text-stone-800 text-xs space-y-2 animate-in fade-in duration-200">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-stone-900">
                      Proposed closest date for {state.proposedDate.cityName}:
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Δ {state.proposedDate.gapFormatted} arrival gap
                    </span>
                  </div>
                  <p className="text-stone-600 text-[11px] mt-0.5 leading-relaxed">
                    📅 <strong>{state.proposedDate.outboundFormatted} ➔ {state.proposedDate.returnFormatted}</strong>
                  </p>
                  <p className="text-stone-500 text-[11px]">{state.proposedDate.highlight}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-amber-200/60">
                {state.outboundDate === state.proposedDate.outboundDate &&
                state.returnDate === state.proposedDate.returnDate ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Proposed dates applied
                    </span>
                    <button
                      type="button"
                      onClick={actions.onClearDates}
                      className="text-[11px] text-stone-500 hover:text-stone-800 underline cursor-pointer"
                    >
                      Clear (choose alone)
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      id="apply-proposed-dates-btn"
                      type="button"
                      onClick={actions.onApplyProposedDates}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Apply proposed date ({state.proposedDate.outboundDate} ➔ {state.proposedDate.returnDate})
                    </button>
                    <span className="text-[11px] text-stone-500">or choose your own dates above</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {state.validationError && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{state.validationError}</span>
        </div>
      )}

      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8DACB]">
        <div className="text-xs text-stone-600 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Synchronizes arrival times within ~60–75 min &amp; matching return flights.</span>
        </div>
        <button
          id="home-find-flights-main-btn"
          type="button"
          onClick={actions.onLaunchSynchronizer}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-orange-500/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>Find Synchronized Flights</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 pt-3 border-t border-[#E8DACB]">
        <p className="text-xs text-stone-600 font-medium mb-1.5 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-orange-600" />
          Or describe your trip in plain conversational language:
        </p>
        <form onSubmit={actions.onSubmitNaturalQuery} className="relative">
          <div className="flex gap-2">
            <input
              type="text"
              value={state.naturalQuery}
              onChange={(event) => actions.onNaturalQueryChange(event.target.value)}
              placeholder="e.g. Find matching direct flights for our rendezvous weekend..."
              className="flex-1 bg-white text-stone-900 placeholder-stone-400 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-stone-300/80 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-400/20"
            />
            <button
              type="submit"
              disabled={state.isParsing || !state.naturalQuery.trim()}
              className="px-4 py-2 rounded-xl bg-[#3D2E24] hover:bg-[#4D3A2E] disabled:opacity-50 text-amber-200 text-xs font-semibold cursor-pointer border border-[#594537] flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              {state.isParsing ? 'Searching...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
