'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Widget, WidgetProps, WidgetAccessLevel  } from './Widgets';

export type ChangeType = 'positive' | 'negative' | 'neutral';

// Stats Widget Props
export interface StatsWidgetProps extends Omit<WidgetProps, 'children'> {
  value: string | number;
  change?: number;
  changeText?: string;
  changeType?: ChangeType;
  userRole?: string;
  requiredRole?: WidgetAccessLevel;
}

// Stats Widget Component
export function StatsWidget({ 
  title, 
  description, 
  value, 
  change, 
  changeText = "from last quarter",
  icon, 
  iconClassName,
  changeType = 'neutral', 
  size = '1x1', 
  className,
  userRole,
  requiredRole,
  ...props
}: StatsWidgetProps) {
  const changeColor = 
    changeType === 'positive' ? 'text-green-500' : 
    changeType === 'negative' ? 'text-red-500' : 
    'text-gray-400';
    
  return (
    <Widget
      title={title}
      description={description}
      size={size}
      className={className}
      icon={icon}
      iconClassName={iconClassName}
      userRole={userRole}
      requiredRole={requiredRole}
      {...props}
    >
      <div className="flex items-center justify-between h-full">
        <div>
          <div className="text-3xl font-bold text-white">{value}</div>
          {change !== undefined && (
            <div className={`text-sm flex items-center ${changeColor}`}>
              <ArrowUpRight className="h-3 w-3 mr-1" />
              {change}% {changeText}
            </div>
          )}
        </div>
      </div>
    </Widget>
  );
}