export interface FormQuestion {
	id: string;
	type: QuestionType;
	title: string;
	description?: string;
	required?: boolean;
	options?: string[];
	placeholder?: string;
	validation?: ValidationRule[];
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
	startForm: () => void;
	getCurrentQuestion: () => FormQuestion | null;
}

// Application-specific types based on the analyzed Typeform
export const APPLICATION_FLOWS: FormFlow[] = [
	{
		id: 'guest',
		name: 'Guest Application',
		questions: [
			{
				id: 'application_type',
				type: 'multiple_choice',
				title: 'Are you joining as a... *',
				required: true,
				options: [ 'Brand Sponsor', 'Guest','Content Creator (100k+ audience)' ]
			},
			{
				id: 'description',
				type: 'company_information',
				title: 'Bioculture Brand Application',
				description: 'Take your wellness brand to the moon with our exclusive retreats. Harness the power of brand campaigns and content collaborations, connecting you to our handpicked roster of high-level, conscious creators.',

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
				id: 'brand_information',
				type: 'short_text',
				title: 'Briefly describe your brand and its vibe*',
				placeholder: 'Type your answer here...',
				required: true,
				validation: [
					{
						type: 'required',
						message: 'Brand description is required'
					}
				]
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
				id: 'partnership_goals',
				type: 'long_text',
				title: 'What is your main goal/vision for this partnership?',
				placeholder: 'Type your answer here...',
				required: true,
				validation: [
					{
						type: 'required',
						message: 'Partnership goals are required'
					}
				]
			},
			{
				id: 'referral_source',
				type: 'short_text',
				title: 'Who referred you/how did you hear about Bioculture?',
				placeholder: 'Type your answer here...',
				required: false
			},
			{
				id: 'retreat_dates',
				type: 'multiple_choice',
				title: 'Which retreat dates work for you?',
				description: 'Select all that apply',
				required: true,
				options: [
					'March 15-22, 2024',
					'April 20-27, 2024',
					'May 25-June 1, 2024',
					'I\'m flexible with dates'
				]
			},
			{
				id: 'motivation',
				type: 'long_text',
				title: 'What draws you to this bioculture retreat experience?',
				placeholder: 'Share your motivation...',
				required: true
			},
			{
				id: 'schedule_call',
				type: 'calendly',
				title: 'Schedule a brief call to discuss your application',
				description: 'This helps us ensure the retreat is a good fit'
			}
		]
	}
];
