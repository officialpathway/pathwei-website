"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

export default function EnhancedAIEmpowerment() {
  // Constants
  const COLORS = {
    primary: "#6366F1",
    secondary: "#8B5CF6",
    tertiary: "#EC4899",
    accent: "#3B82F6",
    light: "#A5B4FC",
    brain: "#818CF8",
    human: "#F472B6"
  };

  // Refs
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const particleIdRef = useRef(0);

  // State
  const [particles, setParticles] = useState<Array<Particle>>([]);
  const [pulseFactor, setPulseFactor] = useState(1);
  const [glowIntensity, setGlowIntensity] = useState(5);

  // Particle type
  type ParticleState = 'seeking' | 'orbiting' | 'transferring' | 'dissipating';
  type Particle = {
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
    phase: number;
    color: string;
    targetX?: number;
    targetY?: number;
    state: ParticleState;
  };

  // Initialize particles
  const initParticles = useCallback((count: number) => {
    return Array.from({ length: count }, () => ({
      id: particleIdRef.current++,
      x: 300 + (Math.random() - 0.5) * 200,
      y: Math.random() * 200,
      size: 2 + Math.random() * 3, // Smaller size range
      speed: 0.5 + Math.random() * 1.5, // Reduced speed
      opacity: 0.3 + Math.random() * 0.7,
      phase: Math.random() * 2 * Math.PI,
      color: [COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.light][
        Math.floor(Math.random() * 4)
      ],
      state: 'seeking' as ParticleState
    } as Particle));
  }, [COLORS.light, COLORS.primary, COLORS.secondary, COLORS.tertiary]);

  // Animation loop optimized with requestAnimationFrame timing
  const animate = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // Only update particles every 2 frames (halves the workload)
    if (deltaTime > 0) {
      setParticles((prevParticles): Particle[] => {
        const newParticles = prevParticles.map(particle => {
          // AI node position
          const nodeX = 300;
          const nodeY = 150;

          switch (particle.state) {
            case 'seeking':
              // Move toward AI node
              const dx = nodeX - particle.x;
              const dy = nodeY - particle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 50) {
                return { ...particle, state: 'orbiting' as ParticleState };
              }

              // Normalized direction vector
              const vx = dx / distance;
              const vy = dy / distance;

              return {
                ...particle,
                x: particle.x + vx * particle.speed,
                y: particle.y + vy * particle.speed,
              };

            case 'orbiting':
              // Orbit around AI node
              const newPhase = particle.phase + 0.05;
              if (Math.random() > 0.99) {
                return {
                  ...particle,
                  state: 'transferring' as ParticleState,
                  targetX: 300 + (Math.random() - 0.5) * 30,
                  targetY: 220
                };
              }

              return {
                ...particle,
                x: nodeX + Math.cos(newPhase) * 40,
                y: nodeY + Math.sin(newPhase) * 40,
                phase: newPhase,
              };

            case 'transferring':
              // Move toward brain
              if (!particle.targetX || !particle.targetY) {
                return { ...particle, state: 'seeking' as ParticleState };
              }

              const tx = particle.targetX - particle.x;
              const ty = particle.targetY - particle.y;
              const tDist = Math.sqrt(tx * tx + ty * ty);

              if (tDist < 5) {
                return {
                  ...particle,
                  state: 'dissipating' as ParticleState,
                  targetY: 550 + (Math.random() - 0.5) * 100
                };
              }

              return {
                ...particle,
                x: particle.x + (tx / tDist) * particle.speed,
                y: particle.y + (ty / tDist) * particle.speed,
              };

            case 'dissipating':
              // Dissipate in human area
              if (particle.opacity > 0.1) {
                return {
                  ...particle,
                  x: particle.x + (Math.random() - 0.5) * 1,
                  y: particle.y + (Math.random() - 0.5) * 1,
                  opacity: particle.opacity - 0.005,
                  size: particle.size * 0.995,
                };
              } else {
                // Reset particle
                const newParticle = initParticles(1)[0];
                return {
                  ...newParticle,
                  id: particle.id, // Keep same ID to avoid re-renders
                  state: 'seeking' as ParticleState
                } as Particle;
              }

            default:
              return particle;
          }
        });

        return newParticles;
      });
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [initParticles]);

  // Effects
  useEffect(() => {
    // Initialize with fewer particles
    setParticles(initParticles(25));

    // Start animation
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, initParticles]);

  useEffect(() => {
    // Pulse animation at a slower rate
    const pulseInterval = setInterval(() => {
      setPulseFactor(1 + 0.03 * Math.sin(Date.now() * 0.002));
    }, 100);

    // Glow animation at a slower rate
    const glowInterval = setInterval(() => {
      setGlowIntensity(3 + Math.sin(Date.now() * 0.0008) * 2);
    }, 100);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(glowInterval);
    };
  }, []);

  // Memoized SVG elements
  const AINode = (
    <g transform={`translate(300 150) scale(${pulseFactor})`}>
      <circle cx="0" cy="0" r="60" fill={`url(#aiGlow)`} filter="url(#glow)" className="opacity-90" />
      <circle cx="0" cy="0" r="40" fill={COLORS.primary} className="opacity-70" />
      <path d="M-20,-20 L20,20 M-20,20 L20,-20" stroke={COLORS.light} strokeWidth="5" className="opacity-80" />
      <circle cx="0" cy="0" r="10" fill={COLORS.light} />
    </g>
  );

  const BrainNode = (
    <g transform={`translate(300 350) scale(${pulseFactor * 0.95})`}>
      <path 
        d="M-60,-40 C-40,-60 40,-60 60,-40 C80,-20 80,40 60,60 C40,80 -40,80 -60,60 C-80,40 -80,-20 -60,-40 Z" 
        fill="none" stroke={COLORS.brain} strokeWidth="4" className="opacity-80" 
      />
      <path 
        d="M-40,-20 C-30,-30 30,-30 40,-20 C50,0 50,30 40,40 C30,50 -30,50 -40,40 C-50,30 -50,0 -40,-20 Z" 
        fill={COLORS.brain} className="opacity-60" 
      />
      <path 
        d="M-30,0 C-20,-15 20,-15 30,0 C35,10 35,20 30,30 C20,40 -20,40 -30,30 C-35,20 -35,10 -30,0 Z" 
        fill={COLORS.light} className="opacity-70" 
      />
      <path 
        d="M-15,-25 C-5,-30 5,-30 15,-25 C20,-20 20,-10 15,-5 C5,0 -5,0 -15,-5 C-20,-10 -20,-20 -15,-25 Z" 
        fill={COLORS.accent} className="opacity-70" 
      />
    </g>
  );

  const HumanNode = (
    <g transform={`translate(300 550) scale(${pulseFactor * 0.9})`}>
      <circle cx="0" cy="0" r="70" fill={`url(#humanGlow)`} filter="url(#glow)" className="opacity-70" />
      <path 
        d="M0,-40 C15,-40 25,-25 25,-10 C25,0 20,10 10,15 C15,20 20,35 20,45 C20,55 0,60 0,60 C0,60 -20,55 -20,45 C-20,35 -15,20 -10,15 C-20,10 -25,0 -25,-10 C-25,-25 -15,-40 0,-40 Z" 
        fill={COLORS.human} className="opacity-80" 
      />
    </g>
  );

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <svg viewBox="0 0 600 800" className="w-full max-w-xl h-full">
        <defs>
          <radialGradient id="aiGlow" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={COLORS.primary} stopOpacity="0.8" />
            <stop offset="100%" stopColor={COLORS.primary} stopOpacity="0" />
          </radialGradient>
          
          <radialGradient id="brainGlow" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={COLORS.secondary} stopOpacity="0.8" />
            <stop offset="100%" stopColor={COLORS.secondary} stopOpacity="0" />
          </radialGradient>
          
          <radialGradient id="humanGlow" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={COLORS.tertiary} stopOpacity="0.8" />
            <stop offset="100%" stopColor={COLORS.tertiary} stopOpacity="0" />
          </radialGradient>
          
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={glowIntensity} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {AINode}
        {BrainNode}
        {HumanNode}
        
        <path d="M300,210 C300,210 300,280 300,280" fill="none" stroke={COLORS.light} strokeWidth="3" className="opacity-60" />
        <path d="M300,420 C300,420 300,480 300,480" fill="none" stroke={COLORS.light} strokeWidth="3" className="opacity-60" />
        
        {/* Optimized particles rendering */}
        <g>
          {particles.map(particle => (
            <circle 
              key={particle.id}
              cx={particle.x} 
              cy={particle.y} 
              r={particle.size}
              fill={particle.color} 
              className="transition-all duration-300"
              style={{ opacity: particle.opacity }}
            />
          ))}
        </g>
        
        <text x="300" y="225" textAnchor="middle" fill={COLORS.primary} className="text-lg font-bold">Inteligencia Artificial</text>
        <text x="300" y="425" textAnchor="middle" fill={COLORS.brain} className="text-lg font-bold">Conocimiento</text>
        <text x="300" y="625" textAnchor="middle" fill={COLORS.tertiary} className="text-lg font-bold">Usuario</text>
        <text x="300" y="750" textAnchor="middle" fill={COLORS.accent} className="text-2xl font-bold">Potenciando los objetivos humanos</text>
      </svg>
    </div>
  );
}