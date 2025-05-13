"use client";
import React from 'react';
import ContentSection from '@/components/client/pathway/ContentSection';
import { useTranslations } from 'next-intl';

const AdaptiveTestingSection = () => {
  // Get the translations
  const t = useTranslations('Pathway.ui.features.adaptive_testing');
  
  // Structure quiz questions data
  const quizQuestions = [
    {
      question: t('quiz_questions.0.question'),
      answer: t('quiz_questions.0.answer'),
      correct: true
    },
    {
      question: t('quiz_questions.1.question'),
      answer: t('quiz_questions.1.answer'),
      correct: false
    }
  ];
  
  // Structure benefits data
  const benefits = [0, 1, 2].map(index => ({
    title: t(`benefits.${index}.title`),
    description: t(`benefits.${index}.description`)
  }));

  return (
    <ContentSection
      title={t("title")}
      descriptions={[t("descriptions.0"), t("descriptions.1")]}
      textSide="right"
      bgGradient="from-indigo-50 to-purple-50"
      animationVariant="scale"
      visual={
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="mb-5 flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
            <h4 className="font-medium text-indigo-800">{t("quiz_progress")}</h4>
            <span className="text-sm font-medium bg-white px-2 py-1 rounded-full text-indigo-800">
              {t("progress_percentage")}
            </span>
          </div>
          
          <div className="space-y-4">
            {quizQuestions.map((q, index) => (
              <div key={index} className={`p-3 rounded-lg ${q.correct ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                <div className="flex items-start">
                  <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                    q.correct ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {q.correct ? (
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
                    <p className="text-sm font-medium text-gray-800 mb-1">{q.question}</p>
                    <p className="text-xs text-gray-600">
                      {t("your_answer")} <span className={q.correct ? 'text-green-700' : 'text-red-700'}>
                        {q.answer}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-4 flex justify-center">
              <button className="bg-indigo-600 text-white text-sm font-medium py-2 px-6 rounded-lg">
                {t("continue_button")}
              </button>
            </div>
          </div>
        </div>
      }
      additionalContent={
        <div className="mt-6 space-y-4">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <span className="text-indigo-600 font-medium">{i + 1}</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{benefit.title}</h4>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
};

export default AdaptiveTestingSection;