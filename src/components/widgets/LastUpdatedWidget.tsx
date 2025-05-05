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
    return new Date(dateString).toLocaleString();
  };

  return (
    <Widget
      title="Last Updated"
      description="When the subscriber list was last modified"
      icon={Clock}
      iconClassName="bg-amber-500/20"
      size={size}
      className={className}
      requiredRole={requiredRole}
      userRole={userRole}
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-xl font-semibold text-white">
          {lastUpdated ? formatDate(lastUpdated) : 'No data available'}
        </div>
      </div>
    </Widget>
  );
}