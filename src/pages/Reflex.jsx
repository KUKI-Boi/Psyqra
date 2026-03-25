import React from 'react';
import ReflexEngine from '../components/typing/ReflexEngine';
import Container from '../components/layout/Container';
import HeroBackground from '../components/animations/HeroBackground';

const Reflex = () => {
  return (
    <div className="min-h-screen bg-primary text-white overflow-hidden relative">
      <HeroBackground />
      
      <Container className="relative z-10 pt-32 flex flex-col items-center">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-neon to-accent">
            Reflex Neural Intercept
          </h1>
          <p className="text-white/40 text-xs tracking-[0.5em] mt-2 uppercase">Keyboard-Triggered Response Training</p>
        </div>

        <ReflexEngine />
      </Container>
    </div>
  );
};

export default Reflex;
