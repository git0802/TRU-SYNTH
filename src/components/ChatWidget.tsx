import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Minimize2 } from 'lucide-react';

interface Message {
  type: 'bot' | 'user';
  content: string;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', content: 'Hello! I\'m your AI assistant demo. Ask me anything about creating custom AI agents.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setMessages(prev => [...prev, { type: 'user', content: inputValue }]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'I understand you\'re interested in AI assistants. Our platform allows you to create custom agents tailored to your specific needs. Would you like to know more about our capabilities?'
      }]);
    }, 1000);
  };

  return (
    <div className={`fixed bottom-8 right-8 z-50 ${isOpen ? 'w-[400px]' : 'w-auto'}`}>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: '500px' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="bg-black/90 backdrop-blur-lg border border-primary/20 rounded-lg h-full flex flex-col"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-primary/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                <span className="text-sm font-light">AI Assistant Demo</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary/20 text-white'
                        : 'bg-black/50 border border-primary/20'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-primary/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-black/50 border border-primary/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="bg-primary/20 hover:bg-primary/30 rounded-lg p-2 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="bg-primary text-black p-4 rounded-full hover:bg-primary/90 transition-colors shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bot className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;