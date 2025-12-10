import React, { useState, useEffect } from 'react';
import { View, ExplainerData, TickerData } from './types';
import Dashboard from './components/Dashboard';
import RiskIndices from './components/RiskIndices';
import TransmissionMap from './components/TransmissionMap';
import CaseStudies from './components/CaseStudies';
import Simulator from './components/Simulator';
import InteractiveExplainer from './components/InteractiveExplainer';
import NewsFeed from './components/NewsFeed';
import Sidebar from './components/Sidebar';
import GlobalEconomy from './components/GlobalEconomy';
import DataSourceTooltip from './components/DataSourceTooltip';
import { MARKET_TICKERS } from './constants';
import { fetchLiveMarketData } from './services/geminiService';
import { Menu } from 'lucide-react';

const CACHE_KEY = 'outpost_market_data_v1';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [explainerData, setExplainerData] = useState<ExplainerData | null>(null);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Market Data State
  const [tickers, setTickers] = useState<TickerData[]>(MARKET_TICKERS);
  const [dataSources, setDataSources] = useState<string[]>([]);
  const [loadingTickers, setLoadingTickers] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('Initializing...');
  const [isUsingCache, setIsUsingCache] = useState(false);

  useEffect(() => {
    const initMarketData = async () => {
        setLoadingTickers(true);
        
        try {
            const cachedData = localStorage.getItem(CACHE_KEY);
            let shouldUseCache = false;

            if (cachedData) {
                try {
                    const parsed = JSON.parse(cachedData);
                    const cachedTime = new Date(parsed.timestamp);
                    const now = new Date();
                    const currentETDate = now.toLocaleDateString('en-US', { timeZone: 'America/New_York' });
                    const cachedETDate = cachedTime.toLocaleDateString('en-US', { timeZone: 'America/New_York' });

                    // If cached data is from today (ET), use it. 
                    // This ensures we fetch new data only once a day after midnight ET.
                    if (currentETDate === cachedETDate && parsed.data && parsed.data.length > 0) {
                        setTickers(parsed.data);
                        setDataSources(parsed.sources || []);
                        setLastUpdated(cachedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                        setIsUsingCache(true);
                        shouldUseCache = true;
                        setLoadingTickers(false);
                    }
                } catch (e) {
                    console.warn("Cache parse error", e);
                }
            }

            if (!shouldUseCache) {
                try {
                    const { data, sources } = await fetchLiveMarketData(MARKET_TICKERS);
                    
                    // Heuristic: fetchLiveMarketData returns { data: currentTickers, sources: [] } on error.
                    // If sources are empty, we likely hit an error or fallback. We shouldn't cache fallback data 
                    // to prevent it from persisting for 24 hours.
                    const isValidFetch = sources && sources.length > 0;

                    setTickers(data);
                    setDataSources(sources);
                    setLastUpdated('Live Now');
                    setIsUsingCache(false);

                    if (isValidFetch) {
                        try {
                            localStorage.setItem(CACHE_KEY, JSON.stringify({
                                timestamp: Date.now(),
                                data: data,
                                sources: sources
                            }));
                        } catch (e) {
                            console.warn("LocalStorage write error", e);
                        }
                    }
                } catch (e) {
                    console.error("Fetch market data failed", e);
                }
                setLoadingTickers(false);
            }
        } catch (error) {
            console.error("Market Data Init Failed:", error);
            setTickers(MARKET_TICKERS);
            setLoadingTickers(false);
        }
    };

    initMarketData();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const openExplainer = (data: ExplainerData) => {
    setExplainerData({
        ...data,
        promptSuggestions: [
            "What are the historical precedents?",
            "How does this affect emerging markets?",
            "Summarize the key risks in 3 bullets."
        ]
    });
    setIsExplainerOpen(true);
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard openExplainer={openExplainer} />;
      case View.NEWS: return <NewsFeed openExplainer={openExplainer} />;
      case View.GLOBAL_ECONOMY: return <GlobalEconomy openExplainer={openExplainer} />;
      case View.INDICES: return <RiskIndices openExplainer={openExplainer} />;
      case View.TRANSMISSION: return <TransmissionMap openExplainer={openExplainer} />;
      case View.CASE_STUDIES: return <CaseStudies openExplainer={openExplainer} />;
      case View.SIMULATOR: return <Simulator />;
      default: return <Dashboard openExplainer={openExplainer} />;
    }
  };

  return (
    <div className="min-h-screen bg-holo-bg text-holo-text font-sans flex overflow-hidden selection:bg-holo-primary selection:text-black">
      <InteractiveExplainer 
        isOpen={isExplainerOpen} 
        onClose={() => setIsExplainerOpen(false)} 
        data={explainerData}
      />

      <div className={`fixed md:relative z-40 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <Sidebar 
            currentView={currentView} 
            onViewChange={(v) => {
                setCurrentView(v);
                setIsMobileMenuOpen(false);
            }} 
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
        />
      </div>
      
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative transition-colors duration-300">
        
        <div className="md:hidden h-16 bg-holo-bg border-b border-holo-border flex items-center justify-between px-4 flex-shrink-0 transition-colors duration-300">
            <span className="font-bold text-xl text-holo-text font-serif tracking-widest">OUTPOST</span>
            <button 
                className="text-holo-muted p-2 hover:bg-holo-surface rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <Menu className="w-6 h-6" />
            </button>
        </div>

        <div className="w-full z-20 flex-shrink-0 relative pt-4 px-6 md:px-10">
            <div className="w-full bg-holo-card border border-holo-border rounded-2xl overflow-hidden py-2.5 flex items-center shadow-lg relative transition-colors duration-300">
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-holo-card to-transparent z-10 transition-colors duration-300 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-holo-card to-transparent z-10 transition-colors duration-300 pointer-events-none"></div>
                
                {loadingTickers ? (
                    <div className="flex animate-shimmer w-full px-4 gap-8">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className="flex items-center gap-2 opacity-50">
                                <div className="h-3 w-12 bg-holo-surface rounded"></div>
                                <div className="h-3 w-16 bg-holo-surface rounded"></div>
                                <div className="h-3 w-8 bg-holo-surface rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex animate-scroll whitespace-nowrap px-4">
                        {tickers.concat(tickers).concat(tickers).map((ticker, idx) => (
                            <div key={idx} className="flex items-center mr-10 text-xs font-mono">
                                <span className="text-holo-muted font-bold mr-2">{ticker.symbol}</span>
                                <span className="text-holo-text mr-2">{ticker.price}</span>
                                <span className={`px-1.5 py-0.5 rounded ${ticker.trend === 'up' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}`}>
                                    {ticker.change}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {!loadingTickers && (
                <div className="absolute top-6 right-14 z-20">
                     <DataSourceTooltip config={{
                         source: isUsingCache ? 'Cached Market Data' : 'Live API Feed',
                         frequency: 'Daily (12:00 AM ET)',
                         lastUpdated: lastUpdated
                     }} />
                </div>
            )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth custom-scrollbar">
            <div className="max-w-7xl mx-auto pb-10">
                <div className="animate-fade-in">
                    {renderView()}
                </div>

                <footer className="mt-12 pt-6 border-t border-holo-border text-center">
                    <p className="text-[10px] text-holo-muted uppercase tracking-widest font-medium">
                        Outpost Economic Intelligence & Strategy &copy; 2025
                    </p>
                </footer>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
