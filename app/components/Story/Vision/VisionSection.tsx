// components/VisionSection.tsx
'use client';

import Particles from '@/app/components/common/Particles';

export default function VisionSection() {
  return (
    <section className="relative h-screen w-full bg-white overflow-hidden">
      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles color="#000000" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full w-full flex items-center justify-center text-center px-4">
        <div className="max-w-6xl mx-auto p-8 md:p-12">
          <h2 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-6 text-black">
            HUMAN 2.0
          </h2>
          <p className="text-2xl sm:text-3xl md:text-4xl text-gray-800 mb-8">
            Augmenting human potential through symbiotic AI
          </p>
          <div className="border-t-2 border-black pt-8">
            <p className="text-3xl sm:text-4xl md:text-5xl font-light italic text-gray-900">
              &quot;We don&apos;t replace humans - we upgrade them&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}