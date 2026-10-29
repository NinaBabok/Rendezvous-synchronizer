import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Users, 
  Heart, 
  PlaneTakeoff, 
  PlaneLanding, 
  CheckCircle2, 
  Compass, 
  AlertCircle
} from 'lucide-react';
import { DestinationCity, ParsedTripIntent } from '../types';
import { isRecord } from '../utils';
import { parseTripIntent } from '../gemini';
import { AnimatedCountryText } from './AnimatedCountryText';
import { getProposedBestDatesForDestination, ProposedTripDate } from '../data/flightScheduleDatabase';
import type { CityItem } from '../data/cities';
import { FeaturedRendezvousIdeas } from './FeaturedRendezvousIdeas';
import { TripRequestForm } from './TripRequestForm';
import { ParsedTripResultCard } from './ParsedTripResultCard';

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
      const data = await parseTripIntent(queryToUse);
      if (isRecord(data) && data.success === true && isRecord(data.data)) {
        const parsedData = data.data;
        const detectedCity: DestinationCity = parsedData.destinationCity === 'roma' ? 'roma' : 'milano';
        const t1 = typeof parsedData.traveler1Origin === 'string'
          ? parsedData.traveler1Origin
          : 'Toulouse (TLS)';
        const t2 = typeof parsedData.traveler2Origin === 'string'
          ? parsedData.traveler2Origin
          : 'Zagreb (ZAG)';
        
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
          durationDays: typeof parsedData.durationDays === 'number' ? parsedData.durationDays : 4,
          outboundDate: typeof parsedData.outboundDate === 'string' ? parsedData.outboundDate : '2026-10-15',
          returnDate: typeof parsedData.returnDate === 'string' ? parsedData.returnDate : '2026-10-18',
          summary: typeof parsedData.summary === 'string'
            ? parsedData.summary
            : `Synchronized flight rendezvous from ${t1} and ${t2} to ${detectedCity === 'milano' ? 'Milan' : 'Rome'}.`,
          whyThisTrip: typeof parsedData.whyThisTrip === 'string'
            ? parsedData.whyThisTrip
            : 'Direct flight options aligned for tight arrival and return departure windows.',
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
      setValidationError(
        `${err instanceof Error ? err.message : 'Gemini could not parse this request.'} Using the built-in trip parser instead.`,
      );
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
      effectiveReturn = d.toISOString().slice(0, 10);
      setReturnDate(effectiveReturn);
    }

    if (onSetTravelerOrigins) {
      onSetTravelerOrigins(origin1.trim(), origin2.trim());
    }

    const meetingName = destInput || (destination === 'roma' ? 'Rome' : 'Milan');

    onStartPlanning(destination, effectiveOutbound, effectiveReturn, origin1.trim(), origin2.trim(), meetingName);
  };

  const handleSelectSuggestedTrip = (
    destination: DestinationCity,
    suggestedOutboundDate: string,
    suggestedReturnDate: string,
  ) => {
    setSelectedCity(destination);
    onSetTravelerOrigins?.(origin1, origin2);
    onStartPlanning(destination, suggestedOutboundDate, suggestedReturnDate, origin1, origin2);
  };

  const handleOrigin1Change = (value: string) => {
    setOrigin1(value);
    onSetTravelerOrigins?.(value, origin2);
    if (validationError) setValidationError(null);
  };

  const handleOrigin2Change = (value: string) => {
    setOrigin2(value);
    onSetTravelerOrigins?.(origin1, value);
    if (validationError) setValidationError(null);
  };

  const handleDestinationChange = (value: string, cityItem?: CityItem) => {
    setCustomDestinationText(value);
    if (!value.trim()) {
      setSelectedCity('');
      onUpdateDestination?.('', '');
    } else {
      const destinationSearchText = `${cityItem?.city ?? ''} ${value}`.toLowerCase();
      const nextCity: DestinationCity =
        destinationSearchText.includes('rome') ||
        destinationSearchText.includes('roma') ||
        destinationSearchText.includes('fco')
          ? 'roma'
          : 'milano';
      setSelectedCity(nextCity);
      onUpdateDestination?.(value, nextCity);
    }
    if (validationError) setValidationError(null);
  };

  const handleOutboundDateChange = (value: string) => {
    setOutboundDate(value);
    if (returnDate && value >= returnDate) {
      const nextReturnDate = new Date(value);
      nextReturnDate.setDate(nextReturnDate.getDate() + 3);
      setReturnDate(nextReturnDate.toISOString().slice(0, 10));
    }
    if (validationError) setValidationError(null);
  };

  const handleReturnDateChange = (value: string) => {
    setReturnDate(value);
    if (validationError) setValidationError(null);
  };

  const handleApplyProposedDates = () => {
    if (!proposedBestDate) return;
    setOutboundDate(proposedBestDate.outboundDate);
    setReturnDate(proposedBestDate.returnDate);
    if (validationError) setValidationError(null);
  };

  const handleOpenParsedStep = (result: ParsedTripIntent, step: 'outbound' | 'return') => {
    onStartPlanning(
      result.destinationCity,
      result.outboundDate,
      result.returnDate,
      result.traveler1Origin,
      result.traveler2Origin,
    );
    if (step === 'return') onNavigateToTab('return');
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

          <TripRequestForm
            state={{
              origin1,
              origin2,
              destinationText: customDestinationText,
              outboundDate,
              returnDate,
              today: todayStr,
              proposedDate: proposedBestDate,
              validationError,
              naturalQuery,
              isParsing,
            }}
            actions={{
              onOrigin1Change: handleOrigin1Change,
              onOrigin2Change: handleOrigin2Change,
              onDestinationChange: handleDestinationChange,
              onOutboundDateChange: handleOutboundDateChange,
              onReturnDateChange: handleReturnDateChange,
              onClearDates: () => {
                setOutboundDate('');
                setReturnDate('');
              },
              onApplyProposedDates: handleApplyProposedDates,
              onLaunchSynchronizer: handleLaunchSynchronizer,
              onNaturalQueryChange: setNaturalQuery,
              onSubmitNaturalQuery: (event) => void handleParseQuery(event),
            }}
          />

        {parsedResult && (
          <ParsedTripResultCard
            result={parsedResult}
            onOpenStep={(step) => handleOpenParsedStep(parsedResult, step)}
          />
        )}
      </div>
      </div>

      {origin1 && origin2 && (
        <FeaturedRendezvousIdeas
          traveler1Origin={origin1}
          traveler2Origin={origin2}
          proposedMilan={proposedMilan}
          proposedRome={proposedRome}
          onCompareDestinations={() => onNavigateToTab('compare')}
          onSelectTrip={handleSelectSuggestedTrip}
        />
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
