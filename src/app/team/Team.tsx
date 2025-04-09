'use client';

import { CyberpunkCard } from "@/src/app/components/common/Card";
import Particles from "../components/common/Particles";
import { motion } from 'framer-motion';

export function TeamSection() {
  const teamMembers = [
    {
      name: "Alvaro Rios",
      role: "Chief Executive Officer",
      color: "cyan",
      specialty: "STRATEGIC SYNTHESIS",
      imgSrc: "/images/team/ceo.jpg"
    },
    {
      name: "Rayan Chairi",
      role: "Chief Technology Officer",
      color: "pink",
      specialty: "NEURAL OPTIMIZATION",
      imgSrc: "/images/team/cto.jpg"
    },
    {
      name: "Maria Victoria Sanchez",
      role: "Chief Marketing Officer",
      color: "purple",
      specialty: "COGNITIVE ADOPTION",
      imgSrc: "/images/team/duda.jpg"
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Particles Background */}
        <div className="absolute inset-0 z-0">
          <Particles color="#ffffff" />
        </div>

        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white" data-text="NEURAL_CORE">
            AI HAVEN LABS
          </h2>
          <p className="text-neon-cyan text-lg">
            {`> MEET THE ARCHITECTS OF TOMORROW`}
          </p>
        </div>

        {/* Team cards with enhanced blue holographic effect */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="flex justify-center"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div
                  whileHover={{
                    y: -10,
                    boxShadow: `0 10px 25px -5px rgba(0, 200, 255, 0.5)`,
                    transition: { 
                      duration: 0.4,
                      ease: "easeOut"
                    }
                  }}
                >
                  <div className="relative group">
                    <CyberpunkCard
                      name={member.name}
                      role={member.role}
                      imgSrc={member.imgSrc}
                      color={member.color as 'cyan' | 'pink' | 'purple'}
                    />
                    {/* Blue holographic overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-80 transition-opacity duration-500 mix-blend-color"
                         style={{
                           background: `linear-gradient(45deg, 
                           rgba(0, 100, 255, 0.6) 0%, 
                           rgba(0, 200, 255, 0.8) 100%)`,
                         }}>
                    </div>
                    {/* Scan lines - now more visible */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                         style={{
                           backgroundImage: `repeating-linear-gradient(
                             0deg,
                             rgba(0, 0, 0, 0.8),
                             rgba(0, 0, 0, 0.8) 1px,
                             transparent 1px,
                             transparent 3px
                           )`,
                           mixBlendMode: 'overlay'
                         }}>
                    </div>
                    {/* Pixel grid effect */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                      style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(0, 255, 255, 0.1) 15px, rgba(0, 255, 255, 0.1) 16px),
                          repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(0, 255, 255, 0.1) 15px, rgba(0, 255, 255, 0.1) 16px)`
                      }}>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}