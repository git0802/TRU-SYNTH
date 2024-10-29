import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Radio, Timer } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  isPaused: boolean;
  timeLeft: number;
  onClick: () => void;
  disabled: boolean;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  isPaused,
  timeLeft,
  onClick,
  disabled
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.button
      className={`w-32 h-32 rounded-full flex items-center justify-center relative z-10 ${
        isListening ? 'bg-primary/20' : timeLeft === 0 ? 'bg-black/30 cursor-not-allowed' : 'bg-black/50'
      } border border-primary/30`}
      onClick={onClick}
      whileHover={timeLeft > 0 && !disabled ? { scale: 1.1 } : {}}
      whileTap={timeLeft > 0 && !disabled ? { scale: 0.95 } : {}}
      disabled={disabled || timeLeft === 0}
    >
      <AnimatePresence mode="wait">
        {isListening ? (
          <motion.div
            key="listening"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex flex-col items-center"
          >
            <Radio className="w-10 h-10 text-primary animate-pulse" />
            <span className="text-xs text-primary/70 mt-2">{formatTime(timeLeft)}</span>
          </motion.div>
        ) : (
          <motion.div
            key="not-listening"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex flex-col items-center"
          >
            {timeLeft > 0 ? (
              <>
                <Mic className="w-10 h-10 text-primary/70" />
                {isPaused && <Timer className="w-4 h-4 text-primary/50 mt-2" />}
              </>
            ) : (
              <Timer className="w-10 h-10 text-primary/30" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/30"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default VoiceButton;