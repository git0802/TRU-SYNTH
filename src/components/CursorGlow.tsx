import React, { useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, Stars } from '@react-three/drei';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const SynthesisBackground = () => {
  const mouseRef = useRef({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const rotationX = useTransform(scrollYProgress, [0, 1], [0, Math.PI / 2]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.2]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-2]">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Environment preset="night" />
        <ambientLight intensity={0.1} />
        <Float
          speed={2}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <GridPlane 
            rotation={rotationX} 
            scale={scale} 
            opacity={opacity}
            mouseRef={mouseRef}
          />
          <StarField mouseRef={mouseRef} />
          <GlowingParticles 
            count={200} 
            scale={scale}
            mouseRef={mouseRef}
          />
        </Float>
        <Effects />
      </Canvas>
    </div>
  );
};

const StarField = ({ mouseRef }) => {
  const starsRef = useRef();

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.x = mouseRef.current.y * 0.2;
      starsRef.current.rotation.y = mouseRef.current.x * 0.2;
    }
  });

  return (
    <group ref={starsRef}>
      <Stars
        radius={100}
        depth={100}
        count={2000}
        factor={2}
        saturation={0.5}
        fade
        speed={0.5}
      />
    </group>
  );
};

const GridPlane = ({ rotation, scale, opacity, mouseRef }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotation.get();
      meshRef.current.rotation.y = mouseRef.current.x * 0.1;
      meshRef.current.scale.setScalar(scale.get());
      meshRef.current.material.opacity = opacity.get();
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 40, 20, 20]} />
      <meshStandardMaterial
        color="#928466"
        wireframe
        transparent
        opacity={0.3}
        emissive="#928466"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

const GlowingParticles = ({ count, scale, mouseRef }) => {
  const points = useRef();
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      // Color
      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.1 + 0.05, 0.5, 0.7);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Size
      sizes[i] = Math.random() * 2;
    }
    return { positions, colors, sizes };
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.getElapsedTime() * 0.05 + (mouseRef.current.x * 0.2);
      points.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.025) * 0.1 + (mouseRef.current.y * 0.2);
      points.current.scale.setScalar(scale.get());
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particlesPosition.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={particlesPosition.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const Effects = () => {
  const { gl, scene, camera } = useThree();
  const composer = useRef();

  useEffect(() => {
    composer.current = new EffectComposer(gl);
    composer.current.addPass(new RenderPass(scene, camera));
    
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8, // Reduced bloom intensity
      0.5, // Reduced bloom radius
      0.4  // Adjusted bloom threshold
    );
    composer.current.addPass(bloomPass);
  }, []);

  useFrame(() => {
    if (composer.current) {
      composer.current.render();
    }
  }, 1);

  return null;
};

const CursorGlow = () => {
  const containerRef = useRef();
  const { scrollYProgress } = useScroll();
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      document.documentElement.style.setProperty('--mouse-x', `${x}px`);
      document.documentElement.style.setProperty('--mouse-y', `${y}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div ref={containerRef} className="synthesis-container">
        <SynthesisBackground />
        <motion.div 
          className="synthesis-field"
          style={{
            opacity: useTransform(scrollYProgress, [0, 1], [0.5, 0.2])
          }}
        />
        <motion.div 
          className="synthesis-crystal"
          style={{
            scale: useTransform(scrollYProgress, [0, 1], [1, 1.2]),
            rotateX: useTransform(scrollYProgress, [0, 1], [0, 45]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.2])
          }}
        />
      </div>
    </>
  );
};

export default CursorGlow;