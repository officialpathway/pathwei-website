'use client';

import { Button } from '@/components/ui/button';
import { Widget, WidgetProps } from '@/components/widgets/Widgets';
import { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface NavigationItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

export interface NavigationWidgetProps extends Omit<WidgetProps, 'children'> {
  items: NavigationItem[];
}

export function NavigationWidget({
  title,
  description,
  size = '1x2',
  items,
  ...props
}: NavigationWidgetProps) {
  const router = useRouter();

  return (
    <Widget
      title={title}
      description={description}
      size={size}
      {...props}
    >
      <div className="space-y-2">
        {items.map((item, index) => (
          <Button 
            key={index}
            variant="outline"
            className="w-full justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
            onClick={() => router.push(item.path)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </div>
    </Widget>
  );
}