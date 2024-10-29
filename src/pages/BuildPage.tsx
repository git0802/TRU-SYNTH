import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bot, Code, Users, Blocks, Cpu, ArrowRight, 
  Shield, Workflow, Layout, Building2, Network, LineChart,
  Infinity, CreditCard, Zap, Wrench, Linkedin, ArrowUpRight
} from 'lucide-react';
import Navbar from '../components/Navbar';

const X = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>
  </svg>
);

const footerSections = {
  products: {
    title: 'PRODUCTS',
    links: [
      { name: 'AI Workforce Platform', href: '#' },
      { name: 'GenAI Solutions', href: '#' },
      { name: 'Autonomous Agents', href: '#' }
    ]
  },
  company: {
    title: 'COMPANY',
    links: [
      { name: 'About', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Security', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Privacy', href: '#' }
    ]
  },
  resources: {
    title: 'RESOURCES',
    links: [
      { name: 'Documentation', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Events', href: '#' },
      { name: 'Research', href: '#' }
    ]
  },
  guides: {
    title: 'GUIDES',
    links: [
      { name: 'AI Implementation', href: '#' },
      { name: 'Model Training', href: '#' },
      { name: 'Enterprise Solutions', href: '#' },
      { name: 'Best Practices', href: '#' }
    ]
  }
};

const BuildPage = () => {
  const navigate = useNavigate();

  const enterpriseFeatures = [
    { icon: Shield, text: "Enterprise-Grade Security" },
    { icon: Building2, text: "Full Enterprise Integration" },
    { icon: Bot, text: "Custom AI Agent Development" },
    { icon: Layout, text: "Branded UI/UX Design" },
    { icon: Network, text: "Internal & Customer Solutions" },
    { icon: Workflow, text: "End-to-End Automation" },
    { icon: LineChart, text: "Analytics & Reporting" },
    { icon: Users, text: "Dedicated Support Team" }
  ];

  const selfBuildFeatures = [
    { icon: Infinity, text: "Unlimited Agents" },
    { icon: Wrench, text: "Unlimited Tools" },
    { icon: CreditCard, text: "Pay Only What You Use" },
    { icon: Zap, text: "200 Free Messages Monthly" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-32"
      >
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary hover:text-white transition-colors mb-12"
          whileHover={{ x: -4 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </motion.button>

        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.h1
            variants={itemVariants}
            className="text-6xl font-light gradient-text mb-6"
          >
            Choose Your Path
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-400"
          >
            Select how you'd like to create your AI assistants
          </motion.p>
        </motion.div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto mb-32">
          {/* Build with Us */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-lg blur-xl group-hover:blur-2xl transition-all opacity-50" />
            <div className="relative h-full p-8 rounded-lg bg-black/40 backdrop-blur-sm border border-primary/20 flex flex-col">
              {/* Content remains the same */}
              <div className="flex-1">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                
                <h2 className="text-3xl font-light mb-4">Build with Us</h2>
                <p className="text-gray-400 mb-8">
                  Enterprise-ready solutions built by our expert team. Get custom AI implementations tailored to your business needs with full support and integration.
                </p>

                {/* Enterprise Benefits */}
                <div className="mb-8">
                  <h3 className="text-xl font-light text-primary mb-4">Enterprise Benefits</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {enterpriseFeatures.map((item, index) => (
                      <motion.div
                        key={item.text}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <item.icon className="w-5 h-5 text-primary" />
                        <span className="text-gray-300 text-sm">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Key Points */}
                <div className="space-y-3 mb-8">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <h4 className="text-primary mb-2">Full-Stack Solutions</h4>
                    <p className="text-sm text-gray-400">Custom front-end and back-end development for internal tools and customer-facing applications.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <h4 className="text-primary mb-2">Enterprise Integration</h4>
                    <p className="text-sm text-gray-400">Seamless integration with your existing systems, databases, and workflows.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <h4 className="text-primary mb-2">Dedicated Support</h4>
                    <p className="text-sm text-gray-400">24/7 enterprise support with dedicated account management and technical assistance.</p>
                  </div>
                </div>
              </div>

              <motion.button
                className="w-full bg-primary text-black py-4 rounded-lg group overflow-hidden relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Contact Our Enterprise Team
                  <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Build it Yourself */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group relative"
          >
            {/* Content remains the same */}
            <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-transparent rounded-lg blur-xl group-hover:blur-2xl transition-all opacity-50" />
            <div className="relative h-full p-8 rounded-lg bg-black/40 backdrop-blur-sm border border-primary/20 flex flex-col">
              <div className="flex-1">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <Code className="w-8 h-8 text-primary" />
                </div>
                
                <h2 className="text-3xl font-light mb-4">Built to Grow with You</h2>
                
                {/* Pricing */}
                <div className="mb-8">
                  <div className="text-4xl font-light text-primary mb-2">
                    $0.07
                    <span className="text-lg text-gray-400">/message + tax</span>
                  </div>
                  <p className="text-gray-400">
                    200 free messages per month (excluding API costs)
                  </p>
                </div>

                <p className="text-gray-400 mb-8">
                  Enjoy 200 free messages on us. With Tru Synth Dev., effortlessly connect your API keys, create powerful Assistants, and scale your operations seamlessly.
                </p>

                <div className="space-y-4 mb-8">
                  {selfBuildFeatures.map((item, index) => (
                    <motion.div
                      key={item.text}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <item.icon className="w-5 h-5 text-primary" />
                      <span className="text-gray-300">{item.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Info */}
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 mb-8">
                  <p className="text-sm text-gray-400">
                    Monthly billing • No hidden fees • Cancel anytime
                  </p>
                </div>
              </div>

              <motion.button
                className="w-full border border-primary text-primary hover:bg-primary hover:text-black py-4 rounded-lg transition-colors group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <span className="flex items-center justify-center gap-2">
                  Start Building
                  <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Footer Section */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-primary/20 pt-20 relative"
        >
          {/* Blur Background */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
              {/* Brand Column */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-light gradient-text mb-4">TRU SYNTH</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Building the future of autonomous AI workforce solutions.
                </p>
                <div className="flex space-x-4">
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <X />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                </div>
              </div>

              {/* Navigation Columns */}
              {Object.entries(footerSections).map(([key, section], sectionIndex) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * sectionIndex }}
                >
                  <h3 className="text-sm tracking-wider text-gray-300 mb-4">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <motion.li
                        key={link.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * linkIndex }}
                      >
                        <motion.a
                          href={link.href}
                          className="text-sm text-gray-400 hover:text-primary flex items-center group"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          {link.name}
                          <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Bottom Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-16 pt-8 border-t border-primary/20 flex flex-col md:flex-row justify-between items-center"
            >
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 TRU Synth, Inc. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-primary text-sm transition-colors"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  Terms of Use
                </motion.a>
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-primary text-sm transition-colors"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  Privacy Policy
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default BuildPage;