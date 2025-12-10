
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  BarChart, 
  Bar
} from 'recharts';
import { 
  ArrowRight, 
  Zap, 
  PlayCircle, 
  MousePointer2, 
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Globe,
  Building2,
  BarChart3,
  AlertTriangle,
  Clock,
  Target,
  ChevronRight,
  ChevronDown,
  Filter,
  RefreshCw,
  Factory,
  Banknote,
  ShoppingCart,
  Users,
  Landmark,
  Fuel,
  Wheat,
  Ship,
  Percent,
  Network,
  Shield,
  Wifi,
  Anchor,
  Cpu,
  FileText,
  CheckCircle
} from 'lucide-react';
import { fetchShockScenarioAnalysis } from '../services/geminiService';
import {
  getCachedScenario,
  cacheScenario,
  getScenarioCacheStatus,
  getAllCachedScenarios,
  clearAllScenarioCaches,
  getTimeUntilRefresh,
  CachedScenarioData
} from '../services/cacheService';
import { ShockScenarioData, HistoricalEvent, ChannelSpeed, SectorExposure, RegionalRisk, RecoveryPath, ExplainerData } from '../types';
import DataSourceTooltip from './DataSourceTooltip';
import TechCard from './TechCard';

export interface ShockScenario extends ShockScenarioData {
  id: string;
  name: string;
  description: string;
  detailedAnalysis: string;
  icon: any;
  color: string;
  example: string;
  severity: string;
  historicalEvents: HistoricalEvent[];
}

const STATIC_SCENARIOS: Record<string, ShockScenario> = {
  geopolitical: {
    id: 'geopolitical',
    name: 'Geopolitical Conflict',
    description: 'Major regional conflict affecting trade routes and energy supplies',
    detailedAnalysis: 'A high-velocity shock primarily transmitted through energy markets and physical trade routes. Expect immediate spikes in commodity prices (Oil, Wheat) followed by supply chain friction. Financial markets react instantly with a "flight to safety," strengthening the USD and Gold while penalizing emerging market currencies.',
    icon: AlertTriangle,
    color: '#ef4444',
    example: 'e.g., Russia-Ukraine 2022, Gulf War 1990',
    severity: 'high',
    probability: 0.15,
    probabilityLabel: '15%/year',
    gdpRange: [-2.0, -0.5],
    gdpTimeline: '3-12 months',
    historicalEvents: [
      { year: 2022, event: 'Russia-Ukraine', gdpImpact: -1.2 },
      { year: 2019, event: 'US-China Trade War', gdpImpact: -0.5 },
      { year: 2014, event: 'Crimea Crisis', gdpImpact: -0.3 },
      { year: 1990, event: 'Gulf War', gdpImpact: -0.8 },
    ],
    channelSpeeds: [
      { channel: 'Stock Markets', days: 0.5, impact: 55 },
      { channel: 'Energy', days: 3, impact: 85 },
      { channel: 'Credit', days: 10, impact: 40 },
      { channel: 'Trade', days: 21, impact: 75 },
      { channel: 'Employment', days: 90, impact: 30 },
    ],
    sectorExposure: [
      { sector: 'Energy', exposure: 92 },
      { sector: 'Defense', exposure: 78 },
      { sector: 'Transport', exposure: 65 },
      { sector: 'Finance', exposure: 45 },
      { sector: 'Tech', exposure: 32 },
    ],
    regionalRisk: [
      { region: 'Europe', risk: 85, gdp: -2.1, exposure: 'High' },
      { region: 'Emerging Markets', risk: 78, gdp: -2.8, exposure: 'High' },
      { region: 'Asia Pacific', risk: 55, gdp: -1.4, exposure: 'Medium' },
      { region: 'North America', risk: 35, gdp: -0.8, exposure: 'Low' },
    ],
    recoveryPath: [
      { month: 0, gdp: 0 },
      { month: 3, gdp: -1.2 },
      { month: 6, gdp: -1.8 },
      { month: 9, gdp: -1.5 },
      { month: 12, gdp: -1.0 },
      { month: 18, gdp: -0.5 },
      { month: 24, gdp: 0 },
    ],
    keyRisks: [
      { risk: 'Energy supply disruption', severity: 'critical', likelihood: 0.7 },
      { risk: 'Trade route blockage', severity: 'high', likelihood: 0.5 },
      { risk: 'Sanctions escalation', severity: 'high', likelihood: 0.6 },
      { risk: 'Refugee crisis', severity: 'medium', likelihood: 0.4 },
    ],
    mitigationEffectiveness: {
      'Strategic reserves': 65,
      'Trade diversification': 45,
      'Currency hedging': 55,
      'Supply chain buffers': 40,
    },
  },
  financial: {
    id: 'financial',
    name: 'Financial Crisis',
    description: 'Banking sector stress or sovereign debt crisis spreading globally',
    detailedAnalysis: 'A systemic liquidity shock transmitted through the banking and credit channels. Unlike physical shocks, this moves at the speed of light through digital ledgers. Interbank lending freezes, raising the cost of capital instantly for all sectors. The real economy impact lags by 3-6 months as investment dries up.',
    icon: Building2,
    color: '#f59e0b',
    example: 'e.g., 2008 GFC, 1997 Asian Crisis',
    severity: 'high',
    probability: 0.08,
    probabilityLabel: '8%/year',
    gdpRange: [-5.0, -2.0],
    gdpTimeline: '6-24 months',
    historicalEvents: [
      { year: 2008, event: 'Global Financial Crisis', gdpImpact: -4.3 },
      { year: 2011, event: 'Euro Debt Crisis', gdpImpact: -1.8 },
      { year: 1997, event: 'Asian Financial Crisis', gdpImpact: -2.5 },
      { year: 1929, event: 'Great Depression', gdpImpact: -26.7 },
    ],
    channelSpeeds: [
      { channel: 'Stock Markets', days: 0.5, impact: 90 },
      { channel: 'Credit', days: 1, impact: 95 },
      { channel: 'Banking', days: 7, impact: 90 },
      { channel: 'Trade', days: 30, impact: 40 },
      { channel: 'Employment', days: 120, impact: 60 },
    ],
    sectorExposure: [
      { sector: 'Finance', exposure: 98 },
      { sector: 'Real Estate', exposure: 85 },
      { sector: 'Consumer', exposure: 62 },
      { sector: 'Industrial', exposure: 55 },
      { sector: 'Tech', exposure: 48 },
    ],
    regionalRisk: [
      { region: 'North America', risk: 88, gdp: -2.8, exposure: 'High' },
      { region: 'Europe', risk: 82, gdp: -3.2, exposure: 'High' },
      { region: 'Emerging Markets', risk: 90, gdp: -4.5, exposure: 'Very High' },
      { region: 'Asia Pacific', risk: 65, gdp: -2.1, exposure: 'Medium' },
    ],
    recoveryPath: [
      { month: 0, gdp: 0 },
      { month: 3, gdp: -2.0 },
      { month: 6, gdp: -3.5 },
      { month: 12, gdp: -4.0 },
      { month: 18, gdp: -3.0 },
      { month: 24, gdp: -1.5 },
      { month: 36, gdp: 0 },
    ],
    keyRisks: [
      { risk: 'Bank failures', severity: 'critical', likelihood: 0.6 },
      { risk: 'Credit freeze', severity: 'critical', likelihood: 0.8 },
      { risk: 'Asset price collapse', severity: 'high', likelihood: 0.7 },
      { risk: 'Contagion spread', severity: 'high', likelihood: 0.65 },
    ],
    mitigationEffectiveness: {
      'Central bank intervention': 75,
      'Deposit insurance': 60,
      'Capital requirements': 50,
      'Stress testing': 45,
    },
  },
  pandemic: {
    id: 'pandemic',
    name: 'Pandemic Outbreak',
    description: 'Global health crisis disrupting labor, travel, and supply chains',
    detailedAnalysis: 'A dual supply and demand shock. Supply is hit by labor shortages and factory closures, while demand collapses in service sectors (travel, hospitality) due to lockdowns or fear. The transmission is unique: services suffer immediately, while goods consumption may actually spike initially.',
    icon: Users,
    color: '#8b5cf6',
    example: 'e.g., COVID-19 2020, SARS 2003',
    severity: 'very high',
    probability: 0.03,
    probabilityLabel: '3%/year',
    gdpRange: [-8.0, -3.0],
    gdpTimeline: '3-18 months',
    historicalEvents: [
      { year: 2020, event: 'COVID-19', gdpImpact: -6.1 },
      { year: 2003, event: 'SARS', gdpImpact: -0.5 },
      { year: 2009, event: 'H1N1 Flu', gdpImpact: -0.2 },
      { year: 1918, event: 'Spanish Flu', gdpImpact: -6.0 },
    ],
    channelSpeeds: [
      { channel: 'Stock Markets', days: 14, impact: 75 },
      { channel: 'Employment', days: 30, impact: 80 },
      { channel: 'Consumption', days: 14, impact: 70 },
      { channel: 'Manufacturing', days: 21, impact: 70 },
      { channel: 'Trade', days: 30, impact: 65 },
    ],
    sectorExposure: [
      { sector: 'Travel', exposure: 95 },
      { sector: 'Hospitality', exposure: 92 },
      { sector: 'Retail', exposure: 75 },
      { sector: 'Manufacturing', exposure: 60 },
      { sector: 'Tech', exposure: 25 },
    ],
    regionalRisk: [
      { region: 'Europe', risk: 85, gdp: -6.5, exposure: 'Very High' },
      { region: 'North America', risk: 82, gdp: -5.8, exposure: 'Very High' },
      { region: 'Emerging Markets', risk: 78, gdp: -7.2, exposure: 'Very High' },
      { region: 'Asia Pacific', risk: 70, gdp: -4.2, exposure: 'High' },
    ],
    recoveryPath: [
      { month: 0, gdp: 0 },
      { month: 3, gdp: -6.0 },
      { month: 6, gdp: -4.5 },
      { month: 9, gdp: -3.0 },
      { month: 12, gdp: -1.5 },
      { month: 18, gdp: 0 },
    ],
    keyRisks: [
      { risk: 'Labor shortage', severity: 'critical', likelihood: 0.85 },
      { risk: 'Supply chain halt', severity: 'critical', likelihood: 0.75 },
      { risk: 'Demand collapse', severity: 'high', likelihood: 0.8 },
      { risk: 'Healthcare overload', severity: 'high', likelihood: 0.7 },
    ],
    mitigationEffectiveness: {
      'Fiscal stimulus': 70,
      'Remote work adoption': 55,
      'Healthcare capacity': 60,
      'Social safety nets': 50,
    },
  },
  climate: {
    id: 'climate',
    name: 'Climate Event',
    description: 'Extreme weather or natural disaster affecting production',
    detailedAnalysis: 'A localized physical shock that creates global ripple effects. A flood in a key manufacturing hub (e.g., Thailand) or a drought in a breadbasket (e.g., Midwest US) transmits through commodity prices and component shortages. The impact is often non-linear and underestimated.',
    icon: Network,
    color: '#06b6d4',
    example: 'e.g., 2011 Thailand Floods, Hurricane Katrina',
    severity: 'medium',
    probability: 0.25,
    probabilityLabel: '25%/year',
    gdpRange: [-1.0, -0.2],
    gdpTimeline: '6-18 months',
    historicalEvents: [
      { year: 2021, event: 'Texas Freeze', gdpImpact: -0.4 },
      { year: 2017, event: 'Hurricane Harvey', gdpImpact: -0.3 },
      { year: 2011, event: 'Thailand Floods', gdpImpact: -0.5 },
      { year: 2005, event: 'Hurricane Katrina', gdpImpact: -0.4 },
    ],
    channelSpeeds: [
      { channel: 'Commodities', days: 1, impact: 80 },
      { channel: 'Energy', days: 2, impact: 45 },
      { channel: 'Manufacturing', days: 14, impact: 55 },
      { channel: 'Trade', days: 7, impact: 35 },
      { channel: 'Employment', days: 60, impact: 25 },
    ],
    sectorExposure: [
      { sector: 'Agriculture', exposure: 90 },
      { sector: 'Insurance', exposure: 78 },
      { sector: 'Energy', exposure: 55 },
      { sector: 'Transport', exposure: 48 },
      { sector: 'Construction', exposure: 42 },
    ],
    regionalRisk: [
      { region: 'Emerging Markets', risk: 72, gdp: -1.5, exposure: 'High' },
      { region: 'Asia Pacific', risk: 68, gdp: -1.2, exposure: 'High' },
      { region: 'North America', risk: 55, gdp: -0.8, exposure: 'Medium' },
      { region: 'Europe', risk: 42, gdp: -0.6, exposure: 'Medium' },
    ],
    recoveryPath: [
      { month: 0, gdp: 0 },
      { month: 3, gdp: -0.6 },
      { month: 6, gdp: -0.8 },
      { month: 9, gdp: -0.5 },
      { month: 12, gdp: -0.2 },
      { month: 18, gdp: 0 },
    ],
    keyRisks: [
      { risk: 'Infrastructure damage', severity: 'high', likelihood: 0.8 },
      { risk: 'Crop failure', severity: 'high', likelihood: 0.6 },
      { risk: 'Supply disruption', severity: 'medium', likelihood: 0.5 },
      { risk: 'Insurance losses', severity: 'medium', likelihood: 0.7 },
    ],
    mitigationEffectiveness: {
      'Infrastructure resilience': 55,
      'Early warning systems': 60,
      'Insurance coverage': 45,
      'Diversified sourcing': 50,
    },
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Warfare',
    description: 'Systemic attack on critical digital infrastructure',
    detailedAnalysis: 'A digital-first shock that targets the nervous system of the economy. Attacks on payment rails, power grids, or cloud providers cause instant paralysis. Transmission is instantaneous across borders. Unlike physical wars, the capital damage is low, but operational disruption is catastrophic.',
    icon: Wifi,
    color: '#14b8a6',
    example: 'e.g., NotPetya 2017, Colonial Pipeline',
    severity: 'critical',
    probability: 0.20,
    probabilityLabel: '20%/year',
    gdpRange: [-1.5, -0.4],
    gdpTimeline: '1-6 months',
    historicalEvents: [
      { year: 2017, event: 'NotPetya', gdpImpact: -0.1 },
      { year: 2021, event: 'Colonial Pipeline', gdpImpact: -0.05 },
      { year: 2017, event: 'WannaCry', gdpImpact: -0.05 },
    ],
    channelSpeeds: [
      { channel: 'Stock Markets', days: 0.1, impact: 65 },
      { channel: 'Banking', days: 0.1, impact: 95 },
      { channel: 'Energy', days: 1, impact: 80 },
      { channel: 'Trade', days: 2, impact: 50 },
      { channel: 'Employment', days: 180, impact: 10 },
    ],
    sectorExposure: [
      { sector: 'Tech', exposure: 95 },
      { sector: 'Finance', exposure: 90 },
      { sector: 'Energy', exposure: 85 },
      { sector: 'Healthcare', exposure: 70 },
      { sector: 'Retail', exposure: 60 },
    ],
    regionalRisk: [
      { region: 'North America', risk: 85, gdp: -1.2, exposure: 'Very High' },
      { region: 'Europe', risk: 80, gdp: -1.0, exposure: 'High' },
      { region: 'Asia Pacific', risk: 75, gdp: -0.8, exposure: 'High' },
      { region: 'Emerging Markets', risk: 45, gdp: -0.3, exposure: 'Medium' },
    ],
    recoveryPath: [
      { month: 0, gdp: 0 },
      { month: 1, gdp: -1.5 },
      { month: 2, gdp: -0.8 },
      { month: 3, gdp: -0.4 },
      { month: 6, gdp: -0.1 },
    ],
    keyRisks: [
      { risk: 'Grid failure', severity: 'critical', likelihood: 0.4 },
      { risk: 'Data destruction', severity: 'high', likelihood: 0.6 },
      { risk: 'Payment system halt', severity: 'critical', likelihood: 0.5 },
      { risk: 'IP theft', severity: 'medium', likelihood: 0.8 },
    ],
    mitigationEffectiveness: {
      'Cybersecurity spend': 80,
      'Offline backups': 90,
      'Decentralization': 65,
      'Insurance': 40,
    },
  },
  trade_war: {
    id: 'trade_war',
    name: 'Trade War',
    description: 'Escalating tariffs and protectionist policies',
    detailedAnalysis: 'A slow-burning structural shock. Tariffs raise input costs for manufacturers and prices for consumers (cost-push inflation). Transmission is gradual but persistent, leading to supply chain re-routing ("friend-shoring") and long-term efficiency losses.',
    icon: Anchor,
    color: '#6366f1',
    example: 'e.g., US-China Tariff War 2018',
    severity: 'medium',
    probability: 0.40,
    probabilityLabel: '40%/year',
    gdpRange: [-1.2, -0.3],
    gdpTimeline: '12-36 months',
    historicalEvents: [
      { year: 2018, event: 'US-China Tariffs', gdpImpact: -0.4 },
      { year: 1930, event: 'Smoot-Hawley', gdpImpact: -2.0 },
      { year: 2002, event: 'Steel Tariffs', gdpImpact: -0.1 },
    ],
    channelSpeeds: [
      { channel: 'Trade', days: 1, impact: 90 },
      { channel: 'Manufacturing', days: 30, impact: 75 },
      { channel: 'Consumption', days: 60, impact: 50 },
      { channel: 'Stock Markets', days: 5, impact: 40 },
      { channel: 'Employment', days: 180, impact: 35 },
    ],
    sectorExposure: [
      { sector: 'Manufacturing', exposure: 90 },
      { sector: 'Tech', exposure: 85 },
      { sector: 'Agriculture', exposure: 80 },
      { sector: 'Retail', exposure: 65 },
      { sector: 'Transport', exposure: 60 },
    ],
    regionalRisk: [
      { region: 'Asia Pacific', risk: 85, gdp: -1.5, exposure: 'Very High' },
      { region: 'North America', risk: 60, gdp: -0.5, exposure: 'Medium' },
      { region: 'Europe', risk: 65, gdp: -0.6, exposure: 'Medium' },
      { region: 'Emerging Markets', risk: 70, gdp: -1.0, exposure: 'High' },
    ],
    recoveryPath: [
      { month: 0, gdp: 0 },
      { month: 6, gdp: -0.5 },
      { month: 12, gdp: -0.8 },
      { month: 18, gdp: -1.0 },
      { month: 24, gdp: -0.8 },
      { month: 36, gdp: -0.5 },
    ],
    keyRisks: [
      { risk: 'Supply chain break', severity: 'high', likelihood: 0.6 },
      { risk: 'Inflation spike', severity: 'medium', likelihood: 0.7 },
      { risk: 'Retaliatory tariffs', severity: 'high', likelihood: 0.9 },
      { risk: 'Market fragmentation', severity: 'medium', likelihood: 0.8 },
    ],
    mitigationEffectiveness: {
      'Diversification': 70,
      'Domestic subsidies': 50,
      'Currency devaluation': 60,
      'Diplomacy': 40,
    },
  },
  debt_crisis: {
    id: 'debt_crisis',
    name: 'Sovereign Debt Crisis',
    description: 'Default risk in major emerging or developed economies',
    detailedAnalysis: 'A confidence shock rooted in fiscal sustainability. Rising yields force austerity, slashing government spending (G). If a major economy defaults, it triggers a "sudden stop" in capital flows to all risky assets globally, causing contagion similar to 1997 or 2011.',
    icon: Landmark,
    color: '#db2777',
    example: 'e.g., Eurozone Crisis 2011, Argentina',
    severity: 'high',
    probability: 0.12,
    probabilityLabel: '12%/year',
    gdpRange: [-3.0, -1.0],
    gdpTimeline: '6-36 months',
    historicalEvents: [
      { year: 2010, event: 'Greek Crisis', gdpImpact: -0.8 },
      { year: 1998, event: 'Russian Default', gdpImpact: -0.5 },
      { year: 2001, event: 'Argentina Default', gdpImpact: -0.3 },
    ],
    channelSpeeds: [
      { channel: 'Credit', days: 1, impact: 95 },
      { channel: 'Banking', days: 7, impact: 85 },
      { channel: 'Stock Markets', days: 2, impact: 60 },
      { channel: 'Employment', days: 90, impact: 50 },
      { channel: 'Trade', days: 60, impact: 30 },
    ],
    sectorExposure: [
      { sector: 'Finance', exposure: 95 },
      { sector: 'Government', exposure: 90 },
      { sector: 'Construction', exposure: 70 },
      { sector: 'Utilities', exposure: 60 },
      { sector: 'Consumer', exposure: 50 },
    ],
    regionalRisk: [
      { region: 'Emerging Markets', risk: 90, gdp: -3.5, exposure: 'Critical' },
      { region: 'Europe', risk: 60, gdp: -1.2, exposure: 'Medium' },
      { region: 'Asia Pacific', risk: 50, gdp: -0.8, exposure: 'Low' },
      { region: 'North America', risk: 30, gdp: -0.5, exposure: 'Low' },
    ],
    recoveryPath: [
      { month: 0, gdp: 0 },
      { month: 6, gdp: -1.5 },
      { month: 12, gdp: -2.5 },
      { month: 18, gdp: -2.0 },
      { month: 24, gdp: -1.0 },
      { month: 36, gdp: -0.5 },
    ],
    keyRisks: [
      { risk: 'Sovereign default', severity: 'critical', likelihood: 0.3 },
      { risk: 'Currency collapse', severity: 'high', likelihood: 0.6 },
      { risk: 'Capital flight', severity: 'high', likelihood: 0.7 },
      { risk: 'Austerity measures', severity: 'medium', likelihood: 0.9 },
    ],
    mitigationEffectiveness: {
      'IMF Bailout': 85,
      'Fiscal restructuring': 60,
      'Debt forgiveness': 90,
      'Capital controls': 50,
    },
  },
  ai_shock: {
    id: 'ai_shock',
    name: 'AI Labor Shock',
    description: 'Rapid technological displacement of white-collar labor',
    detailedAnalysis: 'A structural productivity shock with short-term deflationary pains. AI automation boosts output potential but disrupts labor markets (displacement). Transmission flows through Employment -> Consumption. Unlike other shocks, this may boost GDP while increasing inequality and social unrest.',
    icon: Cpu,
    color: '#8b5cf6',
    example: 'e.g., Generative AI Boom 2023+',
    severity: 'medium',
    probability: 0.60,
    probabilityLabel: '60%/year',
    gdpRange: [0.5, 2.0],
    gdpTimeline: '12-60 months',
    historicalEvents: [
      { year: 2000, event: 'Internet Boom', gdpImpact: +2.0 },
      { year: 1990, event: 'PC Revolution', gdpImpact: +1.5 },
    ],
    channelSpeeds: [
      { channel: 'Stock Markets', days: 1, impact: 80 },
      { channel: 'Investment', days: 30, impact: 75 },
      { channel: 'Employment', days: 180, impact: 90 },
      { channel: 'Consumption', days: 360, impact: 40 },
      { channel: 'Manufacturing', days: 180, impact: 30 },
    ],
    sectorExposure: [
      { sector: 'Tech', exposure: 95 },
      { sector: 'Media', exposure: 90 },
      { sector: 'Finance', exposure: 75 },
      { sector: 'Healthcare', exposure: 60 },
      { sector: 'Legal', exposure: 85 },
    ],
    regionalRisk: [
      { region: 'North America', risk: 70, gdp: +1.5, exposure: 'High' },
      { region: 'Europe', risk: 65, gdp: +1.0, exposure: 'Medium' },
      { region: 'Asia Pacific', risk: 60, gdp: +1.2, exposure: 'Medium' },
      { region: 'Emerging Markets', risk: 40, gdp: +0.5, exposure: 'Low' },
    ],
    recoveryPath: [
      { month: 0, gdp: 0 },
      { month: 12, gdp: 0.5 },
      { month: 24, gdp: 1.2 },
      { month: 36, gdp: 2.0 },
      { month: 48, gdp: 2.8 },
      { month: 60, gdp: 3.5 },
    ],
    keyRisks: [
      { risk: 'Job displacement', severity: 'high', likelihood: 0.9 },
      { risk: 'Regulatory crackdowns', severity: 'medium', likelihood: 0.6 },
      { risk: 'Model collapse', severity: 'medium', likelihood: 0.3 },
      { risk: 'Market concentration', severity: 'high', likelihood: 0.8 },
    ],
    mitigationEffectiveness: {
      'Reskilling programs': 60,
      'UBI / Safety nets': 40,
      'Regulation': 50,
      'Education reform': 30,
    },
  },
};

const INITIAL_NODES: any = {
  shock: {
    id: 'shock',
    label: 'Initial Shock',
    shortLabel: 'Shock',
    layer: 'trigger',
    x: 60, y: 150,
    icon: Zap,
    description: 'The triggering event that starts the economic ripple effect',
    impacts: {
      geopolitical: { magnitude: 100, timeToImpact: '0 days', confidence: 'High' },
      financial: { magnitude: 100, timeToImpact: '0 days', confidence: 'High' },
      pandemic: { magnitude: 100, timeToImpact: '0 days', confidence: 'High' },
      climate: { magnitude: 100, timeToImpact: '0 days', confidence: 'High' },
      cyber: { magnitude: 100, timeToImpact: '0 days', confidence: 'High' },
      trade_war: { magnitude: 100, timeToImpact: '0 days', confidence: 'High' },
      debt_crisis: { magnitude: 100, timeToImpact: '0 days', confidence: 'High' },
      ai_shock: { magnitude: 100, timeToImpact: '0 days', confidence: 'High' },
    },
  },
  energy: {
    id: 'energy',
    label: 'Energy Markets',
    shortLabel: 'Energy',
    layer: 'primary',
    x: 200, y: 60,
    icon: Fuel,
    description: 'Oil, gas, and electricity price changes and supply disruptions',
    impacts: {
      geopolitical: { magnitude: 85, timeToImpact: '1-7 days', confidence: 'High', detail: '+40-80% oil price spike' },
      financial: { magnitude: 25, timeToImpact: '2-4 weeks', confidence: 'Medium', detail: '+5-15% volatility' },
      pandemic: { magnitude: 60, timeToImpact: '2-8 weeks', confidence: 'Medium', detail: '-20-40% demand shock' },
      climate: { magnitude: 45, timeToImpact: '1-3 days', confidence: 'High', detail: 'Regional supply disruption' },
      cyber: { magnitude: 80, timeToImpact: '0-2 days', confidence: 'High', detail: 'Grid/Pipeline shutdown' },
    },
  },
  commodities: {
    id: 'commodities',
    label: 'Commodities',
    shortLabel: 'Commodities',
    layer: 'primary',
    x: 200, y: 130,
    icon: Wheat,
    description: 'Agricultural products, metals, and raw materials',
    impacts: {
      geopolitical: { magnitude: 70, timeToImpact: '1-4 weeks', confidence: 'High', detail: '+20-50% grain prices' },
      financial: { magnitude: 35, timeToImpact: '2-6 weeks', confidence: 'Medium', detail: 'Flight to gold/safe assets' },
      pandemic: { magnitude: 40, timeToImpact: '4-12 weeks', confidence: 'Medium', detail: 'Supply chain disruption' },
      climate: { magnitude: 80, timeToImpact: '0-2 weeks', confidence: 'High', detail: 'Crop/production damage' },
    },
  },
  equities: {
    id: 'equities',
    label: 'Stock Markets',
    shortLabel: 'Equities',
    layer: 'primary',
    x: 200, y: 200,
    icon: BarChart3,
    description: 'Global equity indices and corporate valuations',
    impacts: {
      geopolitical: { magnitude: 55, timeToImpact: '0-1 days', confidence: 'High', detail: '-5-15% initial drop' },
      financial: { magnitude: 90, timeToImpact: '0-1 days', confidence: 'High', detail: '-20-50% in severe cases' },
      pandemic: { magnitude: 75, timeToImpact: '1-4 weeks', confidence: 'High', detail: '-15-35% correction' },
      climate: { magnitude: 30, timeToImpact: '0-3 days', confidence: 'Medium', detail: 'Sector-specific impacts' },
    },
  },
  credit: {
    id: 'credit',
    label: 'Credit Markets',
    shortLabel: 'Credit',
    layer: 'primary',
    x: 200, y: 270,
    icon: Banknote,
    description: 'Bond yields, credit spreads, and lending conditions',
    impacts: {
      geopolitical: { magnitude: 40, timeToImpact: '1-2 weeks', confidence: 'Medium', detail: '+50-150bp spreads' },
      financial: { magnitude: 95, timeToImpact: '0-3 days', confidence: 'High', detail: 'Credit freeze possible' },
      pandemic: { magnitude: 65, timeToImpact: '2-6 weeks', confidence: 'High', detail: 'Central bank response' },
      climate: { magnitude: 25, timeToImpact: '2-4 weeks', confidence: 'Low', detail: 'Localized impact' },
    },
  },
  manufacturing: {
    id: 'manufacturing',
    label: 'Manufacturing',
    shortLabel: 'Mfg',
    layer: 'secondary',
    x: 380, y: 80,
    icon: Factory,
    description: 'Industrial production and factory output',
    impacts: {
      geopolitical: { magnitude: 50, timeToImpact: '2-8 weeks', confidence: 'Medium', detail: '-5-20% output' },
      financial: { magnitude: 45, timeToImpact: '1-3 months', confidence: 'Medium', detail: 'Investment pullback' },
      pandemic: { magnitude: 70, timeToImpact: '2-6 weeks', confidence: 'High', detail: 'Factory closures' },
      climate: { magnitude: 55, timeToImpact: '0-4 weeks', confidence: 'High', detail: 'Regional shutdowns' },
    },
  },
  trade: {
    id: 'trade',
    label: 'Global Trade',
    shortLabel: 'Trade',
    layer: 'secondary',
    x: 380, y: 150,
    icon: Ship,
    description: 'International trade flows and shipping',
    impacts: {
      geopolitical: { magnitude: 75, timeToImpact: '1-4 weeks', confidence: 'High', detail: '-10-30% volume' },
      financial: { magnitude: 40, timeToImpact: '1-3 months', confidence: 'Medium', detail: 'Trade finance freeze' },
      pandemic: { magnitude: 65, timeToImpact: '2-8 weeks', confidence: 'High', detail: 'Port/border closures' },
      climate: { magnitude: 35, timeToImpact: '1-2 weeks', confidence: 'Medium', detail: 'Route disruptions' },
      trade_war: { magnitude: 90, timeToImpact: '1-12 months', confidence: 'High', detail: 'Tariff barriers' },
    },
  },
  banking: {
    id: 'banking',
    label: 'Banking System',
    shortLabel: 'Banks',
    layer: 'secondary',
    x: 380, y: 220,
    icon: Landmark,
    description: 'Bank lending, liquidity, and stability',
    impacts: {
      geopolitical: { magnitude: 35, timeToImpact: '2-6 weeks', confidence: 'Medium', detail: 'Risk repricing' },
      financial: { magnitude: 90, timeToImpact: '0-2 weeks', confidence: 'High', detail: 'Potential bank runs' },
      pandemic: { magnitude: 50, timeToImpact: '1-3 months', confidence: 'Medium', detail: 'NPL increases' },
      climate: { magnitude: 20, timeToImpact: '1-3 months', confidence: 'Low', detail: 'Insurance claims' },
      debt_crisis: { magnitude: 85, timeToImpact: '0-4 weeks', confidence: 'High', detail: 'Sovereign exposure' },
    },
  },
  employment: {
    id: 'employment',
    label: 'Employment',
    shortLabel: 'Jobs',
    layer: 'tertiary',
    x: 540, y: 100,
    icon: Users,
    description: 'Labor market and unemployment',
    impacts: {
      geopolitical: { magnitude: 30, timeToImpact: '2-6 months', confidence: 'Medium', detail: '+1-3% unemployment' },
      financial: { magnitude: 60, timeToImpact: '3-12 months', confidence: 'High', detail: '+2-5% unemployment' },
      pandemic: { magnitude: 80, timeToImpact: '1-3 months', confidence: 'High', detail: '+5-15% unemployment' },
      climate: { magnitude: 25, timeToImpact: '1-6 months', confidence: 'Medium', detail: 'Regional job losses' },
      ai_shock: { magnitude: 90, timeToImpact: '6-24 months', confidence: 'Medium', detail: 'Structural displacement' },
    },
  },
  consumption: {
    id: 'consumption',
    label: 'Consumer Spending',
    shortLabel: 'Spending',
    layer: 'tertiary',
    x: 540, y: 180,
    icon: ShoppingCart,
    description: 'Household consumption and retail sales',
    impacts: {
      geopolitical: { magnitude: 35, timeToImpact: '1-3 months', confidence: 'Medium', detail: '-3-8% drop' },
      financial: { magnitude: 55, timeToImpact: '2-6 months', confidence: 'High', detail: '-5-15% drop' },
      pandemic: { magnitude: 70, timeToImpact: '0-2 months', confidence: 'High', detail: '-10-30% drop' },
      climate: { magnitude: 20, timeToImpact: '1-4 months', confidence: 'Low', detail: 'Regional impact' },
    },
  },
  investment: {
    id: 'investment',
    label: 'Business Investment',
    shortLabel: 'CapEx',
    layer: 'tertiary',
    x: 540, y: 260,
    icon: TrendingUp,
    description: 'Corporate capital expenditure and expansion',
    impacts: {
      geopolitical: { magnitude: 45, timeToImpact: '1-6 months', confidence: 'Medium', detail: '-10-25% capex' },
      financial: { magnitude: 70, timeToImpact: '2-9 months', confidence: 'High', detail: '-15-40% capex' },
      pandemic: { magnitude: 55, timeToImpact: '2-6 months', confidence: 'High', detail: '-10-30% capex' },
      climate: { magnitude: 30, timeToImpact: '2-6 months', confidence: 'Medium', detail: 'Reallocation' },
    },
  },
  gdp: {
    id: 'gdp',
    label: 'GDP Impact',
    shortLabel: 'GDP',
    layer: 'outcome',
    x: 680, y: 180,
    icon: Target,
    description: 'Overall economic output change',
    impacts: {
      geopolitical: { magnitude: 40, timeToImpact: '3-12 months', confidence: 'Medium', detail: '-0.5 to -2.0% GDP', range: [-2.0, -0.5] },
      financial: { magnitude: 75, timeToImpact: '6-24 months', confidence: 'High', detail: '-2.0 to -5.0% GDP', range: [-5.0, -2.0] },
      pandemic: { magnitude: 85, timeToImpact: '3-18 months', confidence: 'High', detail: '-3.0 to -8.0% GDP', range: [-8.0, -3.0] },
      climate: { magnitude: 25, timeToImpact: '6-18 months', confidence: 'Low', detail: '-0.2 to -1.0% GDP', range: [-1.0, -0.2] },
    },
  },
};

const CONNECTIONS = [
  { from: 'shock', to: 'energy', strength: 'strong' },
  { from: 'shock', to: 'commodities', strength: 'strong' },
  { from: 'shock', to: 'equities', strength: 'strong' },
  { from: 'shock', to: 'credit', strength: 'medium' },
  { from: 'energy', to: 'manufacturing', strength: 'strong' },
  { from: 'energy', to: 'trade', strength: 'medium' },
  { from: 'commodities', to: 'manufacturing', strength: 'strong' },
  { from: 'commodities', to: 'trade', strength: 'strong' },
  { from: 'equities', to: 'banking', strength: 'medium' },
  { from: 'equities', to: 'trade', strength: 'weak' },
  { from: 'credit', to: 'banking', strength: 'strong' },
  { from: 'credit', to: 'trade', strength: 'medium' },
  { from: 'manufacturing', to: 'employment', strength: 'strong' },
  { from: 'manufacturing', to: 'investment', strength: 'medium' },
  { from: 'trade', to: 'employment', strength: 'medium' },
  { from: 'trade', to: 'consumption', strength: 'medium' },
  { from: 'banking', to: 'consumption', strength: 'strong' },
  { from: 'banking', to: 'investment', strength: 'strong' },
  { from: 'employment', to: 'gdp', strength: 'strong' },
  { from: 'consumption', to: 'gdp', strength: 'strong' },
  { from: 'investment', to: 'gdp', strength: 'strong' },
  { from: 'banking', to: 'credit', strength: 'feedback', feedback: true },
  { from: 'employment', to: 'consumption', strength: 'feedback', feedback: true },
];

const generateTimelineData = (scenario: string, recoveryPath: RecoveryPath[] | undefined) => {
  const path = recoveryPath || STATIC_SCENARIOS[scenario].recoveryPath;
  const peakImpact = Math.min(...path.map(d => d.gdp));

  const baseData = [
    { week: 0, label: 'Week 0', shock: 100, primary: 0, secondary: 0, tertiary: 0, gdp: 0 },
    { week: 1, label: 'Week 1', shock: 95, primary: 45, secondary: 5, tertiary: 0, gdp: 0 },
    { week: 2, label: 'Week 2', shock: 85, primary: 70, secondary: 20, tertiary: 5, gdp: 2 },
    { week: 4, label: 'Week 4', shock: 70, primary: 80, secondary: 45, tertiary: 15, gdp: 8 },
    { week: 8, label: 'Week 8', shock: 50, primary: 70, secondary: 65, tertiary: 35, gdp: 20 },
    { week: 12, label: 'Week 12', shock: 35, primary: 55, secondary: 70, tertiary: 55, gdp: 40 },
    { week: 24, label: 'Week 24', shock: 20, primary: 35, secondary: 55, tertiary: 70, gdp: 65 },
    { week: 52, label: 'Week 52', shock: 10, primary: 20, secondary: 35, tertiary: 50, gdp: 80 },
  ];
  
  const multipliers: Record<string, any> = {
    geopolitical: { shock: 1, primary: 1.2, secondary: 0.9, tertiary: 0.7, gdp: Math.abs(peakImpact) * 0.5 },
    financial: { shock: 1, primary: 1.3, secondary: 1.2, tertiary: 1.1, gdp: Math.abs(peakImpact) * 0.8 },
    pandemic: { shock: 1, primary: 1.1, secondary: 1.3, tertiary: 1.4, gdp: Math.abs(peakImpact) * 1.0 },
    climate: { shock: 1, primary: 0.8, secondary: 0.7, tertiary: 0.5, gdp: Math.abs(peakImpact) * 0.3 },
    cyber: { shock: 1, primary: 1.5, secondary: 1.0, tertiary: 0.5, gdp: Math.abs(peakImpact) * 0.6 },
    trade_war: { shock: 0.8, primary: 0.7, secondary: 0.9, tertiary: 0.8, gdp: Math.abs(peakImpact) * 0.4 },
    debt_crisis: { shock: 0.9, primary: 1.1, secondary: 1.4, tertiary: 0.9, gdp: Math.abs(peakImpact) * 0.7 },
    ai_shock: { shock: 0.5, primary: 0.6, secondary: 0.8, tertiary: 1.2, gdp: Math.abs(peakImpact) * 0.5 },
  };
  
  const mult = multipliers[scenario] || multipliers.geopolitical;
  
  return baseData.map(d => ({
    ...d,
    shock: Math.round(d.shock * mult.shock),
    primary: Math.round(d.primary * mult.primary),
    secondary: Math.round(d.secondary * mult.secondary),
    tertiary: Math.round(d.tertiary * mult.tertiary),
    gdp: Math.round(d.gdp * mult.gdp),
  }));
};

// Helper Components
const InfoTooltip = ({ text }: { text: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <button onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} className="ml-1.5 text-holo-muted hover:text-holo-text transition-colors"><HelpCircle className="w-3.5 h-3.5" /></button>
      {show && <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-black/90 border border-white/10 text-holo-text text-xs rounded-lg shadow-xl backdrop-blur">{text}</div>}
    </div>
  );
};

const MagnitudeBar = ({ value, max = 100, color = '#3b82f6' }: any) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden border border-white/5">
      <div className="h-full rounded-full transition-all duration-500 shadow-[0_0_10px_currentColor]" style={{ width: `${(value / max) * 100}%`, backgroundColor: color, color: color }} />
    </div>
    <span className="text-xs font-mono text-holo-muted w-8 text-right">{value}%</span>
  </div>
);

const ConfidenceBadge = ({ level }: any) => {
  const colors: any = { 'High': 'bg-green-500/10 text-green-400 border-green-500/20', 'Medium': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', 'Low': 'bg-red-500/10 text-red-400 border-red-500/20' };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colors[level] || colors['Medium']}`}>{level.toUpperCase()}</span>;
};

const SeverityBadge = ({ severity }: any) => {
  const config: any = {
    critical: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20', label: 'CRITICAL' },
    high: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/20', label: 'HIGH' },
    medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20', label: 'MEDIUM' },
    low: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20', label: 'LOW' },
  };
  const c = config[severity.toLowerCase()] || config.medium;
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${c.bg} ${c.text} ${c.border}`}>{c.label}</span>;
};

const LayerLabel = ({ layer }: any) => {
  const labels: any = { trigger: { text: 'TRIGGER', color: '#ef4444' }, primary: { text: 'PRIMARY', color: '#f97316' }, secondary: { text: 'SECONDARY', color: '#3b82f6' }, tertiary: { text: 'TERTIARY', color: '#8b5cf6' }, outcome: { text: 'OUTCOME', color: '#22c55e' } };
  const config = labels[layer] || labels.trigger;
  return <span className="text-[9px] font-bold px-2 py-0.5 rounded border tracking-widest" style={{ backgroundColor: `${config.color}10`, color: config.color, borderColor: `${config.color}30` }}>{config.text}</span>;
};

const MiniSparkline = ({ data, dataKey, color, height = 40 }: any) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id={`gradient-${dataKey}-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
          <stop offset="95%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#gradient-${dataKey}-${color})`} />
    </AreaChart>
  </ResponsiveContainer>
);

const ProgressRing = ({ value, max = 100, size = 60, strokeWidth = 6, color }: any) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-500" style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  );
};

// Insight Card Components
const FastestChannelCard = ({ scenario, data, isExpanded, onToggle }: any) => {
  const fastestChannel = data.channelSpeeds.reduce((a: ChannelSpeed, b: ChannelSpeed) => a.days < b.days ? a : b);
  const slowestChannel = data.channelSpeeds.reduce((a: ChannelSpeed, b: ChannelSpeed) => a.days > b.days ? a : b);
  return (
    <TechCard className="cursor-pointer hover:border-holo-primary/40" onClick={onToggle}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center text-xs font-bold text-holo-muted uppercase tracking-wider mb-1"><Zap className="w-4 h-4 mr-1.5 text-amber-400" />Fastest Channel</div>
            <h3 className="text-2xl font-bold text-holo-text">{fastestChannel.channel}</h3>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-amber-400 font-mono">{fastestChannel.days}</div>
            <div className="text-[10px] text-holo-muted uppercase">days to react</div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-holo-muted text-xs">Impact: <span className="font-bold text-holo-text">{fastestChannel.impact}/100</span></span>
          <div className="flex items-center text-holo-primary text-xs font-bold uppercase">{isExpanded ? 'Less' : 'More'}{isExpanded ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronRight className="w-3 h-3 ml-1" />}</div>
        </div>
      </div>
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-holo-border pt-4 space-y-4 bg-black/20">
          <div>
            <h4 className="text-[10px] font-bold text-holo-muted uppercase tracking-widest mb-3">Channel Response Times</h4>
            <div className="space-y-2">
              {data.channelSpeeds.map((channel: ChannelSpeed, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs text-holo-muted w-24 truncate">{channel.channel}</span>
                  <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full rounded-full transition-all duration-500 shadow-[0_0_8px_currentColor]" style={{ width: `${Math.min((channel.days / slowestChannel.days) * 100, 100)}%`, backgroundColor: channel.channel === fastestChannel.channel ? '#f59e0b' : '#94a3b8', color: channel.channel === fastestChannel.channel ? '#f59e0b' : '#94a3b8' }} />
                  </div>
                  <span className="text-xs font-mono text-holo-text w-16 text-right">{channel.days}d</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <Zap className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-200"><strong>Insight:</strong> {fastestChannel.channel} moves within {fastestChannel.days < 1 ? 'hours' : `${fastestChannel.days} days`}.</p>
          </div>
        </div>
      )}
    </TechCard>
  );
};

const HighestImpactCard = ({ scenario, data, isExpanded, onToggle }: any) => {
  const highestImpact = data.channelSpeeds.reduce((a: ChannelSpeed, b: ChannelSpeed) => a.impact > b.impact ? a : b);
  const avgImpact = Math.round(data.channelSpeeds.reduce((sum: number, c: ChannelSpeed) => sum + c.impact, 0) / data.channelSpeeds.length);
  return (
    <TechCard className="cursor-pointer hover:border-holo-primary/40" onClick={onToggle}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center text-xs font-bold text-holo-muted uppercase tracking-wider mb-1"><TrendingDown className="w-4 h-4 mr-1.5 text-red-400" />Highest Impact</div>
            <h3 className="text-2xl font-bold text-holo-text">{highestImpact.channel}</h3>
          </div>
          <div className="relative">
            <ProgressRing value={highestImpact.impact} color={data.color} size={56} strokeWidth={5} />
            <div className="absolute inset-0 flex items-center justify-center"><span className="text-sm font-bold text-holo-text font-mono">{highestImpact.impact}</span></div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-holo-muted text-xs">Vs Avg: <span className="font-bold text-red-400">+{highestImpact.impact - avgImpact}</span></span>
          <div className="flex items-center text-holo-primary text-xs font-bold uppercase">{isExpanded ? 'Less' : 'More'}{isExpanded ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronRight className="w-3 h-3 ml-1" />}</div>
        </div>
      </div>
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-holo-border pt-4 space-y-4 bg-black/20">
          <div>
            <h4 className="text-[10px] font-bold text-holo-muted uppercase tracking-widest mb-3">Sector Exposure</h4>
            <div className="space-y-2">
              {data.sectorExposure.map((sector: SectorExposure, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs text-holo-muted w-20 truncate">{sector.sector}</span>
                  <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full rounded-full transition-all duration-500 shadow-[0_0_8px_currentColor]" style={{ width: `${Math.abs(sector.exposure)}%`, backgroundColor: sector.exposure < 0 ? '#22c55e' : data.color, color: sector.exposure < 0 ? '#22c55e' : data.color }} />
                  </div>
                  <span className={`text-xs font-mono w-12 text-right ${sector.exposure < 0 ? 'text-green-400' : 'text-holo-muted'}`}>{sector.exposure > 0 ? '' : '+'}{sector.exposure}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </TechCard>
  );
};

const GDPImpactCard = ({ scenario, data, isExpanded, onToggle }: any) => {
  const [gdpMin, gdpMax] = data.gdpRange;
  const recoveryMonths = data.recoveryPath.find((d: RecoveryPath) => d.gdp === 0 && d.month > 0)?.month || 24;
  return (
    <TechCard className="cursor-pointer hover:border-holo-primary/40" onClick={onToggle}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center text-xs font-bold text-holo-muted uppercase tracking-wider mb-1"><Target className="w-4 h-4 mr-1.5 text-purple-400" />Peak GDP Effect</div>
            <h3 className="text-2xl font-bold text-red-400 font-mono tracking-tight">{gdpMin}% <span className="text-white text-lg">to</span> {gdpMax}%</h3>
          </div>
          <div className="text-right">
            <div className="flex items-center text-holo-muted text-xs font-mono"><Clock className="w-3.5 h-3.5 mr-1" />{data.gdpTimeline}</div>
          </div>
        </div>
        <div className="h-12 -mx-2 opacity-80"><MiniSparkline data={data.recoveryPath} dataKey="gdp" color={data.color} /></div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-holo-muted text-xs">Recovery: <span className="font-bold text-holo-text">{recoveryMonths}mo</span></span>
          <div className="flex items-center text-holo-primary text-xs font-bold uppercase">{isExpanded ? 'Less' : 'More'}{isExpanded ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronRight className="w-3 h-3 ml-1" />}</div>
        </div>
      </div>
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-holo-border pt-4 space-y-4 bg-black/20">
          <div>
            <h4 className="text-[10px] font-bold text-holo-muted uppercase tracking-widest mb-3">Regional Impact</h4>
            <div className="grid grid-cols-2 gap-2">
              {data.regionalRisk.map((region: RegionalRisk, idx: number) => (
                <div key={idx} className="p-3 bg-black/30 rounded-lg border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-holo-muted uppercase">{region.region}</span>
                    <span className="text-xs font-bold text-red-400 font-mono">{region.gdp}%</span>
                  </div>
                  <div className="h-1 bg-black/50 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full shadow-[0_0_5px_red]" style={{ width: `${Math.min(Math.abs(region.gdp) * 15, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </TechCard>
  );
};

const RiskAssessmentCard = ({ scenario, data, isExpanded, onToggle }: { scenario: string; data: ShockScenario; isExpanded: boolean; onToggle: () => void }) => {
  const criticalRisks = data.keyRisks.filter(r => r.severity.toLowerCase() === 'critical').length;
  const avgLikelihood = Math.round(data.keyRisks.reduce((sum, r) => sum + r.likelihood, 0) / data.keyRisks.length * 100);
  return (
    <TechCard className="cursor-pointer hover:border-holo-primary/40" onClick={onToggle}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center text-xs font-bold text-holo-muted uppercase tracking-wider mb-1"><Shield className="w-4 h-4 mr-1.5 text-blue-400" />Risk Assessment</div>
            <h3 className="text-2xl font-bold text-holo-text">{criticalRisks} Critical</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400 font-mono">{avgLikelihood}%</div>
            <div className="text-[10px] text-holo-muted uppercase">likelihood</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {data.keyRisks.slice(0, 3).map((risk, idx) => (<SeverityBadge key={idx} severity={risk.severity} />))}
          {data.keyRisks.length > 3 && (<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-holo-muted border border-white/10">+{data.keyRisks.length - 3}</span>)}
        </div>
        <div className="flex items-center justify-end">
          <div className="flex items-center text-holo-primary text-xs font-bold uppercase">{isExpanded ? 'Less' : 'More'}{isExpanded ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronRight className="w-3 h-3 ml-1" />}</div>
        </div>
      </div>
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-holo-border pt-4 space-y-4 bg-black/20">
          <div>
            <h4 className="text-[10px] font-bold text-holo-muted uppercase tracking-widest mb-3">Risk Factors</h4>
            <div className="space-y-2">
              {data.keyRisks.map((risk, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-black/30 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <SeverityBadge severity={risk.severity} />
                    <span className="text-xs text-holo-text">{risk.risk}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1 bg-black/50 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${risk.likelihood * 100}%`, backgroundColor: risk.likelihood > 0.6 ? '#ef4444' : risk.likelihood > 0.4 ? '#f59e0b' : '#22c55e' }} />
                    </div>
                    <span className="text-[10px] font-mono text-holo-muted w-6 text-right">{Math.round(risk.likelihood * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </TechCard>
  );
};


// ============================================
// MAIN COMPONENT
// ============================================

const TransmissionMap: React.FC<{ openExplainer: (data: ExplainerData) => void }> = ({ openExplainer }) => {
  const [selectedScenario, setSelectedScenario] = useState('geopolitical');
  const [liveScenarios, setLiveScenarios] = useState<Record<string, ShockScenario>>(STATIC_SCENARIOS);
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [loading, setLoading] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  
  // Cache status tracking
  const [cacheInfo, setCacheInfo] = useState<{
    fromCache: boolean;
    lastUpdated: string | null;
    nextRefresh: { hours: number; minutes: number } | null;
    cachedScenarios: string[];
  }>({ fromCache: false, lastUpdated: null, nextRefresh: null, cachedScenarios: [] });
  
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState('map');
  const [showFeedback, setShowFeedback] = useState(true);
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean | undefined }>({});

  const scenario = liveScenarios[selectedScenario];
  const timelineData = useMemo(() => generateTimelineData(selectedScenario, scenario.recoveryPath), [selectedScenario, scenario]);
  const regionalData = scenario.regionalRisk.map(r => ({ ...r, impact: r.gdp })); 

  /**
   * Load scenario data with cache-first strategy
   */
  const loadScenarioData = useCallback(async (scenarioId: string, forceRefresh = false) => {
    setLoading(true);
    
    // 1. Try cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedData = getCachedScenario(scenarioId);
      if (cachedData) {
        const base = STATIC_SCENARIOS[scenarioId];
        setLiveScenarios(prev => ({
          ...prev,
          [scenarioId]: {
            ...prev[scenarioId],
            ...cachedData,
            channelSpeeds: cachedData.channelSpeeds || prev[scenarioId].channelSpeeds,
            sectorExposure: cachedData.sectorExposure || prev[scenarioId].sectorExposure,
            regionalRisk: cachedData.regionalRisk || prev[scenarioId].regionalRisk,
            keyRisks: cachedData.keyRisks || prev[scenarioId].keyRisks,
            mitigationEffectiveness: cachedData.mitigationEffectiveness || prev[scenarioId].mitigationEffectiveness
          }
        }));
        
        if (cachedData.nodeImpacts) {
          setNodes((prevNodes: any) => {
            const newNodes = { ...prevNodes };
            Object.keys(cachedData.nodeImpacts!).forEach(nodeKey => {
              const normalizedKey = nodeKey.toLowerCase();
              if (newNodes[normalizedKey]) {
                newNodes[normalizedKey] = {
                  ...newNodes[normalizedKey],
                  impacts: {
                    ...newNodes[normalizedKey].impacts,
                    [scenarioId]: cachedData.nodeImpacts![nodeKey]
                  }
                };
              }
            });
            return newNodes;
          });
        }
        
        const status = getScenarioCacheStatus(scenarioId);
        setCacheInfo({
          fromCache: true,
          lastUpdated: status.lastUpdated,
          nextRefresh: status.nextRefresh,
          cachedScenarios: Object.keys(getAllCachedScenarios()),
        });
        setLoading(false);
        console.debug(`[TransmissionMap] Loaded scenario from cache: ${scenarioId}`);
        return;
      }
    }
    
    // 2. Fetch fresh data
    console.debug(`[TransmissionMap] Fetching fresh scenario data: ${scenarioId}`);
    const base = STATIC_SCENARIOS[scenarioId];
    
    try {
      const liveData = await fetchShockScenarioAnalysis(base.name, base.description);
      
      if (liveData) {
        // Prepare data for caching
        const dataToCache: CachedScenarioData = {
          ...liveData,
          channelSpeeds: liveData.channelSpeeds || base.channelSpeeds,
          sectorExposure: liveData.sectorExposure || base.sectorExposure,
          regionalRisk: liveData.regionalRisk || base.regionalRisk,
          keyRisks: liveData.keyRisks || base.keyRisks,
          mitigationEffectiveness: liveData.mitigationEffectiveness || base.mitigationEffectiveness,
          nodeImpacts: liveData.nodeImpacts,
        };
        
        // Cache the data
        cacheScenario(scenarioId, dataToCache);
        
        setLiveScenarios(prev => ({
          ...prev,
          [scenarioId]: {
            ...prev[scenarioId],
            ...liveData,
            channelSpeeds: liveData.channelSpeeds || prev[scenarioId].channelSpeeds,
            sectorExposure: liveData.sectorExposure || prev[scenarioId].sectorExposure,
            regionalRisk: liveData.regionalRisk || prev[scenarioId].regionalRisk,
            keyRisks: liveData.keyRisks || prev[scenarioId].keyRisks,
            mitigationEffectiveness: liveData.mitigationEffectiveness || prev[scenarioId].mitigationEffectiveness
          }
        }));
        
        if (liveData.nodeImpacts) {
          setNodes((prevNodes: any) => {
            const newNodes = { ...prevNodes };
            Object.keys(liveData.nodeImpacts!).forEach(nodeKey => {
              const normalizedKey = nodeKey.toLowerCase();
              if (newNodes[normalizedKey]) {
                newNodes[normalizedKey] = {
                  ...newNodes[normalizedKey],
                  impacts: {
                    ...newNodes[normalizedKey].impacts,
                    [scenarioId]: liveData.nodeImpacts![nodeKey]
                  }
                };
              }
            });
            return newNodes;
          });
        }
        
        const status = getScenarioCacheStatus(scenarioId);
        setCacheInfo({
          fromCache: false,
          lastUpdated: status.lastUpdated,
          nextRefresh: status.nextRefresh,
          cachedScenarios: Object.keys(getAllCachedScenarios()),
        });
        console.debug(`[TransmissionMap] Fresh scenario data fetched and cached: ${scenarioId}`);
      }
    } catch (error) {
      console.error(`[TransmissionMap] Failed to fetch scenario: ${scenarioId}`, error);
      // Try stale cache as fallback
      const staleCache = getCachedScenario(scenarioId);
      if (staleCache) {
        setCacheInfo({
          fromCache: true,
          lastUpdated: 'Using cached data (fetch failed)',
          nextRefresh: null,
          cachedScenarios: Object.keys(getAllCachedScenarios()),
        });
      }
    }
    
    setLoading(false);
  }, []);

  /**
   * Manual refresh handler
   */
  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    await loadScenarioData(selectedScenario, true);
    setIsManualRefreshing(false);
  };

  /**
   * Clear all caches handler
   */
  const handleClearAllCaches = () => {
    clearAllScenarioCaches();
    setCacheInfo(prev => ({ ...prev, cachedScenarios: [] }));
  };

  useEffect(() => {
    loadScenarioData(selectedScenario);
    
    // Set up hourly check for date rollover
    const checkForNewDay = () => {
      const status = getScenarioCacheStatus(selectedScenario);
      if (!status.isCached) {
        console.debug('[TransmissionMap] Cache expired, refreshing scenario...');
        loadScenarioData(selectedScenario);
      }
    };
    
    const intervalId = setInterval(checkForNewDay, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [selectedScenario, loadScenarioData]);

  // Update countdown timer every minute
  useEffect(() => {
    const updateCountdown = () => {
      const nextRefresh = getTimeUntilRefresh();
      setCacheInfo(prev => ({ ...prev, nextRefresh }));
    };
    
    const intervalId = setInterval(updateCountdown, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const getConnectedNodes = (nodeId: string) => {
    if (!nodeId) return [];
    const connected = new Set([nodeId]);
    const findUpstream = (id: string) => { CONNECTIONS.forEach(conn => { if (conn.to === id && !conn.feedback) { connected.add(conn.from); findUpstream(conn.from); } }); };
    const findDownstream = (id: string) => { CONNECTIONS.forEach(conn => { if (conn.from === id && !conn.feedback) { connected.add(conn.to); findDownstream(conn.to); } }); };
    findUpstream(nodeId); findDownstream(nodeId);
    return Array.from(connected);
  };
  const handleNodeHover = (nodeId: string) => { setActiveNode(nodeId); setHighlightedPath(getConnectedNodes(nodeId)); };
  const handleNodeClick = (nodeId: string) => { setActiveNode(activeNode === nodeId ? null : nodeId); setHighlightedPath(activeNode === nodeId ? [] : getConnectedNodes(nodeId)); };
  const getLayerColor = (layer: string) => { const colors: any = { trigger: '#ef4444', primary: '#f97316', secondary: '#3b82f6', tertiary: '#8b5cf6', outcome: '#22c55e' }; return colors[layer] || '#6b7280'; };
  const toggleCard = (cardId: string) => { setExpandedCards(prev => ({ ...prev, [cardId]: !prev[cardId] })); };
  const expandAllCards = () => { setExpandedCards({ fastest: true, impact: true, gdp: true, risk: true }); };
  const collapseAllCards = () => { setExpandedCards({}); };
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-holo-card/95 border border-holo-border p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-[10px] text-holo-muted font-bold uppercase mb-1">{label}</p>
          {payload.map((p: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full" style={{backgroundColor: p.color}}></span>
              <span className="text-holo-text font-mono">{p.name}: {p.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderNetworkMap = () => (
    <div className="relative">
      <div className="absolute top-0 left-0 right-0 flex justify-between px-4 text-[10px] font-bold text-holo-muted tracking-widest">
        <span style={{ marginLeft: '20px' }}>TRIGGER</span>
        <span style={{ marginLeft: '-30px' }}>PRIMARY</span>
        <span style={{ marginLeft: '-20px' }}>SECONDARY</span>
        <span style={{ marginLeft: '-10px' }}>TERTIARY</span>
        <span style={{ marginRight: '20px' }}>OUTCOME</span>
      </div>
      
      <svg className="w-full" viewBox="0 0 750 340" style={{ minHeight: '340px' }}>
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="rgba(148, 163, 184, 0.4)" />
          </marker>
          <marker id="arrow-highlight" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={scenario.color} />
          </marker>
          <filter id="glow-effect">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect x="10" y="30" width="100" height="290" fill={`${getLayerColor('trigger')}08`} rx="8" stroke={`${getLayerColor('trigger')}20`} strokeWidth="1" />
        <rect x="140" y="30" width="130" height="290" fill={`${getLayerColor('primary')}08`} rx="8" stroke={`${getLayerColor('primary')}20`} strokeWidth="1" />
        <rect x="300" y="30" width="130" height="290" fill={`${getLayerColor('secondary')}08`} rx="8" stroke={`${getLayerColor('secondary')}20`} strokeWidth="1" />
        <rect x="460" y="30" width="130" height="290" fill={`${getLayerColor('tertiary')}08`} rx="8" stroke={`${getLayerColor('tertiary')}20`} strokeWidth="1" />
        <rect x="620" y="30" width="120" height="290" fill={`${getLayerColor('outcome')}08`} rx="8" stroke={`${getLayerColor('outcome')}20`} strokeWidth="1" />

        {CONNECTIONS.map((conn, i) => {
          const fromNode = nodes[conn.from];
          const toNode = nodes[conn.to];
          if (!fromNode || !toNode) return null;
          
          const isHighlighted = highlightedPath.includes(conn.from) && highlightedPath.includes(conn.to);
          const isFeedback = conn.feedback;
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;
          const offset = isFeedback ? 30 : 0;
          const pathD = isFeedback ? `M ${fromNode.x} ${fromNode.y} Q ${midX} ${midY - offset} ${toNode.x} ${toNode.y}` : `M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`;
          
          if (isFeedback && !showFeedback) return null;
          
          return (
            <g key={`conn-${i}`}>
              <path d={pathD} fill="none" stroke={isHighlighted ? scenario.color : 'rgba(255,255,255,0.1)'} strokeWidth={isHighlighted ? 2.5 : 1} strokeDasharray={isFeedback ? '4,4' : 'none'} opacity={highlightedPath.length === 0 || isHighlighted ? 1 : 0.2} markerEnd={isHighlighted ? 'url(#arrow-highlight)' : 'url(#arrow)'} className="transition-all duration-300" filter={isHighlighted ? 'url(#glow-effect)' : 'none'} />
              {isHighlighted && !isFeedback && (<circle r="3" fill={scenario.color} filter="url(#glow-effect)"><animateMotion dur="1.5s" repeatCount="indefinite" path={pathD} /></circle>)}
            </g>
          );
        })}

        {Object.values(nodes).map((node: any) => {
          const isActive = activeNode === node.id;
          const isInPath = highlightedPath.includes(node.id);
          const impact = node.impacts[selectedScenario];
          const layerColor = getLayerColor(node.layer);
          return (
            <g key={node.id} className="cursor-pointer group" onClick={() => handleNodeClick(node.id)} onMouseEnter={() => handleNodeHover(node.id)}>
              {(isActive || isInPath) && (<circle cx={node.x} cy={node.y} r={isActive ? 32 : 28} fill={`${layerColor}15`} stroke={`${layerColor}30`} className="transition-all duration-300 animate-pulse-slow" />)}
              <circle cx={node.x} cy={node.y} r={isActive ? 24 : 20} fill={isInPath || isActive ? `${layerColor}30` : '#0f172a'} stroke={isInPath || isActive ? layerColor : `${layerColor}50`} strokeWidth={2} filter={isActive ? 'url(#glow-effect)' : 'none'} className="transition-all duration-300" />
              <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">{impact?.magnitude || 0}</text>
              <text x={node.x} y={node.y + 38} textAnchor="middle" fontSize="10" className={`transition-all duration-300 font-bold ${isActive || isInPath ? 'fill-white' : 'fill-gray-400'}`} style={{ textShadow: isActive ? `0 0 10px ${layerColor}` : 'none' }}>{node.shortLabel}</text>
              {(isActive || (isInPath && highlightedPath.length > 0)) && (<g><rect x={node.x - 25} y={node.y - 42} width="50" height="16" rx="4" fill={layerColor} /><text x={node.x} y={node.y - 31} textAnchor="middle" fontSize="9" fill="black" fontWeight="bold">{impact?.timeToImpact || 'N/A'}</text></g>)}
            </g>
          );
        })}
      </svg>
      
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-white/5 text-xs">
        <div className="flex items-center gap-1.5 text-holo-muted"><div className="w-6 h-0.5 bg-gray-600" /><span>Flow</span></div>
        <div className="flex items-center gap-1.5 text-holo-muted"><div className="w-6 h-0.5 border-t-2 border-dashed border-gray-600" /><span>Feedback</span></div>
        <label className="flex items-center gap-1.5 text-holo-text cursor-pointer hover:text-holo-primary transition-colors"><input type="checkbox" checked={showFeedback} onChange={(e) => setShowFeedback(e.target.checked)} className="rounded border-gray-600 bg-black/50" /><span>Show Loops</span></label>
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="p-4">
      <h4 className="text-xs font-bold text-holo-muted uppercase tracking-widest mb-4 flex items-center gap-2">
          Propagation Wave
          <DataSourceTooltip config={{ source: 'Live SVAR Model', frequency: 'Daily (cached)', lastUpdated: cacheInfo.lastUpdated || 'Now' }} />
      </h4>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={timelineData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-white/5" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="rgba(255,255,255,0.1)" />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="rgba(255,255,255,0.1)" />
          <Tooltip content={<CustomChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
          <Area type="monotone" dataKey="shock" name="Initial Shock" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
          <Area type="monotone" dataKey="primary" name="Primary" stackId="2" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
          <Area type="monotone" dataKey="secondary" name="Secondary" stackId="3" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
          <Area type="monotone" dataKey="tertiary" name="Tertiary" stackId="4" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
          <Area type="monotone" dataKey="gdp" name="GDP Impact" stackId="5" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const renderRegionalImpact = () => (
    <div className="p-4">
      <h4 className="text-xs font-bold text-holo-muted uppercase tracking-widest mb-4 flex items-center gap-2">
          Regional Exposure
          <DataSourceTooltip config={{ source: 'IMF / World Bank', frequency: 'Daily (cached)', lastUpdated: cacheInfo.lastUpdated || 'Q3 2024' }} />
      </h4>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={regionalData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" className="stroke-white/5" />
          <XAxis type="number" domain={[-10, 0]} tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="rgba(255,255,255,0.1)" />
          <YAxis type="category" dataKey="region" tick={{ fontSize: 10, fill: '#94a3b8' }} width={100} stroke="rgba(255,255,255,0.1)" />
          <Tooltip content={<CustomChartTooltip />} />
          <Bar dataKey="impact" fill={scenario.color} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {regionalData.map((region, idx) => (
          <div key={idx} className="flex justify-between items-center p-2 bg-black/20 border border-white/5 rounded text-xs">
            <span className="text-holo-muted">{region.region}</span>
            <span className={`font-mono font-bold ${region.exposure === 'Very High' ? 'text-red-500' : region.exposure === 'High' ? 'text-orange-500' : region.exposure === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>
              {region.exposure}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNodeDetails = () => {
    if (!activeNode) {
      return (
        <div className="h-full flex flex-col justify-center items-center text-center p-6 text-holo-muted">
          <div className="mb-4 p-4 rounded-full bg-holo-primary/10 border border-holo-primary/20 animate-pulse-slow">
            <MousePointer2 className="w-8 h-8 text-holo-primary" />
          </div>
          <h3 className="text-lg font-bold text-holo-text mb-2">Select Node</h3>
          <p className="text-xs max-w-xs">
            Interact with the graph nodes to reveal detailed transmission mechanics and impact data.
          </p>
        </div>
      );
    }

    const node = nodes[activeNode];
    const impact = node.impacts[selectedScenario];
    const Icon = node.icon;
    const layerColor = getLayerColor(node.layer);

    return (
      <div className="p-5 h-full flex flex-col overflow-y-auto">
        <div className="mb-5 border-b border-holo-border pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <div className="p-2.5 rounded-lg mr-3 bg-black/40 border border-white/10" style={{ boxShadow: `0 0 10px ${layerColor}40` }}>
                <Icon className="w-5 h-5" style={{ color: layerColor }} />
              </div>
              <div>
                <LayerLabel layer={node.layer} />
                <h3 className="text-lg font-bold text-holo-text mt-1">{node.label}</h3>
              </div>
            </div>
          </div>
          <p className="text-sm text-holo-muted leading-relaxed">{node.description}</p>
        </div>

        <div className="space-y-3 mb-5">
          <h4 className="text-[10px] font-bold text-holo-muted uppercase tracking-widest flex items-center">
            Scenario Impact
            <InfoTooltip text="How this node reacts to the current shock" />
          </h4>
          <div className="grid gap-3">
            <div className="p-3 bg-black/20 rounded-lg border border-white/5">
              <div className="flex justify-between items-center mb-2"><span className="text-xs text-holo-muted">Magnitude</span><span className="text-sm font-bold font-mono" style={{ color: layerColor }}>{impact.magnitude}/100</span></div>
              <MagnitudeBar value={impact.magnitude} color={layerColor} />
            </div>
            <div className="p-3 bg-black/20 rounded-lg border border-white/5 flex justify-between items-center"><span className="text-xs text-holo-muted">Reaction Time</span><span className="text-sm font-bold text-holo-text flex items-center font-mono"><Clock className="w-3.5 h-3.5 mr-1.5 text-holo-muted" />{impact.timeToImpact}</span></div>
            <div className="p-3 bg-black/20 rounded-lg border border-white/5 flex justify-between items-center"><span className="text-xs text-holo-muted">Confidence</span><ConfidenceBadge level={impact.confidence} /></div>
            {impact.detail && (<div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20"><span className="text-xs text-amber-300 font-medium">"{impact.detail}"</span></div>)}
          </div>
        </div>

        <div className="mt-auto">
          <h4 className="text-[10px] font-bold text-holo-muted uppercase tracking-widest mb-3">Downstream Links</h4>
          <div className="space-y-2">
            {CONNECTIONS.filter(c => c.from === activeNode || c.to === activeNode).slice(0, 5).map((conn, idx) => {
              const otherNodeId = conn.from === activeNode ? conn.to : conn.from;
              const otherNode = nodes[otherNodeId];
              const direction = conn.from === activeNode ? 'outgoing' : 'incoming';
              return (
                <button key={idx} onClick={() => handleNodeClick(otherNodeId)} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors text-left border border-transparent hover:border-white/10">
                  <div className="flex items-center"><ArrowRight className={`w-3.5 h-3.5 text-holo-muted mr-2 ${direction === 'incoming' ? 'rotate-180' : ''}`} /><span className="text-xs font-bold text-holo-text">{otherNode.label}</span></div>
                  <span className={`text-[10px] uppercase font-bold ${conn.strength === 'strong' ? 'text-red-400' : conn.strength === 'medium' ? 'text-yellow-400' : 'text-holo-muted'}`}>{conn.feedback ? 'Loop' : conn.strength}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Get cache status display
  const getCacheStatusDisplay = () => {
    if (loading && !cacheInfo.fromCache) return null;
    
    if (cacheInfo.fromCache && cacheInfo.lastUpdated) {
      return (
        <div className="flex items-center gap-2 text-xs text-holo-muted mt-1">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span>Cached: {cacheInfo.lastUpdated}</span>
          {cacheInfo.nextRefresh && (
            <span className="text-holo-muted/60">
              · Next update: {cacheInfo.nextRefresh.hours}h {cacheInfo.nextRefresh.minutes}m
            </span>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="bg-gradient-to-br from-holo-surface to-black p-8 rounded-[2rem] border border-holo-border shadow-neon relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-holo-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 relative z-10">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-holo-text mb-2 flex items-center gap-3">
                <Network className="w-8 h-8 text-holo-primary" />
                Transmission Model
                {loading ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono animate-pulse border border-white/10">
                        <RefreshCw className="w-3 h-3 animate-spin" /> CALIBRATING...
                    </span>
                ) : cacheInfo.fromCache ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-holo-surface/50 rounded-full text-[10px] font-mono border border-holo-border text-holo-muted">
                        <Clock className="w-3 h-3" /> CACHED
                    </span>
                ) : scenario.lastUpdated ? (
                     <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-mono border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> LIVE DATA
                    </span>
                ) : null}
            </h1>
            <p className="text-holo-muted text-sm max-w-2xl leading-relaxed">
              Interactive structural vector autoregression (SVAR) visualization. 
              {scenario.lastUpdated ? ' Parameters calibrated to current 2024/2025 global macro conditions.' : ' Select a shock scenario to simulate economic propagation pathways.'}
            </p>
            {getCacheStatusDisplay()}
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleManualRefresh}
              disabled={loading || isManualRefreshing}
              className="flex items-center bg-holo-surface border border-holo-border text-holo-text font-bold px-4 py-3 rounded-xl hover:bg-holo-border transition-all text-xs uppercase tracking-wide disabled:opacity-50"
              title="Force refresh (ignores cache)"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isManualRefreshing ? 'animate-spin' : ''}`} />
              {isManualRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button onClick={() => openExplainer?.({ title: 'SVAR Model Logic', context: 'Explain how impulse response functions map shock transmission in this model.' })} className="flex items-center bg-holo-primary text-black font-bold px-5 py-3 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] text-xs uppercase tracking-wide"><PlayCircle className="w-4 h-4 mr-2" />Model Guide</button>
          </div>
        </div>
      </div>

      <TechCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-bold text-holo-muted uppercase tracking-widest flex items-center gap-2"><Filter className="w-4 h-4 text-holo-primary" />Active Scenario</h2>
            {cacheInfo.cachedScenarios.length > 0 && (
              <span className="text-[10px] text-holo-muted bg-holo-surface/50 px-2 py-1 rounded border border-holo-border">
                {cacheInfo.cachedScenarios.length}/8 scenarios cached
              </span>
            )}
          </div>
          <button onClick={() => { setActiveNode(null); setHighlightedPath([]); }} className="text-xs text-holo-primary hover:text-white flex items-center transition-colors font-bold"><RefreshCw className="w-3 h-3 mr-1" />RESET VIEW</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.values(STATIC_SCENARIOS).map((s) => {
            const Icon = s.icon;
            const isSelected = selectedScenario === s.id;
            const isCached = cacheInfo.cachedScenarios.includes(s.id);
            return (
              <button key={s.id} onClick={() => setSelectedScenario(s.id)} disabled={loading} className={`p-4 rounded-xl border transition-all text-left relative group overflow-hidden ${isSelected ? 'bg-holo-primary/10 border-holo-primary shadow-[0_0_15px_rgba(204,255,0,0.1)]' : 'bg-black/20 border-white/5 hover:border-white/20'} ${loading ? 'opacity-50 cursor-wait' : ''}`}>
                {loading && isSelected && (<div className="absolute top-2 right-2"><RefreshCw className="w-3 h-3 animate-spin text-holo-muted" /></div>)}
                {!loading && isCached && !isSelected && (
                  <div className="absolute top-2 right-2" title="Cached">
                    <Clock className="w-3 h-3 text-holo-muted" />
                  </div>
                )}
                <div className="flex items-center mb-3"><div className={`p-2 rounded-lg mr-3 transition-colors ${isSelected ? 'bg-holo-primary text-black' : 'bg-white/5 text-holo-muted group-hover:text-holo-text'}`}><Icon className="w-5 h-5" /></div><span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-holo-muted group-hover:text-white'}`}>{s.name}</span></div>
                <div className="flex items-center justify-between mt-auto"><span className="text-[10px] text-holo-muted font-mono">{s.probabilityLabel} prob</span><span className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-holo-muted'}`}>{s.severity.toUpperCase()}</span></div>
              </button>
            );
          })}
        </div>

        {/* Scenario Analysis Section */}
        <div className="mt-4 pt-4 border-t border-white/10 bg-black/20 rounded-xl p-4 animate-fade-in">
           <div className="flex items-start gap-4">
               <div className="p-2 rounded-lg bg-holo-surface text-holo-primary border border-holo-border">
                   <FileText className="w-5 h-5" />
               </div>
               <div className="flex-1">
                   <h3 className="text-sm font-bold text-holo-text mb-1">Scenario Intelligence: {scenario.name}</h3>
                   <p className="text-xs text-holo-muted leading-relaxed mb-3">
                       {scenario.detailedAnalysis}
                   </p>
                   <div className="flex flex-wrap gap-2">
                       {scenario.historicalEvents.map((evt, idx) => (
                           <span key={idx} className="px-2 py-1 rounded bg-white/5 text-[10px] text-holo-muted border border-white/10">
                               Reference: {evt.event}
                           </span>
                       ))}
                   </div>
               </div>
           </div>
        </div>
      </TechCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TechCard className="lg:col-span-2 min-h-[500px] flex flex-col" noBrackets>
          <div className="flex border-b border-holo-border bg-black/20">
            {[{ id: 'map', label: 'Network Graph', icon: Network }, { id: 'timeline', label: 'Impulse Response', icon: Clock }, { id: 'regional', label: 'Regional Heatmap', icon: Globe }].map((tab) => (
              <button key={tab.id} onClick={() => setViewMode(tab.id)} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all ${viewMode === tab.id ? 'bg-white/5 text-holo-primary border-b-2 border-holo-primary' : 'text-holo-muted hover:text-holo-text hover:bg-white/5'}`}>
                <tab.icon className="w-4 h-4" /><span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="flex-1 p-6 relative">
            {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-holo-muted bg-black/40 backdrop-blur-sm z-10"><RefreshCw className="w-8 h-8 animate-spin mb-4 text-holo-primary" /><p className="text-xs font-mono uppercase tracking-widest">Injecting Live Data...</p></div>
            ) : (
                <>
                    {viewMode === 'map' && renderNetworkMap()}
                    {viewMode === 'timeline' && renderTimeline()}
                    {viewMode === 'regional' && renderRegionalImpact()}
                </>
            )}
          </div>
        </TechCard>
        
        <TechCard className="bg-holo-card/80">
          {renderNodeDetails()}
        </TechCard>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div><h2 className="text-lg font-bold text-holo-text flex items-center gap-2"><Zap className="w-5 h-5 text-holo-primary" />Impact Analysis</h2></div>
          <div className="flex items-center gap-2"><button onClick={expandAllCards} className="text-[10px] text-holo-primary hover:text-white font-bold uppercase px-3 py-1.5 rounded border border-holo-primary/30 hover:bg-holo-primary/20 transition-all">Expand All</button><button onClick={collapseAllCards} className="text-[10px] text-holo-muted hover:text-white font-bold uppercase px-3 py-1.5 rounded border border-white/10 hover:bg-white/10 transition-all">Collapse</button></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FastestChannelCard scenario={selectedScenario} data={scenario} isExpanded={expandedCards.fastest} onToggle={() => toggleCard('fastest')} />
          <HighestImpactCard scenario={selectedScenario} data={scenario} isExpanded={expandedCards.impact} onToggle={() => toggleCard('impact')} />
          <GDPImpactCard scenario={selectedScenario} data={scenario} isExpanded={expandedCards.gdp} onToggle={() => toggleCard('gdp')} />
          <RiskAssessmentCard scenario={selectedScenario} data={scenario} isExpanded={expandedCards.risk} onToggle={() => toggleCard('risk')} />
        </div>
        
        <div className="p-6 rounded-2xl border border-holo-border bg-gradient-to-r from-holo-surface to-black flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-holo-primary/10 border border-holo-primary/30"><scenario.icon className="w-8 h-8" style={{ color: scenario.color }} /></div>
              <div><h3 className="text-xl font-bold text-white mb-1">{scenario.name} Protocol</h3><p className="text-xs text-holo-muted font-mono">PROB: <span className="text-white">{Math.round(scenario.probability * 100)}%</span> • GDP: <span className="text-red-400">{scenario.gdpRange[0]}% TO {scenario.gdpRange[1]}%</span></p></div>
            </div>
            <div className="flex gap-8 border-l border-white/10 pl-8">
               <div className="text-center"><div className="text-2xl font-bold font-mono text-holo-primary">{scenario.channelSpeeds.reduce((a, b) => a.days < b.days ? a : b).days}D</div><div className="text-[10px] text-holo-muted uppercase tracking-wider">Reaction</div></div>
               <div className="text-center"><div className="text-2xl font-bold font-mono text-red-500">{scenario.keyRisks.filter(r => r.severity === 'critical').length}</div><div className="text-[10px] text-holo-muted uppercase tracking-wider">Critical Risks</div></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TransmissionMap;
