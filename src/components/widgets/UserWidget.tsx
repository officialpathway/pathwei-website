'use client';

import React from 'react';
import Image from 'next/image';
import { Widget, WidgetProps } from './Widgets';

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
            <div className="h-12 w-12 overflow-hidden rounded-full relative flex items-center justify-center">
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