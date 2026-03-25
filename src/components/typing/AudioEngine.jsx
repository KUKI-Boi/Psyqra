import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../hooks/useAudio';
import Button from '../ui/Button';
import DynamicBackground from '../animations/DynamicBackground';

const AudioEngine = () => {
  const { 
    currentText, 
    typedChars, 
    isPlaying, 
    speed, 
    playAudio, 
    setSpeed,
    accuracy 
  } = useAudio();

  const playbackSpeeds = [
    { label: '0.75x', value: 0.75 },
    { label: '1.0x', value: 1.0 },
    { label: '1.25x', value: 1.25 }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-12 mt-10 relative z-10">
      <DynamicBackground speed={speed} />

      {/* Stats HUD */}
      <div className="flex gap-12 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Accuracy</span>
          <span className="text-2xl font-black text-neon">{accuracy}%</span>
        </div>
        <div className="w-[1px] h-full bg-white/10" />
        <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Current Speed</span>
            <span className="text-2xl font-black text-accent">{speed}x</span>
        </div>
      </div>

      {/* Audio Playback Controls */}
      <div className="flex flex-col items-center gap-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={playAudio}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500
            ${isPlaying ? 'bg-neon/20 border-neon shadow-[0_0_40px_rgba(0,240,255,0.2)]' : 'bg-white/5 border-white/10'}`}
          style={{ border: '2px solid' }}
        >
          {isPlaying ? (
             <div className="flex gap-1 items-center">
                {[1, 2, 3].map(i => (
                    <motion.div 
                        key={i}
                        animate={{ height: [10, 30, 10] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1.5 bg-neon rounded-full"
                    />
                ))}
             </div>
          ) : (
            <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </motion.button>
        <span className="text-xs uppercase tracking-[0.5em] text-white/40">Listen & Trace</span>
      </div>

      {/* Typing Display */}
      <div className="w-full bg-primary/40 backdrop-blur-md p-10 rounded-3xl border border-white/5 shadow-2xl min-h-[160px] flex items-center justify-center">
        <div className="text-3xl font-medium tracking-tight text-center leading-relaxed max-w-2xl px-4">
             {typedChars.split('').map((char, i) => (
                <span key={i} className="text-white">{char}</span>
             ))}
             <motion.span 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-3 h-8 bg-neon ml-1 translate-y-1.5"
             />
             <span className="opacity-10">
                {currentText.slice(typedChars.length)}
             </span>
        </div>
      </div>

      {/* Speed Selector */}
      <div className="flex gap-4 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
        {playbackSpeeds.map((s) => (
          <button
            key={s.value}
            onClick={() => setSpeed(s.value)}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all
              ${speed === s.value ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/50'}`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AudioEngine;
