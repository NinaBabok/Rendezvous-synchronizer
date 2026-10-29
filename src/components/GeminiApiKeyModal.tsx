import React, { useEffect, useState } from 'react';
import { ExternalLink, Eye, EyeOff, KeyRound, Trash2, X } from 'lucide-react';

interface GeminiApiKeyModalProps {
  isOpen: boolean;
  apiKey: string;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  onRemove: () => void;
}

export const GeminiApiKeyModal: React.FC<GeminiApiKeyModalProps> = ({
  isOpen,
  apiKey,
  onClose,
  onSave,
  onRemove,
}) => {
  const [draft, setDraft] = useState(apiKey);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDraft(apiKey);
      setIsVisible(false);
    }
  }, [apiKey, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="gemini-api-key-title"
        className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden"
      >
        <header className="flex items-start justify-between gap-4 p-5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </span>
            <div>
              <h2 id="gemini-api-key-title" className="text-base font-bold text-stone-900">
                Gemini API key
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Use your own Google AI Studio key
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close API key settings"
            className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave(draft.trim());
          }}
          className="p-5 space-y-4"
        >
          <label htmlFor="gemini-api-key-input" className="block text-xs font-bold text-stone-700">
            API key
          </label>
          <div className="flex items-center gap-2 -mt-3">
            <input
              id="gemini-api-key-input"
              type={isVisible ? 'text' : 'password'}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              placeholder="Paste your Gemini API key"
              className="min-w-0 flex-1 px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={() => setIsVisible((visible) => !visible)}
              aria-label={isVisible ? 'Hide API key' : 'Show API key'}
              title={isVisible ? 'Hide API key' : 'Show API key'}
              className="p-2.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer"
            >
              {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-xs leading-relaxed text-stone-600">
            The key is saved in this browser and sent directly to Google when you use an AI feature.
            It is not sent to this app's server.
          </p>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950"
          >
            Get a key from Google AI Studio
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center justify-between gap-3 pt-2">
            {apiKey ? (
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove key
              </button>
            ) : <span />}
            <button
              type="submit"
              disabled={!draft.trim()}
              className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white text-xs font-bold cursor-pointer disabled:cursor-not-allowed"
            >
              Save key
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
