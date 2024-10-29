import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 text-red-400 mb-4"
    >
      <AlertCircle className="w-4 h-4" />
      <span className="text-sm">{message}</span>
    </motion.div>
  );
};

export default ErrorMessage;