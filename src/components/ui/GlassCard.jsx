import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  hover = false, 
  onClick,
  ...props 
}) => {
  const baseClasses = `
    bg-glass-white 
    backdrop-blur-glass 
    border 
    border-glass-border 
    rounded-2xl 
    shadow-glass 
    ${hover ? 'hover:bg-white/10 hover:border-white/20 transition-all duration-300' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  const Component = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    onClick
  } : {};

  return (
    <Component 
      className={baseClasses}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GlassCard;