import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Bot, Send, Loader2 } from 'lucide-react';
import { generateResponse } from '../utils/openai';

interface Message {
  role: 'bot' | 'user' | 'system';
  content: string;
}

const BuildAssistants = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      content: 'Hello! I\'m an AI assistant specializing in custom AI agent development. How can I help you create your own AI solutions?' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'bot' ? 'assistant' : msg.role,
        content: msg.content
      }));

      const response = await generateResponse([...formattedMessages, userMessage]);
      
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: 'I apologize, but I encountered an error. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="build" className="py-32 px-6 relative">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        className="container mx-auto max-w-5xl"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: 20 }}
          animate={inView ? { y: 0 } : { y: 20 }}
        >
          <h2 className="text-5xl font-light gradient-text mb-6">BUILD YOUR AI ASSISTANTS</h2>
          <p className="text-gray-400 text-lg font-light tracking-wide mx-auto max-w-2xl">
            Create, train, and deploy custom AI agents tailored to your business needs. Our platform provides the tools to build intelligent assistants that understand your industry.
          </p>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
          className="relative h-[500px] bg-black/40 backdrop-blur-md rounded-lg border border-primary/20 overflow-hidden flex flex-col mb-12"
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-primary/20 flex items-center gap-3">
            <Bot className="w-5 h-5 text-primary" />
            <span className="text-sm font-light">AI Assistant</span>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
          >
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary/20 text-white'
                        : 'bg-black/50 border border-primary/20'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-primary"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Generating response...</span>
              </motion.div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-primary/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about creating AI assistants..."
                className="flex-1 bg-black/50 border border-primary/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary placeholder-gray-500"
                disabled={isLoading}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${
                  isLoading ? 'bg-primary/10 cursor-not-allowed' : 'bg-primary/20 hover:bg-primary/30'
                } rounded-lg p-2 transition-colors`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <motion.button
            className="group relative overflow-hidden bg-transparent border border-primary px-10 py-4 rounded-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background gradient animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            
            {/* Button content */}
            <div className="relative flex items-center justify-center gap-3">
              <span className="text-lg font-light tracking-[0.2em]">BUILD YOURS NOW</span>
              <ArrowRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default BuildAssistants;