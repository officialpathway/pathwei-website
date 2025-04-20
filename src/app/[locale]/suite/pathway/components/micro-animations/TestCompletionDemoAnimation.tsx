// TestExplanationScroll.tsx
"use client";

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface TestExplanationScrollProps {
  objective?: string;
}

const TestExplanationScroll: React.FC<TestExplanationScrollProps> = ({ objective = "Learning Goals" }) => {
  const t = useTranslations("Pathway.TestExplanation");
  
  // Refs for scroll animations
  const containerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  
  // Check if sections are in view for animations
  const section1InView = useInView(section1Ref, { once: true, amount: 0.3 });
  const section2InView = useInView(section2Ref, { once: true, amount: 0.3 });
  const section3InView = useInView(section3Ref, { once: true, amount: 0.3 });
  
  // Get scroll progress for container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Transform scroll progress for sticky header opacity
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.2]);
  
  return (
    <div ref={containerRef} className="max-w-full mx-auto bg-white overflow-y-auto rounded-2xl">
      {/* Sticky header with objective */}
      <motion.div 
        style={{ opacity: headerOpacity }}
        className="relative bg-white/95 backdrop-blur-sm z-10 p-6 border-b border-gray-100 mb-8 "
      >
        <h2 className="text-xl md:text-2xl font-bold text-indigo-600">
          {t("tracking-progress")}: <span className="font-medium text-gray-800">{objective}</span>
        </h2>
      </motion.div>

      <div className="px-4 md:px-8 pb-16">
        {/* Introduction */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t("how-tests-work-title")}
          </h1>
          <p className="text-lg text-gray-600">
            {t("how-tests-work-description")}
          </p>
        </div>
        
        {/* Section 1: Taking Tests */}
        <div 
          ref={section1Ref}
          className="max-w-4xl mx-auto mb-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={section1InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            {/* Visual */}
            <div className="w-full md:w-1/2 mb-6 md:mb-0 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
              <div className="relative">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h4 className="font-medium text-gray-800 mb-4">{t("section1-question-title")}</h4>
                  
                  {[1, 2, 3].map((q) => (
                    <motion.div 
                      key={q}
                      initial={{ opacity: 0, x: -10 }}
                      animate={section1InView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.2 + (q * 0.15) }}
                      className="mb-4 last:mb-0"
                    >
                      <p className="font-medium text-gray-700 mb-2">{t(`section1-question${q}`)}</p>
                      <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-gray-700">
                        {t(`section1-answer${q}`)}
                      </div>
                    </motion.div>
                  ))}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={section1InView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="mt-6 flex justify-end"
                  >
                    <div className="bg-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-lg">
                      {t("section1-submit-button")}
                    </div>
                  </motion.div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-purple-500/20 z-0" />
                <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-indigo-500/20 z-0" />
              </div>
            </div>
            
            {/* Text content */}
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={section1InView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {t("section1-title")}
                </h2>
                <p className="text-gray-700 mb-4">
                  {t("section1-description1")}
                </p>
                <p className="text-gray-700">
                  {t("section1-description2")}
                </p>
                
                <ul className="mt-6 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <li key={i}>
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={section1InView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.6 + (i * 0.1) }}
                        className="flex items-start"
                      >
                        <span className="text-indigo-600 mr-2">✓</span>
                        <span className="text-gray-700">{t(`section1-benefit${i}`)}</span>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Section 2: Evaluation Process */}
        <div 
          ref={section2Ref}
          className="max-w-4xl mx-auto mb-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={section2InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row-reverse items-center gap-8"
          >
            {/* Visual */}
            <div className="w-full md:w-1/2 mb-6 md:mb-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
              <div className="relative">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={section2InView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <svg className="w-16 h-16 mx-auto text-indigo-600 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <motion.path 
                        d="M12 6V12L16 14"
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={section2InView ? { pathLength: 1 } : {}}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    
                    <h4 className="text-lg font-medium text-gray-800 mb-4">{t("section2-processing-title")}</h4>
                  </motion.div>
                  
                  <div className="space-y-3 max-w-xs mx-auto">
                    {[1, 2, 3].map((i) => (
                      <motion.div 
                        key={i}
                        className="h-2 bg-gray-100 rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={section2InView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.3 + (i * 0.2) }}
                      >
                        <motion.div 
                          className="h-full bg-indigo-600 rounded-full"
                          initial={{ width: "0%" }}
                          animate={section2InView ? { width: `${i * 30 + 10}%` } : {}}
                          transition={{ duration: 0.8, delay: 0.4 + (i * 0.3) }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-500/20 z-0" />
                <div className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full bg-indigo-500/20 z-0" />
              </div>
            </div>
            
            {/* Text content */}
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={section2InView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {t("section2-title")}
                </h2>
                <p className="text-gray-700 mb-4">
                  {t("section2-description1")}
                </p>
                <p className="text-gray-700">
                  {t("section2-description2")}
                </p>
                
                <div className="mt-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={section2InView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.6 + (i * 0.15) }}
                      className="flex items-start"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <span className="text-indigo-600 font-medium">{i}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{t(`section2-step${i}-title`)}</h4>
                        <p className="text-sm text-gray-600">{t(`section2-step${i}-description`)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Section 3: Results and Progress Tracking */}
        <div 
          ref={section3Ref}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={section3InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            {/* Visual */}
            <div className="w-full md:w-1/2 mb-6 md:mb-0 bg-gradient-to-br from-emerald-50 to-indigo-50 rounded-2xl p-6">
              <div className="relative">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={section3InView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex items-center justify-between mb-4"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{t("section3-passed")}</div>
                        <p className="text-xs text-gray-500">3/4 {t("section3-correct")}</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">75%</div>
                  </motion.div>
                  
                  <hr className="mb-4" />
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">{t("section3-review-title")}</h4>
                    
                    {[1, 2].map((q) => (
                      <motion.div
                        key={q}
                        initial={{ opacity: 0, y: 5 }}
                        animate={section3InView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.5 + (q * 0.15) }}
                        className={`p-3 rounded-lg mb-3 ${q === 1 ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}
                      >
                        <div className="flex items-start">
                          <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                            q === 1 ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            {q === 1 ? (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            ) : (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 mb-1">{t(`section3-question${q}`)}</p>
                            <p className="text-xs text-gray-600">
                              {t("section3-your-answer")}: <span className={q === 1 ? 'text-green-700' : 'text-red-700'}>
                                {t(`section3-answer${q}`)}
                              </span>
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={section3InView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.9 }}
                      className="mt-4 flex justify-center"
                    >
                      <div className="bg-green-600 text-white text-sm font-medium py-2 px-6 rounded-lg">
                        {t("section3-continue-button")}
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-emerald-500/20 z-0" />
                <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-indigo-500/20 z-0" />
                
                {/* Simple confetti animation */}
                {section3InView && (
                  <>
                    {[...Array(10)].map((_, i) => {
                      const colors = [
                        'bg-green-400', 'bg-blue-400', 'bg-indigo-400', 
                        'bg-purple-400', 'bg-pink-400'
                      ];
                      const color = colors[Math.floor(Math.random() * colors.length)];
                      const size = Math.floor(Math.random() * 4) + 3;
                      const left = `${Math.random() * 100}%`;
                      const delay = Math.random() * 0.5;
                      
                      return (
                        <motion.div
                          key={i}
                          className={`absolute ${color} ${Math.random() > 0.5 ? 'rounded-full' : ''}`}
                          style={{
                            width: size,
                            height: size,
                            left,
                            top: "20%",
                            zIndex: 10
                          }}
                          initial={{ y: 0, opacity: 1 }}
                          animate={{ 
                            y: 100, 
                            opacity: 0,
                            transition: { 
                              duration: 1.5 + Math.random(),
                              delay
                            }
                          }}
                        />
                      );
                    })}
                  </>
                )}
              </div>
            </div>
            
            {/* Text content */}
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={section3InView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {t("section3-title")}
                </h2>
                <p className="text-gray-700 mb-4">
                  {t("section3-description1")}
                </p>
                <p className="text-gray-700 mb-4">
                  {t("section3-description2")}
                </p>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={section3InView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg mt-6"
                >
                  <h4 className="font-medium text-indigo-800 mb-2">{t("section3-insight-title")}</h4>
                  <p className="text-indigo-700 text-sm">{t("section3-insight-content")}</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={section3InView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mt-6 flex flex-wrap gap-3"
                >
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full text-sm">
                      {t(`section3-tag${i}`)}
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={section3InView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="max-w-2xl mx-auto mt-24 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t("cta-title")}
          </h2>
          <p className="text-gray-700 mb-8">
            {t("cta-description")}
          </p>
          <div className="inline-block bg-indigo-600 text-white font-medium py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors">
            {t("cta-button")}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TestExplanationScroll;