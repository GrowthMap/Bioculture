'use client';

import { useEffect } from 'react';
import { useFormStore } from '@/store/form.store';
import { APPLICATION_FLOWS } from '@/types/form.types';
import TypeformContainer from './TypeformContainer';

export default function ContentCreatorForm() {
	const { setCurrentFlow, startForm, formState, resetForm } = useFormStore();

	useEffect(() => {
		// Reset form state and start content creator flow directly
		resetForm();
		const contentCreatorFlow = APPLICATION_FLOWS.find(flow => flow.id === 'content_creator_application');
		if (contentCreatorFlow) {
			startForm();
			setCurrentFlow(contentCreatorFlow);
		}
	}, [setCurrentFlow, startForm, resetForm]);

	// Only render if we have started and have a flow
	if (!formState.isStarted || !formState.currentFlow) {
		return (
			<div className="min-h-[calc(100vh-80px)] bg-[#222222] flex items-center justify-center p-4">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-gray-300 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
					<h1 className="text-4xl font-bold text-white mb-4 font-sans">
						Loading Content Creator Application...
					</h1>
				</div>
			</div>
		);
	}

	return <TypeformContainer />;
}