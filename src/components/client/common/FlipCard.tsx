'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Suite.Card');
  const [isDesktop, setIsDesktop] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Check if device is desktop - for flip functionality
    const checkDevice = () => {
      setIsDesktop(window.innerWidth > 1024);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  const handleFlip = () => {
    if (isDesktop) {
      setIsFlipped(!isFlipped);
    }
  };

  // Get appropriate color for each app
  const getColorClass = (colorName: string) => {
    const colorMap: Record<string, { bg: string, text: string, border: string, hover: string }> = {
      'blue': {
        bg: 'bg-cyan-900/20',
        text: 'text-cyan-400',
        border: 'border-cyan-500',
        hover: 'hover:bg-cyan-500'
      },
      'purple': {
        bg: 'bg-purple-900/20',
        text: 'text-purple-400',
        border: 'border-purple-500',
        hover: 'hover:bg-purple-500'
      },
      'green': {
        bg: 'bg-emerald-900/20',
        text: 'text-emerald-400',
        border: 'border-emerald-500',
        hover: 'hover:bg-emerald-500'
      },
      'red': {
        bg: 'bg-red-900/20',
        text: 'text-red-400',
        border: 'border-red-500',
        hover: 'hover:bg-red-500'
      },
      'yellow': {
        bg: 'bg-amber-900/20',
        text: 'text-amber-400',
        border: 'border-amber-500',
        hover: 'hover:bg-amber-500'
      },
      'pink': {
        bg: 'bg-pink-900/20',
        text: 'text-pink-400',
        border: 'border-pink-500',
        hover: 'hover:bg-pink-500'
      },
      'neon-blue': {
        bg: 'bg-blue-900/20',
        text: 'text-blue-400',
        border: 'border-blue-500',
        hover: 'hover:bg-blue-500'
      },
      'neon-yellow': {
        bg: 'bg-yellow-900/20',
        text: 'text-yellow-400',
        border: 'border-yellow-500',
        hover: 'hover:bg-yellow-500'
      }
    };
    
    return colorMap[colorName] || colorMap['blue']; // Default to blue
  };

  const colorClasses = getColorClass(app.color);

  return (
    <div className="w-[280px] h-[380px] relative">
      <div 
        className={`flip-card-container h-full w-full ${isDesktop ? 'cursor-pointer' : ''}`}
        style={{
          perspective: isDesktop ? '1000px' : 'none'
        }}
      >
        <div 
          className="flip-card-inner relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: isDesktop ? 'preserve-3d' : 'flat',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front of the card */}
          <div 
            className={`flip-card-front absolute w-full h-full 
              bg-black border ${colorClasses.border} rounded-lg overflow-hidden flex flex-col
              shadow-lg`}
            style={{ backfaceVisibility: 'hidden' }}
            onClick={handleFlip}
          >
            {/* Card Header */}
            <div className={`p-3 ${colorClasses.bg} border-b ${colorClasses.border}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`${colorClasses.text} text-lg font-mono tracking-wide`}>
                    {app.title}
                  </h2>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded-sm ${colorClasses.text} border ${colorClasses.border}`}>
                  {app.status === 'ONLINE' ? t('status-online') : t('status-developing')}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 flex-grow flex flex-col">
              <p className="text-gray-300 text-xs mb-3 line-clamp-3">{app.description}</p>
              
              <div className="mb-3">
                <h3 className={`${colorClasses.text} text-xs font-mono font-bold mb-1`}>
                  {t('features')}:
                </h3>
                <ul className="space-y-0.5">
                  {app.features.slice(0, 2).map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className={`${colorClasses.text} mr-1 text-xs`}>■</span>
                      <span className="text-gray-400 text-xs line-clamp-1">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <div className="flex flex-wrap gap-1 mb-2">
                  {app.keywords.slice(0, 3).map((keyword, i) => (
                    <span key={i} className="text-xs px-1 py-0.5 rounded-sm bg-gray-800 text-gray-300 border border-gray-700">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer with prominent CTA button */}
            <div className={`px-3 py-2 ${colorClasses.bg} border-t ${colorClasses.border}`}>
              <Link
                href={app.status === 'ONLINE' ? `/suite/${app.id}` : '/suite/pathway'} 
                className={`w-full py-1.5 ${colorClasses.text} bg-black border ${colorClasses.border} ${colorClasses.hover} 
                  hover:text-black transition-colors font-mono text-xs flex items-center justify-center
                  rounded-sm`}
              >
                {app.status === 'ONLINE' ? (
                  <>
                    {t('access')}
                    <span className="ml-1 inline-block">↗</span>
                  </>
                ) : (
                  <>
                    {t('request')}
                    <span className="ml-1 inline-block">⌛</span>
                  </>
                )}
              </Link>
            </div>
            
            {/* Corner decorations - simplified */}
            <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${colorClasses.border}`}></div>
            <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${colorClasses.border}`}></div>
            <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${colorClasses.border}`}></div>
            <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${colorClasses.border}`}></div>
          </div>

          {/* Back of the card - Only rendered if desktop */}
          {isDesktop && (
            <div 
              className={`flip-card-back absolute w-full h-full 
                bg-black border ${colorClasses.border} rounded-lg overflow-hidden flex flex-col
                shadow-lg`}
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
              onClick={handleFlip}
            >
              <div className="relative w-full h-full flex-grow overflow-hidden">
                {/* Static image */}
                <div className="absolute inset-0">
                  <Image
                    src={`/images/suite/${app.id}.jpg`}
                    alt={app.title}
                    fill
                    className="object-cover brightness-75"
                    priority={index < 3}
                  />
                </div>
                
                {/* Simple overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>
                
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <h2 className={`${colorClasses.text} text-xl font-mono tracking-wide mb-2`}>
                    {app.title}
                  </h2>
                </div>
              </div>

              {/* Footer with prominent CTA button */}
              <div className={`px-3 py-2 ${colorClasses.bg} border-t ${colorClasses.border}`}>
                <Link
                  href={app.status === 'ONLINE' ? `/suite/${app.id}` : '/contact'} 
                  className={`w-full py-1.5 ${colorClasses.text} bg-black border ${colorClasses.border} ${colorClasses.hover} 
                    hover:text-black transition-colors font-mono text-xs flex items-center justify-center
                    rounded-sm`}
                >
                  {app.status === 'ONLINE' ? (
                    <>
                      {t('access')}
                      <span className="ml-1 inline-block">↗</span>
                    </>
                  ) : (
                    <>
                      {t('request')}
                      <span className="ml-1 inline-block">⌛</span>
                    </>
                  )}
                </Link>
              </div>
              
              {/* Simplified flip indicator */}
              <button 
                className="absolute top-2 right-2 z-20 text-xs px-1.5 py-0.5 rounded-sm bg-black/70 text-white border border-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                aria-label={t('flip')}
              >
                ↺
              </button>
              
              {/* Corner decorations - simplified */}
              <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${colorClasses.border}`}></div>
              <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${colorClasses.border}`}></div>
              <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${colorClasses.border}`}></div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${colorClasses.border}`}></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Flip button outside for desktop users (clearer affordance) */}
      {isDesktop && !isFlipped && (
        <button 
          type='button'
          className={`absolute top-2 right-2 z-20 text-xs px-1.5 py-0.5 rounded-sm ${colorClasses.text} bg-black/70 border border-gray-700`}
          onClick={handleFlip}
          aria-label={t('flip')}
        >
          ↺
        </button>
      )}
    </div>
  );
};