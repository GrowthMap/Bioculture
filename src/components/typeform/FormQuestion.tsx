'use client';

import { motion } from 'framer-motion';
import { FormQuestion as FormQuestionType } from '@/types/form.types';
import { ReactNode } from 'react';

interface FormQuestionProps {
  question: FormQuestionType;
  children: ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  showPrevious?: boolean;
  isValid?: boolean;
}

export default function FormQuestion({
  question,
  children,
  onNext,
  onPrev,
  showPrevious = false,
  isValid = false,
}: FormQuestionProps) {
  const questionVariants = {
    enter: {
      opacity: 0,
      y: 100,
    },
    center: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -100,
    },
  };

  const buttonVariants = {
    idle: { scale: 1, backgroundColor: '#333333' },
    hover: { scale: 1.02, backgroundColor: '#444444' },
    disabled: { scale: 1, backgroundColor: '#1a1a1a', opacity: 0.5 },
  };

  return (
    <div className="min-h-screen bg-[#222222] flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl"
        initial="enter"
        animate="center"
        exit="exit"
        variants={questionVariants}
        transition={{ type: 'tween', duration: 0.7, ease: 'easeInOut' }}
      >
        <div className="mb-8">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-white mb-4 font-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {question.title}
          </motion.h1>
          
          {question.description && (
            <motion.p
              className="text-gray-400 text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {question.description}
            </motion.p>
          )}
        </div>

        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {children}
        </motion.div>

        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {showPrevious ? (
            <motion.button
              onClick={onPrev}
              className="px-6 py-3 text-white border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ← Previous
            </motion.button>
          ) : (
            <div />
          )}

          <motion.button
            onClick={onNext}
            disabled={!isValid}
            className={`px-8 py-3 rounded-lg font-medium text-white transition-all ${
              isValid
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
            variants={buttonVariants}
            initial="idle"
            whileHover={isValid ? 'hover' : 'disabled'}
            whileTap={isValid ? { scale: 0.98 } : {}}
            animate={isValid ? 'idle' : 'disabled'}
          >
            Continue →
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}