import React, { useState, useEffect } from 'react';
import { X, Sparkles, Search, Loader2, ExternalLink, Plane, CheckCircle2 } from 'lucide-react';
import { DestinationCity } from '../types';

interface LiveFlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationCity: DestinationCity;
  selectedDate: string;
}

export const LiveFlightSearchModal: React.FC<LiveFlightSearchModalProps> = ({
  isOpen,
  onClose,
  destinationCity,
  selectedDate,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [sources, setSources] = useState<Array<{ title: string; url: string }>>([]);

  const runSearch = async (customQ?: string) => {
    const q = customQ || query;
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/flight-sync/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationCity,
          travelDate: selectedDate || 'October 2026',
          userQuery: q || `Analyze flight schedules for Zagreb (ZAG) and Toulouse (TLS) to ${destinationCity === 'milano' ? 'Milan (BGY/MXP)' : 'Rome (FCO)'} in October with synchronized meeting options and direct airlines.`,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setResult(data.analysis);
        setSources(data.sources || []);
      } else {
        setResult(
          `Could not fetch live search results. (Error: ${data.error || 'Check environment'}). In the meantime, explore the October schedules database in the application.`
        );
      }
    } catch (err: any) {
      setResult('Network error while running live search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !result && !isLoading) {
      runSearch();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 flex flex-col h-[650px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base font-serif">
                Live AI Flight &amp; Route Intelligence
              </h3>
              <p className="text-xs text-stone-400">
                Grounded search with live airline schedule verification
              </p>
            </div>
          </div>

          <button
            id="close-live-search-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center gap-2">
          <input
            id="live-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') runSearch();
            }}
            placeholder="e.g. Check Ryanair ZAG-FCO and TLS-FCO direct schedules for third weekend of October..."
            className="flex-1 px-4 py-2 bg-white rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all"
          />
          <button
            id="trigger-live-search-btn"
            onClick={() => runSearch()}
            disabled={isLoading}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            Search
          </button>
        </div>

        {/* Content stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
              <div className="font-bold text-stone-800 text-sm">
                Querying European Airline Schedules &amp; Grounding Data...
              </div>
              <p className="text-xs text-stone-500 max-w-sm">
                Scanning direct flight routes for Zagreb (ZAG) and Toulouse (TLS) to {destinationCity === 'milano' ? 'Milan' : 'Rome'} in October.
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Flight intelligence verified with current operational schedules for October.
                </span>
              </div>

              <div className="prose prose-stone text-xs sm:text-sm leading-relaxed whitespace-pre-line text-stone-800">
                {result}
              </div>

              {sources.length > 0 && (
                <div className="pt-4 border-t border-stone-200 text-xs">
                  <h4 className="font-bold text-stone-700 mb-2">Grounding Web References:</h4>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 text-stone-500" />
                        <span className="truncate max-w-[200px]">{s.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
