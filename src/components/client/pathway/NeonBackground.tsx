"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type NeonFuturismBackgroundProps = {
  children: React.ReactNode;
  baseColor?: "purple" | "blue" | "emerald";
  particleCount?: number;
  withGrid?: boolean;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
};

const colorMap = {
  purple: {
    from: "from-gray-900",
    via: "via-purple-900",
    to: "to-indigo-900",
    accent: "bg-gradient-to-r from-amber-300 to-orange-500",
  },
  blue: {
    from: "from-gray-900",
    via: "via-blue-900",
    to: "to-cyan-900",
    accent: "bg-gradient-to-r from-sky-300 to-blue-500",
  },
  emerald: {
    from: "from-gray-900",
    via: "via-emerald-900",
    to: "to-teal-900",
    accent: "bg-gradient-to-r from-green-300 to-emerald-500",
  },
};

export const NeonFuturismBackground: React.FC<NeonFuturismBackgroundProps> = ({
  children,
  baseColor = "purple",
  particleCount = 15,
  withGrid = true,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    // Generate particles only on client side
    const generatedParticles = Array.from({ 
      length: isMobile ? particleCount / 2 : particleCount 
    }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 0.5 + 0.3,
      delay: Math.random() * 2,
    }));
    
    setParticles(generatedParticles);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isMobile, particleCount]);

  const colors = colorMap[baseColor];

  return (
    <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br ${colors.from} ${colors.via} ${colors.to}`}>
      {/* Floating Particles - Only render when particles exist */}
      {particles.length > 0 && particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/10"
          initial={{ opacity: 0 }}
          animate={{
            x: [particle.x, particle.x + 10],
            y: [particle.y, particle.y + 10],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 3 + particle.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{
            width: `${particle.size}rem`,
            height: `${particle.size}rem`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
        />
      ))}

      {/* Rest of your component remains the same */}
      {withGrid && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZD0iTTAgMEgxMDAgVjEwMCBIMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIC8+PC9zdmc+')] bg-[length:100px_100px]"></div>
        </div>
      )}

      <div className={`absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t ${colors.to}/80 to-transparent pointer-events-none`} />
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
};