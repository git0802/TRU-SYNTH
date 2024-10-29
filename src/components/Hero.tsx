import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const messages = [
  "Hire your first\ndigital co-worker",
  "Build your autonomous\nworkflows",
  "Create your own\nAI platform",
  "Scale with digital\nworkforce",
  "Transform your\nbusiness operations"
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="h-screen relative flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full"
      >
        <div className="h-[300px] relative [perspective:1000px] [transform-style:preserve-3d]">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentIndex}
              initial={{ 
                opacity: 0,
                rotateX: -90,
                y: 20,
              }}
              animate={{ 
                opacity: 1,
                rotateX: 0,
                y: 0,
              }}
              exit={{ 
                opacity: 0,
                rotateX: 90,
                y: -20,
              }}
              transition={{ 
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="text-[5vw] md:text-[4.5vw] font-extralight leading-none tracking-tight absolute w-full text-center"
            >
              {messages[currentIndex].split('\n').map((line, i) => (
                <motion.span
                  key={i}
                  className="block whitespace-nowrap gradient-text py-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.2,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  {line}
                </motion.span>
              ))}
            </motion.h1>
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ 
          y: [0, 10, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <ChevronDown className="text-primary w-8 h-8 opacity-50 hover:opacity-100 transition-opacity" />
      </motion.div>
    </section>
  );
};

export default Hero;