export const playAddToCartSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const t = audioCtx.currentTime;
    
    // Play a 2-note arpeggio (B5 -> E6) commonly used for "coin" or "success" sounds
    const playNote = (freq: number, startTime: number, duration: number, type: OscillatorType = 'sine', vol = 0.3) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      
      // Crisp attack and smooth decay
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Note 1: B5 (987.77 Hz)
    playNote(987.77, t, 0.15, 'sine', 0.2);
    // Note 1 Layer: Add a triangle wave for richness
    playNote(987.77, t, 0.15, 'triangle', 0.1);

    // Note 2: E6 (1318.51 Hz) - slightly delayed
    playNote(1318.51, t + 0.08, 0.4, 'sine', 0.3);
    // Note 2 Layer: Add a square wave for that retro arcade pop
    playNote(1318.51, t + 0.08, 0.4, 'square', 0.05);
  } catch (err) {
    console.error('Audio playback failed', err);
  }
};

export const playRemoveFromCartSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    // A soft, descending "bloop"
    osc.type = 'sine';
    const t = audioCtx.currentTime;
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.15);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    
    osc.start(t);
    osc.stop(t + 0.15);
  } catch (err) {}
};

export const playSuccessSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = audioCtx.currentTime;
    
    const playNote = (freq: number, startTime: number, duration: number, vol = 0.3) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Triumphant 3-note ascending chord (C5, E5, G5)
    playNote(523.25, t, 0.2, 0.2);
    playNote(659.25, t + 0.1, 0.2, 0.2);
    playNote(783.99, t + 0.2, 0.5, 0.3);
  } catch (err) {}
};

export const playTickSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    // Extremely short "tick" for UI interactions
    osc.type = 'sine';
    const t = audioCtx.currentTime;
    osc.frequency.setValueAtTime(1000, t);
    osc.frequency.exponentialRampToValueAtTime(500, t + 0.02);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    
    osc.start(t);
    osc.stop(t + 0.02);
  } catch (err) {}
};
