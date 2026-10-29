import type { GroundingSource } from './types';
import { isRecord } from './utils';

const API_KEY_STORAGE_KEY = 'rendezvous.geminiApiKey';
const GEMINI_MODEL = 'gemini-3.8-flash';

interface GeminiGenerationOptions {
  temperature: number;
  responseMimeType?: string;
  useGoogleSearch?: boolean;
}

interface GeminiGenerationResult {
  text: string;
  sources: GroundingSource[];
}

export function getGeminiApiKey(): string {
  try {
    return window.localStorage.getItem(API_KEY_STORAGE_KEY)?.trim() ?? '';
  } catch {
    return '';
  }
}

export function saveGeminiApiKey(apiKey: string): void {
  window.localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
}

export function removeGeminiApiKey(): void {
  window.localStorage.removeItem(API_KEY_STORAGE_KEY);
}

async function generateGeminiContent(
  prompt: string,
  options: GeminiGenerationOptions,
): Promise<GeminiGenerationResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Add your Gemini API key using the API Key button in the header.');
  }

  const generationConfig: Record<string, unknown> = {
    temperature: options.temperature,
  };
  if (options.responseMimeType) generationConfig.responseMimeType = options.responseMimeType;

  const requestBody: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig,
  };
  if (options.useGoogleSearch) requestBody.tools = [{ google_search: {} }];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    },
  );

  const responseData: unknown = await response.json();
  if (!response.ok) {
    const errorMessage =
      isRecord(responseData) && isRecord(responseData.error) && typeof responseData.error.message === 'string'
        ? responseData.error.message
        : `Gemini request failed (${response.status}).`;
    throw new Error(errorMessage);
  }

  const candidate =
    isRecord(responseData) && Array.isArray(responseData.candidates) && isRecord(responseData.candidates[0])
      ? responseData.candidates[0]
      : null;
  const content = candidate && isRecord(candidate.content) ? candidate.content : null;
  const parts = content && Array.isArray(content.parts) ? content.parts : [];
  const text = parts
    .filter(isRecord)
    .map((part) => part.text)
    .filter((part): part is string => typeof part === 'string')
    .join('\n');

  const metadata = candidate && isRecord(candidate.groundingMetadata)
    ? candidate.groundingMetadata
    : null;
  const chunks = metadata && Array.isArray(metadata.groundingChunks)
    ? metadata.groundingChunks
    : [];
  const sources = chunks
    .filter(isRecord)
    .map((chunk) => (isRecord(chunk.web) ? chunk.web : null))
    .filter((web): web is Record<string, unknown> => web !== null && typeof web.uri === 'string')
    .map((web) => ({
      title: typeof web.title === 'string' ? web.title : 'Gemini source',
      url: web.uri as string,
    }));

  if (!text) throw new Error('Gemini returned an empty response. Check your API key and try again.');
  return { text, sources };
}

export async function parseTripIntent(naturalLanguageQuery: string): Promise<unknown> {
  const prompt = `
You are an expert AI Travel Assistant specializing in dual-origin flight rendezvous coordination.
Analyze this user's trip request:
"${naturalLanguageQuery}"

Extract the trip parameters:
1. Destination city: Map to "milano" if Milan/Milano is requested, "roma" if Rome/Roma is requested, or specify the requested city.
2. Outbound Date: Formatted YYYY-MM-DD.
3. Return Date: Formatted YYYY-MM-DD.
4. Trip duration in days: number.
5. Traveler 1 Origin: User's departure city/airport.
6. Traveler 2 Origin: Companion's departure city/airport.
7. Summary: A warm, clear 2-sentence summary of the synchronized trip plan with both origins and destination.
8. Why this trip works: Key rationale on flight synchronization, landing/takeoff gap, and airport logistics.

Respond ONLY with valid JSON in this exact structure:
{
  "destinationCity": "milano",
  "destinationName": "Milan, Italy",
  "outboundDate": "2026-10-15",
  "returnDate": "2026-10-18",
  "durationDays": 4,
  "traveler1Origin": "Toulouse (TLS)",
  "traveler2Origin": "Zagreb (ZAG)",
  "summary": "...",
  "whyThisTrip": "..."
}
`;
  const result = await generateGeminiContent(prompt, {
    temperature: 0.1,
    responseMimeType: 'application/json',
  });

  try {
    const data: unknown = JSON.parse(result.text);
    if (!isRecord(data)) throw new Error('Gemini did not return a JSON object.');
    return { success: true, data };
  } catch {
    throw new Error('Could not read Gemini response as trip details. Please try again.');
  }
}

export async function searchLiveFlights(
  destinationCity: string,
  travelDate: string,
  userQuery: string,
): Promise<unknown> {
  const prompt = `
You are an expert European flight logistics and rendezvous travel coordinator.
A mother and daughter are planning a rendezvous trip:
- Traveler 1 (Daughter, Nikolina): Origin Toulouse, France (TLS - Toulouse-Blagnac).
- Traveler 2 (Mother): Origin Zagreb, Croatia (ZAG - Franjo Tuđman Airport).
- Target Destinations: ${destinationCity === 'roma' ? 'Rome (Roma - FCO/CIA)' : 'Milan (Milano - MXP/BGY/LIN)'} or comparing both.
- Target Date: ${travelDate || 'Flexible'}
- Specific Question / Request: "${userQuery || 'Find best direct flight schedules on the same day for both Zagreb and Toulouse to meet in Italy, compare arrival times, and provide airport meeting tips.'}"

Task:
1. Search current airline schedules and routes between (TLS -> Milan/Rome) and (ZAG -> Milan/Rome) focusing on direct low-cost carriers and legacy carriers.
2. Detail the exact days of the week with direct flights from both origins.
3. Compare arrival synchronization (landing within 30-90 minutes of each other).
4. Provide concrete meeting location recommendations.
5. Give a crisp verdict on whether Milan or Rome is better suited for their specific rendezvous.

Format your response in structured Markdown with clear headings, bullet points, and practical tips.
`;
  const result = await generateGeminiContent(prompt, {
    temperature: 0.2,
    useGoogleSearch: true,
  });
  return { success: true, analysis: result.text, sources: result.sources };
}

export interface ConciergeContext {
  destinationCity: string;
  destinationName?: string | undefined;
  traveler1Origin?: string | undefined;
  traveler2Origin?: string | undefined;
  selectedDate?: string | undefined;
}

export async function askGeminiConcierge(
  messages: Array<{ role: string; content: string }>,
  context: ConciergeContext,
): Promise<unknown> {
  const lastMessage = messages.at(-1)?.content || 'Hello';
  const activeRouteContext =
    context.traveler1Origin && context.traveler2Origin
      ? `- Traveler 1 Departure: ${context.traveler1Origin}\n- Traveler 2 Departure: ${context.traveler2Origin}\n- Meeting Destination: ${context.destinationName || context.destinationCity}`
      : '- The user has not selected departure cities yet; provide general dual-origin travel advice.';
  const prompt = `
You are the "Flight Rendezvous Concierge", an expert travel assistant helping two travelers flying from different departure cities synchronize flights, coordinate arrival times, choose meeting destinations, and plan airport transfers.

Current Trip Context:
${activeRouteContext}
- Selected Date: ${context.selectedDate || 'Flexible'}

Keep responses concise, welcoming, practical, and accurate regarding airport terminals, transit, airline baggage rules, and meeting up smoothly. Do not assume specific departure cities unless the user mentions them or they are listed above.

User Question: ${lastMessage}
`;
  const result = await generateGeminiContent(prompt, {
    temperature: 0.3,
    useGoogleSearch: true,
  });
  return { success: true, reply: result.text, sources: result.sources };
}
