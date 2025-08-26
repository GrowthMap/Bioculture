'use client';

import { AnimatePresence } from 'framer-motion';
import { useFormStore } from '@/store/form.store';
import {  ContactInfo } from '@/types/form.types';
import { useEffect, useState, useRef, useCallback } from 'react';
import FormQuestion from './FormQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TextInputQuestion from './TextInputQuestion';
import ContactMatrixQuestion from './ContactMatrixQuestion';
import CalendlyQuestion from './CalendlyQuestion';
import WelcomeScreen from './WelcomeScreen';
import FlowSelectionScreen from './FlowSelectionScreen';
import StepNavigator from './StepNavigator';
import { FormFlow } from '@/types/form.types';

export default function TypeformContainer() {
  const {
    formState,
    setCurrentFlow,
    setAnswer,
    nextQuestion,
    previousQuestion,
    getCurrentQuestion,
    startForm,
    shouldCompleteFlow,
    completeForm,
    clearSubmissionError,
  } = useFormStore();

  const [currentAnswer, setCurrentAnswer] = useState<string | string[] | ContactInfo>('');
  const [showFlowSelection, setShowFlowSelection] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTime = useRef(0);

  const currentQuestion = getCurrentQuestion();

  const handleStart = () => {
    setShowFlowSelection(true);
  };

  const handleFlowSelect = (flow: FormFlow) => {
    startForm();
    setCurrentFlow(flow);
    setShowFlowSelection(false);
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
    // First, save the current answer
    if (currentQuestion && currentAnswer) {
      setAnswer({
        questionId: currentQuestion.id,
        value: currentAnswer,
      });
    }
    
    // Check if this will be the last question after moving to next
    if (shouldCompleteFlow()) {
      console.log('🎯 Last question reached - triggering form completion...');
      console.log('📊 Current question:', getCurrentQuestion()?.id);
      console.log('📝 Total answers:', formState.answers.length);
      completeForm();
    } else {
      nextQuestion();
    }
  };

  const isValid = (): boolean => {
    if (!currentQuestion) return false;
    
    if (!currentQuestion.required) return true;
    
    switch (currentQuestion.type) {
      case 'multiple_choice':
        return Array.isArray(currentAnswer) 
          ? currentAnswer.length > 0 
          : !!currentAnswer;
      case 'contact_matrix':
        return typeof currentAnswer === 'object' && 
               currentAnswer !== null && 
               !Array.isArray(currentAnswer) &&
               Boolean((currentAnswer as ContactInfo).firstName) && 
               Boolean((currentAnswer as ContactInfo).lastName) && 
               Boolean((currentAnswer as ContactInfo).email);
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
            handleNext(); // Use handleNext instead of nextQuestion to include completion check
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
            value={currentAnswer as string | string[]}
            onChange={handleAnswerChange}
            multiple={['brand_retreat_dates', 'guest_retreat_dates', 'creator_retreat_dates', 'sponsorship_opportunities'].includes(currentQuestion.id)}
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
            value={currentAnswer as string}
            onChange={handleAnswerChange}
            placeholder={currentQuestion.placeholder}
          />
        );
      case 'contact_matrix':
        return (
          <ContactMatrixQuestion
            value={currentAnswer as ContactInfo}
            onChange={handleAnswerChange}
          />
        );
      case 'calendly':
        return (
          <CalendlyQuestion
            value={currentAnswer as string}
            onChange={handleAnswerChange}
          />
        );
      default:
        return null;
    }
  };

  // Show welcome screen if form hasn't started
  if (!formState.isStarted && !showFlowSelection) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  // Show flow selection screen
  if (showFlowSelection) {
    return <FlowSelectionScreen onSelectFlow={handleFlowSelect} />;
  }


  // Remove this block entirely - it causes redundant API calls

  // Handle form submission states
  if (formState.isSubmitting || formState.submissionError) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center p-4">
        <div className="text-center">
          {formState.isSubmitting && (
            <>
              <div className="w-12 h-12 border-4 border-gray-300 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
              <h1 className="text-4xl font-bold text-white mb-4 font-sans">
                Submitting your application...
              </h1>
              <p className="text-gray-400 text-lg">
                Please wait while we process your information.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div 
      ref={containerRef}
      className="min-h-screen overflow-hidden relative"
      style={{ height: '100vh' }}
    >
      <AnimatePresence mode="wait">
        <FormQuestion
          key={currentQuestion.id}
          question={currentQuestion}
          onNext={handleNext}
          isValid={isValid()}
        >
          {renderQuestionInput()}
        </FormQuestion>
      </AnimatePresence>
      <StepNavigator />
    </div>
  );
}