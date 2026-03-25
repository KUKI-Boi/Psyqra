import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import KeycapButton from '../components/ui/KeycapButton';
import Container from '../components/layout/Container';
import NexusFactory from '../components/animations/NexusFactory';

const Home = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden bg-primary font-mono">
      {/* 3D Isometric Biotech Factory Background */}
      <NexusFactory />

      <Container className="relative z-20 flex flex-col items-center justify-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-10 max-w-4xl"
        >
          {/* Main Title Area (Hacker Style) */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="relative inline-block group">
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                TYPING<span className="text-accent underline decoration-accent/30 underline-offset-8">VERSE</span>
              </h1>
              {/* Glitch Effect Proxy */}
              <div className="absolute -inset-1 bg-accent/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            <p className="text-lg md:text-xl text-accent/60 font-medium tracking-[0.3em] max-w-2xl mx-auto uppercase">
               Next-Gen Bio-Neural Interface // Established.
            </p>
          </motion.div>

          {/* CTA Area with Mechanical Keycaps */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-8 pt-6">
            <KeycapButton 
              onClick={() => navigate('/battle')} 
              variant="primary" 
              className="group"
            >
              Initialize Battle
            </KeycapButton>
            
            <div className="flex gap-4">
              <KeycapButton 
                onClick={() => navigate('/reflex')} 
                variant="secondary"
              >
                Reflex.exe
              </KeycapButton>
              <KeycapButton 
                onClick={() => navigate('/audio')} 
                variant="secondary"
              >
                Audio.so
              </KeycapButton>
            </div>
          </motion.div>

          {/* System Telemetry */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-10 mt-12 pt-10 border-t border-accent/10 w-full"
          >
            {[
              { label: 'Latency', value: '0.4ms' },
              { label: 'Sync Rate', value: '99.9%' },
              { label: 'Auth Status', value: 'Encrypted' }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-start min-w-[120px]">
                <span className="text-[10px] font-bold text-accent/40 uppercase tracking-widest">{stat.label}</span>
                <span className="text-sm font-black text-accent">{stat.value}</span>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </Container>

      {/* Persistent Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
};

export default Home;
