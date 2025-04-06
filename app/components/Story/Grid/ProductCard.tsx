'use client';

export interface Product {
  name: string;
  description: string;
  color: 'neon-cyan' | 'neon-pink' | 'neon-purple' | 'neon-green';
  stats: string;
}

export function ProductCard({ product }: { product: Product }) {
  const colorMap = {
    'neon-cyan': {
      border: 'border-cyan-400',
      text: 'text-cyan-600',
      glow: 'hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]'
    },
    'neon-pink': {
      border: 'border-pink-400',
      text: 'text-pink-600',
      glow: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]'
    },
    'neon-purple': {
      border: 'border-purple-400',
      text: 'text-purple-600',
      glow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]'
    },
    'neon-green': {
      border: 'border-green-400',
      text: 'text-green-600',
      glow: 'hover:shadow-[0_0_20px_rgba(74,222,128,0.5)]'
    }
  };

  const colors = colorMap[product.color as keyof typeof colorMap];

  return (
    <div className={`relative overflow-hidden p-6 h-full border-2 ${colors.border} ${colors.glow}
      before:absolute before:top-0 before:right-0 before:w-8 before:h-8 before:border-t-2 before:border-r-2 ${colors.border}
      after:absolute after:bottom-0 after:left-0 after:w-8 after:h-8 after:border-b-2 after:border-l-2 ${colors.border}
      transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] hover:-translate-y-2 hover:scale-[1.02] group`}>
      
      {/* Animated border effect */}
      <div className={`absolute inset-0 border-2 ${colors.border} opacity-0 group-hover:opacity-100 
        transition-opacity duration-500 pointer-events-none`}></div>
      
      <div className="flex flex-col h-full relative z-10">
        <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${colors.text} transition-colors duration-300 
          group-hover:text-white`}>
          {product.name}
        </h3>
        
        <p className="text-gray-500 mb-4 flex-grow group-hover:text-gray-200 transition-colors duration-300">
          {product.description}
        </p>
        
        <div className="mt-auto">
          <div className={`h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4 
            group-hover:via-${colors.border.split('-')[1]}-400 transition-all duration-500`}></div>
          
          <p className={`text-sm  ${colors.text} group-hover:font-semibold transition-all duration-200`}>
            {product.stats}
          </p>
        </div>
      </div>
      
      {/* Diagonal cut corner - animated */}
      <div className={`absolute -bottom-[2px] -right-[2px] w-0 h-0 border-l-[24px] border-l-transparent 
        border-b-[24px] ${colors.border} transition-all duration-300 group-hover:border-b-[28px]`} />
      
      {/* Hover scan line effect */}
      <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent 
        via-${colors.border.split('-')[1]}-400 to-transparent opacity-0 group-hover:opacity-100 
        group-hover:animate-scanline pointer-events-none`}></div>
    </div>
  );
}