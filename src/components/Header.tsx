import React from 'react';
import { Sparkles, MapPin, Compass, PlaneTakeoff, PlaneLanding, Home, Coffee, KeyRound } from 'lucide-react';
import { DestinationCity } from '../types';
import { AnimatedCountryText } from './AnimatedCountryText';

export type AppTab = 'home' | 'matches' | 'return' | 'compare' | 'airports';

interface HeaderProps {
  destinationCity: DestinationCity;
  destinationName?: string;
  traveler1Origin?: string;
  traveler2Origin?: string;
  isDestinationChosen?: boolean;
  onSelectDestination: (city: DestinationCity) => void;
  onOpenAIConcierge: () => void;
  onOpenApiKeySettings: () => void;
  hasGeminiApiKey: boolean;
  onOpenLiveSearch: () => void;
  onOpenTipModal?: () => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  destinationCity,
  destinationName,
  traveler1Origin,
  traveler2Origin,
  isDestinationChosen = false,
  onSelectDestination,
  onOpenAIConcierge,
  onOpenApiKeySettings,
  hasGeminiApiKey,
  onOpenLiveSearch,
  onOpenTipModal,
  activeTab,
  setActiveTab,
}) => {
  const isMatchesActive = activeTab === 'matches' || activeTab === 'return';
  const isGuideActive = activeTab === 'compare' || activeTab === 'airports';

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-amber-950/5 transition-all">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 flex-wrap lg:flex-nowrap">
          
          {/* Brand Logo & Title - Positioned close to the left */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button 
              id="header-logo-home-btn"
              onClick={() => setActiveTab('home')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-[#F5ECE2] to-[#EBDCCF] text-orange-600 border border-[#DDC6B3] flex items-center justify-center font-bold text-base sm:text-lg shadow-xs hover:border-orange-400 hover:shadow-sm transition-all cursor-pointer ring-1 ring-orange-400/25 shrink-0"
              title="Go to Home & Trip Builder"
            >
              ✈️
            </button>
            <button
              id="header-title-home-btn"
              onClick={() => setActiveTab('home')}
              className="text-left cursor-pointer group shrink-0"
            >
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-stone-900 tracking-tight font-serif flex items-center gap-1.5 group-hover:text-amber-700 transition-colors whitespace-nowrap">
                <span className="shrink-0">Meet in</span>
                <span className="shrink-0 inline-flex items-center">
                  <AnimatedCountryText theme="gold" showFlag={true} />
                </span>
                <span className="text-stone-400 font-sans text-xs sm:text-sm lg:text-base font-normal hidden sm:inline whitespace-nowrap">
                  | Flight Rendezvous
                </span>
              </h1>
            </button>
          </div>

          {/* 3 Floating Navigation Buttons */}
          <nav 
            aria-label="Main Navigation"
            className="flex items-center gap-1 p-1 bg-white/85 backdrop-blur-md rounded-full border border-stone-200/80 shadow-xs ring-1 ring-stone-900/5 overflow-x-auto no-scrollbar shrink-0"
          >
            {/* Button 1: Plan Trip */}
            <button
              id="nav-btn-home"
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'home'
                  ? 'bg-[#2F241C] text-amber-200 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Plan Trip</span>
            </button>

            {/* Button 2: Flight Matches */}
            <button
              id="nav-btn-matches"
              onClick={() => {
                if (!isDestinationChosen && activeTab === 'home') {
                  setActiveTab('matches');
                } else {
                  setActiveTab(activeTab === 'return' ? 'return' : 'matches');
                }
              }}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isMatchesActive
                  ? 'bg-[#2F241C] text-amber-200 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
              }`}
            >
              <PlaneLanding className="w-3.5 h-3.5" />
              <span>Flight Matches</span>
              {isMatchesActive && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/25 text-amber-300 font-medium">
                  {activeTab === 'return' ? 'Return' : 'Outbound'}
                </span>
              )}
            </button>

            {/* Button 3: Travel Guide */}
            <button
              id="nav-btn-guide"
              onClick={() => setActiveTab(activeTab === 'airports' ? 'airports' : 'compare')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isGuideActive
                  ? 'bg-[#2F241C] text-amber-200 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Travel Guide</span>
              {isDestinationChosen && Boolean(traveler1Origin?.trim() && traveler2Origin?.trim()) && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  isGuideActive
                    ? 'bg-amber-500/25 text-amber-300'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {(destinationName || (destinationCity === 'roma' ? 'Rome' : 'Milan')).split(' (')[0]}
                </span>
              )}
            </button>
          </nav>

          {/* Right Floating Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="header-gemini-api-key-btn"
              onClick={onOpenApiKeySettings}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap ${
                hasGeminiApiKey
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                  : 'bg-white hover:bg-amber-50 text-stone-700 border-stone-300'
              }`}
              title="Manage your Gemini API key"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>API Key</span>
            </button>
            <button
              id="header-ai-concierge-btn"
              onClick={onOpenAIConcierge}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300/60 text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
              title="Ask AI Concierge for flight advice and tips"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>AI Concierge</span>
            </button>

            {onOpenTipModal && (
              <button
                onClick={onOpenTipModal}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/80 text-xs font-semibold transition-all shadow-xs cursor-pointer whitespace-nowrap"
                title="Support this independent project"
              >
                <Coffee className="w-3.5 h-3.5 text-amber-700" />
                <span>Tip</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
