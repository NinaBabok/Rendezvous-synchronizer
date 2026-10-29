import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Natural Language Trip Intent Parser
app.post('/api/parse-trip-intent', async (req, res) => {
  try {
    const { naturalLanguageQuery } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        success: false,
        message: 'Gemini API key is not configured.',
      });
    }

    const prompt = `
You are an expert AI Travel Assistant specializing in dual-origin flight rendezvous coordination.
Analyze this user's trip request:
"${naturalLanguageQuery}"

Extract the trip parameters:
1. Destination city: Map to "milano" if Milan/Milano is requested, "roma" if Rome/Roma is requested, or specify the requested city.
2. Outbound Date: Formatted YYYY-MM-DD (e.g. "2026-10-15", "2026-10-08", "2026-10-22", or whatever date is mentioned)
3. Return Date: Formatted YYYY-MM-DD (e.g. "2026-10-18", "2026-10-11", "2026-10-25", or whatever date is mentioned)
4. Trip duration in days: number (e.g. 4 for 4-day long weekend)
5. Traveler 1 Origin: User's departure city/airport (e.g. "Toulouse (TLS)", "Paris", "London", etc.)
6. Traveler 2 Origin: Companion's departure city/airport (e.g. "Zagreb (ZAG)", "Split", "Dubrovnik", etc.)
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      data: parsedJson,
    });
  } catch (error: any) {
    console.error('Error in /api/parse-trip-intent:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to parse trip intent',
    });
  }
});

// AI Real-time Flight Search & Itinerary Analysis Endpoint
app.post('/api/flight-sync/ai-search', async (req, res) => {
  try {
    const { destinationCity, travelDate, userQuery } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        success: false,
        message: 'Gemini API key is not configured in environment secrets.',
        analysis: null,
      });
    }

    const prompt = `
You are an expert European flight logistics and rendezvous travel coordinator.
A mother and daughter are planning a rendezvous trip in October:
- Traveler 1 (Daughter, Nikolina): Origin Toulouse, France (TLS - Toulouse-Blagnac).
- Traveler 2 (Mother): Origin Zagreb, Croatia (ZAG - Franjo Tuđman Airport).
- Target Destinations: ${destinationCity === 'roma' ? 'Rome (Roma - FCO/CIA)' : 'Milan (Milano - MXP/BGY/LIN)'} or comparing both.
- Target Date: ${travelDate || 'October'}
- Specific Question / Request: "${userQuery || 'Find best direct flight schedules on the same day for both Zagreb and Toulouse to meet in Italy in October, compare arrival times, and provide airport meeting tips.'}"

Task:
1. Search current airline schedules and routes between (TLS -> Milan/Rome) and (ZAG -> Milan/Rome) focusing on direct low-cost carriers (Ryanair, easyJet, Croatia Airlines, Volotea) and legacy carriers (Air France, Lufthansa).
2. Detail the exact days of the week in October with direct flights from both origins.
3. Compare arrival synchronization (landing within 30-90 minutes of each other).
4. Provide concrete meeting location recommendations (e.g. terminal meeting spots, Leonardo Express train from FCO, or meeting at Milano Centrale if one lands at BGY and one at MXP).
5. Give a crisp verdict on whether Milan or Rome is better suited for their specific rendezvous.

Format your response in structured Markdown with clear headings, bullet points, and practical tips for mom & daughter.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      },
    });

    const analysisText = response.text || '';
    
    // Extract search grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .map((chunk: any) => ({
        title: chunk.web?.title || 'Flight & Travel Reference',
        url: chunk.web?.uri || '',
      }))
      .filter((source: any) => source.url);

    return res.json({
      success: true,
      analysis: analysisText,
      sources: webSources,
    });
  } catch (error: any) {
    console.error('Error in /api/flight-sync/ai-search:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate flight analysis',
    });
  }
});

// AI Travel Concierge Chat Endpoint
app.post('/api/ask-concierge', async (req, res) => {
  try {
    const { messages, context } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        success: false,
        reply: 'Gemini API key is not configured. Please verify your environment secrets.',
      });
    }

    const lastMessage = messages[messages.length - 1]?.content || 'Hello';

    const activeRouteContext =
      context?.traveler1Origin && context?.traveler2Origin
        ? `- Traveler 1 Departure: ${context.traveler1Origin}\n- Traveler 2 Departure: ${context.traveler2Origin}\n- Meeting Destination: ${context.destinationName || context.destinationCity || 'Not selected yet'}`
        : `- The user has not locked in specific departure cities yet; provide general, helpful advice applicable to any dual-origin flight meetup.`;

    const systemInstruction = `
You are the "Flight Rendezvous Concierge", an expert travel assistant helping two travelers flying from different departure cities synchronize their flights, coordinate arrival times, choose meeting destinations, and plan smooth airport transfers.

Current Trip Context:
${activeRouteContext}
- Selected Date: ${context?.selectedDate || 'Flexible'}

Keep responses concise, welcoming, practical, and accurate regarding airport terminals, transit into the city center, airline baggage rules, and tips for meeting up smoothly. Do not assume or mention specific departure cities unless the user explicitly mentions them or they are listed in Current Trip Context above.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser Question: ${lastMessage}` }],
        },
      ],
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      },
    });

    const replyText = response.text || 'I could not generate an answer right now.';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .map((chunk: any) => ({
        title: chunk.web?.title || 'Travel Source',
        url: chunk.web?.uri || '',
      }))
      .filter((s: any) => s.url);

    return res.json({
      success: true,
      reply: replyText,
      sources: webSources,
    });
  } catch (error: any) {
    console.error('Error in /api/ask-concierge:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process concierge inquiry',
    });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Flight Rendezvous server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
