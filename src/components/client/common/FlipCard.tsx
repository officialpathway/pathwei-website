import { motion, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

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
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth transformed values
  const xSmooth = useTransform(x, [-1, 1], [-50, 50], {
    clamp: true
  });
  const ySmooth = useTransform(y, [-1, 1], [-50, 50], {
    clamp: true
  });

  useEffect(() => {
    // Check if device is desktop
    const checkDevice = () => {
      setIsDesktop(window.innerWidth > 1024); // Disable for tablets and mobile
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop || !isHovered) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseEnter = () => {
    if (isDesktop) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isDesktop) {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    }
  };

  // Dynamic color classes
  const colorClasses = {
    container: `border-${app.color}`,
    header: `border-${app.color} bg-gradient-to-r from-black to-${app.color}/10`,
    text: `text-${app.color}`,
    badge: `bg-${app.color}/20 text-${app.color} border border-${app.color}`,
    button: `text-${app.color} border border-${app.color} hover:bg-${app.color} hover:text-black`,
    footer: `bg-${app.color}/10 border-t-2 border-${app.color}`
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
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
        <div className={`flip-card-front absolute w-full h-full backface-hidden bg-black/50 border-2 rounded-lg overflow-hidden flex flex-col ${colorClasses.container}`}>
          <div className={`p-6 ${colorClasses.header}`}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className={`${colorClasses.text} text-3xl font-bold mb-1`}>{app.title}</h2>
                <p className="text-white/80 text-sm">{app.subtitle}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${colorClasses.badge}`}>
                {app.status}
              </span>
            </div>
          </div>

          <div className="p-6 flex-grow">
            <p className="text-gray-300 mb-6">{app.description}</p>
            
            <div className="mb-6">
              <h3 className={`${colorClasses.text} text-sm font-mono mb-3`}>KEY FEATURES:</h3>
              <ul className="space-y-2">
                {app.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className={`${colorClasses.text} mr-2 mt-1`}>■</span>
                    <span className="text-gray-400 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto">
              <h3 className={`${colorClasses.text} text-sm font-mono mb-2`}>TECH SPECS:</h3>
              <div className="flex flex-wrap gap-2">
                {app.keywords.map((keyword, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-900 text-gray-300">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={`px-6 py-3 ${colorClasses.footer}`}>
            <Link
              href={app.status === 'ONLINE' ? `/suite/${app.id}` : '/contact'} 
              className={`w-full py-2 ${colorClasses.button} transition-colors font-mono text-sm flex items-center justify-center`}
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

        {/* Back of the card - Only render if desktop */}
        {isDesktop && (
          <div className={`flip-card-back absolute w-full h-full backface-hidden bg-black/50 border-2 rounded-lg overflow-hidden flex flex-col ${colorClasses.container}`}>
            <div className="relative w-full h-full overflow-hidden flex-grow">
              <motion.div 
                className="absolute inset-0"
                style={{
                  x: xSmooth,
                  y: ySmooth,
                  scale: 1.5
                }}
              >
                <Image
                  src={`/images/suite/${app.id}.jpg`}
                  alt={app.title}
                  fill
                  className="object-cover"
                  priority={index < 3} // Only prioritize first few images
                />
              </motion.div>
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <h2 className={`${colorClasses.text} text-3xl font-bold text-center`}>
                  {app.title}
                </h2>
              </div>
            </div>

            <div className={`px-6 py-3 ${colorClasses.footer}`}>
              <Link
                href={app.status === 'ONLINE' ? `/suite/${app.id}` : '/contact'} 
                className={`w-full py-2 ${colorClasses.button} transition-colors font-mono text-sm flex items-center justify-center`}
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
        )}
      </div>
    </motion.div>
  );
};