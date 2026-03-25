import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const HeroBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out mouse movement for parallax
  const springConfig = { damping: 25, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Define subtle translations based on mouse position
  const x1 = useTransform(smoothX, [0, 1], [-20, 20]);
  const y1 = useTransform(smoothY, [0, 1], [-20, 20]);
  const x2 = useTransform(smoothX, [0, 1], [30, -30]);
  const y2 = useTransform(smoothY, [0, 1], [30, -30]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize to 0-1 range
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-primary">
      {/* Background grid texture */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(var(--color-accent) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Flowing Data Structures (Nexus Inspired) */}
      <div className="absolute inset-0 opacity-20 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 0.4, 0],
              x: ['-10%', '110%']
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 3
            }}
            className="absolute h-[1px] w-[300px] bg-gradient-to-r from-transparent via-accent to-transparent rotate-[-15deg]"
            style={{ 
              top: `${20 + i * 15}%`,
              boxShadow: '0 0 15px var(--color-accent)'
            }}
          />
        ))}
      </div>

      {/* Deep Floating Grid (Data Matrix) */}
      <motion.div 
        style={{ 
            x: x1, 
            y: y1,
            backgroundImage: 'linear-gradient(var(--color-white) 1px, transparent 1px), linear-gradient(90deg, var(--color-white) 1px, transparent 1px)',
            backgroundSize: '100px 100px',
        }}
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
      />
      
      {/* Animated glowing orbs (Refined) */}
      <motion.div
        style={{ x: x1, y: y1 }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.45, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-[15%] -left-[5%] w-[55%] h-[55%] rounded-full mix-blend-screen filter blur-[100px] bg-secondary opacity-40 pointer-events-none"
      />
      
      <motion.div
        style={{ x: x2, y: y2 }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-[35%] right-[5%] w-[45%] h-[45%] rounded-full mix-blend-screen filter blur-[110px] bg-accent opacity-30 pointer-events-none"
      />

      <motion.div
        style={{ x: x1, y: y2 }}
        animate={{
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
        className="absolute -bottom-[15%] left-[15%] w-[35%] h-[35%] rounded-full mix-blend-screen filter blur-[80px] bg-neon opacity-20 pointer-events-none"
      />

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary pointer-events-none" />
    </div>
  );
};

export default HeroBackground;
