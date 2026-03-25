import { useState, useCallback, useEffect, useRef } from 'react';

const WORDS = [
  "reflex", "action", "pulse", "cyber", "motion", "matrix", "sync", "future", 
  "nexus", "code", "neural", "speed", "logic", "flow", "ghost", "vision"
];

const ZONES = ['left', 'center', 'right'];
const ZONE_KEYS = { left: 'KeyA', center: 'KeyS', right: 'KeyD' };

export const useReflex = (options = {}) => {
  const { onWordComplete, onPenalty } = options;
  const [currentWord, setCurrentWord] = useState('');
  const [currentZone, setCurrentZone] = useState('');
  const [zoneActivated, setZoneActivated] = useState(false);
  const [typedChars, setTypedChars] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [reactionTime, setReactionTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);

  const wordStartTime = useRef(null);
  const timerRef = useRef(null);

  const generateNewWord = useCallback(() => {
    if (isGameOver) return;
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    const randomZone = ZONES[Math.floor(Math.random() * ZONES.length)];
    setCurrentWord(randomWord);
    setCurrentZone(randomZone);
    setZoneActivated(false);
    setTypedChars('');
    setTimeLeft(3);
    wordStartTime.current = Date.now();
  }, [isGameOver]);

  // Timer logic
  useEffect(() => {
    if (isGameOver) return;
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current);
          handlePenalty('timeout');
          return 0;
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [currentWord, isGameOver]);

  const handlePenalty = useCallback((reason) => {
    setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) setIsGameOver(true);
        return newLives;
    });
    setScore(s => Math.max(0, s - 5));
    if (onPenalty) onPenalty(reason);
    if (!isGameOver) generateNewWord();
  }, [onPenalty, generateNewWord, isGameOver]);

  const handleKeyDown = useCallback((e) => {
    if (isGameOver) return;

    // Stage 1: Zone Activation
    if (!zoneActivated) {
      if (e.code === ZONE_KEYS[currentZone]) {
        setZoneActivated(true);
        const reaction = (Date.now() - wordStartTime.current) / 1000;
        setReactionTime(reaction);
      } else if (Object.values(ZONE_KEYS).includes(e.code)) {
        // Wrong zone key
        handlePenalty('wrong_zone');
      }
      return;
    }

    // Stage 2: Typing word
    if (e.key.length === 1) { // Single character
      const nextChar = currentWord[typedChars.length];
      if (e.key === nextChar) {
        const newTyped = typedChars + e.key;
        setTypedChars(newTyped);
        
        if (newTyped === currentWord) {
          setScore(s => s + 10);
          if (onWordComplete) onWordComplete();
          generateNewWord();
        }
      } else {
        // Typing error
        handlePenalty('wrong_char');
      }
    }
  }, [currentWord, currentZone, zoneActivated, typedChars, isGameOver, handlePenalty, generateNewWord, onWordComplete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Initial word
  useEffect(() => {
    generateNewWord();
  }, [generateNewWord]);

  return {
    currentWord,
    currentZone,
    zoneActivated,
    typedChars,
    score,
    reactionTime,
    timeLeft,
    isGameOver,
    restart: () => {
      setScore(0);
      setIsGameOver(false);
      generateNewWord();
    }
  };
};
