import React from 'react';
import { ExplainerData } from '../types';
import { Calendar, TrendingDown, TrendingUp, BookOpen, Activity } from 'lucide-react';

interface CaseStudiesProps {
    openExplainer: (data: ExplainerData) => void;
}

const studies = [
    {
        id: 1,
        event: 'COVID-19 Recession',
        date: 'Feb 2020',
        impact: 'Critical',
        desc: 'Global lockdowns triggered simultaneous supply and demand shocks, leading to the fastest market contraction in history.',
        stats: { gdp: '-3.4%', inflation: '+4.7%' }
    },
    {
        id: 2,
        event: 'Global Financial Crisis',
        date: 'Sep 2008',
        impact: 'Critical',
        desc: 'Collapse of the US subprime mortgage market causing systemic banking failure and a severe global credit crunch.',
        stats: { gdp: '-4.3%', inflation: '-0.4%' }
    },
    {
        id: 3,
        event: 'Dot-com Bubble Burst',
        date: 'Mar 2000',
        impact: 'High',
        desc: 'Speculative bubble in technology stocks collapsed, erasing $5 trillion in market value.',
        stats: { gdp: '+1.0%', inflation: '+3.4%' }
    },
    {
        id: 4,
        event: 'Asian Financial Crisis',
        date: 'July 1997',
        impact: 'High',
        desc: 'Currency devaluations spread through East Asian tiger economies, triggered by the collapse of the Thai Baht.',
        stats: { gdp: '-1.8%', inflation: '+8.0%' }
    },
    {
        id: 5,
        event: 'Black Monday',
        date: 'Oct 1987',
        impact: 'Medium',
        desc: 'The largest one-day percentage decline in stock market history (-22.6% for Dow), driven by program trading.',
        stats: { gdp: '+3.5%', inflation: '+4.0%' }
    },
    {
        id: 6,
        event: 'The Volcker Shock',
        date: 'Oct 1979',
        impact: 'High',
        desc: 'Federal Reserve raised rates to 20% to crush stagflation, intentionally inducing a recession to restore price stability.',
        stats: { gdp: '-0.3%', inflation: '-6.5%' }
    },
    {
        id: 7,
        event: 'OPEC Oil Embargo',
        date: 'Oct 1973',
        impact: 'Critical',
        desc: 'Oil prices quadrupled following the Yom Kippur War, causing the first major global stagflationary episode.',
        stats: { gdp: '-0.5%', inflation: '+11.3%' }
    },
    {
        id: 8,
        event: 'Nixon Shock',
        date: 'Aug 1971',
        impact: 'High',
        desc: 'Unilateral cancellation of direct international convertibility of the US Dollar to gold, ending the Bretton Woods system.',
        stats: { gdp: '+2.7%', inflation: '+3.2%' }
    },
    {
        id: 9,
        event: 'The Great Depression',
        date: 'Oct 1929',
        impact: 'Critical',
        desc: 'Stock market crash leading to a decade-long period of deflation, banking panics, and 25% unemployment.',
        stats: { gdp: '-26.7%', inflation: '-10.3%' }
    },
    {
        id: 10,
        event: 'Weimar Hyperinflation',
        date: 'Jan 1923',
        impact: 'Critical',
        desc: 'Excessive money printing to pay war reparations led to currency collapse. Prices doubled every 3.7 days.',
        stats: { gdp: '-15%', inflation: '+29k%' }
    },
    {
        id: 11,
        event: 'Panic of 1907',
        date: 'Oct 1907',
        impact: 'High',
        desc: 'Liquidity crisis in NYC banks that spread to trust companies; directly led to the creation of the Federal Reserve.',
        stats: { gdp: '-11%', inflation: '+1.5%' }
    },
    {
        id: 12,
        event: 'Long Depression',
        date: 'Oct 1873',
        impact: 'Medium',
        desc: 'Triggered by the demonetization of silver and railroad speculation collapse. The longest contraction in US history.',
        stats: { gdp: '-2.1%', inflation: '-3.0%' }
    },
    {
        id: 13,
        event: 'Panic of 1837',
        date: 'May 1837',
        impact: 'High',
        desc: 'Speculative lending bubble burst in the US followed by a 5-year depression and banking system failure.',
        stats: { gdp: '-5.0%', inflation: '-4.8%' }
    }
];

const CaseStudies: React.FC<CaseStudiesProps> = ({ openExplainer }) => {
    
    const getStatColor = (value: string, type: 'gdp' | 'inflation') => {
        const num = parseFloat(value.replace(/[^0-9.-]/g, ''));
        if (type === 'gdp') {
            return num < 0 ? 'text-red-400' : 'text-emerald-400';
        }
        // Inflation: High positive is bad (amber/red), Negative (deflation) is also bad usually (cyan/blue)
        if (num > 5) return 'text-red-400';
        if (num < 0) return 'text-cyan-400';
        return 'text-amber-400';
    };

    return (
        <div className="space-y-6">
            <div className="bg-holo-card border border-holo-border rounded-[2rem] p-8 mb-8 flex items-center justify-between transition-colors duration-300">
                <div>
                    <h2 className="text-xl font-bold text-holo-text mb-2">Historical Economic Archive</h2>
                    <p className="text-holo-muted text-sm">Comprehensive analysis of major liquidity crises, supply shocks, and depressions.</p>
                </div>
                <div className="hidden md:flex items-center gap-4 text-xs text-holo-muted">
                    <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>Contraction</div>
                    <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></span>Deflation</div>
                    <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-400 mr-2"></span>Inflation</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studies.map((study) => (
                    <div key={study.id} className="bg-holo-card border border-holo-border rounded-[2rem] overflow-hidden hover:border-holo-text/20 transition-colors flex flex-col group p-2">
                        <div className="p-6 flex-1 flex flex-col bg-holo-surface/50 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-black/10 dark:bg-black/30 p-2 rounded-xl text-holo-primary group-hover:text-holo-text transition-colors border border-holo-border">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border ${
                                    study.impact === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                    study.impact === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                }`}>
                                    {study.impact}
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-bold text-holo-text mb-1 group-hover:text-holo-primary transition-colors">{study.event}</h3>
                            <div className="flex items-center text-holo-muted text-xs mb-4 font-mono">
                                <Calendar className="w-3 h-3 mr-1.5" />
                                {study.date}
                            </div>
                            
                            <p className="text-holo-muted text-sm mb-6 leading-relaxed flex-1 font-light">{study.desc}</p>
                            
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-black/10 dark:bg-black/30 rounded-xl p-3 text-center border border-holo-border">
                                    <span className="block text-[10px] text-holo-muted uppercase tracking-wider mb-1 font-bold">GDP</span>
                                    <span className={`block text-sm font-mono font-bold ${getStatColor(study.stats.gdp, 'gdp')}`}>
                                        {study.stats.gdp}
                                    </span>
                                </div>
                                <div className="bg-black/10 dark:bg-black/30 rounded-xl p-3 text-center border border-holo-border">
                                    <span className="block text-[10px] text-holo-muted uppercase tracking-wider mb-1 font-bold">CPI</span>
                                    <span className={`block text-sm font-mono font-bold ${getStatColor(study.stats.inflation, 'inflation')}`}>
                                        {study.stats.inflation}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-2 mt-1">
                            <button 
                                onClick={() => openExplainer({
                                    title: `Case Study: ${study.event}`,
                                    context: `Provide a detailed economic post-mortem of the ${study.event} (${study.date}). \n\nFocus on:\n1. The structural triggers.\n2. The policy response (monetary/fiscal).\n3. Long-term structural changes to the global economy that resulted from this event.`
                                })}
                                className="w-full flex items-center justify-center text-xs font-bold text-holo-muted hover:text-holo-text py-3 rounded-xl hover:bg-holo-surface transition-colors"
                            >
                                <Activity className="w-3 h-3 mr-2" />
                                Analyze Impact
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CaseStudies;