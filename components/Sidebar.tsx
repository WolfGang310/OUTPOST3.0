
import React from 'react';
import { View } from '../types';
import { 
    LayoutDashboard, 
    LineChart, 
    Network, 
    History, 
    Cpu, 
    Settings,
    Sparkles,
    Sun,
    Moon,
    Newspaper,
    TrendingUp
} from 'lucide-react';

interface SidebarProps {
    currentView: View;
    onViewChange: (view: View) => void;
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isDarkMode, toggleTheme }) => {
    
    const navItems = [
        { id: View.DASHBOARD, label: 'Overview', icon: LayoutDashboard },
        { id: View.NEWS, label: 'News Feed', icon: Newspaper },
        { id: View.GLOBAL_ECONOMY, label: 'Global Economy', icon: TrendingUp },
        { id: View.INDICES, label: 'Risk Indices', icon: LineChart },
        { id: View.TRANSMISSION, label: 'Transmission', icon: Network },
        { id: View.CASE_STUDIES, label: 'Case Studies', icon: History },
        { id: View.SIMULATOR, label: 'Simulation', icon: Cpu },
    ];

    return (
        <aside className="flex flex-col w-72 h-screen z-30 p-4 transition-colors duration-300 glass-panel border-r-0">
            {/* Branding Logo Area */}
            <div className="flex flex-col items-center px-2 py-8 mb-4">
                <div className="relative mb-2">
                    <h1 className="font-serif text-4xl text-holo-text tracking-[0.2em] font-bold leading-none pl-1">OUTPOST</h1>
                </div>
                <div className="w-full flex justify-center border-t border-holo-border/40 pt-2 mt-1">
                    <p className="text-holo-muted text-[9px] uppercase tracking-[0.25em] font-medium text-center">
                        Economic Intelligence & Strategy
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-2 overflow-y-auto custom-scrollbar">
                <div className="px-4 mb-3 text-[10px] font-bold text-holo-muted uppercase tracking-wider font-mono opacity-70">Main Menu</div>
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                                isActive 
                                    ? 'bg-holo-primary/10 text-holo-primary border border-holo-primary/20 shadow-neon' 
                                    : 'text-holo-muted hover:text-holo-text hover:bg-white/5 border border-transparent'
                            }`}
                        >
                            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-holo-primary shadow-[0_0_10px_var(--holo-primary)]"></div>}
                            <item.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-holo-primary' : 'text-holo-muted group-hover:text-holo-text'}`} />
                            <span className={`text-sm font-medium ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto space-y-4 pt-4 border-t border-white/5">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-holo-surface/80 to-black/80 border border-holo-border relative overflow-hidden group cursor-pointer hover:border-holo-primary/30 transition-all">
                    <div className="absolute -top-6 -right-6 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles className="w-24 h-24 rotate-12 text-holo-text" />
                    </div>
                    <div className="relative z-10">
                         <div className="w-8 h-8 rounded-full bg-holo-primary/20 border border-holo-primary/30 flex items-center justify-center mb-3 text-holo-primary">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-holo-text mb-1 text-sm">AI Assistant</h4>
                        <p className="text-[10px] text-holo-muted mb-3 font-mono">Ask about correlation and risk hedging.</p>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-holo-primary group-hover:gap-2 transition-all">
                            TRY INSIGHTS <span className="text-lg leading-none">→</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleTheme}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-holo-surface/50 border border-holo-border text-holo-muted hover:text-holo-text hover:bg-holo-border transition-colors"
                    >
                        {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </button>

                    {/* Settings */}
                    <div className="flex-1 flex items-center gap-3 px-3 py-2 rounded-xl bg-holo-surface/50 border border-holo-border hover:bg-holo-border cursor-pointer text-holo-muted transition-colors group">
                        <div className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center group-hover:bg-holo-primary/20 transition-colors">
                            <Settings className="w-3 h-3 group-hover:text-holo-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-holo-text">Settings</p>
                            <p className="text-[9px] font-mono">v2.5 Flash</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
