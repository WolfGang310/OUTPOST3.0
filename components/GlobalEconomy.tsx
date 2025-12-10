
import React, { useEffect, useState } from 'react';
import { ExplainerData } from '../types';
import { 
    CURRENCY_COMPOSITION_DATA, 
    SHIPPING_DATA, 
    FOOD_SECURITY_DATA, 
    FOOD_PRICE_INDEX,
    SOCIAL_UNREST_DATA,
    UNCERTAINTY_INDEX_DATA,
    OIL_INTENSITY_DATA,
    INFLATION_REGION_DATA,
    EXPLAINER_CONTENT
} from '../constants';
import { fetchEconomicBriefing } from '../services/geminiService';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, LineChart, Line, ComposedChart, Legend, ReferenceLine, Label, Cell
} from 'recharts';
import { TrendingUp, DollarSign, Ship, Wheat, AlertTriangle, Droplet, Globe, Info, Zap, Loader2, BookOpen } from 'lucide-react';
import TechCard from './TechCard';

interface GlobalEconomyProps {
    openExplainer: (data: ExplainerData) => void;
}

const CACHE_KEY = 'outpost_econ_brief_v1';

const GlobalEconomy: React.FC<GlobalEconomyProps> = ({ openExplainer }) => {
    const [briefing, setBriefing] = useState<string>("");
    const [loadingBrief, setLoadingBrief] = useState(true);

    useEffect(() => {
        const loadBrief = async () => {
            // Check cache first
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const parsed = JSON.parse(cached);
                    const now = new Date();
                    const currentET = now.toLocaleDateString('en-US', { timeZone: 'America/New_York' });
                    const cachedTime = new Date(parsed.timestamp);
                    const cachedET = cachedTime.toLocaleDateString('en-US', { timeZone: 'America/New_York' });

                    if (currentET === cachedET && parsed.data) {
                        setBriefing(parsed.data);
                        setLoadingBrief(false);
                        return;
                    }
                }
            } catch (e) {
                console.warn("Briefing cache error", e);
            }

            // Fetch fresh
            const text = await fetchEconomicBriefing();
            setBriefing(text);
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                timestamp: Date.now(),
                data: text
            }));
            setLoadingBrief(false);
        };
        loadBrief();
    }, []);

    // Interactive Handler for Inflation Chart
    const handleInflationClick = (data: any) => {
        if (!data) return;
        const region = data.region || 'Global';
        const val = data.inflation || 0;
        openExplainer({
            title: `Inflation Analysis: ${region}`,
            context: `Deep dive into the structural inflation drivers in ${region} (currently ${val}%). Compare this with the 1970s Great Inflation case study and analyze potential monetary policy responses needed to curb price pressures.`
        });
    };

    // Interactive Handler for Unrest Chart
    const handleUnrestClick = (data: any) => {
        const payload = data?.payload || data;
        if (!payload) return;
        openExplainer({
            title: `Civil Unrest Analysis: ${payload.year}`,
            context: `Analyze the spike in social unrest during ${payload.year} (Index: ${payload.index}). Link this to the 'Arab Spring' or '2019 Global Protests' case study to understand the economic triggers (food prices, inequality) and consequences.`
        });
    };

    // Enhanced Custom Tooltip with Link capabilities
    const CustomTooltip = ({ active, payload, label, linkContext }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-holo-card/95 border border-holo-border p-4 rounded-xl shadow-xl backdrop-blur-md z-50 min-w-[160px]">
                    <p className="text-holo-muted text-[10px] font-mono uppercase mb-2 border-b border-holo-border pb-1">{label}</p>
                    {payload.map((p: any, idx: number) => (
                        <div key={idx} className="flex flex-col gap-0.5 mb-2 last:mb-0">
                            <div className="flex items-center gap-2 text-xs font-bold font-mono">
                                <span className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{backgroundColor: p.color, color: p.color}}></span>
                                <span className="text-holo-text">{p.name}:</span>
                                <span style={{color: p.color}}>{
                                    typeof p.value === 'number' 
                                    ? (p.name.includes('%') || p.name.includes('Rate') || p.name.includes('Share') ? `${p.value}%` : p.value.toLocaleString()) 
                                    : p.value
                                }</span>
                            </div>
                        </div>
                    ))}
                    
                    {/* Contextual Link Hint */}
                    {linkContext && (
                        <div className="mt-3 pt-2 border-t border-holo-border/50 animate-pulse">
                            <div className="flex items-center gap-1.5 text-[10px] text-holo-primary font-bold uppercase tracking-wide">
                                <BookOpen className="w-3 h-3" />
                                {linkContext}
                            </div>
                            <div className="text-[9px] text-holo-muted mt-0.5 font-mono">
                                Click data point to analyze
                            </div>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-slide-up">
                <div>
                    <h2 className="text-2xl font-bold text-holo-text">Global Economic Impact</h2>
                    <p className="text-holo-muted text-sm">Real-time analysis of macro-economic indicators and geopolitical correlations.</p>
                </div>
                <div className="bg-black/20 backdrop-blur border border-holo-border rounded-xl px-4 py-2 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-holo-muted uppercase">Data Stream: ACTIVE</span>
                </div>
            </div>

            {/* Live Briefing Hero */}
            <div className="bg-gradient-to-br from-holo-surface to-holo-card p-8 rounded-[2rem] border border-holo-border shadow-lg relative overflow-hidden group animate-slide-up opacity-0" style={{ animationDelay: '100ms' }}>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <Globe className="w-32 h-32 text-holo-primary rotate-12" />
                </div>
                <div className="relative z-10 max-w-5xl">
                     <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-holo-primary/10 rounded-lg">
                            <Zap className="w-4 h-4 text-holo-primary" />
                        </div>
                        <h3 className="text-sm font-bold text-holo-text uppercase tracking-widest">Live Economic Outlook</h3>
                     </div>
                     {loadingBrief ? (
                         <div className="flex items-center gap-3 text-holo-muted text-sm font-mono h-16">
                             <Loader2 className="w-5 h-5 animate-spin" />
                             <span className="animate-pulse">Retrieving global market intelligence...</span>
                         </div>
                     ) : (
                         <p className="text-lg text-holo-text leading-relaxed font-light border-l-2 border-holo-primary pl-4">
                             {briefing}
                         </p>
                     )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {/* 1. Inflation Heatmap Representation */}
                <TechCard 
                    title="Price Pressures (2025 Proj)" 
                    subtitle="Inflation projections by region" 
                    icon={<TrendingUp className="w-4 h-4 text-red-500" />}
                    onAnalyze={() => openExplainer({ title: "Global Inflation", context: "Inflation pressures have broadened beyond energy to food and services."})}
                    delay="200ms"
                    dataSource={{
                        source: 'IMF World Economic Outlook',
                        frequency: 'Quarterly',
                        url: 'https://www.imf.org/en/Publications/WEO',
                        lastUpdated: 'Late 2025'
                    }}
                >
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={INFLATION_REGION_DATA} margin={{ top: 10, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis type="number" stroke="var(--holo-muted)" fontSize={10} tickCount={5} />
                                <YAxis dataKey="region" type="category" stroke="var(--holo-text)" fontSize={10} width={90} tick={{fill: 'var(--holo-muted)'}} />
                                <Tooltip content={<CustomTooltip linkContext="Related: EM Crisis Study" />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                                <Bar 
                                    dataKey="inflation" 
                                    name="Inflation %" 
                                    radius={[0, 4, 4, 0]} 
                                    barSize={24} 
                                    animationDuration={1500}
                                    onClick={handleInflationClick}
                                    className="cursor-pointer"
                                >
                                    {INFLATION_REGION_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </TechCard>

                {/* 2. Currency Composition */}
                <TechCard 
                    title="Currency Composition" 
                    subtitle="Share of Global FX Reserves" 
                    icon={<DollarSign className="w-4 h-4 text-green-500" />}
                    onAnalyze={() => openExplainer(EXPLAINER_CONTENT.currency)}
                    delay="300ms"
                    dataSource={{
                        source: 'IMF COFER',
                        frequency: 'Quarterly',
                        url: 'https://data.imf.org/?sk=E6A5F467-C14B-4AA8-9F6D-5A09EC4E62A4',
                        lastUpdated: 'Q3 2025'
                    }}
                >
                     <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={CURRENCY_COMPOSITION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUSD" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorEuro" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorOther" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" stroke="var(--holo-muted)" fontSize={10} tickMargin={8} />
                                <YAxis stroke="var(--holo-muted)" fontSize={10} unit="%" />
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="Other" stackId="1" stroke="#ef4444" fill="url(#colorOther)" animationDuration={1500} />
                                <Area type="monotone" dataKey="Euro" stackId="1" stroke="#06b6d4" fill="url(#colorEuro)" animationDuration={1500} />
                                <Area type="monotone" dataKey="USD" stackId="1" stroke="#3b82f6" fill="url(#colorUSD)" animationDuration={1500} />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconType="circle" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </TechCard>

                {/* 3. Shipping Costs (Cargo Crunch) */}
                <TechCard 
                    title="Cargo Crunch" 
                    subtitle="Shipping Costs vs Inflation Lag" 
                    icon={<Ship className="w-4 h-4 text-blue-400" />}
                    onAnalyze={() => openExplainer(EXPLAINER_CONTENT.shipping)}
                    delay="400ms"
                    dataSource={{
                        source: 'Freightos / Baltic Exchange',
                        frequency: 'Weekly',
                        url: 'https://fbx.freightos.com/',
                        lastUpdated: 'Real-time'
                    }}
                >
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={SHIPPING_DATA} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" stroke="var(--holo-muted)" fontSize={10} tickMargin={8} />
                                <YAxis yAxisId="left" stroke="var(--holo-text)" fontSize={10} />
                                <YAxis yAxisId="right" orientation="right" stroke="#f97316" fontSize={10} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line yAxisId="left" type="monotone" dataKey="index" stroke="var(--holo-primary)" dot={false} strokeWidth={2} name="Baltic Dry Index" animationDuration={1500} />
                                <Bar yAxisId="right" dataKey="freight" fill="#f97316" opacity={0.3} name="Freightos Index" barSize={30} animationDuration={1500} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </TechCard>

                {/* 4. Food Security */}
                <TechCard 
                    title="Eating Expenses" 
                    subtitle="Food CPI Share vs Price Index" 
                    icon={<Wheat className="w-4 h-4 text-yellow-500" />}
                    delay="500ms"
                    dataSource={{
                        source: 'FAO United Nations',
                        frequency: 'Monthly',
                        url: 'https://www.fao.org/worldfoodsituation/foodpricesindex/en/',
                        lastUpdated: 'Last Month'
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px]">
                        <div className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={FOOD_SECURITY_DATA} margin={{ left: 30 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="region" type="category" width={70} fontSize={9} stroke="var(--holo-muted)" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="share" fill="#eab308" radius={[0, 4, 4, 0]} name="Food % of CPI" barSize={15} animationDuration={1500} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                 <LineChart data={FOOD_PRICE_INDEX} margin={{ left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="date" fontSize={9} stroke="var(--holo-muted)" tickMargin={5} />
                                    <YAxis domain={['auto', 'auto']} fontSize={9} stroke="var(--holo-muted)" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="value" stroke="#eab308" strokeWidth={2} dot={false} name="Food Price Index" animationDuration={1500} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </TechCard>

                {/* 5. Social Unrest */}
                <TechCard 
                    title="Civil Unrest" 
                    subtitle="Reported Unrest Events Index" 
                    icon={<AlertTriangle className="w-4 h-4 text-orange-500" />}
                    delay="600ms"
                    dataSource={{
                        source: 'ACLED / GDELT',
                        frequency: 'Daily',
                        url: 'https://acleddata.com/',
                        lastUpdated: '24h ago'
                    }}
                >
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={SOCIAL_UNREST_DATA} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="year" stroke="var(--holo-muted)" fontSize={10} tickMargin={8} />
                                <YAxis stroke="var(--holo-muted)" fontSize={10} />
                                <Tooltip content={<CustomTooltip linkContext="Related: Social Uprisings Study" />} />
                                <Line 
                                    type="monotone" 
                                    dataKey="index" 
                                    stroke="#f97316" 
                                    strokeWidth={3} 
                                    dot={{r: 4, strokeWidth: 2, cursor: 'pointer'}} 
                                    activeDot={{r: 6, strokeWidth: 0, fill: 'var(--holo-primary)', onClick: (e: any, payload: any) => handleUnrestClick(payload.payload) }}
                                    name="Unrest Index" 
                                    animationDuration={1500}
                                    onClick={(e: any) => {
                                        // Fallback click handler if user clicks the line
                                        if (e && e.activePayload && e.activePayload.length) {
                                            handleUnrestClick(e.activePayload[0].payload);
                                        }
                                    }}
                                />
                                <ReferenceLine x="2024" stroke="var(--holo-accent)" strokeDasharray="3 3">
                                    <Label value="Global Elections" position="top" fill="var(--holo-accent)" fontSize={10} />
                                </ReferenceLine>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </TechCard>

                {/* 6. World Uncertainty Index */}
                <TechCard 
                    title="Fog of War" 
                    subtitle="World Uncertainty Index" 
                    icon={<Globe className="w-4 h-4 text-purple-400" />}
                    delay="700ms"
                    dataSource={{
                        source: 'Ahir, Bloom, Furceri (WUI)',
                        frequency: 'Quarterly',
                        url: 'https://worlduncertaintyindex.com/',
                        lastUpdated: 'Late 2025'
                    }}
                >
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={UNCERTAINTY_INDEX_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="year" stroke="var(--holo-muted)" fontSize={10} tickMargin={8} />
                                <YAxis stroke="var(--holo-muted)" fontSize={10} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" fill="#8b5cf6" name="Uncertainty Score" radius={[4, 4, 0, 0]} animationDuration={1500}>
                                    {UNCERTAINTY_INDEX_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.year === '2022' || entry.year === '2024' ? '#ef4444' : '#8b5cf6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </TechCard>

                {/* 7. Oil Intensity */}
                <TechCard 
                    title="Energy Transition" 
                    subtitle="Global Oil Intensity (Barrels/$1M GDP)" 
                    icon={<Droplet className="w-4 h-4 text-gray-400" />}
                    delay="800ms"
                    dataSource={{
                        source: 'US EIA / World Bank',
                        frequency: 'Annual',
                        url: 'https://www.eia.gov/',
                        lastUpdated: '2025'
                    }}
                >
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={OIL_INTENSITY_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="year" stroke="var(--holo-muted)" fontSize={10} tickMargin={8} />
                                <YAxis stroke="var(--holo-muted)" fontSize={10} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" fill="var(--holo-primary)" name="Intensity" radius={[4, 4, 0, 0]} barSize={40} animationDuration={1500} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </TechCard>
                
                 {/* 8. Info / Methodology */}
                 <div className="bg-holo-surface/30 rounded-[1.5rem] border border-holo-border p-6 flex flex-col justify-center items-center text-center opacity-0 animate-slide-up" style={{ animationDelay: '900ms' }}>
                    <div className="w-12 h-12 rounded-full bg-holo-surface flex items-center justify-center mb-4 border border-holo-border">
                        <Info className="w-6 h-6 text-holo-muted" />
                    </div>
                    <h4 className="text-holo-text font-bold mb-2">About These Metrics</h4>
                    <p className="text-xs text-holo-muted max-w-xs leading-relaxed">
                        Data projected for 2025-2026 based on IMF World Economic Outlook and current geopolitical trends. 
                        Indices are normalized for comparative analysis.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default GlobalEconomy;
