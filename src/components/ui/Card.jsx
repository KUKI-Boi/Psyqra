import { motion } from 'framer-motion';

const Card = ({ children, className = '', hoverEffect = false, ...props }) => {
  const baseStyles =
    'bg-primary/40 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden';
  
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, borderColor: 'rgba(123, 189, 232, 0.3)' } : {}}
      transition={{ duration: 0.3 }}
      className={`${baseStyles} ${className}`}
      {...props}
    >
      {/* Subtle top glare */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default Card;
