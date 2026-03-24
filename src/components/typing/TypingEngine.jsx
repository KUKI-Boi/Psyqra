import React from 'react';
import Character from './Character';
import { useTyping } from '../../hooks/useTyping';

// A predefined text for Phase 3 testing
const TEST_TEXT = "The quick brown fox jumps over the lazy dog. Programming is the art of algorithm design and the craft of debugging errant code. Typing fast requires practice, muscle memory, and a calm focus.";

const TypingEngine = () => {
  const { typedChars, cursorIndex, wpm, accuracy, isComplete, errors } = useTyping(TEST_TEXT);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-12 mt-10">
      
      {/* Real-time stats bar */}
      <div className="flex justify-between w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col items-center">
          <span className="text-white/50 text-sm font-semibold tracking-widest uppercase">WPM</span>
          <span className="text-4xl font-bold text-accent">{wpm}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-white/50 text-sm font-semibold tracking-widest uppercase">Accuracy</span>
          <span className="text-4xl font-bold text-neon">{accuracy}%</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-white/50 text-sm font-semibold tracking-widest uppercase">Errors</span>
          <span className="text-4xl font-bold text-error">{errors}</span>
        </div>
      </div>

      {/* Typing Layout */}
      <div className="relative bg-primary/40 border border-white/5 rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        
        {/* Render characters */}
        <div className="flex flex-wrap text-left leading-relaxed">
          {TEST_TEXT.split('').map((char, index) => {
            const typed = typedChars[index];
            const isActive = index === cursorIndex;
            return (
              <Character 
                key={index} 
                expected={char} 
                typed={typed} 
                isActive={isActive} 
              />
            );
          })}
        </div>
        
        {/* Completion Overlay */}
        {isComplete && (
          <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl animate-in fade-in duration-500">
            <h2 className="text-4xl font-bold text-success mb-2 drop-shadow-[0_0_15px_rgba(0,208,132,0.5)]">Test Complete!</h2>
            <p className="text-xl text-white/80">Excellent execution.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default TypingEngine;
