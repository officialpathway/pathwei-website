/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';
import React, { ReactNode } from 'react';
import Image from 'next/image';

// Widget size types for better TypeScript support
export type WidgetSize = '1x1' | '1x2' | '2x1' | '2x2' | '3x1' | '3x2' | '4x1' | '4x2' | 'full';
export type WidgetColumnCount = 1 | 2 | 3 | 4 | 6;
export type WidgetGapSize = 2 | 4 | 6 | 8;
export type ChangeType = 'positive' | 'negative' | 'neutral';

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

// Base Widget Props
export interface WidgetProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  size?: WidgetSize;
  className?: string;
  headerAction?: ReactNode;
  footerAction?: ReactNode;
  icon?: React.ElementType; // Added icon prop
  iconClassName?: string;    // Added icon styling
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
  icon: Icon, // Add icon to destructuring
  iconClassName
}: WidgetProps) {
  return (
    <Card className={cn(
      "bg-gray-900 border-gray-800 shadow-lg overflow-hidden h-full flex flex-col",
      sizeClassMap[size],
      className
    )}>
      {(title || description || headerAction || Icon) && (
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Render icon if provided */}
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

// Widget Grid Props
export interface WidgetGridProps {
  children: ReactNode;
  columns?: WidgetColumnCount;
  gap?: WidgetGapSize;
  className?: string;
}

// Widget Grid Component
export function WidgetGrid({ 
  children, 
  columns = 4, 
  gap = 6, 
  className 
}: WidgetGridProps) {
  const gridClassName = cn(
    'grid gap-4 md:gap-6',
    {
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-4': columns === 4,
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': columns === 3,
      'grid-cols-1 md:grid-cols-2': columns === 2,
      'grid-cols-1': columns === 1,
      'grid-cols-1 md:grid-cols-3 lg:grid-cols-6': columns === 6,
      'gap-2': gap === 2,
      'gap-4': gap === 4,
      'gap-6': gap === 6,
      'gap-8': gap === 8,
    },
    className
  );
  
  return (
    <div className={gridClassName}>
      {children}
    </div>
  );
}

// Stats Widget Props
export interface StatsWidgetProps extends Omit<WidgetProps, 'children'> {
  value: string | number;
  change?: ReactNode;
  changeType?: ChangeType;
}

// Stats Widget Component
export function StatsWidget({ 
  title, 
  description, 
  value, 
  change, 
  icon, 
  iconClassName,
  changeType = 'neutral', 
  size = '1x1', 
  className,
  ...props
}: StatsWidgetProps) {
  const changeColor = 
    changeType === 'positive' ? 'text-green-500' : 
    changeType === 'negative' ? 'text-red-500' : 
    'text-gray-400';
    
  return (
    <Widget
      title={title}
      description={description}
      size={size}
      className={className}
      icon={icon}
      iconClassName={iconClassName}
      {...props}
    >
      <div className="flex items-center justify-between h-full">
        <div>
          <div className="text-3xl font-bold text-white">{value}</div>
          {change && (
            <div className={`text-sm flex items-center ${changeColor}`}>
              {change}
            </div>
          )}
        </div>
        {/* We no longer need this icon here since it's in the header */}
      </div>
    </Widget>
  );
}

// Activity Item Interface
export interface ActivityItem {
  id?: string | number;
  title: string;
  time: string;
  description: string;
  icon?: React.ElementType;
  iconColor?: string;
}

// Activity Widget Props
export interface ActivityWidgetProps extends Omit<WidgetProps, 'title' | 'description'> {
  activities: ActivityItem[];
  title?: string;
  description?: string;
}

// Activity Widget Component
export function ActivityWidget({ 
  activities = [], 
  size = '2x2', 
  className, 
  footerAction,
  title = "Recent Activity",
  description = "Latest actions in the system",
  icon,
  iconClassName,
  ...props
}: ActivityWidgetProps) {
  return (
    <Widget
      title={title}
      description={description}
      size={size}
      className={className}
      footerAction={footerAction}
      icon={icon}
      iconClassName={iconClassName}
      {...props}
    >
      <div className="space-y-4 overflow-y-auto max-h-full">
        {activities.map((activity, index) => (
          <div 
            key={activity.id || index} 
            className={`${index !== activities.length - 1 ? 'border-b border-gray-800 pb-2' : ''}`}
          >
            <div className="flex justify-between">
              <div className="font-medium text-gray-200">{activity.title}</div>
              <div className="text-sm text-gray-400">{activity.time}</div>
            </div>
            <div className="text-sm text-gray-400">{activity.description}</div>
          </div>
        ))}
        
        {activities.length === 0 && (
          <div className="text-center py-6 text-gray-400">
            No recent activity
          </div>
        )}
      </div>
    </Widget>
  );
}

// User Interface for UserWidget
export interface UserData {
  id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  last_active: string;
  avatarUrl?: string | null;
}

// User Widget Props
export interface UserWidgetProps extends Omit<WidgetProps, 'title' | 'description'> {
  user: UserData;
  title?: string;
  description?: string;
}

// User Widget Component
export function UserWidget({ 
  user, 
  size = '1x1', 
  className, 
  footerAction,
  title = "User Information",
  description = "Your account details and status",
  icon,
  iconClassName,
  ...props
}: UserWidgetProps) {
  return (
    <Widget
      title={title}
      description={description}
      size={size}
      className={className}
      footerAction={footerAction}
      icon={icon}
      iconClassName={iconClassName}
      {...props}
    >
      <div className="space-y-4">
        <div className="flex items-center">
          {user.avatarUrl ? (
            <div className="h-12 w-12 overflow-hidden rounded-full mr-4 relative">
              <Image 
                src={user.avatarUrl} 
                alt={user.name}
                width={48}
                height={48}
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-4">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-medium text-white">{user.name}</div>
            <div className="text-sm text-gray-400">{user.email}</div>
          </div>
        </div>
        
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Role</span>
            <span className="font-medium capitalize text-gray-200">{user.role}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Status</span>
            <span className="font-medium capitalize text-gray-200">{user.status}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Last Active</span>
            <span className="font-medium text-gray-200">
              {new Date(user.last_active).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Widget>
  );
}

// Chart Data Item Interface for ChartWidget
export interface ChartDataItem {
  name: string;
  value: number;
  [key: string]: any;
}

// Table Data Item Interface for TableWidget
export interface TableColumn {
  key: string;
  title: string;
  render?: (value: any, item: any) => React.ReactNode;
}

// Table Widget Props
export interface TableWidgetProps extends Omit<WidgetProps, 'children'> {
  columns: TableColumn[];
  data: any[];
  emptyMessage?: string;
}

// Table Widget Component
export function TableWidget({
  columns,
  data,
  size = '4x2',
  emptyMessage = "No data available",
  icon,
  iconClassName,
  ...props
}: TableWidgetProps) {
  return (
    <Widget
      size={size}
      icon={icon}
      iconClassName={iconClassName}
      {...props}
    >
      <div className="overflow-x-auto -mx-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className="hover:bg-gray-800/50"
                >
                  {columns.map((column) => (
                    <td 
                      key={`${rowIndex}-${column.key}`} 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                    >
                      {column.render 
                        ? column.render(item[column.key], item)
                        : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-6 py-8 text-center text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Widget>
  );
}

// Card Group Widget Props
export interface CardGroupItem {
  id?: string | number;
  title: string;
  value: string | number;
  icon?: React.ElementType;
  color?: string;
  trend?: number;
  trendLabel?: string;
}

// Card Group Widget Props
export interface CardGroupWidgetProps extends Omit<WidgetProps, 'children'> {
  cards: CardGroupItem[];
}

// Card Group Widget Component
export function CardGroupWidget({
  cards,
  size = '4x1',
  icon,
  iconClassName,
  ...props
}: CardGroupWidgetProps) {
  return (
    <Widget
      size={size}
      icon={icon}
      iconClassName={iconClassName}
      {...props}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div 
            key={card.id || index} 
            className="bg-gray-800 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">{card.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                {card.trend !== undefined && (
                  <div className={`text-xs mt-1 ${
                    card.trend > 0 ? 'text-green-500' : 
                    card.trend < 0 ? 'text-red-500' : 
                    'text-gray-400'
                  }`}>
                    {card.trend > 0 ? '↑' : card.trend < 0 ? '↓' : '•'} {Math.abs(card.trend)}% 
                    {card.trendLabel && ` ${card.trendLabel}`}
                  </div>
                )}
              </div>
              {card.icon && (
                <div className={`p-2 rounded-full ${card.color || 'bg-indigo-500/20'}`}>
                  <card.icon className={`h-5 w-5 ${card.color ? 'text-white' : 'text-indigo-500'}`} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
}

// Calendar Event Interface
export interface CalendarEvent {
  id?: string | number;
  title: string;
  date: string | Date;
  time?: string;
  color?: string;
  category?: string;
}

// Calendar Widget Props
export interface CalendarWidgetProps extends Omit<WidgetProps, 'children'> {
  events: CalendarEvent[];
  currentMonth?: string | Date;
}

// Calendar Widget Component
export function CalendarWidget({
  events,
  currentMonth = new Date(),
  size = '2x2',
  icon,
  iconClassName,
  ...props
}: CalendarWidgetProps) {
  const formattedMonth = typeof currentMonth === 'string' 
    ? currentMonth 
    : currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Widget
      size={size}
      icon={icon}
      iconClassName={iconClassName}
      {...props}
    >
      <div className="space-y-3 overflow-y-auto max-h-full">
        <div className="text-sm font-medium text-gray-300 mb-2">
          {formattedMonth}
        </div>

        {sortedEvents.length > 0 ? (
          sortedEvents.map((event, index) => {
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('default', { 
              weekday: 'short', 
              day: 'numeric', 
              month: 'short' 
            });
            
            const colorClass = event.color || 'border-indigo-500';
            
            return (
              <div 
                key={event.id || index} 
                className={`bg-gray-800/50 p-2 rounded border-l-2 ${colorClass}`}
              >
                <div className="font-medium text-white">{event.title}</div>
                <div className="text-xs text-gray-400">
                  {formattedDate}{event.time ? `, ${event.time}` : ''}
                </div>
                {event.category && (
                  <div className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                    {event.category}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-400">
            No upcoming events
          </div>
        )}
      </div>
    </Widget>
  );
}

// Map Interface for custom widget factories
export interface WidgetFactory {
  [key: string]: React.FC<any>;
}

// Widget registry for dynamic widget creation
export const widgetRegistry: WidgetFactory = {
  widget: Widget,
  stats: StatsWidget,
  activity: ActivityWidget,
  user: UserWidget,
  table: TableWidget,
  cardGroup: CardGroupWidget,
  calendar: CalendarWidget,
};

// Register a new widget type
export function registerWidget(name: string, component: React.FC<any>): void {
  widgetRegistry[name] = component;
}

// Get a widget from the registry
export function getWidget(name: string): React.FC<any> | undefined {
  return widgetRegistry[name];
}

// Create a widget by type and props
export function createWidget(
  type: string, 
  props: any,
  key?: string | number
): React.ReactNode {
  const WidgetComponent = getWidget(type);
  
  if (!WidgetComponent) {
    console.error(`Widget type "${type}" not found in registry`);
    return null;
  }
  
  return <WidgetComponent key={key} {...props} />;
}

// Example of how to register a custom widget
// registerWidget('custom', ({ title, value, icon }: { title: string, value: string, icon?: React.ElementType }) => (
//   <Widget title={title} icon={icon}>
//     <div className="text-white">{value}</div>
//   </Widget>
// ));