// src/admin/components/shared/LoadingSpinner.tsx
"use client";

import { RefreshCw } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  text,
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <RefreshCw
        className={`${sizeClasses[size]} text-blue-600 animate-spin`}
      />
      {text && (
        <p className={`mt-2 text-gray-600 ${textSizeClasses[size]}`}>{text}</p>
      )}
    </div>
  );
}

// Inline loading spinner for buttons
export function InlineSpinner({ className = "" }: { className?: string }) {
  return <RefreshCw className={`w-4 h-4 animate-spin ${className}`} />;
}

// Full page loading spinner
export function PageSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

// Table loading skeleton
export function TableSkeleton({
  rows = 5,
  cols = 6,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="animate-pulse">
      <div className="space-y-3">
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {[...Array(cols)].map((_, j) => (
              <div key={j} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
