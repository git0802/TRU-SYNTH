import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import VoiceButton from './VoiceButton';
import TranscriptDisplay from './TranscriptDisplay';
import ErrorMessage from './ErrorMessage';
import RealtimeAPI from '../utils/realtimeApi';
import AudioProcessor from '../utils/audioProcessor';
import { AlertCircle } from 'lucide-react';

const TIMER_DURATION = 5 * 60;

interface SynthosProps {
  onTranscriptionComplete?: (text: string) => void;
}

const Synthos: React.FC<SynthosProps> = ({ onTranscriptionComplete }) => {
  const [isListening, setIsListening] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  
  const realtimeApiRef = useRef<RealtimeAPI | null>(null);
  const audioProcessorRef = useRef<AudioProcessor | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef<boolean>(false);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const checkAudioPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionGranted(true);
      setError(null);
    } catch (error) {
      setPermissionGranted(false);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setError('Microphone access denied. Please grant permission to use the microphone.');
        } else {
          setError(`Failed to access microphone: ${error.message}`);
        }
      }
    }
  };

  useEffect(() => {
    checkAudioPermission();
  }, []);

  useEffect(() => {
    const initAudio = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: 24000
          });
        }

        // Resume AudioContext on user interaction
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
          console.log('AudioContext resumed');
        }
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    };

    // Initialize on first user interaction
    const handleInteraction = () => {
      console.log('User interaction detected, initializing audio...');
      initAudio();
      document.removeEventListener('click', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    return () => document.removeEventListener('click', handleInteraction);
  }, []);

  const handleAudioData = async (audioBuffer: ArrayBuffer) => {
    console.log('Received audio data in Synthos, size:', audioBuffer.byteLength);
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 24000
      });
    }

    try {
      // Ensure AudioContext is running
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        console.log('AudioContext resumed');
      }

      audioQueueRef.current.push(audioBuffer);
      console.log('Added audio to queue, length:', audioQueueRef.current.length);
      
      if (!isPlayingRef.current) {
        await playNextAudio();
      }
    } catch (error) {
      console.error('Error handling audio data:', error);
    }
  };

  const playNextAudio = async () => {
    if (!audioContextRef.current || audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      return;
    }

    isPlayingRef.current = true;
    setIsPlaying(true);

    try {
      // Ensure AudioContext is running
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        console.log('AudioContext resumed');
      }

      const audioBuffer = audioQueueRef.current.shift()!;
      // Create a copy of the buffer to prevent "neutered ArrayBuffer" errors
      const bufferCopy = audioBuffer.slice(0);
      const audioData = await audioContextRef.current.decodeAudioData(bufferCopy);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioData;
      source.connect(audioContextRef.current.destination);
      
      // When this audio chunk ends, play the next one if available
      source.onended = () => {
        console.log('Finished playing audio chunk');
        playNextAudio(); // Play next chunk if available
      };

      console.log('Starting to play audio chunk');
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
      isPlayingRef.current = false;
      setIsPlaying(false);
      // Try to play next chunk even if this one failed
      playNextAudio();
    }
  };

  const handleStop = useCallback(() => {
    console.log('Stopping voice assistant...');
    
    if (audioProcessorRef.current) {
      audioProcessorRef.current.stop();
      audioProcessorRef.current = null;
    }

    if (realtimeApiRef.current) {
      realtimeApiRef.current.disconnect();
      realtimeApiRef.current = null;
    }

    // Clear audio queue and reset state
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsListening(false);
    setError(null);
  }, []);

  const handleClick = useCallback(async () => {
    if (isListening) {
      handleStop();
    } else {
      try {
        // Resume AudioContext if suspended
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
          console.log('AudioContext resumed');
        }

        // Initialize RealtimeAPI if not already initialized
        if (!realtimeApiRef.current) {
          const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
          if (!apiKey) {
            throw new Error('OpenAI API key not found');
          }

          realtimeApiRef.current = new RealtimeAPI({
            apiKey,
            onMessage: (text) => {
              console.log('Received message:', text);
              setResponse(prev => prev + text);
            },
            onAudio: handleAudioData,
            onTranscript: (text) => {
              console.log('Received transcript:', text);
              setTranscript(text);
              onTranscriptionComplete?.(text);
            },
            onError: (error) => {
              console.error('Realtime API error:', error);
              setError(error.message || 'An error occurred');
              handleStop();
            },
            onConnectionStatus: (status) => {
              setConnectionStatus(status);
              if (status === 'error') {
                setError('Connection error. Please try again.');
                handleStop();
              }
            }
          });

          // Connect to OpenAI
          await realtimeApiRef.current.connect();
        }

        // Initialize AudioProcessor if not already initialized
        if (!audioProcessorRef.current) {
          audioProcessorRef.current = new AudioProcessor(async (audioData: ArrayBuffer) => {
            try {
              if (realtimeApiRef.current) {
                await realtimeApiRef.current.sendAudio(audioData);
              }
            } catch (error) {
              console.error('Error sending audio:', error);
              setError('Error sending audio to OpenAI');
              handleStop();
            }
          });
        }

        // Start recording
        await audioProcessorRef.current.start();
        setIsListening(true);
        setError(null);
      } catch (error) {
        console.error('Error starting voice assistant:', error);
        setError(error instanceof Error ? error.message : 'Failed to start recording');
        handleStop();
      }
    }
  }, [isListening, handleStop, onTranscriptionComplete]);

  useEffect(() => {
    return () => {
      audioProcessorRef.current?.stop();
      realtimeApiRef.current?.disconnect();
    };
  }, []);

  if (permissionGranted === false) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Microphone Access Required</h3>
        <p className="text-gray-400 mb-4">
          Please allow microphone access to use the voice features.
          You can update your browser settings to grant permission.
        </p>
        <button
          onClick={checkAudioPermission}
          className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
        >
          Check Permission Again
        </button>
      </div>
    );
  }

  return (
    <section id="synthos" className="py-20 px-6 relative overflow-hidden">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        className="container mx-auto"
      >
        <motion.div
          className="text-center mb-16"
          initial={{ y: 20 }}
          animate={inView ? { y: 0 } : { y: 20 }}
        >
          <h2 className="text-5xl font-light gradient-text mb-6">DATA SYNTHESIS</h2>
          <p className="text-gray-400 text-lg font-light tracking-wide max-w-2xl mx-auto">
            Engage with our AI assistant to explore our advanced data synthesis capabilities
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
          <motion.div 
            className="w-[300px] h-[300px] rounded-full relative bg-black/30 backdrop-blur-lg border border-primary/20 flex items-center justify-center mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            <VoiceButton
              isListening={isListening}
              isPaused={isPaused}
              timeLeft={timeLeft}
              onClick={handleClick}
              disabled={timeLeft === 0 || connectionStatus === 'error' || !permissionGranted}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {error && <ErrorMessage message={error} />}

            {timeLeft === 0 ? (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-primary/50 text-sm tracking-wide"
              >
                Session limit reached. Please try again later.
              </motion.p>
            ) : isPaused ? (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-primary/50 text-sm tracking-wide"
              >
                Session paused. Time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <TranscriptDisplay
            transcript={transcript}
            response={response}
          />

          {isPlaying && <div className="text-green-500">Playing audio...</div>}
        </div>
      </motion.div>
    </section>
  );
};

export default Synthos;
