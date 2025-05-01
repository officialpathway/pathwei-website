/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/server/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/server/ui/dropdown-menu';
import { 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Moon, 
  Sun,
  ChevronDown
} from 'lucide-react';
import { getUser, signOut } from '@/lib/new/auth';
import { getAdminUser } from '@/lib/new/admin';
import Image from 'next/image';

export default function AdminHeader() {
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const router = useRouter();
  const t = useTranslations('AdminHeader');
  
  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getUser();
        if (!currentUser) {
          router.push('/admin/login');
          return;
        }
        
        // Get admin user details
        const adminUser = await getAdminUser(currentUser.id);
        if (adminUser) {
          setUser(adminUser);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    }
    
    fetchUser();
  }, [router]);
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    // In a real app, you'd apply the theme change to the DOM or use a theme provider
  };
  
  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };
  
  return (
    <header className="bg-white border-b px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center md:w-64">
          {/* Mobile: This space is for the menu button in the sidebar component */}
          <div className="lg:hidden w-10"></div>
          
          {/* Breadcrumb or page title could go here */}
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Theme toggle */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            className="hidden md:flex"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          {/* User menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  {user.avatarUrl ? (
                    <Image 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      width={32} 
                      height={32} 
                      className="rounded-full" 
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:inline">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span>{user.name}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => router.push('/admin/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('profile')}</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('settings')}</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('signOut')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}