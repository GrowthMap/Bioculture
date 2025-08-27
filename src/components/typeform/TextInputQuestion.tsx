'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TextInputQuestionProps {
  type?: 'short_text' | 'long_text' | 'email' | 'phone' | 'website';
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
}

export default function TextInputQuestion({
  type = 'short_text',
  value = '',
  onChange,
  placeholder = 'Type your answer here...',
  onSubmit,
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Allow Shift + Enter for new lines in textarea
    if (event.key === 'Enter' && event.shiftKey && type === 'long_text') {
      // Allow default behavior (new line)
      return;
    }
    // Handle Enter key press to trigger form submission
    if (event.key === 'Enter') {
      event.preventDefault();
      if (onSubmit) {
        onSubmit();
      }
    }
  };

  const inputVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    focus: { scale: 1.005, borderColor: '#ffffff' },
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
      className="relative px-[2px] mb-4"
      variants={inputVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.6 }}
    >
      {type === 'long_text' ? (
        <motion.textarea
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={inputProps.placeholder}
          rows={6}
          className={`w-full px-4 py-5 mx-1 bg-transparent border-2 rounded-lg text-white text-lg font-sans resize-none focus:outline-none transition-all ${
            isFocused ? 'border-white shadow-lg' : 'border-gray-600'
          } placeholder:text-gray-500 hover:border-gray-400`}
          animate={isFocused ? 'focus' : 'animate'}
          variants={inputVariants}
        />
      ) : (
        <motion.input
          {...inputProps}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-5 mx-1 bg-transparent border-2 rounded-lg text-white text-lg font-sans focus:outline-none transition-all ${
            isFocused ? 'border-white shadow-lg' : 'border-gray-600'
          } placeholder:text-gray-500 hover:border-gray-400`}
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