'use client';

import { Mail, Clock } from 'lucide-react';
import { Widget, WidgetSize } from '@/components/widgets/Widgets';

interface LatestSubscriberWidgetProps {
  lastSubscription: string | null;
  size?: WidgetSize;
  className?: string;
  requiredRole?: 'admin' | 'manager' | 'editor' | 'viewer' | 'all';
  userRole?: string;
}

export function LatestSubscriberWidget({
  lastSubscription,
  size = '1x2',
  className,
  requiredRole = 'all',
  userRole = 'all'
}: LatestSubscriberWidgetProps) {
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <Widget 
      title="Latest Subscription" 
      description="Most recent subscriber information"
      icon={Mail}
      iconClassName="bg-green-500/20"
      size={size}
      className={className}
      requiredRole={requiredRole}
      userRole={userRole}
    >
      <div className="flex flex-col justify-center h-full p-2">
        {lastSubscription ? (
          <div className="text-center">
            <div className="text-gray-400 mb-2">Last subscription at:</div>
            <div className="text-xl font-semibold text-white mb-3">
              {formatDate(lastSubscription)}
            </div>
            <div className="text-gray-400 text-sm">
              <Clock className="inline h-4 w-4 mr-1" />
              {new Date(lastSubscription).toLocaleDateString()} | {new Date(lastSubscription).toLocaleTimeString()}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            No subscription data available
          </div>
        )}
      </div>
    </Widget>
  );
}