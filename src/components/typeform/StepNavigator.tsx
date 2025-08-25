'use client';

import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useFormStore } from '@/store/form.store';

export default function StepNavigator() {
  const { formState, nextQuestion, previousQuestion } = useFormStore();
  
  const canGoNext = formState.currentQuestionIndex < (formState.currentFlow?.questions.length || 0) - 1;
  const canGoPrev = formState.currentQuestionIndex > 0;

  const handleNext = () => {
    if (canGoNext) {
      nextQuestion();
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      previousQuestion();
    }
  };

  // Only show navigator if form is started and not completed
  if (!formState.isStarted || formState.isCompleted) {
    return null;
  }

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50">
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-0 flex flex-col overflow-hidden">
        <button
          onClick={handlePrev}
          disabled={!canGoPrev}
          className={`p-4 transition-all duration-200 ${
            canGoPrev 
              ? 'hover:bg-gray-50 text-gray-600 hover:text-gray-800 active:bg-gray-100' 
              : 'text-gray-300 cursor-not-allowed'
          }`}
          aria-label="Previous question"
        >
          <ChevronUpIcon className="w-6 h-6" />
        </button>
        
        <div className="w-full h-px bg-gray-150" />
        
        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className={`p-4 transition-all duration-200 ${
            canGoNext 
              ? 'hover:bg-gray-50 text-gray-600 hover:text-gray-800 active:bg-gray-100' 
              : 'text-gray-300 cursor-not-allowed'
          }`}
          aria-label="Next question"
        >
          <ChevronDownIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}