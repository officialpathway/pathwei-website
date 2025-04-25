// components/FeatureComments.tsx
'use client';

import { motion } from 'framer-motion';
import { InfoMessage } from '@/components/client/common/InfoMessage';
import { useRef } from 'react';
import { features } from '@/lib/constants';
import { useTranslations } from 'next-intl';

// Update the type to use the return type of the features function
type FeatureType = ReturnType<typeof features>[0];

const Notification = ({ feature }: {
  feature: FeatureType;
}) => {
  return (
    <motion.div
      className="absolute z-10"
      style={{
        top: feature.top,
        left: feature.position === 'left' ? feature.left : undefined,
        right: feature.position === 'right' ? feature.right : undefined,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{
        margin: "-20% 0px -20% 0px",
        once: false,
      }}
      transition={{ 
        duration: 0.5, 
        ease: "easeOut",
        delay: 0.2
      }}
    >
      <InfoMessage
        message={feature.message}
        subMessage={feature.subMessage}
        borderColor={feature.borderColor}
      />
    </motion.div>
  );
};

export const FeatureComments = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Get the translator for the aihavenlabs namespace
  const t = useTranslations('aihavenlabs');
  
  // Call the features function with the translator to get the array
  const featuresArray = features(t);

  return (
    <div 
      ref={containerRef}
      className="relative h-[300vh] w-full"
    >
      {/* Container is not sticky, absolute positioning used within the 300vh tall container */}
      {featuresArray.map((feature) => (
        <Notification 
          key={feature.id} 
          feature={feature} 
        />
      ))}
    </div>
  );
};