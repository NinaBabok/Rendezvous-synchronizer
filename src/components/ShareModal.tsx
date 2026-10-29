import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Mail, Share2, Sparkles, PlaneTakeoff, PlaneLanding, ShieldCheck } from 'lucide-react';
import { SynchronizedMatch } from '../types';
import { formatMinutesDiff } from '../utils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: SynchronizedMatch | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, match }) => {
  const [language, setLanguage] = useState<'hr' | 'en' | 'fr'>('hr');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !match) return null;

  const { toulouseFlight, zagrebFlight, date, destinationCity, arrivalDifferenceMinutes, direction } = match;
  const isReturn = direction === 'return';
  const cityName = destinationCity === 'milano' ? 'Milan (Milano)' : 'Rome (Rim)';

  const diffFormatted = formatMinutesDiff(arrivalDifferenceMinutes);

  const getShareText = () => {
    if (isReturn) {
      if (language === 'hr') {
        return `Bok mama! ✈️🇮🇹
Pogledala sam letove za naš povratak kući iz ${cityName} u listopadu!

📅 Datum povratka: ${date}

✈️ Tvoj povratni let za Zagreb:
• Aviokompanija: ${zagrebFlight.airline} (${zagrebFlight.flightNumber})
• Polazak: ${zagrebFlight.departureTime} (${zagrebFlight.originAirport})
• Dolazak u Zagreb (ZAG): ${zagrebFlight.arrivalTime}
• Cijena leta: cca €${zagrebFlight.estimatedPriceEur}

✈️ Moj povratni let za Toulouse:
• Aviokompanija: ${toulouseFlight.airline} (${toulouseFlight.flightNumber})
• Polazak: ${toulouseFlight.departureTime} (${toulouseFlight.originAirport})
• Dolazak u Toulouse (TLS): ${toulouseFlight.arrivalTime}
• Cijena leta: cca €${toulouseFlight.estimatedPriceEur}

⏱️ Usklađenost: Polijećemo s razmakom od samo ${diffFormatted}!
📍 Plan za odlazak: ${match.meetingLocationTip}

ℹ️ Napomena za rezervaciju: Svaka od nas rezervira svoju kartu direktno na stranici svoje aviokompanije (ili putem Google Flights)!

Što misliš o ovom datumu za povratak? ❤️`;
      } else if (language === 'fr') {
        return `Coucou maman ! ✈️🇮🇹
Voici les vols retour pour rentrer depuis ${destinationCity === 'milano' ? 'Milan' : 'Rome'} en octobre !

📅 Date du retour : ${date}

✈️ Ton vol retour vers Zagreb :
• ${zagrebFlight.airline} (${zagrebFlight.flightNumber}) : ${zagrebFlight.departureTime} (${zagrebFlight.originAirport}) ➔ ${zagrebFlight.arrivalTime} (ZAG)

✈️ Mon vol retour vers Toulouse :
• ${toulouseFlight.airline} (${toulouseFlight.flightNumber}) : ${toulouseFlight.departureTime} (${toulouseFlight.originAirport}) ➔ ${toulouseFlight.arrivalTime} (TLS)

⏱️ Nos départs sont espacés de seulement ${diffFormatted} !
📍 Plan de départ : ${match.meetingLocationTip}

ℹ️ Rappel réservation : Chacune réserve son propre billet directement auprès de sa compagnie aérienne (ou sur Google Flights) !

Dis-moi si cela te convient ! ❤️`;
      } else {
        return `Hey there! ✈️
I found and synchronized our return flights from ${cityName} back home for October!

📅 Return Date: ${date}

✈️ Flight to Zagreb (ZAG):
• Airline: ${zagrebFlight.airline} (${zagrebFlight.flightNumber})
• Schedule: ${zagrebFlight.departureTime} (${zagrebFlight.originAirport}) ➔ ${zagrebFlight.arrivalTime} (ZAG)
• Price estimate: ~€${zagrebFlight.estimatedPriceEur}

✈️ Flight to Toulouse (TLS):
• Airline: ${toulouseFlight.airline} (${toulouseFlight.flightNumber})
• Schedule: ${toulouseFlight.departureTime} (${toulouseFlight.originAirport}) ➔ ${toulouseFlight.arrivalTime} (TLS)
• Price estimate: ~€${toulouseFlight.estimatedPriceEur}

⏱️ Departure Timing: We take off within ${diffFormatted} of each other!
📍 Departure & Airport Plan: ${match.meetingLocationTip}

ℹ️ Booking note: Each traveler books their own flight separately on the official airline website (or Google Flights) using the flight numbers above!

Let me know what you think! ✈️`;
      }
    } else {
      if (language === 'hr') {
        return `Bok! ✈️
Pogledaj letove koje sam uskladio/la za naš susret u destinaciji ${cityName}!

📅 Datum susreta: ${date}

✈️ Let iz Zagreba:
• Aviokompanija: ${zagrebFlight.airline} (${zagrebFlight.flightNumber})
• Polazak: ${zagrebFlight.departureTime} (Zagreb ZAG)
• Dolazak: ${zagrebFlight.arrivalTime} (${zagrebFlight.destinationAirport})
• Cijena leta: cca €${zagrebFlight.estimatedPriceEur}

✈️ Let iz Toulousea:
• Aviokompanija: ${toulouseFlight.airline} (${toulouseFlight.flightNumber})
• Polazak: ${toulouseFlight.departureTime} (Toulouse TLS)
• Dolazak: ${toulouseFlight.arrivalTime} (${toulouseFlight.destinationAirport})
• Cijena leta: cca €${toulouseFlight.estimatedPriceEur}

⏱️ Usklađenost: Stižemo s razmakom od samo ${diffFormatted}!
📍 Mjesto susreta: ${match.meetingLocationTip}

ℹ️ Napomena za rezervaciju: Svaka od nas rezervira svoju kartu zasebno direktno na stranici aviokompanije (ili Google Flights) prema ovim brojevima letova!

Javi mi što misliš da rezerviramo karte! ✈️`;
      } else if (language === 'fr') {
        return `Coucou ! ✈️
J'ai synchronisé les vols pour qu'on se retrouve à ${destinationCity === 'milano' ? 'Milan' : 'Rome'} !

📅 Date : ${date}

✈️ Vol depuis Zagreb :
• ${zagrebFlight.airline} (${zagrebFlight.flightNumber}) : ${zagrebFlight.departureTime} (ZAG) ➔ ${zagrebFlight.arrivalTime} (${zagrebFlight.destinationAirport})

✈️ Vol depuis Toulouse :
• ${toulouseFlight.airline} (${toulouseFlight.flightNumber}) : ${toulouseFlight.departureTime} (TLS) ➔ ${toulouseFlight.arrivalTime} (${toulouseFlight.destinationAirport})

⏱️ On arrive à seulement ${diffFormatted} d'écart !
📍 Point de rendez-vous : ${match.meetingLocationTip}

ℹ️ Rappel réservation : Chacun réserve son propre vol directement sur le site de la compagnie aérienne (ou Google Flights) !

Dis-moi si cette date te convient ! ✈️`;
      } else {
        return `Hey there! ✈️
I found and synchronized our flights to meet in ${cityName}!

📅 Rendezvous Date: ${date}

✈️ Flight from Zagreb (ZAG):
• Airline: ${zagrebFlight.airline} (${zagrebFlight.flightNumber})
• Schedule: ${zagrebFlight.departureTime} (ZAG) ➔ ${zagrebFlight.arrivalTime} (${zagrebFlight.destinationAirport})
• Price estimate: ~€${zagrebFlight.estimatedPriceEur}

✈️ Flight from Toulouse (TLS):
• Airline: ${toulouseFlight.airline} (${toulouseFlight.flightNumber})
• Schedule: ${toulouseFlight.departureTime} (TLS) ➔ ${toulouseFlight.arrivalTime} (${toulouseFlight.destinationAirport})
• Price estimate: ~€${toulouseFlight.estimatedPriceEur}

⏱️ Arrival Timing: We arrive within ${diffFormatted} of each other!
📍 Meeting Plan: ${match.meetingLocationTip}

ℹ️ Booking note: Each traveler books their flight separately on the airline's official page (or Google Flights) using the flight numbers above!

Let me know if this date works for you! ✈️`;
      }
    }
  };

  const shareText = getShareText();

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`${isReturn ? 'Return Flights from' : 'Our Trip to'} ${cityName}! ✈️`);
    const body = encodeURIComponent(shareText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-stone-900 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              {isReturn ? <PlaneTakeoff className="w-4 h-4" /> : <PlaneLanding className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-sm font-serif">
                {isReturn ? 'Share Return Itinerary with Mom' : 'Share Outbound Itinerary with Mom'}
              </h3>
              <p className="text-[11px] text-stone-400">Pre-formatted message ready to send</p>
            </div>
          </div>

          <button
            id="close-share-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language switcher */}
        <div className="px-5 pt-4 flex items-center justify-between">
          <span className="text-xs font-bold text-stone-500">Message Language:</span>
          <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs font-bold">
            <button
              id="lang-hr-btn"
              onClick={() => setLanguage('hr')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                language === 'hr' ? 'bg-white text-stone-900 shadow-2xs font-extrabold' : 'text-stone-600'
              }`}
            >
              Hrvatski 🇭🇷
            </button>
            <button
              id="lang-en-btn"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                language === 'en' ? 'bg-white text-stone-900 shadow-2xs font-extrabold' : 'text-stone-600'
              }`}
            >
              English 🇬🇧
            </button>
            <button
              id="lang-fr-btn"
              onClick={() => setLanguage('fr')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                language === 'fr' ? 'bg-white text-stone-900 shadow-2xs font-extrabold' : 'text-stone-600'
              }`}
            >
              Français 🇫🇷
            </button>
          </div>
        </div>

        {/* Message preview textarea */}
        <div className="p-5 pt-3 space-y-3">
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-bold text-amber-900">How booking works:</strong> We find the matching destination and synchronized schedule. You and your companion each purchase your own ticket directly on the operating airline’s site (or Google Flights). We do not collect payments or add markups.
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono text-stone-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
            {shareText}
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 pb-5 pt-1 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              id="share-whatsapp-btn"
              onClick={handleWhatsApp}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp
            </button>
            <button
              id="share-email-btn"
              onClick={handleEmail}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-stone-600" />
              Email
            </button>
          </div>

          <button
            id="copy-share-text-btn"
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy to Clipboard
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
