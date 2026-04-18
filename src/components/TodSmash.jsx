import { useState, useEffect, useRef } from 'react';
import keyMappings, { getFallbackMapping } from '../data/keyMappings';
import { playSoundForKey, speakWord } from '../utils/sounds';
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speakingRef = useRef(false);
  const closeBufferRef = useRef('');
  const isExitingRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => { closeBufferRef.current = closeBuffer; }, [closeBuffer]);
  useEffect(() => { isExitingRef.current = isExiting; }, [isExiting]);

  // Single unified keydown handler in capture phase
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Allow F11 for fullscreen
      if (e.key === 'F11') return;

      // Block ALL default browser behavior
      e.preventDefault();
      e.stopPropagation();

      if (isExitingRef.current) return;

      // If still speaking, ignore new keys (low stimulation)
      if (speakingRef.current) return;

      setShowWelcome(false);

      const key = e.key;

      // Track "close" + Enter typing
      if (key === 'Enter') {
        if (closeBufferRef.current.toLowerCase() === 'close') {
          isExitingRef.current = true;
          setIsExiting(true);
          setCurrentDisplay({
            letter: '👋',
            word: 'Bye Bye!',
            emoji: '👋',
            color: '#FF6B6B',
          });
          speakWord('Bye bye! See you later!');
          setTimeout(() => {
            window.close();
            setCurrentDisplay({
              letter: '👋',
              word: 'You can close this tab now!',
              emoji: '👋',
              color: '#FF6B6B',
            });
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

      // Get mapping for this key
      const lowerKey = key.length === 1 ? key.toLowerCase() : key;
      const mapping = keyMappings[lowerKey] || getFallbackMapping(key);

      // Set display — just one emoji, the letter, and the word
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
      setIsSpeaking(true);

      // Small pause, then speak the word
      setTimeout(() => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(mapping.word);
          utterance.rate = 0.8;
          utterance.pitch = 1.2;
          utterance.volume = 1;
          utterance.onend = () => {
            speakingRef.current = false;
            setIsSpeaking(false);
          };
          // Fallback timeout in case onend doesn't fire
          const fallback = setTimeout(() => {
            speakingRef.current = false;
            setIsSpeaking(false);
          }, 3000);
          utterance.onend = () => {
            clearTimeout(fallback);
            speakingRef.current = false;
            setIsSpeaking(false);
          };
          window.speechSynthesis.speak(utterance);
        } else {
          // No speech support, just wait a moment
          setTimeout(() => {
            speakingRef.current = false;
            setIsSpeaking(false);
          }, 1000);
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

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', blockKeyUp, true);
    window.addEventListener('contextmenu', blockContext, true);
    window.addEventListener('beforeunload', blockUnload);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', blockKeyUp, true);
      window.removeEventListener('contextmenu', blockContext, true);
      window.removeEventListener('beforeunload', blockUnload);
    };
  }, []);

  return (
    <div
      className="todsmash"
      style={{ background: bgColors[bgIndex] }}
      onClick={() => {
        if (showWelcome) {
          setShowWelcome(false);
          speakWord('Press any key!');
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
