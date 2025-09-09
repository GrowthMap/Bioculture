import { create } from 'zustand';
import { FormStore, FormState, FormAnswer, FormFlow } from '@/types/form.types';
import { getCampaignData } from '@/utils/campaign-tracking';

const initialState: FormState = {
	currentQuestionIndex: 0,
	answers: [],
	currentFlow: null,
	isCompleted: false,
	isStarted: false,
	isSubmitting: false,
	submissionError: null,
	contactInfoSent: false,
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
				contactInfoSent: false,
			},
		})),

	nextQuestion: () =>
		set((state) => {
			const { currentQuestionIndex, currentFlow, answers, contactInfoSent } = state.formState;
			if (!currentFlow) return state;

			const currentQuestion = currentFlow.questions[currentQuestionIndex];
			if (!currentQuestion) return state;
			console.log('before api calling');
			// Get campaign data from localStorage
			const campaignData = getCampaignData() || {};
			// Send contact info to API when moving away from contact_info question (only once)
			if (currentQuestion.id === 'contact_info' && !contactInfoSent) {

				const contactAnswer = answers.find(a => a.questionId === 'contact_info');
				console.log('Contact answer found:', contactAnswer);

				if (contactAnswer && contactAnswer.value) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const contactInfo = contactAnswer.value as any;
					console.log('Contact info value:', contactInfo);

					const payload = {
				firstName: contactInfo.firstName || 'The user did not fill in that field',
				lastName: contactInfo.lastName || 'The user did not fill in that field',
				email: contactInfo.email || 'The user did not fill in that field',
				phone: contactInfo.phone || 'The user did not fill in that field',
				applicationFlow: currentFlow.name || '',
				timestamp: new Date().toISOString(),
				...campaignData,
					};

					console.log('API payload:', payload);

					// Mark as sent immediately to prevent duplicate calls
					state.formState.contactInfoSent = true;

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
				// Don't reset the flag on error to prevent retries on every scroll
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
		const { currentQuestionIndex, currentFlow } = get().formState;
		if (!currentFlow) return false;

		const currentQuestion = currentFlow.questions[currentQuestionIndex];
		if (!currentQuestion) return false;

		// Define the last question for each flow type using flow name
		const lastQuestions = {
			'Brand Sponsor': 'brand_retreat_dates',
			'Guest': 'guest_retreat_dates', 
			'Content Creator': 'creator_retreat_dates'
		};
		console.log(currentQuestion.id , lastQuestions[currentFlow.name as keyof typeof lastQuestions], 'shouldCompleteFlow check');

		return currentQuestion.id === lastQuestions[currentFlow.name as keyof typeof lastQuestions];
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

				// Prepare comprehensive payload with all questions from the flow
				const answersWithTitles = currentFlow.questions.map((question, index) => {
					// Skip description-only questions (company_information type)
					if (question.type === 'company_information') {
						return null;
					}
					
					// Find the user's answer for this question
					const userAnswer = answers.find(a => a.questionId === question.id);
					let processedValue = userAnswer?.value;
					
					// Handle empty or missing values
					if (!processedValue || 
						(typeof processedValue === 'string' && processedValue.trim() === '') ||
						(Array.isArray(processedValue) && processedValue.length === 0) ||
						(typeof processedValue === 'object' && processedValue !== null && Object.keys(processedValue).length === 0)) {
						processedValue = 'The user did not fill in that field';
					}
					
					// Handle contact info object with empty fields
					if (typeof processedValue === 'object' && processedValue !== null && !Array.isArray(processedValue)) {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const contactInfo = processedValue as any;
						if (contactInfo.firstName !== undefined || contactInfo.lastName !== undefined || 
							contactInfo.email !== undefined || contactInfo.phone !== undefined) {
							processedValue = {
								firstName: contactInfo.firstName || 'The user did not fill in that field',
								lastName: contactInfo.lastName || 'The user did not fill in that field',
								email: contactInfo.email || 'The user did not fill in that field',
								phone: contactInfo.phone || 'The user did not fill in that field',
								website: contactInfo.website || 'The user did not fill in that field'
							};
						}
					}
					
					return {
						questionId: index + 1,
						questionTitle: question.title,
						value: processedValue
					};
				}).filter(item => item !== null); // Remove null entries (company_information questions)

				// Get campaign data from localStorage
				const campaignData = getCampaignData() || {};

				const payload = {
					applicationFlow: currentFlow.name,
					flowId: currentFlow.id,
					answers: answersWithTitles,
					submissionTimestamp: new Date().toISOString(),
					...campaignData,
					// Extract commonly used fields for easier processing
					// contactInfo: answers.find(a => a.questionId === 'contact_info')?.value || null,
					// companyWebsite: answers.find(a => a.questionId === 'company_website')?.value || null,
					// instagramHandle: answers.find(a => 
					// a.questionId === 'guest_instagram_handle' || 
					// a.questionId === 'creator_instagram_handle'
					// )?.value || null,
					// retreatDates: answers.find(a => 
					// a.questionId === 'brand_retreat_dates' || 
					// a.questionId === 'guest_retreat_dates' || 
					// a.questionId === 'creator_retreat_dates'
					// )?.value || null,
					accommodationPreference: answers.find(a => a.questionId === 'accommodation_preference')?.value || null,
				};

				console.log('📦 Complete form payload:', JSON.stringify(payload, null, 2));
				localStorage.setItem('payload', JSON.stringify(payload));
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
				console.log('🔄 Preparing redirect in 100 milliseconds...');
				console.log('🔗 Redirecting to booking page...');
				try {
					window.location.replace('https://web.biocultureretreats.com/book-your-vibe-check');
				} catch (error) {
					console.error('❌ Failed to redirect to booking page:', error);
					// Fallback to direct navigation
					window.location.replace('https://web.biocultureretreats.com/book-your-vibe-check');
				}

			} catch (error) {
				console.error('❌ CRITICAL ERROR: Failed to send complete form data to API:', error);


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

	clearSubmissionError: () =>
		set((state) => ({
			formState: { 
				...state.formState, 
				submissionError: null,
				isSubmitting: false
			},
		})),

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
