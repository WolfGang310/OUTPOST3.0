

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TickerData, NewsItem, GlobalRiskMetrics, ShockScenarioData } from '../types';
import { fetchBackendCache } from './backendCacheClient';

// Initialize the API client
// Note: In a real production app, ensure API keys are handled securely via backend proxy.
const resolveApiKey = (): string => {
  // Vite injects env vars as import.meta.env; also keep process.env for server contexts.
  const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
  return (
    process.env.API_KEY ||
    process.env.GEMINI_API_KEY ||
    metaEnv.VITE_GEMINI_API_KEY ||
    metaEnv.GEMINI_API_KEY ||
    ''
  );
};

const getClient = () => new GoogleGenAI({ apiKey: resolveApiKey() });

const MODEL_NAME = 'gemini-2.5-flash';
const BACKEND_CACHE_URL = process.env.BACKEND_CACHE_URL;

type CachedBundle = {
  riskMetrics?: GlobalRiskMetrics;
  news?: NewsItem[];
  economicBrief?: string;
};

const getCachedBundle = async () => fetchBackendCache<CachedBundle>(BACKEND_CACHE_URL);

/**
 * Helper function to retry async operations with exponential backoff
 */
async function retryOperation<T>(
    operation: () => Promise<T>, 
    retries: number = 2, 
    delay: number = 1000
): Promise<T> {
    try {
        return await operation();
    } catch (error) {
        if (retries <= 0) throw error;
        
        // Check if it's likely a transient error (500s, fetch errors)
        const msg = error instanceof Error ? error.message : String(error);
        const isTransient = msg.includes('500') || msg.includes('xhr') || msg.includes('fetch') || msg.includes('network');
        
        if (!isTransient && retries < 2) throw error; // Don't retry logic errors infinitely

        console.debug(`Retrying Gemini API call... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryOperation(operation, retries - 1, delay * 2);
    }
}

export const generateExplanation = async (
  topic: string, 
  context: string
): Promise<string> => {
  try {
    const apiKey = resolveApiKey();
    if (!apiKey) {
      return "AI Insights are offline because no Gemini API key is configured. Add GEMINI_API_KEY (or VITE_GEMINI_API_KEY) to your environment and restart.";
    }
    const ai = getClient();

    const prompt = `
      You are an expert geopolitical risk analyst. 
      Explain the following concept or data point to an executive audience.
      Keep it concise (under 150 words), insightful, and professional.
      Use Google Search to ensure the explanation includes the most recent context if relevant.
      
      Topic: ${topic}
      Context: ${context}
    `;

    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    }));

    return response.text || "Analysis currently unavailable.";
  } catch (error) {
    console.warn("Explanation Generation Error:", error instanceof Error ? error.message : "Unknown error");
    return "Unable to generate analysis at this time. Please check your network connection.";
  }
};

export const generateSimulationResult = async (
    inputs: Record<string, number | string>
): Promise<string> => {
    try {
        const apiKey = resolveApiKey();
        if (!apiKey) {
            return "Simulation unavailable: missing Gemini API key. Set GEMINI_API_KEY (or VITE_GEMINI_API_KEY) and reload.";
        }
        const ai = getClient();

        const prompt = `
            Act as an economic simulation engine.
            Analyze the following scenario inputs and predict the immediate (1-3 month) impact on global markets.
            
            Inputs:
            ${Object.entries(inputs).map(([k, v]) => `- ${k}: ${v}`).join('\n')}
            
            Provide a brief executive summary (max 3 sentences) focusing on GDP, Inflation, and Market Volatility.
        `;

        const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        }));

        return response.text || "Simulation details unavailable.";
    } catch (error) {
        console.error("Simulation Error", error);
        return "Simulation failed to run.";
    }
}

export const fetchLiveMarketData = async (currentTickers: TickerData[]): Promise<{data: TickerData[], sources: string[]}> => {
    try {
        const apiKey = resolveApiKey();
        if (!apiKey) {
            return { data: currentTickers, sources: [] };
        }
        const ai = getClient();

        const symbols = currentTickers.map(t => t.symbol).join(', ');
        const prompt = `
            Fetch the latest real-time market price and percentage change for these financial instruments: ${symbols}.
            For 'GPR.IDX', try to find the most recent Geopolitical Risk Index value or a similar proxy if exact real-time data is unavailable.
            
            Return the data strictly as a valid JSON array of objects with keys: "symbol", "price", "change", "trend".
            - "symbol": matching the input symbol.
            - "price": current price (string with currency symbol).
            - "change": 24h change (string with %).
            - "trend": "up" if change is positive, "down" if negative.
            
            Example format: [{"symbol": "SPX", "price": "5,200.00", "change": "+0.5%", "trend": "up"}]
            Do not include markdown formatting code blocks. Just the JSON string.
        `;

        const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        }));

        const sources: string[] = [];
        if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
                if (chunk.web?.uri) sources.push(chunk.web.uri);
            });
        }

        const text = response.text || '';
        const jsonMatch = text.match(/\[.*\]/s);
        const jsonStr = jsonMatch ? jsonMatch[0] : text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
             const data = JSON.parse(jsonStr);
             if (Array.isArray(data)) {
                 const mappedData = data.map((item: any) => ({
                     symbol: item.symbol || 'UNKNOWN',
                     price: item.price || 'N/A',
                     change: item.change || '0%',
                     trend: (item.trend === 'up' || item.trend === 'down') ? item.trend : 'up'
                 }));
                 return { data: mappedData, sources: [...new Set(sources)] };
             }
        } catch (e) {
            console.warn("Failed to parse market data JSON. Using cached data.");
        }
        return { data: currentTickers, sources: [] };
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (msg.includes('429')) {
             console.warn("API Quota Reached (429). Switching to offline mode.");
        } else if (msg.includes('500') || msg.includes('xhr')) {
             console.warn("Live market data unavailable (Network Error). Using cached data.");
        } else {
             console.error("Market Data Error:", msg);
        }
        return { data: currentTickers, sources: [] };
    }
}

export const fetchNews = async (): Promise<NewsItem[]> => {
    try {
        const cached = await getCachedBundle();
        if (cached?.data?.news && Array.isArray(cached.data.news) && cached.data.news.length > 0) {
            return cached.data.news;
        }

        const apiKey = resolveApiKey();
        if (!apiKey) {
            return [];
        }
        const ai = getClient();

        const prompt = `
            Find the top 6 most important and recent geopolitical news headlines that could impact global markets today.
            Focus on conflicts, trade policy, energy supply, and central bank moves.
            
            Return a JSON array of objects with the following keys:
            - "headline": The title of the news.
            - "source": The publisher name.
            - "snippet": A very short summary (max 15 words).
            - "time": How long ago (e.g., "2h ago").
            - "impactLevel": "High", "Medium", or "Low" based on potential market impact.
            
            Strict JSON format only.
        `;

        const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        }));

        const text = response.text || '';
        const jsonMatch = text.match(/\[.*\]/s);
        const jsonStr = jsonMatch ? jsonMatch[0] : text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(jsonStr);
        
        // Extract URLs from grounding metadata if available to link sources
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        return data.map((item: any, index: number) => ({
            ...item,
            url: chunks[index]?.web?.uri || '#'
        }));

    } catch (error) {
        if (String(error).includes('429')) {
            console.warn("Quota exceeded (News). Using fallback.");
            return [
                { headline: "Market Volatility Continues Amid Global Uncertainty", source: "Offline Feed", snippet: "System is in offline mode due to API limits.", time: "Now", impactLevel: "Medium", url: "#" },
                { headline: "Central Banks Signal Caution on Rate Cuts", source: "Offline Feed", snippet: "Inflation remains sticky in key sectors.", time: "1h ago", impactLevel: "High", url: "#" }
            ];
        }
        console.warn("News Fetch Error:", error instanceof Error ? error.message : "Unknown error");
        return [
            { headline: "Live news feed temporarily unavailable", source: "System", snippet: "Check connection or try again later.", url: "#", time: "Now", impactLevel: "Low" }
        ];
    }
}

export const fetchGlobalRiskMetrics = async (): Promise<GlobalRiskMetrics | null> => {
    try {
        const cached = await getCachedBundle();
        if (cached?.data?.riskMetrics) {
            return cached.data.riskMetrics;
        }

        const apiKey = resolveApiKey();
        if (!apiKey) {
            return null;
        }
        const ai = getClient();

        const prompt = `
            Use Google Search to find the latest available data (late 2025 or early 2026) for the following global risk indicators:
            1. Geopolitical Risk Index (GPR) approximate current value.
            2. Current status of Global Energy Market Volatility (High/Moderate/Low) and trend.
            3. Approximate number of major active conflict zones worldwide.
            4. Global Supply Chain Pressure status.
            5. Global Market Resilience/Sentiment (S&P 500 or MSCI World trend).

            Return a strictly valid JSON object with keys:
            - "gprValue": string (e.g., "185.4")
            - "gprTrend": string (e.g., "+2.1%")
            - "energyVolatility": { "status": string, "trend": string }
            - "conflictZones": { "count": string, "status": string } (e.g., "6", "Active")
            - "marketResilience": { "status": string, "change": string } (e.g., "Mod", "+1.2%")
            - "supplyChain": { "status": string, "value": string } (e.g., "Strained", "94%")
            - "lastUpdated": string (current month/year)
        `;

        const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        }));

        const text = response.text || '';
        const jsonMatch = text.match(/\{.*\}/s);
        const jsonStr = jsonMatch ? jsonMatch[0] : text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonStr);
    } catch (error) {
        if (String(error).includes('429')) {
             console.warn("Quota exceeded (Metrics). Using fallback.");
             return {
                 gprValue: "185.4",
                 gprTrend: "+2.1%",
                 energyVolatility: { status: "Moderate", trend: "Stable" },
                 conflictZones: { count: "5", status: "Active" },
                 marketResilience: { status: "High", change: "+1.2%" },
                 supplyChain: { status: "Stable", value: "95%" },
                 lastUpdated: "Offline Mode"
             };
        }
        console.warn("Risk Metrics Fetch Error:", error);
        return null;
    }
}

export const generateDailyBriefImage = async (): Promise<string | null> => {
    try {
        // Use a new instance to ensure we pick up the key if set late
        const imgAi = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

        // Step 1: Get Context Ingredients
        const contextPrompt = `
            Find 5 interesting, positive, or notable short facts/events for today or this week (mix of world news, tech, weather, or a fun fact).
            Return them as a simple, comma-separated list of strings. Do not use bullets or numbers.
        `;

        const contextResponse = await imgAi.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contextPrompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        const ingredients = contextResponse.text || "Global markets update, Tech innovation, Sunny weather, Coffee break, Learning AI";

        // Step 2: Generate Image
        const imagePrompt = `
            Create a fun, hand-drawn infographic on a whiteboard, visualized in colorful dry-erase marker style. 
            The title at the top should be today's date in bold blue marker, slightly imperfect, with playful doodles and underlines.

            The whiteboard layout is arranged like a recipe: hand-sketched boxes, arrows, and callouts drawn in red, blue, green, and black marker ink. 
            Each ingredient is written in big, casual lettering with little cartoon icons beside it. 
            Do not mention the word "recipe" anywhere, it's just a whiteboard of things that can boost the user's mood or day.

            There should be 5 ingredients based on these topics: ${ingredients}.

            The composition feels casual and authentic — marker smudges, erased lines, arrows looping around, little bursts of color and motion lines. 
            Typography is uneven and hand-lettered, as if drawn quickly in a creative meeting.

            Style: white background of a dry-erase board, vivid marker colors (blue, red, green, black), slightly glossy surface reflections, natural shadows. energetic, authentic hand-drawn doodle aesthetic.
        `;

        const response = await imgAi.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [{ text: imagePrompt }]
            }
        });

        // Extract image
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Image Gen Error", error);
        return null;
    }
}

export const fetchEconomicBriefing = async (): Promise<string> => {
    try {
        const cached = await getCachedBundle();
        if (cached?.data?.economicBrief) {
            return cached.data.economicBrief;
        }

        const apiKey = resolveApiKey();
        if (!apiKey) {
            return "Live briefing unavailable: missing Gemini API key. Set GEMINI_API_KEY (or VITE_GEMINI_API_KEY) and reload.";
        }
        const ai = getClient();

        const prompt = `
            Perform a google search for the 'latest global economic outlook 2025 2026 summary'.
            Focus on: Global Inflation trends, Red Sea shipping impact, and Geopolitical Uncertainty.
            
            Provide a concise, 3-sentence executive summary of the current state of the global economy based on this search.
            Do not include introductory phrases like "Based on the search results". Just the summary.
        `;

        const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        }));

        return response.text || "Global economy shows resilience despite shipping disruptions and sticky inflation in services sectors. Geopolitical risks remain the primary downside threat to growth in 2026.";
    } catch (error) {
        return "Offline Mode: Global economy shows resilience despite shipping disruptions. Geopolitical risks remain elevated.";
    }
}

export const fetchShockScenarioAnalysis = async (scenarioName: string, description: string): Promise<Partial<ShockScenarioData> | null> => {
    try {
        const apiKey = resolveApiKey();
        if (!apiKey) {
            return null;
        }
        const ai = getClient();

        const prompt = `
            Analyze the economic impact of a "${scenarioName}" shock (${description}) based on CURRENT real-time global economic conditions (late 2025/2026).
            Use Google Search to find recent data on correlation, supply chain vulnerabilities, and regional exposures.

            Return a strictly valid JSON object representing the transmission model parameters:
            
            1. "probability": Number (0-1) representing annual probability of this shock occurring/escalating now.
            2. "gdpRange": [min, max] percentage impact on Global GDP (negative numbers).
            3. "channelSpeeds": Array of 5 objects { "channel": string, "days": number (reaction time), "impact": number (0-100 magnitude) }. Channels must include: "Stock Markets", "Energy", "Credit", "Trade", "Employment".
            4. "sectorExposure": Array of 5 objects { "sector": string, "exposure": number (-100 to 100) }. Find most affected sectors.
            5. "regionalRisk": Array of 4 objects { "region": string, "risk": number (0-100), "gdp": number (negative %), "exposure": "High"|"Medium"|"Low"|"Very High" }. Regions: "Europe", "North America", "Asia Pacific", "Emerging Markets".
            6. "keyRisks": Array of 4 objects { "risk": string, "severity": "critical"|"high"|"medium"|"low", "likelihood": number (0-1) }.
            7. "mitigationEffectiveness": Object with 4 keys (strategies) and number values (0-100 effectiveness).
            8. "nodeImpacts": Object where keys are node IDs (shock, energy, commodities, equities, credit, manufacturing, trade, banking, employment, consumption, investment, gdp) and values are { "magnitude": number (0-100), "timeToImpact": string, "confidence": "High"|"Medium"|"Low", "detail": string }. Provide specific details for each node in the context of this shock.

            Format strictly as JSON. No markdown.
        `;

        const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        }));

        const text = response.text || '';
        const jsonMatch = text.match(/\{.*\}/s);
        const jsonStr = jsonMatch ? jsonMatch[0] : text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(jsonStr);
        return {
            ...data,
            lastUpdated: new Date().toLocaleDateString()
        };
    } catch (error) {
        console.warn("Scenario Analysis Error:", error);
        return null;
    }
}
