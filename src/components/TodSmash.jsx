import { useState, useEffect, useRef } from 'react';
import keyMappings, { getFallbackMapping } from '../data/keyMappings';
import { playSoundForKey, startBackgroundMusic, stopBackgroundMusic } from '../utils/sounds';
import './TodSmash.css';

// Soft pastel backgrounds
const bgColors = [
  'linear-gradient(135deg, #a8c0ff 0%, #d4e0ff 100%)',
  'linear-gradient(135deg, #fbc2eb 0%, #fde2f3 100%)',
  'linear-gradient(135deg, #a1ffce 0%, #d4ffe6 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fff5eb 100%)',
  'linear-gradient(135deg, #c3cfe2 0%, #e8ecf1 100%)',
  'linear-gradient(135deg, #f6d5f7 0%, #fbe9d7 100%)',
  'linear-gradient(135deg, #d4fc79 0%, #e8ffb8 100%)',
  'linear-gradient(135deg, #ffd1ff 0%, #faf0ff 100%)',
  'linear-gradient(135deg, #b8e6ff 0%, #e0f3ff 100%)',
  'linear-gradient(135deg, #fff1c1 0%, #fffbe6 100%)',
];

// Module-level: all letter keys (a–z) for random picks — derived from static import
const allLetterKeys = Object.keys(keyMappings).filter(k => k.length === 1 && /[a-z]/.test(k));
const getRandomMapping = () => {
  const key = allLetterKeys[Math.floor(Math.random() * allLetterKeys.length)];
  const entries = keyMappings[key];
  const entry = entries[Math.floor(Math.random() * entries.length)];
  return { mapping: entry, label: key.toUpperCase() };
};

const TodSmash = () => {
  const [currentDisplay, setCurrentDisplay] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [closeBuffer, setCloseBuffer] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const speakingRef = useRef(false);
  const closeBufferRef = useRef('');
  const isExitingRef = useRef(false);
  // Tracks how many times each key has been pressed, so we cycle entries
  const keyIndicesRef = useRef({});
  const musicStartedRef = useRef(false);
  // Prevents synthetic ghost-click firing after touchstart on the same interaction
  const lastWasTouchRef = useRef(false);
  const [particles, setParticles] = useState([]);

  // Keep refs in sync with state
  useEffect(() => { closeBufferRef.current = closeBuffer; }, [closeBuffer]);
  useEffect(() => { isExitingRef.current = isExiting; }, [isExiting]);

  // Single unified keydown handler in capture phase
  useEffect(() => {
    // Shared: update display, spawn particles, speak word
    const fireDisplay = (mapping, letterLabel) => {
      setCurrentDisplay({
        letter: letterLabel,
        word: mapping.word,
        emoji: mapping.emoji,
        color: mapping.color,
      });

      setBgIndex((prev) => (prev + 1) % bgColors.length);

      const SYMBOLS = ['♪', '♫', '🎵', '🎶', '✨', '💫', '⭐', '🌟'];
      const count = 5 + Math.floor(Math.random() * 4);
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i,
        x: 5 + Math.random() * 88,
        y: 50 + Math.random() * 40,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        color: mapping.color,
        size: 22 + Math.floor(Math.random() * 26),
        speed: (1.2 + Math.random() * 1.0).toFixed(2),
      }));
      setParticles(prev => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
      }, 2500);

      speakingRef.current = true;
      setTimeout(() => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(mapping.word);
          utterance.rate = 0.8;
          utterance.pitch = 1.2;
          utterance.volume = 1;
          const fallback = setTimeout(() => { speakingRef.current = false; }, 3500);
          utterance.onend = () => { clearTimeout(fallback); speakingRef.current = false; };
          window.speechSynthesis.speak(utterance);
        } else {
          setTimeout(() => { speakingRef.current = false; }, 1000);
        }
      }, 200);
    };

    const handleKeyDown = (e) => {
      // Block ALL default browser behavior and shortcuts
      e.preventDefault();
      e.stopPropagation();

      if (isExitingRef.current) return;

      // Ensure we're in fullscreen on every key press
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      }

      // Start background music on very first keypress (requires user gesture)
      if (!musicStartedRef.current) {
        musicStartedRef.current = true;
        startBackgroundMusic();
      }

      // If still speaking, ignore new keys (low stimulation)
      if (speakingRef.current) return;

      setShowWelcome(false);

      const key = e.key;

      // Track "close" + Enter typing
      if (key === 'Enter') {
        if (closeBufferRef.current.toLowerCase() === 'close') {
          isExitingRef.current = true;
          setIsExiting(true);
          stopBackgroundMusic();
          setCurrentDisplay({ letter: '👋', word: 'Bye Bye!', emoji: '👋', color: '#FF6B6B' });
          if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance('Bye bye! See you later!');
            u.rate = 0.8; u.pitch = 1.2;
            window.speechSynthesis.speak(u);
          }
          setTimeout(() => {
            window.close();
            setCurrentDisplay({ letter: '👋', word: 'You can close this tab now!', emoji: '👋', color: '#FF6B6B' });
          }, 2000);
          return;
        }
        setCloseBuffer('');
        closeBufferRef.current = '';
      } else if (key.length === 1) {
        const newBuf = (closeBufferRef.current + key).slice(-5);
        setCloseBuffer(newBuf);
        closeBufferRef.current = newBuf;
      } else if (key === 'Backspace') {
        const newBuf = closeBufferRef.current.slice(0, -1);
        setCloseBuffer(newBuf);
        closeBufferRef.current = newBuf;
      }

      // Get the entries array for this key, then pick the next one in sequence
      const lowerKey = key.length === 1 ? key.toLowerCase() : key;
      const entries = keyMappings[lowerKey];

      let mapping, letterLabel;
      if (entries && entries.length > 0) {
        const idx = (keyIndicesRef.current[lowerKey] ?? 0) % entries.length;
        mapping = entries[idx];
        keyIndicesRef.current[lowerKey] = idx + 1;
        letterLabel = key.length === 1 ? key.toUpperCase() : mapping.emoji;
      } else {
        mapping = getFallbackMapping();
        letterLabel = mapping.emoji;
      }

      playSoundForKey(key);
      fireDisplay(mapping, letterLabel);
    };

    // Shared random-word handler — used by both touch and click
    const fireRandom = () => {
      if (isExitingRef.current) return;

      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      }

      if (!musicStartedRef.current) {
        musicStartedRef.current = true;
        startBackgroundMusic();
      }

      if (speakingRef.current) return;

      setShowWelcome(false);

      const { mapping, label } = getRandomMapping();
      playSoundForKey(label.toLowerCase());
      fireDisplay(mapping, label);
    };

    // Touch handler — fires random word on every tap
    const handleTouch = (e) => {
      e.preventDefault();
      // Mark this interaction as touch so the follow-up synthetic click is ignored
      lastWasTouchRef.current = true;
      setTimeout(() => { lastWasTouchRef.current = false; }, 500);
      fireRandom();
    };

    // Mouse click handler — fires random word on every click
    // Skipped when the click is a ghost-click generated after a touchstart
    const handleClick = () => {
      if (lastWasTouchRef.current) return;
      fireRandom();
    };

    const blockKeyUp = (e) => { e.preventDefault(); e.stopPropagation(); };
    const blockContext = (e) => { e.preventDefault(); };
    const blockUnload = (e) => {
      if (!isExitingRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    // Re-enter fullscreen any time it gets exited (e.g. Escape key exits fullscreen)
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !isExitingRef.current) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      }
    };

    // Re-enter fullscreen when tab becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden && !document.fullscreenElement && !isExitingRef.current) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      }
    };

    // Keep keyboard focus on the window at all times
    const handleBlur = () => { window.focus(); };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', blockKeyUp, true);
    window.addEventListener('contextmenu', blockContext, true);
    window.addEventListener('beforeunload', blockUnload);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    // Touch: passive:false so we can call e.preventDefault()
    document.addEventListener('touchstart', handleTouch, { passive: false });
    // Click: covers mouse clicks and pointer devices
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', blockKeyUp, true);
      window.removeEventListener('contextmenu', blockContext, true);
      window.removeEventListener('beforeunload', blockUnload);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('touchstart', handleTouch);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div
      className="todsmash"
      style={{ background: bgColors[bgIndex] }}
      // onClick intentionally omitted — handled by the document 'click' listener
      // which has access to fireDisplay and correctly deduplicates touch events
      tabIndex={0}
    >
      {/* Welcome screen */}
      {showWelcome && (
        <div className="welcome">
          <div className="welcome-emoji">🎮</div>
          <h1 className="welcome-title">TodSmash!</h1>
          <p className="welcome-subtitle">Tap or press any key!</p>
        </div>
      )}

      {/* Floating music note particles */}
      {particles.map(p => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            color: p.color,
            fontSize: `${p.size}px`,
            animationDuration: `${p.speed}s`,
          }}
        >
          {p.symbol}
        </span>
      ))}

      {/* Main display — single emoji, letter, and word */}
      {currentDisplay && !showWelcome && (
        <div className="main-display" key={currentDisplay.word + bgIndex}>
          <div className="big-emoji">{currentDisplay.emoji}</div>
          <div className="big-letter" style={{ color: currentDisplay.color }}>
            {currentDisplay.letter}
          </div>
          <div className="word-display" style={{ color: currentDisplay.color }}>
            {currentDisplay.word}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodSmash;
