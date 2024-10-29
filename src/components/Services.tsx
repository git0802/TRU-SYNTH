import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BrainCircuit, Bot, LineChart, Workflow, Network, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    title: 'Workforce Augmentation',
    description: 'Empower your workforce by delegating tasks to AI agents',
    icon: Bot,
    action: 'AGENTS',
    path: '/workforce-augmentation'
  },
  {
    title: 'SYNTHOS',
    description: 'AI-driven operating system designed to streamline your business operations',
    icon: BrainCircuit,
    action: 'LEARN',
    path: '/synthos'
  },
  {
    title: 'AI Role Mapping Consultancy',
    description: 'Identify key areas where AI can drive significant improvements',
    icon: LineChart,
    action: 'SCHEDULE',
    path: '/ai-role-mapping'
  }
];

const Services = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const handleActionClick = (path: string) => {
    navigate(path);
  };

  return (
    <section id="services" className="py-20 px-6">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="container mx-auto"
      >
        <motion.h2 
          className="text-5xl font-light text-center mb-16 gradient-text"
          variants={itemVariants}
        >
          OUR SERVICES
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="service-card p-8 rounded-lg"
              whileHover={{ y: -5 }}
            >
              <service.icon className="w-12 h-12 text-primary mb-6" />
              <h3 className="text-2xl font-light mb-4">{service.title}</h3>
              <p className="text-gray-400 mb-6">{service.description}</p>
              <motion.button 
                className="border border-primary px-6 py-2 rounded-full text-primary hover:bg-primary hover:text-black transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleActionClick(service.path)}
              >
                {service.action}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Services;