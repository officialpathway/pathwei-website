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
}

const CurvedBorder: React.FC<CurvedBorderProps> = ({
  fillColor = 'fill-white',
  height = { sm: 'h-24', md: 'h-32', lg: 'h-40' },
  className = '',
}) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <svg
        className={`w-full ${height.sm} ${height.md} ${height.lg}`}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,120 L0,95c200,30 400,30 600,0c200,-30 400,-30 600,0v25L0,120Z"
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
  fillColor?: string; // Added fillColor prop
}

export const GameCurvedBorder: React.FC<GameCurvedBorderProps> = ({
  className = '',
  height = { sm: 'h-24', md: 'h-32', lg: 'h-40' },
  fillColor = 'fill-white', // Default value
}) => {
  return (
    <div className={`relative w-full ${className}`} style={{ marginBottom: "-1px" }}>
      {/* This div continues the background gradient */}
      <div className="absolute inset-0 z-10" style={{ clipPath: "url(#curve-mask)" }}></div>
      
      <svg
        className={`w-full ${height.sm} md:${height.md} lg:${height.lg}`}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <defs>
          <clipPath id="curve-mask">
            <path d="M0,120v-46.29c47.79,-22.2,103.59,-32.17,158,-28c70.36,5.37,136.33,33.31,206.8,37.5C438.64,87.57,512.34,66.33,583,47.95c69.27,-18,138.3,-24.88,209.4,-13.08c36.15,6,69.85,17.84,104.45,29.34C989.49,95,1113,134.29,1200,67.53V120Z" />
          </clipPath>
        </defs>
        <path
          d="M0,120v-46.29c47.79,-22.2,103.59,-32.17,158,-28c70.36,5.37,136.33,33.31,206.8,37.5C438.64,87.57,512.34,66.33,583,47.95c69.27,-18,138.3,-24.88,209.4,-13.08c36.15,6,69.85,17.84,104.45,29.34C989.49,95,1113,134.29,1200,67.53V120Z"
          className={`${fillColor}`} // Apply the fillColor prop
        />
      </svg>
    </div>
  );
};

export default CurvedBorder;