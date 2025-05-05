'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';
import { Widget, WidgetProps } from './Widgets';
import { useRouter } from 'next/navigation';

// Activity Item Interface
export interface ActivityItem {
  id?: string | number;
  title: string;
  time: string;
  description: string;
  icon?: React.ElementType;
  iconColor?: string;
}

// Activity Widget Props
export interface ActivityLogWidgetProps extends Omit<WidgetProps, 'title' | 'description' | 'footerAction'> {
  activities: ActivityItem[];
  title?: string;
  description?: string;
  viewAllUrl?: string;
}

// Activity Log Widget Component
export function ActivityLogWidget({ 
  activities = [], 
  size = '4x1', 
  className, 
  title = "Recent Activity",
  description = "Latest actions in the system",
  viewAllUrl = '/admin/activity',
  icon,
  iconClassName,
  ...props
}: ActivityLogWidgetProps) {
  const router = useRouter();
  
  return (
    <Widget
      title={title}
      description={description}
      size={size}
      className={className}
      icon={icon}
      iconClassName={iconClassName}
      footerAction={
        <Button 
          variant="outline" 
          className="w-full border-gray-700 text-gray-200 hover:bg-gray-800"
          onClick={() => router.push(viewAllUrl)}
        >
          <Activity className="mr-2 h-4 w-4" />
          View All Activity
        </Button>
      }
      {...props}
    >
      <div className="space-y-4 overflow-y-auto max-h-full">
        {activities.map((activity, index) => (
          <div 
            key={activity.id || index} 
            className={`${index !== activities.length - 1 ? 'border-b border-gray-800 pb-2' : ''}`}
          >
            <div className="flex justify-between">
              <div className="font-medium text-gray-200">{activity.title}</div>
              <div className="text-sm text-gray-400">{activity.time}</div>
            </div>
            <div className="text-sm text-gray-400">{activity.description}</div>
          </div>
        ))}
        
        {activities.length === 0 && (
          <div className="text-center py-6 text-gray-400">
            No recent activity
          </div>
        )}
      </div>
    </Widget>
  );
}