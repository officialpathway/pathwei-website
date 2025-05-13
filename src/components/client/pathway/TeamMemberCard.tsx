// components/client/pathway/TeamMemberCard.jsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface TeamMemberCardProps {
  imgSrc: string;
  name: string;
  role: string;
  description: string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ imgSrc, name, role, description }) => {
  const t = useTranslations('Pathway.team');
  const [isHovered, setIsHovered] = useState(false);
  
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
      {/* Gradient overlay that appears on hover */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 to-transparent opacity-0 transition-opacity duration-300 z-10"
        style={{ opacity: isHovered ? 1 : 0 }}
      />
      
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
      <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300"
        style={{ 
          transform: isHovered ? 'translateY(0)' : 'translateY(calc(100% - 80px))',
          background: isHovered ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <h3 className={`font-semibold text-lg mb-1 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-gray-800'}`}>
          {name}
        </h3>
        <p className={`text-sm transition-colors duration-300 ${isHovered ? 'text-indigo-200' : 'text-indigo-600'} font-medium`}>
          {role}
        </p>
        
        {/* Description and buttons that appear on hover */}
        <div className="transition-all duration-300" 
          style={{ 
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
            pointerEvents: isHovered ? 'auto' : 'none'
          }}
        >
          <p className="mt-3 text-sm text-white/90 mb-4">
            {description}
          </p>
          
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 text-xs rounded-full bg-white text-indigo-700 font-medium hover:bg-indigo-50 transition-colors">
              {t('view_profile')}
            </button>
            <button className="px-3 py-1.5 text-xs rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors">
              {t('connect')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;