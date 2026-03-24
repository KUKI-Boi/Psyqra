import React from 'react';

const Character = ({ expected, typed, isActive }) => {
  // Determine state
  const isCorrect = typed === expected;
  const isIncorrect = typed !== undefined && typed !== expected;
  const isDefault = typed === undefined;

  // Build styles based on state
  let textColor = 'text-white/40'; // Default
  if (isCorrect) textColor = 'text-accent glow-text drop-shadow-[0_0_8px_rgba(123,189,232,0.8)]';
  if (isIncorrect) textColor = 'text-error drop-shadow-[0_0_8px_rgba(255,77,109,0.8)]';
  
  // Render active cursor glow
  const cursorStyle = isActive 
    ? 'border-l-2 border-neon animate-pulse -ml-[2px] bg-neon/10' 
    : '';

  return (
    <span
      className={`relative inline-block px-[1px] font-mono text-3xl md:text-4xl transition-colors duration-150 ${textColor} ${cursorStyle}`}
    >
      {expected === ' ' ? '\u00A0' : expected}
    </span>
  );
};

// Memoize to prevent re-rendering unaffected characters during fast typing
export default React.memo(Character);
