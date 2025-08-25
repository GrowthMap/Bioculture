'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface MultipleChoiceQuestionProps {
  options: string[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
}

export default function MultipleChoiceQuestion({
  options,
  value,
  onChange,
  multiple = false,
}: MultipleChoiceQuestionProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    Array.isArray(value) ? value : value ? [value] : []
  );

  useEffect(() => {
    // Update local state when external value changes
    const newSelectedValues = Array.isArray(value) ? value : value ? [value] : [];
    setSelectedValues(newSelectedValues);
  }, [value]);

  const handleOptionClick = (option: string) => {
    let newValues: string[];
    if (multiple) {
      newValues = selectedValues.includes(option)
        ? selectedValues.filter(v => v !== option)
        : [...selectedValues, option];
    } else {
      newValues = [option];
    }
    
    setSelectedValues(newValues);
    onChange(multiple ? newValues : newValues[0] || '');
  };

  const optionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.02, backgroundColor: '#333333' },
    selected: { backgroundColor: '#ffffff', color: '#000000' },
  };

  return (
    <div className="space-y-4">
      {options.map((option, index) => {
        const isSelected = selectedValues.includes(option);
        const letterLabel = String.fromCharCode(65 + index); // A, B, C, etc.
        
        return (
          <motion.button
            key={option}
            onClick={() => handleOptionClick(option)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all font-sans ${
              isSelected
                ? 'bg-transparent text-white border-white'
                : 'bg-transparent text-white border-gray-500 hover:border-gray-400'
            }`}
            variants={optionVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            transition={{
              delay: index * 0.1,
              duration: 0.3,
              ease: 'easeOut',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded border-2 flex items-center justify-center text-sm font-bold ${
                  isSelected
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white border-gray-400'
                }`}>
                  {letterLabel}
                </div>
                <span className="text-lg">{option}</span>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="text-white text-xl"
                >
                  ✓
                </motion.div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}