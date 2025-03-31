'use client';
import Image from 'next/image';

export function CyberpunkCard({ 
  name, 
  role, 
  imgSrc, 
  color = 'cyan' 
}: { 
  name: string; 
  role: string; 
  imgSrc?: string; 
  color?: 'cyan' | 'pink' | 'purple' 
}) {
  const colors = {
    cyan: { border: 'border-cyan-400', text: 'text-cyan-400', glow: 'shadow-cyan-500' },
    pink: { border: 'border-pink-400', text: 'text-pink-400', glow: 'shadow-pink-500' },
    purple: { border: 'border-purple-400', text: 'text-purple-400', glow: 'shadow-purple-500' }
  };

  return (
    <div className={`
      relative 
      w-[300px] h-[400px]  /* Fixed width and height */
      p-1 rounded-lg bg-black 
      ${colors[color].border} border-2 
      ${colors[color].glow} shadow-lg
      flex flex-col /* Makes content fill height */
      justify-between
      overflow-hidden /* Ensures rounded corners clip content */
    `}>
      {/* Holographic Image - Fixed height */}
      <div className="relative h-70 w-full overflow-hidden flex-shrink-0">
        <Image
          src={imgSrc || 'https://thispersondoesnotexist.com/'}
          alt={name}
          fill
          className="object-cover object-center holographic-filter"
          sizes="(max-width: 768px) 100vw, 300px"
          priority={true} // Optional: for above-the-fold images
        />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-transparent" />
      </div>
      
      {/* Card Content - Flexible space */}
      <div className="p-4 flex flex-col">
        <div>
          <h3 className={`text-xl font-bold ${colors[color].text} truncate`}>{name}</h3>
          <p className="text-gray-400 font-mono text-sm truncate">{role}</p>
        </div>
        
        {/* Stats Bar - Pushed to bottom */}
        <div className="mt-auto border-t border-gray-800">
          <div className="flex justify-between text-xs font-mono">
            <span className={colors[color].text}>INNOVATION</span>
            <span>87%</span>
          </div>
          <div className="w-full bg-gray-800 h-1 mt-1">
            <div 
              className={`h-full ${colors[color].border.replace('border', 'bg')}`}
              style={{ width: '87%' }}
            />
          </div>
        </div>
      </div>

      {/* Corner Brackets */}
      <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 ${colors[color].border}`} />
      <div className={`absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 ${colors[color].border}`} />
      <div className={`absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 ${colors[color].border}`} />
      <div className={`absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 ${colors[color].border}`} />
    </div>
  );
}