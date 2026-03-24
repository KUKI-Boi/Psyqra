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
      
      {/* Animated glowing orbs */}
      <motion.div
        style={{ x: x1, y: y1 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full mix-blend-screen filter blur-[100px] bg-secondary opacity-40 pointer-events-none"
      />
      
      <motion.div
        style={{ x: x2, y: y2 }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-[40%] right-[10%] w-[50%] h-[50%] rounded-full mix-blend-screen filter blur-[120px] bg-accent opacity-30 pointer-events-none"
      />

      <motion.div
        style={{ x: x1, y: y2 }}
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
        className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] rounded-full mix-blend-screen filter blur-[90px] bg-neon opacity-20 pointer-events-none"
      />

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary pointer-events-none" />
    </div>
  );
};

export default HeroBackground;
