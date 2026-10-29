import React from 'react';
import { MapPin, ArrowRight, PlaneLanding, PlaneTakeoff, Compass, Users } from 'lucide-react';

interface BlankDestinationPromptProps {
  tabType: 'outbound' | 'return' | 'guide';
  onGoToHome: () => void;
  onQuickStartMilan?: () => void;
  onQuickStartRome?: () => void;
}

export const BlankDestinationPrompt: React.FC<BlankDestinationPromptProps> = ({
  tabType,
  onGoToHome,
}) => {
  const isOutbound = tabType === 'outbound';
  const isGuide = tabType === 'guide';

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 text-center animate-fadeIn">
      {/* Decorative Badge Icon */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200 border-2 border-amber-300/80 flex items-center justify-center shadow-md">
          {isGuide ? (
            <Compass className="w-10 h-10 text-orange-600" />
          ) : isOutbound ? (
            <PlaneLanding className="w-10 h-10 text-orange-600" />
          ) : (
            <PlaneTakeoff className="w-10 h-10 text-amber-600" />
          )}
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
          !
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
        {isGuide
          ? 'Your Personalized Travel Guide is Empty'
          : isOutbound
          ? 'No Meeting Destination Selected Yet'
          : 'No Return Destination Selected Yet'}
      </h2>
      
      <p className="mt-3 text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
        {isGuide ? (
          <>
            Select your <strong>two starting departure cities</strong> and your <strong>final meeting destination</strong> in the{' '}
            <strong className="text-stone-900 font-semibold">"Plan Trip"</strong> tab first. Once chosen, this guide will automatically personalize with airport transit instructions, meeting points, and local highlights for your exact route.
          </>
        ) : (
          <>
            To synchronize arrival schedules with minimal airport wait times, please first choose your starting departure cities and final meeting destination in the{' '}
            <strong className="text-stone-900 font-semibold">"Plan Trip"</strong> tab.
          </>
        )}
      </p>

      {/* What gets unlocked preview pills for Guide */}
      {isGuide && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-600">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone-200/90 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-orange-600" />
            Dual-Origin Terminal Meeting Points
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone-200/90 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            Airport-to-City Center Transit
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone-200/90 shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            Tailored Destination Insights
          </span>
        </div>
      )}

      {/* Primary Action Button */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          id="blank-prompt-go-home-btn"
          onClick={onGoToHome}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg ring-2 ring-orange-400/30"
        >
          <MapPin className="w-4 h-4" />
          <span>Go to Plan Trip &amp; Choose Destinations</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </div>
  );
};
