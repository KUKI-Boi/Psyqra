import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const DynamicBackground = ({ speed = 1 }) => {
  // Speed multiplier for animations
  const duration = useMemo(() => 20 / speed, [speed]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-primary">
      {/* Flowing Lines Grid */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: duration + i,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2
            }}
            className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-neon to-transparent"
            style={{ top: `${i * 10}%` }}
          />
        ))}
      </div>

      {/* Radial Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: duration / 2, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px]"
      />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: '110%',
              opacity: Math.random()
            }}
            animate={{ 
              y: '-10%',
              x: (Math.random() * 100 - 10) + '%'
            }}
            transition={{
              duration: (duration / 2) + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_0%,_var(--color-primary)_80%]" />
    </div>
  );
};

export default DynamicBackground;
