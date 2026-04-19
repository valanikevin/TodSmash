// Sound synthesis using Web Audio API - no external files needed

let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

// Play a fun "pop" sound
export const playPop = () => {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
};

// Play a "boing" sound
export const playBoing = () => {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
  osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.2);

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
};

// Play a musical note
export const playNote = (frequency = 440) => {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);

  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
};

// Play a "whoosh" sound for space bar
export const playWhoosh = () => {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sawtooth';
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(200, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(4000, ctx.currentTime + 0.2);
  filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);

  osc.frequency.setValueAtTime(100, ctx.currentTime);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.5);
};

// Play a "boom" sound for Enter
export const playBoom = () => {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.5);

  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.6);
};

// Play a sparkle/twinkle sound
export const playSparkle = () => {
  const ctx = getAudioContext();
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.3);

    osc.start(ctx.currentTime + i * 0.08);
    osc.stop(ctx.currentTime + i * 0.08 + 0.3);
  });
};

// Map of notes for letters (musical scale)
const letterNotes = {
  a: 262, b: 294, c: 330, d: 349, e: 392, f: 440, g: 494,
  h: 523, i: 587, j: 659, k: 698, l: 784, m: 880,
  n: 988, o: 1047, p: 1175, q: 1319, r: 1397, s: 1568,
  t: 1760, u: 1976, v: 2093, w: 2349, x: 2637, y: 2794, z: 2960,
};

// Play a rich harmonious chord: root + perfect fifth + octave
export const playChord = (rootFreq) => {
  const ctx = getAudioContext();
  [
    { freq: rootFreq,        vol: 0.13, type: 'triangle' },
    { freq: rootFreq * 1.5,  vol: 0.07, type: 'sine' },
    { freq: rootFreq * 2,    vol: 0.04, type: 'sine' },
  ].forEach(({ freq, vol, type }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.75);
  });
};

// ===== BACKGROUND MUSIC =====
// Gentle looping pentatonic melody (C major pentatonic)
const bgMelody = [
  [524, 0.4], [659, 0.4], [784, 0.4], [659, 0.4],
  [880, 0.6], [784, 0.2], [659, 0.8],
  [524, 0.4], [587, 0.4], [659, 0.4], [784, 0.4],
  [880, 0.5], [1047, 0.5],
  [880, 0.4], [784, 0.4], [659, 0.4], [524, 1.0],
];

// Bass accompaniment (plays alongside melody)
const bgBass = [
  [131, 1.6], [147, 1.6], [131, 2.0],
  [131, 1.8], [165, 1.8], [131, 2.0],
];

let bgRunning = false;
let bgLoopTimeout = null;

const playBgMelody = () => {
  if (!bgRunning) return;
  const ctx = getAudioContext();
  let t = ctx.currentTime + 0.05;
  let totalDur = 0;

  bgMelody.forEach(([freq, dur]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.032, t + 0.02);
    gain.gain.linearRampToValueAtTime(0.032, t + dur * 0.75);
    gain.gain.linearRampToValueAtTime(0, t + dur);
    osc.start(t); osc.stop(t + dur + 0.01);
    t += dur;
    totalDur += dur;
  });

  // Soft bass drone alongside melody
  let bt = ctx.currentTime + 0.05;
  bgBass.forEach(([freq, dur]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, bt);
    gain.gain.setValueAtTime(0, bt);
    gain.gain.linearRampToValueAtTime(0.018, bt + 0.05);
    gain.gain.linearRampToValueAtTime(0.018, bt + dur * 0.8);
    gain.gain.linearRampToValueAtTime(0, bt + dur);
    osc.start(bt); osc.stop(bt + dur + 0.01);
    bt += dur;
  });

  bgLoopTimeout = setTimeout(playBgMelody, (totalDur + 0.4) * 1000);
};

export const startBackgroundMusic = () => {
  if (bgRunning) return;
  bgRunning = true;
  playBgMelody();
};

export const stopBackgroundMusic = () => {
  bgRunning = false;
  if (bgLoopTimeout) { clearTimeout(bgLoopTimeout); bgLoopTimeout = null; }
};

// Get which sound to play based on the key
export const playSoundForKey = (key) => {
  const lowerKey = key.toLowerCase();

  if (lowerKey === ' ') {
    playWhoosh();
  } else if (lowerKey === 'enter') {
    playBoom();
  } else if (['shift', 'control', 'alt', 'meta', 'capslock'].includes(lowerKey)) {
    playSparkle();
  } else if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(lowerKey)) {
    playBoing();
  } else if (letterNotes[lowerKey]) {
    playChord(letterNotes[lowerKey]);
  } else {
    playPop();
  }
};

// Text-to-speech
export const speakWord = (word) => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.85;
    utterance.pitch = 1.3;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }
};
