'use client';

import React from 'react';
import { Widget, WidgetProps } from './Widgets';

// Status Item Interface
export interface StatusItem {
  name: string;
  status: 'operational' | 'warning' | 'error';
}

// System Status Widget Props
export interface SystemStatusWidgetProps extends Omit<WidgetProps, 'title' | 'description' | 'children'> {
  statusItems?: StatusItem[];
  title?: string;
  description?: string;
}

// System Status Widget Component
export function SystemStatusWidget({ 
  statusItems,
  size = '2x1', 
  className, 
  title = "System Status",
  description = "Performance and uptime",
  icon,
  iconClassName,
  ...props
}: SystemStatusWidgetProps) {
  // Default status items if none provided
  const defaultStatusItems: StatusItem[] = [
    { name: 'API Status', status: 'operational' },
    { name: 'Database', status: 'operational' },
    { name: 'Storage', status: 'warning' },
    { name: 'Server Load', status: 'operational' }
  ];
  
  const displayItems = statusItems || defaultStatusItems;
  
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
      <div className="space-y-2">
        {displayItems.map((item, index) => {
          const statusColors = {
            operational: 'bg-green-500/20 text-green-500',
            warning: 'bg-yellow-500/20 text-yellow-500',
            error: 'bg-red-500/20 text-red-500'
          };
          
          const statusLabels = {
            operational: 'Operational',
            warning: 'High Usage',
            error: 'Error'
          };
          
          return (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-300">{item.name}</span>
              <span className={`text-xs ${statusColors[item.status]} px-2 py-1 rounded-full`}>
                {statusLabels[item.status]}
              </span>
            </div>
          );
        })}
      </div>
    </Widget>
  );
}