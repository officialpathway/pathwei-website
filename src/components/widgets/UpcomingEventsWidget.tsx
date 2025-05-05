'use client';

import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Widget, WidgetProps } from './Widgets';
import { useRouter } from 'next/navigation';

// Event Interface
export interface Event {
  title: string;
  date: string;
  color?: string;
}

// Upcoming Events Widget Props
export interface UpcomingEventsWidgetProps extends Omit<WidgetProps, 'title' | 'description' | 'children' | 'headerAction'> {
  events?: Event[];
  title?: string;
  description?: string;
  addEventUrl?: string;
}

// Upcoming Events Widget Component
export function UpcomingEventsWidget({ 
  events,
  size = '2x1', 
  className, 
  title = "Upcoming Events",
  description,
  addEventUrl = '/admin/schedule',
  icon,
  iconClassName,
  ...props
}: UpcomingEventsWidgetProps) {
  const router = useRouter();
  
  // Default events if none provided
  const defaultEvents: Event[] = [
    { title: 'Team Meeting', date: 'Tomorrow, 10:00 AM', color: 'border-indigo-500' },
    { title: 'Product Launch', date: 'May 10, 2025', color: 'border-blue-500' },
    { title: 'Marketing Campaign', date: 'May 15, 2025', color: 'border-green-500' }
  ];
  
  const displayEvents = events || defaultEvents;
  
  // Generate description with current month if not provided
  const eventDescription = description || `For ${format(new Date(), 'MMMM yyyy')}`;
  
  return (
    <Widget
      title={title}
      description={eventDescription}
      size={size}
      className={className}
      icon={icon}
      iconClassName={iconClassName}
      headerAction={
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.push(addEventUrl)}
          className="h-8 w-8 text-gray-400 hover:text-white"
        >
          <Plus className="h-4 w-4" />
        </Button>
      }
      {...props}
    >
      <div className="space-y-3">
        {displayEvents.map((event, index) => (
          <div key={index} className={`bg-gray-800/50 p-2 rounded border-l-2 ${event.color || 'border-indigo-500'}`}>
            <div className="font-medium text-white">{event.title}</div>
            <div className="text-xs text-gray-400">{event.date}</div>
          </div>
        ))}
      </div>
    </Widget>
  );
}