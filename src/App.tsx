import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Synthos from './components/Synthos';
import Projects from './components/Projects';
import ScheduleConsultation from './components/ScheduleConsultation';
import BuildAssistants from './components/BuildAssistants';
import Contact from './components/Contact';
import CursorGlow from './components/CursorGlow';
import LoadingScreen from './components/LoadingScreen';
import WorkforceAugmentation from './pages/WorkforceAugmentation';
import SynthosPage from './pages/SynthosPage';
import AiRoleMapping from './pages/AiRoleMapping';
import BuildPage from './pages/BuildPage';

interface MainContentProps {
  onTranscriptionComplete: (text: string) => void;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  useEffect(() => {
    const forceScrollTop = () => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };

    forceScrollTop();

    const timer = setTimeout(() => {
      setIsLoading(false);
      requestAnimationFrame(() => {
        forceScrollTop();
        setTimeout(forceScrollTop, 100);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      document.documentElement.style.setProperty('--scroll-progress', latest.toString());
    });
  }, [scrollYProgress]);

  const handleTranscriptionComplete = (text: string) => {
    console.log('Transcription:', text);
    // Add any additional handling here
  };

  const MainContent: React.FC<MainContentProps> = ({ onTranscriptionComplete }) => (
    <motion.div
      key="content"
      className="relative min-h-screen overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }}
    >
      <CursorGlow />
      <Navbar />
      
      <motion.div 
        className="grid-pattern"
        style={{
          opacity,
          scale,
          rotate,
        }}
      />

      <main className="relative z-10">
        <Hero />
        <Services />
        <Synthos onTranscriptionComplete={onTranscriptionComplete} />
        <Projects />
        <ScheduleConsultation />
        <BuildAssistants />
        <Contact />
      </main>
    </motion.div>
  );

  return (
    <Router>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" />
        ) : (
          <Routes>
            <Route path="/" element={<MainContent onTranscriptionComplete={handleTranscriptionComplete} />} />
            <Route path="/workforce-augmentation" element={<WorkforceAugmentation />} />
            <Route path="/synthos" element={<SynthosPage />} />
            <Route path="/ai-role-mapping" element={<AiRoleMapping />} />
            <Route path="/build" element={<BuildPage />} />
          </Routes>
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;
