'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Particles from "../components/common/Particles";
import { teamMembers } from "@/lib/constants";

export function TeamSection() {
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

        {/* Enhanced Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                zIndex: 10,
                boxShadow: `0 0 25px ${getGlowColor(member.color, 0.8)}`,
                transition: { 
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  duration: 0.2
                }
              }}
              className={`relative group rounded-xl overflow-hidden bg-black/70 backdrop-blur-sm border-2 border-transparent`}
              style={{
                boxShadow: `0 0 15px ${getGlowColor(member.color, 0.3)}`,
                borderColor: getGlowColor(member.color, 0.5),
                willChange: 'transform'
              }}
            >
              {/* Simplified Holographic Effects */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-200"
                style={{
                  background: `radial-gradient(circle at 50% 50%, 
                    ${getGlowColor(member.color, 0.8)} 0%, 
                    transparent 70%)`,
                }}
              />
              
              {/* Grid pattern with reduced opacity */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity duration-200"
                style={{
                  backgroundImage: `linear-gradient(${getGlowColor(member.color, 0.3)} 1px, transparent 1px),
                    linear-gradient(90deg, ${getGlowColor(member.color, 0.3)} 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Member Image with improved contrast */}
              <div className="h-64 bg-gray-900 relative overflow-hidden">
                <Image
                  src={member.imgSrc}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              
              {/* Header with better contrast */}
              <div 
                className={`p-6 bg-gradient-to-r from-black/90 to-${member.color}/20 border-b`}
                style={{ borderColor: getGlowColor(member.color, 0.3) }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-white text-2xl font-bold mb-1`}>{member.name}</h3>
                    <p className="text-white/90 text-sm font-medium">{member.role}</p>
                  </div>
                  <span 
                    className={`text-xs px-2 py-1 rounded-full bg-black/50 text-white border`}
                    style={{ 
                      borderColor: getGlowColor(member.color, 0.5),
                      color: getGlowColor(member.color, 0.9)
                    }}
                  >
                    {member.status || 'Founder'}
                  </span>
                </div>
              </div>

              {/* Body with improved readability */}
              <div className="p-6 bg-gradient-to-b from-black/70 to-black/90">
                <p className={`text-white font-medium text-sm mb-3 tracking-wide`}>
                  {member.specialty || member.role}
                </p>
                <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                  {member.bio}
                </p>
                
                {member.connections && (
                  <div className="mt-6">
                    <h4 className={`text-white text-sm font-medium mb-3 tracking-wider`}>
                      KEY CONTRIBUTIONS:
                    </h4>
                    <ul className="space-y-2">
                      {(member.connections || []).map((connection, i) => (
                        <li key={i} className="flex items-start">
                          <span className={`mr-2`} style={{ color: getGlowColor(member.color, 0.8) }}>↳</span>
                          <span className="text-gray-400 text-sm">{connection}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer with subtle hover effect */}
              <div 
                className={`px-6 py-3 bg-black/50 border-t text-center`}
                style={{ borderColor: getGlowColor(member.color, 0.3) }}
              >
                <button 
                  type='button' 
                  className={`text-white text-xs font-medium tracking-wider hover:opacity-80 transition-opacity`}
                  style={{ color: getGlowColor(member.color, 0.9) }}
                >
                  CONNECT ON LINKEDIN
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper function for glow colors
function getGlowColor(color: string, opacity: number = 1) {
  const colors: Record<string, string> = {
    cyan: `rgba(0, 200, 255, ${opacity})`,
    pink: `rgba(255, 0, 200, ${opacity})`,
    purple: `rgba(180, 0, 255, ${opacity})`,
    green: `rgba(0, 255, 100, ${opacity})`,
    blue: `rgba(0, 100, 255, ${opacity})`,
    yellow: `rgba(255, 200, 0, ${opacity})`
  };
  return colors[color] || colors.cyan;
}