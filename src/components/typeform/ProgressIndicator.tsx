'use client';

import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
  className = '',
}: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="h-1 bg-gray-800 relative">
        <motion.div
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
      
      <div className="absolute top-4 right-4 text-gray-400 text-sm font-sans">
        {currentStep} of {totalSteps}
      </div>
    </div>
  );
}