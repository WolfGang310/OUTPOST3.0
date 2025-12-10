import React, { useState, useEffect, useCallback } from 'react';
import { fetchNews, generateDailyBriefImage } from '../services/geminiService';
import { NewsItem, ExplainerData } from '../types';
import {
  getCachedNews,
  cacheNews,
  getNewsCacheStatus,
  getCachedWhiteboard,
  cacheWhiteboard,
  getTimeUntilRefresh
} from '../services/cacheService';
import { Newspaper, ExternalLink, RefreshCw, Zap, AlertTriangle, PenTool, Image as ImageIcon, Loader2, Clock, CheckCircle } from 'lucide-react';
import TechCard from './TechCard';

interface NewsFeedProps {
    openExplainer: (data: ExplainerData) => void;
}

const NewsSkeleton = () => (
    <div className="bg-holo-card border border-holo-border rounded-[2rem] p-6 h-64 animate-shimmer flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
            <div className="h-4 w-20 bg-holo-surface rounded-full"></div>
            <div className="h-5 w-24 bg-holo-surface rounded"></div>
        </div>
        <div className="space-y-2 mb-6">
            <div className="h-5 w-full bg-holo-surface rounded"></div>
            <div className="h-5 w-2/3 bg-holo-surface rounded"></div>
        </div>
        <div className="space-y-2 flex-1">
             <div className="h-3 w-full bg-holo-surface rounded opacity-70"></div>
             <div className="h-3 w-full bg-holo-surface rounded opacity-70"></div>
             <div className="h-3 w-1/2 bg-holo-surface rounded opacity-70"></div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-holo-border/30">
            <div className="h-3 w-12 bg-holo-surface rounded"></div>
            <div className="flex gap-2">
                <div className="h-8 w-8 bg-holo-surface rounded-lg"></div>
                <div className="h-8 w-8 bg-holo-surface rounded-lg"></div>
            </div>
        </div>
    </div>
);

const NewsFeed: React.FC<NewsFeedProps> = ({ openExplainer }) => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isManualRefreshing, setIsManualRefreshing] = useState(false);
    const [cacheInfo, setCacheInfo] = useState<{
        fromCache: boolean;
        lastUpdated: string | null;
        itemCount: number;
        nextRefresh: { hours: number; minutes: number } | null;
    }>({ fromCache: false, lastUpdated: null, itemCount: 0, nextRefresh: null });
    
    // Whiteboard State
    const [whiteboardImage, setWhiteboardImage] = useState<string | null>(null);
    const [isGeneratingBoard, setIsGeneratingBoard] = useState(false);
    const [hasApiKey, setHasApiKey] = useState(false);

    /**
     * Load news with cache-first strategy
     * Only fetches fresh data if cache is stale (from previous day in ET)
     */
    const loadNews = useCallback(async (forceRefresh = false) => {
        setLoading(true);
        
        // 1. Try cache first (unless force refresh)
        if (!forceRefresh) {
            const cachedData = getCachedNews();
            if (cachedData && cachedData.length > 0) {
                setNews(cachedData);
                const status = getNewsCacheStatus();
                setCacheInfo({
                    fromCache: true,
                    lastUpdated: status.lastUpdated,
                    itemCount: status.itemCount,
                    nextRefresh: status.nextRefresh,
                });
                setLoading(false);
                console.debug('[NewsFeed] Loaded news from cache:', cachedData.length, 'items');
                return;
            }
        }
        
        // 2. Fetch fresh data
        console.debug('[NewsFeed] Fetching fresh news data...');
        try {
            const data = await fetchNews();
            if (data && data.length > 0) {
                setNews(data);
                cacheNews(data);
                const status = getNewsCacheStatus();
                setCacheInfo({
                    fromCache: false,
                    lastUpdated: status.lastUpdated,
                    itemCount: data.length,
                    nextRefresh: status.nextRefresh,
                });
                console.debug('[NewsFeed] Fresh news fetched and cached:', data.length, 'items');
            }
        } catch (error) {
            console.error('[NewsFeed] Failed to fetch news:', error);
            // Try to use stale cache as fallback
            const staleCache = getCachedNews();
            if (staleCache && staleCache.length > 0) {
                setNews(staleCache);
                setCacheInfo({
                    fromCache: true,
                    lastUpdated: 'Using cached data (fetch failed)',
                    itemCount: staleCache.length,
                    nextRefresh: null,
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
        await loadNews(true);
        setIsManualRefreshing(false);
    };

    useEffect(() => {
        const checkKey = async () => {
             if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
                 const hasKey = await (window as any).aistudio.hasSelectedApiKey();
                 setHasApiKey(hasKey);
             } else {
                 setHasApiKey(true); 
             }
        };
        checkKey();
        
        // Load news with cache-first approach
        loadNews();
        
        // Load cached whiteboard image if available
        const cachedWhiteboard = getCachedWhiteboard();
        if (cachedWhiteboard) {
            setWhiteboardImage(cachedWhiteboard);
            console.debug('[NewsFeed] Loaded whiteboard from cache');
        }
        
        // Set up hourly check for date rollover (if left open overnight)
        const checkForNewDay = () => {
            const status = getNewsCacheStatus();
            if (!status.isCached) {
                console.debug('[NewsFeed] Cache expired, refreshing news...');
                loadNews();
            }
        };
        
        const intervalId = setInterval(checkForNewDay, 60 * 60 * 1000);
        
        return () => clearInterval(intervalId);
    }, [loadNews]);

    // Update next refresh countdown every minute
    useEffect(() => {
        const updateCountdown = () => {
            const nextRefresh = getTimeUntilRefresh();
            setCacheInfo(prev => ({ ...prev, nextRefresh }));
        };
        
        const intervalId = setInterval(updateCountdown, 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    const handleGenerateBrief = async () => {
        if (!hasApiKey && (window as any).aistudio?.openSelectKey) {
            await (window as any).aistudio.openSelectKey();
            setHasApiKey(true);
            return;
        }

        setIsGeneratingBoard(true);
        const imageUrl = await generateDailyBriefImage();
        if (imageUrl) {
            setWhiteboardImage(imageUrl);
            cacheWhiteboard(imageUrl); // Cache the generated whiteboard
        }
        setIsGeneratingBoard(false);
    };

    // Format cache status for display
    const getCacheStatusDisplay = () => {
        if (loading) return null;
        
        if (cacheInfo.fromCache && cacheInfo.lastUpdated) {
            return (
                <div className="flex items-center gap-2 text-xs text-holo-muted">
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
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="bg-holo-card border border-holo-border rounded-[2rem] p-8 transition-colors duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-holo-text mb-2 flex items-center gap-2">
                            <Newspaper className="w-5 h-5 text-holo-primary" />
                            Live Geopolitical Wire
                            {cacheInfo.fromCache && !loading && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-holo-surface/50 rounded text-[10px] border border-holo-border text-holo-muted font-mono">
                                    <Clock className="w-2.5 h-2.5" />
                                    CACHED
                                </span>
                            )}
                        </h2>
                        <p className="text-holo-muted text-sm">Real-time intelligence feed sourced from verified global outlets.</p>
                        {getCacheStatusDisplay()}
                    </div>
                    <div className="flex items-center gap-3">
                        {cacheInfo.itemCount > 0 && !loading && (
                            <span className="text-xs text-holo-muted font-mono bg-holo-surface/50 px-2 py-1 rounded border border-holo-border">
                                {cacheInfo.itemCount} articles
                            </span>
                        )}
                        <button 
                            onClick={handleManualRefresh}
                            disabled={loading || isManualRefreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-holo-surface hover:bg-holo-border border border-holo-border rounded-xl text-xs font-bold text-holo-text transition-all disabled:opacity-50"
                            title={cacheInfo.fromCache ? "Force refresh (ignores cache)" : "Refresh news"}
                        >
                            <RefreshCw className={`w-4 h-4 ${(loading || isManualRefreshing) ? 'animate-spin' : ''}`} />
                            {isManualRefreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Daily Brief Whiteboard Section */}
            <TechCard className="p-8 relative overflow-hidden group">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-holo-surface rounded-lg text-holo-primary border border-holo-border">
                                <PenTool className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-holo-text">Daily Brief Whiteboard</h3>
                            {whiteboardImage && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 rounded text-[10px] border border-green-500/20 text-green-500 font-mono">
                                    <CheckCircle className="w-2.5 h-2.5" />
                                    GENERATED
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-holo-muted leading-relaxed">
                            Generate a hand-drawn visual summary of today's key events, market vibes, and positive boosters. 
                            Powered by Gemini Nano Banana Pro (Image Model).
                        </p>
                        
                        <button
                            onClick={handleGenerateBrief}
                            disabled={isGeneratingBoard}
                            className="mt-4 px-6 py-3 bg-white text-black font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        >
                            {isGeneratingBoard ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <ImageIcon className="w-4 h-4" />
                            )}
                            {whiteboardImage 
                                ? 'Regenerate Brief' 
                                : hasApiKey 
                                    ? 'Generate Visual Brief' 
                                    : 'Unlock & Generate'
                            }
                        </button>
                    </div>

                    {/* Image Display Area */}
                    <div className="w-full md:w-1/2 aspect-video bg-white rounded-xl border-4 border-gray-200 shadow-inner relative overflow-hidden flex items-center justify-center">
                        {whiteboardImage ? (
                            <img 
                                src={whiteboardImage} 
                                alt="Daily Brief Whiteboard" 
                                className="w-full h-full object-cover animate-fade-in"
                            />
                        ) : (
                            <div className="text-center p-6">
                                {isGeneratingBoard ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                        <p className="text-xs text-gray-400 font-handwriting">Sketching today's brief...</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 opacity-30">
                                        <PenTool className="w-10 h-10 text-gray-400" />
                                        <p className="text-xs text-gray-500 font-bold uppercase">Waiting to Draw</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Decorative Markers */}
                        <div className="absolute bottom-2 right-2 flex gap-1 pointer-events-none">
                            <div className="w-2 h-8 bg-red-500 rounded-sm rotate-12 shadow-sm"></div>
                            <div className="w-2 h-8 bg-blue-500 rounded-sm -rotate-6 shadow-sm"></div>
                            <div className="w-2 h-8 bg-black rounded-sm rotate-3 shadow-sm"></div>
                        </div>
                    </div>
                </div>
            </TechCard>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    // Staggered skeletons for organic loading feel
                    [1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} style={{ animationDelay: `${i * 100}ms` }}>
                            <NewsSkeleton />
                        </div>
                    ))
                ) : (
                    news.map((item, idx) => (
                        <TechCard key={idx} className="p-6 flex flex-col group relative" delay={`${idx * 100}ms`} noBrackets>
                             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-holo-primary/5 to-transparent rounded-bl-full pointer-events-none group-hover:from-holo-primary/10 transition-colors"></div>

                             <div className="flex justify-between items-start mb-4 relative z-10">
                                 <span className="text-[10px] font-bold uppercase tracking-wider text-holo-muted bg-holo-surface px-2 py-1 rounded border border-holo-border">
                                     {item.source}
                                 </span>
                                 <span className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 ${
                                     item.impactLevel === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                                     item.impactLevel === 'Medium' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
                                 }`}>
                                     {item.impactLevel === 'High' && <AlertTriangle className="w-3 h-3" />}
                                     {item.impactLevel} Impact
                                 </span>
                             </div>

                             <h3 
                                className="text-lg font-bold text-holo-text mb-3 leading-tight group-hover:text-holo-primary transition-colors line-clamp-2 animate-highlight-text"
                                style={{ animationDelay: `${idx * 150}ms` }}
                             >
                                 {item.headline}
                             </h3>

                             <p className="text-sm text-holo-muted mb-6 flex-1 line-clamp-3">
                                 {item.snippet}
                             </p>

                             <div className="flex items-center justify-between mt-auto pt-4 border-t border-holo-border">
                                 <span className="text-xs text-holo-muted font-mono">{item.time}</span>
                                 <div className="flex gap-2">
                                     <button 
                                        onClick={() => openExplainer({
                                            title: `Analysis: ${item.headline}`,
                                            context: `Analyze the geopolitical implications of this news: "${item.headline}". Discuss potential market reactions for Oil, Gold, and Equities.`
                                        })}
                                        className="p-2 bg-holo-surface hover:bg-holo-primary hover:text-black rounded-lg text-holo-muted transition-colors"
                                        title="Analyze with AI"
                                     >
                                         <Zap className="w-4 h-4" />
                                     </button>
                                     <a 
                                        href={item.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-2 bg-holo-surface hover:bg-holo-text hover:text-holo-card rounded-lg text-holo-muted transition-colors"
                                        title="Read Source"
                                     >
                                         <ExternalLink className="w-4 h-4" />
                                     </a>
                                 </div>
                             </div>
                        </TechCard>
                    ))
                )}
            </div>
        </div>
    );
};

export default NewsFeed;