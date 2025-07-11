'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react'

export default function LoadingSpinner({ 
  size = 'medium', 
  color = 'blue', 
  theme = 'light' 
}) {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    orange: 'border-orange-500'
  };

  const spinnerVariants = {
    spin: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          variants={spinnerVariants}
          animate="spin"
          className={`${sizeClasses[size]} border-4 border-t-transparent ${
            colorClasses[color]
          } rounded-full`}
        />
        
        {/* Inner Pulse */}
        <motion.div
          variants={pulseVariants}
          animate="pulse"
          className={`absolute inset-2 ${
            colorClasses[color].replace('border-', 'bg-')
          } rounded-full opacity-20`}
        />
        
        {/* Center Dot */}
        <motion.div
          animate={{
            scale: [1, 0.8, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute top-1/2 left-1/2 w-2 h-2 ${
            colorClasses[color].replace('border-', 'bg-')
          } rounded-full transform -translate-x-1/2 -translate-y-1/2`}
        />
      </div>
    </div>
  );
}