'use client';

import { Widget, WidgetProps } from '@/components/widgets/Widgets';
import { ReactNode } from 'react';

export interface Activity {
  title: string;
  time: string;
  description: string;
}

export interface ActivityWidgetProps extends Omit<WidgetProps, 'children'> {
  activities: Activity[];
  footerAction?: ReactNode;
}

export function ActivityWidget({
  title,
  description,
  size = '3x1',
  activities,
  footerAction,
  ...props
}: ActivityWidgetProps) {
  return (
    <Widget
      title={title}
      description={description}
      size={size}
      footerAction={footerAction}
      {...props}
    >
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="border-l-2 border-indigo-500 pl-3 py-1">
            <div className="font-medium text-white">{activity.title}</div>
            <div className="text-xs text-gray-400">{activity.time}</div>
            <div className="text-sm text-gray-300 mt-1">{activity.description}</div>
          </div>
        ))}
      </div>
    </Widget>
  );
}