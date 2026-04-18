import { useState, useEffect, useRef } from 'react';
import keyMappings, { getFallbackMapping } from '../data/keyMappings';
import { playSoundForKey } from '../utils/sounds';
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

  // Keep refs in sync with state
  useEffect(() => { closeBufferRef.current = closeBuffer; }, [closeBuffer]);
  useEffect(() => { isExitingRef.current = isExiting; }, [isExiting]);

  // Single unified keydown handler in capture phase
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Block ALL default browser behavior and shortcuts
      e.preventDefault();
      e.stopPropagation();

      if (isExitingRef.current) return;

      // Ensure we're in fullscreen on every key press
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {});
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

      let mapping;
      if (entries && entries.length > 0) {
        const idx = (keyIndicesRef.current[lowerKey] ?? 0) % entries.length;
        mapping = entries[idx];
        keyIndicesRef.current[lowerKey] = idx + 1;
      } else {
        mapping = getFallbackMapping();
      }

      // Set display
      setCurrentDisplay({
        letter: key.length === 1 ? key.toUpperCase() : mapping.emoji,
        word: mapping.word,
        emoji: mapping.emoji,
        color: mapping.color,
      });

      // Gentle background change
      setBgIndex((prev) => (prev + 1) % bgColors.length);

      // Play a gentle sound
      playSoundForKey(key);

      // Lock input while speaking, then unlock when done
      speakingRef.current = true;

      setTimeout(() => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(mapping.word);
          utterance.rate = 0.8;
          utterance.pitch = 1.2;
          utterance.volume = 1;
          const fallback = setTimeout(() => {
            speakingRef.current = false;
          }, 3500);
          utterance.onend = () => {
            clearTimeout(fallback);
            speakingRef.current = false;
          };
          window.speechSynthesis.speak(utterance);
        } else {
          setTimeout(() => { speakingRef.current = false; }, 1000);
        }
      }, 200);
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

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', blockKeyUp, true);
      window.removeEventListener('contextmenu', blockContext, true);
      window.removeEventListener('beforeunload', blockUnload);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <div
      className="todsmash"
      style={{ background: bgColors[bgIndex] }}
      onClick={() => {
        // Enter fullscreen on first click/tap
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.().catch(() => {});
        }
        if (showWelcome) {
          setShowWelcome(false);
          if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance('Press any key!');
            u.rate = 0.8; u.pitch = 1.2;
            window.speechSynthesis.speak(u);
          }
        }
      }}
      tabIndex={0}
    >
      {/* Welcome screen */}
      {showWelcome && (
        <div className="welcome">
          <div className="welcome-emoji">🎮</div>
          <h1 className="welcome-title">TodSmash!</h1>
          <p className="welcome-subtitle">Press any key to play!</p>
        </div>
      )}

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
