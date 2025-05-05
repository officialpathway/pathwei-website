'use client';

import { Widget, WidgetProps } from '@/components/widgets/Widgets';
import { LucideIcon } from 'lucide-react';

export interface PriceStatsWidgetProps extends Omit<WidgetProps, 'children'> {
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
}

export function PriceStatsWidget({
  title,
  description,
  value,
  trend,
  size = '1x1',
  icon: Icon,
  iconClassName,
  ...props
}: PriceStatsWidgetProps) {
  return (
    <Widget
      title={title}
      description={description}
      size={size}
      icon={Icon}
      iconClassName={iconClassName}
      {...props}
    >
      <div className="mt-2">
        <h3 className="text-2xl md:text-3xl font-bold text-white">{value}</h3>
        
        {trend && (
          <div className="flex items-center mt-2">
            <span 
              className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="text-xs text-gray-400 ml-1">vs last period</span>
          </div>
        )}
      </div>
    </Widget>
  );
}