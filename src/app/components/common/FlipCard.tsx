import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface FlipCardProps {
  app: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    keywords: string[];
    color: string;
    features: string[];
    status: string;
  };
  index: number;
}

export const FlipCard = ({ app, index }: FlipCardProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flip-card h-[800px] perspective-1000"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="flip-card-inner relative w-full h-full transition-transform duration-500 transform-style-3d"
        onMouseMove={handleMouseMove}
        style={{
          transform: isHovered ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front of the card */}
        <div className="flip-card-front absolute w-full h-full backface-hidden bg-black/50 border-2 rounded-lg overflow-hidden flex flex-col">
          <div className={`p-6 bg-gradient-to-r from-black to-${app.color}/10 border-b-2 border-${app.color}`}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className={`text-${app.color} text-3xl font-bold mb-1`}>{app.title}</h2>
                <p className="text-white/80 text-sm">{app.subtitle}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full bg-${app.color}/20 text-${app.color} border border-${app.color}`}>
                {app.status}
              </span>
            </div>
          </div>

          <div className="p-6 flex-grow">
            <p className="text-gray-300 mb-6">{app.description}</p>
            
            <div className="mb-6">
              <h3 className={`text-${app.color} text-sm font-mono mb-3`}>KEY FEATURES:</h3>
              <ul className="space-y-2">
                {app.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className={`text-${app.color} mr-2 mt-1`}>■</span>
                    <span className="text-gray-400 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto">
              <h3 className={`text-${app.color} text-sm font-mono mb-2`}>TECH SPECS:</h3>
              <div className="flex flex-wrap gap-2">
                {app.keywords.map((keyword, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-900 text-gray-300">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={`px-6 py-3 bg-${app.color}/10 border-t-2 border-${app.color} mt-auto`}>
            <Link
              href={app.status === 'ONLINE' ? `/suite/${app.id}` : '/contact'} 
              className={`w-full py-2 text-${app.color} border border-${app.color} rounded hover:bg-${app.color} hover:text-black transition-colors font-mono text-sm flex items-center justify-center`}
            >
              {app.status === 'ONLINE' ? (
                <>
                  ACCESS NETWORK
                  <span className="ml-2 text-xs">↗</span>
                </>
              ) : (
                <>
                  REQUEST INVITE
                  <span className="ml-2 text-xs animate-pulse">⌛</span>
                </>
              )}
            </Link>
          </div>
        </div>

        {/* Back of the card */}
        <div className="flip-card-back absolute w-full h-full backface-hidden bg-black/50 border-2 rounded-lg overflow-hidden flex flex-col">
          <div className="relative w-full h-full overflow-hidden flex-grow">
            <motion.div 
              className="absolute inset-0"
              animate={{
                scale: 1.5,
                x: mousePosition.x * 100,
                y: mousePosition.y * 100,
              }}
              transition={{
                type: "spring",
                stiffness: 50,
                damping: 15,
                mass: 1
              }}
            >
              <Image
                src={`/images/suite/${app.id}.jpg`}
                alt={app.title}
                fill
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <h2 className={`text-${app.color} text-3xl font-bold text-center`}>
                {app.title}
              </h2>
            </div>
          </div>

          <div className={`px-6 py-3 bg-${app.color}/10 border-t-2 border-${app.color} mt-auto`}>
            <Link
              href={app.status === 'ONLINE' ? `/suite/${app.id}` : '/contact'} 
              className={`w-full py-2 text-${app.color} border border-${app.color} rounded hover:bg-${app.color} hover:text-black transition-colors font-mono text-sm flex items-center justify-center`}
            >
              {app.status === 'ONLINE' ? (
                <>
                  ACCESS NETWORK
                  <span className="ml-2 text-xs">↗</span>
                </>
              ) : (
                <>
                  REQUEST INVITE
                  <span className="ml-2 text-xs animate-pulse">⌛</span>
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 