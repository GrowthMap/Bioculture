export interface FormQuestion {
	id: string;
	type: QuestionType;
	title: string;
	description?: string;
	required?: boolean;
	options?: string[];
	placeholder?: string;
	validation?: ValidationRule[];
	imageUrl?: string;
}

export type QuestionType = 
	| 'multiple_choice'
	| 'short_text'
	| 'long_text'
	| 'email'
	| 'phone'
	| 'website'
	| 'contact_matrix'
	| 'company_information'
	| 'calendly';

export interface ValidationRule {
	type: 'required' | 'email' | 'phone' | 'url' | 'minLength' | 'maxLength';
	value?: string | number;
	message: string;
}

export interface FormAnswer {
	questionId: string;
	value: string | string[] | ContactInfo;
}

export interface ContactInfo {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	website?: string;
}

export interface FormFlow {
	id: string;
	name: string;
	questions: FormQuestion[];
	conditionalRouting?: ConditionalRoute[];
}

export interface ConditionalRoute {
	fromQuestionId: string;
	conditions: Array<{
		answerValue: string | string[];
		nextQuestionId: string;
	}>;
}

export interface FormState {
	currentQuestionIndex: number;
	answers: FormAnswer[];
	currentFlow: FormFlow | null;
	isCompleted: boolean;
	isStarted: boolean;
	isSubmitting: boolean;
	submissionError: string | null;
}

export interface FormStore {
	formState: FormState;
	setCurrentQuestionIndex: (index: number) => void;
	setAnswer: (answer: FormAnswer) => void;
	setCurrentFlow: (flow: FormFlow) => void;
	nextQuestion: () => void;
	previousQuestion: () => void;
	completeForm: () => void;
	resetForm: () => void;
	clearSubmissionError: () => void;
	startForm: () => void;
	getCurrentQuestion: () => FormQuestion | null;
	shouldCompleteFlow: () => boolean;
}

// Application-specific types based on the analyzed Typeform
export const APPLICATION_FLOWS: FormFlow[] = [
	{
		id: 'brand_sponsor_application',
		name: 'Brand Sponsor',
		questions: [
			{
				id: 'description',
				type: 'company_information',
				title: 'Bioculture Brand Application',
				description: 'Take your wellness brand to the moon with our exclusive retreats. Harness the power of brand campaigns and content collaborations, connecting you to our handpicked roster of high-level, conscious creators.'
			},
			{
				id: 'contact_info',
				type: 'contact_matrix',
				title: 'Let\'s get your contact information',
				required: true
			},
			{
				id: 'company_website',
				type: 'website',
				title: 'What is your company\'s website?*',
				placeholder: 'https://',
				required: true,
				validation: [
					{
						type: 'required',
						message: 'Website is required'
					},
					{
						type: 'url',
						message: 'Please enter a valid URL'
					}
				]
			},
			{
				id: 'brand_description',
				type: 'long_text',
				title: 'Briefly describe your brand and its vibe',
				placeholder: 'Type your answer here...',
				required: true
			},
			{
				id: 'sponsorship_experience',
				type: 'long_text',
				title: 'Have you sponsored similar events or collaborated with creators in the past?',
				description: 'If yes, please provide details',
				placeholder: 'Type your answer here...',
				required: false
			},
			{
				id: 'sponsorship_opportunities',
				type: 'multiple_choice',
				title: 'Which sponsorship opportunities are you interested in?',
				description: 'Choose as many as you like',
				required: true,
				imageUrl: 'https://images.typeform.com/images/h9NEkaivUSZV/image/default-firstframe.png',
				options: [
					"Micro-dose",
					"Therapeutic-dose", 
					"Heroic-dose"
				]
			},
			{
				id: 'partnership_vision',
				type: 'long_text',
				title: 'What is your main goal/vision for this partnership?',
				placeholder: 'Type your answer here...',
				required: true
			},
			{
				id: 'brand_referral_source',
				type: 'long_text',
				title: 'Who referred you/how did you hear about Bioculture?',
				placeholder: 'Type your answer here...',
				required: false
			},
			{
				id: 'brand_retreat_dates',
				type: 'multiple_choice',
				title: 'We have monthly retreats in Mexico\nWhich dates are you interested in? (we also provide accommodation one day before/after retreat)',
				description: 'Choose as many as you like',
				required: true,
				options: [
					"Oct 2025 (3 in Mexico)",
					"Nov 2025 (Mexico)",
					"Feb 2026 (Mexico)",
					"March 2026 (2 in Guatemala)",
					"May 2026 (Costa Rica)",
					"July 2026 (Costa Rica)"
				]
			}
		]
	},
	{
		id: 'guest_application',
		name: 'Guest',
		questions: [
			{
				id: 'description',
				type: 'company_information',
				title: 'Bioculture Guest Application',
				description: 'Join us as a special guest at our exclusive wellness creator retreats! This application is your opportunity to share more about yourself, and how you\'ll contribute to the vibe of our collective talent at Bioculture retreats.'
			},
			{
				id: 'contact_info',
				type: 'contact_matrix',
				title: 'Let\'s get your contact information',
				required: true
			},
			{
				id: 'guest_instagram_handle',
				type: 'short_text',
				title: 'What is your Instagram handle?',
				placeholder: 'Type your answer here...',
				required: false
			},
			{
				id: 'guest_referral_source',
				type: 'long_text',
				title: 'Who referred you/how did you hear about Bioculture?* ',
				description: '(please be specific)',
				placeholder: 'Type your answer here...',
				required: true,
				validation: [
					{
						type: 'required',
						message: 'Referral source is required'
					}
				]
			},
			{
				id: 'professional_background',
				type: 'long_text',
				title: 'Briefly introduce yourself and your professional background* ',
				placeholder: 'Type your answer here...',
				required: true,
				validation: [
					{
						type: 'required',
						message: 'Professional background is required'
					}
				]
			},
			{
				id: 'application_inspiration',
				type: 'long_text',
				title: 'With 30% of our guests being content creators and 70% being other attendees, what inspired you to apply to our retreats?',
				placeholder: 'Type your answer here...',
				required: false
			},
			{
				id: 'accommodation_preference',
				type: 'multiple_choice',
				title: 'We have different options for your accommodation* ',
				description: ' Which one are you interested in? (room rates are charged per guest)',
				required: true,
				options: [
					"$2,700 - Shared Quad Room",
					"$3,350 - Shared Double Room",
					"$4,000 - Private Room",
					"$5,000 - Private Room for 2",
					"$5,000 - Private Modern Casita"
				]
			},
			{
				id: 'guest_retreat_dates',
				type: 'multiple_choice',
				title: 'We have monthly retreats in Mexico\nWhich dates are you interested in? (additional retreats will be updated - TBD)',
				description: 'Choose as many as you like',
				required: true,
				options: [
					"October 26-30 Conscious Cannabis & Movement Retreat (Mexico)",
					"November 17-21 Life, Love, Longevity Retreat (Mexico)",
					"Feb 2-6 2026 X-GAMES Adventure Retreat (Guatemala)",
					"Feb 9-12 2026 Digital Nomad Citadel Week (Guatemala)",
					"March 2-6 2026 Unlocking Your True Identity Retreat (Guatemala)",
					"March 9-13 2026 Sacred Polarity Retreat (Guatemala)",
					"May 18-22 2026 Costume Retreat (Guatemala)"
				]
			}
		]
	},
	{
		id: 'content_creator_application',
		name: 'Content Creator',
		questions: [
			{
				id: 'description',
				type: 'company_information',
				title: 'Bioculture Talent Application',
				description: 'We\'re looking for content creators with over 100k Instagram followers looking to collaborate with wellness brands and other like-minded creators.'
			},
			{
				id: 'contact_info',
				type: 'contact_matrix',
				title: 'Let\'s get your contact information',
				required: true
			},
			{
				id: 'creator_instagram_handle',
				type: 'short_text',
				title: 'What is your Instagram handle?* ',
				description: ' 100k followers or more (unless your engagement ROCKS!)',
				placeholder: 'Type your answer here...',
				required: true,
				validation: [
					{
						type: 'required',
						message: 'Instagram handle is required'
					}
				]
			},
			{
				id: 'creator_referral_source',
				type: 'long_text',
				title: 'Who referred you/how did you hear about Bioculture?',
				placeholder: 'Type your answer here...',
				required: false
			},
			{
				id: 'online_presence',
				type: 'long_text',
				title: 'Briefly introduce yourself and describe your online presence',
				description: '(content niche, audience demographics)',
				placeholder: 'Type your answer here...',
				required: true
			},
			{
				id: 'wellness_brand_experience',
				type: 'long_text',
				title: 'Have you worked with wellness brands or attended similar events in the past?',
				description: 'If yes, please provide details',
				placeholder: 'Type your answer here...',
				required: false
			},
			{
				id: 'current_brand_affiliations',
				type: 'long_text',
				title: 'Are you currently affiliated with any brands?',
				description: 'If yes, please list them',
				placeholder: 'Type your answer here...',
				required: false
			},
			{
				id: 'selection_reason',
				type: 'long_text',
				title: 'We have a long waiting list…\nGive us a reason why we should pick you? <3',
				placeholder: 'Type your answer here...',
				required: true
			},
			{
				id: 'creator_retreat_dates',
				type: 'multiple_choice',
				title: 'We have monthly retreats in Mexico\nWhich dates are you interested in? (we also provide accommodation one day before/after retreat)',
				description: 'Choose as many as you like',
				required: true,
				options: [
					"Oct 2025 (3 in Mexico)",
					"Nov 2025 (Mexico)",
					"Dec 2025 (Columbia)",
					"Feb 2026 (Mexico)",
					"March 2026 (2 in Guatemala)",
					"May 2026 (Costa Rica)",
					"July 2026 (Costa Rica)"
				]
			}
		]
	}
];
