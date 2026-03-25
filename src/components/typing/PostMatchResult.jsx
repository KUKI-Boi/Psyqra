import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { saveMatchStats } from '../../utils/saveStats';

const AnimatedCounter = ({ from = 0, to, duration = 1.5 }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      
      // Easing function: easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * (to - from) + from));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [to, from, duration]);

  return <span>{count}</span>;
};

const PostMatchResult = ({ wpm, accuracy, errors, onRematch, onHome }) => {
  const { user, loginWithGoogle } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Auto-save if logged in
  useEffect(() => {
    if (user && !saveSuccess && !isSaving) {
      const save = async () => {
        setIsSaving(true);
        try {
          await saveMatchStats(user, { wpm, accuracy, errors, mode: 'solo' });
          setSaveSuccess(true);
        } catch (e) {
          console.error('Failed to auto-save stats:', e);
        }
        setIsSaving(false);
      };
      save();
    }
  }, [user, saveSuccess, isSaving, wpm, accuracy, errors]);

  const handleLoginToSave = async () => {
    try {
      await loginWithGoogle();
      // useEffect will trigger auto-save once `user` populates
    } catch (e) {
      console.error('Login failed', e);
    }
  };

  const getPerformanceMessage = () => {
    if (wpm > 80) return "God Tier Execution.";
    if (wpm > 50) return "Solid Performance.";
    return "Keep Practicing.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-primary/80 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-8 w-full max-w-2xl relative overflow-hidden"
    >
      {/* Decorative pulse background */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-accent/20 to-transparent pointer-events-none" />

      <div className="text-center z-10">
        <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-white/50 mb-2">Match Complete</h2>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
          {getPerformanceMessage()}
        </h1>
      </div>

      <div className="flex justify-center gap-12 w-full z-10 py-6">
        <div className="flex flex-col items-center">
          <span className="text-6xl font-black text-accent drop-shadow-[0_0_15px_rgba(123,189,232,0.4)]">
            <AnimatedCounter to={wpm} />
          </span>
          <span className="text-sm tracking-widest uppercase mt-2 text-white/50">WPM</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-6xl font-black text-neon drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <AnimatedCounter to={accuracy} />%
          </span>
          <span className="text-sm tracking-widest uppercase mt-2 text-white/50">Accuracy</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full z-10">
        <div className="flex gap-4 w-full">
          <Button onClick={onRematch} variant="primary" className="flex-1">
            Play Again
          </Button>
          <Button onClick={onHome} variant="secondary" className="flex-1">
            Home Menu
          </Button>
        </div>

        {/* Save Progress Auth Block */}
        <AnimatePresence>
            {!user ? (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-6 border-t border-white/10 flex flex-col items-center gap-3 text-center"
            >
                <p className="text-sm text-white/60">Want to track your stats over time?</p>
                <Button onClick={handleLoginToSave} variant="secondary" className="text-sm py-2 px-6 border-accent text-accent mt-1 hover:bg-accent/10">
                Continue with Google to Save
                </Button>
            </motion.div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-center"
                >
                    <p className={`text-sm ${saveSuccess ? 'text-success' : 'text-white/40'}`}>
                        {isSaving ? 'Saving to cloud...' : saveSuccess ? '✓ Progress Saved' : ''}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Lazy import for AnimatePresence inside the file if missing
import { AnimatePresence } from 'framer-motion';

export default PostMatchResult;
