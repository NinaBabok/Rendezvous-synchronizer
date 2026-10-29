import React from 'react';
import { 
  Calendar, 
  PlaneLanding, 
  PlaneTakeoff, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Users, 
  Edit3, 
  Sparkles,
  CalendarCheck,
  ChevronRight
} from 'lucide-react';
import { DestinationCity, SynchronizedMatch } from '../types';
import { formatMinutesDiff } from '../utils';
import { getProposedBestDatesForDestination } from '../data/flightScheduleDatabase';

interface TripSummaryProps {
  destinationCity: DestinationCity;
  destinationName?: string;
  traveler1Origin?: string;
  traveler2Origin?: string;
  selectedOutboundDate: string;
  selectedReturnDate: string;
  onGoToReturnTab?: () => void;
  onGoToOutboundTab?: () => void;
  onGoToHomeTab: () => void;
  outboundMatch?: SynchronizedMatch | null;
  returnMatch?: SynchronizedMatch | null;
  onSelectQuickReturnDate?: (date: string) => void;
  activeDirection?: 'outbound' | 'return';
}

function parseYMD(dateStr: string): { weekday: string; monthDay: string; year: string; full: string } | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return null;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  if (isNaN(d.getTime())) return null;
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
    monthDay: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    year: String(parts[0]),
    full: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
  };
}

function calculateNights(outboundStr: string, returnStr: string): number | null {
  if (!outboundStr || !returnStr) return null;
  const [y1, m1, d1] = outboundStr.split('-').map(Number);
  const [y2, m2, d2] = returnStr.split('-').map(Number);
  if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return null;
  const date1 = new Date(y1, m1 - 1, d1);
  const date2 = new Date(y2, m2 - 1, d2);
  const diffTime = date2.getTime() - date1.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : null;
}

export const TripSummary: React.FC<TripSummaryProps> = ({
  destinationCity,
  destinationName,
  traveler1Origin = 'Toulouse (TLS)',
  traveler2Origin = 'Zagreb (ZAG)',
  selectedOutboundDate,
  selectedReturnDate,
  onGoToReturnTab,
  onGoToOutboundTab,
  onGoToHomeTab,
  outboundMatch,
  returnMatch,
  onSelectQuickReturnDate,
  activeDirection = 'outbound',
}) => {
  const destLabel = destinationName || (destinationCity === 'milano' ? 'Milan (MXP/BGY)' : 'Rome (FCO)');
  const t1 = traveler1Origin || 'Toulouse (TLS)';
  const t2 = traveler2Origin || 'Zagreb (ZAG)';

  const parsedOutbound = parseYMD(selectedOutboundDate);
  const parsedReturn = parseYMD(selectedReturnDate);
  const nights = calculateNights(selectedOutboundDate, selectedReturnDate);

  // Suggested default return date (+3 days if outbound exists, e.g. long weekend)
  const suggestedReturnDate = React.useMemo(() => {
    if (!selectedOutboundDate) {
      const p = getProposedBestDatesForDestination(destinationCity);
      return p.returnDate;
    }
    const [y, m, d] = selectedOutboundDate.split('-').map(Number);
    if (!y || !m || !d) {
      const p = getProposedBestDatesForDestination(destinationCity);
      return p.returnDate;
    }
    const outDate = new Date(y, m - 1, d);
    outDate.setDate(outDate.getDate() + 3);
    const sYear = outDate.getFullYear();
    const sMonth = String(outDate.getMonth() + 1).padStart(2, '0');
    const sDay = String(outDate.getDate()).padStart(2, '0');
    return `${sYear}-${sMonth}-${sDay}`;
  }, [selectedOutboundDate, destinationCity]);

  const parsedSuggestedReturn = parseYMD(suggestedReturnDate);

  return (
    <div id="trip-summary-section" className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden transition-all">
      {/* Top Banner: Rendezvous Route & Destination Summary */}
      <div className="bg-gradient-to-r from-stone-900 via-[#2A231C] to-stone-900 text-stone-100 px-5 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold shrink-0">
            <CalendarCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Trip Summary
              </span>
              <span className="text-xs text-stone-400 hidden sm:inline">• Rendezvous Verification</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold font-serif text-white tracking-tight flex items-center gap-2 mt-0.5">
              <span>Meeting in</span>
              <span className="text-amber-400 font-extrabold">{destLabel}</span>
            </h2>
          </div>
        </div>

        {/* Origin Travelers & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 text-stone-200">
            <span className="text-stone-400">Departing from:</span>
            <span className="font-semibold text-white">{t1}</span>
            <span className="text-amber-400">&amp;</span>
            <span className="font-semibold text-white">{t2}</span>
          </div>

          <button
            id="trip-summary-edit-route-btn"
            onClick={onGoToHomeTab}
            className="px-2.5 py-1.5 rounded-lg text-stone-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Edit departure cities and meeting destination"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Edit Route</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Date Verification Strip */}
      <div className="p-4 sm:p-6 bg-stone-50/60">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Selected Travel Dates (Side-by-Side Verification)</span>
          </div>

          {nights !== null && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{nights} {nights === 1 ? 'Night' : 'Nights'} Stay ({nights + 1} Days)</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          {/* ================= LEFT COLUMN: OUTBOUND DATE ================= */}
          <div className="bg-white rounded-xl border-2 border-emerald-500/80 p-4 sm:p-5 shadow-xs relative transition-all hover:border-emerald-600">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <PlaneLanding className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Step 1 • Outbound Arrival
                  </span>
                  <div className="text-xs text-stone-500">Landing in {destLabel}</div>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Selected Outbound
              </span>
            </div>

            {/* Date Display */}
            <div className="mt-4 pt-3 border-t border-stone-100">
              {parsedOutbound ? (
                <div>
                  <div className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                    {parsedOutbound.weekday}
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif tracking-tight mt-0.5">
                    {parsedOutbound.monthDay}
                    <span className="text-base sm:text-lg font-sans font-normal text-stone-400 ml-2">
                      {parsedOutbound.year}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-stone-500 text-sm italic">No outbound date selected</div>
              )}

              {/* Synchronized Match Timing Details */}
              {outboundMatch && (
                <div className="mt-3.5 p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-semibold text-emerald-950">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      Arrival Landing Window:
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900 font-bold">
                      {formatMinutesDiff(outboundMatch.arrivalDifferenceMinutes)} gap
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-emerald-900">
                    <div>
                      <span className="text-stone-500 block">Traveler 1 ({t1.split(' ')[0]}):</span>
                      <strong className="font-semibold text-stone-800">Lands at {outboundMatch.toulouseFlight.arrivalTime}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Traveler 2 ({t2.split(' ')[0]}):</span>
                      <strong className="font-semibold text-stone-800">Lands at {outboundMatch.zagrebFlight.arrivalTime}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                {activeDirection === 'outbound' ? (
                  <>
                    <span>Select a different day in the matrix below ↓</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Step 1 (Active)
                    </span>
                  </>
                ) : (
                  <>
                    <button
                      id="trip-summary-back-to-outbound-btn"
                      onClick={onGoToOutboundTab}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>← Switch to Step 1 (Outbound)</span>
                    </button>
                    <span className="text-[11px] text-stone-400">Step 1 tab</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: RETURN DATE ================= */}
          <div className={`bg-white rounded-xl border-2 p-4 sm:p-5 shadow-xs relative transition-all ${
            parsedReturn 
              ? 'border-amber-500/80 hover:border-amber-600' 
              : 'border-dashed border-amber-300/80 bg-amber-50/20'
          }`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                  <PlaneTakeoff className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    Step 2 • Return Departure
                  </span>
                  <div className="text-xs text-stone-500">Departing {destLabel} back home</div>
                </div>
              </div>

              {parsedReturn ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-amber-600" />
                  Selected Return
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200 text-[11px] font-medium">
                  Pending Verification
                </span>
              )}
            </div>

            {/* Date Display */}
            <div className="mt-4 pt-3 border-t border-stone-100">
              {parsedReturn ? (
                <div>
                  <div className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                    {parsedReturn.weekday}
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif tracking-tight mt-0.5">
                    {parsedReturn.monthDay}
                    <span className="text-base sm:text-lg font-sans font-normal text-stone-400 ml-2">
                      {parsedReturn.year}
                    </span>
                  </div>

                  {/* Return Match Timing Details */}
                  {returnMatch && (
                    <div className="mt-3.5 p-3 rounded-lg bg-amber-50/70 border border-amber-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-amber-950">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Departure Window:
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 font-bold">
                          {formatMinutesDiff(returnMatch.arrivalDifferenceMinutes)} gap
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-amber-900">
                        <div>
                          <span className="text-stone-500 block">To {t1.split(' ')[0]}:</span>
                          <strong className="font-semibold text-stone-800">Departs {returnMatch.toulouseFlight.departureTime}</strong>
                        </div>
                        <div>
                          <span className="text-stone-500 block">To {t2.split(' ')[0]}:</span>
                          <strong className="font-semibold text-stone-800">Departs {returnMatch.zagrebFlight.departureTime}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-stone-100">
                    {activeDirection === 'return' ? (
                      <>
                        <span className="text-xs text-stone-500">Select return day in matrix below ↓</span>
                        <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                          Step 2 (Active)
                        </span>
                      </>
                    ) : (
                      <>
                        <button
                          id="trip-summary-go-to-return-btn"
                          onClick={onGoToReturnTab}
                          className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Review return flights on Step 2</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] text-stone-400">Step 2 tab</span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-medium text-amber-800 uppercase tracking-wide">
                    Suggested Weekend Return
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-stone-700 font-serif tracking-tight mt-0.5">
                    {parsedSuggestedReturn ? parsedSuggestedReturn.full : 'Sunday, Oct 18, 2026'}
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Complete your trip verification by selecting synchronized return flights back home.
                  </p>

                  <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-1">
                    {onSelectQuickReturnDate && (
                      <button
                        id="trip-summary-quick-set-return-btn"
                        onClick={() => onSelectQuickReturnDate(suggestedReturnDate)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm {parsedSuggestedReturn?.monthDay || 'Oct 18'}</span>
                      </button>
                    )}

                    <button
                      id="trip-summary-browse-returns-btn"
                      onClick={onGoToReturnTab}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Browse Step 2 Returns</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
