import { DestinationCity, FlightOption, SynchronizedMatch, CityComparisonData } from '../types';
import { formatMinutesDiff } from '../utils';

export const CITY_COMPARISON: Record<DestinationCity, CityComparisonData> = {
  milano: {
    city: 'milano',
    name: 'Milan (Milano)',
    tagline: 'Fashion capital, Duomo cathedral, Leonardo da Vinci, and high-speed lake escapes',
    weatherOctober: {
      avgTemp: '14°C - 19°C (57°F - 66°F)',
      rainDays: 6,
      sunshineHours: 5,
      clothingTip: 'Crisp autumn weather. Light coat, comfortable walking boots, and stylish layers.',
    },
    airports: [
      {
        code: 'BGY',
        name: 'Milan Bergamo (Orio al Serio)',
        city: 'Milan / Bergamo',
        country: 'Italy',
        distanceToCenterKm: 45,
        transitToCenterMinutes: 50,
        transitCostEur: 6,
        transitType: 'Orio Shuttle / Terravision bus directly to Milano Centrale',
      },
      {
        code: 'MXP',
        name: 'Milan Malpensa',
        city: 'Milan',
        country: 'Italy',
        terminal: 'T1 & T2',
        distanceToCenterKm: 49,
        transitToCenterMinutes: 51,
        transitCostEur: 13,
        transitType: 'Malpensa Express Train directly to Milano Centrale & Cadorna',
      },
      {
        code: 'LIN',
        name: 'Milan Linate',
        city: 'Milan',
        country: 'Italy',
        distanceToCenterKm: 7,
        transitToCenterMinutes: 15,
        transitCostEur: 2.2,
        transitType: 'Metro Line M4 (Blue) directly into San Babila / Duomo',
      },
    ],
    directFlightAvailability: {
      fromZagreb: 'Ryanair flies direct to Milan Bergamo (BGY) 4x/week (Tue, Thu, Sat, Sun).',
      fromToulouse: 'easyJet flies direct to Milan Malpensa (MXP) & Ryanair to Bergamo (BGY).',
      verdict: 'Excellent direct options on Thursdays, Saturdays, and Sundays! If you land at different airports (BGY & MXP), both connect directly to Milano Centrale station within ~50 minutes.',
    },
    highlightsForMomTrip: [
      'Duomo di Milano & rooftop sunset terraces overlooking the Alps',
      'Galleria Vittorio Emanuele II cafe strolls & historic pastry shops (Marchesi 1824)',
      'Leonardo da Vinci’s "The Last Supper" (Santa Maria delle Grazie)',
      'Day trip to Lake Como (Varenna / Bellagio) only 1 hour by scenic train from Milano Centrale',
      'Brera Art District, quiet botanical gardens, and world-class risotto & gelato',
    ],
    transitEaseScore: 9.2,
    approxHotelCostEurPerNight: 120,
    pros: [
      'Very affordable direct flights on Ryanair and easyJet',
      'Milano Centrale acts as an effortless single meeting point if arriving at different airports',
      'Compact, flat, pedestrian-friendly city center with modern elevators and vintage trams',
      'Effortless 1-hour train escape to Lake Como for a peaceful mother-daughter day',
    ],
    cons: [
      'A bit cooler and crisp in late October than Rome',
      'Bergamo (BGY) and Malpensa (MXP) are ~45-50km from the center, though well-connected',
    ],
  },
  roma: {
    city: 'roma',
    name: 'Rome (Roma)',
    tagline: 'The Eternal City — Colosseum, Piazza Navona, warm autumn sunshine, and Roman trattorias',
    weatherOctober: {
      avgTemp: '17°C - 23°C (63°F - 73°F)',
      rainDays: 7,
      sunshineHours: 7,
      clothingTip: 'Pleasantly warm autumn sun. Light jacket for evenings, sun glasses, comfortable walking shoes.',
    },
    airports: [
      {
        code: 'FCO',
        name: 'Rome Leonardo da Vinci (Fiumicino)',
        city: 'Rome',
        country: 'Italy',
        terminal: 'T1 & T3',
        distanceToCenterKm: 30,
        transitToCenterMinutes: 32,
        transitCostEur: 14,
        transitType: 'Leonardo Express non-stop train directly to Roma Termini (every 15 min)',
      },
      {
        code: 'CIA',
        name: 'Rome Ciampino',
        city: 'Rome',
        country: 'Italy',
        distanceToCenterKm: 15,
        transitToCenterMinutes: 40,
        transitCostEur: 6,
        transitType: 'Terravision Shuttle or Bus + Train to Roma Termini',
      },
    ],
    directFlightAvailability: {
      fromZagreb: 'Ryanair & Croatia Airlines both fly direct to Rome Fiumicino (FCO) 4-6x/week.',
      fromToulouse: 'Ryanair flies direct to Rome Fiumicino (FCO) 3-4x/week (Tue, Thu, Sat, Sun).',
      verdict: 'Super convenient: BOTH you and your mom can land at the exact same airport (Rome FCO) on direct flights! You can literally wait at the arrival gate or airport coffee shop.',
    },
    highlightsForMomTrip: [
      'Trevi Fountain, Spanish Steps & morning espresso in Piazza Navona',
      'Colosseum, Roman Forum & sunset walk along the Aventine Hill',
      'Vatican Museums, St. Peter’s Basilica & Borghese Gallery gardens',
      'Trastevere neighborhood dinners: authentic cacio e pepe, carbonara, and outdoor piazzas',
      'Warm golden Mediterranean light throughout October',
    ],
    transitEaseScore: 8.8,
    approxHotelCostEurPerNight: 135,
    pros: [
      'Both Zagreb and Toulouse have direct flights landing at the SAME airport (FCO)',
      'Warmest climate in southern Europe in October (often 22°C+ / sunny)',
      'Iconic historic wonder and atmosphere for an unforgettable family trip',
      'Non-stop Leonardo Express train reaches central Rome in 32 minutes',
    ],
    cons: [
      'Cobblestone streets require sturdy walking shoes for mom',
      'Slightly higher tourist crowds around the Vatican and Colosseum',
    ],
  },
};

// Helper to generate realistic Google Flights / Booking URL (with optional affiliate tracking)
export function generateGoogleFlightsUrl(origin: string, dest: string, date: string, returnDate?: string): string {
  const originParam = encodeURIComponent(origin);
  const destParam = encodeURIComponent(dest);
  const targetUrl = returnDate
    ? `https://www.google.com/travel/flights?q=Flights%20to%20${destParam}%20from%20${originParam}%20on%20${date}%20through%20${returnDate}`
    : `https://www.google.com/travel/flights?q=Flights%20to%20${destParam}%20from%20${originParam}%20on%20${date}`;

  // If a Travelpayouts partner marker is configured in environment, route through affiliate tracker
  const envMarker = typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_TRAVELPAYOUTS_MARKER;
  if (envMarker && envMarker.trim().length > 0) {
    return `https://tp.media/r?marker=${encodeURIComponent(envMarker.trim())}&p=4114&u=${encodeURIComponent(targetUrl)}`;
  }

  return targetUrl;
}

// Generate base schedule for any month and year (defaults to October 2026)
export function getMatchesForMonth(year: number = 2026, month: number = 10): SynchronizedMatch[] {
  const matches: SynchronizedMatch[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat

    // -------------------------------------------------------------
    // 1. MILANO COMBINATIONS
    // -------------------------------------------------------------
    
    // Zagreb -> Milan options
    let zagMilan: FlightOption;
    if (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6 || dayOfWeek === 0) {
      // Direct Ryanair to Bergamo BGY
      const depH = dayOfWeek === 4 ? '07:10' : dayOfWeek === 6 ? '14:20' : dayOfWeek === 0 ? '16:05' : '09:40';
      const arrH = dayOfWeek === 4 ? '08:25' : dayOfWeek === 6 ? '15:35' : dayOfWeek === 0 ? '17:20' : '10:55';
      const price = dayOfWeek === 6 || dayOfWeek === 0 ? 38 : 26;
      
      zagMilan = {
        id: `zag-bgy-${dateStr}`,
        originCity: 'Zagreb',
        originAirport: 'ZAG',
        destinationCity: 'milano',
        destinationAirport: 'BGY',
        departureDate: dateStr,
        departureTime: depH,
        arrivalTime: arrH,
        durationTotalMinutes: 75,
        isDirect: true,
        stopsCount: 0,
        airline: 'Ryanair',
        airlineCode: 'FR',
        flightNumber: 'FR 4744',
        estimatedPriceEur: price,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('ZAG', 'BGY', dateStr),
        baggageNote: 'Small cabin bag under seat included (40x20x25cm). +€18 for overhead trolley.',
        segments: [{
          flightNumber: 'FR 4744',
          airline: 'Ryanair',
          airlineCode: 'FR',
          originAirport: 'ZAG',
          destinationAirport: 'BGY',
          departureTime: depH,
          arrivalTime: arrH,
          durationMinutes: 75,
          aircraft: 'Boeing 737-800',
        }],
      };
    } else {
      // 1-stop via Frankfurt / Munich / Vienna with Lufthansa / Croatia Airlines
      const depH = '06:05';
      const arrH = '09:45';
      zagMilan = {
        id: `zag-mxp-conn-${dateStr}`,
        originCity: 'Zagreb',
        originAirport: 'ZAG',
        destinationCity: 'milano',
        destinationAirport: 'MXP',
        departureDate: dateStr,
        departureTime: depH,
        arrivalTime: arrH,
        durationTotalMinutes: 220,
        isDirect: false,
        stopsCount: 1,
        layoverAirport: 'FRA',
        layoverDurationMinutes: 65,
        airline: 'Croatia Airlines / Lufthansa',
        airlineCode: 'OU / LH',
        flightNumber: 'OU 410 / LH 252',
        estimatedPriceEur: 139,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('ZAG', 'MXP', dateStr),
        baggageNote: 'Standard carry-on included + personal item.',
        segments: [
          {
            flightNumber: 'OU 410',
            airline: 'Croatia Airlines',
            airlineCode: 'OU',
            originAirport: 'ZAG',
            destinationAirport: 'FRA',
            departureTime: '06:05',
            arrivalTime: '07:40',
            durationMinutes: 95,
            aircraft: 'Airbus A220-300',
          },
          {
            flightNumber: 'LH 252',
            airline: 'Lufthansa',
            airlineCode: 'LH',
            originAirport: 'FRA',
            destinationAirport: 'MXP',
            departureTime: '08:45',
            arrivalTime: '09:45',
            durationMinutes: 60,
            aircraft: 'Airbus A320',
          },
        ],
      };
    }

    // Toulouse -> Milan options
    let tlsMilan: FlightOption;
    if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5 || dayOfWeek === 0) {
      // easyJet direct to Malpensa MXP
      const depH = dayOfWeek === 5 ? '09:15' : dayOfWeek === 0 ? '16:50' : '10:40';
      const arrH = dayOfWeek === 5 ? '10:45' : dayOfWeek === 0 ? '18:20' : '12:10';
      const price = dayOfWeek === 5 || dayOfWeek === 0 ? 49 : 32;

      tlsMilan = {
        id: `tls-mxp-${dateStr}`,
        originCity: 'Toulouse',
        originAirport: 'TLS',
        destinationCity: 'milano',
        destinationAirport: 'MXP',
        departureDate: dateStr,
        departureTime: depH,
        arrivalTime: arrH,
        durationTotalMinutes: 90,
        isDirect: true,
        stopsCount: 0,
        airline: 'easyJet',
        airlineCode: 'U2',
        flightNumber: 'U2 4382',
        estimatedPriceEur: price,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('TLS', 'MXP', dateStr),
        baggageNote: 'Underseat small bag (45x36x20cm). +€15 for large overhead cabin bag.',
        segments: [{
          flightNumber: 'U2 4382',
          airline: 'easyJet',
          airlineCode: 'U2',
          originAirport: 'TLS',
          destinationAirport: 'MXP',
          departureTime: depH,
          arrivalTime: arrH,
          durationMinutes: 90,
          aircraft: 'Airbus A320',
        }],
      };
    } else if (dayOfWeek === 4 || dayOfWeek === 6 || dayOfWeek === 2) {
      // Ryanair direct to Bergamo BGY
      const depH = dayOfWeek === 4 ? '08:40' : dayOfWeek === 6 ? '15:10' : '11:20';
      const arrH = dayOfWeek === 4 ? '10:05' : dayOfWeek === 6 ? '16:35' : '12:45';
      const price = dayOfWeek === 6 ? 42 : 28;

      tlsMilan = {
        id: `tls-bgy-${dateStr}`,
        originCity: 'Toulouse',
        originAirport: 'TLS',
        destinationCity: 'milano',
        destinationAirport: 'BGY',
        departureDate: dateStr,
        departureTime: depH,
        arrivalTime: arrH,
        durationTotalMinutes: 85,
        isDirect: true,
        stopsCount: 0,
        airline: 'Ryanair',
        airlineCode: 'FR',
        flightNumber: 'FR 6241',
        estimatedPriceEur: price,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('TLS', 'BGY', dateStr),
        baggageNote: 'Underseat bag included. +€18 for overhead trolley priority.',
        segments: [{
          flightNumber: 'FR 6241',
          airline: 'Ryanair',
          airlineCode: 'FR',
          originAirport: 'TLS',
          destinationAirport: 'BGY',
          departureTime: depH,
          arrivalTime: arrH,
          durationMinutes: 85,
          aircraft: 'Boeing 737-800',
        }],
      };
    } else {
      // Air France connecting via CDG to Linate LIN / MXP
      tlsMilan = {
        id: `tls-lin-conn-${dateStr}`,
        originCity: 'Toulouse',
        originAirport: 'TLS',
        destinationCity: 'milano',
        destinationAirport: 'LIN',
        departureDate: dateStr,
        departureTime: '07:15',
        arrivalTime: '10:50',
        durationTotalMinutes: 215,
        isDirect: false,
        stopsCount: 1,
        layoverAirport: 'CDG',
        layoverDurationMinutes: 55,
        airline: 'Air France',
        airlineCode: 'AF',
        flightNumber: 'AF 7521 / AF 1212',
        estimatedPriceEur: 148,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('TLS', 'LIN', dateStr),
        baggageNote: 'Hand luggage 12kg included.',
        segments: [
          {
            flightNumber: 'AF 7521',
            airline: 'Air France',
            airlineCode: 'AF',
            originAirport: 'TLS',
            destinationAirport: 'CDG',
            departureTime: '07:15',
            arrivalTime: '08:45',
            durationMinutes: 90,
            aircraft: 'Airbus A321',
          },
          {
            flightNumber: 'AF 1212',
            airline: 'Air France',
            airlineCode: 'AF',
            originAirport: 'CDG',
            destinationAirport: 'LIN',
            departureTime: '09:40',
            arrivalTime: '10:50',
            durationMinutes: 70,
            aircraft: 'Airbus A320',
          },
        ],
      };
    }

    // Build Milan Synchronized Match
    matches.push(createSynchronizedMatch(dateStr, 'milano', tlsMilan, zagMilan));

    // -------------------------------------------------------------
    // 2. ROMA COMBINATIONS
    // -------------------------------------------------------------
    
    // Zagreb -> Rome options
    let zagRome: FlightOption;
    if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5 || dayOfWeek === 0) {
      // Ryanair direct to FCO
      const depH = dayOfWeek === 5 ? '07:05' : dayOfWeek === 0 ? '14:50' : '08:30';
      const arrH = dayOfWeek === 5 ? '08:30' : dayOfWeek === 0 ? '16:15' : '09:55';
      const price = dayOfWeek === 5 || dayOfWeek === 0 ? 39 : 24;

      zagRome = {
        id: `zag-fco-fr-${dateStr}`,
        originCity: 'Zagreb',
        originAirport: 'ZAG',
        destinationCity: 'roma',
        destinationAirport: 'FCO',
        departureDate: dateStr,
        departureTime: depH,
        arrivalTime: arrH,
        durationTotalMinutes: 85,
        isDirect: true,
        stopsCount: 0,
        airline: 'Ryanair',
        airlineCode: 'FR',
        flightNumber: 'FR 3872',
        estimatedPriceEur: price,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('ZAG', 'FCO', dateStr),
        baggageNote: 'Small cabin bag included. Priority 2 bags +€19.',
        segments: [{
          flightNumber: 'FR 3872',
          airline: 'Ryanair',
          airlineCode: 'FR',
          originAirport: 'ZAG',
          destinationAirport: 'FCO',
          departureTime: depH,
          arrivalTime: arrH,
          durationMinutes: 85,
          aircraft: 'Boeing 737 MAX 8200',
        }],
      };
    } else if (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6) {
      // Croatia Airlines direct to FCO (Flight OU 380)
      const depH = '14:20';
      const arrH = '15:45';
      zagRome = {
        id: `zag-fco-ou-${dateStr}`,
        originCity: 'Zagreb',
        originAirport: 'ZAG',
        destinationCity: 'roma',
        destinationAirport: 'FCO',
        departureDate: dateStr,
        departureTime: depH,
        arrivalTime: arrH,
        durationTotalMinutes: 85,
        isDirect: true,
        stopsCount: 0,
        airline: 'Croatia Airlines',
        airlineCode: 'OU',
        flightNumber: 'OU 380',
        estimatedPriceEur: 89,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('ZAG', 'FCO', dateStr),
        baggageNote: '8kg cabin baggage + personal item included.',
        segments: [{
          flightNumber: 'OU 380',
          airline: 'Croatia Airlines',
          airlineCode: 'OU',
          originAirport: 'ZAG',
          destinationAirport: 'FCO',
          departureTime: depH,
          arrivalTime: arrH,
          durationMinutes: 85,
          aircraft: 'Airbus A220-300',
        }],
      };
    } else {
      // 1-stop via VIE with Austrian
      zagRome = {
        id: `zag-fco-os-${dateStr}`,
        originCity: 'Zagreb',
        originAirport: 'ZAG',
        destinationCity: 'roma',
        destinationAirport: 'FCO',
        departureDate: dateStr,
        departureTime: '08:10',
        arrivalTime: '11:45',
        durationTotalMinutes: 215,
        isDirect: false,
        stopsCount: 1,
        layoverAirport: 'VIE',
        layoverDurationMinutes: 50,
        airline: 'Austrian Airlines',
        airlineCode: 'OS',
        flightNumber: 'OS 682 / OS 503',
        estimatedPriceEur: 135,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('ZAG', 'FCO', dateStr),
        baggageNote: 'Carry on included.',
        segments: [
          {
            flightNumber: 'OS 682',
            airline: 'Austrian',
            airlineCode: 'OS',
            originAirport: 'ZAG',
            destinationAirport: 'VIE',
            departureTime: '08:10',
            arrivalTime: '09:05',
            durationMinutes: 55,
            aircraft: 'Embraer 195',
          },
          {
            flightNumber: 'OS 503',
            airline: 'Austrian',
            airlineCode: 'OS',
            originAirport: 'VIE',
            destinationAirport: 'FCO',
            departureTime: '10:00',
            arrivalTime: '11:45',
            durationMinutes: 105,
            aircraft: 'Airbus A320',
          },
        ],
      };
    }

    // Toulouse -> Rome options
    let tlsRome: FlightOption;
    if (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6 || dayOfWeek === 0) {
      // Ryanair direct to FCO
      const depH = dayOfWeek === 4 ? '13:45' : dayOfWeek === 6 ? '15:20' : dayOfWeek === 0 ? '17:30' : '07:20';
      const arrH = dayOfWeek === 4 ? '15:35' : dayOfWeek === 6 ? '17:10' : dayOfWeek === 0 ? '19:20' : '09:10';
      const price = dayOfWeek === 6 || dayOfWeek === 0 ? 45 : 31;

      tlsRome = {
        id: `tls-fco-fr-${dateStr}`,
        originCity: 'Toulouse',
        originAirport: 'TLS',
        destinationCity: 'roma',
        destinationAirport: 'FCO',
        departureDate: dateStr,
        departureTime: depH,
        arrivalTime: arrH,
        durationTotalMinutes: 110,
        isDirect: true,
        stopsCount: 0,
        airline: 'Ryanair',
        airlineCode: 'FR',
        flightNumber: 'FR 7122',
        estimatedPriceEur: price,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('TLS', 'FCO', dateStr),
        baggageNote: 'Small cabin bag included. Priority 2 bags +€19.',
        segments: [{
          flightNumber: 'FR 7122',
          airline: 'Ryanair',
          airlineCode: 'FR',
          originAirport: 'TLS',
          destinationAirport: 'FCO',
          departureTime: depH,
          arrivalTime: arrH,
          durationMinutes: 110,
          aircraft: 'Boeing 737-800',
        }],
      };
    } else {
      // Connecting via CDG with Air France or Lufthansa via MUC
      tlsRome = {
        id: `tls-fco-af-${dateStr}`,
        originCity: 'Toulouse',
        originAirport: 'TLS',
        destinationCity: 'roma',
        destinationAirport: 'FCO',
        departureDate: dateStr,
        departureTime: '06:30',
        arrivalTime: '11:15',
        durationTotalMinutes: 285,
        isDirect: false,
        stopsCount: 1,
        layoverAirport: 'CDG',
        layoverDurationMinutes: 80,
        airline: 'Air France',
        airlineCode: 'AF',
        flightNumber: 'AF 7523 / AF 1204',
        estimatedPriceEur: 142,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('TLS', 'FCO', dateStr),
        baggageNote: 'Hand luggage 12kg included.',
        segments: [
          {
            flightNumber: 'AF 7523',
            airline: 'Air France',
            airlineCode: 'AF',
            originAirport: 'TLS',
            destinationAirport: 'CDG',
            departureTime: '06:30',
            arrivalTime: '08:00',
            durationMinutes: 90,
            aircraft: 'Airbus A320',
          },
          {
            flightNumber: 'AF 1204',
            airline: 'Air France',
            airlineCode: 'AF',
            originAirport: 'CDG',
            destinationAirport: 'FCO',
            departureTime: '09:20',
            arrivalTime: '11:15',
            durationMinutes: 115,
            aircraft: 'Airbus A321',
          },
        ],
      };
    }

    // Build Rome Synchronized Match
    matches.push(createSynchronizedMatch(dateStr, 'roma', tlsRome, zagRome));
  }

  // Populate Return trip matches for common weekend durations (3 days, 4 days)
  attachReturnMatches(matches);

  return matches;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function createSynchronizedMatch(
  date: string,
  destinationCity: DestinationCity,
  toulouseFlight: FlightOption,
  zagrebFlight: FlightOption
): SynchronizedMatch {
  const tlsArrMinutes = timeToMinutes(toulouseFlight.arrivalTime);
  const zagArrMinutes = timeToMinutes(zagrebFlight.arrivalTime);
  const diffMinutes = Math.abs(tlsArrMinutes - zagArrMinutes);

  let firstArrival: 'Toulouse' | 'Zagreb' | 'Simultaneous' = 'Simultaneous';
  if (tlsArrMinutes < zagArrMinutes) firstArrival = 'Toulouse';
  else if (zagArrMinutes < tlsArrMinutes) firstArrival = 'Zagreb';

  const sameAirport = toulouseFlight.destinationAirport === zagrebFlight.destinationAirport;

  let syncRating: 'perfect' | 'great' | 'good' | 'moderate' = 'moderate';
  if (diffMinutes <= 45 && sameAirport) syncRating = 'perfect';
  else if (diffMinutes <= 90) syncRating = 'great';
  else if (diffMinutes <= 160) syncRating = 'good';
  else syncRating = 'moderate';

  let syncDescription = '';
  const formattedDiff = formatMinutesDiff(diffMinutes);
  if (sameAirport) {
    if (diffMinutes <= 30) {
      syncDescription = `🌟 Perfect synchronization! You arrive almost at the same time at ${toulouseFlight.destinationAirport} (${formattedDiff} apart).`;
    } else {
      syncDescription = `${firstArrival === 'Zagreb' ? 'Mom' : 'You'} will arrive ${formattedDiff} earlier at ${toulouseFlight.destinationAirport}.`;
    }
  } else {
    syncDescription = `Different landing airports (Mom at ${zagrebFlight.destinationAirport}, You at ${toulouseFlight.destinationAirport}). Meet at Milano Centrale!`;
  }

  let meetingLocationTip = '';
  if (destinationCity === 'roma') {
    if (sameAirport) {
      meetingLocationTip = `Both land at Rome Fiumicino (FCO)! Wait at the Arrivals Hall coffee bar (e.g. Caffe Kimbo Terminal 3 or Terminal 1) or take the Leonardo Express train together to Roma Termini.`;
    } else {
      meetingLocationTip = `Meet at the main concourse near the track 24 Leonardo Express exit at Roma Termini station.`;
    }
  } else {
    if (sameAirport && toulouseFlight.destinationAirport === 'BGY') {
      meetingLocationTip = `Both land at Milan Bergamo (BGY)! Meet outside baggage claim at BGY Bar/Cafe, then take the 50-minute express bus together directly to Milano Centrale.`;
    } else if (sameAirport && toulouseFlight.destinationAirport === 'MXP') {
      meetingLocationTip = `Both land at Milan Malpensa (MXP)! Meet at Terminal 1 Arrivals or take the Malpensa Express train together into Milan.`;
    } else {
      meetingLocationTip = `Mom takes the Orio Shuttle from ${zagrebFlight.destinationAirport} and you take the Malpensa Express from ${toulouseFlight.destinationAirport}. Both arrive at Milano Centrale Main Hall in ~50 min!`;
    }
  }

  const bothDirect = toulouseFlight.isDirect && zagrebFlight.isDirect;
  const totalCombinedPriceEur = toulouseFlight.estimatedPriceEur + zagrebFlight.estimatedPriceEur;

  return {
    id: `sync-${destinationCity}-${date}`,
    date,
    destinationCity,
    toulouseFlight,
    zagrebFlight,
    sameDestinationAirport: sameAirport,
    meetingAirport: sameAirport
      ? `${destinationCity === 'milano' ? 'Milan' : 'Rome'} (${toulouseFlight.destinationAirport})`
      : 'Milano Centrale Station',
    arrivalDifferenceMinutes: diffMinutes,
    firstArrival,
    syncRating,
    syncDescription,
    meetingLocationTip,
    totalCombinedPriceEur,
    bothDirect,
  };
}

function attachReturnMatches(matches: SynchronizedMatch[]) {
  // Map matches by city and date
  const matchMap = new Map<string, SynchronizedMatch>();
  for (const m of matches) {
    matchMap.set(`${m.destinationCity}_${m.date}`, m);
  }

  for (const m of matches) {
    // Look ahead 3 days (e.g., Thursday to Sunday, or Friday to Monday)
    const curDate = new Date(m.date);
    const returnDateObj = new Date(curDate);
    returnDateObj.setDate(returnDateObj.getDate() + 3);

    const retYear = returnDateObj.getFullYear();
    const retMonth = returnDateObj.getMonth() + 1;
    const retDay = returnDateObj.getDate();
    const retMonthStr = retMonth < 10 ? `0${retMonth}` : `${retMonth}`;
    const retDayStr = retDay < 10 ? `0${retDay}` : `${retDay}`;
    const retDateStr = `${retYear}-${retMonthStr}-${retDayStr}`;
    
    // Look up flight options on return date for reverse routes
    // Generate realistic return flight options
    const isRome = m.destinationCity === 'roma';
      
      const toulouseReturn: FlightOption = {
        id: `tls-ret-${retDateStr}`,
        originCity: 'Toulouse',
        originAirport: isRome ? 'FCO' : 'MXP',
        destinationCity: m.destinationCity,
        destinationAirport: 'TLS',
        departureDate: retDateStr,
        departureTime: '17:30',
        arrivalTime: '19:15',
        durationTotalMinutes: 105,
        isDirect: true,
        stopsCount: 0,
        airline: isRome ? 'Ryanair' : 'easyJet',
        airlineCode: isRome ? 'FR' : 'U2',
        flightNumber: isRome ? 'FR 7123' : 'U2 4383',
        estimatedPriceEur: 42,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl(isRome ? 'FCO' : 'MXP', 'TLS', retDateStr),
        baggageNote: 'Cabin bag included.',
        segments: [{
          flightNumber: isRome ? 'FR 7123' : 'U2 4383',
          airline: isRome ? 'Ryanair' : 'easyJet',
          airlineCode: isRome ? 'FR' : 'U2',
          originAirport: isRome ? 'FCO' : 'MXP',
          destinationAirport: 'TLS',
          departureTime: '17:30',
          arrivalTime: '19:15',
          durationMinutes: 105,
        }],
      };

      const zagrebReturn: FlightOption = {
        id: `zag-ret-${retDateStr}`,
        originCity: 'Zagreb',
        originAirport: isRome ? 'FCO' : 'BGY',
        destinationCity: m.destinationCity,
        destinationAirport: 'ZAG',
        departureDate: retDateStr,
        departureTime: '18:15',
        arrivalTime: '19:35',
        durationTotalMinutes: 80,
        isDirect: true,
        stopsCount: 0,
        airline: 'Ryanair',
        airlineCode: 'FR',
        flightNumber: isRome ? 'FR 3873' : 'FR 4745',
        estimatedPriceEur: 38,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl(isRome ? 'FCO' : 'BGY', 'ZAG', retDateStr),
        baggageNote: 'Cabin bag included.',
        segments: [{
          flightNumber: isRome ? 'FR 3873' : 'FR 4745',
          airline: 'Ryanair',
          airlineCode: 'FR',
          originAirport: isRome ? 'FCO' : 'BGY',
          destinationAirport: 'ZAG',
          departureTime: '18:15',
          arrivalTime: '19:35',
          durationMinutes: 80,
        }],
      };

      const depDiff = Math.abs(timeToMinutes('17:30') - timeToMinutes('18:15'));

      m.returnMatch = {
        returnDate: retDateStr,
        tripDays: 3,
        toulouseReturn,
        zagrebReturn,
        departureDifferenceMinutes: depDiff,
        bothDirectReturn: true,
        totalRoundtripPriceEur: m.totalCombinedPriceEur + toulouseReturn.estimatedPriceEur + zagrebReturn.estimatedPriceEur,
      };
    }
  }

// Generate complete Return flight matches for any month and year (Milan/Rome -> Toulouse & Zagreb)
export function getReturnMatchesForMonth(year: number = 2026, month: number = 10): SynchronizedMatch[] {
  const matches: SynchronizedMatch[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat

    // -------------------------------------------------------------
    // 1. MILANO RETURN COMBINATIONS (Milano -> Zagreb & Toulouse)
    // -------------------------------------------------------------
    let zagReturnMilan: FlightOption;
    if (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6 || dayOfWeek === 0) {
      // Direct Ryanair from Bergamo BGY to Zagreb ZAG
      const depH = dayOfWeek === 4 ? '18:15' : dayOfWeek === 6 ? '16:00' : dayOfWeek === 0 ? '17:50' : '11:20';
      const arrH = dayOfWeek === 4 ? '19:30' : dayOfWeek === 6 ? '17:15' : dayOfWeek === 0 ? '19:05' : '12:35';
      const price = dayOfWeek === 0 || dayOfWeek === 6 ? 39 : 26;

      zagReturnMilan = {
        id: `ret-zag-bgy-${dateStr}`,
        originCity: 'Milan',
        originAirport: 'BGY',
        destinationCity: 'Zagreb',
        destinationAirport: 'ZAG',
        departureDate: dateStr,
        departureTime: depH,
        arrivalTime: arrH,
        durationTotalMinutes: 75,
        isDirect: true,
        stopsCount: 0,
        airline: 'Ryanair',
        airlineCode: 'FR',
        flightNumber: 'FR 4745',
        estimatedPriceEur: price,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('BGY', 'ZAG', dateStr),
        baggageNote: 'Small cabin bag under seat included. Priority trolley +€18.',
        segments: [{
          flightNumber: 'FR 4745',
          airline: 'Ryanair',
          airlineCode: 'FR',
          originAirport: 'BGY',
          destinationAirport: 'ZAG',
          departureTime: depH,
          arrivalTime: arrH,
          durationMinutes: 75,
          aircraft: 'Boeing 737-800',
        }],
      };
    } else {
      // 1-Stop via MUC/FRA with Lufthansa from MXP
      zagReturnMilan = {
        id: `ret-zag-mxp-conn-${dateStr}`,
        originCity: 'Milan',
        originAirport: 'MXP',
        destinationCity: 'Zagreb',
        destinationAirport: 'ZAG',
        departureDate: dateStr,
        departureTime: '10:30',
        arrivalTime: '14:20',
        durationTotalMinutes: 230,
        isDirect: false,
        stopsCount: 1,
        layoverAirport: 'MUC',
        layoverDurationMinutes: 60,
        airline: 'Lufthansa / Croatia Airlines',
        airlineCode: 'LH / OU',
        flightNumber: 'LH 1855 / OU 4437',
        estimatedPriceEur: 142,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('MXP', 'ZAG', dateStr),
        baggageNote: 'Carry-on bag included.',
        segments: [
          {
            flightNumber: 'LH 1855',
            airline: 'Lufthansa',
            airlineCode: 'LH',
            originAirport: 'MXP',
            destinationAirport: 'MUC',
            departureTime: '10:30',
            arrivalTime: '11:40',
            durationMinutes: 70,
          },
          {
            flightNumber: 'OU 4437',
            airline: 'Croatia Airlines',
            airlineCode: 'OU',
            originAirport: 'MUC',
            destinationAirport: 'ZAG',
            departureTime: '12:40',
            arrivalTime: '14:20',
            durationMinutes: 100,
          },
        ],
      };
    }

    let tlsReturnMilan: FlightOption;
    if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5 || dayOfWeek === 0) {
      // easyJet direct from Malpensa MXP to TLS
      const depH = dayOfWeek === 5 ? '19:15' : dayOfWeek === 0 ? '18:50' : '12:40';
      const arrH = dayOfWeek === 5 ? '20:45' : dayOfWeek === 0 ? '20:20' : '14:10';
      const price = dayOfWeek === 0 || dayOfWeek === 5 ? 46 : 33;

      tlsReturnMilan = {
        id: `ret-tls-mxp-${dateStr}`,
        originCity: 'Milan',
        originAirport: 'MXP',
        destinationCity: 'Toulouse',
        destinationAirport: 'TLS',
        departureDate: dateStr,
        departureTime: depH,
        arrivalTime: arrH,
        durationTotalMinutes: 90,
        isDirect: true,
        stopsCount: 0,
        airline: 'easyJet',
        airlineCode: 'U2',
        flightNumber: 'U2 4383',
        estimatedPriceEur: price,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('MXP', 'TLS', dateStr),
        baggageNote: 'Small underseat cabin bag included. Large cabin bag +€15.',
        segments: [{
          flightNumber: 'U2 4383',
          airline: 'easyJet',
          airlineCode: 'U2',
          originAirport: 'MXP',
          destinationAirport: 'TLS',
          departureTime: depH,
          arrivalTime: arrH,
          durationMinutes: 90,
          aircraft: 'Airbus A320',
        }],
      };
    } else if (dayOfWeek === 4 || dayOfWeek === 6 || dayOfWeek === 2) {
      // Ryanair direct from Bergamo BGY to TLS
      const depH = dayOfWeek === 4 ? '17:00' : dayOfWeek === 6 ? '17:10' : '13:15';
      const arrH = dayOfWeek === 4 ? '18:25' : dayOfWeek === 6 ? '18:35' : '14:40';
      const price = dayOfWeek === 6 ? 44 : 29;

      tlsReturnMilan = {
        id: `ret-tls-bgy-${dateStr}`,
        originCity: 'Milan',
        originAirport: 'BGY',
        destinationCity: 'Toulouse',
        destinationAirport: 'TLS',
        departureDate: dateStr,
        departureTime: depH,
        arrivalTime: arrH,
        durationTotalMinutes: 85,
        isDirect: true,
        stopsCount: 0,
        airline: 'Ryanair',
        airlineCode: 'FR',
        flightNumber: 'FR 6242',
        estimatedPriceEur: price,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('BGY', 'TLS', dateStr),
        baggageNote: 'Underseat bag included. +€18 for overhead trolley priority.',
        segments: [{
          flightNumber: 'FR 6242',
          airline: 'Ryanair',
          airlineCode: 'FR',
          originAirport: 'BGY',
          destinationAirport: 'TLS',
          departureTime: depH,
          arrivalTime: arrH,
          durationMinutes: 85,
          aircraft: 'Boeing 737-800',
        }],
      };
    } else {
      // Air France connecting via CDG from LIN
      tlsReturnMilan = {
        id: `ret-tls-lin-conn-${dateStr}`,
        originCity: 'Milan',
        originAirport: 'LIN',
        destinationCity: 'Toulouse',
        destinationAirport: 'TLS',
        departureDate: dateStr,
        departureTime: '11:40',
        arrivalTime: '15:15',
        durationTotalMinutes: 215,
        isDirect: false,
        stopsCount: 1,
        layoverAirport: 'CDG',
        layoverDurationMinutes: 50,
        airline: 'Air France',
        airlineCode: 'AF',
        flightNumber: 'AF 1213 / AF 7524',
        estimatedPriceEur: 145,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('LIN', 'TLS', dateStr),
        baggageNote: 'Standard carry-on included.',
        segments: [
          {
            flightNumber: 'AF 1213',
            airline: 'Air France',
            airlineCode: 'AF',
            originAirport: 'LIN',
            destinationAirport: 'CDG',
            departureTime: '11:40',
            arrivalTime: '13:10',
            durationMinutes: 90,
          },
          {
            flightNumber: 'AF 7524',
            airline: 'Air France',
            airlineCode: 'AF',
            originAirport: 'CDG',
            destinationAirport: 'TLS',
            departureTime: '14:00',
            arrivalTime: '15:15',
            durationMinutes: 75,
          },
        ],
      };
    }

    // Build Return Milan Synchronized Match
    matches.push(createReturnSynchronizedMatch(dateStr, 'milano', tlsReturnMilan, zagReturnMilan));

    // -------------------------------------------------------------
    // 2. ROMA RETURN COMBINATIONS (Roma -> Zagreb & Toulouse)
    // -------------------------------------------------------------
    let zagReturnRome: FlightOption;
    if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5 || dayOfWeek === 0) {
      // Ryanair direct from Rome FCO to Zagreb ZAG
      const depH = dayOfWeek === 0 ? '17:00' : dayOfWeek === 5 ? '09:00' : '10:35';
      const arrH = dayOfWeek === 0 ? '18:25' : dayOfWeek === 5 ? '10:25' : '12:00';
      const price = dayOfWeek === 0 || dayOfWeek === 5 ? 38 : 25;

      zagReturnRome = {
        id: `ret-zag-fco-fr-${dateStr}`,
        originCity: 'Rome',
        originAirport: 'FCO',
        destinationCity: 'Zagreb',
        destinationAirport: 'ZAG',
        departureDate: dateStr,
        departureTime: depH,
        arrivalTime: arrH,
        durationTotalMinutes: 85,
        isDirect: true,
        stopsCount: 0,
        airline: 'Ryanair',
        airlineCode: 'FR',
        flightNumber: 'FR 3873',
        estimatedPriceEur: price,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('FCO', 'ZAG', dateStr),
        baggageNote: 'Small cabin bag included. Priority 2 bags +€19.',
        segments: [{
          flightNumber: 'FR 3873',
          airline: 'Ryanair',
          airlineCode: 'FR',
          originAirport: 'FCO',
          destinationAirport: 'ZAG',
          departureTime: depH,
          arrivalTime: arrH,
          durationMinutes: 85,
          aircraft: 'Boeing 737 MAX 8200',
        }],
      };
    } else if (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6) {
      // Croatia Airlines direct from Rome FCO to Zagreb ZAG
      const depH = '16:30';
      const arrH = '17:55';
      zagReturnRome = {
        id: `ret-zag-fco-ou-${dateStr}`,
        originCity: 'Rome',
        originAirport: 'FCO',
        destinationCity: 'Zagreb',
        destinationAirport: 'ZAG',
        departureDate: dateStr,
        departureTime: depH,
        arrivalTime: arrH,
        durationTotalMinutes: 85,
        isDirect: true,
        stopsCount: 0,
        airline: 'Croatia Airlines',
        airlineCode: 'OU',
        flightNumber: 'OU 381',
        estimatedPriceEur: 89,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('FCO', 'ZAG', dateStr),
        baggageNote: '8kg cabin bag + personal item included.',
        segments: [{
          flightNumber: 'OU 381',
          airline: 'Croatia Airlines',
          airlineCode: 'OU',
          originAirport: 'FCO',
          destinationAirport: 'ZAG',
          departureTime: depH,
          arrivalTime: arrH,
          durationMinutes: 85,
          aircraft: 'Airbus A220-300',
        }],
      };
    } else {
      // Austrian connecting via VIE
      zagReturnRome = {
        id: `ret-zag-fco-conn-${dateStr}`,
        originCity: 'Rome',
        originAirport: 'FCO',
        destinationCity: 'Zagreb',
        destinationAirport: 'ZAG',
        departureDate: dateStr,
        departureTime: '12:35',
        arrivalTime: '16:15',
        durationTotalMinutes: 220,
        isDirect: false,
        stopsCount: 1,
        layoverAirport: 'VIE',
        layoverDurationMinutes: 55,
        airline: 'Austrian Airlines',
        airlineCode: 'OS',
        flightNumber: 'OS 504 / OS 683',
        estimatedPriceEur: 139,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('FCO', 'ZAG', dateStr),
        baggageNote: 'Carry-on included.',
        segments: [
          {
            flightNumber: 'OS 504',
            airline: 'Austrian',
            airlineCode: 'OS',
            originAirport: 'FCO',
            destinationAirport: 'VIE',
            departureTime: '12:35',
            arrivalTime: '14:15',
            durationMinutes: 100,
          },
          {
            flightNumber: 'OS 683',
            airline: 'Austrian',
            airlineCode: 'OS',
            originAirport: 'VIE',
            destinationAirport: 'ZAG',
            departureTime: '15:10',
            arrivalTime: '16:15',
            durationMinutes: 65,
          },
        ],
      };
    }

    let tlsReturnRome: FlightOption;
    if (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6 || dayOfWeek === 0) {
      // Ryanair direct from Rome FCO to Toulouse TLS
      const depH = dayOfWeek === 4 ? '16:05' : dayOfWeek === 6 ? '17:40' : dayOfWeek === 0 ? '19:50' : '09:40';
      const arrH = dayOfWeek === 4 ? '17:55' : dayOfWeek === 6 ? '19:30' : dayOfWeek === 0 ? '21:40' : '11:30';
      const price = dayOfWeek === 0 || dayOfWeek === 6 ? 48 : 32;

      tlsReturnRome = {
        id: `ret-tls-fco-fr-${dateStr}`,
        originCity: 'Rome',
        originAirport: 'FCO',
        destinationCity: 'Toulouse',
        destinationAirport: 'TLS',
        departureDate: dateStr,
        departureTime: depH,
        arrivalTime: arrH,
        durationTotalMinutes: 110,
        isDirect: true,
        stopsCount: 0,
        airline: 'Ryanair',
        airlineCode: 'FR',
        flightNumber: 'FR 7123',
        estimatedPriceEur: price,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('FCO', 'TLS', dateStr),
        baggageNote: 'Small cabin bag included. Priority trolley +€19.',
        segments: [{
          flightNumber: 'FR 7123',
          airline: 'Ryanair',
          airlineCode: 'FR',
          originAirport: 'FCO',
          destinationAirport: 'TLS',
          departureTime: depH,
          arrivalTime: arrH,
          durationMinutes: 110,
          aircraft: 'Boeing 737-800',
        }],
      };
    } else {
      // Air France connecting via CDG
      tlsReturnRome = {
        id: `ret-tls-fco-conn-${dateStr}`,
        originCity: 'Rome',
        originAirport: 'FCO',
        destinationCity: 'Toulouse',
        destinationAirport: 'TLS',
        departureDate: dateStr,
        departureTime: '12:05',
        arrivalTime: '16:50',
        durationTotalMinutes: 285,
        isDirect: false,
        stopsCount: 1,
        layoverAirport: 'CDG',
        layoverDurationMinutes: 75,
        airline: 'Air France',
        airlineCode: 'AF',
        flightNumber: 'AF 1205 / AF 7526',
        estimatedPriceEur: 146,
        cabinClass: 'Economy',
        bookingUrl: generateGoogleFlightsUrl('FCO', 'TLS', dateStr),
        baggageNote: 'Carry-on 12kg included.',
        segments: [
          {
            flightNumber: 'AF 1205',
            airline: 'Air France',
            airlineCode: 'AF',
            originAirport: 'FCO',
            destinationAirport: 'CDG',
            departureTime: '12:05',
            arrivalTime: '14:15',
            durationMinutes: 130,
          },
          {
            flightNumber: 'AF 7526',
            airline: 'Air France',
            airlineCode: 'AF',
            originAirport: 'CDG',
            destinationAirport: 'TLS',
            departureTime: '15:30',
            arrivalTime: '16:50',
            durationMinutes: 80,
          },
        ],
      };
    }

    // Build Return Rome Synchronized Match
    matches.push(createReturnSynchronizedMatch(dateStr, 'roma', tlsReturnRome, zagReturnRome));
  }

  return matches;
}

function createReturnSynchronizedMatch(
  date: string,
  destinationCity: DestinationCity,
  toulouseFlight: FlightOption,
  zagrebFlight: FlightOption
): SynchronizedMatch {
  const tlsDepMinutes = timeToMinutes(toulouseFlight.departureTime);
  const zagDepMinutes = timeToMinutes(zagrebFlight.departureTime);
  const diffMinutes = Math.abs(tlsDepMinutes - zagDepMinutes);

  let firstArrival: 'Toulouse' | 'Zagreb' | 'Simultaneous' = 'Simultaneous';
  if (tlsDepMinutes < zagDepMinutes) firstArrival = 'Toulouse'; // Daughter leaves first
  else if (zagDepMinutes < tlsDepMinutes) firstArrival = 'Zagreb'; // Mom leaves first

  const sameAirport = toulouseFlight.originAirport === zagrebFlight.originAirport;

  let syncRating: 'perfect' | 'great' | 'good' | 'moderate' = 'moderate';
  if (diffMinutes <= 45 && sameAirport) syncRating = 'perfect';
  else if (diffMinutes <= 90) syncRating = 'great';
  else if (diffMinutes <= 160) syncRating = 'good';
  else syncRating = 'moderate';

  let syncDescription = '';
  const formattedReturnDiff = formatMinutesDiff(diffMinutes);
  if (sameAirport) {
    if (diffMinutes <= 30) {
      syncDescription = `🌟 Perfect departure synchronization! Both leave from ${toulouseFlight.originAirport} within ${formattedReturnDiff} of each other.`;
    } else {
      syncDescription = `${firstArrival === 'Zagreb' ? 'Mom' : 'You'} will depart ${formattedReturnDiff} earlier from ${toulouseFlight.originAirport}. Check-in together!`;
    }
  } else {
    syncDescription = `Different departure airports (Mom at ${zagrebFlight.originAirport}, You at ${toulouseFlight.originAirport}). Say goodbye at Milano Centrale!`;
  }

  let meetingLocationTip = '';
  if (destinationCity === 'roma') {
    if (sameAirport) {
      meetingLocationTip = `Both depart from Rome Fiumicino (FCO)! Take the Leonardo Express train together from Roma Termini, check in together at FCO, and share a farewell coffee before heading to your gates.`;
    } else {
      meetingLocationTip = `Say goodbye at Roma Termini concourse before taking your respective airport transfers.`;
    }
  } else {
    if (sameAirport && toulouseFlight.originAirport === 'BGY') {
      meetingLocationTip = `Both fly out of Milan Bergamo (BGY)! Take the express shuttle together from Milano Centrale ~2.5 hours before departure, check in, and enjoy your farewell lunch at BGY.`;
    } else if (sameAirport && toulouseFlight.originAirport === 'MXP') {
      meetingLocationTip = `Both fly out of Milan Malpensa (MXP)! Take the Malpensa Express together directly from Milano Centrale to Terminal 1.`;
    } else {
      meetingLocationTip = `Mom takes the Orio Shuttle to ${zagrebFlight.originAirport} and you take the Malpensa Express to ${toulouseFlight.originAirport}. Share your farewell coffee at Milano Centrale before boarding!`;
    }
  }

  const bothDirect = toulouseFlight.isDirect && zagrebFlight.isDirect;
  const totalCombinedPriceEur = toulouseFlight.estimatedPriceEur + zagrebFlight.estimatedPriceEur;

  return {
    id: `return-sync-${destinationCity}-${date}`,
    date,
    destinationCity,
    direction: 'return',
    toulouseFlight,
    zagrebFlight,
    sameDestinationAirport: sameAirport,
    meetingAirport: sameAirport
      ? `${destinationCity === 'milano' ? 'Milan' : 'Rome'} (${toulouseFlight.originAirport})`
      : 'Milano Centrale Station',
    arrivalDifferenceMinutes: diffMinutes,
    firstArrival,
    syncRating,
    syncDescription,
    meetingLocationTip,
    totalCombinedPriceEur,
    bothDirect,
  };
}

// Backward-compatible exports for October 2026
export function getOctoberSchedules(): SynchronizedMatch[] {
  return getMatchesForMonth(2026, 10);
}

export function getOctoberReturnSchedules(): SynchronizedMatch[] {
  return getReturnMatchesForMonth(2026, 10);
}

export interface ProposedTripDate {
  destinationCity: DestinationCity;
  cityName: string;
  outboundDate: string;
  returnDate: string;
  outboundFormatted: string;
  returnFormatted: string;
  arrivalGapMinutes: number;
  gapFormatted: string;
  highlight: string;
}

/**
 * Returns the closest upcoming future synchronized flight date proposal for a given destination.
 * Never returns past dates; dynamically finds the next high-synchronization travel window (Thursday ➔ Sunday).
 */
export function getProposedBestDatesForDestination(
  destInput: string,
  minStartDate?: Date | string
): ProposedTripDate {
  const clean = (destInput || '').toLowerCase().trim();
  const isRome = clean.includes('rome') || clean.includes('roma') || clean.includes('fco');

  // Determine current reference date.
  // Trips must be in the future (at least 2 days ahead of today to allow booking).
  const base = minStartDate ? new Date(minStartDate) : new Date();
  const minDate = new Date(base.getFullYear(), base.getMonth(), base.getDate() + 2);

  // Look forward through upcoming days (up to 90 days ahead) to find the closest high-sync Thursday ➔ Sunday window.
  // Both Rome and Milan feature optimal dual-origin direct flight pairings on Thursdays with matching Sunday returns.
  let bestCandidateOutbound: Date | null = null;
  let bestCandidateReturn: Date | null = null;
  const arrivalGap = isRome ? 10 : 75;

  for (let offset = 0; offset <= 90; offset++) {
    const candidate = new Date(minDate);
    candidate.setDate(candidate.getDate() + offset);
    const dayOfWeek = candidate.getDay(); // 4 = Thursday

    if (dayOfWeek === 4) {
      bestCandidateOutbound = candidate;
      const ret = new Date(candidate);
      ret.setDate(ret.getDate() + 3); // 3 days later is Sunday (dayOfWeek === 0)
      bestCandidateReturn = ret;
      break;
    }
  }

  // Fallback safe calculation if loop didn't match (always in the future)
  if (!bestCandidateOutbound || !bestCandidateReturn) {
    bestCandidateOutbound = new Date(minDate);
    bestCandidateReturn = new Date(minDate);
    bestCandidateReturn.setDate(bestCandidateReturn.getDate() + 3);
  }

  const formatIso = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const formatHuman = (d: Date): string => {
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const outboundIso = formatIso(bestCandidateOutbound);
  const returnIso = formatIso(bestCandidateReturn);
  const outboundFormatted = formatHuman(bestCandidateOutbound);
  const returnFormatted = formatHuman(bestCandidateReturn);

  if (isRome) {
    return {
      destinationCity: 'roma',
      cityName: 'Rome (Roma)',
      outboundDate: outboundIso,
      returnDate: returnIso,
      outboundFormatted,
      returnFormatted,
      arrivalGapMinutes: arrivalGap,
      gapFormatted: formatMinutesDiff(arrivalGap),
      highlight: 'Direct flights landing at Rome FCO Terminal 3 within ~10 min of each other with Sunday evening returns'
    };
  }

  const name = clean ? (clean.charAt(0).toUpperCase() + clean.slice(1)) : 'Milan (Milano)';
  return {
    destinationCity: 'milano',
    cityName: name.includes('milan') || name.includes('milano') ? 'Milan (Milano)' : name,
    outboundDate: outboundIso,
    returnDate: returnIso,
    outboundFormatted,
    returnFormatted,
    arrivalGapMinutes: arrivalGap,
    gapFormatted: formatMinutesDiff(arrivalGap),
    highlight: 'Direct flights into Bergamo (BGY) with matching Sunday evening returns'
  };
}
