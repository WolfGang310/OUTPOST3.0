
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Info, ExternalLink, Database } from 'lucide-react';

export interface DataSourceConfig {
  source: string;
  frequency?: string;
  url?: string;
  lastUpdated?: string;
}

interface DataSourceTooltipProps {
  config: DataSourceConfig;
  className?: string;
}

const DataSourceTooltip: React.FC<DataSourceTooltipProps> = ({ config, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        x: rect.left + rect.width / 2,
        y: rect.top - 8 // 8px gap above element
      });
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150); // 150ms grace period to allow moving mouse into tooltip
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      <div 
          className={`relative inline-flex items-center ${className} z-50`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => { e.stopPropagation(); if(!isVisible) handleMouseEnter(); else setIsVisible(false); }}
      >
        <button 
          ref={triggerRef}
          className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-holo-muted hover:text-holo-primary transition-colors focus:outline-none focus:ring-1 focus:ring-holo-primary/50"
          aria-label="Data Source Information"
        >
          <Info className="w-3 h-3" />
        </button>
      </div>

      {isVisible && createPortal(
        <div 
            className="fixed z-[9999]"
            style={{ 
                left: coords.x, 
                top: coords.y, 
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'auto' 
            }}
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
        >
            <div className="w-56 p-3 bg-holo-card/95 border border-holo-border rounded-xl shadow-xl shadow-black/80 backdrop-blur-md text-left animate-fade-in relative">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                    <Database className="w-3 h-3 text-holo-primary" />
                    <span className="text-[10px] font-bold text-holo-muted uppercase tracking-wider">Data Origin</span>
                </div>
                
                <div className="text-xs font-semibold text-holo-text mb-1">{config.source}</div>
                
                {(config.frequency || config.lastUpdated) && (
                    <div className="flex flex-col gap-0.5 mb-2">
                        {config.frequency && (
                            <span className="text-[10px] text-holo-muted">
                                Freq: <span className="text-holo-text/70">{config.frequency}</span>
                            </span>
                        )}
                        {config.lastUpdated && (
                            <span className="text-[10px] text-holo-muted">
                                Updated: <span className="text-holo-text/70">{config.lastUpdated}</span>
                            </span>
                        )}
                    </div>
                )}
                
                {config.url && (
                    <div className="flex items-center gap-1 text-[10px] text-holo-primary mt-1 w-fit">
                        <span 
                            className="hover:underline hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(config.url, '_blank');
                            }}
                        >
                             View Source <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                    </div>
                )}
                
                {/* Arrow */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-holo-card/95 border-b border-r border-holo-border transform rotate-45"></div>
            </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default DataSourceTooltip;
