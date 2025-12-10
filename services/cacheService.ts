
import { GlobalRiskMetrics, NewsItem, ShockScenarioData } from '../types';

const METRICS_CACHE_KEY = 'outpost_dashboard_metrics_v1';
const NEWS_CACHE_KEY = 'outpost_news_feed_v1';
const WHITEBOARD_CACHE_KEY = 'outpost_whiteboard_v1';
const SCENARIO_CACHE_KEY = 'outpost_scenario_analysis_v1';

export interface CachedScenarioData extends Partial<ShockScenarioData> {
    nodeImpacts?: Record<string, any>;
}

// Helper: Check if a timestamp is from the same calendar day (ET) as now
const isSameDayInET = (timestamp: number): boolean => {
    try {
        const cacheTime = new Date(timestamp);
        const now = new Date();
        
        // Get current time in ET
        const etNowStr = now.toLocaleString("en-US", { timeZone: "America/New_York" });
        const etNow = new Date(etNowStr);
        
        // Get cache time in ET
        const etCacheStr = cacheTime.toLocaleString("en-US", { timeZone: "America/New_York" });
        const etCache = new Date(etCacheStr);

        return etNow.toLocaleDateString() === etCache.toLocaleDateString();
    } catch (e) {
        console.warn("Error checking cache date:", e);
        return false;
    }
};

// --- Metrics Caching ---

export const getCachedMetrics = (): GlobalRiskMetrics | null => {
    try {
        const cached = localStorage.getItem(METRICS_CACHE_KEY);
        if (!cached) return null;

        const parsed = JSON.parse(cached);
        if (!parsed.timestamp || !parsed.data) return null;

        if (isSameDayInET(parsed.timestamp)) {
            return parsed.data;
        }
        return null;
    } catch (e) {
        console.warn("Error parsing cached metrics:", e);
        return null;
    }
};

export const cacheMetrics = (data: GlobalRiskMetrics) => {
    try {
        localStorage.setItem(METRICS_CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data
        }));
    } catch (e) {
        console.warn("Failed to cache metrics:", e);
    }
};

export const getCacheStatus = () => {
    const cached = localStorage.getItem(METRICS_CACHE_KEY);
    if (!cached) return { isCached: false, lastUpdated: null, nextRefresh: null };

    try {
        const parsed = JSON.parse(cached);
        const date = new Date(parsed.timestamp);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const refreshInfo = getTimeUntilRefresh();

        return {
            isCached: true,
            lastUpdated: timeStr,
            nextRefresh: refreshInfo
        };
    } catch (e) {
        return { isCached: false, lastUpdated: null, nextRefresh: null };
    }
};

// --- News Caching ---

export const getCachedNews = (): NewsItem[] | null => {
    try {
        const cached = localStorage.getItem(NEWS_CACHE_KEY);
        if (!cached) return null;

        const parsed = JSON.parse(cached);
        if (!parsed.timestamp || !parsed.data) return null;

        if (isSameDayInET(parsed.timestamp)) {
            return parsed.data;
        }
        return null;
    } catch (e) {
        console.warn("Error parsing cached news:", e);
        return null;
    }
};

export const cacheNews = (data: NewsItem[]) => {
    try {
        localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data
        }));
    } catch (e) {
        console.warn("Failed to cache news:", e);
    }
};

export const getNewsCacheStatus = () => {
    const cached = localStorage.getItem(NEWS_CACHE_KEY);
    if (!cached) return { isCached: false, lastUpdated: null, itemCount: 0, nextRefresh: null };

    try {
        const parsed = JSON.parse(cached);
        const date = new Date(parsed.timestamp);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const refreshInfo = getTimeUntilRefresh();

        return {
            isCached: true,
            lastUpdated: timeStr,
            itemCount: Array.isArray(parsed.data) ? parsed.data.length : 0,
            nextRefresh: refreshInfo
        };
    } catch (e) {
         return { isCached: false, lastUpdated: null, itemCount: 0, nextRefresh: null };
    }
};

// --- Whiteboard Caching ---

export const getCachedWhiteboard = (): string | null => {
    try {
        const cached = localStorage.getItem(WHITEBOARD_CACHE_KEY);
        if (!cached) return null;

        const parsed = JSON.parse(cached);
        if (!parsed.timestamp || !parsed.data) return null;

        if (isSameDayInET(parsed.timestamp)) {
            return parsed.data;
        }
        return null;
    } catch (e) {
        console.warn("Error parsing cached whiteboard:", e);
        return null;
    }
}

export const cacheWhiteboard = (data: string) => {
    try {
        localStorage.setItem(WHITEBOARD_CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data
        }));
    } catch (e) {
        console.warn("Failed to cache whiteboard:", e);
    }
}

// --- Scenario Caching ---

const getScenarioStore = (): Record<string, { timestamp: number; data: CachedScenarioData }> => {
    try {
        const cached = localStorage.getItem(SCENARIO_CACHE_KEY);
        if (!cached) return {};
        return JSON.parse(cached);
    } catch {
        return {};
    }
};

export const getCachedScenario = (id: string): CachedScenarioData | null => {
    const store = getScenarioStore();
    const item = store[id];
    if (!item) return null;
    
    // Check expiration (daily)
    if (isSameDayInET(item.timestamp)) {
        return item.data;
    }
    return null;
};

export const cacheScenario = (id: string, data: CachedScenarioData) => {
    try {
        const store = getScenarioStore();
        store[id] = {
            timestamp: Date.now(),
            data
        };
        localStorage.setItem(SCENARIO_CACHE_KEY, JSON.stringify(store));
    } catch (e) {
        console.warn("Failed to cache scenario:", e);
    }
};

export const getScenarioCacheStatus = (id: string) => {
    const store = getScenarioStore();
    const item = store[id];
    
    if (!item) return { isCached: false, lastUpdated: null, nextRefresh: null };
    
    // Check if it's from today
    if (!isSameDayInET(item.timestamp)) {
        return { isCached: false, lastUpdated: null, nextRefresh: null };
    }

    const date = new Date(item.timestamp);
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const refreshInfo = getTimeUntilRefresh();

    return {
        isCached: true,
        lastUpdated: timeStr,
        nextRefresh: refreshInfo
    };
};

export const getAllCachedScenarios = () => {
    return getScenarioStore();
};

export const clearAllScenarioCaches = () => {
    localStorage.removeItem(SCENARIO_CACHE_KEY);
};


// --- Utils ---

export const formatLastUpdated = (dateString?: string) => {
    if (!dateString) return '';
    return dateString;
};

export const getTimeUntilRefresh = () => {
    try {
        const now = new Date();
        const etNowStr = now.toLocaleString("en-US", { timeZone: "America/New_York" });
        const etNow = new Date(etNowStr);
        
        // Calculate next 12:00 AM ET
        const nextRefresh = new Date(etNow);
        nextRefresh.setHours(24, 0, 0, 0); 
        
        // If it's already past midnight but we want the *next* midnight, 
        // setHours usually handles it for the current day. 
        // If nextRefresh is in the past (unlikely with this logic), add a day.
        if (nextRefresh <= etNow) {
            nextRefresh.setDate(nextRefresh.getDate() + 1);
        }
        
        const diffMs = nextRefresh.getTime() - etNow.getTime();
        if (isNaN(diffMs)) return { hours: 0, minutes: 0 };
        
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        return { hours, minutes };
    } catch (e) {
        return { hours: 0, minutes: 0 };
    }
};
