import React, { forwardRef } from 'react';
import DataSourceTooltip, { DataSourceConfig } from './DataSourceTooltip';

interface TechCardProps {
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
    onMouseEnter?: () => void;
    glow?: boolean;
    delay?: string;
    noBrackets?: boolean;
    
    // Header props
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    onAnalyze?: () => void;
    dataSource?: DataSourceConfig;
}

const TechCard = forwardRef<HTMLDivElement, TechCardProps>(({ 
    children, 
    className = "", 
    onClick, 
    onMouseEnter, 
    glow = false, 
    delay = '0ms', 
    noBrackets = false,
    title,
    subtitle,
    icon,
    onAnalyze,
    dataSource
}, ref) => {
    return (
        <div 
            ref={ref}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            style={{ animationDelay: delay }}
            className={`bg-holo-card/80 backdrop-blur-xl rounded-[1.5rem] border border-holo-border relative overflow-hidden flex flex-col transition-all duration-300 animate-slide-up opacity-0 ${glow ? 'shadow-neon border-holo-primary/30' : 'hover:border-holo-primary/30 hover:shadow-lg'} ${className}`}
        >
            {!noBrackets && (
                <>
                    <div className="tech-bracket absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-holo-primary/30 rounded-tl-xl pointer-events-none"></div>
                    <div className="tech-bracket absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-holo-primary/30 rounded-tr-xl pointer-events-none"></div>
                    <div className="tech-bracket absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-holo-primary/30 rounded-bl-xl pointer-events-none"></div>
                    <div className="tech-bracket absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-holo-primary/30 rounded-br-xl pointer-events-none"></div>
                </>
            )}
            
            {title ? (
                 <div className="relative z-10 h-full flex flex-col">
                     <div className="p-6 border-b border-holo-border flex justify-between items-start bg-holo-surface/30">
                         <div>
                            <h3 className="text-sm font-bold text-holo-text uppercase tracking-wider flex items-center gap-2">
                                {icon}
                                {title}
                                {dataSource && <DataSourceTooltip config={dataSource} />}
                            </h3>
                            {subtitle && <p className="text-[10px] text-holo-muted font-mono mt-1">{subtitle}</p>}
                         </div>
                         {onAnalyze && (
                             <button 
                                 onClick={(e) => { e.stopPropagation(); onAnalyze(); }}
                                 className="text-[10px] bg-holo-surface hover:bg-holo-primary hover:text-black border border-holo-border px-3 py-1.5 rounded transition-colors font-bold uppercase"
                             >
                                 Analyze
                             </button>
                         )}
                     </div>
                     <div className="flex-1 p-6">
                         {children}
                     </div>
                 </div>
            ) : (
                 <div className="relative z-10 h-full">
                     {children}
                 </div>
            )}
        </div>
    );
});

TechCard.displayName = 'TechCard';

export default TechCard;
