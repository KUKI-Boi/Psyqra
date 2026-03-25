import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReflex } from '../../hooks/useReflex';
import Card from '../ui/Card';

const ReflexEngine = () => {
  const { 
    currentWord, 
    currentZone, 
    zoneActivated, 
    typedChars, 
    score, 
    lives,
    reactionTime, 
    timeLeft,
    isGameOver
  } = useReflex();

  const zones = [
    { id: 'left', key: 'A', label: 'Left' },
    { id: 'center', key: 'S', label: 'Center' },
    { id: 'right', key: 'D', label: 'Right' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto h-[600px] flex flex-col gap-8 relative p-4">
      
      {/* HUD */}
      <div className="flex justify-between items-center px-8 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.2em] text-white/50">Score</span>
          <span className="text-3xl font-black text-neon shadow-neon">{score}</span>
        </div>

        <div className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">Lives</span>
            <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                    <motion.div 
                        key={i}
                        animate={{ scale: i < lives ? 1 : 0.8, opacity: i < lives ? 1 : 0.2 }}
                        className={`w-4 h-4 rounded-sm rotate-45 ${i < lives ? 'bg-error shadow-[0_0_10px_var(--color-error)]' : 'bg-white/10'}`}
                    />
                ))}
            </div>
        </div>
        
        <div className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Time Remaining</span>
            <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                    animate={{ width: `${(timeLeft / 3) * 100}%` }}
                    className={`h-full ${timeLeft < 1 ? 'bg-error' : 'bg-accent'}`}
                />
            </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-[0.2em] text-white/50">Last Reaction</span>
          <span className="text-2xl font-bold text-white/80">{reactionTime.toFixed(3)}s</span>
        </div>
      </div>

      {/* Reflex Zones */}
      <div className="flex-1 grid grid-cols-3 gap-6 h-full">
        {zones.map((zone) => (
          <div 
            key={zone.id} 
            className={`relative rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center
              ${currentZone === zone.id 
                ? 'border-neon/50 bg-neon/5 shadow-[0_0_30px_rgba(0,240,255,0.1)]' 
                : 'border-white/5 bg-white/2 opacity-40'}`}
          >
            {/* Zone Label */}
            <div className="absolute top-6 flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold
                    ${currentZone === zone.id && !zoneActivated ? 'border-neon text-neon animate-pulse' : 'border-white/20 text-white/40'}`}>
                    {zone.key}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-white/30">{zone.label}</span>
            </div>

            <AnimatePresence mode="wait">
              {currentZone === zone.id && (
                <motion.div
                  key={currentWord}
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 1.1, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    {/* Word Display */}
                    <div className="text-4xl md:text-5xl font-black tracking-tight flex">
                      {currentWord.split('').map((char, i) => (
                        <span 
                          key={i} 
                          className={`${i < typedChars.length ? 'text-neon' : 'text-white/20'} 
                            ${!zoneActivated ? 'blur-[2px]' : ''} transition-all duration-200`}
                        >
                          {char}
                        </span>
                      ))}
                    </div>

                    {/* Stage Prompt */}
                    {!zoneActivated && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-neon text-primary text-[10px] font-bold rounded uppercase tracking-tighter"
                      >
                        Press {zone.key} to Activate
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Inactive Zone Decoration */}
            {currentZone !== zone.id && (
                <div className="w-12 h-1 bg-white/5 rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Control Hint */}
      <div className="text-center text-xs text-white/20 uppercase tracking-[0.4em] font-medium">
        Sync Neural Reflex ➔ Intercept Word ➔ Type Rapidly
      </div>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-primary/90 backdrop-blur-xl flex flex-col items-center justify-center rounded-3xl border border-white/10"
          >
            <h2 className="text-6xl font-black text-white mb-2 italic tracking-tighter">NEURAL COLLAPSE</h2>
            <p className="text-error uppercase tracking-[0.5em] mb-8 font-bold text-sm">Reflex Threshold Exceeded</p>
            
            <div className="flex flex-col items-center gap-2 mb-12">
                <span className="text-xs uppercase tracking-widest text-white/40">Final Score</span>
                <span className="text-7xl font-black text-neon shadow-neon">{score}</span>
            </div>

            <div className="flex gap-4">
                <Button onClick={() => window.location.reload()} variant="primary" className="px-8 py-4">
                  Re-Initialize
                </Button>
                <Button onClick={() => window.history.back()} variant="secondary" className="px-8 py-4">
                  Terminal Home
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReflexEngine;
