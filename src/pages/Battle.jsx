import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Container from '../components/layout/Container';
import TypingEngine from '../components/typing/TypingEngine';

const Battle = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary text-white overflow-hidden relative selection:bg-neon/30">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none fade-out opacity-20 bg-gradient-to-b from-accent to-transparent mix-blend-screen mix-blend-overlay"></div>
      
      {/* Top Navbar Simulation */}
      <header className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center bg-primary/20 backdrop-blur-md border-b border-white/5 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neon shadow-[0_0_8px_#00F0FF] animate-pulse"></div>
          <span className="font-bold tracking-widest text-white/80 uppercase text-sm">TypingVerse</span>
        </div>
        <Button onClick={() => navigate('/')} variant="secondary" className="px-4 py-2 text-sm">
          Exit Arena
        </Button>
      </header>

      {/* Main Content */}
      <Container className="relative z-10 pt-32 pb-20 flex flex-col items-center min-h-screen">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full flex flex-col items-center gap-8"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold font-inter tracking-tight">
              Solo <span className="text-accent underline decoration-neon decoration-4 underline-offset-8">Arena</span>
            </h1>
            <p className="text-white/60 text-lg">Type the text accurately. Timer starts on first stroke.</p>
          </div>

          {/* Typing Engine Integration */}
          <div className="w-full flex justify-center perspective-1000">
             <TypingEngine />
          </div>

        </motion.div>
      </Container>
    </div>
  );
};

export default Battle;
