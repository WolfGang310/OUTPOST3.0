
export enum View {
    DASHBOARD = 'DASHBOARD',
    INDICES = 'INDICES',
    TRANSMISSION = 'TRANSMISSION',
    CASE_STUDIES = 'CASE_STUDIES',
    SIMULATOR = 'SIMULATOR',
    NEWS = 'NEWS',
    GLOBAL_ECONOMY = 'GLOBAL_ECONOMY',
}

export interface ExplainerData {
    title: string;
    context: string;
    promptSuggestions?: string[];
}

export interface TickerData {
    symbol: string;
    price: string;
    change: string;
    trend: 'up' | 'down';
}

export interface GPRDataPoint {
    date: string;
    value: number;
    baseline?: number;
    event?: string;
}

export interface ImpactFactor {
    category: string;
    score: number; // 0-100
    description: string;
}

export interface SimulationResult {
    gdpImpact: number;
    inflationImpact: number;
    marketVolatility: number;
    summary: string;
}

export interface NewsItem {
    headline: string;
    source: string;
    snippet: string;
    url: string;
    time: string;
    impactLevel: 'High' | 'Medium' | 'Low';
}

export interface GlobalRiskMetrics {
    gprValue: string;
    gprTrend: string; // e.g., "+5.4%"
    energyVolatility: { status: string; trend: string }; // status: High/Mod/Low
    conflictZones: { count: string; status: string };
    marketResilience: { status: string; change: string };
    supplyChain: { status: string; value: string };
    lastUpdated: string;
}

// --- Shock Scenario Interfaces ---

export interface HistoricalEvent { year: number; event: string; gdpImpact: number; }
export interface ChannelSpeed { channel: string; days: number; impact: number; }
export interface SectorExposure { sector: string; exposure: number; }
export interface RegionalRisk { region: string; risk: number; gdp: number; exposure: string; }
export interface RecoveryPath { month: number; gdp: number; }
export interface KeyRisk { risk: string; severity: 'critical' | 'high' | 'medium' | 'low'; likelihood: number; }

export interface NodeImpactData {
    magnitude: number;
    timeToImpact: string;
    confidence: 'High' | 'Medium' | 'Low';
    detail: string;
}

export interface ShockScenarioData {
  probability: number;
  probabilityLabel: string;
  gdpRange: number[];
  gdpTimeline: string;
  channelSpeeds: ChannelSpeed[];
  sectorExposure: SectorExposure[];
  regionalRisk: RegionalRisk[];
  recoveryPath: RecoveryPath[];
  keyRisks: KeyRisk[];
  mitigationEffectiveness: Record<string, number>;
  nodeImpacts?: Record<string, NodeImpactData>;
  lastUpdated?: string;
}