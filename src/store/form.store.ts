import { create } from 'zustand';
import { FormStore, FormState, FormAnswer, FormFlow } from '@/types/form.types';

const initialState: FormState = {
  currentQuestionIndex: 0,
  answers: [],
  currentFlow: null,
  isCompleted: false,
  isStarted: false,
};

export const useFormStore = create<FormStore>((set, get) => ({
  formState: initialState,

  setCurrentQuestionIndex: (index: number) =>
    set((state) => ({
      formState: { ...state.formState, currentQuestionIndex: index },
    })),

  setAnswer: (answer: FormAnswer) =>
    set((state) => {
      const existingAnswerIndex = state.formState.answers.findIndex(
        (a) => a.questionId === answer.questionId
      );
      
      let newAnswers;
      if (existingAnswerIndex >= 0) {
        newAnswers = [...state.formState.answers];
        newAnswers[existingAnswerIndex] = answer;
      } else {
        newAnswers = [...state.formState.answers, answer];
      }

      return {
        formState: {
          ...state.formState,
          answers: newAnswers,
        },
      };
    }),

  setCurrentFlow: (flow: FormFlow) =>
    set((state) => ({
      formState: {
        ...state.formState,
        currentFlow: flow,
        currentQuestionIndex: 0,
        answers: [],
        isCompleted: false,
        isStarted: true,
      },
    })),

  nextQuestion: () =>
    set((state) => {
      const { currentQuestionIndex, currentFlow } = state.formState;
      if (!currentFlow) return state;

      const nextIndex = currentQuestionIndex + 1;
      const isCompleted = nextIndex >= currentFlow.questions.length;

      return {
        formState: {
          ...state.formState,
          currentQuestionIndex: isCompleted ? currentQuestionIndex : nextIndex,
          isCompleted,
        },
      };
    }),

  previousQuestion: () =>
    set((state) => {
      const { currentQuestionIndex } = state.formState;
      const prevIndex = Math.max(0, currentQuestionIndex - 1);

      return {
        formState: {
          ...state.formState,
          currentQuestionIndex: prevIndex,
          isCompleted: false,
        },
      };
    }),

  completeForm: () =>
    set((state) => ({
      formState: { ...state.formState, isCompleted: true },
    })),

  resetForm: () => set({ formState: initialState }),

  startForm: () =>
    set((state) => ({
      formState: { ...state.formState, isStarted: true },
    })),

  getCurrentQuestion: () => {
    const { currentFlow, currentQuestionIndex } = get().formState;
    if (!currentFlow || currentQuestionIndex >= currentFlow.questions.length) {
      return null;
    }
    return currentFlow.questions[currentQuestionIndex];
  },
}));