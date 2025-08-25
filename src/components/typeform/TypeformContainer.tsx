'use client';

import { AnimatePresence } from 'framer-motion';
import { useFormStore } from '@/store/form.store';
import { APPLICATION_FLOWS, ContactInfo } from '@/types/form.types';
import { useEffect, useState, useRef, useCallback } from 'react';
import FormQuestion from './FormQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TextInputQuestion from './TextInputQuestion';
import ContactMatrixQuestion from './ContactMatrixQuestion';
import CalendlyQuestion from './CalendlyQuestion';
import WelcomeScreen from './WelcomeScreen';

export default function TypeformContainer() {
  const {
    formState,
    setCurrentFlow,
    setAnswer,
    nextQuestion,
    previousQuestion,
    getCurrentQuestion,
    startForm,
  } = useFormStore();

  const [currentAnswer, setCurrentAnswer] = useState<string | string[] | ContactInfo>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTime = useRef(0);

  const currentQuestion = getCurrentQuestion();

  const handleStart = () => {
    startForm();
    setCurrentFlow(APPLICATION_FLOWS[0]);
  };

  useEffect(() => {
    // Load existing answer when question changes
    if (currentQuestion) {
      const existingAnswer = formState.answers.find(
        a => a.questionId === currentQuestion.id
      );
      if (existingAnswer) {
        setCurrentAnswer(existingAnswer.value);
      } else {
        setCurrentAnswer('');
      }
    }
  }, [currentQuestion, formState.answers]);

  const handleAnswerChange = (value: string | string[] | ContactInfo) => {
    setCurrentAnswer(value);
    if (currentQuestion) {
      setAnswer({
        questionId: currentQuestion.id,
        value,
      });
    }
  };

  const handleNext = () => {
    nextQuestion();
  };

  const handlePrev = () => {
    previousQuestion();
  };

  const isValid = () => {
    if (!currentQuestion) return false;
    
    if (!currentQuestion.required) return true;
    
    switch (currentQuestion.type) {
      case 'multiple_choice':
        return Array.isArray(currentAnswer) 
          ? currentAnswer.length > 0 
          : !!currentAnswer;
      case 'contact_matrix':
        return currentAnswer?.firstName && 
               currentAnswer?.lastName && 
               currentAnswer?.email;
      case 'calendly':
        return !!currentAnswer;
      default:
        return !!currentAnswer && currentAnswer.toString().trim().length > 0;
    }
  };

  const handleScroll = useCallback((event: WheelEvent) => {
    event.preventDefault();
    
    const now = Date.now();
    const timeSinceLastScroll = now - lastScrollTime.current;
    
    // Throttle scroll events to prevent rapid navigation
    if (timeSinceLastScroll < 500) return;
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set a small delay to debounce rapid scroll events
    scrollTimeoutRef.current = setTimeout(() => {
      if (event.deltaY > 0) {
        // Scrolling down - go to next step
        if (formState.currentQuestionIndex < (formState.currentFlow?.questions.length || 0) - 1) {
          if (isValid()) {
            nextQuestion();
            lastScrollTime.current = now;
          }
        }
      } else {
        // Scrolling up - go to previous step
        if (formState.currentQuestionIndex > 0) {
          previousQuestion();
          lastScrollTime.current = now;
        }
      }
    }, 50);
  }, [formState.currentQuestionIndex, formState.currentFlow, nextQuestion, previousQuestion, isValid]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !formState.isStarted || formState.isCompleted) return;

    container.addEventListener('wheel', handleScroll, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll, formState.isStarted, formState.isCompleted]);

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            options={currentQuestion.options || []}
            value={currentAnswer}
            onChange={handleAnswerChange}
            multiple={currentQuestion.id === 'retreat_dates'}
          />
        );
      case 'short_text':
      case 'long_text':
      case 'email':
      case 'phone':
      case 'website':
        return (
          <TextInputQuestion
            type={currentQuestion.type}
            value={currentAnswer}
            onChange={handleAnswerChange}
            placeholder={currentQuestion.placeholder}
          />
        );
      case 'contact_matrix':
        return (
          <ContactMatrixQuestion
            value={currentAnswer}
            onChange={handleAnswerChange}
          />
        );
      case 'calendly':
        return (
          <CalendlyQuestion
            value={currentAnswer}
            onChange={handleAnswerChange}
          />
        );
      default:
        return null;
    }
  };

  // Show welcome screen if form hasn't started
  if (!formState.isStarted) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (formState.isCompleted) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4 font-sans">
            Thank you!
          </h1>
          <p className="text-gray-400 text-lg">
            Your application has been submitted successfully.
          </p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div 
      ref={containerRef}
      className="min-h-screen overflow-hidden"
      style={{ height: '100vh' }}
    >
      <AnimatePresence mode="wait">
        <FormQuestion
          key={currentQuestion.id}
          question={currentQuestion}
          onNext={handleNext}
          onPrev={handlePrev}
          showPrevious={formState.currentQuestionIndex > 0}
          isValid={isValid()}
        >
          {renderQuestionInput()}
        </FormQuestion>
      </AnimatePresence>
    </div>
  );
}