import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TranscriptDisplayProps {
  transcript: string;
  response: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript, response }) => {
  return (
    <AnimatePresence>
      {(transcript || response) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full mt-8 space-y-4"
        >
          {transcript && (
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-primary/20">
              <h3 className="text-sm text-primary/70 mb-2">Transcript</h3>
              <p className="text-gray-300">{transcript}</p>
            </div>
          )}
          
          {response && (
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-primary/20">
              <h3 className="text-sm text-primary/70 mb-2">Response</h3>
              <p className="text-gray-300">{response}</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TranscriptDisplay;