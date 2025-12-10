

import { TickerData, GPRDataPoint, ExplainerData } from './types';

export const MARKET_TICKERS: TickerData[] = [
    { symbol: 'GPR.IDX', price: '142.5', change: '+2.4%', trend: 'up' },
    { symbol: 'OIL.WTI', price: '$74.12', change: '-0.8%', trend: 'down' },
    { symbol: 'GOLD', price: '$2,541.20', change: '+0.5%', trend: 'up' },
    { symbol: 'VIX', price: '14.85', change: '-1.2%', trend: 'down' },
    { symbol: 'EUR/USD', price: '1.0920', change: '+0.1%', trend: 'up' },
    { symbol: 'SPX', price: '5,421.15', change: '+0.3%', trend: 'up' },
    { symbol: 'UST10Y', price: '3.95%', change: '-0.02%', trend: 'down' },
    { symbol: 'BTC-USD', price: '72,150.00', change: '+1.5%', trend: 'up' },
];

// Comprehensive 50-year dataset approximating the Fed GPR Index trends
export const GPR_HISTORICAL_DATA: GPRDataPoint[] = [
    // 1910s-1940s: World Wars Era
    { date: '1914', value: 200, baseline: 100, event: 'WWI Start' },
    { date: '1918', value: 180, baseline: 100, event: 'WWI End' },
    { date: '1923', value: 250, baseline: 100, event: 'Weimar Hyperinflation' },
    { date: '1929', value: 150, baseline: 100, event: 'Great Depression' },
    { date: '1939', value: 300, baseline: 100, event: 'WWII Start' },
    { date: '1941', value: 350, baseline: 100, event: 'Pearl Harbor' },
    { date: '1945', value: 200, baseline: 100, event: 'WWII End' },

    // 1950s-1960s: Cold War Early Phase
    { date: '1950', value: 220, baseline: 100, event: 'Korean War' },
    { date: '1956', value: 180, baseline: 100, event: 'Suez Crisis' },
    { date: '1962', value: 400, baseline: 100, event: 'Cuban Missile Crisis' },
    { date: '1964', value: 160, baseline: 100, event: 'Vietnam Escalation' },
    { date: '1968', value: 170, baseline: 100, event: 'Tet Offensive' },

    // 1970s - Oil Shocks
    { date: '1974', value: 150, baseline: 100, event: 'Oil Embargo' },
    { date: '1976', value: 85, baseline: 100 },
    { date: '1978', value: 92, baseline: 100 },
    { date: '1979', value: 220, baseline: 100, event: 'Iranian Revolution' },
    // 1980s - Cold War Peaks
    { date: '1981', value: 140, baseline: 100 },
    { date: '1982', value: 165, baseline: 100, event: 'Falklands War' },
    { date: '1985', value: 110, baseline: 100 },
    { date: '1987', value: 130, baseline: 100, event: 'Black Monday' },
    { date: '1989', value: 95, baseline: 100, event: 'Fall of Berlin Wall' },
    // 1990s - Gulf War & Emerging Markets
    { date: '1990', value: 280, baseline: 100, event: 'Gulf War' },
    { date: '1992', value: 120, baseline: 100 },
    { date: '1995', value: 90, baseline: 100 },
    { date: '1998', value: 135, baseline: 100, event: 'Asian Fin. Crisis' },
    { date: '1999', value: 115, baseline: 100, event: 'Kosovo War' },
    // 2000s - Terror & GFC
    { date: '2001', value: 350, baseline: 100, event: '9/11 Attacks' },
    { date: '2002', value: 200, baseline: 100 },
    { date: '2003', value: 320, baseline: 100, event: 'Iraq Invasion' },
    { date: '2005', value: 140, baseline: 100 },
    { date: '2008', value: 110, baseline: 100, event: 'GFC (Lehman)' }, 
    // 2010s - Arab Spring & Trade Wars
    { date: '2011', value: 190, baseline: 100, event: 'Arab Spring' },
    { date: '2013', value: 160, baseline: 100, event: 'Syrian Civil War' },
    { date: '2014', value: 210, baseline: 100, event: 'Crimea Annexation' },
    { date: '2016', value: 150, baseline: 100, event: 'Brexit Vote' },
    { date: '2018', value: 180, baseline: 100, event: 'US-China Trade War' },
    // 2020s - Pandemic & Renewed Conflict
    { date: '2020', value: 175, baseline: 100, event: 'COVID-19' },
    { date: '2021', value: 130, baseline: 100 },
    { date: '2022', value: 380, baseline: 100, event: 'Ukraine Invasion' },
    { date: '2023-01', value: 220, baseline: 100 },
    { date: '2023-10', value: 290, baseline: 100, event: 'Gaza Conflict' },
    { date: '2024-01', value: 260, baseline: 100, event: 'Red Sea Crisis' },
    { date: '2024-06', value: 245, baseline: 100 },
    { date: '2025-01', value: 235, baseline: 100 },
    { date: '2025-06', value: 250, baseline: 100 },
    { date: '2025-11', value: 265, baseline: 100, event: 'Indo-Pacific Tension' },
    { date: '2026-01', value: 260, baseline: 100 },
];

// --- Global Economy / Macro Datasets ---

export const INFLATION_REGION_DATA = [
    { region: 'Adv. Econ', inflation: 2.2, color: '#f97316' },
    { region: 'Em. Asia', inflation: 2.8, color: '#3b82f6' },
    { region: 'LatAm', inflation: 5.5, color: '#ef4444' },
    { region: 'ME & Cent. Asia', inflation: 8.4, color: '#b91c1c' },
    { region: 'Sub-Saharan', inflation: 10.5, color: '#991b1b' },
    { region: 'Em. Europe', inflation: 6.8, color: '#7f1d1d' },
];

export const CURRENCY_COMPOSITION_DATA = [
    { year: '2015', USD: 65, Euro: 19, Other: 7, Yen: 4, GBP: 5 },
    { year: '2021', USD: 59, Euro: 21, Other: 10, Yen: 6, GBP: 5 },
    { year: '2023', USD: 58, Euro: 20, Other: 12, Yen: 5, GBP: 5 },
    { year: '2024', USD: 58, Euro: 19, Other: 13, Yen: 5, GBP: 5 },
    { year: '2025', USD: 57, Euro: 19, Other: 14, Yen: 5, GBP: 5 },
];

export const SHIPPING_DATA = [
    { date: 'Mar-22', index: 600, freight: 450 },
    { date: 'Mar-23', index: 180, freight: 120 },
    { date: 'Jan-24', index: 350, freight: 320 }, // Red Sea Spike
    { date: 'Jun-24', index: 420, freight: 380 },
    { date: 'Dec-24', index: 380, freight: 340 },
    { date: 'Jun-25', index: 365, freight: 330 },
    { date: 'Dec-25', index: 350, freight: 310 },
    { date: 'Jan-26', index: 345, freight: 305 },
];

export const FOOD_SECURITY_DATA = [
    { region: 'Advanced', share: 15 },
    { region: 'LatAm', share: 25 },
    { region: 'Em. Asia', share: 30 },
    { region: 'ME & Cent. Asia', share: 38 },
    { region: 'Sub-Saharan', share: 45 },
];

export const FOOD_PRICE_INDEX = [
    { date: '2022', value: 143, event: 'Ukraine War' },
    { date: '2023', value: 124 },
    { date: '2024', value: 120 },
    { date: '2025', value: 125, event: 'Climate Impact' },
    { date: '2026', value: 128 },
];

export const SOCIAL_UNREST_DATA = [
    { year: '2021', index: 4.0 },
    { year: '2022', index: 6.5, event: 'CoL Crisis' },
    { year: '2023', index: 5.0 },
    { year: '2024', index: 7.5, event: 'Global Elections' },
    { year: '2025', index: 6.8 },
    { year: '2026', index: 6.2 },
];

export const UNCERTAINTY_INDEX_DATA = [
    { year: '2020', value: 55000, label: 'COVID-19' },
    { year: '2022', value: 48000, label: 'Ukraine' },
    { year: '2023', value: 35000 },
    { year: '2024', value: 42000, label: 'Elections' },
    { year: '2025', value: 39000 },
    { year: '2026', value: 41000, label: 'Tech Disruption' },
];

export const OIL_INTENSITY_DATA = [
    { year: 1990, value: 550 },
    { year: 2000, value: 450 },
    { year: 2010, value: 380 },
    { year: 2022, value: 280 },
    { year: 2024, value: 260 },
    { year: 2025, value: 250 },
];

export const RISK_REGIONS = [
    { name: 'Eastern Europe', riskLevel: 'High', trend: 'Stable' },
    { name: 'Middle East', riskLevel: 'Critical', trend: 'Escalating' },
    { name: 'South China Sea', riskLevel: 'Elevated', trend: 'Escalating' },
    { name: 'Sahel Region', riskLevel: 'High', trend: 'Unstable' },
    { name: 'Arctic Circle', riskLevel: 'Elevated', trend: 'Emerging' },
];

export const EXPLAINER_CONTENT: Record<string, ExplainerData> = {
    gpr: {
        title: 'Geopolitical Risk (GPR) Index',
        context: 'The GPR Index measures the occurrence of words related to geopolitical tensions in leading international newspapers. It is a monthly indicator widely used in academic and policy research to track global instability.',
        promptSuggestions: ['How is it calculated?', 'What are the components?', 'Correlation with oil prices']
    },
    index_bgri: {
        title: 'BlackRock Geopolitical Risk Indicator (BGRI)',
        context: 'The BGRI tracks the relative frequency of geopolitical risks mentioned in brokerage reports and financial news. It is designed to capture the market attention paid to specific geopolitical risks.',
        promptSuggestions: ['Market impact methodology', 'Key risk categories', 'Volatility relationship']
    },
    index_gdelt: {
        title: 'GDELT Project (Global Database of Events, Language, and Tone)',
        context: 'GDELT monitors the world\'s news media in over 100 languages. It uses natural language processing to identify events, locations, and actors, providing a real-time pulse of global society.',
        promptSuggestions: ['Data volume statistics', 'Event coding system', 'Sentiment analysis capabilities']
    },
    index_icews: {
        title: 'Integrated Crisis Early Warning System (ICEWS)',
        context: 'ICEWS data is produced by Lockheed Martin Advanced Technology Laboratories. It provides structured data on domestic and international events with a focus on predicting instability and conflict.',
        promptSuggestions: ['Predictive accuracy', 'Event types tracked', 'Comparison with GDELT']
    },
    transmission: {
        title: 'Impulse Response Functions (IRF)',
        context: 'In Structural Vector Autoregression (SVAR) models, IRFs map how a shock to one variable (e.g., Geopolitical Risk) transmits through other economic variables over time. This visualization simplifies that statistical process into a flow network.',
        promptSuggestions: ['Explain the lag times', 'Why does Trade impact GDP slower than Markets?', 'What is the confidence interval?']
    },
    currency: {
        title: 'Reserve Currency Composition',
        context: 'Central banks are diversifying reserves away from USD and EUR into "nontraditional" currencies (AUD, CAD, CNY, KRW) to hedge against sanctions risk and inflation. Recent data shows a gradual decline in USD share below 58%.',
        promptSuggestions: ['Implications for USD hegemony', 'Role of Gold', 'Impact of sanctions']
    },
    shipping: {
        title: 'Global Supply Chain Pressure',
        context: 'Shipping costs (Baltic Dry Index) act as a leading indicator for global inflation. After the Red Sea spikes in 2024, rates have stabilized but remain elevated due to longer transit times.',
        promptSuggestions: ['Lag time to CPI', 'Current chokepoint status', 'Near-shoring impact']
    }
};

export const TRANSMISSION_NODES = {
    event: {
        label: "Geopolitical Shock",
        desc: "Exogenous threat event (e.g., Sanctions, Embargo, Conflict).",
        stats: { "Magnitude": "2.4σ", "Duration": "3mo" },
        details: "Initial impulse generated from GPR Index spike. Acts as the primary independent variable in the SVAR model."
    },
    trade: {
        label: "Trade Channel",
        desc: "Physical disruption to supply chains and shipping routes.",
        stats: { "Vol Impact": "-12%", "Lag": "4w" },
        details: "Higher friction in physical goods movement. Increases shipping insurance premiums and delivery times."
    },
    market: {
        label: "Market Channel",
        desc: "Sentiment-driven repricing of financial assets.",
        stats: { "VIX Spike": "+35%", "Lag": "<1s" },
        details: "Instantaneous repricing of risk premia. Flight to safety (USD, Gold) and sell-off in risk assets."
    },
    supply: {
        label: "Supply Constraint",
        desc: "Shortages in key commodities or intermediate goods.",
        stats: { "PPI Input": "+1.8%", "Backlog": "High" },
        details: "Reduced availability of inputs leads to cost-push inflation pressure upstream."
    },
    finance: {
        label: "Financial Conditions",
        desc: "Tightening of credit spreads and liquidity.",
        stats: { "Spread": "+150bps", "Liquidity": "Low" },
        details: "Banks tighten lending standards, raising cost of capital for firms and households."
    },
    gdp: {
        label: "Global GDP",
        desc: "Aggregate impact on economic output.",
        stats: { "Forecast": "-0.8%", "Recov": "18mo" },
        details: "Net result of supply constraints and tighter financial conditions reducing consumption and investment."
    }
};

export const CHOKEPOINT_DATA = [
    { name: 'Strait of Hormuz', volume: 30, color: '#ef4444', impact: 25 }, // Red
    { name: 'Malacca Strait', volume: 25, color: '#f97316', impact: 15 }, // Orange
    { name: 'Suez Canal', volume: 20, color: '#eab308', impact: 12 }, // Yellow
    { name: 'Bab el-Mandeb', volume: 15, color: '#3b82f6', impact: 10 }, // Blue
    { name: 'Panama Canal', volume: 10, color: '#8b5cf6', impact: 8 }, // Purple
];

export const CHOKEPOINT_LOCATIONS = {
    'Strait of Hormuz': { lat: 26.5667, lng: 56.2500 },
    'Malacca Strait': { lat: 4.1930, lng: 100.0000 },
    'Suez Canal': { lat: 30.5852, lng: 32.2654 },
    'Bab el-Mandeb': { lat: 12.5833, lng: 43.3333 },
    'Panama Canal': { lat: 9.1190, lng: -79.7189 }
};

export const MAP_EVENT_LOCATIONS: Record<string, { lat: number; lng: number; zoom: number }> = {
    // Early 20th Century
    'WWI Start': { lat: 48.8566, lng: 2.3522, zoom: 4 },
    'WWI End': { lat: 49.42, lng: 2.82, zoom: 6 }, // Compiègne
    'Weimar Hyperinflation': { lat: 52.5200, lng: 13.4050, zoom: 6 },
    'Great Depression': { lat: 40.7128, lng: -74.0060, zoom: 4 },
    'WWII Start': { lat: 52.2297, lng: 21.0122, zoom: 5 }, // Poland
    'Pearl Harbor': { lat: 21.3445, lng: -157.9748, zoom: 7 },
    'WWII End': { lat: 52.5200, lng: 13.4050, zoom: 5 },

    // Cold War
    'Korean War': { lat: 38.0000, lng: 127.0000, zoom: 6 },
    'Suez Crisis': { lat: 30.5852, lng: 32.2654, zoom: 7 },
    'Cuban Missile Crisis': { lat: 21.5218, lng: -77.7812, zoom: 6 },
    'Vietnam Escalation': { lat: 14.0583, lng: 108.2772, zoom: 5 },
    'Tet Offensive': { lat: 10.8231, lng: 106.6297, zoom: 6 },

    // Late 20th Century
    'Oil Embargo': { lat: 23.8859, lng: 45.0792, zoom: 4 }, // Saudi Arabia focus
    'Iranian Revolution': { lat: 32.4279, lng: 53.6880, zoom: 5 },
    'Falklands War': { lat: -51.7963, lng: -59.5236, zoom: 5 },
    'Black Monday': { lat: 40.7128, lng: -74.0060, zoom: 4 }, // Wall St
    'Fall of Berlin Wall': { lat: 52.5200, lng: 13.4050, zoom: 6 },
    'Gulf War': { lat: 29.3117, lng: 47.4818, zoom: 6 }, // Kuwait
    'Asian Fin. Crisis': { lat: 15.8700, lng: 100.9925, zoom: 4 }, // Thailand/SE Asia
    'Kosovo War': { lat: 42.6026, lng: 20.9030, zoom: 7 },
    
    // 21st Century
    '9/11 Attacks': { lat: 40.7128, lng: -74.0060, zoom: 4 },
    'Iraq Invasion': { lat: 33.2232, lng: 43.6793, zoom: 5 },
    'GFC (Lehman)': { lat: 40.7128, lng: -74.0060, zoom: 3 },
    'Arab Spring': { lat: 30.0444, lng: 31.2357, zoom: 4 }, // Egypt center
    'Syrian Civil War': { lat: 34.8021, lng: 38.9968, zoom: 6 },
    'Crimea Annexation': { lat: 45.3453, lng: 34.4997, zoom: 6 },
    'Brexit Vote': { lat: 51.5074, lng: -0.1278, zoom: 5 },
    'US-China Trade War': { lat: 35.8617, lng: 104.1954, zoom: 2 },
    'COVID-19': { lat: 30.5928, lng: 114.3055, zoom: 3 }, // Wuhan origin point
    'Ukraine Invasion': { lat: 49.3794, lng: 31.1656, zoom: 5 },
    'Gaza Conflict': { lat: 31.3547, lng: 34.3088, zoom: 8 },
    'Red Sea Crisis': { lat: 14.5, lng: 42.5, zoom: 5 },
    'Indo-Pacific Tension': { lat: 23.5, lng: 119.5, zoom: 5 }
};

export const EVENT_INSIGHTS: Record<
  string,
  {
    title: string;
    subtitle: string;
    body: string;
    keyFacts: string[];
  }
> = {
  // ... (Previous historical events remain same)
  'Ukraine Invasion': {
    title: 'Ukraine Invasion (2022)',
    subtitle: 'Return of major power conflict.',
    body: 'The invasion represents a genuine war shock. Both Threats and Acts jump as escalation risk, sanctions, energy disruption and NATO spillovers all get priced in.',
    keyFacts: ['Largest jump in European GPR exposure.', 'Energy and grain markets react immediately.', 'Risk premia remain elevated long-term.']
  },
  'Gaza Conflict': {
    title: 'Gaza Conflict (2023)',
    subtitle: 'Regional Instability.',
    body: 'Renewed high-intensity conflict raising fears of regional escalation involving Iran and proxies. Shipping in the Red Sea was disrupted.',
    keyFacts: ['Red Sea shipping attacks.', 'Oil risk premium fluctuation.', 'Humanitarian crisis.']
  },
  'Red Sea Crisis': {
    title: 'Red Sea Crisis (2024)',
    subtitle: 'Shipping Disruption.',
    body: 'Houthi attacks on commercial shipping forced vessels to reroute around Africa, increasing costs and delivery times for global trade.',
    keyFacts: ['Freight rates spiked.', 'Supply chain delays.', 'Naval coalition deployment.']
  },
  'Indo-Pacific Tension': {
    title: 'Indo-Pacific Tensions (2025)',
    subtitle: 'Strategic Rivalry Escalation',
    body: 'Heightened naval activity and diplomatic standoff in the Taiwan Strait involving multiple regional powers. Markets priced in higher semiconductor supply chain risks.',
    keyFacts: ['Naval exercises intensified.', 'Tech sector volatility.', 'Diplomatic recalls.']
  }
};
