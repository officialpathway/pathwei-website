'use client';

import { Button } from '@/components/ui/button';
import { Widget, WidgetProps } from '@/components/widgets/Widgets';
import { ReactNode } from 'react';

export interface StatusInfo {
  title: string;
  details: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface StatusWidgetProps extends Omit<WidgetProps, 'children'> {
  statusInfo: StatusInfo;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
  customContent?: ReactNode;
}

export function StatusWidget({
  title,
  description,
  size = '3x1',
  statusInfo,
  actions = [],
  customContent,
  ...props
}: StatusWidgetProps) {
  const statusColorMap = {
    success: 'border-green-500',
    warning: 'border-yellow-500',
    error: 'border-red-500',
    info: 'border-blue-500'
  };

  return (
    <Widget
      title={title}
      description={description}
      size={size}
      {...props}
    >
      <div className="space-y-4">
        <div className={`bg-gray-800/50 p-3 rounded border-l-2 ${statusColorMap[statusInfo.status]}`}>
          <div className="font-medium text-white">{statusInfo.title}</div>
          <div className="text-sm text-gray-400">{statusInfo.details}</div>
        </div>
        
        {/* Render custom content if provided */}
        {customContent && (
          <div className="mt-4">
            {customContent}
          </div>
        )}
        
        {/* Only render actions if there are any */}
        {actions.length > 0 && (
          <div className="flex space-x-2">
            {actions.map((action, index) => (
              <Button 
                key={index}
                variant="outline"
                className="flex-1 justify-center border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </Widget>
  );
}