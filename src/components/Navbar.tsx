import React, { useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  
  const navItems = ['SERVICES', 'DEMOS', 'CONTACT'];

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsVisible(latest > window.innerHeight * 0.1);
    });
  }, [scrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          className="fixed w-full z-50 nav-blur py-4"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-6 flex justify-between items-center">
            <motion.a
              href="/"
              className="text-2xl font-light gradient-text"
              whileHover={{ scale: 1.05 }}
            >
              TRU SYNTH
            </motion.a>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-primary transition-colors tracking-wider text-sm"
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
              <motion.div className="h-4 w-[1px] bg-primary/30" />
              <motion.button
                onClick={() => navigate('/build')}
                className="px-6 py-2 border border-primary rounded-full text-primary hover:bg-primary hover:text-black transition-all tracking-wider text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                BUILD
              </motion.button>
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-90 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col items-center justify-center h-full space-y-8">
                {[...navItems, 'BUILD'].map((item) => (
                  <motion.a
                    key={item}
                    href={item === 'BUILD' ? '/build' : `#${item.toLowerCase()}`}
                    className={`text-2xl tracking-wider ${
                      item === 'BUILD'
                        ? 'px-8 py-2 border border-primary rounded-full text-primary'
                        : 'text-gray-300 hover:text-primary'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => {
                      setIsOpen(false);
                      if (item === 'BUILD') navigate('/build');
                    }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar;