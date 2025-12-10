import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8788;
const CACHE_FILE = path.join(__dirname, 'daily-search-cache.json');
const MODEL_NAME = 'gemini-2.5-flash';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || '' });

const toET = (date) => new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
const isSameETDay = (a, b) => toET(a).toLocaleDateString() === toET(b).toLocaleDateString();

const msUntilNextETMidnight = () => {
  const etNow = toET(new Date());
  const next = new Date(etNow);
  next.setHours(24, 0, 0, 0);
  return Math.max(next.getTime() - etNow.getTime(), 0);
};

const readCache = () => {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[cache] Failed to read cache file:', err.message);
    return null;
  }
};

const writeCache = (data) => {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[cache] Failed to write cache file:', err.message);
  }
};

const fetchSearchBundle = async () => {
  const prompt = `
    Use Google Search to collect the latest (past 24h) macro/geo insights.
    Return STRICT JSON with keys:
    {
      "riskMetrics": {
        "gprValue": string,
        "gprTrend": string,
        "energyVolatility": { "status": string, "trend": string },
        "conflictZones": { "count": string, "status": string },
        "marketResilience": { "status": string, "change": string },
        "supplyChain": { "status": string, "value": string },
        "lastUpdated": string
      },
      "news": [
        { "headline": string, "source": string, "snippet": string, "time": string, "impactLevel": "High"|"Medium"|"Low", "url": string }
      ],
      "economicBrief": string
    }
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: { tools: [{ googleSearch: {} }] }
  });

  const text = response.text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? jsonMatch[0] : text.trim();
  return JSON.parse(jsonStr);
};

let cacheState = readCache();

const refreshCache = async (force = false) => {
  const needsRefresh =
    force ||
    !cacheState ||
    !cacheState.fetchedAt ||
    !cacheState.data ||
    !isSameETDay(new Date(cacheState.fetchedAt), new Date());

  if (!needsRefresh) return cacheState;

  try {
    const data = await fetchSearchBundle();
    cacheState = { fetchedAt: Date.now(), data };
    writeCache(cacheState);
  } catch (err) {
    console.error('[cache] Refresh failed:', err.message);
  }
  return cacheState;
};

const json = (res, status, payload) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
};

const scheduleMidnightRefresh = () => {
  const waitMs = msUntilNextETMidnight();
  setTimeout(async () => {
    await refreshCache(true);
    scheduleMidnightRefresh();
  }, waitMs);
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const url = new URL(req.url || '', `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/api/search-cache') {
    const force = url.searchParams.get('force') === '1';
    const cached = await refreshCache(force);

    const nextRefreshMs = msUntilNextETMidnight();
    json(res, 200, {
      fetchedAt: cached?.fetchedAt || null,
      nextRefreshMs,
      nextRefreshMinutes: Math.round(nextRefreshMs / 60000),
      data: cached?.data || null
    });
    return;
  }

  json(res, 404, { error: 'Not found' });
});

// Prime cache on startup and schedule nightly refresh at 12:00 a.m. ET
refreshCache().finally(scheduleMidnightRefresh);

server.listen(PORT, () => {
  console.log(`[cache] Daily search cache server running on port ${PORT}`);
});
