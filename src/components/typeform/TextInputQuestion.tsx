'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TextInputQuestionProps {
  type?: 'short_text' | 'long_text' | 'email' | 'phone' | 'website';
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TextInputQuestion({
  type = 'short_text',
  value = '',
  onChange,
  placeholder = 'Type your answer here...',
}: TextInputQuestionProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
  };

  const inputVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    focus: { scale: 1.02, borderColor: '#ffffff' },
  };

  const getInputProps = () => {
    switch (type) {
      case 'email':
        return { type: 'email', placeholder: 'your.email@example.com' };
      case 'phone':
        return { type: 'tel', placeholder: '+1 (555) 123-4567' };
      case 'website':
        return { type: 'url', placeholder: 'https://yourwebsite.com' };
      default:
        return { type: 'text', placeholder };
    }
  };

  const inputProps = getInputProps();

  return (
    <motion.div
      className="relative"
      variants={inputVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.6 }}
    >
      {type === 'long_text' ? (
        <motion.textarea
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={inputProps.placeholder}
          rows={6}
          className={`w-full p-4 bg-transparent border-2 rounded-lg text-white text-lg font-sans resize-none focus:outline-none transition-all ${
            isFocused ? 'border-white' : 'border-gray-600'
          } placeholder:text-gray-500`}
          animate={isFocused ? 'focus' : 'animate'}
          variants={inputVariants}
        />
      ) : (
        <motion.input
          {...inputProps}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full p-4 bg-transparent border-2 rounded-lg text-white text-lg font-sans focus:outline-none transition-all ${
            isFocused ? 'border-white' : 'border-gray-600'
          } placeholder:text-gray-500`}
          animate={isFocused ? 'focus' : 'animate'}
          variants={inputVariants}
        />
      )}
      
      {isFocused && (
        <motion.div
          className="absolute -bottom-2 left-4 right-4 h-0.5 bg-white"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}