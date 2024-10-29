import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

const installationPhases = [
  { text: "Initializing Core Systems", duration: 300 },
  { text: "Loading Neural Networks", duration: 250 },
  { text: "Calibrating Quantum Processors", duration: 200 },
  { text: "Installing AI Modules", duration: 180 },
  { text: "Configuring Neural Links", duration: 160 },
  { text: "Optimizing Data Streams", duration: 140 },
  { text: "Establishing Secure Connections", duration: 120 },
  { text: "Loading Interface Components", duration: 100 },
  { text: "Synthesizing UI Elements", duration: 80 },
  { text: "Finalizing Installation", duration: 60 }
];

const buildPhases = [
  { text: "Building Frontend Components", duration: 150 },
  { text: "Compiling Stylesheets", duration: 130 },
  { text: "Optimizing Assets", duration: 110 },
  { text: "Initializing Runtime", duration: 90 },
  { text: "Launching Application", duration: 70 }
];

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [currentStage, setCurrentStage] = useState('install'); // 'install' or 'build'
  const [showLogo, setShowLogo] = useState(false);
  const [fadeOutLogo, setFadeOutLogo] = useState(false);

  useEffect(() => {
    let currentProgress = 0;
    const phases = currentStage === 'install' ? installationPhases : buildPhases;
    
    const progressInterval = setInterval(() => {
      currentProgress += 0.5;
      setProgress(Math.min(currentProgress, 100));

      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        if (currentStage === 'install') {
          setCurrentStage('build');
          setProgress(0);
          setCurrentPhase(0);
        } else {
          setTimeout(() => setShowLogo(true), 500);
          setTimeout(() => setFadeOutLogo(true), 2000);
        }
      }
    }, 20);

    const phaseInterval = setInterval(() => {
      setCurrentPhase(prev => {
        const nextPhase = prev + 1;
        if (nextPhase >= phases.length) {
          clearInterval(phaseInterval);
          return prev;
        }
        return nextPhase;
      });
    }, phases[currentPhase]?.duration || 200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
    };
  }, [currentStage]);

  const phases = currentStage === 'install' ? installationPhases : buildPhases;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        filter: "blur(10px)",
        scale: 1.1
      }}
      transition={{
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Background Canvas */}
      <div className="absolute inset-0">
        <Canvas>
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />
          <ambientLight intensity={0.1} />
        </Canvas>
      </div>

      {/* Loading Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <AnimatePresence mode="wait">
          {!showLogo ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Installation Progress */}
              <div className="space-y-4">
                <motion.div
                  className="h-[2px] w-full bg-primary/20 overflow-hidden rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-full bg-primary"
                    style={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 50 }}
                  />
                </motion.div>

                <div className="flex justify-between text-xs text-primary/60">
                  <span>{Math.round(progress)}%</span>
                  <span>{currentStage === 'install' ? 'Installing' : 'Building'}</span>
                </div>
              </div>

              {/* Phase Display */}
              <div className="space-y-4">
                {phases.slice(Math.max(0, currentPhase - 2), currentPhase + 1).map((phase, index) => (
                  <motion.div
                    key={phase.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: index === phases.slice(Math.max(0, currentPhase - 2), currentPhase + 1).length - 1 ? 1 : 0.3, y: 0 }}
                    className="text-center"
                  >
                    <p className="text-sm text-primary/80 font-light tracking-wider">
                      {phase.text}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Processing Animation */}
              <motion.div
                className="flex justify-center space-x-2"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 bg-primary rounded-full"
                    animate={{
                      y: ["0%", "-50%", "0%"],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: fadeOutLogo ? 0 : 1,
                scale: fadeOutLogo ? 1.2 : 1,
                filter: fadeOutLogo ? "blur(10px)" : "blur(0px)"
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
              className="flex justify-center items-center"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="280"
                height="280"
                viewBox="0 0 210 210"
                className="w-48 h-48"
                animate={{
                  filter: [
                    "drop-shadow(0 0 20px rgba(146, 132, 102, 0.5))",
                    "drop-shadow(0 0 40px rgba(146, 132, 102, 0.8))",
                    "drop-shadow(0 0 20px rgba(146, 132, 102, 0.5))",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                dangerouslySetInnerHTML={{
                  __html: `<path stroke-linecap="butt" transform="matrix(0.610987, 0, 0, 0.610987, 18.946883, 129.681863)" fill="none" stroke-linejoin="miter" d="M 22.374125 38.87435 C 22.374125 40.338425 22.911166 41.502013 23.99164 42.371508 C 25.072115 43.234609 26.619304 43.669356 28.6396 43.669356 C 30.653502 43.669356 32.187904 43.343296 33.236412 42.691175 C 34.291314 42.039054 34.821961 41.086446 34.821961 39.820565 C 34.821961 39.072544 34.547048 38.420423 34.003613 37.870595 C 33.460179 37.320768 32.168724 36.802907 30.129248 36.317013 L 25.091295 35.147032 C 21.907411 34.399011 19.746462 33.376076 18.59566 32.078228 C 17.444858 30.780379 16.875851 28.990244 16.875851 26.707821 C 16.875851 24.035404 17.822066 21.855274 19.720888 20.154646 C 21.626104 18.454017 24.471141 17.603702 28.275179 17.603702 C 32.047251 17.603702 34.911468 18.562704 36.861437 20.467919 C 38.8178 22.373135 39.802374 24.610805 39.815161 27.174535 L 33.875747 27.174535 C 33.741486 25.723246 33.172479 24.617198 32.181511 23.862784 C 31.190543 23.101976 29.732861 22.724769 27.808465 22.724769 C 26.26767 22.724769 25.020968 23.038043 24.074754 23.677377 C 23.128539 24.316711 22.655432 25.179812 22.655432 26.26668 C 22.655432 27.021095 22.860019 27.641249 23.281979 28.139929 C 23.697547 28.63861 24.368848 28.996637 25.295882 29.226797 L 33.210839 31.18316 C 36.068663 31.880034 38.044205 32.883789 39.131074 34.194424 C 40.217942 35.505059 40.761376 37.135361 40.761376 39.098117 C 40.761376 42.320361 39.642541 44.743438 37.411265 46.360953 C 35.173595 47.978469 32.405278 48.78403 29.09992 48.78403 C 24.829168 48.78403 21.651677 47.876175 19.561055 46.054073 C 17.476825 44.238364 16.428317 41.840861 16.428317 38.87435 Z M 87.675717 47.997649 L 81.486962 47.997649 L 81.486962 36.822087 L 71.257615 18.390083 L 78.546025 18.390083 L 84.690026 31.25988 L 90.552721 18.390083 L 97.559823 18.390083 L 87.675717 36.898807 Z M 148.182303 18.390083 L 153.942704 18.390083 L 153.942704 47.997649 L 147.753949 47.997649 L 135.670533 26.874048 L 135.593813 26.874048 L 135.593813 47.997649 L 129.807839 47.997649 L 129.807839 18.390083 L 136.335441 18.390083 L 148.099189 39.015004 L 148.182303 39.015004 Z M 201.739326 47.997649 L 195.556965 47.997649 L 195.556965 23.62623 L 186.61268 23.62623 L 186.61268 18.390083 L 210.702791 18.390083 L 210.702791 23.62623 L 201.739326 23.62623 Z M 267.296652 18.390083 L 267.296652 47.997649 L 261.11429 47.997649 L 261.11429 34.725071 L 249.555129 34.725071 L 249.555129 47.997649 L 243.372767 47.997649 L 243.372767 18.390083 L 249.555129 18.390083 L 249.555129 29.610398 L 261.11429 29.610398 L 261.11429 18.390083 Z M 267.296652 18.390083 " stroke="#928466" stroke-width="0.9283" stroke-opacity="1" stroke-miterlimit="4"/>
                  <g fill="#fcfdfe" fill-opacity="1">
                    <g transform="translate(11.123307, 132.982862)">
                      <g>
                        <path d="M 21.109375 -52.359375 L 0.390625 -52.359375 L 0.390625 -67.5 L 60.84375 -67.5 L 60.84375 -52.359375 L 40.203125 -52.359375 L 40.203125 0 L 21.109375 0 Z M 21.109375 -52.359375 "/>
                      </g>
                    </g>
                  </g>
                  <g fill="#fcfdfe" fill-opacity="1">
                    <g transform="translate(62.033301, 132.982862)">
                      <g>
                        <path d="M 36.25 -17.9375 L 25.84375 -17.9375 L 25.84375 0 L 6.75 0 L 6.75 -67.5 L 37.609375 -67.5 C 43.710938 -67.5 49.015625 -66.484375 53.515625 -64.453125 C 58.015625 -62.429688 61.484375 -59.539062 63.921875 -55.78125 C 66.367188 -52.019531 67.59375 -47.597656 67.59375 -42.515625 C 67.59375 -37.628906 66.453125 -33.367188 64.171875 -29.734375 C 61.890625 -26.109375 58.625 -23.269531 54.375 -21.21875 L 68.9375 0 L 48.5 0 Z M 48.3125 -42.515625 C 48.3125 -45.671875 47.3125 -48.113281 45.3125 -49.84375 C 43.320312 -51.582031 40.367188 -52.453125 36.453125 -52.453125 L 25.84375 -52.453125 L 25.84375 -32.6875 L 36.453125 -32.6875 C 40.367188 -32.6875 43.320312 -33.535156 45.3125 -35.234375 C 47.3125 -36.941406 48.3125 -39.367188 48.3125 -42.515625 Z M 48.3125 -42.515625 "/>
                      </g>
                    </g>
                  </g>
                  <g fill="#fcfdfe" fill-opacity="1">
                    <g transform="translate(123.06761, 132.982862)">
                      <g>
                        <path d="M 37.890625 1.34375 C 27.867188 1.34375 20.078125 -1.382812 14.515625 -6.84375 C 8.953125 -12.3125 6.171875 -20.054688 6.171875 -30.078125 L 6.171875 -67.5 L 25.265625 -67.5 L 25.265625 -30.65625 C 25.265625 -19.863281 29.539062 -14.46875 38.09375 -14.46875 C 46.570312 -14.46875 50.8125 -19.863281 50.8125 -30.65625 L 50.8125 -67.5 L 69.609375 -67.5 L 69.609375 -30.078125 C 69.609375 -20.054688 66.828125 -12.3125 61.265625 -6.84375 C 55.710938 -1.382812 47.921875 1.34375 37.890625 1.34375 Z M 37.890625 1.34375 "/>
                      </g>
                    </g>
                  </g>`
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;