'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ContactInfo } from '@/types/form.types';

interface ContactMatrixQuestionProps {
	value?: ContactInfo;
	onChange: (value: ContactInfo) => void;
}

export default function ContactMatrixQuestion({
	value = {},
	onChange,
}: ContactMatrixQuestionProps) {
	const [contactInfo, setContactInfo] = useState<ContactInfo>(value);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	useEffect(() => {
		setContactInfo(value);
	}, [value]);

	const updateField = (field: keyof ContactInfo, fieldValue: string) => {
		const newContactInfo = { ...contactInfo, [field]: fieldValue };
		setContactInfo(newContactInfo);
		onChange(newContactInfo);
	};

	const fields = [
		{ key: 'firstName' as keyof ContactInfo, label: 'First Name', type: 'text', placeholder: 'Your first name' },
		{ key: 'lastName' as keyof ContactInfo, label: 'Last Name', type: 'text', placeholder: 'Your last name' },
		{ key: 'email' as keyof ContactInfo, label: 'Email', type: 'email', placeholder: 'your.email@example.com' },
		{ key: 'phone' as keyof ContactInfo, label: 'Phone', type: 'tel', placeholder: '+1 (555) 123-4567' },
	];

	const containerVariants = {
		initial: { opacity: 0 },
		animate: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const fieldVariants = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
	};

	return (
		<motion.div
			className="space-y-8 px-[2px]"
			variants={containerVariants}
			initial="initial"
			animate="animate"
		>
			{fields.map(({ key, label, type, placeholder }) => (
				<motion.div key={key} variants={fieldVariants} className="relative mb-4">
					<motion.label
						className={`block text-sm font-medium mb-2 font-sans transition-colors ${
							focusedField === key ? 'text-white' : 'text-gray-400'
						}`}
						animate={{ color: focusedField === key ? '#ffffff' : '#9ca3af' }}
					>
						{label}
						{(key === 'firstName' || key === 'lastName' || key === 'email') && (
							<span className="text-red-400 ml-1">*</span>
						)}
					</motion.label>

					<motion.input
						type={type}
						value={contactInfo[key] || ''}
						onChange={(e) => updateField(key, e.target.value)}
						onFocus={() => setFocusedField(key)}
						onBlur={() => setFocusedField(null)}
						placeholder={placeholder}
						className={`w-full px-4 py-5 mx-1 bg-transparent border-2 rounded-lg text-white text-lg font-sans focus:outline-none transition-all ${
							focusedField === key ? 'border-white shadow-lg' : 'border-gray-600'
						} placeholder:text-gray-500 hover:border-gray-400`}
						whileFocus={{ scale: 1.005 }}
						transition={{ type: 'spring', stiffness: 300, damping: 30 }}
					/>

					{focusedField === key && (
						<motion.div
							className="absolute -bottom-2 left-4 right-4 h-0.5 bg-white"
							initial={{ scaleX: 0 }}
							animate={{ scaleX: 1 }}
							transition={{ duration: 0.3 }}
						/>
					)}
				</motion.div>
			))}
		</motion.div>
	);
}
