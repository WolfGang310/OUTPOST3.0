
export const playStartupSound = () => {
    if (typeof window === 'undefined') return;
    
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        
        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.1, ctx.currentTime);
        masterGain.connect(ctx.destination);

        // 1. Low Hum (Power Up)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(50, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
        osc1.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 2.0);
        
        const gain1 = ctx.createGain();
        gain1.gain.setValueAtTime(0, ctx.currentTime);
        gain1.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.5);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
        
        osc1.connect(gain1);
        gain1.connect(masterGain);
        osc1.start();
        osc1.stop(ctx.currentTime + 2.5);

        // 2. High Tech "Chirp" (Data Connection)
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
        osc2.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.4);
        
        const gain2 = ctx.createGain();
        gain2.gain.setValueAtTime(0, ctx.currentTime);
        gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.2);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc2.connect(gain2);
        gain2.connect(masterGain);
        osc2.start(ctx.currentTime + 0.2);
        osc2.stop(ctx.currentTime + 0.6);

        // 3. Rhythmic Data Ticks
        for (let i = 0; i < 5; i++) {
            const osc = ctx.createOscillator();
            osc.type = 'square';
            osc.frequency.setValueAtTime(1200 + (i * 200), ctx.currentTime + 0.5 + (i * 0.1));
            
            const g = ctx.createGain();
            g.gain.setValueAtTime(0.05, ctx.currentTime + 0.5 + (i * 0.1));
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5 + (i * 0.1) + 0.05);
            
            osc.connect(g);
            g.connect(masterGain);
            osc.start(ctx.currentTime + 0.5 + (i * 0.1));
            osc.stop(ctx.currentTime + 0.5 + (i * 0.1) + 0.05);
        }

    } catch (e) {
        console.error("Audio playback failed", e);
    }
};

export const playHoverSound = () => {
    if (typeof window === 'undefined') return;
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.05);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
};
