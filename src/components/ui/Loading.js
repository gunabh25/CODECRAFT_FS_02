'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react'

const Loading = ({ size = 'default', text = 'Loading...' }) => {
  const sizes = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const dotVariants = {
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className={`${sizes[size]} border-2 border-blue-600 border-t-transparent rounded-full mb-4`}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 dark:text-gray-400 text-sm"
      >
        {text}
      </motion.div>
      <div className="flex space-x-1 mt-2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            variants={dotVariants}
            animate="animate"
            transition={{ delay: i * 0.2 }}
            className="w-1 h-1 bg-blue-600 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;