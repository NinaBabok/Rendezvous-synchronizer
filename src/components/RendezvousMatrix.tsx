import React from 'react';
import { Sparkles, CheckCircle2, Clock, CalendarDays, Filter, PlaneTakeoff } from 'lucide-react';
import { DestinationCity, SynchronizedMatch, FlightDirection } from '../types';
import { formatMinutesDiffCompact } from '../utils';

interface RendezvousMatrixProps {
  destinationCity: DestinationCity;
  destinationName?: string;
  direction?: FlightDirection;
  matches: SynchronizedMatch[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  filterDirectOnly: boolean;
  onToggleDirectOnly: () => void;
  filterMaxGap60: boolean;
  onToggleMaxGap60: () => void;
  filterWeekendOnly: boolean;
  onToggleWeekendOnly: () => void;
}

export const RendezvousMatrix: React.FC<RendezvousMatrixProps> = ({
  destinationCity,
  destinationName,
  direction = 'outbound',
  matches,
  selectedDate,
  onSelectDate,
  filterDirectOnly,
  onToggleDirectOnly,
  filterMaxGap60,
  onToggleMaxGap60,
  filterWeekendOnly,
  onToggleWeekendOnly,
}) => {
  const isMilan = destinationCity === 'milano';
  const isReturn = direction === 'return';

  // Format month and year from selectedDate or first match
  const dateForMonth = selectedDate || (matches[0] && matches[0].date) || (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  })();
  const [targetYear, targetMonth] = dateForMonth.split('-').map(Number);
  const monthDateObj = new Date(targetYear || new Date().getFullYear(), ((targetMonth || (new Date().getMonth() + 1))) - 1, 1);
  const monthLabel = monthDateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const monthShort = monthDateObj.toLocaleString('en-US', { month: 'short' });

  // Compute leading empty cells based on the weekday of the 1st of this month
  const targetCityMatches = matches.filter((m) => m.destinationCity === destinationCity);
  const leadingOffsetCells = React.useMemo(() => {
    if (!targetCityMatches.length) return 0;
    const firstDateObj = new Date(targetCityMatches[0].date);
    const jsDay = firstDateObj.getDay(); // 0 is Sun, 1 is Mon...
    return (jsDay + 6) % 7; // 0 for Mon, 1 for Tue, ... 6 for Sun
  }, [targetCityMatches]);

  // Group days of month into weeks
  const filteredMatches = matches.filter((m) => {
    if (m.destinationCity !== destinationCity) return false;
    if (filterDirectOnly && !m.bothDirect) return false;
    if (filterMaxGap60 && m.arrivalDifferenceMinutes > 60) return false;
    if (filterWeekendOnly) {
      const day = new Date(m.date).getDay();
      // Thu(4), Fri(5), Sat(6), Sun(0)
      if (day !== 4 && day !== 5 && day !== 6 && day !== 0) return false;
    }
    return true;
  });

  const bestMatchesCount = matches.filter(
    (m) => m.destinationCity === destinationCity && m.bothDirect && m.arrivalDifferenceMinutes <= 60
  ).length;

  const currentDestDisplayName = destinationName || (isMilan ? 'Milan' : 'Rome');

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs mb-6">
      {/* Top insight alert */}
      <div
        className={`p-4 rounded-xl mb-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isMilan
            ? 'bg-amber-50/70 border-amber-200/80 text-amber-950'
            : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-sm ${
              isMilan ? 'bg-amber-600' : 'bg-emerald-600'
            }`}
          >
            {isReturn ? <PlaneTakeoff className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="font-bold text-sm">
              {isReturn
                ? `${currentDestDisplayName} Return Synchronization: Coordinated Departures ➔ Home`
                : `${currentDestDisplayName} Arrival Synchronization: Coordinated Landing`}
            </h3>
            <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
              {isReturn
                ? isMilan
                  ? 'On Thursdays & Saturdays, direct return flights from Milan to Zagreb (ZAG) and Toulouse (TLS) depart within short intervals. Sunday return flights offer ideal evening departure slots.'
                  : 'Direct return flights departing from Rome Fiumicino (FCO) to both Toulouse and Zagreb allow departing together directly from Rome.'
                : isMilan
                ? 'Coordinated arrivals into Milan airports (Bergamo BGY & Malpensa MXP) landing with minimal wait times, ideal for meeting at Centrale station.'
                : 'Coordinated arrivals into Rome Fiumicino (FCO) landing closely together so you can meet directly in the arrivals terminal.'}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 shadow-2xs border border-stone-200/60 text-stone-800">
            {bestMatchesCount} High-Sync Days in {monthShort}
          </span>
        </div>
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter {monthShort}:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="filter-direct-btn"
              onClick={onToggleDirectOnly}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterDirectOnly
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 ${filterDirectOnly ? 'text-emerald-400' : 'text-stone-400'}`}
              />
              Direct Flights for Both Only
            </button>

            <button
              id="filter-gap60-btn"
              onClick={onToggleMaxGap60}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterMaxGap60
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <Clock className={`w-3.5 h-3.5 ${filterMaxGap60 ? 'text-amber-400' : 'text-stone-400'}`} />
              {isReturn ? 'Departures Within ≤ 60 mins' : 'Arrivals Within ≤ 60 mins'}
            </button>

            <button
              id="filter-weekend-btn"
              onClick={onToggleWeekendOnly}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterWeekendOnly
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <CalendarDays
                className={`w-3.5 h-3.5 ${filterWeekendOnly ? 'text-rose-400' : 'text-stone-400'}`}
              />
              Weekends (Thu - Sun)
            </button>
          </div>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Showing <span className="font-bold text-stone-800">{filteredMatches.length}</span> matching days
        </div>
      </div>

      {/* Calendar Grid - Monday First */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold text-stone-500 gap-2 px-1">
          <span>
            {monthLabel} {isReturn ? 'Return' : 'Outbound'} Flights Calendar (Monday – Sunday):
          </span>
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-stone-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Perfect Sync (&lt;45m)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Good Sync (&lt;90m)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-stone-300"></span> 1-Stop Connection
            </span>
          </div>
        </div>

        {/* 7-Column Day Header Starting on Monday */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-stone-600 bg-stone-100/80 p-2 rounded-xl border border-stone-200/60">
          <div className="text-stone-700">Mon</div>
          <div className="text-stone-700">Tue</div>
          <div className="text-stone-700">Wed</div>
          <div className="text-stone-700">Thu</div>
          <div className="text-stone-700">Fri</div>
          <div className="text-amber-800 font-extrabold">Sat</div>
          <div className="text-amber-800 font-extrabold">Sun</div>
        </div>

        {/* Calendar Grid with dynamic empty placeholder days */}
        <div className="grid grid-cols-7 gap-2 pb-1">
          {/* Empty offset cells before the 1st of the month */}
          {Array.from({ length: leadingOffsetCells }).map((_, idx) => (
            <div
              key={`offset-${idx}`}
              className="p-2 rounded-xl bg-stone-50/30 border border-transparent opacity-30 text-center min-h-[86px] hidden sm:flex flex-col items-center justify-center"
            >
              <span className="text-xs text-stone-400">•</span>
            </div>
          ))}

          {matches
            .filter((m) => m.destinationCity === destinationCity)
            .map((match) => {
              const dayNum = parseInt(match.date.split('-')[2], 10);
              const dateObj = new Date(match.date);

              // Monday is index 0 in dayNames
              const jsDay = dateObj.getDay(); // 0 is Sun, 1 is Mon...
              const monIndex = (jsDay + 6) % 7; // 0 is Mon, 6 is Sun
              const dayNamesMondayFirst = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              const dayName = dayNamesMondayFirst[monIndex];
              const isWeekend = monIndex === 5 || monIndex === 6; // Sat or Sun
              const isSelected = match.date === selectedDate;

              // Sync badges
              const isBest = match.bothDirect && match.arrivalDifferenceMinutes <= 60;
              const isGreat = match.bothDirect && match.arrivalDifferenceMinutes <= 90;

              return (
                <button
                  key={match.id}
                  id={`date-cell-${match.date}`}
                  onClick={() => onSelectDate(match.date)}
                  className={`p-2 sm:p-2.5 rounded-xl text-center border transition-all cursor-pointer relative group flex flex-col items-center justify-between min-h-[86px] ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-stone-900/20'
                      : isBest
                      ? 'bg-emerald-50/70 border-emerald-300 hover:bg-emerald-100/80 text-stone-900'
                      : isGreat
                      ? 'bg-amber-50/60 border-amber-200 hover:bg-amber-100/70 text-stone-900'
                      : 'bg-stone-50/80 border-stone-200 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full text-[10px] font-semibold opacity-80">
                    <span className={isWeekend && !isSelected ? 'text-amber-800 font-bold' : ''}>
                      {dayName}
                    </span>
                    {match.bothDirect && (
                      <span
                        className={`text-[9px] px-1 rounded font-bold ${
                          isSelected ? 'bg-stone-700 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        Direct
                      </span>
                    )}
                  </div>

                  <div className="my-1">
                    <span
                      className={`text-base sm:text-lg font-extrabold ${
                        isSelected ? 'text-white' : 'text-stone-900'
                      }`}
                    >
                      {dayNum}
                    </span>
                  </div>

                  <div className="w-full flex items-center justify-center gap-1 text-[10px]">
                    <Clock
                      className={`w-2.5 h-2.5 ${isSelected ? 'text-amber-300' : 'text-stone-400'}`}
                    />
                    <span className={isSelected ? 'text-stone-200' : 'text-stone-500 font-medium'}>
                      Δ {formatMinutesDiffCompact(match.arrivalDifferenceMinutes)}
                    </span>
                  </div>

                  {isBest && (
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-2xs"></span>
                  )}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};
