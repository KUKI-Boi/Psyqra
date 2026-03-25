import React from 'react';
import { motion } from 'framer-motion';

const KeycapButton = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false,
  ...props
}) => {
  const isDisabled = disabled;

  // Hacker Palette Depth Mapping
  const colors = {
    primary: {
      top: 'bg-accent',
      bottom: 'bg-accent/40',
      text: 'text-primary',
      shadow: 'rgba(0, 255, 65, 0.3)'
    },
    secondary: {
      top: 'bg-[#1a1a1a]',
      bottom: 'bg-[#0a0a0a]',
      text: 'text-accent',
      shadow: 'rgba(0, 255, 65, 0.1)'
    }
  };

  const current = colors[variant] || colors.primary;

  return (
    <div className={`relative inline-block ${className} ${isDisabled ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
      {/* 3D Depth / Base Shadow */}
      <div className={`absolute -bottom-1.5 left-0 right-0 h-full rounded-lg ${current.bottom} blur-[2px]`} />
      
      {/* The Keycap itself */}
      <motion.button
        disabled={isDisabled}
        onClick={onClick}
        whileHover={{ y: -2 }}
        whileTap={{ y: 4 }}
        transition={{ type: "spring", stiffness: 800, damping: 20 }}
        className={`relative z-10 px-8 py-3 rounded-lg border border-accent/20 cursor-pointer font-mono font-black uppercase tracking-widest text-lg 
                   ${current.top} ${current.text} shadow-[0_4px_0_0_rgba(0,0,0,0.5)]`}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        
        {/* Subtle internal glow/edge highlight */}
        <div className="absolute inset-0 rounded-lg border-t border-l border-white/20 pointer-events-none" />
      </motion.button>
    </div>
  );
};

export default KeycapButton;
