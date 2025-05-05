'use client';

import { Users } from 'lucide-react';
import { Widget, WidgetSize } from '@/components/widgets/Widgets';

interface SubscriberCountWidgetProps {
  count: number;
  size?: WidgetSize;
  className?: string;
  requiredRole?: 'admin' | 'manager' | 'editor' | 'viewer' | 'all';
  userRole?: string;
}

export function SubscriberCountWidget({
  count,
  size = '1x1',
  className,
  requiredRole = 'all',
  userRole = 'all'
}: SubscriberCountWidgetProps) {
  return (
    <Widget
      title="Total Subscribers"
      description="Number of newsletter subscribers"
      icon={Users}
      iconClassName="bg-blue-500/20"
      size={size}
      className={className}
      requiredRole={requiredRole}
      userRole={userRole}
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-3xl font-bold text-white">
          {count.toLocaleString()}
        </div>
      </div>
    </Widget>
  );
}