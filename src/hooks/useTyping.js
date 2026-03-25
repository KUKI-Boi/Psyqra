import { useState, useCallback, useEffect } from 'react';

const isAllowedCode = (code) => {
  return (
    code.startsWith('Key') ||
    code.startsWith('Digit') ||
    code === 'Space' ||
    code === 'Backspace' ||
    code === 'Minus' ||
    code === 'Equal' ||
    code === 'BracketLeft' ||
    code === 'BracketRight' ||
    code === 'Backslash' ||
    code === 'Semicolon' ||
    code === 'Quote' ||
    code === 'Comma' ||
    code === 'Period' ||
    code === 'Slash'
  );
};

export const useTyping = (expectedText, options = {}) => {
  const { onProgress, onError } = options;
  const [typedChars, setTypedChars] = useState('');
  const [cursorIndex, setCursorIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  // Core typing logic
  const handleKeyDown = useCallback(
    (e) => {
      if (e.code === 'Space') e.preventDefault();
      if (!isAllowedCode(e.code) || e.ctrlKey || e.altKey || e.metaKey) return;
      if (!startTime && e.code !== 'Backspace') setStartTime(Date.now());

      setTypedChars((prev) => {
        let newTypedChars = prev;

        if (e.code === 'Backspace') {
          newTypedChars = prev.slice(0, -1);
          setCursorIndex((curr) => Math.max(0, curr - 1));
        } else {
          if (prev.length >= expectedText.length) return prev;

          const charToType = e.key;
          newTypedChars = prev + charToType;
          
          if (expectedText[prev.length] !== charToType) {
            setErrors((curr) => curr + 1);
            if (onError) onError();
          } else {
            // Correct character typed
            if (onProgress) onProgress(newTypedChars.length);
          }

          setCursorIndex((curr) => curr + 1);
        }

        if (newTypedChars.length === expectedText.length && !endTime) {
          setEndTime(Date.now());
        }

        return newTypedChars;
      });
    },
    [expectedText, startTime, endTime, onProgress, onError]
  );

  // Attach global event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Real-time metric calculation loop
  useEffect(() => {
    if (!startTime || endTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedMinutes = (now - startTime) / 60000;
      
      // Calculate WPM: (correct characters / 5) / elapsed minutes
      let correctChars = 0;
      for (let i = 0; i < typedChars.length; i++) {
        if (typedChars[i] === expectedText[i]) correctChars++;
      }
      
      const currentWpm = Math.round((correctChars / 5) / elapsedMinutes);
      setWpm(Math.max(0, currentWpm));

      // Calculate Accuracy: (correct / total typed) * 100
      const totalTypedParams = typedChars.length;
      if (totalTypedParams > 0) {
        const acc = Math.round((correctChars / totalTypedParams) * 100);
        setAccuracy(acc);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [startTime, endTime, typedChars, expectedText]);

  // Final static calculation once complete
  useEffect(() => {
    if (endTime && startTime) {
      let correctChars = 0;
      for (let i = 0; i < typedChars.length; i++) {
        if (typedChars[i] === expectedText[i]) correctChars++;
      }
      const elapsedMinutes = (endTime - startTime) / 60000;
      setWpm(Math.max(0, Math.round((correctChars / 5) / elapsedMinutes)));
    }
  }, [endTime, startTime, expectedText, typedChars]);

  return {
    typedChars,
    cursorIndex,
    errors,
    wpm,
    accuracy,
    isComplete: !!endTime,
  };
};
