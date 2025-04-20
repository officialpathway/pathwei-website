"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { getPathwayConstants } from "../../utils/constants";

export default function InfiniteGoalAnimation() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeGoalIndex, setActiveGoalIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [aiThinking, setAiThinking] = useState(false);
  const [showPathReveal, setShowPathReveal] = useState(false);
  const [pathSteps, setPathSteps] = useState<string[]>([]);

  const t = useTranslations("Pathway");
  const constants = getPathwayConstants(t);
  
  const activeCategory = constants.CATEGORIES[activeCategoryIndex];
  const activeGoal = activeCategory.goals[activeGoalIndex];
  
  // Reset animation states when changing category or goal
  useEffect(() => {
    setCompletedSteps(0);
    setAiThinking(false);
    setShowPathReveal(false);
    setPathSteps([]);
    
    // Start the sequence
    const sequence = async () => {
      // AI thinking
      setAiThinking(true);
      await new Promise(r => setTimeout(r, 2000));
      setAiThinking(false);
      
      // Reveal path
      setShowPathReveal(true);
      
      // Generate 4 fake path steps
      const steps = [];
      for (let i = 0; i < 4; i++) {
        steps.push(`Step ${i+1}`);
        setPathSteps([...steps]);
        await new Promise(r => setTimeout(r, 800));
      }
      
      // Complete steps one by one
      for (let i = 0; i < 4; i++) {
        await new Promise(r => setTimeout(r, 1200));
        setCompletedSteps(i + 1);
      }
      
      // Wait a moment at completion
      await new Promise(r => setTimeout(r, 1500));
      
      // Move to next goal
      setActiveGoalIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= activeCategory.goals.length) {
          // Change category when we've gone through all goals
          setTimeout(() => {
            setActiveCategoryIndex((prevCatIndex) => 
              (prevCatIndex + 1) % constants.CATEGORIES.length
            );
            setActiveGoalIndex(0);
          }, 500);
          return prevIndex;
        }
        return nextIndex;
      });
    };
    
    sequence();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGoalIndex, activeCategoryIndex]);
  
  // Orbit animation for particles
  const Particle = ({ delay, size, speed, angle, color }: { delay: number, size: number, speed: number, angle: number, color: string }) => {
    return (
      <motion.div
        className={`absolute rounded-full ${color} opacity-70`}
        style={{
          width: size,
          height: size,
        }}
        animate={{
          x: [0, Math.cos(angle) * 120, 0],
          y: [0, Math.sin(angle) * 120, 0],
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          delay: delay,
          ease: "easeInOut"
        }}
      />
    );
  };
  
  // Generate multiple particles
  const particles = [];
  for (let i = 0; i < 15; i++) {
    const angle = (i / 15) * Math.PI * 2;
    particles.push(
      <Particle 
        key={i}
        delay={i * 0.2} 
        size={Math.random() * 10 + 5} 
        speed={Math.random() * 3 + 6}
        angle={angle}
        color={i % 5 === 0 ? "bg-blue-400" : 
               i % 5 === 1 ? "bg-purple-400" : 
               i % 5 === 2 ? "bg-amber-400" : 
               i % 5 === 3 ? "bg-green-400" : "bg-red-400"}
      />
    );
  }
  
  return (
    <div className="h-[80vh] md:h-[60vh] max-w-[700px] mx-auto bg-gray-50 rounded-xl shadow-lg p-6 overflow-hidden relative">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${activeCategory.color} opacity-10`} />
      
      {/* Floating particles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {particles}
      </div>
      
      {/* Category indicator */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeCategoryIndex}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 relative z-10"
        >
          <div className={`inline-flex items-center px-4 py-1 rounded-full bg-white shadow-md ${activeCategory.textColor}`}>
            <span className="text-2xl mr-2">{activeCategory.icon}</span>
            <span className="font-semibold">{activeCategory.name}</span>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Goal */}
      <div className="text-center relative z-10">
        <h3 className="text-gray-500 mb-1 text-sm">{t("animation-objective")}</h3>
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${activeCategoryIndex}-${activeGoalIndex}`} 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              {activeGoal}
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* AI Thinking */}
      <AnimatePresence>
        {aiThinking && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="flex justify-center items-center mt-6 relative z-10"
          >
            <div className="bg-white rounded-lg shadow-md px-4 py-2 flex items-center">
              <div className="relative mr-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm">AI</span>
                </div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">{t("animation-creating-route")}</span>
                <motion.div 
                  className="ml-2 flex space-x-1"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Path Reveal */}
      <AnimatePresence>
        {showPathReveal && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-6 max-w-md mx-auto relative z-10"
          >
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className={`font-medium mb-3 ${activeCategory.textColor}`}>{t("animation-path-success")}</h3>
              
              <div className="space-y-4">
                {pathSteps.map((step, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex"
                  >
                    {/* Step number or checkmark - using flex-shrink-0 to prevent shrinking */}
                    <div className="flex-shrink-0 mt-0.5">
                      {completedSteps > index ? (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-r ${activeCategory.color} text-white`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </motion.div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    
                    {/* Step text content with flexible layout */}
                    <div className="ml-3 flex-1">
                      <div className="relative">
                        {/* Text content */}
                        <div className={`${completedSteps > index ? "text-gray-400" : "text-gray-700"}`}>
                          {completedSteps > index ? (
                            <span className="relative">
                              {getStepText(t, activeCategory.name, activeGoal, index)}
                              {/* Line through that works with multiple lines */}
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                className="absolute top-1/2 left-0 h-0.5 bg-gray-300 transform -translate-y-1/2"
                                style={{ pointerEvents: 'none' }}
                              />
                            </span>
                          ) : (
                            <span>{getStepText(t, activeCategory.name, activeGoal, index)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Progress indicator */}
              {pathSteps.length > 0 && (
                <motion.div 
                  className="mt-6 bg-gray-100 h-2 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div 
                    className={`h-full bg-gradient-to-r ${activeCategory.color}`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${(completedSteps / 4) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              )}
              
              {/* Completion celebration */}
              {completedSteps === 4 && (
                <motion.div 
                  className="mt-4 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <div className={`inline-block px-4 py-1 rounded-full ${activeCategory.textColor} bg-opacity-20 font-medium text-sm`}>
                    {t("animation-goal-achieved")} 🎉
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function to generate sensible step text based on the category and goal
function getStepText(t: ReturnType<typeof useTranslations>, category: string, goal: string, stepIndex: number) {
  const constants = getPathwayConstants(t);

  // Return the step text if it exists, otherwise a generic step
  return constants.STEPS[category] && 
         constants.STEPS[category][goal] && 
         constants.STEPS[category][goal][stepIndex] 
    ? constants.STEPS[category][goal][stepIndex]
    : `${t("animation-step")} ${stepIndex + 1} ${t("animation-for")} ${goal}`;
}