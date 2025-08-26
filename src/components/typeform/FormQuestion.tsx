'use client';

import { motion } from 'framer-motion';
import { FormQuestion as FormQuestionType } from '@/types/form.types';
import { ReactNode, useEffect } from 'react';

interface FormQuestionProps {
	question: FormQuestionType;
	children: ReactNode;
	onNext?: () => void;
	isValid?: boolean;
}

export default function FormQuestion({
	question,
	children,
	onNext,
	isValid = false,
}: FormQuestionProps) {
	// Handle Enter key press (but not Shift + Enter)
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.key === 'Enter' && !event.shiftKey && isValid && onNext) {
				// Don't advance if user is in a textarea or input field
				const target = event.target as HTMLElement;
				if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
					return;
				}
				onNext();
			}
		};

		document.addEventListener('keydown', handleKeyPress);
		return () => document.removeEventListener('keydown', handleKeyPress);
	}, [isValid, onNext]);

	const questionVariants = {
		enter: {
			opacity: 0,
			y: 100,
		},
		center: {
			opacity: 1,
			y: 0,
		},
		exit: {
			opacity: 0,
			y: -100,
		},
	};

	const buttonVariants = {
		idle: { scale: 1, backgroundColor: '#333333' },
		hover: { scale: 1.02, backgroundColor: '#444444' },
		disabled: { scale: 1, backgroundColor: '#1a1a1a', opacity: 0.5 },
	};

	return (
		<div className="min-h-screen bg-[#222222] flex flex-col p-4">
			<div className="flex-1 flex items-center justify-center">
				<motion.div
					className={`w-full ${question.imageUrl ? 'max-w-6xl' : 'max-w-2xl'}`}
					initial="enter"
					animate="center"
					exit="exit"
					variants={questionVariants}
					transition={{ type: 'tween', duration: 0.7, ease: 'easeInOut' }}
				>
					<div className={`${question.imageUrl ? 'flex items-center gap-12' : ''}`}>
						<div className="flex-1">
							<div className="mb-8">
								<motion.h1
									className="text-2xl md:text-3xl font-bold text-white mb-4 font-sans"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2, duration: 0.6 }}
								>
									{question.title}
								</motion.h1>

								{question.description && (
									<motion.p
										className="text-gray-400 text-lg"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.3, duration: 0.6 }}
									>
										{question.description}
									</motion.p>
								)}
							</div>

							<motion.div
								className="mb-8 max-h-[60vh] overflow-y-auto pr-2"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4, duration: 0.6 }}
							>
								{children}
							</motion.div>

							<motion.div
								className="flex items-center gap-3.5 sticky bottom-0 bg-[#222222] pt-4"
								// initial={{ opacity: 0 }}
								// animate={{ opacity: 1 }}
								transition={{ delay: 0.6, duration: 0.6 }}
							>
								<motion.button
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.6, duration: 0.4, ease: 'easeOut' }}
									onClick={onNext}
									className="bg-white cursor-pointer text-black px-8 py-2 text-lg font-semibold rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#222222]"
								>
									OK
								</motion.button>
								<motion.button
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.8, duration: 0.4 }}
								>
									<span className="text-gray-400 text-sm">press Enter ↵</span>
								</motion.button>
							</motion.div>
						</div>
						
						{question.imageUrl && (
							<motion.div
								className="flex-1 flex items-center justify-center"
								initial={{ opacity: 0, x: 50 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.2, duration: 0.6 }}
							>
								<img 
									src={question.imageUrl} 
									alt="Question illustration"
									className="w-full h-full max-h-screen object-cover rounded-lg"
								/>
							</motion.div>
						)}
					</div>
				</motion.div>
			</div>
		</div>
	);
}
