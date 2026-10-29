import React, { useState } from 'react';
import { 
  X, 
  Coffee, 
  Heart, 
  Sparkles, 
  Check, 
  CreditCard, 
  ExternalLink, 
  ShieldCheck, 
  Settings, 
  Share2,
  Lock,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TipCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName?: string;
}

interface TipTier {
  id: string;
  amount: number;
  label: string;
  emoji: string;
  description: string;
  popular?: boolean;
}

const TIP_TIERS: TipTier[] = [
  {
    id: 'espresso',
    amount: 2,
    label: 'Espresso',
    emoji: '☕',
    description: 'A quick Italian espresso to fuel code updates',
  },
  {
    id: 'cappuccino',
    amount: 5,
    label: 'Cappuccino & Cornetto',
    emoji: '🥐',
    description: 'The traveler favorite breakfast in Milan or Rome',
    popular: true,
  },
  {
    id: 'lunch',
    amount: 10,
    label: 'Pasta & Spritz',
    emoji: '🍝',
    description: 'Treat the developer to an authentic Italian lunch',
  },
  {
    id: 'patron',
    amount: 25,
    label: 'Rendezvous Champion',
    emoji: '✈️',
    description: 'Sponsor future routes, server hosting & new countries',
  },
];

export const TipCreatorModal: React.FC<TipCreatorModalProps> = ({
  isOpen,
  onClose,
  creatorName = 'Nikolina',
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('cappuccino');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorMessage, setDonorMessage] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bmac' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
  // Custom links that the creator can customize in settings
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [customBmacUrl, setCustomBmacUrl] = useState<string>('https://buymeacoffee.com/nikolinab');
  const [customPaypalUrl, setCustomPaypalUrl] = useState<string>('https://paypal.me/nikolinab');

  if (!isOpen) return null;

  const activeAmount = customAmount ? parseFloat(customAmount) || 0 : (TIP_TIERS.find(t => t.id === selectedTier)?.amount || 5);

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
    }, 1200);
  };

  const handleReset = () => {
    setIsCompleted(false);
    setCustomAmount('');
    setDonorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration banner */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner">
              ☕
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider text-amber-100">
                <Heart className="w-3 h-3 text-rose-300 fill-rose-300" />
                Support the Creator
              </div>
              <h2 className="text-xl font-bold font-serif text-white mt-0.5">
                Buy {creatorName} a Coffee
              </h2>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {!isCompleted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {/* Personal Note */}
                <div className="p-4 rounded-2xl bg-[#FAF5EE] border border-[#E8DACB] text-xs text-stone-700 leading-relaxed">
                  <p className="font-semibold text-amber-950 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    Built with love for traveling together
                  </p>
                  <p>
                    I created this tool to help loved ones, family, and friends traveling from different cities coordinate their arrival and return flights effortlessly. If this app saved you hours of stressful searching, a small tip keeps the servers online and new destinations coming!
                  </p>
                </div>

                {/* Tier Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                    Select a Tip Amount
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {TIP_TIERS.map((tier) => {
                      const isSelected = selectedTier === tier.id && !customAmount;
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => {
                            setSelectedTier(tier.id);
                            setCustomAmount('');
                          }}
                          className={`relative p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                            isSelected
                              ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white border-orange-600 ring-2 ring-orange-400 font-bold shadow-sm'
                              : 'bg-[#FAF7F2] hover:bg-[#F5ECE2] text-stone-700 border-stone-200'
                          }`}
                        >
                          {tier.popular && (
                            <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-[#2F241C] text-amber-200 text-[9px] font-extrabold uppercase tracking-wider shadow-xs border border-[#523E30]">
                              Popular
                            </span>
                          )}
                          <span className="text-xl mb-1">{tier.emoji}</span>
                          <span className="text-sm font-extrabold">€{tier.amount}</span>
                          <span className="text-[10px] opacity-80 truncate max-w-full">{tier.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Amount Input */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-semibold text-xs">
                        €
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="Or enter custom amount..."
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full pl-7 pr-3 py-2 bg-stone-50 hover:bg-stone-100/80 focus:bg-white text-xs border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Message & Donor Info */}
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your name or nickname (optional)"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 hover:bg-stone-100/80 focus:bg-white text-xs border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <textarea
                    rows={2}
                    placeholder="Leave a short note or tell us about your trip (optional)..."
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 hover:bg-stone-100/80 focus:bg-white text-xs border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                </div>

                {/* Payment Option Tabs */}
                <div>
                  <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-semibold text-stone-600 mb-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'card' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'hover:text-stone-900'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                      <span>Card / Pay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bmac')}
                      className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'bmac' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'hover:text-stone-900'
                      }`}
                    >
                      <Coffee className="w-3.5 h-3.5 text-amber-600" />
                      <span>BuyMeACoffee</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'paypal' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'hover:text-stone-900'
                      }`}
                    >
                      <span className="font-bold text-blue-600">P</span>
                      <span>PayPal</span>
                    </button>
                  </div>

                  {paymentMethod === 'card' ? (
                    <form onSubmit={handleSimulatePayment} className="space-y-3">
                      <button
                        type="submit"
                        disabled={isProcessing || activeAmount <= 0}
                        className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-stone-950 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing Tip...</span>
                          </>
                        ) : (
                          <>
                            <Heart className="w-4 h-4 fill-stone-950" />
                            <span>Tip €{activeAmount.toFixed(2)} to {creatorName}</span>
                          </>
                        )}
                      </button>
                      <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
                        <Lock className="w-3 h-3" />
                        <span>Secure 256-bit encrypted simulated checkout</span>
                      </div>
                    </form>
                  ) : paymentMethod === 'bmac' ? (
                    <div className="space-y-2">
                      <a
                        href={customBmacUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-[#FFDD00] hover:bg-[#ffe333] text-stone-950 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                      >
                        <Coffee className="w-4 h-4" />
                        <span>Support on Buy Me a Coffee (€{activeAmount.toFixed(2)})</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <p className="text-[11px] text-center text-stone-500">
                        Opens official Buy Me a Coffee page in a secure new tab
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <a
                        href={customPaypalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                      >
                        <span className="font-bold">PayPal</span>
                        <span>Send €{activeAmount.toFixed(2)} with PayPal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <p className="text-[11px] text-center text-stone-500">
                        Opens PayPal.me in a secure new tab
                      </p>
                    </div>
                  )}
                </div>

                {/* Creator setup drawer toggle */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span>100% of tips support this free app</span>
                  <button
                    type="button"
                    onClick={() => setShowSettings(!showSettings)}
                    className="hover:text-stone-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Creator Settings</span>
                  </button>
                </div>

                {/* Creator settings panel for Nikolina to set real links */}
                {showSettings && (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2 animate-in fade-in">
                    <p className="font-semibold text-stone-800">Configure Your Real Payment Links:</p>
                    <div>
                      <label className="text-[10px] text-stone-500 block">Buy Me a Coffee URL:</label>
                      <input
                        type="url"
                        value={customBmacUrl}
                        onChange={(e) => setCustomBmacUrl(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-stone-200 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 block">PayPal.me URL:</label>
                      <input
                        type="url"
                        value={customPaypalUrl}
                        onChange={(e) => setCustomPaypalUrl(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-stone-200 rounded text-xs"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              /* Success / Thank You State */
              <motion.div
                key="thank-you"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-sm">
                  🎉
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-serif text-stone-900">
                    Grazie Mille! Thank You So Much!
                  </h3>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Your kind contribution of <strong>€{activeAmount.toFixed(2)}</strong> directly supports the development of this flight synchronization planner.
                  </p>
                </div>

                {donorMessage && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-stone-700 italic max-w-xs mx-auto">
                    "{donorMessage}"
                  </div>
                )}

                <div className="pt-3">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-xl bg-[#2F241C] hover:bg-[#3D2E24] text-amber-200 font-bold text-xs transition-colors cursor-pointer border border-[#523E30] shadow-xs"
                  >
                    Return to Flight Planner
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
