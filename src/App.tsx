/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { DestinationCity, SynchronizedMatch } from './types';
import { 
  getMatchesForMonth, 
  getReturnMatchesForMonth, 
  getProposedBestDatesForDestination 
} from './data/flightScheduleDatabase';
import { Header, AppTab } from './components/Header';
import { HomePage } from './components/HomePage';
import { RendezvousMatrix } from './components/RendezvousMatrix';
import { SynchronizedFlightCard } from './components/SynchronizedFlightCard';
import { ReturnFlightCard } from './components/ReturnFlightCard';
import { DestinationComparison } from './components/DestinationComparison';
import { AirportTransitGuide } from './components/AirportTransitGuide';
import { AIConciergeModal } from './components/AIConciergeModal';
import { LiveFlightSearchModal } from './components/LiveFlightSearchModal';
import { ShareModal } from './components/ShareModal';
import { DiscreetAdBanner } from './components/DiscreetAdBanner';
import { TipCreatorModal } from './components/TipCreatorModal';
import { BlankDestinationPrompt } from './components/BlankDestinationPrompt';
import { TripSummary } from './components/TripSummary';
import { BookingRoleExplainer } from './components/BookingRoleExplainer';
import { AdvertiseModal } from './components/AdvertiseModal';
import { GoogleAdSenseBanner } from './components/GoogleAdSenseBanner';
import { GeminiApiKeyModal } from './components/GeminiApiKeyModal';
import { formatMinutesDiff } from './utils';
import { getGeminiApiKey, removeGeminiApiKey, saveGeminiApiKey } from './gemini';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  PlaneTakeoff,
  PlaneLanding,
  Repeat,
  Coffee,
  Compass
} from 'lucide-react';

export default function App() {
  const [destinationCity, setDestinationCity] = useState<DestinationCity>('milano');
  const [destinationName, setDestinationName] = useState<string>('');
  const [isDestinationChosen, setIsDestinationChosen] = useState<boolean>(false);
  const [traveler1Origin, setTraveler1Origin] = useState<string>('');
  const [traveler2Origin, setTraveler2Origin] = useState<string>('');
  const [selectedOutboundDate, setSelectedOutboundDate] = useState<string>('');
  const [selectedReturnDate, setSelectedReturnDate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isTipModalOpen, setIsTipModalOpen] = useState<boolean>(false);
  const [isAdvertiseOpen, setIsAdvertiseOpen] = useState<boolean>(false);
  const [geminiApiKey, setGeminiApiKey] = useState(() => getGeminiApiKey());
  const [isGeminiApiKeyModalOpen, setIsGeminiApiKeyModalOpen] = useState(false);

  // Filters for Outbound
  const [filterDirectOnly, setFilterDirectOnly] = useState<boolean>(false);
  const [filterMaxGap60, setFilterMaxGap60] = useState<boolean>(false);
  const [filterWeekendOnly, setFilterWeekendOnly] = useState<boolean>(false);

  // Filters for Return
  const [returnFilterDirectOnly, setReturnFilterDirectOnly] = useState<boolean>(false);
  const [returnFilterMaxGap60, setReturnFilterMaxGap60] = useState<boolean>(false);
  const [returnFilterWeekendOnly, setReturnFilterWeekendOnly] = useState<boolean>(false);

  // Modals state
  const [isConciergeOpen, setIsConciergeOpen] = useState<boolean>(false);
  const [conciergeInitialPrompt, setConciergeInitialPrompt] = useState<string>('');
  const [isLiveSearchOpen, setIsLiveSearchOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [sharedMatch, setSharedMatch] = useState<SynchronizedMatch | null>(null);

  // Parse Year/Month for Outbound and Return (defaults to upcoming date if unselected)
  const [outYear, outMonth] = useMemo(() => {
    if (!selectedOutboundDate) {
      const p = getProposedBestDatesForDestination(destinationCity);
      const parts = p.outboundDate.split('-').map(Number);
      return [parts[0], parts[1]];
    }
    const parts = selectedOutboundDate.split('-').map(Number);
    return [parts[0] || 2026, parts[1] || 10];
  }, [selectedOutboundDate, destinationCity]);

  const [retYear, retMonth] = useMemo(() => {
    if (!selectedReturnDate) {
      const p = getProposedBestDatesForDestination(destinationCity);
      const parts = p.returnDate.split('-').map(Number);
      return [parts[0], parts[1]];
    }
    const parts = selectedReturnDate.split('-').map(Number);
    return [parts[0] || 2026, parts[1] || 10];
  }, [selectedReturnDate, destinationCity]);

  // Load schedules for selected month & year
  const allOutboundMatches = useMemo(() => {
    return getMatchesForMonth(outYear, outMonth);
  }, [outYear, outMonth]);

  const allReturnMatches = useMemo(() => {
    return getReturnMatchesForMonth(retYear, retMonth);
  }, [retYear, retMonth]);

  // Find currently selected outbound match
  const currentOutboundMatch = useMemo(() => {
    return allOutboundMatches.find(
      (m) => m.destinationCity === destinationCity && m.date === selectedOutboundDate
    ) || allOutboundMatches.find((m) => m.destinationCity === destinationCity) || allOutboundMatches[0];
  }, [allOutboundMatches, destinationCity, selectedOutboundDate]);

  // Find currently selected return match
  const currentReturnMatch = useMemo(() => {
    return allReturnMatches.find(
      (m) => m.destinationCity === destinationCity && m.date === selectedReturnDate
    ) || allReturnMatches.find((m) => m.destinationCity === destinationCity) || allReturnMatches[0];
  }, [allReturnMatches, destinationCity, selectedReturnDate]);

  // Handler to open concierge with custom prompt
  const handleOpenConciergeWithPrompt = (prompt: string) => {
    setConciergeInitialPrompt(prompt);
    setIsConciergeOpen(true);
  };

  // Handler for sharing
  const handleShare = (match: SynchronizedMatch) => {
    setSharedMatch(match);
    setIsShareOpen(true);
  };

  // Handler for starting planning from Home Page
  const handleStartPlanning = (
    city: DestinationCity, 
    outboundDate?: string, 
    returnDate?: string,
    origin1?: string,
    origin2?: string,
    destName?: string
  ) => {
    setIsDestinationChosen(true);
    setDestinationCity(city);
    if (destName) setDestinationName(destName);
    else setDestinationName(city === 'roma' ? 'Rome' : 'Milan');
    if (outboundDate) setSelectedOutboundDate(outboundDate);
    if (returnDate) setSelectedReturnDate(returnDate);
    if (origin1) setTraveler1Origin(origin1);
    if (origin2) setTraveler2Origin(origin2);
    setActiveTab('matches');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMilan = destinationCity === 'milano';
  const isGuidePersonalized = isDestinationChosen && Boolean(traveler1Origin.trim() && traveler2Origin.trim());
  const shortDestLabel = (destinationName || (destinationCity === 'roma' ? 'Rome' : 'Milan')).split(' (')[0];

  return (
    <div className="min-h-screen bg-[#FAF7F2] bg-[radial-gradient(ellipse_100%_50%_at_50%_0%,rgba(245,158,11,0.06),rgba(250,247,242,0)_70%)] flex flex-col selection:bg-amber-200">
      {/* Header */}
      <Header
        destinationCity={destinationCity}
        destinationName={destinationName}
        traveler1Origin={traveler1Origin}
        traveler2Origin={traveler2Origin}
        isDestinationChosen={isDestinationChosen}
        onSelectDestination={(city) => {
          setIsDestinationChosen(true);
          setDestinationCity(city);
          setDestinationName(city === 'roma' ? 'Rome' : 'Milan');
        }}
        onOpenAIConcierge={() => {
          setConciergeInitialPrompt('');
          setIsConciergeOpen(true);
        }}
        onOpenApiKeySettings={() => setIsGeminiApiKeyModalOpen(true)}
        hasGeminiApiKey={Boolean(geminiApiKey)}
        onOpenLiveSearch={() => setIsLiveSearchOpen(true)}
        onOpenTipModal={() => setIsTipModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-10">
        {/* ======================= TAB 0: HOME / TRIP REQUEST ======================= */}
        {activeTab === 'home' && (
          <HomePage
            onStartPlanning={handleStartPlanning}
            onOpenConciergeWithPrompt={handleOpenConciergeWithPrompt}
            onOpenLiveSearch={() => setIsLiveSearchOpen(true)}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            currentTraveler1Origin={traveler1Origin}
            currentTraveler2Origin={traveler2Origin}
            currentDestinationName={isDestinationChosen ? destinationName : ''}
            onSetTravelerOrigins={(t1, t2) => {
              setTraveler1Origin(t1);
              setTraveler2Origin(t2);
            }}
            onUpdateDestination={(destText, cityKey) => {
              if (!destText.trim() || !cityKey) {
                setIsDestinationChosen(false);
                setDestinationName('');
              } else {
                setIsDestinationChosen(true);
                setDestinationName(destText);
                setDestinationCity(cityKey);
              }
            }}
            onOpenTipModal={() => setIsTipModalOpen(true)}
          />
        )}

        {/* ======================= TAB 1: OUTBOUND MATCHES ======================= */}
        {activeTab === 'matches' && (
          !isDestinationChosen ? (
            <BlankDestinationPrompt
              tabType="outbound"
              onGoToHome={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onQuickStartMilan={() => {
                const p = getProposedBestDatesForDestination('milano');
                handleStartPlanning('milano', p.outboundDate, p.returnDate, 'Toulouse (TLS)', 'Zagreb (ZAG)', 'Milan (Milano)');
              }}
              onQuickStartRome={() => {
                const p = getProposedBestDatesForDestination('roma');
                handleStartPlanning('roma', p.outboundDate, p.returnDate, 'Toulouse (TLS)', 'Zagreb (ZAG)', 'Rome (Roma)');
              }}
            />
          ) : (
          <div className="space-y-6">
            {/* Seamless Sub-Navigation between Outbound & Return Flights */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
              <div className="inline-flex p-1 bg-white/80 backdrop-blur-md rounded-full border border-stone-200/80 shadow-2xs">
                <button
                  onClick={() => {
                    setActiveTab('matches');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#2F241C] text-amber-200 shadow-xs cursor-pointer"
                >
                  <PlaneLanding className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Step 1: Outbound Flights</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('return');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer"
                >
                  <PlaneTakeoff className="w-3.5 h-3.5 text-orange-500" />
                  <span>Step 2: Return Flights</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs text-stone-500 hover:text-stone-800 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <span>← Change Cities</span>
              </button>
            </div>

            {/* Trip Summary Section with Side-by-Side Dates Quick Verification */}
            <TripSummary
              destinationCity={destinationCity}
              destinationName={destinationName}
              traveler1Origin={traveler1Origin}
              traveler2Origin={traveler2Origin}
              selectedOutboundDate={selectedOutboundDate}
              selectedReturnDate={selectedReturnDate}
              onGoToReturnTab={() => {
                setActiveTab('return');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoToHomeTab={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              outboundMatch={currentOutboundMatch}
              returnMatch={currentReturnMatch}
              onSelectQuickReturnDate={(date) => {
                setSelectedReturnDate(date);
              }}
            />

            {/* Rendezvous Calendar Matrix (Outbound) */}
            <RendezvousMatrix
              destinationCity={destinationCity}
              destinationName={destinationName}
              direction="outbound"
              matches={allOutboundMatches}
              selectedDate={selectedOutboundDate}
              onSelectDate={setSelectedOutboundDate}
              filterDirectOnly={filterDirectOnly}
              onToggleDirectOnly={() => setFilterDirectOnly(!filterDirectOnly)}
              filterMaxGap60={filterMaxGap60}
              onToggleMaxGap60={() => setFilterMaxGap60(!filterMaxGap60)}
              filterWeekendOnly={filterWeekendOnly}
              onToggleWeekendOnly={() => setFilterWeekendOnly(!filterWeekendOnly)}
            />

            {/* How Booking Works & Intermediary Role Explainer */}
            <BookingRoleExplainer />

            {/* Currently Selected Outbound Match Card */}
            {currentOutboundMatch && (
              <SynchronizedFlightCard
                match={currentOutboundMatch}
                onShare={handleShare}
                onOpenConciergeWithContext={handleOpenConciergeWithPrompt}
              />
            )}

            {/* Quick Link to Return Page */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shrink-0">
                  <PlaneTakeoff className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-950 font-serif">
                    Ready to check return flights back to Toulouse &amp; Zagreb?
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Coordinate your trip back home with synchronized return flights from {isMilan ? 'Milan (Bergamo & Malpensa)' : 'Rome (Fiumicino)'}.
                  </p>
                </div>
              </div>
              <button
                id="cta-go-to-return-btn"
                onClick={() => {
                  setActiveTab('return');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-[#2F241C] hover:bg-[#3D2E24] text-amber-200 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shrink-0 shadow-xs border border-[#523E30]"
              >
                <span>Go to Return Flights (Page 2)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Google AdSense Display Unit */}
            <GoogleAdSenseBanner
              slot="5432109876"
              format="horizontal"
              onOpenAdSenseGuide={() => setIsAdvertiseOpen(true)}
            />

            {/* Top Synchronized Dates Quick Picks */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-stone-900 font-serif mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Featured Best-Synchronized Outbound Dates for {isMilan ? 'Milan' : 'Rome'}
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                Direct flights from both Zagreb and Toulouse with the closest landing times:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allOutboundMatches
                  .filter((m) => m.destinationCity === destinationCity && m.bothDirect)
                  .slice(0, 6)
                  .map((m) => (
                    <button
                      key={m.id}
                      id={`featured-outbound-date-${m.date}`}
                      onClick={() => {
                        setSelectedOutboundDate(m.date);
                        window.scrollTo({ top: 220, behavior: 'smooth' });
                      }}
                      className="p-4 rounded-xl border border-stone-200 hover:border-amber-400 bg-stone-50/50 hover:bg-amber-50/40 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-stone-900 font-serif">
                          {new Date(m.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {formatMinutesDiff(m.arrivalDifferenceMinutes)} gap
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-stone-600 space-y-1">
                        <div>Zagreb: <strong>{m.zagrebFlight.airline}</strong> ({m.zagrebFlight.departureTime} → {m.zagrebFlight.arrivalTime})</div>
                        <div>Toulouse: <strong>{m.toulouseFlight.airline}</strong> ({m.toulouseFlight.departureTime} → {m.toulouseFlight.arrivalTime})</div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                        <span className="text-stone-500 font-medium">Both Direct</span>
                        <span className="font-extrabold text-amber-700">€{m.totalCombinedPriceEur} total</span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
          )
        )}

        {/* ======================= TAB 2: RETURN MATCHES ======================= */}
        {activeTab === 'return' && (
          !isDestinationChosen ? (
            <BlankDestinationPrompt
              tabType="return"
              onGoToHome={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onQuickStartMilan={() => {
                const p = getProposedBestDatesForDestination('milano');
                handleStartPlanning('milano', p.outboundDate, p.returnDate, 'Toulouse (TLS)', 'Zagreb (ZAG)', 'Milan (Milano)');
                setActiveTab('return');
              }}
              onQuickStartRome={() => {
                const p = getProposedBestDatesForDestination('roma');
                handleStartPlanning('roma', p.outboundDate, p.returnDate, 'Toulouse (TLS)', 'Zagreb (ZAG)', 'Rome (Roma)');
                setActiveTab('return');
              }}
            />
          ) : (
          <div className="space-y-6">
            {/* Seamless Sub-Navigation between Outbound & Return Flights */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
              <div className="inline-flex p-1 bg-white/80 backdrop-blur-md rounded-full border border-stone-200/80 shadow-2xs">
                <button
                  onClick={() => {
                    setActiveTab('matches');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer"
                >
                  <PlaneLanding className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Step 1: Outbound Flights</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('return');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#2F241C] text-amber-200 shadow-xs cursor-pointer"
                >
                  <PlaneTakeoff className="w-3.5 h-3.5 text-orange-400" />
                  <span>Step 2: Return Flights</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs text-stone-500 hover:text-stone-800 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <span>← Change Cities</span>
              </button>
            </div>

            {/* Trip Summary Section with Side-by-Side Dates Quick Verification */}
            <TripSummary
              destinationCity={destinationCity}
              destinationName={destinationName}
              traveler1Origin={traveler1Origin}
              traveler2Origin={traveler2Origin}
              selectedOutboundDate={selectedOutboundDate}
              selectedReturnDate={selectedReturnDate}
              activeDirection="return"
              onGoToOutboundTab={() => {
                setActiveTab('matches');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoToHomeTab={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              outboundMatch={currentOutboundMatch}
              returnMatch={currentReturnMatch}
              onSelectQuickReturnDate={(date) => {
                setSelectedReturnDate(date);
              }}
            />

            {/* Rendezvous Calendar Matrix (Return) */}
            <RendezvousMatrix
              destinationCity={destinationCity}
              destinationName={destinationName}
              direction="return"
              matches={allReturnMatches}
              selectedDate={selectedReturnDate}
              onSelectDate={setSelectedReturnDate}
              filterDirectOnly={returnFilterDirectOnly}
              onToggleDirectOnly={() => setReturnFilterDirectOnly(!returnFilterDirectOnly)}
              filterMaxGap60={returnFilterMaxGap60}
              onToggleMaxGap60={() => setReturnFilterMaxGap60(!returnFilterMaxGap60)}
              filterWeekendOnly={returnFilterWeekendOnly}
              onToggleWeekendOnly={() => setReturnFilterWeekendOnly(!returnFilterWeekendOnly)}
            />

            {/* How Booking Works & Intermediary Role Explainer */}
            <BookingRoleExplainer />

            {/* Currently Selected Return Match Card */}
            {currentReturnMatch && (
              <ReturnFlightCard
                match={currentReturnMatch}
                onShare={handleShare}
                onOpenConciergeWithContext={handleOpenConciergeWithPrompt}
              />
            )}

            {/* Google AdSense Display Unit */}
            <GoogleAdSenseBanner
              slot="9876543210"
              format="horizontal"
              onOpenAdSenseGuide={() => setIsAdvertiseOpen(true)}
            />

            {/* Top Synchronized Return Dates Quick Picks */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-stone-900 font-serif mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Featured Best-Synchronized Return Dates from {isMilan ? 'Milan' : 'Rome'}
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                Direct flights returning to both Zagreb and Toulouse with coordinated departure times:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allReturnMatches
                  .filter((m) => m.destinationCity === destinationCity && m.bothDirect)
                  .slice(0, 6)
                  .map((m) => (
                    <button
                      key={m.id}
                      id={`featured-return-date-${m.date}`}
                      onClick={() => {
                        setSelectedReturnDate(m.date);
                        window.scrollTo({ top: 220, behavior: 'smooth' });
                      }}
                      className="p-4 rounded-xl border border-stone-200 hover:border-amber-400 bg-stone-50/50 hover:bg-amber-50/40 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-stone-900 font-serif">
                          {new Date(m.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {formatMinutesDiff(m.arrivalDifferenceMinutes)} dep gap
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-stone-600 space-y-1">
                        <div>To Zagreb: <strong>{m.zagrebFlight.airline}</strong> ({m.zagrebFlight.departureTime} from {m.zagrebFlight.originAirport})</div>
                        <div>To Toulouse: <strong>{m.toulouseFlight.airline}</strong> ({m.toulouseFlight.departureTime} from {m.toulouseFlight.originAirport})</div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                        <span className="text-stone-500 font-medium">Both Direct</span>
                        <span className="font-extrabold text-amber-700">€{m.totalCombinedPriceEur} total</span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
          )
        )}

        {/* ======================= TAB 3: DESTINATION COMPARISON ======================= */}
        {activeTab === 'compare' && (
          !isGuidePersonalized ? (
            <BlankDestinationPrompt
              tabType="guide"
              onGoToHome={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
                <div className="inline-flex p-1 bg-white/80 backdrop-blur-md rounded-full border border-stone-200/80 shadow-2xs">
                  <button
                    onClick={() => setActiveTab('compare')}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#2F241C] text-amber-200 shadow-xs cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5 text-sky-400" />
                    <span>Personalized {shortDestLabel} Guide &amp; Comparison</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('airports')}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-violet-500" />
                    <span>{shortDestLabel} Airports &amp; Meeting Points</span>
                  </button>
                </div>
              </div>

              <DestinationComparison
                currentDestination={destinationCity}
                destinationName={destinationName}
                traveler1Origin={traveler1Origin}
                traveler2Origin={traveler2Origin}
                selectedOutboundDate={selectedOutboundDate}
                selectedReturnDate={selectedReturnDate}
                currentOutboundMatch={currentOutboundMatch}
                onSelectDestination={(city, customName) => {
                  setDestinationCity(city);
                  if (customName) setDestinationName(customName);
                  setActiveTab('matches');
                }}
                onOpenConciergeWithContext={handleOpenConciergeWithPrompt}
                onGoToAirportsTab={() => {
                  setActiveTab('airports');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )
        )}

        {/* ======================= TAB 4: AIRPORT & TRANSIT GUIDE ======================= */}
        {activeTab === 'airports' && (
          !isGuidePersonalized ? (
            <BlankDestinationPrompt
              tabType="guide"
              onGoToHome={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
                <div className="inline-flex p-1 bg-white/80 backdrop-blur-md rounded-full border border-stone-200/80 shadow-2xs">
                  <button
                    onClick={() => setActiveTab('compare')}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5 text-sky-500" />
                    <span>Personalized {shortDestLabel} Guide &amp; Comparison</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('airports')}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#2F241C] text-amber-200 shadow-xs cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-violet-400" />
                    <span>{shortDestLabel} Airports &amp; Meeting Points</span>
                  </button>
                </div>
              </div>

              <AirportTransitGuide
                destinationCity={destinationCity}
                destinationName={destinationName}
                traveler1Origin={traveler1Origin}
                traveler2Origin={traveler2Origin}
                currentOutboundMatch={currentOutboundMatch}
                onSelectDestination={(city, customName) => {
                  setDestinationCity(city);
                  if (customName) setDestinationName(customName);
                }}
              />
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-8 pb-28 sm:pb-24 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <button
              id="footer-home-btn"
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-stone-900 transition-colors cursor-pointer font-semibold"
            >
              Home &amp; Trip Request
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className="hover:text-stone-900 transition-colors cursor-pointer font-semibold"
            >
              Outbound Flights
            </button>
            <button
              onClick={() => setActiveTab('return')}
              className="hover:text-stone-900 transition-colors cursor-pointer font-semibold"
            >
              Return Flights
            </button>
            <button
              onClick={() => handleOpenConciergeWithPrompt("What's the best advice for a mother-daughter trip to Italy?")}
              className="hover:text-stone-900 transition-colors cursor-pointer font-semibold"
            >
              Travel Advice
            </button>
            <button
              onClick={() => setIsLiveSearchOpen(true)}
              className="hover:text-stone-900 transition-colors cursor-pointer font-semibold"
            >
              Live Search
            </button>
            <button
              id="footer-tip-creator-btn"
              onClick={() => setIsTipModalOpen(true)}
              className="inline-flex items-center gap-1 font-bold text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-600" />
              <span>Buy Me a Coffee</span>
            </button>
            <button
              id="footer-advertise-btn"
              onClick={() => setIsAdvertiseOpen(true)}
              className="inline-flex items-center gap-1 font-bold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <span>📢 Sponsor / Advertise</span>
            </button>
          </div>
          
          <div className="text-stone-400 text-[10px] sm:text-xs">
            &copy; Rendezvous Synchronizer 2026
          </div>
        </div>
      </footer>

      {/* Discreet Bottom Ad / Sponsor Banner */}
      <DiscreetAdBanner 
        onOpenTipModal={() => setIsTipModalOpen(true)} 
        onOpenAdvertiseModal={() => setIsAdvertiseOpen(true)}
      />

      {/* Tip the Creator Modal */}
      <TipCreatorModal
        isOpen={isTipModalOpen}
        onClose={() => setIsTipModalOpen(false)}
        creatorName="Nikolina"
      />

      {/* Advertise & Sponsor Modal */}
      <AdvertiseModal
        isOpen={isAdvertiseOpen}
        onClose={() => setIsAdvertiseOpen(false)}
        creatorEmail="NikolinaBabok83@gmail.com"
      />

      {/* Floating Action Button for AI Concierge */}
      <button
        id="floating-ask-concierge-btn"
        onClick={() => setIsConciergeOpen(true)}
        className="fixed bottom-[96px] sm:bottom-6 right-4 z-40 flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold shadow-lg shadow-amber-900/20 transition-transform hover:scale-105 active:scale-95 cursor-pointer pb-[calc(12px+env(safe-area-inset-bottom))] sm:pb-3.5"
        title="Ask AI Travel Concierge"
      >
        <Compass className="w-5 h-5 animate-pulse" />
        <span className="text-sm">Ask AI Concierge</span>
      </button>

      {/* Modals */}
      <AIConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        destinationCity={destinationCity}
        destinationName={isDestinationChosen ? destinationName : ''}
        traveler1Origin={traveler1Origin}
        traveler2Origin={traveler2Origin}
        selectedDate={activeTab === 'return' ? selectedReturnDate : selectedOutboundDate}
        initialPrompt={conciergeInitialPrompt}
      />

      <LiveFlightSearchModal
        isOpen={isLiveSearchOpen}
        onClose={() => setIsLiveSearchOpen(false)}
        destinationCity={destinationCity}
        selectedDate={activeTab === 'return' ? selectedReturnDate : selectedOutboundDate}
      />

      <GeminiApiKeyModal
        isOpen={isGeminiApiKeyModalOpen}
        apiKey={geminiApiKey}
        onClose={() => setIsGeminiApiKeyModalOpen(false)}
        onSave={(apiKey) => {
          saveGeminiApiKey(apiKey);
          setGeminiApiKey(apiKey);
          setIsGeminiApiKeyModalOpen(false);
        }}
        onRemove={() => {
          removeGeminiApiKey();
          setGeminiApiKey('');
          setIsGeminiApiKeyModalOpen(false);
        }}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        match={sharedMatch}
      />
    </div>
  );
}
