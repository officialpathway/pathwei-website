// components/widgets/LastUpdatedWidget.tsx
'use client';

import { Clock } from 'lucide-react';
import { Widget, WidgetSize } from '@/components/widgets/Widgets';

interface LastUpdatedWidgetProps {
  lastUpdated: string | null;
  size?: WidgetSize;
  className?: string;
  requiredRole?: 'admin' | 'manager' | 'editor' | 'viewer' | 'all';
  userRole?: string;
}

export function LastUpdatedWidget({
  lastUpdated,
  size = '1x1',
  className,
  requiredRole = 'all',
  userRole = 'all'
}: LastUpdatedWidgetProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <Widget
      title="Last Subscription"
      description="Most recent newsletter subscription"
      icon={Clock}
      iconClassName="bg-amber-500/20"
      size={size}
      className={className}
      requiredRole={requiredRole}
      userRole={userRole}
    >
      <div className="flex flex-col items-center justify-center h-full">
        {lastUpdated ? (
          <div className="text-center">
            <div className="text-lg font-semibold text-white mb-1">
              {getRelativeTime(lastUpdated)}
            </div>
            <div className="text-sm text-gray-400">
              {formatDate(lastUpdated)}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-400">
              No subscriptions yet
            </div>
            <div className="text-sm text-gray-500">
              Waiting for first subscriber
            </div>
          </div>
        )}
      </div>
    </Widget>
  );
}