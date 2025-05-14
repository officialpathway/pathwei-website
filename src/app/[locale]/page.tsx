"use client";
import Hero from '@/components/client/pathway/Hero';
import SloganSection from '@/components/client/pathway/SloganSection';
import FeedbackSection from '@/components/client/pathway/FeedbackSection';
import DotFollower from '@/components/client/pathway/DotFollower';
import { NeonFuturismBackground } from '@/components/client/pathway/NeonBackground';
import CurvedBorder, { GameCurvedBorder } from '@/components/client/pathway/CurvedBorder';
import { useTranslations } from 'next-intl';

// Import our section components
import GoalSettingSection from '@/components/client/pathway/GoalSettingSection';
import ProgressAnalyticsSection from '@/components/client/pathway/ProgressAnalyticsSection';
import CollegeLifeOrganizationSection from '@/components/client/pathway/CollegeLifeOrganizationSection';

export default function Home() {

  const t = useTranslations('Pathway.ui.features');

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden w-full -mb-1">
      <DotFollower />
      <main className="flex-grow w-full overflow-x-hidden">
        <NeonFuturismBackground>
          <Hero />
          <SloganSection />
          <GameCurvedBorder />
        </NeonFuturismBackground>
        
        {/* Functionality Section - Centered */}
        <section id='demo-section' className="relative -mt-1 w-full min-h-screen flex flex-col items-center justify-center bg-white px-4 pt-16 overflow-hidden">
          <div className="text-center space-y-16 z-10 mb-16 max-w-8xl mx-auto w-full">
            {/* Section Header */}
            <div className="space-y-8">
              <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 pt-4">
                  {t("transform_heading")}
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t("transform_subheading")}
              </p>
            </div>
          </div>
          
          {/* Content Sections */}
          <div className="w-full max-w-8xl mx-auto">
            <CollegeLifeOrganizationSection />
            <GoalSettingSection />
            <ProgressAnalyticsSection />
          </div>
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-900 opacity-20 blur-3xl animate-float"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-blue-900 opacity-20 blur-3xl animate-float animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-60 h-60 rounded-full bg-amber-900 opacity-20 blur-3xl animate-float animation-delay-4000"></div>
            <div className="absolute bottom-1/3 right-1/3 w-56 h-56 rounded-full bg-emerald-900 opacity-20 blur-3xl animate-float animation-delay-3000"></div>
          </div>
        </section>
        
        <CurvedBorder fillColor='fill-black' />
        <FeedbackSection />
      </main>
    </div>
  );
}