// components/FeatureComments.tsx
'use client';

import { motion } from 'framer-motion';
import { InfoMessage } from '@/components/client/common/InfoMessage';
import { useRef } from 'react';
import { features } from '@/lib/constants';

const Notification = ({ feature }: {
  feature: typeof features[0];
}) => {
  return (
    <motion.div
      className="absolute"
      style={{
        top: feature.top,
        left: feature.position === 'left' ? feature.left : undefined,
        right: feature.position === 'right' ? feature.right : undefined,
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{
        margin: "-20% 0px -20% 0px",
        once: false,
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
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

  return (
    <div 
      ref={containerRef}
      className="relative h-[300vh] w-full"
    >
      {features.map((feature) => (
        <Notification 
          key={feature.id} 
          feature={feature} 
        />
      ))}
    </div>
  );
};