'use client';

import { Widget, WidgetProps } from '@/components/widgets/Widgets';

export interface PriceData {
  price: number;
  conversion_rate: number;
}

export interface PriceDistributionChartWidgetProps extends Omit<WidgetProps, 'children'> {
  data: PriceData[];
  bestPrice: PriceData | null;
}

export function PriceDistributionChartWidget({
  title = "Conversion Rate by Price",
  description = "Visual comparison of all price points",
  size = '4x1',
  data = [],
  bestPrice,
  ...props
}: PriceDistributionChartWidgetProps) {
  return (
    <Widget
      title={title}
      description={description}
      size={size}
      {...props}
    >
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-400">No data available</p>
        </div>
      ) : (
        <div className="flex h-full items-end justify-between space-x-2 px-2">
          {data.map((stat, index) => {
            const heightPercentage = bestPrice 
              ? (stat.conversion_rate / bestPrice.conversion_rate) * 100 
              : 0;
            
            const isBest = bestPrice && stat.price === bestPrice.price;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-full rounded-t-sm ${isBest ? 'bg-blue-500' : 'bg-gray-600'}`} 
                  style={{ height: `${heightPercentage}%` }}
                ></div>
                <div className="mt-2 text-center">
                  <div className={`text-xs ${isBest ? 'text-blue-400' : 'text-gray-400'}`}>
                    ${stat.price.toFixed(2)}
                  </div>
                  <div className={`text-xs font-bold ${isBest ? 'text-blue-300' : 'text-gray-300'}`}>
                    {stat.conversion_rate.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Widget>
  );
}