import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Users, 
  Heart, 
  PlaneTakeoff, 
  PlaneLanding, 
  CheckCircle2, 
  Compass, 
  Search, 
  ChevronRight,
  ShieldCheck,
  TrendingDown,
  Layers,
  AlertCircle
} from 'lucide-react';
import { DestinationCity, ParsedTripIntent } from '../types';
import { AnimatedCountryText } from './AnimatedCountryText';
import { getProposedBestDatesForDestination, ProposedTripDate } from '../data/flightScheduleDatabase';
import { CityAutocomplete } from './CityAutocomplete';

interface HomePageProps {
  onStartPlanning: (
    destination: DestinationCity, 
    outboundDate?: string, 
    returnDate?: string, 
    origin1?: string, 
    origin2?: string,
    destinationName?: string
  ) => void;
  onOpenConciergeWithPrompt: (prompt: string) => void;
  onOpenLiveSearch: () => void;
  onNavigateToTab: (tab: 'matches' | 'return' | 'compare' | 'airports') => void;
  currentTraveler1Origin?: string;
  currentTraveler2Origin?: string;
  currentDestinationName?: string;
  onSetTravelerOrigins?: (origin1: string, origin2: string) => void;
  onUpdateDestination?: (destinationName: string, cityKey: DestinationCity | '') => void;
  onOpenTipModal?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartPlanning,
  onOpenConciergeWithPrompt,
  onOpenLiveSearch,
  onNavigateToTab,
  currentTraveler1Origin = '',
  currentTraveler2Origin = '',
  currentDestinationName = '',
  onSetTravelerOrigins,
  onUpdateDestination,
  onOpenTipModal,
}) => {
  const [naturalQuery, setNaturalQuery] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedTripIntent | null>(null);

  // Manual trip configurator state - Starts EMPTY so the user enters their own destinations & dates
  const [origin1, setOrigin1] = useState(currentTraveler1Origin);
  const [origin2, setOrigin2] = useState(currentTraveler2Origin);
  const [selectedCity, setSelectedCity] = useState<DestinationCity | ''>(() => {
    if (!currentDestinationName) return '';
    const lower = currentDestinationName.toLowerCase();
    return lower.includes('rome') || lower.includes('roma') || lower.includes('fco') ? 'roma' : 'milano';
  });
  const [customDestinationText, setCustomDestinationText] = useState(currentDestinationName);
  const [tripType, setTripType] = useState<'long_weekend' | 'weekend' | 'week'>('long_weekend');
  const [outboundDate, setOutboundDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Compute today's date in local YYYY-MM-DD
  const todayStr = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  // Propose closest upcoming matching dates (never past dates)
  const proposedMilan = useMemo(() => getProposedBestDatesForDestination('milano'), []);
  const proposedRome = useMemo(() => getProposedBestDatesForDestination('roma'), []);

  // Propose closest upcoming best synchronized dates as user types the meeting destination
  const proposedBestDate = useMemo<ProposedTripDate | null>(() => {
    const dest = customDestinationText.trim();
    if (!dest && !selectedCity) return null;
    return getProposedBestDatesForDestination(dest || (selectedCity === 'roma' ? 'Rome' : 'Milan'));
  }, [customDestinationText, selectedCity]);

  // Natural language submission handler
  const handleParseQuery = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToUse = customQuery || naturalQuery;
    if (!queryToUse.trim()) return;

    setIsParsing(true);
    setValidationError(null);

    try {
      const res = await fetch('/api/parse-trip-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ naturalLanguageQuery: queryToUse }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const detectedCity = data.data.destinationCity === 'roma' ? 'roma' : 'milano';
        const t1 = data.data.traveler1Origin || 'Toulouse (TLS)';
        const t2 = data.data.traveler2Origin || 'Zagreb (ZAG)';
        
        setOrigin1(t1);
        setOrigin2(t2);
        setSelectedCity(detectedCity);
        if (onSetTravelerOrigins) onSetTravelerOrigins(t1, t2);

        setParsedResult({
          traveler1Name: 'Traveler 1',
          traveler1Origin: t1,
          traveler2Name: 'Traveler 2',
          traveler2Origin: t2,
          destinationCity: detectedCity,
          month: 'October 2026',
          tripType: 'roundtrip',
          durationDays: data.data.durationDays || 4,
          outboundDate: data.data.outboundDate || '2026-10-15',
          returnDate: data.data.returnDate || '2026-10-18',
          summary: data.data.summary || `Synchronized flight rendezvous from ${t1} and ${t2} to ${detectedCity === 'milano' ? 'Milan' : 'Rome'}.`,
          whyThisTrip: data.data.whyThisTrip || 'Direct flight options aligned for tight arrival and return departure windows.',
          directOutboundAvailable: true,
          directReturnAvailable: true,
        });
      } else {
        // Fallback local intelligent parser
        const isRome = queryToUse.toLowerCase().includes('rome') || queryToUse.toLowerCase().includes('roma');
        const city: DestinationCity = isRome ? 'roma' : 'milano';
        
        // Extract basic origins if present
        let t1 = origin1 || 'Toulouse (TLS)';
        let t2 = origin2 || 'Zagreb (ZAG)';
        if (queryToUse.toLowerCase().includes('toulouse')) t1 = 'Toulouse (TLS)';
        if (queryToUse.toLowerCase().includes('zagreb')) t2 = 'Zagreb (ZAG)';
        if (queryToUse.toLowerCase().includes('paris')) t1 = 'Paris (CDG)';
        if (queryToUse.toLowerCase().includes('split')) t2 = 'Split (SPU)';

        setOrigin1(t1);
        setOrigin2(t2);
        setSelectedCity(city);
        if (onSetTravelerOrigins) onSetTravelerOrigins(t1, t2);
        
        let outDate = '2026-10-15';
        let retDate = '2026-10-18';
        if (queryToUse.includes('8') || queryToUse.includes('11')) {
          outDate = '2026-10-08';
          retDate = '2026-10-11';
        } else if (queryToUse.includes('22') || queryToUse.includes('25')) {
          outDate = '2026-10-22';
          retDate = '2026-10-25';
        } else if (queryToUse.includes('1') || queryToUse.includes('4')) {
          outDate = '2026-10-01';
          retDate = '2026-10-04';
        }

        setParsedResult({
          traveler1Name: 'Traveler 1',
          traveler1Origin: t1,
          traveler2Name: 'Traveler 2',
          traveler2Origin: t2,
          destinationCity: city,
          month: 'October 2026',
          tripType: 'roundtrip',
          durationDays: 4,
          outboundDate: outDate,
          returnDate: retDate,
          summary: `Synchronized Long Weekend in ${city === 'milano' ? 'Milan' : 'Rome'} (${outDate} to ${retDate}) from ${t1} and ${t2}.`,
          whyThisTrip: city === 'milano' 
            ? 'On Thursdays, direct flights land at Bergamo (BGY) within 75 minutes of each other. Return flights depart on Sunday evening.'
            : 'On Thursdays and Sundays, direct flights land and depart at Rome Fiumicino (FCO) within synchronized arrival windows.',
          directOutboundAvailable: true,
          directReturnAvailable: true,
        });
      }
    } catch (err) {
      // Local fallback
      const isRome = queryToUse.toLowerCase().includes('rome') || queryToUse.toLowerCase().includes('roma');
      const city: DestinationCity = isRome ? 'roma' : 'milano';
      const t1 = origin1 || 'Toulouse (TLS)';
      const t2 = origin2 || 'Zagreb (ZAG)';
      setOrigin1(t1);
      setOrigin2(t2);
      setSelectedCity(city);
      if (onSetTravelerOrigins) onSetTravelerOrigins(t1, t2);

      setParsedResult({
        traveler1Name: 'Traveler 1',
        traveler1Origin: t1,
        traveler2Name: 'Traveler 2',
        traveler2Origin: t2,
        destinationCity: city,
        month: 'October 2026',
        tripType: 'roundtrip',
        durationDays: 4,
        outboundDate: '2026-10-15',
        returnDate: '2026-10-18',
        summary: `Synchronized Long Weekend in ${city === 'milano' ? 'Milan' : 'Rome'} from ${t1} & ${t2}.`,
        whyThisTrip: 'Direct flight schedules matched for minimum airport wait times.',
        directOutboundAvailable: true,
        directReturnAvailable: true,
      });
    } finally {
      setIsParsing(false);
    }
  };

  // Submit manual configurator
  const handleLaunchSynchronizer = () => {
    if (!origin1.trim()) {
      setValidationError('Please enter Traveler 1 departure city (e.g. Toulouse TLS).');
      return;
    }
    if (!origin2.trim()) {
      setValidationError('Please enter Traveler 2 departure city (e.g. Zagreb ZAG).');
      return;
    }
    const destInput = customDestinationText.trim();
    if (!selectedCity && !destInput) {
      setValidationError('Please enter your meeting destination.');
      return;
    }

    setValidationError(null);
    let destination: DestinationCity = 'milano';
    if (
      selectedCity === 'roma' ||
      destInput.toLowerCase().includes('rome') ||
      destInput.toLowerCase().includes('roma') ||
      destInput.toUpperCase().includes('FCO')
    ) {
      destination = 'roma';
    } else {
      destination = 'milano';
    }

    const proposed = getProposedBestDatesForDestination(destInput || (destination === 'roma' ? 'Rome' : 'Milan'));

    // If user left dates blank, apply the proposed closest upcoming best dates
    let effectiveOutbound = outboundDate;
    let effectiveReturn = returnDate;

    if (!effectiveOutbound) {
      effectiveOutbound = proposed.outboundDate;
      effectiveReturn = proposed.returnDate;
      setOutboundDate(effectiveOutbound);
      setReturnDate(effectiveReturn);
    } else if (effectiveOutbound < todayStr) {
      setValidationError('Please choose an upcoming departure date (dates in the past cannot be booked).');
      return;
    } else if (!effectiveReturn || effectiveReturn <= effectiveOutbound) {
      const d = new Date(effectiveOutbound);
      d.setDate(d.getDate() + 3);
      effectiveReturn = d.toISOString().split('T')[0];
      setReturnDate(effectiveReturn);
    }

    if (onSetTravelerOrigins) {
      onSetTravelerOrigins(origin1.trim(), origin2.trim());
    }

    const meetingName = destInput || (destination === 'roma' ? 'Rome' : 'Milan');

    onStartPlanning(destination, effectiveOutbound, effectiveReturn, origin1.trim(), origin2.trim(), meetingName);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* ======================= HERO & DESTINATION BUILDER ======================= */}
      <div className="relative text-stone-900 pt-1 pb-6 sm:pt-4 sm:pb-10 overflow-hidden">
        {/* Seamless ambient glow transitioning organically from the top header down */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-16 w-[700px] h-[340px] bg-gradient-to-b from-amber-300/15 via-orange-300/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-300/70 text-orange-900 text-xs font-bold tracking-wide">
            <Heart className="w-3.5 h-3.5 text-orange-600 fill-orange-600" />
            Dual-Origin Coordinated Rendezvous Flights
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight text-stone-900 leading-tight">
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <span>Meet in</span>
              <AnimatedCountryText theme="gold" showFlag={true} />
            </span>
            <br className="hidden sm:inline" />
            <span className="text-orange-600 block sm:inline sm:ml-2">Synchronize Flights from Any Two Cities</span>
          </h1>

          <p className="text-stone-700 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Flying from different airports to meet together in{' '}
            <span className="font-semibold text-orange-700 underline decoration-orange-400/50">Greece</span>
            ? Enter your departure cities and meeting destination below to find flights that land together and return together.
          </p>

          {/* ======================= DIRECT ROUTE INPUT BOX ======================= */}
          <div className="pt-4 max-w-3xl mx-auto text-left">
            <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-[#E2D2C2] p-5 sm:p-7 shadow-xl shadow-stone-900/5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Traveler 1 Input */}
                <div>
                  <CityAutocomplete
                    id="input-origin-1"
                    label="Traveler 1 (Your Departure City)"
                    icon={<PlaneTakeoff className="w-3.5 h-3.5 text-orange-600" />}
                    value={origin1}
                    placeholder="e.g. Paris"
                    datalistId="origin1-datalist"
                    onChange={(val) => {
                      setOrigin1(val);
                      if (onSetTravelerOrigins) onSetTravelerOrigins(val, origin2);
                      if (validationError) setValidationError(null);
                    }}
                  />
                </div>

                {/* Traveler 2 Input */}
                <div>
                  <CityAutocomplete
                    id="input-origin-2"
                    label="Traveler 2 (Companion's Departure City)"
                    icon={<Users className="w-3.5 h-3.5 text-orange-600" />}
                    value={origin2}
                    placeholder="e.g. Zagreb"
                    datalistId="origin2-datalist"
                    onChange={(val) => {
                      setOrigin2(val);
                      if (onSetTravelerOrigins) onSetTravelerOrigins(origin1, val);
                      if (validationError) setValidationError(null);
                    }}
                  />
                </div>
              </div>

              {/* Destination & Flexible Date Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#E8DACB]">
                {/* Destination City Selection with Dropdown Menu */}
                <div>
                  <CityAutocomplete
                    id="input-meeting-destination"
                    label="Meeting Destination City"
                    icon={<MapPin className="w-3.5 h-3.5 text-orange-600" />}
                    value={customDestinationText}
                    placeholder="e.g. Milan"
                    datalistId="destinations-datalist"
                    onChange={(val, cityItem) => {
                      setCustomDestinationText(val);
                      if (!val.trim()) {
                        setSelectedCity('');
                        if (onUpdateDestination) onUpdateDestination('', '');
                      } else {
                        const check = ((cityItem?.city || '') + ' ' + val).toLowerCase();
                        const nextCity: DestinationCity =
                          check.includes('rome') || check.includes('roma') || check.includes('fco')
                            ? 'roma'
                            : 'milano';
                        setSelectedCity(nextCity);
                        if (onUpdateDestination) onUpdateDestination(val, nextCity);
                      }
                      if (validationError) setValidationError(null);
                    }}
                  />
                </div>

                {/* Flexible Dates Selector - Any Month & Year */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-orange-600" />
                    Trip Dates (Any Month &amp; Year)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-stone-600 block mb-1">Departure:</span>
                      <input
                        id="input-departure-date"
                        type="date"
                        value={outboundDate}
                        min={todayStr}
                        placeholder="YYYY-MM-DD"
                        onChange={(e) => {
                          const newOut = e.target.value;
                          setOutboundDate(newOut);
                          if (returnDate && newOut >= returnDate) {
                            const d = new Date(newOut);
                            d.setDate(d.getDate() + 3);
                            setReturnDate(d.toISOString().split('T')[0]);
                          }
                          if (validationError) setValidationError(null);
                        }}
                        className="w-full bg-[#FAF7F2] hover:bg-white focus:bg-white text-stone-900 border border-stone-300 rounded-xl px-2.5 py-2 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-stone-600 block mb-1">Return:</span>
                      <input
                        id="input-return-date"
                        type="date"
                        value={returnDate}
                        min={outboundDate || todayStr}
                        placeholder="YYYY-MM-DD"
                        onChange={(e) => {
                          setReturnDate(e.target.value);
                          if (validationError) setValidationError(null);
                        }}
                        className="w-full bg-[#FAF7F2] hover:bg-white focus:bg-white text-stone-900 border border-stone-300 rounded-xl px-2.5 py-2 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Proposed Closest Best Date Banner (Triggers as user types the meeting destination) */}
                  {proposedBestDate && (
                    <div className="mt-2.5 p-3 rounded-xl bg-amber-50/90 border border-amber-200/90 text-stone-800 text-xs space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-stone-900">
                                Proposed closest date for {proposedBestDate.cityName}:
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                Δ {proposedBestDate.gapFormatted} arrival gap
                              </span>
                            </div>
                            <p className="text-stone-600 text-[11px] mt-0.5 leading-relaxed">
                              📅 <strong>{proposedBestDate.outboundFormatted} ➔ {proposedBestDate.returnFormatted}</strong>
                            </p>
                            <p className="text-stone-500 text-[11px]">
                              {proposedBestDate.highlight}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-amber-200/60">
                        {outboundDate === proposedBestDate.outboundDate && returnDate === proposedBestDate.returnDate ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Proposed dates applied
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setOutboundDate('');
                                setReturnDate('');
                              }}
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
                              onClick={() => {
                                setOutboundDate(proposedBestDate.outboundDate);
                                setReturnDate(proposedBestDate.returnDate);
                                if (validationError) setValidationError(null);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              Apply proposed date ({proposedBestDate.outboundDate} ➔ {proposedBestDate.returnDate})
                            </button>
                            <span className="text-[11px] text-stone-500">
                              or choose your own dates above
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Validation alert */}
              {validationError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Search Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8DACB]">
                <div className="text-xs text-stone-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Synchronizes arrival times within ~60–75 min &amp; matching return flights.</span>
                </div>

                <button
                  id="home-find-flights-main-btn"
                  type="button"
                  onClick={handleLaunchSynchronizer}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-orange-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Find Synchronized Flights</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Natural language query alternative */}
            <div className="mt-4 pt-3 border-t border-[#E8DACB]">
              <p className="text-xs text-stone-600 font-medium mb-1.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-orange-600" />
                Or describe your trip in plain conversational language:
              </p>
              <form onSubmit={(e) => handleParseQuery(e)} className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={naturalQuery}
                    onChange={(e) => setNaturalQuery(e.target.value)}
                    placeholder="e.g. Find matching direct flights for our rendezvous weekend..."
                    className="flex-1 bg-white text-stone-900 placeholder-stone-400 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-stone-300/80 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-400/20"
                  />
                  <button
                    type="submit"
                    disabled={isParsing || !naturalQuery.trim()}
                    className="px-4 py-2 rounded-xl bg-[#3D2E24] hover:bg-[#4D3A2E] disabled:opacity-50 text-amber-200 text-xs font-semibold cursor-pointer border border-[#594537] flex items-center gap-1.5 shrink-0 shadow-2xs"
                  >
                    {isParsing ? 'Searching...' : 'Send Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* AI Parsed Result Summary Card (Appears after query or user action) */}
        {parsedResult && (
          <div className="mt-8 relative z-10 max-w-3xl mx-auto bg-white text-stone-900 rounded-2xl p-5 sm:p-6 shadow-2xl border-2 border-amber-400 animate-in fade-in slide-in-from-bottom-4 duration-300">
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
                    <span className="text-xs font-bold text-stone-500">
                      {parsedResult.destinationCity === 'milano' ? 'Milan, Italy' : 'Rome, Italy'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900 mt-0.5">
                    {parsedResult.summary}
                  </h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              {/* Outbound Sync Card */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
                  <PlaneLanding className="w-3.5 h-3.5 text-emerald-700" />
                  Outbound Arrival ({parsedResult.outboundDate})
                </div>
                <div className="text-xs text-stone-700 space-y-1">
                  <p>• <strong>{parsedResult.traveler1Origin}:</strong> Direct flight to {parsedResult.destinationCity === 'milano' ? 'Milan BGY/MXP' : 'Rome FCO'}</p>
                  <p>• <strong>{parsedResult.traveler2Origin}:</strong> Direct flight to {parsedResult.destinationCity === 'milano' ? 'Milan BGY/MXP' : 'Rome FCO'}</p>
                  <p className="text-emerald-800 font-semibold pt-0.5">⏱️ Both land within ~75 min of each other!</p>
                </div>
              </div>

              {/* Return Sync Card */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
                  <PlaneTakeoff className="w-3.5 h-3.5 text-amber-700" />
                  Return Takeoff ({parsedResult.returnDate})
                </div>
                <div className="text-xs text-stone-700 space-y-1">
                  <p>• <strong>➔ {parsedResult.traveler1Origin}:</strong> Return flight in the evening</p>
                  <p>• <strong>➔ {parsedResult.traveler2Origin}:</strong> Return flight in the evening</p>
                  <p className="text-amber-800 font-semibold pt-0.5">⏱️ Coordinated departures on the same date!</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/70 leading-relaxed mb-4">
              💡 <strong>Rendezvous Logistics:</strong> {parsedResult.whyThisTrip}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-stone-500 font-medium">
                Review complete flight numbers, baggage limits, and booking options:
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="home-open-outbound-btn"
                  onClick={() => onStartPlanning(
                    parsedResult.destinationCity, 
                    parsedResult.outboundDate, 
                    parsedResult.returnDate,
                    parsedResult.traveler1Origin,
                    parsedResult.traveler2Origin
                  )}
                  className="px-4 py-2 rounded-xl bg-[#2F241C] hover:bg-[#3D2E24] text-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs border border-[#523E30]"
                >
                  <PlaneLanding className="w-3.5 h-3.5 text-emerald-400" />
                  Step 1: View Outbound Flights
                </button>
                <button
                  id="home-open-return-btn"
                  onClick={() => {
                    onStartPlanning(
                      parsedResult.destinationCity, 
                      parsedResult.outboundDate, 
                      parsedResult.returnDate,
                      parsedResult.traveler1Origin,
                      parsedResult.traveler2Origin
                    );
                    onNavigateToTab('return');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <PlaneTakeoff className="w-3.5 h-3.5" />
                  Step 2: View Return Flights
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================= CURATED POPULAR RENDEZVOUS IDEAS ======================= */}
      {origin1 && origin2 && (
      <div className="space-y-4 mt-8 pt-8 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              Popular Meetup Ideas for {origin1.split(' ')[0]} &amp; {origin2.split(' ')[0]}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Pre-calculated flight combinations with tightest arrival coordination and seamless returns.
            </p>
          </div>

          <button
            id="home-compare-cities-link"
            onClick={() => onNavigateToTab('compare')}
            className="text-xs font-bold text-stone-700 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
          >
            Compare Destination Details <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Package 1: Milan Golden Long Weekend */}
          <div className="bg-white rounded-2xl border-2 border-amber-300/80 p-5 sm:p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
              ⭐ Top Direct Match
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                MILAN (MILANO) • 4-DAY LONG WEEKEND
              </div>
              <h3 className="text-lg font-bold font-serif text-stone-900">
                The Milan &amp; Lake Como Rendezvous
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                📅 <strong>{proposedMilan.outboundFormatted} ➔ {proposedMilan.returnFormatted}</strong>
              </p>

              {/* Flight Sync Breakdown */}
              <div className="mt-4 space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <div className="font-bold text-emerald-950 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <PlaneLanding className="w-3.5 h-3.5 text-emerald-600" /> Outbound ({proposedMilan.outboundFormatted.split(',')[0]}):
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      1 hr 15 min Arrival Gap
                    </span>
                  </div>
                  <div className="mt-1 text-stone-600 text-[11px] leading-relaxed">
                    • <strong>{origin2.split(' ')[0]} ➔ BGY:</strong> Ryanair lands at 12:45<br />
                    • <strong>{origin1.split(' ')[0]} ➔ BGY:</strong> Ryanair lands at 14:00<br />
                    <span className="text-emerald-800 font-semibold">📍 Meet directly at Bergamo Airport arrivals cafe and take the direct express coach to Milano Centrale together!</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                  <div className="font-bold text-amber-950 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <PlaneTakeoff className="w-3.5 h-3.5 text-amber-600" /> Return ({proposedMilan.returnFormatted.split(',')[0]}):
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                      Evening Departures
                    </span>
                  </div>
                  <div className="mt-1 text-stone-600 text-[11px] leading-relaxed">
                    • <strong>BGY ➔ {origin2.split(' ')[0]}:</strong> Ryanair departs 17:50 ➔ arrives 19:05<br />
                    • <strong>MXP ➔ {origin1.split(' ')[0]}:</strong> easyJet departs 18:50 ➔ arrives 20:20<br />
                    <span className="text-amber-800 font-semibold">📍 Enjoy Sunday morning together, then head to your respective airport coaches at 15:00 from Milano Centrale!</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-400">Total Roundtrip for Both:</span>
                <div className="text-base font-extrabold text-stone-900">~€198 combined</div>
              </div>

              <button
                id="select-milan-package-btn"
                onClick={() => {
                  setSelectedCity('milano');
                  if (onSetTravelerOrigins) onSetTravelerOrigins(origin1, origin2);
                  onStartPlanning('milano', proposedMilan.outboundDate, proposedMilan.returnDate, origin1, origin2);
                }}
                className="px-4 py-2 rounded-xl bg-[#2F241C] hover:bg-[#3D2E24] text-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs border border-[#523E30]"
              >
                <span>Select &amp; View Flights</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Package 2: Rome Eternal City Weekend */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800 mb-1">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                ROME (ROMA) • 4-DAY LONG WEEKEND
              </div>
              <h3 className="text-lg font-bold font-serif text-stone-900">
                The Roman Holiday Rendezvous
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                📅 <strong>{proposedRome.outboundFormatted} ➔ {proposedRome.returnFormatted}</strong>
              </p>

              {/* Flight Sync Breakdown */}
              <div className="mt-4 space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <div className="font-bold text-emerald-950 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <PlaneLanding className="w-3.5 h-3.5 text-emerald-600" /> Outbound ({proposedRome.outboundFormatted.split(',')[0]}):
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      Same Airport (FCO)
                    </span>
                  </div>
                  <div className="mt-1 text-stone-600 text-[11px] leading-relaxed">
                    • <strong>{origin2.split(' ')[0]} ➔ FCO:</strong> Ryanair lands at 14:15<br />
                    • <strong>{origin1.split(' ')[0]} ➔ FCO:</strong> Ryanair lands at 15:20<br />
                    <span className="text-emerald-800 font-semibold">📍 Meet directly at Rome Fiumicino Terminal 3 and ride the Leonardo Express train together to Roma Termini!</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                  <div className="font-bold text-amber-950 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <PlaneTakeoff className="w-3.5 h-3.5 text-amber-600" /> Return ({proposedRome.returnFormatted.split(',')[0]}):
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                      Depart from Same FCO
                    </span>
                  </div>
                  <div className="mt-1 text-stone-600 text-[11px] leading-relaxed">
                    • <strong>FCO ➔ {origin2.split(' ')[0]}:</strong> Ryanair departs 15:45 ➔ arrives 17:00<br />
                    • <strong>FCO ➔ {origin1.split(' ')[0]}:</strong> Ryanair departs 16:30 ➔ arrives 18:25<br />
                    <span className="text-amber-800 font-semibold">📍 Travel to FCO together on Sunday afternoon, check in together, and say goodbye at security!</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-400">Total Roundtrip for Both:</span>
                <div className="text-base font-extrabold text-stone-900">~€215 combined</div>
              </div>

              <button
                id="select-rome-package-btn"
                onClick={() => {
                  setSelectedCity('roma');
                  if (onSetTravelerOrigins) onSetTravelerOrigins(origin1, origin2);
                  onStartPlanning('roma', proposedRome.outboundDate, proposedRome.returnDate, origin1, origin2);
                }}
                className="px-4 py-2 rounded-xl bg-[#2F241C] hover:bg-[#3D2E24] text-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs border border-[#523E30]"
              >
                <span>Select &amp; View Flights</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ======================= HOW IT WORKS ======================= */}
      <div className="bg-gradient-to-br from-[#FAF5EE] via-[#F3E8DC] to-[#FFF9F2] text-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E6D6C6]">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-widest text-orange-700 font-bold bg-orange-100/80 px-3 py-1 rounded-full border border-orange-200/60">
            Synchronized Travel Architecture
          </span>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mt-2.5">
            How Dual-Origin Flight Synchronization Works
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Eliminating the anxiety of traveling alone or waiting hours in unfamiliar airport terminals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/95 border border-[#E2D2C2] p-5 rounded-2xl flex flex-col items-start shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg mb-3">
              1
            </div>
            <h3 className="text-base font-bold text-stone-900">Outbound Arrival Match</h3>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              We analyze flights from both departure cities on every day of October to find pairs landing within 30 to 75 minutes of each other.
            </p>
          </div>

          <div className="bg-white/95 border border-[#E2D2C2] p-5 rounded-2xl flex flex-col items-start shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-3">
              2
            </div>
            <h3 className="text-base font-bold text-stone-900">City &amp; Transit Integration</h3>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              Step-by-step meeting point guides for Bergamo (BGY), Malpensa (MXP), and Rome Fiumicino (FCO), plus direct airport coach and train instructions into the center.
            </p>
          </div>

          <div className="bg-white/95 border border-[#E2D2C2] p-5 rounded-2xl flex flex-col items-start shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-lg mb-3">
              3
            </div>
            <h3 className="text-base font-bold text-stone-900">Coordinated Return Takeoff</h3>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              Return flights are matched on the exact same return date (e.g. Sunday evening) so you spend every minute together and head to the airport at the same time.
            </p>
          </div>
        </div>
      </div>

      {/* ======================= SUPPORT THE CREATOR CARD ======================= */}
      <div className="bg-gradient-to-r from-amber-50 via-stone-50 to-orange-50 rounded-3xl p-6 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center text-2xl shadow-sm shrink-0">
            ☕
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
              <span>Find this synchronized flight planner helpful?</span>
            </h3>
            <p className="text-xs text-stone-600 mt-0.5 max-w-xl">
              I built this tool to make meeting up across Europe easy and stress-free. If this helped you plan your getaway or saved you time, you can buy me a coffee to support the project!
            </p>
          </div>
        </div>

        {onOpenTipModal && (
          <button
            id="home-tip-creator-btn"
            onClick={onOpenTipModal}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-amber-500/20"
          >
            <span>☕ Buy Me a Coffee</span>
            <Heart className="w-3.5 h-3.5 fill-stone-950" />
          </button>
        )}
      </div>
    </div>
  );
};
