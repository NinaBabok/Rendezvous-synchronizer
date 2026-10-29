import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface CountryItem {
  name: string;
  flag: string;
  accentColor?: string;
}

export const COUNTRIES: CountryItem[] = [
  { name: 'Italy', flag: '🇮🇹', accentColor: 'text-amber-600' },
  { name: 'Spain', flag: '🇪🇸', accentColor: 'text-rose-600' },
  { name: 'France', flag: '🇫🇷', accentColor: 'text-sky-600' },
  { name: 'Greece', flag: '🇬🇷', accentColor: 'text-blue-600' },
  { name: 'Portugal', flag: '🇵🇹', accentColor: 'text-emerald-600' },
  { name: 'Croatia', flag: '🇭🇷', accentColor: 'text-red-600' },
  { name: 'Japan', flag: '🇯🇵', accentColor: 'text-pink-600' },
  { name: 'Austria', flag: '🇦🇹', accentColor: 'text-amber-700' },
  { name: 'Germany', flag: '🇩🇪', accentColor: 'text-orange-600' },
  { name: 'Switzerland', flag: '🇨🇭', accentColor: 'text-rose-700' },
  { name: 'The World', flag: '🌍', accentColor: 'text-indigo-600' },
];

interface AnimatedCountryTextProps {
  intervalMs?: number;
  className?: string;
  showFlag?: boolean;
  prefix?: string;
  suffix?: string;
  theme?: 'dark' | 'light' | 'gold';
}

// Global synchronized index so all AnimatedCountryText components across the entire app
// (e.g. Header and HomePage hero) always show the EXACT same country at the exact same time
let globalCountryIndex = 0;
const countryListeners = new Set<(idx: number) => void>();
let globalRotationTimer: ReturnType<typeof setInterval> | null = null;
const GLOBAL_ROTATION_INTERVAL_MS = 2200;

function startGlobalRotation() {
  if (!globalRotationTimer) {
    globalRotationTimer = setInterval(() => {
      globalCountryIndex = (globalCountryIndex + 1) % COUNTRIES.length;
      countryListeners.forEach((listener) => listener(globalCountryIndex));
    }, GLOBAL_ROTATION_INTERVAL_MS);
  }
}

function stopGlobalRotation() {
  if (countryListeners.size === 0 && globalRotationTimer) {
    clearInterval(globalRotationTimer);
    globalRotationTimer = null;
  }
}

export function useSynchronizedCountryIndex(): number {
  const [index, setIndex] = useState(globalCountryIndex);

  useEffect(() => {
    countryListeners.add(setIndex);
    startGlobalRotation();

    return () => {
      countryListeners.delete(setIndex);
      if (countryListeners.size === 0) {
        stopGlobalRotation();
      }
    };
  }, []);

  return index;
}

export const AnimatedCountryText: React.FC<AnimatedCountryTextProps> = ({
  intervalMs: _intervalMs,
  className = '',
  showFlag = true,
  prefix = '',
  suffix = '',
  theme = 'light',
}) => {
  const currentIndex = useSynchronizedCountryIndex();
  const currentCountry = COUNTRIES[currentIndex];

  if (!currentCountry) return null;

  const getThemeClass = () => {
    if (theme === 'dark') {
      return 'text-amber-400 font-bold';
    }
    if (theme === 'gold') {
      return 'text-amber-600 font-bold';
    }
    return currentCountry.accentColor || 'text-amber-600';
  };

  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap ${className}`}>
      {prefix && <span>{prefix}</span>}
      <span className="relative inline-flex items-center overflow-hidden h-[1.35em] align-middle px-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentCountry.name}
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`inline-flex items-center gap-1.5 ${getThemeClass()}`}
          >
            <span>{currentCountry.name}</span>
            {showFlag && <span className="text-[0.9em] leading-none select-none">{currentCountry.flag}</span>}
          </motion.span>
        </AnimatePresence>
      </span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
};
