'use client';

import { DollarSign } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Widget, WidgetProps } from '@/components/widgets/Widgets';

export interface PricePerformanceData {
  price: number;
  conversion_rate: number;
  clicks: number;
  conversions: number;
}

export interface BestPriceWidgetProps extends Omit<WidgetProps, 'children'> {
  bestPrice: PricePerformanceData | null;
}

export function BestPriceWidget({
  title = "Best Performing Price",
  description = "Price point with highest conversion rate",
  size = '1x2',
  bestPrice,
  ...props
}: BestPriceWidgetProps) {
  if (!bestPrice) {
    return (
      <Widget
        title={title}
        description={description}
        size={size}
        {...props}
      >
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-400">No data available</p>
        </div>
      </Widget>
    );
  }

  return (
    <Widget
      title={title}
      description={description}
      size={size}
      {...props}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center my-4">
          <div className="h-20 w-20 rounded-full bg-blue-900/30 border-2 border-blue-500 flex items-center justify-center">
            <DollarSign className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white">${bestPrice.price.toFixed(2)}</h3>
          <p className="text-gray-400 mt-1">Optimal price point</p>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Conversion Rate</span>
              <span className="font-medium text-white">{bestPrice.conversion_rate.toFixed(2)}%</span>
            </div>
            <Progress 
              value={Math.min(100, bestPrice.conversion_rate * 2)} 
              className="h-2 bg-gray-700" 
              indicatorClassName="bg-blue-500" 
            />
          </div>
          
          <div className="flex flex-col space-y-3 pt-4 mt-auto">
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Clicks</div>
              <div className="font-bold text-white">{bestPrice.clicks.toLocaleString()}</div>
            </div>
            
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Conversions</div>
              <div className="font-bold text-white">{bestPrice.conversions.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </Widget>
  );
}