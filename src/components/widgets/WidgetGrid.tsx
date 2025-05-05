'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils/utils';

export type WidgetColumnCount = 1 | 2 | 3 | 4 | 6;
export type WidgetGapSize = 2 | 4 | 6 | 8;

// Widget Grid Props
export interface WidgetGridProps {
  children: ReactNode;
  columns?: WidgetColumnCount;
  gap?: WidgetGapSize;
  className?: string;
}

// Widget Grid Component
export function WidgetGrid({ 
  children, 
  columns = 4, 
  gap = 6, 
  className 
}: WidgetGridProps) {
  const gridClassName = cn(
    'grid gap-4 md:gap-6',
    {
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-4': columns === 4,
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': columns === 3,
      'grid-cols-1 md:grid-cols-2': columns === 2,
      'grid-cols-1': columns === 1,
      'grid-cols-1 md:grid-cols-3 lg:grid-cols-6': columns === 6,
      'gap-2': gap === 2,
      'gap-4': gap === 4,
      'gap-6': gap === 6,
      'gap-8': gap === 8,
    },
    className
  );
  
  return (
    <div className={gridClassName}>
      {children}
    </div>
  );
}