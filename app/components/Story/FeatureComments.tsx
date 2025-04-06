// components/FeatureComments.tsx
'use client';

import { motion } from 'framer-motion';
import { InfoMessage } from '../common/InfoMessage';
import { useRef } from 'react';

const features = [
  {
    id: 1,
    message: "NEURAL SECURITY SYSTEM ACTIVATED",
    subMessage: "Our quantum-encrypted AI firewall now protects over 5 million daily transactions across global networks with zero breach history. Multi-layered biometric authentication ensures absolute data sovereignty.",
    borderColor: "cyan" as const,
    position: "left",
    top: "10%",
    left: "15%",
    delay: 0.2
  },
  {
    id: 2,
    message: "REAL-TIME COGNITIVE PROCESSING ONLINE",
    subMessage: "Omnidata analytics engine currently processing 2.3 petabytes of live information streams, delivering predictive insights with 99.97% accuracy across financial, healthcare and IoT ecosystems.",
    borderColor: "purple" as const,
    position: "right",
    top: "20%",
    right: "15%",
    delay: 0.4
  },
  {
    id: 3,
    message: "AUTONOMOUS WORKFLOW OPTIMIZATION ACTIVE",
    subMessage: "Enterprise-grade task automation now handles 78% of repetitive operations across client organizations, freeing human teams for creative problem-solving and strategic innovation.",
    borderColor: "pink" as const,
    position: "left",
    top: "35%",
    left: "15%",
    delay: 0.6
  },
  {
    id: 4,
    message: "GLOBAL NEURAL NETWORK SYNCHRONIZED",
    subMessage: "Decentralized AI nodes operational in 127 countries, enabling real-time multilingual communication, cultural adaptation, and localized decision-making at planetary scale.",
    borderColor: "green" as const,
    position: "right",
    top: "50%",
    right: "15%",
    delay: 0.8
  },
  {
    id: 5,
    message: "ETHICAL AI GOVERNANCE PROTOCOLS ENGAGED",
    subMessage: "Continuous bias monitoring and algorithmic transparency frameworks ensure all decisions meet UN sustainability goals while maintaining explainable AI standards across all applications.",
    borderColor: "cyan" as const,
    position: "left",
    top: "65%",
    left: "15%",
    delay: 1.0
  },
  {
    id: 6,
    message: "HUMAN-AI SYMBIOSIS NETWORK EXPANDING",
    subMessage: "Neuro-adaptive interfaces now deployed to 1,200+ partner organizations, enhancing cognitive capabilities while preserving human agency in all mission-critical systems.",
    borderColor: "purple" as const,
    position: "right",
    top: "80%",
    right: "15%",
    delay: 1.2
  },
  {
    id: 7,
    message: "FUTURE FORECASTING ENGINES ONLINE",
    subMessage: "Temporal analysis models successfully predicted 83% of market shifts and emerging trends with 6-month accuracy, enabling proactive strategy development for all enterprise clients.",
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