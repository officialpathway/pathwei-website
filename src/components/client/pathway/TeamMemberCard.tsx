"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface TeamMemberCardProps {
  imgSrc: string;
  name: string;
  role: string;
  description: string;
  linkedinUrl?: string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  imgSrc, 
  name, 
  role, 
  description, 
  linkedinUrl = "#" 
}) => {
  const t = useTranslations('Pathway.team');
  const [isHovered, setIsHovered] = useState(false);
  
  // Handler to stop event propagation for mouse events
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
    
  return (
    <div 
      className="relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
      style={{ 
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
        transition: 'transform 0.3s ease-in-out'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Team member image */}
      <div className="aspect-[3/4] relative overflow-hidden">
        <Image
          src={imgSrc}
          alt={name}
          fill
          className="object-cover transition-transform duration-500"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />
      </div>
      
      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 z-20"
        style={{ 
          transform: isHovered ? 'translateY(0)' : 'translateY(calc(100% - 80px))',
          background: isHovered ? 'rgba(30, 27, 75, 0.7)' : 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <h3 className={`font-semibold text-lg mb-1 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-gray-800'}`}>
          {name}
        </h3>
        <p className={`text-sm transition-colors duration-300 ${isHovered ? 'text-indigo-200' : 'text-indigo-600'} font-medium`}>
          {role}
        </p>
        
        {/* Description and button that appear on hover */}
        <div className="transition-all duration-300" 
          style={{ 
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
            pointerEvents: isHovered ? 'auto' : 'none'
          }}
        >
          <p className="mt-3 text-sm text-white mb-4">
            {description}
          </p>
          
          <div className="flex">
            {/* Properly using Link for external URLs */}
            {linkedinUrl && linkedinUrl !== "#" ? (
              <Link 
                href={linkedinUrl}
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 text-sm rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center"
                onClick={handleLinkClick}
                passHref
              >
                {t('connect')}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-2" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.8 0-5 2.2-5 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5v-14c0-2.8-2.2-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.3c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.8 1.8-1.8 1.8zm13.5 12.3h-3v-5.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.5v5.6h-3v-11h2.8v1.3h.1c.4-.8 1.4-1.5 2.8-1.5 3 0 3.6 2 3.6 4.5v6.7z" />
                </svg>
              </Link>
            ) : (
              <button 
                className="px-4 py-2 text-sm rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center"
                onClick={handleLinkClick}
              >
                {t('connect')}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-2" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.8 0-5 2.2-5 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5v-14c0-2.8-2.2-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.3c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.8 1.8-1.8 1.8zm13.5 12.3h-3v-5.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.5v5.6h-3v-11h2.8v1.3h.1c.4-.8 1.4-1.5 2.8-1.5 3 0 3.6 2 3.6 4.5v6.7z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;