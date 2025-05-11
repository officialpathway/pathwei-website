"use client";
import Hero from '@/components/client/pathway/Hero';
import SloganSection from '@/components/client/pathway/SloganSection';
import FeedbackSection from '@/components/client/pathway/FeedbackSection';
import DotFollower from '@/components/client/pathway/DotFollower';
import InfiniteGoalAnimation from '@/components/client/pathway/InfiniteGoalAnimation';
import { NeonFuturismBackground } from '@/components/client/pathway/NeonBackground';
import ContentSection from '@/components/client/pathway/ContentSection';
import CurvedBorder, { GameCurvedBorder } from '@/components/client/pathway/CurvedBorder';
export default function Home() {
  
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden w-full">
      <DotFollower />
      <main className="flex-grow w-full overflow-x-hidden">
        <NeonFuturismBackground>
          <Hero />
          <SloganSection />
          <GameCurvedBorder />
        </NeonFuturismBackground>
        
        {/* Functionality Section - Centered */}
        <section id='demo-section' className="relative w-full min-h-screen flex flex-col items-center justify-center bg-white px-4 pt-16 overflow-hidden">
          <div className="text-center space-y-16 z-10 mb-16 max-w-8xl mx-auto w-full">
            {/* First Section Header */}
            <div className="space-y-8">
              <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 pt-4">
                  Transform Your Learning Journey
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Set goals, track progress, and achieve mastery with our adaptive learning platform
              </p>
            </div>
          </div>
          
          {/* Content Sections */}
          <div className="w-full max-w-8xl mx-auto">
            {/* Section 1: Goal Setting */}
            <ContentSection
              title="Smart Goal Setting"
              descriptions={[
                "Our platform helps you define clear, achievable learning goals tailored to your needs and aspirations.",
                "Whether you're learning a new language, mastering a skill, or preparing for an exam, we guide you through the entire process."
              ]}
              textSide="left"
              bgGradient="from-amber-50 to-orange-50"
              animationVariant="slide"
              visual={
                <div className="bg-gradient-to-r from-amber-100 to-orange-100  rounded-xl shadow-sm border border-gray-100 p-5">
                  <InfiniteGoalAnimation />
                  <div className="flex justify-center">
                    <button type='button' className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm">
                      Create Your First Goal
                    </button>
                  </div>
                </div>
              }
              additionalContent={
                <div className="space-y-3 mt-6">
                  {[
                    "Personalized learning path based on your specific needs",
                    "AI-powered recommendations to optimize your progress",
                    "Automatic adjustments based on your performance",
                    "Continuous feedback to keep you motivated"
                  ].map((benefit, i) => (
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
            
            {/* Section 2: Testing & Progress */}
            <ContentSection
              title="Adaptive Testing"
              descriptions={[
                "Our intelligent assessment system adapts to your knowledge level, focusing on areas where you need the most improvement.",
                "Regular tests reinforce your learning and provide instant feedback to keep you on the right track."
              ]}
              textSide="right"
              bgGradient="from-indigo-50 to-purple-50"
              animationVariant="scale"
              visual={
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="mb-5 flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                    <h4 className="font-medium text-indigo-800">Quiz Progress</h4>
                    <span className="text-sm font-medium bg-white px-2 py-1 rounded-full text-indigo-800">75%</span>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { 
                        correct: true, 
                        question: "What is the primary benefit of spaced repetition?", 
                        answer: "Improving long-term memory retention" 
                      },
                      { 
                        correct: false, 
                        question: "How many repetitions are needed to commit something to memory?", 
                        answer: "Always exactly 3 repetitions" 
                      }
                    ].map((q, index) => (
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
                              Your answer: <span className={q.correct ? 'text-green-700' : 'text-red-700'}>
                                {q.answer}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4 flex justify-center">
                      <button className="bg-indigo-600 text-white text-sm font-medium py-2 px-6 rounded-lg">
                        Continue Learning
                      </button>
                    </div>
                  </div>
                </div>
              }
              additionalContent={
                <div className="mt-6 space-y-4">
                  {[
                    {
                      title: "Personalized Testing",
                      description: "Questions adapt to your knowledge level for optimal challenge"
                    },
                    {
                      title: "Spaced Repetition",
                      description: "Review concepts at scientifically-optimized intervals for retention"
                    },
                    {
                      title: "Detailed Feedback",
                      description: "Understand why answers are correct or incorrect for better learning"
                    }
                  ].map((benefit, i) => (
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
            
            {/* Section 3: Analytics */}
            <ContentSection
              title="Progress Analytics"
              descriptions={[
                "Track your learning journey with comprehensive analytics that highlight your strengths and areas for improvement.",
                "Visualize your progress over time and gain insights into your learning patterns to optimize your study habits."
              ]}
              textSide="left"
              bgGradient="from-emerald-50 to-teal-50"
              animationVariant="stagger"
              visual={
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="p-3 bg-emerald-50 rounded-lg mb-4">
                    <h4 className="font-medium text-emerald-800 mb-3">Weekly Progress</h4>
                    <div className="h-32 bg-white rounded-lg p-2 flex items-end space-x-2">
                      {[40, 65, 45, 80, 60, 75, 90].map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-emerald-400 rounded-t" 
                            style={{ height: `${height}%` }}
                          ></div>
                          <span className="text-xs text-gray-500 mt-1">W{i+1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <div className="py-2 px-4 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                      Completion Rate
                    </div>
                    <div className="py-2 px-4 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                      Knowledge Retention
                    </div>
                    <div className="py-2 px-4 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                      Mastery Level
                    </div>
                  </div>
                </div>
              }
              additionalContent={
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg mt-6">
                  <h4 className="font-medium text-emerald-800 mb-2">Key Insight</h4>
                  <p className="text-emerald-700 text-sm">Your retention rate improves significantly when you study in the morning and review concepts before bedtime. Try to maintain this pattern for optimal learning efficiency.</p>
                </div>
              }
            />
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