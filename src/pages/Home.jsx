import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Container from '../components/layout/Container';
import HeroBackground from '../components/animations/HeroBackground';

const Home = () => {
  const navigate = useNavigate();

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Interactive Cyber Background */}
      <HeroBackground />

      <Container className="relative z-10 flex flex-col items-center justify-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-8 max-w-3xl"
        >
          {/* Main Title Area */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.div 
              className="inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter drop-shadow-xl">
                Typing<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-accent">Verse</span>
              </h1>
            </motion.div>
            
            <p className="text-xl md:text-2xl text-accent/80 font-medium tracking-wide max-w-xl mx-auto drop-shadow-md">
              A new way to experience typing. Fast, competitive, and distinctly futuristic.
            </p>
          </motion.div>

          {/* CTA Area */}
          <motion.div variants={itemVariants} className="pt-8">
            <Button 
              onClick={() => navigate('/battle')} 
              variant="primary" 
              className="text-xl px-10 py-5 group"
            >
              <span>Start Battle</span>
              <motion.span 
                className="ml-2 inline-block"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </Button>
          </motion.div>

          {/* Feature highlights below CTA */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-6 mt-16 pt-10 border-t border-white/10 w-full"
          >
            {[
              { label: 'Real-time Multi', glow: 'text-neon' },
              { label: 'AI Analytics', glow: 'text-accent' },
              { label: 'Dynamic Arenas', glow: 'text-success' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] bg-current ${feature.glow}`} />
                <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">{feature.label}</span>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </Container>
    </div>
  );
};

export default Home;
