// OptimizedTestDemo.tsx
"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questions } from '../../utils/constants';

interface TestDemoProps {
  objective: string;
}

const OptimizedTestDemo: React.FC<TestDemoProps> = ({ objective }) => {
  // Animation state
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Animation control ref
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
  const score = {
    correct: questions.filter(q => q.isCorrect).length,
    total: questions.length,
    percent: Math.round((questions.filter(q => q.isCorrect).length / questions.length) * 100)
  };
  
  const isPassed = score.percent >= 70;

  // Handle animation start
  const startAnimation = () => {
    // Reset animation if it's already running
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    // Reset states
    setCurrentStep(1);
    setShowConfetti(false);
    
    // Sequence animation steps with minimal timeouts
    const runStep = (step: number) => {
      setCurrentStep(step);
      
      if (step === 4 && isPassed) {
        setShowConfetti(true);
      }
      
      if (step < 4) {
        animationTimeoutRef.current = setTimeout(() => {
          runStep(step + 1);
        }, step === 2 ? 1000 : 1800); // Loading state slightly shorter
      }
    };
    
    runStep(1);
  };

  // Reset the animation
  const resetAnimation = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    setCurrentStep(0);
    setShowConfetti(false);
  };

  // Limited confetti for better performance
  const confettiElements = Array.from({ length: 30 }, (_, i) => i);

  // Steps label based on current step
  const getStepLabel = () => {
    switch(currentStep) {
      case 1: return "Taking Test";
      case 2: return "Evaluating";
      case 3: case 4: return "Results";
      default: return "Start Demo";
    }
  };

  return (
    <div className="max-w-full mx-auto p-4 rounded-xl relative">
      {/* Header and controls */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold" 
            style={{ 
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
            Prueba de aprendizaje: <span className="font-medium">{objective}</span>
          </h2>
        </div>
        
        {currentStep === 0 ? (
          <motion.button
            onClick={startAnimation}
            className="text-white font-medium py-2 px-6 rounded-lg shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
            }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)'
            }}
          >
            Comenzar
          </motion.button>
        ) : (
          <motion.button
            onClick={resetAnimation}
            className="text-purple-600 font-medium py-2 px-6 rounded-lg border border-purple-300"
            whileHover={{ backgroundColor: '#f5f3ff' }}
          >
            Reset
          </motion.button>
        )}
      </div>
      
      {/* Step Indicator */}
      {currentStep > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-indigo-600">{getStepLabel()}</div>
            <div className="text-xs text-gray-500">Paso {currentStep} de 4</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Animation Container */}
      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          {/* Step 0: Initial state */}
          {currentStep === 0 && (
            <motion.div 
              key="initial"
              className="w-full max-w-lg flex items-center justify-center border border-gray-200 rounded-xl p-6 bg-white shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center p-8">
                <div className="h-24 w-24 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="h-12 w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Usamos tests para medir el progreso</h3>
                <p className="text-gray-600 mb-6">Click en &quot;Comenzar&quot; para ver la animación de ejemplo</p>
              </div>
            </motion.div>
          )}
          
          {/* Step 1: Questions */}
          {currentStep === 1 && (
            <motion.div 
              key="questions"
              className="w-full max-w-lg border border-gray-200 rounded-xl p-6 bg-white shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-medium text-gray-800 mb-4">Preguntas</h3>
              <div className="space-y-3 mb-6">
                {questions.map((q, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <p className="text-sm font-medium text-gray-700 mb-2">Pregunta {index + 1}: {q.question}</p>
                    <div className={`text-sm p-2 rounded ${
                      q.isCorrect 
                        ? 'bg-green-50 text-green-700 border border-green-100' 
                        : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {q.answer}
                    </div>
                  </div>
                ))}
              </div>
              
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  type='button'
                  className="text-white text-sm font-medium py-2 px-6 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                  }}
                >
                  Completar Test
                </button>
              </motion.div>
            </motion.div>
          )}
          
          {/* Step 2: Loading */}
          {currentStep === 2 && (
            <motion.div 
              key="loading"
              className="w-full max-w-lg flex items-center justify-center border border-gray-200 rounded-xl py-12 bg-white shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <div className="inline-block mb-4">
                  <svg className="h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#8B5CF6" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="#6366F1" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0 12 12"
                        to="360 12 12"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </svg>
                </div>
                <p className="font-medium text-lg bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent">
                  Evaluating answers...
                </p>
              </div>
            </motion.div>
          )}
          
          {/* Step 3-4: Results */}
          {currentStep >= 3 && (
            <motion.div 
              key="results"
              className="w-full max-w-lg border border-gray-200 rounded-xl p-6 bg-white shadow-sm relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Confetti animation - with reduced elements for performance */}
              {showConfetti && (
                <>
                  {confettiElements.map((i) => {
                    const colors = [
                      'bg-red-400', 'bg-blue-400', 'bg-yellow-300', 
                      'bg-green-400', 'bg-purple-400', 'bg-pink-400'
                    ];
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    const size = Math.floor(Math.random() * 6) + 4;
                    const left = `${Math.random() * 100}%`;
                    const rotate = Math.random() * 360;
                    const duration = 1 + Math.random();
                    const initialY = -20;
                    const finalY = 400 + Math.random() * 100;
                    
                    return (
                      <motion.div
                        key={i}
                        className={`absolute ${color} ${Math.random() > 0.5 ? 'rounded-full' : ''}`}
                        style={{
                          width: size,
                          height: size,
                          left,
                          top: 0,
                          zIndex: 50
                        }}
                        initial={{ y: initialY, rotate: 0, opacity: 1 }}
                        animate={{ 
                          y: finalY, 
                          rotate, 
                          opacity: 0,
                          transition: { 
                            duration,
                            delay: Math.random() * 0.3
                          }
                        }}
                      />
                    );
                  })}
                </>
              )}
              
              {/* Results Summary */}
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 ${
                      isPassed 
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                        : 'bg-gradient-to-r from-red-500 to-rose-500'
                    }`}>
                      {isPassed ? (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      )}
                    </div>
                    
                    <div>
                      <div className={`text-xl font-bold ${
                        isPassed 
                          ? 'text-emerald-600' 
                          : 'text-rose-600'
                      }`}>
                        {isPassed ? '¡Aprobado!' : 'Inténtalo de nuevo'}
                      </div>
                      <p className="text-sm text-gray-600">
                        {score.correct}/{score.total} respuestas correctas
                      </p>
                    </div>
                  </div>
                  
                  <div className={`text-4xl font-bold ${
                    isPassed 
                      ? 'text-emerald-600' 
                      : 'text-rose-600'
                  }`}>
                    {score.percent}%
                  </div>
                </div>
              </div>
              
              {/* Compact Question Review */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Revisión final:</h4>
                <div className="grid grid-cols-1 gap-3">
                  {questions.map((q, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-white border"
                      style={{
                        borderColor: q.isCorrect ? '#d1fae5' : '#fee2e2',
                        backgroundColor: q.isCorrect ? '#f0fdf4' : '#fef2f2'
                      }}
                    >
                      <div className="flex items-start">
                        <div className={`mt-1 mr-3 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          q.isCorrect 
                            ? 'bg-green-500' 
                            : 'bg-red-500'
                        }`}>
                          {q.isCorrect ? (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 mb-1">Pregunta {index + 1}: {q.question}</p>
                          <p className="text-xs text-gray-600">
                            Tu respuesta: <span className={q.isCorrect ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                              {q.answer}
                            </span>
                          </p>
                          {!q.isCorrect && (
                            <p className="text-xs text-gray-600 mt-1">
                              Respuesta correcta: <span className="text-green-700 font-medium">Sostiene las notas (Pedal de resonancia)</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OptimizedTestDemo;