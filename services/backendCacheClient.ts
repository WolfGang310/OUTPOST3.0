export interface DailySearchCacheResponse<T = any> {
    fetchedAt: number | null;
    nextRefreshMs: number;
    nextRefreshMinutes: number;
    data: T | null;
}

const DEFAULT_URL = 'http://localhost:8788/api/search-cache';

/**
 * Fetch cached Google Search-backed data from the backend cache server.
 * Falls back silently if the backend is unreachable.
 */
export async function fetchBackendCache<T = any>(urlOverride?: string): Promise<DailySearchCacheResponse<T> | null> {
    const endpoint =
        urlOverride ||
        // Vite exposes custom env vars on import.meta.env
        (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BACKEND_CACHE_URL) ||
        process.env.BACKEND_CACHE_URL ||
        DEFAULT_URL;

    try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Bad status ${res.status}`);
        return (await res.json()) as DailySearchCacheResponse<T>;
    } catch (err) {
        console.warn('[backend-cache] Unable to reach cache endpoint:', (err as Error)?.message || err);
        return null;
    }
}
