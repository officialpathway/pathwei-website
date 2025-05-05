'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Users, BarChart, Settings } from 'lucide-react';
import { Widget, WidgetProps } from './Widgets';
import { useRouter } from 'next/navigation';

// Action Interface
export interface Action {
  title: string;
  icon: React.ElementType;
  url: string;
}

// Quick Actions Widget Props
export interface QuickActionsWidgetProps extends Omit<WidgetProps, 'title' | 'description' | 'children'> {
  actions?: Action[];
  title?: string;
  description?: string;
}

// Quick Actions Widget Component
export function QuickActionsWidget({ 
  size = '2x1', 
  className, 
  title = "Quick Actions",
  description = "Common administrative tasks",
  icon,
  iconClassName,
  actions,
  ...props
}: QuickActionsWidgetProps) {
  const router = useRouter();
  
  // Default actions if none provided
  const defaultActions: Action[] = [
    {
      title: 'Manage Content',
      icon: FileText,
      url: '/admin/content'
    },
    {
      title: 'Manage Users',
      icon: Users,
      url: '/admin/users'
    },
    {
      title: 'View Analytics',
      icon: BarChart,
      url: '/admin/analytics'
    },
    {
      title: 'Settings',
      icon: Settings,
      url: '/admin/settings'
    }
  ];
  
  const displayActions = actions || defaultActions;
  
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
      <div className="grid grid-cols-2 gap-3">
        {displayActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button 
              key={index}
              variant="outline"
              className="justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
              onClick={() => router.push(action.url)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {action.title}
            </Button>
          );
        })}
      </div>
    </Widget>
  );
}