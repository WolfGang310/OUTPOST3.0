
import React, { useEffect, useRef, useState } from 'react';
import { MAP_EVENT_LOCATIONS, CHOKEPOINT_LOCATIONS, CHOKEPOINT_DATA, EVENT_INSIGHTS } from '../constants';
import { X, Zap, ChevronRight } from 'lucide-react';

interface GeopoliticalMapProps {
    selectedEvent: string;
}

declare global {
    interface Window {
        L: any;
    }
}

const GeopoliticalMap: React.FC<GeopoliticalMapProps> = ({ selectedEvent }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    
    // Get current event insight for subtitles
    const currentInsight = EVENT_INSIGHTS[selectedEvent];
    
    // Modal State
    const [activeInsight, setActiveInsight] = useState<{
        title: string;
        subtitle: string;
        body: string;
        keyFacts: string[];
    } | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        // Initialize Leaflet Map
        const L = window.L;
        if (!L) return;

        const map = L.map(mapContainerRef.current, {
            center: [20, 0],
            zoom: 2,
            minZoom: 2,
            maxZoom: 10,
            worldCopyJump: true,
            zoomControl: false,
            attributionControl: false
        });

        // Dark Matter Tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 20
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        mapRef.current = map;

        // Add Chokepoints (Economic Nerves)
        Object.entries(CHOKEPOINT_LOCATIONS).forEach(([name, coords]) => {
            const data = CHOKEPOINT_DATA.find(c => c.name === name);
            const color = data?.color || '#06b6d4';
            
            // Custom Icon for Chokepoints
            const icon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="background-color: ${color}; width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 10px ${color}; border: 1px solid white;"></div>`,
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            });

            L.marker([coords.lat, coords.lng], { icon })
                .addTo(map)
                .bindPopup(`
                    <div style="font-family: Inter, sans-serif;">
                        <strong style="color: ${color}">${name}</strong><br/>
                        <span style="font-size: 10px; color: #94a3b8;">ECONOMIC CHOKEPOINT</span><br/>
                        <span style="font-size: 11px; color: var(--holo-text);">Volume Impact: ${data?.impact}%</span>
                    </div>
                `);
        });

    }, []);

    // Effect to handle flying to selected events
    useEffect(() => {
        const map = mapRef.current;
        const L = window.L;
        
        if (!map || !L) return;

        // Clear previous event markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        const location = MAP_EVENT_LOCATIONS[selectedEvent];
        const insight = EVENT_INSIGHTS[selectedEvent];

        if (location) {
            // Fly to location
            map.flyTo([location.lat, location.lng], location.zoom, {
                animate: true,
                duration: 1.5
            });

            // Add pulsing marker for conflict zone
            const pulseIcon = L.divIcon({
                className: 'pulse-icon',
                html: `<div class="relative flex h-6 w-6 cursor-pointer group">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-holo-primary opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-6 w-6 bg-holo-primary/50 border-2 border-white group-hover:bg-holo-primary transition-colors"></span>
                       </div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            const marker = L.marker([location.lat, location.lng], { icon: pulseIcon })
                .addTo(map);
            
            // Add click listener to marker
            marker.on('click', () => {
                if (insight) {
                    setActiveInsight(insight);
                }
            });

            // Use theme color for popup text instead of hardcoded black
            // Include Subtitle in the popup
            marker.bindPopup(`
                <div style="color: var(--holo-text); font-family: Inter, sans-serif; min-width: 180px;">
                    <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${selectedEvent}</div>
                    <div style="font-size: 11px; color: var(--holo-muted); line-height: 1.3; margin-bottom: 8px;">
                        ${insight?.subtitle || 'Event Location'}
                    </div>
                    <div style="font-size: 10px; font-weight: bold; color: var(--holo-primary); text-transform: uppercase; display: flex; align-items: center;">
                        <span style="margin-right: 4px;">⚡</span> Click to Analyze
                    </div>
                </div>
            `);
            
            marker.openPopup();
            markersRef.current.push(marker);
        } else {
            // Reset to world view if no specific location
            map.flyTo([20, 0], 2);
        }

    }, [selectedEvent]);

    return (
        <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-holo-border bg-holo-card">
            <div ref={mapContainerRef} className="w-full h-full z-10" />
            
            {/* Overlay UI */}
            <div className="absolute top-4 left-4 z-[400] bg-holo-card/90 backdrop-blur px-5 py-3 rounded-2xl border border-holo-border pointer-events-none shadow-xl max-w-[250px]">
                <h4 className="text-[10px] text-holo-muted uppercase tracking-widest font-bold mb-1">Active Zone</h4>
                <div className="text-sm font-bold text-holo-text flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 bg-holo-primary rounded-full animate-pulse flex-shrink-0"></span>
                    {selectedEvent}
                </div>
                {/* Short Detail Subtitle */}
                {currentInsight && (
                    <div className="text-[11px] text-holo-muted leading-tight font-medium border-t border-holo-border pt-2 mt-1">
                        {currentInsight.subtitle}
                    </div>
                )}
            </div>
            
             <div className="absolute bottom-4 left-4 z-[400] flex gap-2">
                <div className="bg-holo-card/80 backdrop-blur px-3 py-1.5 rounded-lg border border-holo-border text-[10px] text-holo-muted flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full border border-white bg-red-500 shadow-[0_0_5px_red]"></span> Chokepoint
                </div>
                <div className="bg-holo-card/80 backdrop-blur px-3 py-1.5 rounded-lg border border-holo-border text-[10px] text-holo-muted flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-holo-primary animate-pulse"></span> Conflict Event
                </div>
            </div>

            {/* Detailed Modal Overlay */}
            {activeInsight && (
                <div className="absolute inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-holo-card border border-holo-border rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-holo-primary to-holo-accent"></div>
                        <button 
                            onClick={() => setActiveInsight(null)}
                            className="absolute top-3 right-3 p-1 rounded-full bg-holo-surface hover:bg-holo-border text-holo-muted hover:text-holo-text transition-colors z-20"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 rounded-lg bg-holo-surface text-holo-primary">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-holo-muted">Intelligence Report</span>
                            </div>

                            <h3 className="text-lg font-bold text-holo-text mb-1 leading-tight">{activeInsight.title}</h3>
                            <p className="text-xs text-holo-accent mb-4 font-medium">{activeInsight.subtitle}</p>

                            <div className="bg-black/20 rounded-xl p-3 mb-4 border border-white/5">
                                <p className="text-xs text-holo-muted leading-relaxed">
                                    {activeInsight.body}
                                </p>
                            </div>

                            <div className="space-y-2">
                                {activeInsight.keyFacts.map((fact, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <ChevronRight className="w-3 h-3 text-holo-primary mt-0.5 flex-shrink-0" />
                                        <span className="text-[11px] text-holo-text">{fact}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeopoliticalMap;
