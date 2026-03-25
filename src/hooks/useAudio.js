import { useState, useCallback, useEffect, useRef } from 'react';

const SENTENCES = [
  "The future of technology is interconnected and adaptive.",
  "Cybernetics enhances human perception beyond physical limits.",
  "Neural networks analyze patterns at lightning speed.",
  "Deep learning architectures redefine the craft of software engineering.",
  "Immersive interfaces create seamless human-machine synergy."
];

export const useAudio = (options = {}) => {
  const { onComplete } = options;
  const [currentText, setCurrentText] = useState('');
  const [typedChars, setTypedChars] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 0.75, 1, 1.5
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [startTime, setStartTime] = useState(null);

  const synth = useRef(window.speechSynthesis);

  const generateNewSentence = useCallback(() => {
    const random = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
    setCurrentText(random);
    setTypedChars('');
    setIsPlaying(false);
    setStartTime(null);
  }, []);

  const playAudio = useCallback(() => {
    if (synth.current.speaking) synth.current.cancel();

    const utterance = new SpeechSynthesisUtterance(currentText);
    utterance.rate = speed;
    utterance.pitch = 0.9; // Slightly lower for futuristic feel
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);

    synth.current.speak(utterance);
    if (!startTime) setStartTime(Date.now());
  }, [currentText, speed, startTime]);

  const handleKeyDown = useCallback((e) => {
    if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) return;

    const nextChar = currentText[typedChars.length];
    if (e.key === nextChar) {
      const newTyped = typedChars + e.key;
      setTypedChars(newTyped);

      if (newTyped === currentText) {
        if (synth.current.speaking) synth.current.cancel();
        if (onComplete) onComplete();
        setTimeout(generateNewSentence, 500); // Small delay for UX
      }
    } else {
      setAccuracy(prev => Math.max(0, prev - (100 / currentText.length)));
    }
  }, [currentText, typedChars, onComplete, generateNewSentence]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    generateNewSentence();
  }, [generateNewSentence]);

  return {
    currentText,
    typedChars,
    isPlaying,
    speed,
    wpm,
    accuracy,
    playAudio,
    setSpeed,
    restart: generateNewSentence
  };
};
