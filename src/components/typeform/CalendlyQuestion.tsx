'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface CalendlyQuestionProps {
  value?: string;
  onChange: (value: string) => void;
  calendlyUrl?: string;
}

export default function CalendlyQuestion({
  value = '',
  onChange,
  calendlyUrl = 'https://calendly.com/your-schedule',
}: CalendlyQuestionProps) {
  const [isScheduled, setIsScheduled] = useState(!!value);

  useEffect(() => {
    setIsScheduled(!!value);
  }, [value]);

  const handleScheduleClick = () => {
    // In a real implementation, this would open Calendly in an iframe or popup
    // For demo purposes, we'll just mark it as scheduled
    setIsScheduled(true);
    onChange('scheduled');
  };

  const handleSkip = () => {
    onChange('skipped');
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      className="text-center space-y-8"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.6 }}
    >
      {!isScheduled ? (
        <>
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2 font-sans">
                Schedule a 15-minute call
              </h3>
              <p className="text-gray-400">
                This helps us ensure the retreat is a good fit for you and answer any questions.
              </p>
            </div>

            <motion.button
              onClick={handleScheduleClick}
              className="w-full bg-white text-black py-3 px-6 rounded-lg font-medium font-sans mb-4"
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              Open Calendar & Schedule
            </motion.button>
          </div>

          <motion.button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition-colors underline font-sans"
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
          >
            I&apos;ll schedule this later
          </motion.button>
        </>
      ) : (
        <motion.div
          className="bg-green-900 border border-green-700 rounded-lg p-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2 font-sans">
            Great! You&apos;re all set
          </h3>
          <p className="text-green-200">
            {value === 'scheduled' 
              ? "You&apos;ll receive a calendar invite shortly with the meeting details."
              : "You can schedule your call anytime by contacting us directly."
            }
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}