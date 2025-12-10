import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, Cell,
  PieChart, Pie, ComposedChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Flame, CheckCircle, Info, HelpCircle, 
  ChevronDown, ChevronUp, X, Copy, RotateCcw, Play, BookOpen, BarChart3, PieChart as PieChartIcon,
  Globe, DollarSign, Building2, Factory, ShoppingCart, Plane, Cpu, Home, Zap, Users,
  ArrowRight, ArrowUpRight, ArrowDownRight, Minus, Clock, Target, Shield, Lightbulb,
  TrendingUp as Growth, Activity, Layers, GitBranch, Eye, Settings, Database, FileText
} from 'lucide-react';
import DataSourceTooltip from './DataSourceTooltip';
import TechCard from './TechCard';

const ECONOMIC_PARAMETERS = {
  oilPrices: {
    name: 'Oil Prices',
    icon: Zap,
    unit: '$/barrel',
    min: 30,
    max: 150,
    default: 75,
    description: 'Crude oil price per barrel - a fundamental input cost affecting virtually all economic sectors',
    detailedExplanation: `Oil prices are one of the most influential economic variables globally. As a primary energy source and raw material for countless products, oil price changes ripple through the entire economy.

**Why Oil Matters:**
• Transportation costs for goods and services
• Manufacturing input costs (plastics, chemicals)
• Heating and electricity generation
• Agricultural production (fertilizers, machinery)

**Price Drivers:**
• OPEC+ production decisions
• Geopolitical tensions in oil-producing regions
• Global demand fluctuations
• Currency exchange rates (oil priced in USD)
• Strategic reserve releases
• Renewable energy adoption rates`,
    impacts: [
      { sector: 'Transportation', effect: 'Direct cost increase', sensitivity: 'Very High' },
      { sector: 'Manufacturing', effect: 'Input cost pressure', sensitivity: 'High' },
      { sector: 'Consumer Goods', effect: 'Price pass-through', sensitivity: 'Medium' },
      { sector: 'Airlines', effect: 'Major cost component (30-40%)', sensitivity: 'Critical' },
      { sector: 'Agriculture', effect: 'Fertilizer & fuel costs', sensitivity: 'High' }
    ],
    historicalEvents: [
      { year: '1973', event: 'Arab Oil Embargo', price: '$12→$48', impact: 'Global recession, stagflation' },
      { year: '1979', event: 'Iranian Revolution', price: '$15→$40', impact: 'Double-dip recession' },
      { year: '2008', event: 'Peak before crash', price: '$147', impact: 'Contributed to financial crisis' },
      { year: '2020', event: 'COVID demand collapse', price: '-$37 (briefly)', impact: 'Historic negative prices' },
      { year: '2022', event: 'Ukraine conflict', price: '$130+', impact: 'European energy crisis' }
    ],
    color: '#f59e0b'
  },
  interestRates: {
    name: 'Interest Rates',
    icon: Building2,
    unit: '%',
    min: 0,
    max: 15,
    default: 5,
    description: 'Central bank policy rate - the primary tool for controlling inflation and economic growth',
    detailedExplanation: `Interest rates set by central banks (Federal Reserve, ECB, etc.) are the most powerful lever for economic management. They affect borrowing costs throughout the economy.

**Transmission Mechanisms:**
• Mortgage rates → Housing market activity
• Corporate borrowing → Business investment
• Consumer credit → Spending patterns
• Currency value → Import/export competitiveness
• Asset valuations → Wealth effect

**Key Concepts:**
• Real vs. nominal rates (adjusted for inflation)
• Yield curve shape (inverted = recession signal)
• Neutral rate (neither stimulative nor restrictive)
• Forward guidance (central bank communication)`,
    impacts: [
      { sector: 'Real Estate', effect: 'Mortgage affordability', sensitivity: 'Critical' },
      { sector: 'Banking', effect: 'Net interest margins', sensitivity: 'Very High' },
      { sector: 'Technology', effect: 'Growth stock valuations', sensitivity: 'Very High' },
      { sector: 'Utilities', effect: 'Debt servicing costs', sensitivity: 'High' },
      { sector: 'Consumer Durables', effect: 'Financing costs', sensitivity: 'High' }
    ],
    historicalEvents: [
      { year: '1981', event: 'Volcker shock', price: '20%', impact: 'Crushed inflation, caused recession' },
      { year: '2001', event: 'Dot-com response', price: '1%', impact: 'Housing bubble seeds' },
      { year: '2008-15', event: 'Zero interest rate policy', price: '0-0.25%', impact: 'Unprecedented stimulus' },
      { year: '2022-23', event: 'Fastest hikes in 40 years', price: '0→5.5%', impact: 'Banking stress, inflation control' }
    ],
    color: '#3b82f6'
  },
  geopoliticalTension: {
    name: 'Geopolitical Tension',
    icon: Globe,
    unit: 'index',
    min: 0,
    max: 100,
    default: 30,
    description: 'Global political stability index - measures conflict risk, trade tensions, and international relations',
    detailedExplanation: `Geopolitical tension encompasses military conflicts, trade wars, sanctions, and diplomatic crises that can disrupt global economic activity and supply chains.

**Key Risk Factors:**
• Military conflicts and territorial disputes
• Trade wars and tariff escalations
• Economic sanctions regimes
• Political instability in key regions
• Terrorism and security threats
• Cyberwarfare incidents

**Economic Channels:**
• Supply chain disruptions
• Energy supply security
• Investment uncertainty
• Safe-haven asset flows
• Currency volatility
• Defense spending changes`,
    impacts: [
      { sector: 'Defense', effect: 'Increased spending', sensitivity: 'Positive correlation' },
      { sector: 'Commodities', effect: 'Supply disruption risk', sensitivity: 'Very High' },
      { sector: 'Global Trade', effect: 'Route disruptions', sensitivity: 'Critical' },
      { sector: 'Tourism', effect: 'Travel restrictions', sensitivity: 'Very High' },
      { sector: 'Insurance', effect: 'Risk repricing', sensitivity: 'High' }
    ],
    historicalEvents: [
      { year: '1990', event: 'Gulf War', price: 'High', impact: 'Oil spike, brief recession' },
      { year: '2001', event: '9/11 attacks', price: 'Extreme', impact: 'Market closure, airline crisis' },
      { year: '2018-20', event: 'US-China trade war', price: 'Elevated', impact: 'Supply chain reshoring' },
      { year: '2022', event: 'Ukraine conflict', price: 'Very High', impact: 'Energy crisis, food security' }
    ],
    color: '#ef4444'
  },
  supplyChainHealth: {
    name: 'Supply Chain Health',
    icon: GitBranch,
    unit: 'index',
    min: 0,
    max: 100,
    default: 75,
    description: 'Global logistics efficiency - measures shipping capacity, port congestion, and manufacturing continuity',
    detailedExplanation: `Supply chain health reflects the efficiency of global trade networks, from raw material sourcing to final product delivery. Modern economies depend on just-in-time inventory systems vulnerable to disruptions.

**Key Components:**
• Shipping capacity and freight rates
• Port efficiency and congestion levels
• Semiconductor availability
• Raw material access
• Labor availability in manufacturing
• Inventory levels across sectors

**Vulnerability Factors:**
• Geographic concentration of production
• Single points of failure
• Lead time dependencies
• Storage and warehousing capacity`,
    impacts: [
      { sector: 'Retail', effect: 'Inventory availability', sensitivity: 'Critical' },
      { sector: 'Automotive', effect: 'Production schedules', sensitivity: 'Critical' },
      { sector: 'Electronics', effect: 'Component availability', sensitivity: 'Very High' },
      { sector: 'Construction', effect: 'Material costs & delays', sensitivity: 'High' },
      { sector: 'Healthcare', effect: 'Medical supply access', sensitivity: 'High' }
    ],
    historicalEvents: [
      { year: '2011', event: 'Thailand floods', price: 'Moderate', impact: 'Hard drive shortage' },
      { year: '2020-21', event: 'COVID disruptions', price: 'Severe', impact: 'Global chip shortage, port backlogs' },
      { year: '2021', event: 'Suez Canal blockage', price: 'Acute', impact: '$9.6B daily trade disrupted' },
      { year: '2021-22', event: 'Semiconductor crisis', price: 'Extended', impact: 'Auto production cuts 30%+' }
    ],
    color: '#8b5cf6'
  },
  consumerConfidence: {
    name: 'Consumer Confidence',
    icon: Users,
    unit: 'index',
    min: 20,
    max: 120,
    default: 70,
    description: 'Consumer sentiment index - measures household optimism about economy and willingness to spend',
    detailedExplanation: `Consumer confidence reflects households' perceptions of current economic conditions and expectations for the future. Since consumer spending drives ~70% of GDP in developed economies, this metric is crucial.

**What It Measures:**
• Current financial situation assessment
• Job market outlook
• Expectations for income growth
• Willingness to make major purchases
• Savings vs. spending intentions

**Leading Indicator Properties:**
• Often predicts retail sales
• Correlates with housing purchases
• Affects durable goods demand
• Influences stock market sentiment`,
    impacts: [
      { sector: 'Retail', effect: 'Discretionary spending', sensitivity: 'Critical' },
      { sector: 'Restaurants', effect: 'Dining out frequency', sensitivity: 'Very High' },
      { sector: 'Automotive', effect: 'New car purchases', sensitivity: 'Very High' },
      { sector: 'Housing', effect: 'Home buying decisions', sensitivity: 'High' },
      { sector: 'Travel', effect: 'Vacation spending', sensitivity: 'Very High' }
    ],
    historicalEvents: [
      { year: '2000', event: 'Dot-com peak optimism', price: '144', impact: 'Preceded market crash' },
      { year: '2008', event: 'Financial crisis low', price: '38', impact: 'Consumer spending collapsed' },
      { year: '2020', event: 'COVID shock', price: '86→98', impact: 'Rapid V-shaped recovery' },
      { year: '2022', event: 'Inflation concerns', price: '50', impact: 'Spending pattern shifts' }
    ],
    color: '#10b981'
  },
  currencyVolatility: {
    name: 'Currency Volatility',
    icon: DollarSign,
    unit: 'index',
    min: 0,
    max: 50,
    default: 12,
    description: 'Exchange rate fluctuation intensity - measures forex market instability and hedging costs',
    detailedExplanation: `Currency volatility reflects uncertainty in foreign exchange markets. High volatility increases costs for international trade and can destabilize economies dependent on imports or exports.

**Causes of Volatility:**
• Interest rate differentials
• Inflation rate differences
• Trade balance changes
• Political uncertainty
• Central bank interventions
• Speculative flows

**Economic Effects:**
• Import/export competitiveness shifts
• Foreign investment decisions
• Corporate earnings translation
• Hedging cost increases
• Emerging market stress`,
    impacts: [
      { sector: 'Exporters', effect: 'Competitiveness swings', sensitivity: 'Very High' },
      { sector: 'Importers', effect: 'Cost uncertainty', sensitivity: 'Very High' },
      { sector: 'Multinationals', effect: 'Earnings volatility', sensitivity: 'High' },
      { sector: 'Tourism', effect: 'Destination value', sensitivity: 'High' },
      { sector: 'Emerging Markets', effect: 'Capital flow risk', sensitivity: 'Critical' }
    ],
    historicalEvents: [
      { year: '1997', event: 'Asian financial crisis', price: 'Extreme', impact: 'Regional currencies collapsed' },
      { year: '2008', event: 'Flight to safety', price: 'Very High', impact: 'USD surge, EM stress' },
      { year: '2015', event: 'Swiss franc unpegging', price: 'Acute', impact: '30% move in minutes' },
      { year: '2022', event: 'Strong dollar cycle', price: 'Elevated', impact: 'Global tightening effect' }
    ],
    color: '#ec4899'
  }
};

const PRESET_SCENARIOS = [
  {
    id: 'baseline',
    name: 'Baseline Equilibrium',
    description: 'Normal economic conditions with balanced parameters',
    icon: Target,
    color: '#6b7280',
    values: { oilPrices: 75, interestRates: 5, geopoliticalTension: 30, supplyChainHealth: 75, consumerConfidence: 70, currencyVolatility: 12 },
    historicalAnalog: 'Similar to mid-2010s economic expansion',
    expectedOutcome: 'Stable growth with moderate inflation'
  },
  {
    id: 'oil-crisis',
    name: 'Energy Crisis',
    description: 'Major oil supply disruption scenario',
    icon: Flame,
    color: '#f59e0b',
    values: { oilPrices: 140, interestRates: 7, geopoliticalTension: 75, supplyChainHealth: 50, consumerConfidence: 45, currencyVolatility: 28 },
    historicalAnalog: '1973 Oil Embargo / 2022 Energy Crisis',
    expectedOutcome: 'Stagflation risk with growth contraction'
  },
  {
    id: 'rate-shock',
    name: 'Monetary Tightening',
    description: 'Aggressive interest rate hiking cycle',
    icon: TrendingUp,
    color: '#3b82f6',
    values: { oilPrices: 85, interestRates: 12, geopoliticalTension: 35, supplyChainHealth: 70, consumerConfidence: 50, currencyVolatility: 22 },
    historicalAnalog: '1981 Volcker Shock / 2022-23 Fed Tightening',
    expectedOutcome: 'Inflation control at cost of growth'
  },
  {
    id: 'supply-crisis',
    name: 'Supply Chain Collapse',
    description: 'Major global logistics disruption',
    icon: GitBranch,
    color: '#8b5cf6',
    values: { oilPrices: 95, interestRates: 6, geopoliticalTension: 60, supplyChainHealth: 25, consumerConfidence: 40, currencyVolatility: 20 },
    historicalAnalog: '2020-21 COVID Supply Disruptions',
    expectedOutcome: 'Shortages, inflation, production delays'
  },
  {
    id: 'geopolitical-crisis',
    name: 'Global Conflict',
    description: 'Major international crisis scenario',
    icon: Globe,
    color: '#ef4444',
    values: { oilPrices: 130, interestRates: 6, geopoliticalTension: 90, supplyChainHealth: 40, consumerConfidence: 35, currencyVolatility: 35 },
    historicalAnalog: '2022 Ukraine Conflict Impact',
    expectedOutcome: 'Flight to safety, commodity spikes'
  },
  {
    id: 'goldilocks',
    name: 'Goldilocks Economy',
    description: 'Ideal conditions - not too hot, not too cold',
    icon: CheckCircle,
    color: '#10b981',
    values: { oilPrices: 65, interestRates: 3.5, geopoliticalTension: 20, supplyChainHealth: 85, consumerConfidence: 90, currencyVolatility: 8 },
    historicalAnalog: 'Mid-1990s / 2017-2019 Expansion',
    expectedOutcome: 'Strong growth, low inflation, bull market'
  },
  {
    id: 'stagflation',
    name: 'Stagflation',
    description: 'High inflation combined with stagnant growth',
    icon: AlertTriangle,
    color: '#dc2626',
    values: { oilPrices: 120, interestRates: 8, geopoliticalTension: 55, supplyChainHealth: 45, consumerConfidence: 35, currencyVolatility: 25 },
    historicalAnalog: '1970s Stagflation Era',
    expectedOutcome: 'Worst of both worlds - policy dilemma'
  },
  {
    id: 'deflation',
    name: 'Deflationary Spiral',
    description: 'Demand collapse and price decline',
    icon: TrendingDown,
    color: '#0ea5e9',
    values: { oilPrices: 40, interestRates: 0.5, geopoliticalTension: 25, supplyChainHealth: 80, consumerConfidence: 30, currencyVolatility: 18 },
    historicalAnalog: 'Japan 1990s / 2008-09 Crisis',
    expectedOutcome: 'Debt deflation, liquidity trap risk'
  }
];

const ECONOMIC_SECTORS = [
  { id: 'realEstate', name: 'Real Estate', icon: Home, description: 'Residential and commercial property markets' },
  { id: 'technology', name: 'Technology', icon: Cpu, description: 'Software, hardware, and digital services' },
  { id: 'consumerGoods', name: 'Consumer Goods', icon: ShoppingCart, description: 'Retail, FMCG, and consumer durables' },
  { id: 'energy', name: 'Energy', icon: Zap, description: 'Oil, gas, utilities, and renewables' },
  { id: 'manufacturing', name: 'Manufacturing', icon: Factory, description: 'Industrial production and heavy industry' },
  { id: 'travel', name: 'Travel & Leisure', icon: Plane, description: 'Airlines, hotels, and entertainment' },
  { id: 'financial', name: 'Financial Services', icon: Building2, description: 'Banks, insurance, and asset management' },
  { id: 'healthcare', name: 'Healthcare', icon: Activity, description: 'Pharmaceuticals, hospitals, and biotech' }
];

const ECONOMIC_GLOSSARY = {
  gdp: {
    term: 'GDP (Gross Domestic Product)',
    definition: 'The total monetary value of all goods and services produced within a country over a specific period.',
    formula: 'GDP = C + I + G + (X - M)',
    components: ['Consumption (C)', 'Investment (I)', 'Government Spending (G)', 'Net Exports (X-M)']
  },
  inflation: {
    term: 'Inflation',
    definition: 'The rate at which the general level of prices for goods and services rises, eroding purchasing power.',
    types: ['Demand-pull (too much money)', 'Cost-push (supply shocks)', 'Built-in (wage-price spiral)']
  },
  unemployment: {
    term: 'Unemployment Rate',
    definition: 'The percentage of the labor force that is jobless and actively seeking employment.',
    types: ['Frictional (job transitions)', 'Structural (skills mismatch)', 'Cyclical (economic downturns)']
  },
  stagflation: {
    term: 'Stagflation',
    definition: 'A rare economic condition combining stagnant growth, high unemployment, and high inflation simultaneously.',
    causes: ['Supply shocks', 'Poor monetary policy', 'Structural rigidities']
  }
};

const calculateEconomicMetrics = (inputs: any) => {
  const { oilPrices, interestRates, geopoliticalTension, supplyChainHealth, consumerConfidence, currencyVolatility } = inputs;
  
  // Normalized factors (0-1 scale for calculations)
  const oilFactor = (oilPrices - 30) / 120; // 0 at $30, 1 at $150
  const rateFactor = interestRates / 15;
  const tensionFactor = geopoliticalTension / 100;
  const supplyFactor = (100 - supplyChainHealth) / 100; // Inverted - higher = worse
  const confidenceFactor = (consumerConfidence - 20) / 100;
  const currencyFactor = currencyVolatility / 50;

  // GDP Impact Calculation (complex multi-factor model)
  const gdpFromOil = -2.5 * Math.pow(oilFactor, 1.3);
  const gdpFromRates = -1.8 * Math.pow(rateFactor, 1.2);
  const gdpFromTension = -1.5 * tensionFactor;
  const gdpFromSupply = -2.0 * supplyFactor;
  const gdpFromConfidence = 2.5 * (confidenceFactor - 0.5);
  const gdpFromCurrency = -0.8 * currencyFactor;
  
  const gdpImpact = gdpFromOil + gdpFromRates + gdpFromTension + gdpFromSupply + gdpFromConfidence + gdpFromCurrency;
  
  // Inflation Calculation
  const inflationFromOil = 3.5 * oilFactor;
  const inflationFromRates = -1.5 * rateFactor; // Higher rates reduce inflation
  const inflationFromSupply = 2.5 * supplyFactor;
  const inflationFromConfidence = 0.8 * confidenceFactor;
  const inflationFromCurrency = 1.2 * currencyFactor;
  
  const inflation = 2 + inflationFromOil + inflationFromRates + inflationFromSupply + inflationFromConfidence + inflationFromCurrency;
  
  // Unemployment Calculation
  const baseUnemployment = 4.5;
  const unemploymentFromGDP = -0.4 * gdpImpact; // Okun's Law approximation
  const unemploymentFromRates = 0.3 * rateFactor * 10;
  const unemploymentFromConfidence = -0.02 * (consumerConfidence - 50);
  
  const unemployment = Math.max(2, Math.min(15, baseUnemployment + unemploymentFromGDP + unemploymentFromRates + unemploymentFromConfidence));
  
  // Market Volatility (VIX-like)
  const volatility = 15 + (tensionFactor * 25) + (currencyFactor * 15) + (supplyFactor * 10) + Math.abs(gdpImpact) * 2;
  
  // Additional Metrics
  const stockMarketImpact = gdpImpact * 8 - (rateFactor * 15) + (confidenceFactor * 10) - (tensionFactor * 12);
  const bondYields = interestRates + (inflation * 0.3) - (gdpImpact < -2 ? 1 : 0);
  const housingMarket = (confidenceFactor * 30) - (rateFactor * 40) + (gdpImpact * 5);
  const consumerSpending = (confidenceFactor * 4) - (inflation * 0.3) - (unemployment * 0.2);
  const businessInvestment = gdpImpact * 2 - (rateFactor * 3) - (tensionFactor * 2) + (confidenceFactor * 1.5);
  const tradeBalance = -(oilFactor * 50) - (currencyFactor * 20) + (supplyFactor * -30);
  
  // Risk Assessment
  let riskLevel = 'stable';
  let riskScore = 0;
  
  if (inflation > 6) riskScore += 2;
  if (inflation > 8) riskScore += 2;
  if (unemployment > 7) riskScore += 2;
  if (unemployment > 10) riskScore += 2;
  if (gdpImpact < -2) riskScore += 2;
  if (gdpImpact < -4) riskScore += 2;
  if (volatility > 30) riskScore += 1;
  if (volatility > 40) riskScore += 2;
  if (inflation > 5 && gdpImpact < -1) riskScore += 3; // Stagflation risk
  
  if (riskScore >= 8) riskLevel = 'critical';
  else if (riskScore >= 5) riskLevel = 'high';
  else if (riskScore >= 3) riskLevel = 'elevated';
  
  // Economic Cycle Phase
  let cyclePhase = 'expansion';
  if (gdpImpact < -1 && unemployment > 6) cyclePhase = 'contraction';
  else if (gdpImpact > 1 && inflation > 4) cyclePhase = 'peak';
  else if (gdpImpact < 0 && inflation < 2) cyclePhase = 'trough';
  
  return {
    primary: {
      gdpImpact: Math.round(gdpImpact * 100) / 100,
      inflation: Math.round(Math.max(0, inflation) * 100) / 100,
      unemployment: Math.round(unemployment * 100) / 100,
      volatility: Math.round(volatility * 100) / 100
    },
    secondary: {
      stockMarketImpact: Math.round(stockMarketImpact * 100) / 100,
      bondYields: Math.round(Math.max(0, bondYields) * 100) / 100,
      housingMarket: Math.round(housingMarket * 100) / 100,
      consumerSpending: Math.round(consumerSpending * 100) / 100,
      businessInvestment: Math.round(businessInvestment * 100) / 100,
      tradeBalance: Math.round(tradeBalance * 100) / 100
    },
    risk: {
      level: riskLevel,
      score: riskScore,
      cyclePhase
    },
    factors: {
      gdpFromOil, gdpFromRates, gdpFromTension, gdpFromSupply, gdpFromConfidence, gdpFromCurrency
    }
  };
};

const calculateSectorImpacts = (inputs: any, metrics: any) => {
  const { oilPrices, interestRates, geopoliticalTension, supplyChainHealth, consumerConfidence, currencyVolatility } = inputs;
  const { gdpImpact, inflation, unemployment } = metrics.primary;
  
  return {
    realEstate: { impact: Math.round((-interestRates * 3 + consumerConfidence * 0.15 + gdpImpact * 2) * 10) / 10, outlook: interestRates > 8 ? 'critical' : interestRates > 6 ? 'negative' : 'neutral', drivers: ['Interest rates (primary)', 'Consumer confidence', 'Employment trends'], analysis: interestRates > 8 ? 'High rates severely impact mortgage affordability, expect significant price corrections' : interestRates > 6 ? 'Elevated rates cooling demand, price growth stalling' : 'Balanced conditions support stable housing market' },
    technology: { impact: Math.round((-interestRates * 2.5 + consumerConfidence * 0.2 - geopoliticalTension * 0.15) * 10) / 10, outlook: interestRates > 10 ? 'critical' : interestRates > 7 ? 'negative' : gdpImpact > 1 ? 'positive' : 'neutral', drivers: ['Interest rates (growth valuations)', 'Consumer spending', 'Supply chain (chips)'], analysis: interestRates > 10 ? 'High discount rates crushing growth stock valuations' : consumerConfidence > 80 ? 'Strong consumer demand driving tech spending' : 'Mixed conditions with valuation pressures' },
    consumerGoods: { impact: Math.round((consumerConfidence * 0.25 - inflation * 0.8 - unemployment * 0.5) * 10) / 10, outlook: consumerConfidence < 40 ? 'critical' : consumerConfidence < 55 ? 'negative' : 'neutral', drivers: ['Consumer confidence (primary)', 'Inflation impact on spending', 'Employment'], analysis: consumerConfidence < 40 ? 'Severely depressed sentiment crushing discretionary spending' : inflation > 6 ? 'Inflation eroding purchasing power, trading down behavior' : 'Stable consumer fundamentals' },
    energy: { impact: Math.round((oilPrices * 0.15 - 5 + geopoliticalTension * 0.1) * 10) / 10, outlook: oilPrices > 100 ? 'positive' : oilPrices < 50 ? 'negative' : 'neutral', drivers: ['Oil prices (primary)', 'Geopolitical supply risk', 'Energy transition policy'], analysis: oilPrices > 120 ? 'High prices driving record profits for producers' : oilPrices < 50 ? 'Low prices pressuring producer margins and investment' : 'Moderate prices balancing supply and demand' },
    manufacturing: { impact: Math.round((supplyChainHealth * 0.2 - 10 - oilPrices * 0.05 + gdpImpact * 1.5) * 10) / 10, outlook: supplyChainHealth < 40 ? 'critical' : supplyChainHealth < 60 ? 'negative' : 'neutral', drivers: ['Supply chain health (primary)', 'Input costs', 'Global demand'], analysis: supplyChainHealth < 40 ? 'Severe supply disruptions halting production lines' : oilPrices > 100 ? 'High input costs squeezing margins' : 'Operational conditions manageable' },
    travel: { impact: Math.round((consumerConfidence * 0.3 - 15 - oilPrices * 0.08 - geopoliticalTension * 0.2) * 10) / 10, outlook: geopoliticalTension > 70 ? 'critical' : consumerConfidence < 50 ? 'negative' : 'neutral', drivers: ['Consumer confidence', 'Fuel costs', 'Geopolitical safety'], analysis: geopoliticalTension > 70 ? 'Travel restrictions and safety concerns devastating sector' : consumerConfidence < 50 ? 'Weak sentiment reducing discretionary travel' : 'Leisure demand recovering' },
    financial: { impact: Math.round((interestRates * 1.5 - 5 - metrics.primary.volatility * 0.15 + gdpImpact) * 10) / 10, outlook: metrics.primary.volatility > 40 ? 'negative' : interestRates > 3 && interestRates < 8 ? 'positive' : 'neutral', drivers: ['Interest rates (NIM)', 'Market volatility', 'Credit quality'], analysis: interestRates > 10 ? 'Very high rates improving NIM but increasing default risk' : interestRates < 2 ? 'Low rates compressing bank profitability' : 'Rate environment supporting healthy margins' },
    healthcare: { impact: Math.round((gdpImpact * 0.3 + 2 - supplyChainHealth * 0.02 + 2) * 10) / 10, outlook: 'defensive', drivers: ['Defensive sector characteristics', 'Demographics', 'Supply chain for medical'], analysis: 'Healthcare typically outperforms during uncertainty due to inelastic demand' }
  };
};

const generateProjections = (metrics: any, quarters = 8) => {
  const projections = [];
  let gdp = metrics.primary.gdpImpact;
  let inf = metrics.primary.inflation;
  let unemp = metrics.primary.unemployment;
  
  for (let i = 0; i <= quarters; i++) {
    const gdpTarget = 2.5; const infTarget = 2; const unempTarget = 4.5;
    projections.push({ quarter: i === 0 ? 'Now' : `Q${i}`, gdp: Math.round(gdp * 100) / 100, inflation: Math.round(inf * 100) / 100, unemployment: Math.round(unemp * 100) / 100 });
    gdp = gdp + (gdpTarget - gdp) * 0.15; inf = inf + (infTarget - inf) * 0.12; unemp = unemp + (unempTarget - unemp) * 0.1;
  }
  return projections;
};

const MetricCard = ({ title, value, unit, icon: Icon, color, trend, description, size = 'normal' }: any) => {
  const isPositive = trend === 'positive' || (typeof value === 'number' && value > 0 && title.includes('GDP'));
  const isNegative = trend === 'negative' || (typeof value === 'number' && value < 0 && title.includes('GDP'));
  return (
    <div className={`bg-holo-card/50 rounded-xl p-${size === 'large' ? '6' : '4'} border border-holo-border`}>
      <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2">{Icon && <Icon className="w-4 h-4" style={{ color }} />}<span className="text-holo-muted text-sm">{title}</span></div>{isPositive && <ArrowUpRight className="w-4 h-4 text-green-400" />}{isNegative && <ArrowDownRight className="w-4 h-4 text-red-400" />}{!isPositive && !isNegative && <Minus className="w-4 h-4 text-holo-muted" />}</div>
      <div className={`${size === 'large' ? 'text-3xl' : 'text-2xl'} font-bold text-holo-text`} style={{ color }}>{typeof value === 'number' ? (value > 0 ? '+' : '') : ''}{value}{unit}</div>
      {description && <p className="text-xs text-holo-muted mt-2">{description}</p>}
    </div>
  );
};

const RiskBadge = ({ level, score }: any) => {
  const config: any = { stable: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle, label: 'Stable' }, elevated: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: AlertTriangle, label: 'Elevated' }, high: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: AlertTriangle, label: 'High Risk' }, critical: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: Flame, label: 'Critical' } };
  const { color, icon: Icon, label } = config[level] || config.stable;
  return (<div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${color}`}><Icon className="w-4 h-4" /><span className="font-medium">{label}</span><span className="text-xs opacity-70">Score: {score}/12</span></div>);
};

const ParameterSlider = ({ param, value, onChange, onInfoClick }: any) => {
  const config = ECONOMIC_PARAMETERS[param as keyof typeof ECONOMIC_PARAMETERS];
  const Icon = config.icon;
  const percentage = ((value - config.min) / (config.max - config.min)) * 100;
  return (
    <div className="bg-holo-card/30 rounded-xl p-4 border border-holo-border">
      <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Icon className="w-5 h-5" style={{ color: config.color }} /><span className="font-medium text-holo-text">{config.name}</span></div><div className="flex items-center gap-2"><span className="text-lg font-bold" style={{ color: config.color }}>{value}{config.unit === '%' ? '%' : ''} {config.unit !== '%' && <span className="text-xs text-holo-muted">{config.unit}</span>}</span><button onClick={() => onInfoClick(param)} className="p-1 rounded-full hover:bg-holo-surface/50 transition-colors"><Info className="w-4 h-4 text-holo-muted hover:text-holo-text" /></button></div></div>
      <input type="range" min={config.min} max={config.max} value={value} onChange={(e) => onChange(param, Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, ${config.color} 0%, ${config.color} ${percentage}%, #374151 ${percentage}%, #374151 100%)` }} />
      <div className="flex justify-between text-xs text-holo-muted mt-1"><span>{config.min}{config.unit}</span><span>{config.max}{config.unit}</span></div>
    </div>
  );
};

const ParameterDetailModal = ({ param, onClose }: any) => {
  if (!param) return null;
  const config = ECONOMIC_PARAMETERS[param as keyof typeof ECONOMIC_PARAMETERS];
  const Icon = config.icon;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-holo-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-holo-border">
        <div className="sticky top-0 bg-holo-card p-6 border-b border-holo-border flex items-center justify-between"><div className="flex items-center gap-3"><div className="p-3 rounded-xl" style={{ backgroundColor: `${config.color}20` }}><Icon className="w-6 h-6" style={{ color: config.color }} /></div><div><h2 className="text-xl font-bold text-holo-text">{config.name}</h2><p className="text-holo-muted text-sm">{config.description}</p></div></div><button onClick={onClose} className="p-2 rounded-lg hover:bg-holo-surface transition-colors"><X className="w-5 h-5 text-holo-muted" /></button></div>
        <div className="p-6 space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-holo-text mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5" style={{ color: config.color }} />Understanding {config.name}</h3>
                <div className="bg-holo-surface/50 rounded-xl p-4 text-holo-text/90 text-sm whitespace-pre-line">{config.detailedExplanation}</div>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-holo-text mb-3 flex items-center gap-2"><Layers className="w-5 h-5" style={{ color: config.color }} />Sector Sensitivity</h3>
                <div className="grid gap-2">
                    {config.impacts.map((impact: any, i: number) => (
                        <div key={i} className="bg-holo-surface/30 rounded-lg p-3 flex items-center justify-between">
                            <div><span className="font-medium text-holo-text">{impact.sector}</span><p className="text-xs text-holo-muted">{impact.effect}</p></div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                impact.sensitivity === 'Critical' ? 'bg-red-500/20 text-red-400' : 
                                impact.sensitivity === 'Very High' ? 'bg-orange-500/20 text-orange-400' : 
                                impact.sensitivity === 'High' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'
                            }`}>{impact.sensitivity}</span>
                        </div>
                    ))}
                 </div>
            </div>
            <div>
                 <h3 className="text-lg font-semibold text-holo-text mb-3 flex items-center gap-2"><Clock className="w-5 h-5" style={{ color: config.color }} />Historical Precedents</h3>
                 <div className="space-y-3">
                    {config.historicalEvents.map((event: any, i: number) => (
                        <div key={i} className="flex gap-4 p-3 bg-holo-surface/30 rounded-lg border border-holo-border/50">
                            <span className="text-sm font-bold text-holo-muted font-mono w-12 pt-0.5">{event.year}</span>
                            <div>
                                <h4 className="text-holo-text font-medium text-sm">{event.event}</h4>
                                <div className="flex gap-4 mt-1 text-xs text-holo-muted">
                                    <span>Level: <span style={{color: config.color}}>{event.price}</span></span>
                                    <span>Outcome: {event.impact}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const ScenarioCard = ({ scenario, active, onClick }: any) => {
    const Icon = scenario.icon;
    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center p-4 rounded-xl border transition-all w-full text-center ${active ? 'bg-holo-card border-holo-text shadow-lg' : 'bg-holo-card/50 border-holo-border hover:bg-holo-card hover:border-holo-muted'}`}
        >
            <div className={`p-3 rounded-full mb-3 ${active ? 'bg-holo-surface' : 'bg-holo-card'}`}>
                <Icon className="w-6 h-6" style={{ color: scenario.color }} />
            </div>
            <h3 className="font-bold text-sm text-holo-text mb-1">{scenario.name}</h3>
            <p className="text-xs text-holo-muted line-clamp-2">{scenario.description}</p>
        </button>
    );
};

const Simulator = () => {
  const [activeScenarioId, setActiveScenarioId] = useState('baseline');
  const [inputs, setInputs] = useState(PRESET_SCENARIOS[0].values);
  const [detailParam, setDetailParam] = useState<string | null>(null);

  const metrics = useMemo(() => calculateEconomicMetrics(inputs), [inputs]);
  const sectorImpacts = useMemo(() => calculateSectorImpacts(inputs, metrics), [inputs, metrics]);
  const projections = useMemo(() => generateProjections(metrics), [metrics]);

  const handleScenarioChange = (id: string) => {
    setActiveScenarioId(id);
    const scenario = PRESET_SCENARIOS.find(s => s.id === id);
    if (scenario) setInputs({ ...scenario.values });
  };

  const handleParamChange = (key: string, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
    if (activeScenarioId !== 'custom') setActiveScenarioId('custom');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="bg-gradient-to-br from-holo-card to-black p-8 rounded-[2rem] border border-holo-border shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-holo-text mb-2 flex items-center gap-3">
            <Cpu className="w-8 h-8 text-holo-primary" />
            Macro-Economic Simulator
          </h1>
          <p className="text-holo-muted max-w-2xl">
            Adjust key economic variables to simulate their impact on GDP, inflation, and sector performance.
            The model uses simplified elasticities based on historical correlations.
          </p>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {PRESET_SCENARIOS.map(s => (
              <ScenarioCard 
                key={s.id} 
                scenario={s} 
                active={activeScenarioId === s.id} 
                onClick={() => handleScenarioChange(s.id)} 
              />
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Inputs */}
        <div className="lg:col-span-4 space-y-6">
            <TechCard className="sticky top-4" title="Input Parameters" icon={<Settings className="w-5 h-5 text-holo-primary" />}>
                <div className="space-y-4">
                    {Object.keys(ECONOMIC_PARAMETERS).map(key => (
                        <ParameterSlider 
                            key={key} 
                            param={key} 
                            value={inputs[key as keyof typeof inputs]} 
                            onChange={handleParamChange}
                            onInfoClick={setDetailParam}
                        />
                    ))}
                </div>
            </TechCard>
        </div>

        {/* Right Col: Outputs */}
        <div className="lg:col-span-8 space-y-6">
            
            {/* Main Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard title="GDP Impact" value={metrics.primary.gdpImpact} unit="%" icon={Globe} color="#3b82f6" description="Annualized impact" />
                <MetricCard title="Inflation" value={metrics.primary.inflation} unit="%" icon={TrendingUp} color="#ef4444" description="CPI Estimate" />
                <MetricCard title="Unemployment" value={metrics.primary.unemployment} unit="%" icon={Users} color="#f59e0b" description="Rate" />
                <div className="bg-holo-card/50 rounded-xl p-4 border border-holo-border flex flex-col justify-center items-center text-center">
                    <span className="text-holo-muted text-sm mb-1">Risk Assessment</span>
                    <RiskBadge level={metrics.risk.level} score={metrics.risk.score} />
                </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TechCard title="Economic Trajectory (8 Quarters)" noBrackets>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={projections}>
                                <defs>
                                    <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorInf" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
                                <YAxis stroke="#9ca3af" fontSize={12} />
                                <Tooltip contentStyle={{backgroundColor: '#1f2937', borderColor: '#374151'}} />
                                <Legend />
                                <Area type="monotone" dataKey="gdp" stroke="#3b82f6" fillOpacity={1} fill="url(#colorGdp)" name="GDP Growth %" />
                                <Area type="monotone" dataKey="inflation" stroke="#ef4444" fillOpacity={1} fill="url(#colorInf)" name="Inflation %" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </TechCard>

                <TechCard title="Sector Impact Heatmap" noBrackets>
                    <div className="grid grid-cols-2 gap-3 h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {Object.entries(sectorImpacts).map(([key, data]: any) => {
                            const SectorIcon = ECONOMIC_SECTORS.find(s => s.id === key)?.icon || Activity;
                            return (
                                <div key={key} className="bg-holo-surface/50 p-3 rounded-lg border border-holo-border/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <SectorIcon className="w-4 h-4 text-holo-muted" />
                                            <span className="text-xs font-medium text-holo-text capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        </div>
                                        <span className={`text-xs font-bold ${data.impact > 0 ? 'text-green-400' : data.impact < 0 ? 'text-red-400' : 'text-holo-muted'}`}>
                                            {data.impact > 0 ? '+' : ''}{data.impact}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-holo-surface rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${data.impact > 0 ? 'bg-green-500' : 'bg-red-500'}`} 
                                            style={{ width: `${Math.min(Math.abs(data.impact) * 10, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </TechCard>
            </div>

            {/* Analysis Section */}
            <TechCard title="System Analysis" icon={<Database className="w-4 h-4" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 bg-holo-surface/30 rounded-xl border border-holo-border/50">
                        <h5 className="text-holo-text font-medium mb-2 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-400" /> 
                            Current Cycle Phase
                        </h5>
                        <p className="text-sm text-holo-text/90 capitalize">
                            <span className={`font-bold ${
                                metrics.risk.cyclePhase === 'contraction' ? 'text-red-400' : 
                                metrics.risk.cyclePhase === 'peak' ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                                {metrics.risk.cyclePhase}
                            </span>
                        </p>
                        <p className="text-xs text-holo-muted mt-2">
                            Based on GDP gap and inflation trends relative to baseline.
                        </p>
                    </div>

                    <div className="p-4 bg-holo-surface/30 rounded-xl border border-holo-border/50">
                        <h5 className="text-holo-text font-medium mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4 text-purple-400" /> 
                            Primary Drivers
                        </h5>
                        <ul className="text-xs text-holo-text/90 space-y-1 list-disc list-inside">
                            {Object.entries(metrics.factors)
                                .sort(([,a]: any, [,b]: any) => Math.abs(b) - Math.abs(a))
                                .slice(0, 3)
                                .map(([key, val]: any) => (
                                    <li key={key}>
                                        {key.replace('gdpFrom', '')}: <span className={val < 0 ? 'text-red-400' : 'text-green-400'}>{val.toFixed(2)}%</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>

                    <div className="p-4 bg-holo-surface/30 rounded-xl border border-holo-border/50">
                         <h5 className="text-holo-text font-medium mb-2 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-orange-400" /> 
                            Risk Outlook
                        </h5>
                        <p className="text-sm text-holo-text/90 leading-relaxed">
                            {metrics.risk.level === 'critical' 
                                ? 'System showing signs of severe stress. Stagflation or depression risks elevated.' 
                                : metrics.risk.level === 'high' 
                                ? 'Significant headwinds present. Policy error probability high.'
                                : 'Conditions generally stable, though monitor specific sector risks.'}
                        </p>
                    </div>
                </div>
            </TechCard>

        </div>
      </div>

      <ParameterDetailModal param={detailParam} onClose={() => setDetailParam(null)} />
    </div>
  );
};

export default Simulator;