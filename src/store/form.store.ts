import { create } from 'zustand';
import { FormStore, FormState, FormAnswer, FormFlow } from '@/types/form.types';

const initialState: FormState = {
	currentQuestionIndex: 0,
	answers: [],
	currentFlow: null,
	isCompleted: false,
	isStarted: false,
	isSubmitting: false,
	submissionError: null,
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
			const { currentQuestionIndex, currentFlow, answers } = state.formState;
			if (!currentFlow) return state;

			const currentQuestion = currentFlow.questions[currentQuestionIndex];
			if (!currentQuestion) return state;
			console.log('before api calling');
			// Send contact info to API when moving away from contact_info question
			if (currentQuestion.id === 'contact_info') {

				const contactAnswer = answers.find(a => a.questionId === 'contact_info');
				console.log('Contact answer found:', contactAnswer);

				if (contactAnswer && contactAnswer.value) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const contactInfo = contactAnswer.value as any;
					console.log('Contact info value:', contactInfo);

					const payload = {
				firstName: contactInfo.firstName || '',
				lastName: contactInfo.lastName || '',
				email: contactInfo.email || '',
				phone: contactInfo.phone || '',
				website: contactInfo.website || '',
				applicationFlow: currentFlow.name || '',
				timestamp: new Date().toISOString()
					};

					console.log('API payload:', payload);

					// Send to API endpoint
					fetch('https://primary-production-968c.up.railway.app/webhook/personal-info-bioculture', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
					})
					.then(response => {
				console.log('API response status:', response.status);
				return response.json();
					})
					.then(data => {
				console.log('API response data:', data);
					})
					.catch(error => {
				console.error('Failed to send contact info to API:', error);
					});
				} else {
					console.log('No contact answer found or value is empty');
				}
			}

			// Check for conditional routing
			if (currentFlow.conditionalRouting) {
				const routingRule = currentFlow.conditionalRouting.find(
					rule => rule.fromQuestionId === currentQuestion.id
				);

				if (routingRule) {
					const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
					if (currentAnswer) {
						const condition = routingRule.conditions.find(
							c => c.answerValue === currentAnswer.value
						);

						if (condition) {
							// Find the index of the next question by ID
							const nextQuestionIndex = currentFlow.questions.findIndex(
								q => q.id === condition.nextQuestionId
							);

							if (nextQuestionIndex !== -1) {
								return {
									formState: {
										...state.formState,
										currentQuestionIndex: nextQuestionIndex,
										isCompleted: false,
									},
								};
							}
						}
					}
				}
			}

			// Default sequential navigation
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

	// Add a method to check if we should complete the flow based on the selected flow type
	shouldCompleteFlow: () => {
		const { currentQuestionIndex, currentFlow, answers } = get().formState;
		if (!currentFlow) return false;

		const currentQuestion = currentFlow.questions[currentQuestionIndex];
		if (!currentQuestion) return false;

		// Get the application type answer
		const appTypeAnswer = answers.find(a => a.questionId === 'application_type');
		if (!appTypeAnswer) return false;

		const appType = appTypeAnswer.value as string;

		// Define the last question for each flow type
		const lastQuestions = {
			'Brand Sponsor': 'brand_retreat_dates',
			'Guest': 'guest_retreat_dates', 
			'Content Creator (100k+ audience)': 'creator_retreat_dates'
		};

		return currentQuestion.id === lastQuestions[appType as keyof typeof lastQuestions];
	},

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

	completeForm: async () => {
		const { answers, currentFlow } = get().formState;

		console.log('🚀 completeForm called');
		console.log('📊 Current flow:', currentFlow?.name);
		console.log('📝 Number of answers:', answers.length);

		// Set submitting state
		set((state) => ({
			formState: { 
				...state.formState, 
				isSubmitting: true, 
				submissionError: null 
			},
		}));

		// Send all form data to the API endpoint
		if (currentFlow && answers.length > 0) {
			try {
				console.log('🌐 Starting API call to bioculture-application webhook...');
				console.log('📍 API Endpoint: https://primary-production-968c.up.railway.app/webhook/bioculture-application');

				// Prepare comprehensive payload with all answers
				const payload = {
					applicationFlow: currentFlow.name,
					flowId: currentFlow.id,
					answers: answers,
					submissionTimestamp: new Date().toISOString(),
					// Extract commonly used fields for easier processing
					contactInfo: answers.find(a => a.questionId === 'contact_info')?.value || null,
					companyWebsite: answers.find(a => a.questionId === 'company_website')?.value || null,
					instagramHandle: answers.find(a => 
						a.questionId === 'guest_instagram_handle' || 
						a.questionId === 'creator_instagram_handle'
					)?.value || null,
					retreatDates: answers.find(a => 
						a.questionId === 'brand_retreat_dates' || 
						a.questionId === 'guest_retreat_dates' || 
						a.questionId === 'creator_retreat_dates'
					)?.value || null,
					accommodationPreference: answers.find(a => a.questionId === 'accommodation_preference')?.value || null,
					sponsorshipOpportunities: answers.find(a => a.questionId === 'sponsorship_opportunities')?.value || null
				};

				console.log('📦 Complete form payload:', JSON.stringify(payload, null, 2));

				// Send to the correct bioculture-application endpoint
				console.log('📡 Making API call...');
				const startTime = Date.now();
				const response = await fetch('https://primary-production-968c.up.railway.app/webhook/bioculture-application', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload),
				});
				const endTime = Date.now();
				console.log(`⏱️ API call took ${endTime - startTime}ms`);

				console.log('📊 API Response status:', response.status);
				console.log('📊 API Response ok:', response.ok);

				if (!response.ok) {
					console.error('❌ API call failed with status:', response.status);
					throw new Error(`API call failed with status: ${response.status}`);
				}

				const data = await response.json();
				console.log('✅ Complete form API response data:', data);

				// Success: set completed state and redirect
				console.log('✅ API call successful! Setting completion state...');
				set((state) => ({
					formState: { 
						...state.formState, 
						isCompleted: true, 
						isSubmitting: false 
					},
				}));

				// Redirect to booking page after successful submission
				console.log('🔄 Preparing redirect in 2 seconds...');
				setTimeout(() => {
					console.log('🔗 Redirecting to booking page...');
					try {
						window.location.replace('https://web.biocultureretreats.com/book-your-vibe-check');
					} catch (error) {
						console.error('❌ Failed to redirect to booking page:', error);
						// Fallback to direct navigation
						window.location.replace('https://web.biocultureretreats.com/book-your-vibe-check');
					}
				}, 2000); // 2-second delay to show success message

			} catch (error) {
				console.error('❌ CRITICAL ERROR: Failed to send complete form data to API:', error);
				console.error('❌ Error details:', error.message);

				// Set error state
				set((state) => ({
					formState: { 
						...state.formState, 
						isSubmitting: false,
						submissionError: 'Failed to submit application. Please try again.'
					},
				}));
			}
		} else {
			console.log('⚠️ No form data to submit (missing flow or answers)');
			console.log('Current flow:', currentFlow);
			console.log('Answers count:', answers.length);
			
			// No data to submit, just complete
			set((state) => ({
				formState: { 
					...state.formState, 
					isCompleted: true,
					isSubmitting: false 
				},
			}));
		}
	},

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
