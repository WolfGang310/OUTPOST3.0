
import React, { useEffect, useRef } from 'react';

interface DataMeshOverlayProps {
    elements: React.RefObject<HTMLDivElement | null>[]; // Updated type to handle null
}

const DataMeshOverlay: React.FC<DataMeshOverlayProps> = ({ elements }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        // Slower, smoother particles
        let particles: { from: number; to: number; progress: number; speed: number }[] = [];
        
        // Initialize particles
        for(let i=0; i<4; i++) {
            particles.push({
                from: Math.floor(Math.random() * elements.length),
                to: Math.floor(Math.random() * elements.length),
                progress: Math.random(),
                speed: 0.002 + Math.random() * 0.003 // Slower speed
            });
        }

        const render = () => {
            // Resize canvas to match parent
            const parent = canvas.parentElement;
            if (parent) {
                if (canvas.width !== parent.clientWidth || canvas.height !== parent.clientHeight) {
                     canvas.width = parent.clientWidth;
                     canvas.height = parent.clientHeight;
                }
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Get centers of all elements
            const centers: {x: number, y: number}[] = [];
            const canvasRect = canvas.getBoundingClientRect();

            elements.forEach(ref => {
                if (ref.current) {
                    const rect = ref.current.getBoundingClientRect();
                    centers.push({
                        x: rect.left - canvasRect.left + rect.width / 2,
                        y: rect.top - canvasRect.top + rect.height / 2
                    });
                } else {
                    centers.push({x: -100, y: -100}); // Placeholder
                }
            });

            // Draw Lines
            ctx.lineWidth = 1;

            // Connect nearby nodes
            for (let i = 0; i < centers.length; i++) {
                for (let j = i + 1; j < centers.length; j++) {
                    if (centers[i].x < 0 || centers[j].x < 0) continue;
                    
                    const dx = centers[i].x - centers[j].x;
                    const dy = centers[i].y - centers[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    // Only draw lines if reasonably close to reduce clutter
                    if (dist < 600) {
                        const opacity = 1 - (dist / 600);
                        ctx.strokeStyle = `rgba(204, 255, 0, ${opacity * 0.1})`; // Very subtle
                        ctx.beginPath();
                        ctx.moveTo(centers[i].x, centers[i].y);
                        
                        // Control point for curve (optional, simple curve here)
                        // ctx.quadraticCurveTo((centers[i].x + centers[j].x)/2, (centers[i].y + centers[j].y)/2 - 20, centers[j].x, centers[j].y);
                        
                        ctx.lineTo(centers[j].x, centers[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw Active Particles
            particles.forEach(p => {
                // Reroll if invalid or done
                if (p.progress >= 1 || centers[p.from].x < 0 || centers[p.to].x < 0 || p.from === p.to) {
                    p.from = Math.floor(Math.random() * centers.length);
                    p.to = Math.floor(Math.random() * centers.length);
                    // Ensure different
                    while(p.to === p.from) p.to = Math.floor(Math.random() * centers.length);
                    p.progress = 0;
                }

                const start = centers[p.from];
                const end = centers[p.to];
                
                if (start.x < 0 || end.x < 0) return;

                const currentX = start.x + (end.x - start.x) * p.progress;
                const currentY = start.y + (end.y - start.y) * p.progress;

                // Draw Particle Glow
                const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 6);
                gradient.addColorStop(0, 'rgba(204, 255, 0, 0.8)');
                gradient.addColorStop(1, 'rgba(204, 255, 0, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
                ctx.fill();

                p.progress += p.speed;
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [elements]);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 pointer-events-none z-0"
        />
    );
};

export default DataMeshOverlay;
