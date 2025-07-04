// CurvedBorder.tsx
import React from 'react';

interface CurvedBorderProps {
  fillColor?: string;
  height?: {
    sm: string;
    md: string;
    lg: string;
  };
  className?: string;
  overlap?: number; // Added overlap prop
}

const CurvedBorder: React.FC<CurvedBorderProps> = ({
  fillColor = 'fill-white',
  height = { sm: 'h-24', md: 'h-32', lg: 'h-40' },
  className = '',
  overlap = 1, // Default overlap
}) => {
  return (
    <div 
      className={`relative w-full overflow-hidden ${className}`}
      style={{ marginBottom: `-${overlap}px` }} // Add negative margin for overlap
    >
      <svg
        className={`w-full ${height.sm} md:${height.md} lg:${height.lg}`}
        viewBox="0 0 1200 122" // Increased viewBox height by 2px
        preserveAspectRatio="none"
      >
        <path
          d="M0,122 L0,95c200,30 400,30 600,0c200,-30 400,-30 600,0v27L0,122Z" // Extended to 122
          className={`${fillColor}`}
        ></path>
      </svg>
    </div>
  );
};

interface GameCurvedBorderProps {
  className?: string;
  height?: {
    sm: string;
    md: string;
    lg: string;
  };
  fillColor?: string;
  overlap?: number; // Added overlap prop
}

export const GameCurvedBorder: React.FC<GameCurvedBorderProps> = ({
  className = '',
  height = { sm: 'h-24', md: 'h-32', lg: 'h-40' },
  fillColor = 'fill-white',
  overlap = 1, // Default overlap slightly larger for this component
}) => {
  return (
    <div 
      className={`relative w-full ${className}`} 
      style={{ marginBottom: `-${overlap}px` }} // More overlap for GameCurvedBorder
    >
      {/* This div continues the background gradient */}
      <div className="absolute inset-0 z-10" style={{ clipPath: "url(#curve-mask)" }}></div>
      
      <svg
        className={`w-full ${height.sm} md:${height.md} lg:${height.lg}`}
        viewBox="0 0 1200 124" // Added extra height on the viewBox
        preserveAspectRatio="none"
      >
        <defs>
          <clipPath id="curve-mask">
            <path d="M0,124v-50.29c47.79,-22.2,103.59,-32.17,158,-28c70.36,5.37,136.33,33.31,206.8,37.5C438.64,87.57,512.34,66.33,583,47.95c69.27,-18,138.3,-24.88,209.4,-13.08c36.15,6,69.85,17.84,104.45,29.34C989.49,95,1113,134.29,1200,67.53V124Z" />
          </clipPath>
        </defs>
        <path
          d="M0,124v-50.29c47.79,-22.2,103.59,-32.17,158,-28c70.36,5.37,136.33,33.31,206.8,37.5C438.64,87.57,512.34,66.33,583,47.95c69.27,-18,138.3,-24.88,209.4,-13.08c36.15,6,69.85,17.84,104.45,29.34C989.49,95,1113,134.29,1200,67.53V124Z"
          className={`${fillColor}`}
        />
      </svg>
    </div>
  );
};

export default CurvedBorder;