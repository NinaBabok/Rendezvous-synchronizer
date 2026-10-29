export type DestinationCity = 'milano' | 'roma';
export type FlightDirection = 'outbound' | 'return';

export interface AirportInfo {
  code: string;
  name: string;
  city: string;
  country: string;
  terminal?: string;
  distanceToCenterKm: number;
  transitToCenterMinutes: number;
  transitCostEur: number;
  transitType: string;
}

export interface FlightSegment {
  flightNumber: string;
  airline: string;
  airlineCode: string;
  originAirport: string;
  destinationAirport: string;
  departureTime: string; // e.g. "06:45"
  arrivalTime: string; // e.g. "08:15"
  durationMinutes: number;
  aircraft?: string;
}

export interface FlightOption {
  id: string;
  originCity: 'Toulouse' | 'Zagreb' | 'Milan' | 'Rome';
  originAirport: string; // "TLS", "ZAG", "BGY", "MXP", "LIN", "FCO", "CIA"
  destinationCity: 'Toulouse' | 'Zagreb' | DestinationCity;
  destinationAirport: string; // "BGY", "MXP", "LIN", "FCO", "CIA", "TLS", "ZAG"
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // "HH:mm"
  arrivalTime: string; // "HH:mm"
  durationTotalMinutes: number;
  isDirect: boolean;
  stopsCount: number;
  layoverAirport?: string;
  layoverDurationMinutes?: number;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  estimatedPriceEur: number;
  cabinClass: string;
  bookingUrl: string;
  baggageNote: string;
  segments: FlightSegment[];
}

export interface SynchronizedMatch {
  id: string;
  date: string; // "2026-10-15"
  destinationCity: DestinationCity;
  direction?: FlightDirection;
  toulouseFlight: FlightOption;
  zagrebFlight: FlightOption;
  
  // Sync analysis
  sameDestinationAirport: boolean;
  meetingAirport: string; // e.g. "Milan Bergamo (BGY)" or "Milan Central Station"
  arrivalDifferenceMinutes: number;
  firstArrival: 'Toulouse' | 'Zagreb' | 'Simultaneous';
  syncRating: 'perfect' | 'great' | 'good' | 'moderate'; // perfect <= 45m, great <= 90m, good <= 150m
  syncDescription: string;
  meetingLocationTip: string;
  
  // Total cost for both
  totalCombinedPriceEur: number;
  bothDirect: boolean;
  
  // Optional return info
  returnMatch?: {
    returnDate: string;
    tripDays: number;
    toulouseReturn: FlightOption;
    zagrebReturn: FlightOption;
    departureDifferenceMinutes: number;
    bothDirectReturn: boolean;
    totalRoundtripPriceEur: number;
  };
}

export interface CityComparisonData {
  city: DestinationCity;
  name: string;
  tagline: string;
  weatherOctober: {
    avgTemp: string;
    rainDays: number;
    sunshineHours: number;
    clothingTip: string;
  };
  airports: AirportInfo[];
  directFlightAvailability: {
    fromZagreb: string;
    fromToulouse: string;
    verdict: string;
  };
  highlightsForMomTrip: string[];
  transitEaseScore: number; // 1-10
  approxHotelCostEurPerNight: number;
  pros: string[];
  cons: string[];
}

export interface SearchFilterState {
  destinationCity: DestinationCity;
  selectedDate: string; // "2026-10-15" or empty for all
  directOnly: boolean;
  maxArrivalGapMinutes: number;
  maxCombinedBudget: number;
  sameAirportOnly: boolean;
  tripType: 'one-way' | 'roundtrip';
  tripDurationDays: number; // 3, 4, 5, 7
}

export interface GroundingSource {
  title: string;
  url: string;
}

export type ConciergeSuggestedAction =
  | { type: 'select_date'; payload: string; label: string }
  | { type: 'switch_destination'; payload: DestinationCity; label: string }
  | { type: 'filter_direct'; payload: boolean; label: string };

export interface AIConciergeMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  groundingSources?: GroundingSource[];
  suggestedAction?: ConciergeSuggestedAction;
}

export interface ParsedTripIntent {
  traveler1Name: string;
  traveler1Origin: string; // "Toulouse (TLS)"
  traveler2Name: string;
  traveler2Origin: string; // "Zagreb (ZAG)"
  destinationCity: DestinationCity;
  month: string; // "October 2026"
  tripType: 'roundtrip' | 'one-way';
  durationDays: number;
  outboundDate: string; // "2026-10-15"
  returnDate: string; // "2026-10-18"
  summary: string;
  whyThisTrip: string;
  directOutboundAvailable: boolean;
  directReturnAvailable: boolean;
}

export interface TripScenarioConfig {
  traveler1Origin: string;
  traveler2Origin: string;
  destination: DestinationCity | 'recommend';
  duration: 'long_weekend' | 'weekend' | 'week' | 'custom';
  outboundDate: string;
  returnDate: string;
  month: string;
  travelStyle: 'relaxed' | 'fast_sync' | 'budget';
}
