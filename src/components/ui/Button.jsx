import { motion } from 'framer-motion';

const Button = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false,
  ...props
}) => {
  const baseStyles =
    'relative overflow-hidden px-8 py-4 rounded-xl font-bold tracking-wide transition-all duration-300 outline-none flex items-center justify-center gap-2';

  const variants = {
    primary:
      'bg-accent/10 border border-accent/30 text-neon hover:bg-accent/20 hover:border-accent shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] backdrop-blur-md',
    secondary:
      'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm',
    danger:
      'bg-error/10 border border-error/30 text-error hover:bg-error/20 hover:border-error shadow-[0_0_15px_rgba(255,77,109,0.15)] backdrop-blur-md',
    success:
      'bg-success/10 border border-success/30 text-success hover:bg-success/20 hover:border-success shadow-[0_0_15px_rgba(0,208,132,0.15)] backdrop-blur-md',
  };

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none grayscale'
    : 'cursor-pointer';

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${baseStyles} ${variants[variant]} ${disabledStyles} ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {/* Subtle pulse layer for primary */}
      {variant === 'primary' && !disabled && (
        <span className="absolute inset-0 rounded-xl bg-neon/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
    </motion.button>
  );
};

export default Button;
