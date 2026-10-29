import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Megaphone, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  ExternalLink, 
  Mail, 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  Globe, 
  Copy, 
  Check, 
  Info,
  HelpCircle
} from 'lucide-react';

interface AdvertiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorEmail?: string;
  defaultTab?: 'adsense' | 'direct';
}

export const AdvertiseModal: React.FC<AdvertiseModalProps> = ({
  isOpen,
  onClose,
  creatorEmail = 'NikolinaBabok83@gmail.com',
  defaultTab = 'adsense',
}) => {
  const [activeTab, setActiveTab] = useState<'adsense' | 'direct'>(defaultTab);

  // Direct Ad Form State
  const [brandName, setBrandName] = useState('');
  const [website, setWebsite] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<'bottom-bar' | 'match-card' | 'destination-guide'>('bottom-bar');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  // AdSense Configuration State
  const [savedClientId, setSavedClientId] = useState(() => {
    return localStorage.getItem('adsense_client_id') || '';
  });
  const [inputClientId, setInputClientId] = useState(savedClientId);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleSaveAdSenseId = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = inputClientId.trim();
    if (cleanId) {
      localStorage.setItem('adsense_client_id', cleanId);
      setSavedClientId(cleanId);
    } else {
      localStorage.removeItem('adsense_client_id');
      setSavedClientId('');
    }
    setSavedSuccessMessage(true);
    setTimeout(() => setSavedSuccessMessage(false), 3000);
  };

  const handleCopyScriptCode = () => {
    const code = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${savedClientId || 'ca-pub-XXXXXXXXXXXXXXXX'}" crossorigin="anonymous"></script>`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const slotNames = {
      'bottom-bar': 'Sticky Bottom Deals Bar (All Pages)',
      'match-card': 'Synchronized Flight Card Sponsor (High Engagement)',
      'destination-guide': 'Milan / Rome Stay & Transit Spotlight',
    };

    const subject = encodeURIComponent(`Sponsorship & Ad Banner Inquiry: ${brandName || 'New Advertiser'}`);
    const body = encodeURIComponent(
      `Hello Nikolina,\n\nI am interested in advertising on your Meet in Europe / Flight Rendezvous app.\n\n` +
      `• Brand / Business Name: ${brandName}\n` +
      `• Website: ${website}\n` +
      `• Selected Ad Slot: ${slotNames[selectedSlot]}\n` +
      `• Campaign Details & Budget: ${message || 'Please send pricing and availability.'}\n\n` +
      `Looking forward to partnering with you!`
    );

    window.open(`mailto:${creatorEmail}?subject=${subject}&body=${body}`, '_blank');
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#2F241C] to-[#4A392D] text-amber-100 flex items-center justify-between border-b border-[#5E493B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-serif text-base text-white">Monetization &amp; Advertising Center</h3>
              <p className="text-[11px] text-amber-200/80">Google AdSense automated ads &amp; direct brand sponsorships</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('adsense')}
            className={`pb-2.5 px-3 font-semibold text-xs border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'adsense'
                ? 'border-amber-700 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span>Google AdSense (Automatic Ads)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('direct')}
            className={`pb-2.5 px-3 font-semibold text-xs border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'direct'
                ? 'border-amber-700 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-amber-600" />
            <span>Direct Banner Sponsorships</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-stone-800 text-xs">
          {activeTab === 'adsense' ? (
            <div className="space-y-4">
              {/* How AdSense Works Explainer */}
              <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                  How Google AdSense Works &amp; How You Get Paid
                </div>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  Google AdSense places automated, targeted advertisements (flights, hotels, luggage, tours) across your web app.
                  Google handles advertiser billing, matches the highest bids, and deposits money directly into your bank account every month.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                    <span className="font-bold text-amber-900">Per Click (CPC):</span> You get paid whenever a traveler clicks an airline or hotel ad.
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                    <span className="font-bold text-amber-900">Per 1,000 Views (CPM):</span> You get paid passively just by having visitors view the page.
                  </div>
                </div>
              </div>

              {/* Step-by-Step Setup Guide */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-stone-600" />
                  Step-by-Step Setup Instructions
                </h4>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      1
                    </span>
                    <div className="space-y-1">
                      <div className="font-bold text-stone-900">Get a Custom Domain</div>
                      <div className="text-stone-600 text-[11px] leading-relaxed">
                        Google requires your own domain (e.g., <code className="font-mono text-amber-900 bg-amber-100/60 px-1 py-0.5 rounded">meetinflight.com</code> or <code className="font-mono text-amber-900 bg-amber-100/60 px-1 py-0.5 rounded">flightrendezvous.com</code>). They do not approve raw cloud staging URLs like <code className="font-mono text-stone-500">.run.app</code>.
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      2
                    </span>
                    <div className="space-y-1">
                      <div className="font-bold text-stone-900">Sign Up at Google AdSense</div>
                      <div className="text-stone-600 text-[11px] leading-relaxed">
                        Go to <a href="https://adsense.google.com" target="_blank" rel="noopener noreferrer" className="text-amber-800 font-bold underline inline-flex items-center gap-0.5">adsense.google.com <ExternalLink className="w-2.5 h-2.5" /></a> and sign in with your Google account. Enter your website domain and country.
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      3
                    </span>
                    <div className="space-y-1">
                      <div className="font-bold text-stone-900">Get Your Publisher ID</div>
                      <div className="text-stone-600 text-[11px] leading-relaxed">
                        Google gives you a Publisher ID starting with <code className="font-mono font-bold text-stone-800">ca-pub-XXXXXXXXXXXXXXXX</code>.
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      4
                    </span>
                    <div className="space-y-1">
                      <div className="font-bold text-stone-900">Activate Live Ads Right Here</div>
                      <div className="text-stone-600 text-[11px] leading-relaxed">
                        Paste your Publisher ID into the box below. The app will immediately link your live ads and verify ad placements.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Publisher ID Input Form */}
              <form onSubmit={handleSaveAdSenseId} className="p-4 rounded-xl border border-amber-300 bg-amber-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="adsense-client-input" className="font-bold text-stone-900 text-xs">
                    Your AdSense Publisher ID:
                  </label>
                  {savedClientId && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    id="adsense-client-input"
                    type="text"
                    value={inputClientId}
                    onChange={(e) => setInputClientId(e.target.value)}
                    placeholder="e.g. ca-pub-1234567890123456"
                    className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    Save &amp; Connect
                  </button>
                </div>

                {savedSuccessMessage && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded-lg flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Publisher ID saved! The app will now serve your AdSense banners.
                  </div>
                )}

                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-stone-500">
                  <span>HTML Header Script snippet:</span>
                  <button
                    type="button"
                    onClick={handleCopyScriptCode}
                    className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-900 font-medium cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied script!' : 'Copy Script Tag'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : sentSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-stone-900">Email Draft Prepared!</h4>
              <p className="text-stone-600 max-w-xs mx-auto text-[11px]">
                Your email client has opened with your inquiry addressed directly to <strong>{creatorEmail}</strong>. We will get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendInquiry} className="space-y-4">
              {/* Direct Sponsor Overview */}
              <div className="bg-amber-50/70 rounded-xl p-3.5 border border-amber-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  Sell Your Ad Spots Directly to Hotels &amp; Travel Brands
                </div>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  Unlike AdSense which takes a 32% cut, direct sponsors pay <strong>100% of their ad fee directly to your bank account or PayPal</strong> on a fixed monthly basis.
                </p>
              </div>

              {/* Slot Selection */}
              <div>
                <label className="block font-bold text-stone-900 mb-2">Select Your Preferred Placement:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedSlot('bottom-bar')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedSlot === 'bottom-bar'
                        ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-400/30'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <div className="font-bold text-stone-900 text-xs">Bottom Deal Bar</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">Fixed footer banner on every page</div>
                    <div className="text-amber-800 font-extrabold text-[11px] mt-2">€79 / month</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedSlot('match-card')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedSlot === 'match-card'
                        ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-400/30'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <div className="font-bold text-stone-900 text-xs">Flight Card Slot</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">Inside synchronized flight results</div>
                    <div className="text-amber-800 font-extrabold text-[11px] mt-2">€129 / month</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedSlot('destination-guide')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedSlot === 'destination-guide'
                        ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-400/30'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <div className="font-bold text-stone-900 text-xs">Stay &amp; Transit Spotlight</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">Hotel and transfer recommendation</div>
                    <div className="text-amber-800 font-extrabold text-[11px] mt-2">€189 / month</div>
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Company / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Hotel Milano Centrale"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Website URL *</label>
                  <input
                    type="url"
                    required
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourbrand.com"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Campaign Goals / Custom Offer Details</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the promotion, target dates, or custom banner requirements..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between text-[11px] text-stone-600">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-500" />
                  Inquiries delivered directly to: <strong>{creatorEmail}</strong>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Direct Wire / Stripe
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/20 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Sponsorship Request
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
