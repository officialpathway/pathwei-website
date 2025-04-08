// components/FeatureComments.tsx
'use client';

import { motion } from 'framer-motion';
import { InfoMessage } from '../components/common/InfoMessage';
import { useRef } from 'react';

const features = [
  {
    id: 1,
    message: "YOUR GOALS, POWERED BY AI",
    subMessage: "We built this because we watched dreams get buried under busywork. Our AI maps personalized paths to success—helping 530K+ users stay focused on what matters.",
    borderColor: "cyan" as const,
    position: "left",
    top: "10%",
    left: "15%",
    delay: 0.2
  },
  {
    id: 2,
    message: "HUMANS FIRST, ALWAYS",
    subMessage: "Unlike tools that replace you, ours amplify you. 84% of users report achieving goals faster while feeling *more* creative and in control.",
    borderColor: "purple" as const,
    position: "right",
    top: "20%",
    right: "15%",
    delay: 0.4
  },
  {
    id: 3,
    message: "THE FUTURE OF WORK IS HERE",
    subMessage: "We saw the demand for AI that adapts to *you*—not the other way around. Our tech learns your habits, predicts blockers, and course-corrects in real time.",
    borderColor: "pink" as const,
    position: "left",
    top: "35%",
    left: "15%",
    delay: 0.6
  },
  {
    id: 4,
    message: "PROVEN TO WORK",
    subMessage: "Users complete 3.2x more weekly priorities. Founders credit us for hitting milestones 6 months early. Therapists use it to help clients build life-changing habits.",
    borderColor: "green" as const,
    position: "right",
    top: "50%",
    right: "15%",
    delay: 0.8
  },
  {
    id: 5,
    message: "ETHICS BUILT IN",
    subMessage: "We reject surveillance-style productivity. Your data trains *your* AI—never sold or used to manipulate you. (Certified compliant with GDPR and CCPA.)",
    borderColor: "cyan" as const,
    position: "left",
    top: "65%",
    left: "15%",
    delay: 1.0
  },
  {
    id: 6,
    message: "JOIN THE MOVEMENT",
    subMessage: "Over 2,000 teams now use our tools to align work with purpose. From indie creators to Fortune 500s, we’re rewriting how humans and AI collaborate.",
    borderColor: "purple" as const,
    position: "right",
    top: "80%",
    right: "15%",
    delay: 1.2
  },
  {
    id: 7,
    message: "WHAT'S NEXT?",
    subMessage: "We're prototyping AI co-pilots that sense burnout before you do, and tools that turn procrastination patterns into productivity breakthroughs.",
    borderColor: "pink" as const,
    position: "left",
    top: "95%",
    left: "15%",
    delay: 1.4
  }
];

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