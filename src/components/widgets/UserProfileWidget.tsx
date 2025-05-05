'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { User as UserIcon } from 'lucide-react';
import { Widget, WidgetProps } from './Widgets';
import { useRouter } from 'next/navigation';

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
export interface UserProfileWidgetProps extends Omit<WidgetProps, 'title' | 'description' | 'footerAction'> {
  user: UserData;
  title?: string;
  description?: string;
  editProfileUrl?: string;
}

// User Profile Widget Component
export function UserProfileWidget({ 
  user, 
  size = '1x2', 
  className, 
  title = "User Information",
  description = "Your account details and status",
  editProfileUrl = '/admin/profile',
  icon,
  iconClassName,
  ...props
}: UserProfileWidgetProps) {
  const router = useRouter();
  
  return (
    <Widget
      title={title}
      description={description}
      size={size}
      className={className}
      icon={icon}
      iconClassName={iconClassName}
      footerAction={
        <Button 
          variant="outline" 
          className="w-full border-gray-700 text-gray-200 hover:bg-gray-800"
          onClick={() => router.push(editProfileUrl)}
        >
          <UserIcon className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      }
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