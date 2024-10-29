import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Radio, Timer, Volume2, VolumeX } from 'lucide-react';
import RealtimeAPI from '../utils/realtimeApi';
import AudioProcessor from '../utils/audioProcessor';

interface VoiceAssistantProps {
  apiKey: string;
  onTranscriptionComplete?: (text: string) => void;
  timeLimit?: number;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ 
  apiKey,
  onTranscriptionComplete, 
  timeLimit = 300 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const realtimeApiRef = useRef<RealtimeAPI | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioProcessorRef = useRef<AudioProcessor | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isListening, isPaused, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleStop();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      handleStop();
    };
  }, []);

  useEffect(() => {
    // Initialize AudioContext on first user interaction
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContextClass({
          sampleRate: 24000
        });
        console.log('AudioContext initialized');
      }
    };

    document.addEventListener('click', initAudioContext, { once: true });
    return () => document.removeEventListener('click', initAudioContext);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const initializeAudio = async () => {
    try {
      if (!apiKey) {
        throw new Error('OpenAI API key not provided');
      }

      // Initialize Realtime API
      realtimeApiRef.current = new RealtimeAPI({
        apiKey,
        onMessage: (text) => {
          console.log('Received message:', text);
        },
        onAudio: async (audioBuffer) => {
          console.log('Received audio data, size:', audioBuffer.byteLength);
          if (!isMuted && audioContextRef.current) {
            try {
              if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
              }
              const audioData = await audioContextRef.current.decodeAudioData(audioBuffer.slice(0));
              const source = audioContextRef.current.createBufferSource();
              source.buffer = audioData;
              source.connect(audioContextRef.current.destination);
              source.start(0);
              console.log('Audio playback started');
            } catch (error) {
              console.error('Error playing audio:', error);
            }
          }
        },
        onTranscript: (text) => {
          console.log('Received transcript:', text);
          onTranscriptionComplete?.(text);
        },
        onError: (error) => {
          console.error('Realtime API error:', error);
          setError(error.message || 'An error occurred');
          handleStop();
        }
      });

      await realtimeApiRef.current.connect();

      // Initialize audio processor
      audioProcessorRef.current = new AudioProcessor((audioData) => {
        if (realtimeApiRef.current && isListening) {
          realtimeApiRef.current.sendAudio(audioData).catch(error => {
            console.error('Error sending audio:', error);
            setError('Failed to send audio data');
          });
        }
      });

      await audioProcessorRef.current.start();
      setIsListening(true);
      setIsPaused(false);

    } catch (error) {
      console.error('Error initializing audio:', error);
      throw error;
    }
  };

  const handleStart = async () => {
    if (timeLeft === 0) return;
    
    try {
      // Resume AudioContext if suspended
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
        console.log('AudioContext resumed');
      }

      await initializeAudio();
      setIsListening(true);
      console.log('Voice assistant started');
    } catch (error) {
      console.error('Error starting voice assistant:', error);
      setError(error instanceof Error ? error.message : 'Failed to start voice assistant');
    }
  };

  const handleStop = () => {
    console.log('Stopping voice assistant');
    setIsListening(false);
    setIsPaused(false);
    
    if (audioProcessorRef.current) {
      audioProcessorRef.current.stop();
    }
    
    if (realtimeApiRef.current) {
      realtimeApiRef.current.disconnect();
    }

    // Don't close AudioContext as it might be needed again
    console.log('Voice assistant stopped');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative">
      <motion.button
        className={`w-32 h-32 rounded-full flex items-center justify-center relative z-10 ${
          isListening ? 'bg-primary/20' : timeLeft === 0 ? 'bg-black/30 cursor-not-allowed' : 'bg-black/50'
        } border border-primary/30`}
        onClick={isListening ? handleStop : handleStart}
        whileHover={timeLeft > 0 ? { scale: 1.1 } : {}}
        whileTap={timeLeft > 0 ? { scale: 0.95 } : {}}
        disabled={timeLeft === 0}
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

      <motion.button
        className="absolute -right-2 -bottom-2 p-2 rounded-full bg-black/50 border border-primary/30"
        onClick={toggleMute}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-primary/70" />
        ) : (
          <Volume2 className="w-4 h-4 text-primary/70" />
        )}
      </motion.button>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-sm text-red-400 whitespace-nowrap"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default VoiceAssistant;
