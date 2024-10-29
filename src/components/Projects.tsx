import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink } from 'lucide-react';

const projects = [
  {
    title: "Neural Dashboard",
    description: "Real-time analytics interface with neural network visualization",
    image: "https://images.unsplash.com/photo-1581472723648-909f4851d4ae?auto=format&fit=crop&q=80&w=800&h=400",
    tags: ["Analytics", "Neural Networks", "Real-time"],
    link: "#demo-1"
  },
  {
    title: "Autonomous Agent Hub",
    description: "Central control interface for managing AI workforce",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=400",
    tags: ["Automation", "AI Agents", "Management"],
    link: "#demo-2"
  },
  {
    title: "Data Synthesis Lab",
    description: "Advanced data processing and synthesis platform",
    image: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&q=80&w=800&h=400",
    tags: ["Data Processing", "Synthesis", "Analysis"],
    link: "#demo-3"
  },
  {
    title: "Enterprise AI Suite",
    description: "Comprehensive AI tools for enterprise operations",
    image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=800&h=400",
    tags: ["Enterprise", "AI Tools", "Operations"],
    link: "#demo-4"
  },
  {
    title: "Quantum Interface",
    description: "Next-generation quantum computing interface",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800&h=400",
    tags: ["Quantum", "Interface", "Computing"],
    link: "#demo-5"
  }
];

const ProjectCard = React.memo(({ project, index, inView }) => (
  <motion.div
    key={project.title}
    className="relative w-[300px] h-[400px] flex-shrink-0 group"
    initial={{ opacity: 0, y: 20 }}
    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
  >
    <div className="absolute inset-0 rounded-lg overflow-hidden">
      {/* Image Container */}
      <div className="h-[180px] overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>
      {/* Black Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-transparent" />
    </div>

    {/* Content Container */}
    <div className="relative z-20 h-full p-6">
      <div className="mt-[160px]">
        <h3 className="text-2xl font-light mb-3 gradient-text transform transition-transform duration-300 ease-out group-hover:-translate-y-1">
          {project.title}
        </h3>
        
        <p className="text-gray-300 mb-4 text-sm line-clamp-2">{project.description}</p>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span 
              key={tag} 
              className="px-2 py-0.5 text-xs bg-primary/10 border border-primary/20 rounded-full text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        <a
          href={project.link}
          className="inline-flex items-center space-x-2 text-primary hover:text-white transition-colors group text-sm"
        >
          <span className="transform transition-transform duration-300 group-hover:translate-x-1">View Demo</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  </motion.div>
));

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerRef = useRef(null);
  const dragX = useMotionValue(0);
  const dragXSmooth = useSpring(dragX, { 
    damping: 40,
    stiffness: 300,
    mass: 0.8
  });

  const calculateDragConstraints = () => {
    if (!containerRef.current) return { left: 0, right: 0 };
    const containerWidth = containerRef.current.scrollWidth;
    const viewportWidth = containerRef.current.offsetWidth;
    return { left: -(containerWidth - viewportWidth), right: 0 };
  };

  return (
    <section className="py-32 px-6">
      <div ref={ref} className="container mx-auto">
        <div className="text-center mb-24">
          <motion.h2 
            className="text-5xl font-light gradient-text mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            PRODUCT DEMOS
          </motion.h2>
          <motion.p
            className="text-gray-400 text-lg font-light tracking-wide max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore our portfolio of successful implementations and cutting-edge AI solutions
          </motion.p>
        </div>

        <div className="relative overflow-hidden pt-4">
          <motion.div
            ref={containerRef}
            className="flex space-x-6 pl-12 cursor-grab active:cursor-grabbing will-change-transform"
            style={{ 
              x: dragXSmooth,
              touchAction: 'none'
            }}
            drag="x"
            dragConstraints={calculateDragConstraints()}
            dragElastic={0.1}
            dragTransition={{ power: 0.3, timeConstant: 200 }}
            initial={false}
          >
            {projects.map((project, index) => (
              <ProjectCard 
                key={project.title}
                project={project}
                index={index}
                inView={inView}
              />
            ))}
          </motion.div>

          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default Projects;