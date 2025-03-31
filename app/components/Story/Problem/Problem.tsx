'use client';

import Image from 'next/image';

export default function ProblemSection() {
  return (
    <section id="problem-section" className="relative min-h-screen bg-black overflow-hidden">

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center py-20">
        <div className="container mx-auto px-6">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Problem 1: Content Overload */}
            <div className="space-y-8">
              <div className="p-6 border-2 border-neon-pink/30 bg-black/70 backdrop-blur-sm">
                <h2 className="text-neon-pink text-4xl md:text-6xl font-bold mb-6 glitch-text">
                  CONTENT_OVERLOAD
                </h2>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  The algorithm demands <span className="text-neon-cyan font-medium">constant creation</span> while 
                  drowning you in endless inspiration. You&apos;re stuck between
                  <span className="text-neon-purple font-medium"> producing and consuming</span>.
                </p>
              </div>

              {/* Stats Panel */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/70 border border-neon-green/30 p-4 text-center">
                  <div className="text-neon-green text-3xl font-mono mb-1">87%</div>
                  <div className="text-xs text-neon-green/80">CREATOR BURNOUT</div>
                </div>
                <div className="bg-black/70 border border-neon-cyan/30 p-4 text-center">
                  <div className="text-neon-cyan text-3xl font-mono mb-1">2.3H</div>
                  <div className="text-xs text-neon-cyan/80">DAILY WASTED</div>
                </div>
                <div className="bg-black/70 border border-neon-purple/30 p-4 text-center">
                  <div className="text-neon-purple text-3xl font-mono mb-1">127</div>
                  <div className="text-xs text-neon-purple/80">UNREAD ALERTS</div>
                </div>
              </div>
            </div>

            {/* Problem 2: Digital Exhaustion */}
            <div className="space-y-8">
              <div className="relative h-96 border-2 border-neon-cyan/50 glow-cyan">
                <Image
                  src="/images/notification-hell.jpg"
                  alt="Notification overload"
                  fill
                  className="object-cover"
                />
                <div className="absolute -bottom-4 -left-4 bg-black px-4 py-2 border border-neon-pink">
                  <span className="text-neon-pink font-mono text-sm">SYSTEM_ALERT: 127_UNREAD</span>
                </div>
              </div>

              <div className="p-6 border-2 border-neon-green/30 bg-black/70 backdrop-blur-sm">
                <h3 className="text-neon-green text-2xl md:text-3xl mb-4 flex items-center gap-2">
                  <span className="typewriter">{`>`}</span>
                  <span>DIGITAL_EXHAUSTION</span>
                </h3>
                <p className="text-gray-400">
                  Your tools should <span className="text-neon-yellow font-medium">empower</span> you, 
                  not drain you. Yet every app fights for attention with
                  <span className="text-neon-red font-medium"> endless notifications</span> and
                  <span className="text-neon-red font-medium"> context switches</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-24 h-24 border border-neon-red/50">
        <div className="absolute inset-0 bg-neon-red/10 animate-pulse" />
        <span className="absolute -top-6 left-0 text-xs text-neon-red font-mono">
          ERROR: 0x7F3A21
        </span>
      </div>
      
      <div className="absolute bottom-1/3 right-8 w-16 h-16 border border-neon-blue/50 rotate-45">
        <div className="absolute inset-0 bg-neon-blue/5 animate-pulse" />
      </div>
    </section>
  );
}