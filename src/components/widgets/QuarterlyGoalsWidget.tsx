'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Widget, WidgetProps } from './Widgets';

// Goal Interface
export interface Goal {
  name: string;
  current: number;
  target: number;
  percentage: number;
}

// Goals Widget Props
export interface QuarterlyGoalsWidgetProps extends Omit<WidgetProps, 'title' | 'description' | 'children'> {
  goals: Goal[];
  title?: string;
  description?: string;
}

// Quarterly Goals Widget Component
export function QuarterlyGoalsWidget({ 
  goals = [], 
  size = '2x1', 
  className, 
  title = "Quarterly Goals",
  description = "Progress towards targets",
  icon,
  iconClassName,
  ...props
}: QuarterlyGoalsWidgetProps) {
  return (
    <Widget
      title={title}
      description={description}
      size={size}
      className={className}
      icon={icon}
      iconClassName={iconClassName}
      {...props}
    >
      <div className="space-y-4">
        {goals.map((goal, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-300">{goal.name}</span>
              <span className="text-sm text-gray-400">
                {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
              </span>
            </div>
            <Progress 
              value={goal.percentage} 
              className="h-2 bg-gray-700" 
              indicatorClassName="bg-indigo-500" 
            />
          </div>
        ))}
      </div>
    </Widget>
  );
}