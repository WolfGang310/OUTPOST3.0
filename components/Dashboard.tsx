import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ExplainerData, GlobalRiskMetrics } from '../types';
import { GPR_HISTORICAL_DATA, EVENT_INSIGHTS, RISK_REGIONS } from '../constants';
import { fetchGlobalRiskMetrics } from '../services/geminiService';
import { playStartupSound, playHoverSound } from '../services/audioService';
import { 
  getCachedMetrics, 
  cacheMetrics, 
  getCacheStatus,
  getTimeUntilRefresh 
} from '../services/cacheService';
import GeopoliticalMap from './GeopoliticalMap';
import DataMeshOverlay from './DataMeshOverlay';
import TechCard from './TechCard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { AlertTriangle, TrendingUp, ShieldAlert, Activity, MoreHorizontal, ArrowUpRight, Zap, RefreshCw, Clock } from 'lucide-react';
import DataSourceTooltip from './DataSourceTooltip';

interface DashboardProps {
  openExplainer: (data: ExplainerData) => void;
}

// SKELETON COMPONENTS
const HeroSkeleton = () => (
    <div className="animate-shimmer w-full h-full flex flex-col">
        <div className="flex justify-between items-start mb-6">
            <div className="h-4 w-24 bg-holo-surface rounded"></div>
            <div className="h-4 w-12 bg-holo-surface rounded"></div>
        </div>
        <div className="mb-6 space-y-3">
             <div className="h-16 w-48 bg-holo-surface rounded-lg"></div>
             <div className="h-8 w-32 bg-holo-surface rounded-lg"></div>
        </div>
        <div className="flex gap-1 mt-auto items-end h-20 opacity-50">
            {[1,2,3,4,5,6,7].map(i => (
                <div key={i} className="flex-1 bg-holo-surface rounded-sm" style={{height: `${Math.random() * 60 + 20}%`}}></div>
            ))}
        </div>
    </div>
);

const StatSkeleton = () => (
    <div className="animate-shimmer w-full h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-holo-surface"></div>
            <div className="w-5 h-5 rounded-full bg-holo-surface"></div>
        </div>
        <div className="mt-4 space-y-2">
            <div className="h-3 w-20 bg-holo-surface rounded"></div>
            <div className="flex gap-2 items-baseline">
                <div className="h-8 w-16 bg-holo-surface rounded"></div>
                <div className="h-5 w-12 bg-holo-surface rounded"></div>
            </div>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ openExplainer }) => {
  const gprCardRef = useRef<HTMLDivElement>(null);
  const statsGridRef = useRef<HTMLDivElement>(null);
  const chartCardRef = useRef<HTMLDivElement>(null);
  const mapCardRef = useRef<HTMLDivElement>(null);
  const insightCardRef = useRef<HTMLDivElement>(null);

  const chartEvents = React.useMemo(
    () => (GPR_HISTORICAL_DATA as any[]).filter(d => d.event && typeof d.event === 'string'),
    []
  );

  const criticalRisk = React.useMemo(() => {
    const order: Record<string, number> = { 'Critical': 4, 'High': 3, 'Elevated': 2, 'Medium': 1, 'Low': 0 };
    return [...RISK_REGIONS].sort((a, b) => (order[b.riskLevel] || 0) - (order[a.riskLevel] || 0))[0];
  }, []);

  const getBannerStyles = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_10px_rgba(220,38,38,0.1)]';
      case 'High': return 'bg-orange-500/10 border-orange-500/20 text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.1)]';
      case 'Elevated': return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500';
      default: return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
    }
  };

  const initialEvent = 'Indo-Pacific Tension';
  const [selectedEvent, setSelectedEvent] = React.useState<string>(initialEvent);
  const [riskMetrics, setRiskMetrics] = useState<GlobalRiskMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [cacheInfo, setCacheInfo] = useState<{ 
    fromCache: boolean; 
    lastUpdated: string | null;
    nextRefresh: { hours: number; minutes: number } | null;
  }>({ fromCache: false, lastUpdated: null, nextRefresh: null });
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const loadMetrics = useCallback(async (forceRefresh = false) => {
    setIsLoadingMetrics(true);
    
    if (!forceRefresh) {
      const cachedData = getCachedMetrics();
      if (cachedData) {
        setRiskMetrics(cachedData);
        const status = getCacheStatus();
        setCacheInfo({
          fromCache: true,
          lastUpdated: status.lastUpdated,
          nextRefresh: status.nextRefresh,
        });
        setIsLoadingMetrics(false);
        return;
      }
    }
    
    try {
      const data = await fetchGlobalRiskMetrics();
      if (data) {
        setRiskMetrics(data);
        cacheMetrics(data);
        const status = getCacheStatus();
        setCacheInfo({
          fromCache: false,
          lastUpdated: status.lastUpdated,
          nextRefresh: status.nextRefresh,
        });
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      const staleCache = getCachedMetrics();
      if (staleCache) {
        setRiskMetrics(staleCache);
        setCacheInfo({
          fromCache: true,
          lastUpdated: 'Using cached data (fetch failed)',
          nextRefresh: null,
        });
      }
    }
    
    setIsLoadingMetrics(false);
  }, []);

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    await loadMetrics(true);
    setIsManualRefreshing(false);
  };

  useEffect(() => {
    playStartupSound();
    loadMetrics();
    
    const checkForNewDay = () => {
      const status = getCacheStatus();
      if (!status.isCached) {
        loadMetrics();
      }
    };
    
    const intervalId = setInterval(checkForNewDay, 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [loadMetrics]);

  useEffect(() => {
    const updateCountdown = () => {
      const nextRefresh = getTimeUntilRefresh();
      setCacheInfo(prev => ({ ...prev, nextRefresh }));
    };
    
    const intervalId = setInterval(updateCountdown, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const selectedInsight = EVENT_INSIGHTS[selectedEvent] ?? {
    title: selectedEvent || 'Event Insight',
    subtitle: 'No custom narrative yet – treat this as raw risk signal.',
    body: 'This event is flagged in the GPR time series, but there is no curated insight attached yet.',
    keyFacts: ['Analysis Pending', 'Check raw data feeds'],
  };

  const handleChartClick = (state: any) => {
    if (state && state.activeTooltipIndex !== undefined) {
      const clickedIndex = state.activeTooltipIndex;
      let closestEvent = '';
      let minDistance = Infinity;

      GPR_HISTORICAL_DATA.forEach((point, index) => {
        if (point.event) {
          const distance = Math.abs(index - clickedIndex);
          if (distance < minDistance) {
            minDistance = distance;
            closestEvent = point.event;
          }
        }
      });

      if (closestEvent) setSelectedEvent(closestEvent);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-holo-card/95 border border-holo-primary/20 p-4 rounded-xl shadow-xl backdrop-blur-md">
          <p className="text-holo-muted text-[10px] font-mono uppercase tracking-widest mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
              <p className="text-holo-text font-bold text-xl font-mono">{payload[0].value}</p>
              <span className="text-[10px] text-holo-muted">Points</span>
          </div>
          {point.event && (
            <div className="mt-2 pt-2 border-t border-holo-border">
               <p className="text-holo-primary text-xs font-bold flex items-center gap-1">
                 <Zap className="w-3 h-3" />
                 {point.event}
               </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const barData = [
      { name: 'M', val: 40 }, { name: 'T', val: 65 }, { name: 'W', val: 35 }, 
      { name: 'T', val: 80 }, { name: 'F', val: 55 }, { name: 'S', val: 30 }, { name: 'S', val: 45 }
  ];

  const getStatusDisplay = () => {
    if (isLoadingMetrics) return 'CALIBRATING SYSTEM SENSORS...';
    
    if (cacheInfo.lastUpdated) {
      const refreshInfo = cacheInfo.nextRefresh 
        ? ` · NEXT UPDATE: ${cacheInfo.nextRefresh.hours}h ${cacheInfo.nextRefresh.minutes}m`
        : '';
      return `SYSTEM ONLINE · CACHED: ${cacheInfo.lastUpdated}${refreshInfo}`;
    }
    
    return `SYSTEM ONLINE · UPDATED: ${riskMetrics?.lastUpdated || 'TODAY 12:00 AM ET'}`;
  };

  return (
    <div className="relative space-y-6 pb-6">
        <DataMeshOverlay elements={[gprCardRef, statsGridRef, chartCardRef, mapCardRef, insightCardRef]} />

        {criticalRisk && (
            <div className={`relative z-20 -mb-2 px-4 py-2.5 rounded-xl border flex items-center justify-between animate-fade-in backdrop-blur-sm ${getBannerStyles(criticalRisk.riskLevel)}`}>
               <div className="flex items-center gap-3">
                   <div className="p-1 rounded bg-current/10 animate-pulse">
                        <ShieldAlert className="w-3.5 h-3.5" />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                       Global Alert: <span className="text-white">{criticalRisk.name}</span>
                       <span className="opacity-60 text-[10px] hidden sm:inline-block border-l border-current/30 pl-2">Risk Level: {criticalRisk.riskLevel}</span>
                   </span>
               </div>
               <div className="flex items-center gap-2 text-[10px] font-mono font-bold opacity-80">
                   <span>TREND: {criticalRisk.trend.toUpperCase()}</span>
                   {criticalRisk.trend === 'Escalating' ? <TrendingUp className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
               </div>
            </div>
        )}

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 animate-slide-up">
            <div>
                <h2 className="text-3xl font-bold text-holo-text tracking-tighter font-sans">Dashboard</h2>
                <div className="flex items-center gap-2 mt-1">
                    {isLoadingMetrics ? (
                        <span className="w-2 h-2 rounded-full bg-holo-muted animate-pulse"></span>
                    ) : (
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    )}
                    <p className="text-holo-muted text-xs font-mono uppercase tracking-wide flex items-center gap-2">
                        {getStatusDisplay()}
                        {cacheInfo.fromCache && !isLoadingMetrics && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-holo-surface/50 rounded text-[9px] border border-holo-border">
                                <Clock className="w-2.5 h-2.5" />
                                CACHED
                            </span>
                        )}
                    </p>
                </div>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={handleManualRefresh}
                    disabled={isManualRefreshing || isLoadingMetrics}
                    className="px-3 py-2 bg-holo-surface/50 border border-holo-border rounded-lg text-xs font-mono text-holo-muted hover:text-holo-text hover:bg-holo-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Force refresh data (ignores cache)"
                >
                    <RefreshCw className={`w-4 h-4 ${isManualRefreshing ? 'animate-spin' : ''}`} />
                </button>
                <button className="px-4 py-2 bg-holo-surface/50 border border-holo-border rounded-lg text-xs font-mono text-holo-muted hover:text-holo-text hover:bg-holo-surface transition-colors">
                    DEC 2025 - JAN 2026
                </button>
                <button 
                    onClick={() => openExplainer({ title: "AI Forecasting", context: "Run a forward looking simulation for 2026." })}
                    onMouseEnter={playHoverSound}
                    className="px-5 py-2 bg-holo-primary text-black font-bold rounded-lg text-xs hover:bg-holo-primary/90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(204,255,0,0.4)] hover:shadow-[0_0_25px_rgba(204,255,0,0.6)]"
                >
                    <Zap className="w-3 h-3 fill-current" />
                    RUN SIMULATION
                </button>
            </div>
        </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <TechCard 
            ref={gprCardRef}
            className="lg:col-span-1 p-8 cursor-pointer group hover:bg-holo-card"
            onClick={() => openExplainer({ title: "GPR Index", context: `Current Global Geopolitical Risk Index is ${riskMetrics?.gprValue || '260.0'}.` })}
            onMouseEnter={playHoverSound}
            glow
            delay="100ms"
        >
            {isLoadingMetrics ? (
                <HeroSkeleton />
            ) : (
                <>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-holo-primary/10 blur-[60px] rounded-full group-hover:bg-holo-primary/20 transition-all duration-500"></div>
                    
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2 text-holo-muted text-xs font-bold uppercase tracking-widest">
                            <Activity className="w-4 h-4 text-holo-primary" />
                            GPR Index
                            <DataSourceTooltip config={{
                                source: 'Federal Reserve Bank of Dallas',
                                frequency: 'Daily (cached)',
                                url: 'https://www.matteoiacoviello.com/gpr.htm',
                                lastUpdated: cacheInfo.lastUpdated || 'Dec 2025'
                            }} />
                        </div>
                        <div className="px-2 py-0.5 rounded border border-holo-border bg-black/20 text-[10px] text-holo-muted font-mono flex items-center gap-1">
                            {cacheInfo.fromCache ? (
                                <>
                                    <Clock className="w-2.5 h-2.5" />
                                    CACHED
                                </>
                            ) : (
                                'LIVE'
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-6xl font-bold text-holo-text mb-2 font-mono tracking-tighter group-hover:scale-105 transition-transform origin-left duration-300">
                            {riskMetrics?.gprValue || '260.0'}
                        </h3>
                        
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                            <TrendingUp className="w-3 h-3 text-green-400" />
                            <span className="text-sm font-bold text-green-400 font-mono">{riskMetrics?.gprTrend || '+2.1%'}</span>
                            <span className="text-[10px] text-green-500/70 uppercase font-bold">This Week</span>
                        </div>
                    </div>

                    <div className="h-20 flex items-end justify-between gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        {barData.map((d, i) => (
                            <div key={i} className="w-full bg-holo-surface/30 rounded-sm relative overflow-hidden h-full flex items-end">
                                <div 
                                    className={`w-full transition-all duration-700 ease-out rounded-sm ${i === 3 ? 'bg-holo-primary shadow-[0_0_10px_rgba(204,255,0,0.5)]' : 'bg-holo-border group-hover:bg-holo-muted'}`}
                                    style={{ height: `${d.val}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </TechCard>

        <div ref={statsGridRef} className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
             {[
                { 
                    title: 'Energy Volatility', 
                    val: riskMetrics?.energyVolatility.status || 'High', 
                    trend: riskMetrics?.energyVolatility.trend || 'Escalating', 
                    icon: AlertTriangle, 
                    color: 'text-orange-500',
                },
                { 
                    title: 'Conflict Zones', 
                    val: riskMetrics?.conflictZones.count || '5', 
                    trend: riskMetrics?.conflictZones.status || 'Active', 
                    icon: ShieldAlert, 
                    color: 'text-red-500',
                },
                { 
                    title: 'Market Resilience', 
                    val: riskMetrics?.marketResilience.status || 'Mod', 
                    trend: riskMetrics?.marketResilience.change || '-0.5%', 
                    icon: TrendingUp, 
                    color: 'text-holo-accent',
                },
                { 
                    title: 'Supply Chain', 
                    val: riskMetrics?.supplyChain.value || '92%', 
                    trend: riskMetrics?.supplyChain.status || 'Strained', 
                    icon: Activity, 
                    color: 'text-purple-500',
                }
             ].map((stat, idx) => (
                 <TechCard key={idx} onMouseEnter={playHoverSound} className="p-6 group flex flex-col justify-between" delay={`${(idx + 2) * 100}ms`}>
                     {isLoadingMetrics ? (
                        <StatSkeleton />
                     ) : (
                         <>
                            <div className="flex justify-between items-start">
                                <div className={`p-2.5 rounded-lg bg-holo-surface/50 border border-holo-border ${stat.color}`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <MoreHorizontal className="w-5 h-5 text-holo-border group-hover:text-holo-muted transition-colors" />
                            </div>
                            
                            <div className="mt-4">
                                <h4 className="text-holo-muted text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                                    {stat.title}
                                    <DataSourceTooltip config={{
                                        source: 'Aggregated Market Feeds',
                                        lastUpdated: cacheInfo.lastUpdated || 'Live'
                                    }} />
                                </h4>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-holo-text font-mono tracking-tight">{stat.val}</span>
                                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-black/20 ${stat.color}`}>{stat.trend}</span>
                                </div>
                            </div>
                            
                            <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                <stat.icon className="w-32 h-32 -mb-8 -mr-8" />
                            </div>
                         </>
                     )}
                 </TechCard>
             ))}
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <TechCard ref={chartCardRef} className="p-6 h-[400px] flex flex-col animate-scanline" delay="400ms">
            <div className="flex items-center justify-between mb-4 z-10 relative">
              <div>
                <h3 className="text-sm font-bold text-holo-text uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-holo-primary" />
                    Geopolitical Risk Timeline
                    <DataSourceTooltip config={{
                        source: 'Federal Reserve Bank of Dallas',
                        url: 'https://www.matteoiacoviello.com/gpr.htm',
                        lastUpdated: 'Jan 2026'
                    }} />
                </h3>
                <p className="text-[10px] text-holo-muted font-mono mt-0.5">SOURCE: FED GPR · 1914 - 2026</p>
              </div>
              <button className="p-2 hover:bg-holo-surface rounded-lg transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-holo-muted" />
              </button>
            </div>

            <div className="flex-1 w-full min-h-0 cursor-crosshair relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={GPR_HISTORICAL_DATA}
                  onClick={handleChartClick}
                  margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--holo-primary)', strokeWidth: 1 }} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--holo-accent)"
                    strokeWidth={2}
                    fill="url(#colorValue)"
                    animationDuration={1500}
                  />
                  {chartEvents.map((point: any) => {
                    const isActive = point.event === selectedEvent;
                    return (
                      <ReferenceLine
                        key={point.date}
                        x={point.date}
                        stroke={isActive ? 'var(--holo-primary)' : 'transparent'}
                        strokeDasharray="3 3"
                      />
                    );
                  })}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TechCard>
          
          <TechCard ref={mapCardRef} className="h-[400px] p-0 overflow-hidden border-0" delay="500ms">
              <div className="absolute top-4 right-4 z-20">
                  <DataSourceTooltip config={{
                      source: 'Global Incident Map / GDELT',
                      frequency: 'Real-time',
                      lastUpdated: 'Live'
                  }} />
              </div>
              <GeopoliticalMap selectedEvent={selectedEvent} />
          </TechCard>
        </div>

        <TechCard ref={insightCardRef} className="lg:col-span-1 p-0 h-full group" delay="600ms">
            <div className="absolute inset-0 bg-holo-primary/5 opacity-30 group-hover:opacity-60 transition-opacity duration-700"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-holo-accent/10 rounded-full blur-[60px] animate-pulse-slow"></div>

            <div className="relative z-10 p-8 h-full flex flex-col">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-holo-surface to-black border border-holo-border flex items-center justify-center mb-6 shadow-neon">
                    <Zap className="w-5 h-5 text-holo-primary" />
                </div>

                <div className="mb-auto">
                    <div className="text-[10px] font-bold text-holo-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-holo-primary rounded-full animate-blink"></span>
                        Analyst Insight
                    </div>
                    <h3 className="text-xl font-bold text-holo-text mb-2 leading-tight font-sans">{selectedInsight.title}</h3>
                    <p className="text-xs text-holo-muted mb-6 line-clamp-2 font-mono">{selectedInsight.subtitle}</p>
                    
                    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-5 border border-white/5 mb-6 group-hover:border-holo-primary/20 transition-colors">
                        <p className="text-xs text-holo-text leading-relaxed font-light">
                            {selectedInsight.body.length > 150 ? selectedInsight.body.substring(0, 150) + '...' : selectedInsight.body}
                        </p>
                    </div>

                    <div className="space-y-3 pl-1">
                        {selectedInsight.keyFacts.slice(0, 2).map((fact, i) => (
                             <div key={i} className="flex items-center gap-3 text-xs text-holo-muted">
                                 <div className="w-1 h-1 rounded-full bg-holo-accent shadow-[0_0_5px_currentColor]"></div>
                                 {fact}
                             </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => openExplainer({ title: selectedInsight.title, context: selectedInsight.body })}
                    className="mt-6 w-full py-3 bg-white text-black font-bold rounded-lg text-xs hover:opacity-90 transition-opacity shadow-lg"
                >
                    VIEW FULL REPORT
                </button>
            </div>
        </TechCard>
      </div>
    </div>
  );
};

export default Dashboard;
