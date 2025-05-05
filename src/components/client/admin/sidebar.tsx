'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, Settings, FileText, 
  LogOut, Activity, BarChart, Calendar, 
  User, Menu, X
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/utils';
import { signOut } from '@/lib/new/auth';
import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Content', href: '/admin/content', icon: FileText },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
  { name: 'Activity', href: '/admin/activity', icon: Activity },
  { name: 'Schedule', href: '/admin/schedule', icon: Calendar },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Profile', href: '/admin/profile', icon: User },
];

interface User {
  avatarUrl?: string;
  name?: string;
  role?: string;
}

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  async function handleSignOut() {
    await signOut();
    router.push('/admin/login');
  }

  const avatarUrl = user?.avatarUrl;
  const userName = user?.name || 'Admin User';
  const userRole = user?.role || 'admin';

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <span className="text-xl font-bold text-white">Admin</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-300 hover:text-white"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar for desktop and mobile overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 lg:relative lg:z-0",
          isMobileMenuOpen ? "block" : "hidden lg:block"
        )}
      >
        {/* Backdrop for mobile */}
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar content */}
        <aside className="fixed left-0 top-0 z-50 h-full w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col lg:relative">
          <div className="mb-8 flex items-center">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={36}
              height={36}
              className="mr-2"
            />
            <span className="text-xl font-bold text-white">Admin Panel</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              className="ml-auto text-gray-300 hover:text-white lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Profile Section */}
          <div className="mb-6 border-b border-gray-800 pb-6">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <div className="h-10 w-10 overflow-hidden rounded-full">
                  <Image 
                    src={avatarUrl} 
                    alt={userName}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-medium text-white">{userName}</div>
                <div className="text-xs text-gray-400 capitalize">{userRole}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-gray-800 text-white" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-indigo-400" : "")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sign Out Button */}
          <div className="mt-auto pt-4 border-t border-gray-800">
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="w-full border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>
      </div>
    </>
  );
}