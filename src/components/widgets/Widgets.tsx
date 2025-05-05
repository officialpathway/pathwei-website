'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';
import React, { ReactNode } from 'react';
import { Lock } from 'lucide-react';

// Widget size types
export type WidgetSize = '1x1' | '1x2' | '2x1' | '2x2' | '3x1' | '3x2' | '4x1' | '4x2' | 'full';

// Access level for widgets
export type WidgetAccessLevel = 'admin' | 'manager' | 'editor' | 'viewer' | 'all';

// Size map for widget dimensions
const sizeClassMap: Record<WidgetSize, string> = {
  '1x1': 'col-span-1 row-span-1',
  '1x2': 'col-span-1 row-span-2',
  '2x1': 'col-span-2 row-span-1',
  '2x2': 'col-span-2 row-span-2',
  '3x1': 'col-span-3 row-span-1',
  '3x2': 'col-span-3 row-span-2',
  '4x1': 'col-span-4 row-span-1',
  '4x2': 'col-span-4 row-span-2',
  'full': 'col-span-full',
};

// Role hierarchy for permission checks
const roleHierarchy: Record<string, number> = {
  'admin': 100,
  'manager': 75,
  'editor': 50,
  'viewer': 25,
  'all': 0
};

// Base Widget Props
export interface WidgetProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  size?: WidgetSize;
  className?: string;
  headerAction?: ReactNode;
  footerAction?: ReactNode;
  icon?: React.ElementType;
  iconClassName?: string;
  requiredRole?: WidgetAccessLevel; // New prop for role-based access
  userRole?: string; // Current user's role
}

// Base Widget Component
export function Widget({ 
  title, 
  description, 
  children, 
  size = '1x1', 
  className,
  headerAction,
  footerAction,
  icon: Icon,
  iconClassName,
  requiredRole = 'all', // Default to accessible for all
  userRole = 'all'}: WidgetProps) {
  // Check if user has access to this widget
  const hasAccess = roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  
  return (
    <Card className={cn(
      "bg-gray-900 border-gray-800 shadow-lg overflow-hidden h-full flex flex-col relative",
      sizeClassMap[size],
      className
    )}>
      {/* Blur overlay for restricted content */}
      {!hasAccess && (
        <div className="absolute inset-0 backdrop-blur-md bg-gray-900/70 z-10 flex flex-col items-center justify-center">
          <Lock className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-400 font-medium">Restricted Content</p>
          <p className="text-gray-500 text-sm">
            {requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1)} access required
          </p>
        </div>
      )}
      
      {(title || description || headerAction || Icon) && (
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <div className="flex items-start gap-3">
            {Icon && (
              <div className={cn(
                "rounded-full p-2 bg-gray-800 flex items-center justify-center",
                iconClassName
              )}>
                <Icon className="h-5 w-5 text-indigo-400" />
              </div>
            )}
            <div className="space-y-1">
              {title && <CardTitle className="text-lg text-white">{title}</CardTitle>}
              {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
            </div>
          </div>
          {headerAction && (
            <div className="ml-2">{headerAction}</div>
          )}
        </CardHeader>
      )}
      <CardContent className="flex-1">
        {children}
      </CardContent>
      {footerAction && (
        <div className="px-6 pb-6 pt-2 mt-auto">
          {footerAction}
        </div>
      )}
    </Card>
  );
}