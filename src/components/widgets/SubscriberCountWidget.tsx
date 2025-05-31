// components/widgets/SubscriberCountWidget.tsx
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
      description="Active newsletter subscribers"
      icon={Users}
      iconClassName="bg-blue-500/20"
      size={size}
      className={className}
      requiredRole={requiredRole}
      userRole={userRole}
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">
            {count.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">
            {count === 1 ? 'subscriber' : 'subscribers'}
          </div>
        </div>
      </div>
    </Widget>
  );
}