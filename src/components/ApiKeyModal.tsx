import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, X } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim().startsWith('sk-')) {
      onSubmit(apiKey.trim());
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-black/80 border border-primary/20 rounded-lg p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-light text-primary">Enter OpenAI API Key</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 w-5 h-5" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-black/50 border border-primary/30 rounded-lg p-3 pl-12 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded p-4">
                <p className="text-sm text-gray-400">
                  Your API key can be found at:{' '}
                  <a
                    href="https://platform.openai.com/account/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    platform.openai.com/account/api-keys
                  </a>
                </p>
              </div>

              <button
                type="submit"
                disabled={!apiKey.trim().startsWith('sk-')}
                className="w-full bg-primary text-black py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save API Key
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ApiKeyModal;