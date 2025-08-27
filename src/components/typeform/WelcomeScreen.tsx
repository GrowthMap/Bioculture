'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onStart();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [onStart]);

  return (
    <div className="bg-[#222222] flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center max-w-3xl mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="text-3xl md:text-4xl font-bold text-white mb-6 font-sans leading-tight"
        >
          Something special is brewing at Bioculture
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
          className="text-xl md:text-2xl text-gray-300 mb-12 font-sans"
        >
         {`We're stoked to have you on board`}
        </motion.p>

        <div className="flex items-center justify-center gap-4">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4, ease: 'easeOut' }}
            onClick={onStart}
            className="bg-white text-black px-8 py-3.5 text-lg font-semibold rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#222222]"
          >
            Start
          </motion.button>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="text-gray-500 text-sm"
          >
            {'Press '}
            <kbd className="bg-gray-700 text-white px-2 py-1 rounded text-xs">
              Enter
            </kbd>
            {' to start'}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}