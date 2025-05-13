"use client";
import React from 'react';
import ContentSection from '@/components/client/pathway/ContentSection';
import InfiniteGoalAnimation from '@/components/client/pathway/InfiniteGoalAnimation';
import { useTranslations } from 'next-intl';

const GoalSettingSection = () => {
  // Get the translations
  const t = useTranslations('Pathway.ui.features.goal_setting');
  
  // Get array data directly from translation keys
  const benefits = [0, 1, 2, 3].map(index => t(`benefits.${index}`));

  return (
    <ContentSection
      title={t("title")}
      descriptions={[t("descriptions.0"), t("descriptions.1")]}
      textSide="left"
      bgGradient="from-amber-50 to-orange-50"
      animationVariant="slide"
      visual={
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl shadow-sm border border-gray-100 p-5">
          <InfiniteGoalAnimation />
          <div className="flex justify-center">
            <button type='button' className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm">
              {t("button")}
            </button>
          </div>
        </div>
      }
      additionalContent={
        <div className="space-y-3 mt-6">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-start">
              <div className="mt-1 text-amber-500 mr-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-700">{benefit}</p>
            </div>
          ))}
        </div>
      }
    />
  );
};

export default GoalSettingSection;