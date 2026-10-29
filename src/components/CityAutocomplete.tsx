import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Plane, Sparkles, Check, X, ChevronDown } from 'lucide-react';
import { CityItem, searchCities } from '../data/cities';

interface CityAutocompleteProps {
  id: string;
  value: string;
  onChange: (value: string, cityItem?: CityItem) => void;
  placeholder?: string;
  label: string;
  icon?: React.ReactNode;
  datalistId?: string;
  className?: string;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  id,
  value,
  onChange,
  placeholder = 'Type a city name...',
  label,
  icon,
  datalistId,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search filtered results
  const matches = searchCities(value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCity = (city: CityItem) => {
    const displayValue = city.airportCodes.length === 1 
      ? `${city.name} (${city.airportCodes[0]})`
      : city.name;
    onChange(displayValue, city);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < matches.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : matches.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < matches.length) {
        const highlightedMatch = matches[highlightedIndex];
        if (highlightedMatch) handleSelectCity(highlightedMatch);
      } else if (matches.length > 0) {
        const firstMatch = matches[0];
        if (firstMatch) handleSelectCity(firstMatch);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <label 
        htmlFor={id} 
        className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5 flex items-center justify-between"
      >
        <span className="flex items-center gap-1.5">
          {icon || <MapPin className="w-3.5 h-3.5 text-orange-600" />}
          {label}
        </span>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="text-[10px] lowercase text-stone-400 hover:text-stone-700 cursor-pointer flex items-center gap-0.5"
          >
            <X className="w-3 h-3" /> clear
          </button>
        )}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          autoComplete="off"
          list={datalistId}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-[#FAF7F2] hover:bg-white focus:bg-white text-stone-900 placeholder-stone-400 border border-stone-300/80 focus:border-orange-500 focus:ring-2 focus:ring-orange-400/20 rounded-xl px-3.5 py-2.5 pr-9 text-sm font-medium outline-none transition-all"
        />

        <button
          type="button"
          tabIndex={-1}
          onClick={() => {
            setIsOpen((prev) => !prev);
            inputRef.current?.focus();
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer transition-colors"
          aria-label="Toggle city dropdown menu"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-orange-600' : ''}`} />
        </button>
      </div>

      {/* Optional Native Datalist for fallback and accessibility */}
      {datalistId && (
        <datalist id={datalistId}>
          {matches.map((c) => (
            <option key={c.id} value={c.name}>
              {c.country} ({c.airportCodes.join(', ')})
            </option>
          ))}
        </datalist>
      )}

      {/* Interactive Dropdown Menu */}
      {isOpen && (
        <div 
          id={`${id}-dropdown-menu`}
          className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-xl border border-stone-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 max-h-72 overflow-y-auto"
        >
          <div className="px-3 py-1.5 bg-stone-50 border-b border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-semibold">
            <span>
              {value ? `Matching destinations for "${value}":` : 'Suggested destinations:'}
            </span>
            <span>{matches.length} {matches.length === 1 ? 'city' : 'cities'}</span>
          </div>

          {matches.length === 0 ? (
            <div className="p-3 text-center text-xs text-stone-500">
              No matching cities found for &ldquo;{value}&rdquo;. You can still use this as a custom destination!
            </div>
          ) : (
            <ul className="py-1 divide-y divide-stone-50" role="listbox">
              {matches.map((city, idx) => {
                const isSelected = value.toLowerCase().includes(city.city.toLowerCase());
                const isHighlighted = idx === highlightedIndex;

                return (
                  <li
                    key={city.id}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => handleSelectCity(city)}
                    className={`px-3 py-2.5 cursor-pointer flex items-center justify-between gap-2 transition-colors ${
                      isHighlighted 
                        ? 'bg-orange-50/80 text-stone-900' 
                        : isSelected 
                          ? 'bg-amber-50/40 text-stone-900' 
                          : 'hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                        city.isSynchronizedHub 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {city.isSynchronizedHub ? (
                          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                        ) : (
                          <Plane className="w-3.5 h-3.5 text-stone-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-sm text-stone-900">
                            {city.name}
                          </span>
                          <span className="text-xs text-stone-500">
                            • {city.country}
                          </span>
                          {city.isSynchronizedHub && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                              Direct Synchronized Hub
                            </span>
                          )}
                        </div>
                        {city.description && (
                          <p className="text-[11px] text-stone-500 truncate max-w-xs sm:max-w-md mt-0.5">
                            {city.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center gap-1">
                        {city.airportCodes.map((code) => (
                          <span 
                            key={code} 
                            className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 font-mono text-[10px] font-bold border border-stone-200"
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-orange-600 shrink-0 ml-1" />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
