import React from 'react';
import AudioEngine from '../components/typing/AudioEngine';
import Container from '../components/layout/Container';

const Audio = () => {
  return (
    <div className="min-h-screen bg-primary text-white overflow-hidden relative">
      <Container className="relative z-10 pt-32 flex flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
            Aural Transmission
          </h1>
          <p className="text-white/40 text-xs tracking-[0.5em] mt-2 uppercase">Listen ➔ Interpret ➔ Execute</p>
        </div>

        <AudioEngine />
      </Container>
    </div>
  );
};

export default Audio;
