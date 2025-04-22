"use client";

import Hero from './components/Hero';
import SloganSection from './components/SloganSection';
import FeedbackSection from './components/FeedbackSection';
import DotFollower from './components/DotFollower';
import TestCompletionDemoAnimation from './components/micro-animations/TestCompletionDemoAnimation';
import InfiniteGoalAnimation from './components/micro-animations/InfiniteGoalAnimation';
import EnhancedAIEmpowerment from './components/micro-animations/HumanAI';
import { NeonFuturismBackground } from './components/NeonBackground';
import { useTranslations } from 'next-intl';

export default function Home() {

  const t = useTranslations("Pathway");
  
  // Example data
  const userPrompt = "Aprender a tocar el piano";

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden w-full">
      <DotFollower />
      <main className="flex-grow w-full overflow-x-hidden pt-10">
        
        <NeonFuturismBackground>
          <Hero />
          <SloganSection />
        </NeonFuturismBackground>

        {/* Functionality Section - Centered */}
        <section id='demo-section' className="relative w-full min-h-screen flex flex-col items-center justify-center bg-white px-4 pt-20 overflow-hidden">
          <div className="text-center space-y-16 z-10">
            {/* First Section */}
            <div className="space-y-8">
              <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 pt-4">
                  {t("first-section-heading")}
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t("first-section-subheading")}
              </p>
              <div className="w-full max-w-4xl mx-auto">
                <InfiniteGoalAnimation />
              </div>
            </div>

            {/* Test Completion Section */}
            <div className="space-y-8">
              <h3 className="text-3xl md:text-5xl font-bold text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500 pt-4">
                  {t("second-section-heading")}
                </span>
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t("second-section-subheading")}
              </p>
              <div className="w-full h-full max-w-3xl mx-auto">
                <TestCompletionDemoAnimation objective={userPrompt} />
              </div>
            </div>

            {/* Main Divider */}
            <div className="h-px w-full max-w-2xl mx-auto bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>

            {/* AI Empowerment Section */}
            <div className="space-y-8 pt-8">
              <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500 pt-4">
                  {t("third-section-heading")}
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t("third-section-subheading")}
              </p>
              <div className="w-full max-w-4xl mx-auto">
                <EnhancedAIEmpowerment />
              </div>
            </div>
          </div>

          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-900 opacity-20 blur-3xl animate-float"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-blue-900 opacity-20 blur-3xl animate-float animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-60 h-60 rounded-full bg-amber-900 opacity-20 blur-3xl animate-float animation-delay-4000"></div>
            <div className="absolute bottom-1/3 right-1/3 w-56 h-56 rounded-full bg-emerald-900 opacity-20 blur-3xl animate-float animation-delay-3000"></div>
          </div>
        </section>

        <FeedbackSection />
      </main>
    </div>
  );
}