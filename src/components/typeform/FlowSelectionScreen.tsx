'use client';

import { motion } from 'framer-motion';
import { APPLICATION_FLOWS, FormFlow } from '@/types/form.types';

interface FlowSelectionScreenProps {
  onSelectFlow: (flow: FormFlow) => void;
}

export default function FlowSelectionScreen({ onSelectFlow }: FlowSelectionScreenProps) {
  const letters = ['A', 'B', 'C'];
  
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#222222] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-2xl mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="text-3xl md:text-4xl font-bold text-white mb-8 font-sans leading-tight"
        >
          Are you joining as a...*
        </motion.h1>
        
        <div className="space-y-4">
          {APPLICATION_FLOWS.map((flow, index) => (
            <motion.div
              key={flow.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (index * 0.1), duration: 0.5, ease: 'easeOut' }}
              className="bg-[#2a2a2a] hover:bg-[#545454] rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-all cursor-pointer group flex items-center gap-4"
              onClick={() => onSelectFlow(flow)}
            >
              <div className="w-8 h-8 bg-[#3a3a3a]  rounded border  border-gray-300 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-sm">
                  {letters[index]}
                </span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white group-hover:text-gray-100">
                  {flow.name}
                  {flow.name === 'Content Creator' && (
                    <span className="text-gray-400 font-normal"> (100K+ audience)</span>
                  )}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
          className="mt-8 flex justify-start"
        >
          <button className="bg-gray-200 text-black px-6 py-2 text-sm font-medium rounded hover:bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#222222]">
            OK
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}