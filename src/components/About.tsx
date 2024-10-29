import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="about" className="py-20 px-6 relative">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        className="container mx-auto"
      >
        <motion.h2 
          className="text-5xl font-light text-center mb-16 gradient-text"
          initial={{ y: 20 }}
          animate={inView ? { y: 0 } : { y: 20 }}
        >
          ABOUT US
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ x: -50 }}
            animate={inView ? { x: 0 } : { x: -50 }}
            className="space-y-6"
          >
            <p className="text-xl text-gray-300">
              At TRU Synth, we automate complex business processes by synthesizing
              AI capabilities into cohesive digital solutions.
            </p>
            <p className="text-xl text-gray-300">
              Our flagship project, SYNTHOS, is a central system that manages all
              robotic and software operations within a business.
            </p>
            <p className="text-xl text-gray-300">
              The core mission is to provide Total Resource Unification Synthesis
              across all operations of an organization.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 50 }}
            animate={inView ? { x: 0 } : { x: 50 }}
            className="relative"
          >
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80"
                alt="AI Technology"
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;