import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, ArrowLeft, Users, Cpu, Brain } from 'lucide-react';
import Navbar from '../components/Navbar';

const WorkforceAugmentation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-6 py-32"
      >
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary hover:text-white transition-colors mb-12"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </motion.button>

        {/* Header */}
        <div className="mb-16">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl font-light gradient-text mb-6"
          >
            Workforce Augmentation
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl"
          >
            Enhance your team's capabilities with AI-powered digital workers that seamlessly integrate into your existing workflows.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Bot,
              title: "Autonomous Agents",
              description: "AI workers that can handle complex tasks independently"
            },
            {
              icon: Users,
              title: "Team Integration",
              description: "Seamless collaboration between human and AI workforce"
            },
            {
              icon: Brain,
              title: "Adaptive Learning",
              description: "AI agents that learn and improve from team interactions"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="p-8 rounded-lg bg-black/40 border border-primary/20 backdrop-blur-sm"
            >
              <feature.icon className="w-12 h-12 text-primary mb-6" />
              <h3 className="text-2xl font-light mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Demo Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-lg overflow-hidden relative"
        >
          <div className="aspect-video bg-black/60 border border-primary/20 rounded-lg p-8 flex items-center justify-center">
            <p className="text-primary text-xl">Interactive Demo Coming Soon</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WorkforceAugmentation;