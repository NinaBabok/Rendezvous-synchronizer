export interface CityItem {
  id: string;
  name: string;
  city: string;
  localName?: string;
  country: string;
  airportCodes: string[];
  airportNames?: string[];
  isSynchronizedHub?: boolean;
  hubTag?: string;
  description?: string;
}

export const POPULAR_CITIES: CityItem[] = [
  {
    id: 'milan',
    name: 'Milan (Milano)',
    city: 'Milan',
    localName: 'Milano',
    country: 'Italy',
    airportCodes: ['BGY', 'MXP', 'LIN'],
    airportNames: ['Bergamo Orio al Serio (BGY)', 'Malpensa (MXP)', 'Linate (LIN)'],
    isSynchronizedHub: true,
    hubTag: 'Dual Direct Routes • High Sync',
    description: 'Ryanair & EasyJet direct from TLS & ZAG with matching weekend returns'
  },
  {
    id: 'rome',
    name: 'Rome (Roma)',
    city: 'Rome',
    localName: 'Roma',
    country: 'Italy',
    airportCodes: ['FCO', 'CIA'],
    airportNames: ['Fiumicino Leonardo da Vinci (FCO)', 'Ciampino (CIA)'],
    isSynchronizedHub: true,
    hubTag: 'Dual Direct Routes • High Sync',
    description: 'Direct flights landing at FCO Terminal 3 within 45 min gap'
  },
  {
    id: 'zagreb',
    name: 'Zagreb',
    city: 'Zagreb',
    localName: 'Zagreb',
    country: 'Croatia',
    airportCodes: ['ZAG'],
    airportNames: ['Franjo Tuđman Airport (ZAG)'],
    isSynchronizedHub: false,
    description: 'Croatia capital hub with direct routes to Milan, Rome, Frankfurt, London'
  },
  {
    id: 'toulouse',
    name: 'Toulouse',
    city: 'Toulouse',
    localName: 'Tolosa',
    country: 'France',
    airportCodes: ['TLS'],
    airportNames: ['Toulouse-Blagnac Airport (TLS)'],
    isSynchronizedHub: false,
    description: 'Occitanie capital with direct flights across Italy, Spain, UK'
  },
  {
    id: 'paris',
    name: 'Paris',
    city: 'Paris',
    localName: 'Paris',
    country: 'France',
    airportCodes: ['CDG', 'ORY', 'BVA'],
    airportNames: ['Charles de Gaulle (CDG)', 'Orly (ORY)', 'Beauvais (BVA)'],
    description: 'Major European hub with frequent flights from all cities'
  },
  {
    id: 'split',
    name: 'Split',
    city: 'Split',
    localName: 'Split',
    country: 'Croatia',
    airportCodes: ['SPU'],
    airportNames: ['Saint Jerome Split Airport (SPU)'],
    description: 'Dalmatian coast destination with coastal Mediterranean connections'
  },
  {
    id: 'dubrovnik',
    name: 'Dubrovnik',
    city: 'Dubrovnik',
    localName: 'Dubrovnik',
    country: 'Croatia',
    airportCodes: ['DBV'],
    airportNames: ['Ruđer Bošković Dubrovnik Airport (DBV)'],
    description: 'Historic Adriatic jewel with seasonal direct flights'
  },
  {
    id: 'florence',
    name: 'Florence (Firenze)',
    city: 'Florence',
    localName: 'Firenze',
    country: 'Italy',
    airportCodes: ['FLR'],
    airportNames: ['Peretola Amerigo Vespucci (FLR)'],
    description: 'Tuscany capital, connected by high-speed Frecciarossa train from Milan & Rome'
  },
  {
    id: 'venice',
    name: 'Venice (Venezia)',
    city: 'Venice',
    localName: 'Venezia',
    country: 'Italy',
    airportCodes: ['VCE', 'TSF'],
    airportNames: ['Marco Polo (VCE)', 'Treviso (TSF)'],
    description: 'Venetian lagoon city connected via fast rail to Milan Centrale'
  },
  {
    id: 'bologna',
    name: 'Bologna',
    city: 'Bologna',
    localName: 'Bologna',
    country: 'Italy',
    airportCodes: ['BLQ'],
    airportNames: ['Guglielmo Marconi Airport (BLQ)'],
    description: 'Culinary capital of Italy, 60 minutes from Milan by high-speed train'
  },
  {
    id: 'naples',
    name: 'Naples (Napoli)',
    city: 'Naples',
    localName: 'Napoli',
    country: 'Italy',
    airportCodes: ['NAP'],
    airportNames: ['Capodichino International (NAP)'],
    description: 'Southern Italy hub near Amalfi Coast and Pompeii'
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    city: 'Barcelona',
    localName: 'Barcelona',
    country: 'Spain',
    airportCodes: ['BCN'],
    airportNames: ['Josep Tarradellas Barcelona-El Prat (BCN)'],
    description: 'Catalan capital with direct routes to Toulouse, Zagreb, and Italy'
  },
  {
    id: 'madrid',
    name: 'Madrid',
    city: 'Madrid',
    localName: 'Madrid',
    country: 'Spain',
    airportCodes: ['MAD'],
    airportNames: ['Adolfo Suárez Madrid-Barajas (MAD)'],
    description: 'Central Spanish capital hub with extensive flight networks'
  },
  {
    id: 'london',
    name: 'London',
    city: 'London',
    country: 'United Kingdom',
    airportCodes: ['LHR', 'LGW', 'STN'],
    airportNames: ['Heathrow (LHR)', 'Gatwick (LGW)', 'Stansted (STN)'],
    description: 'Global metropolis with multiple international airports'
  },
  {
    id: 'frankfurt',
    name: 'Frankfurt',
    city: 'Frankfurt',
    country: 'Germany',
    airportCodes: ['FRA'],
    airportNames: ['Frankfurt am Main (FRA)'],
    description: 'Major European Lufthansa star alliance transit hub'
  },
  {
    id: 'munich',
    name: 'Munich (München)',
    city: 'Munich',
    localName: 'München',
    country: 'Germany',
    airportCodes: ['MUC'],
    airportNames: ['Franz Josef Strauss Airport (MUC)'],
    description: 'Bavarian capital with direct flights across Europe'
  },
  {
    id: 'vienna',
    name: 'Vienna (Wien)',
    city: 'Vienna',
    localName: 'Wien',
    country: 'Austria',
    airportCodes: ['VIE'],
    airportNames: ['Vienna Schwechat (VIE)'],
    description: 'Imperial Central European cultural center'
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    city: 'Amsterdam',
    country: 'Netherlands',
    airportCodes: ['AMS'],
    airportNames: ['Schiphol (AMS)'],
    description: 'Northern European hub with extensive KLM network'
  },
  {
    id: 'zurich',
    name: 'Zurich (Zürich)',
    city: 'Zurich',
    localName: 'Zürich',
    country: 'Switzerland',
    airportCodes: ['ZRH'],
    airportNames: ['Zurich Kloten (ZRH)'],
    description: 'Swiss financial and cultural hub, rail link to Milan'
  },
  {
    id: 'nice',
    name: 'Nice',
    city: 'Nice',
    country: 'France',
    airportCodes: ['NCE'],
    airportNames: ['Côte d\'Azur Airport (NCE)'],
    description: 'French Riviera gateway with coastal flights and rail'
  },
  {
    id: 'lyon',
    name: 'Lyon',
    city: 'Lyon',
    country: 'France',
    airportCodes: ['LYS'],
    airportNames: ['Saint-Exupéry Airport (LYS)'],
    description: 'French gastronomic capital with direct rail & flight options'
  },
  {
    id: 'berlin',
    name: 'Berlin',
    city: 'Berlin',
    country: 'Germany',
    airportCodes: ['BER'],
    airportNames: ['Berlin Brandenburg (BER)'],
    description: 'German capital city with diverse European links'
  },
  {
    id: 'prague',
    name: 'Prague (Praha)',
    city: 'Prague',
    localName: 'Praha',
    country: 'Czech Republic',
    airportCodes: ['PRG'],
    airportNames: ['Václav Havel Airport Prague (PRG)'],
    description: 'Bohemian historic city with direct flights across Europe'
  },
  {
    id: 'budapest',
    name: 'Budapest',
    city: 'Budapest',
    country: 'Hungary',
    airportCodes: ['BUD'],
    airportNames: ['Budapest Ferenc Liszt (BUD)'],
    description: 'Danube capital with Wizz Air and Ryanair connections'
  },
  {
    id: 'lisbon',
    name: 'Lisbon (Lisboa)',
    city: 'Lisbon',
    localName: 'Lisboa',
    country: 'Portugal',
    airportCodes: ['LIS'],
    airportNames: ['Humberto Delgado Airport (LIS)'],
    description: 'Atlantic capital with direct flights across Europe'
  }
];

export function searchCities(query: string): CityItem[] {
  const q = (query || '').trim().toLowerCase();
  if (!q) {
    return POPULAR_CITIES.slice(0, 8);
  }

  return POPULAR_CITIES.filter(c => {
    return (
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      (c.localName && c.localName.toLowerCase().includes(q)) ||
      c.country.toLowerCase().includes(q) ||
      c.airportCodes.some(code => code.toLowerCase().includes(q))
    );
  });
}
