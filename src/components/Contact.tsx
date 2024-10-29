import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Linkedin, ArrowUpRight } from 'lucide-react';

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

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <footer ref={ref} className="py-20 px-6 border-t border-primary/20 relative">
      {/* Blur Background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12"
        >
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
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <X />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Navigation Columns */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-sm tracking-wider text-gray-300 mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-primary flex items-center group"
                      whileHover={{ x: 4 }}
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.2 }}
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
            >
              Terms of Use
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-400 hover:text-primary text-sm transition-colors"
              whileHover={{ x: 2 }}
            >
              Privacy Policy
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Contact;