'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils/utils';

// Widget Grid Wrapper Props
export interface WidgetGridWrapperProps {
  children: ReactNode;
  className?: string;
}

// Widget Grid Wrapper Component for consistent padding and styling
export function WidgetGridWrapper({ 
  children, 
  className 
}: WidgetGridWrapperProps) {
  return (
    <div className={cn(
      "p-4 md:p-6 lg:p-8",
      className
    )}>
      {children}
    </div>
  );
}