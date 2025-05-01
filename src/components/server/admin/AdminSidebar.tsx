'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/utils';
import { Button } from '@/components/server/ui/button';
import { 
  Home, 
  Users, 
  FileText, 
  Settings, 
  Activity,
  Calendar,
  BarChart,
  Menu,
  X
} from 'lucide-react';
import { getUser } from '@/lib/new/auth';
import { hasRole } from '@/lib/new/admin';

export default function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations('AdminSidebar');
  const [isOpen, setIsOpen] = useState(false);
  const [canManageUsers, setCanManageUsers] = useState(false);
  
  useEffect(() => {
    async function checkPermissions() {
      const user = await getUser();
      if (user) {
        const canManage = await hasRole(user.id, ['admin']);
        setCanManageUsers(canManage);
      }
    }
    
    checkPermissions();
  }, []);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  
  const navigation = [
    { name: t('dashboard'), href: '/admin/dashboard', icon: Home },
    { name: t('content'), href: '/admin/content', icon: FileText },
    { name: t('activity'), href: '/admin/activity', icon: Activity },
    { name: t('analytics'), href: '/admin/analytics', icon: BarChart },
    { name: t('schedule'), href: '/admin/schedule', icon: Calendar },
  ];
  
  // Only show user management for admins
  const adminNavigation = [
    { name: t('users'), href: '/admin/users', icon: Users },
    { name: t('settings'), href: '/admin/settings', icon: Settings },
  ];
  
  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed z-20 top-0 left-0 p-4">
        <Button 
          onClick={toggleSidebar} 
          variant="outline" 
          size="icon"
          className="bg-white"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "z-20 w-64 flex-shrink-0 bg-white border-r",
          "transform transition-transform duration-200 ease-in-out",
          "fixed inset-y-0 left-0 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/admin/dashboard" className="flex items-center">
              <span className="text-xl font-bold">{t('adminPanel')}</span>
            </Link>
            
            <Button 
              onClick={toggleSidebar}
              variant="ghost" 
              size="icon"
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname!.startsWith(`${item.href}/`);
                
                return (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                        isActive 
                          ? "bg-primary text-white" 
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-gray-500")} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            
            {/* Admin section */}
            {canManageUsers && (
              <>
                <div className="mt-8 mb-2">
                  <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {t('adminSection')}
                  </p>
                </div>
                <ul className="space-y-1">
                  {adminNavigation.map((item) => {
                    const isActive = pathname === item.href || pathname!.startsWith(`${item.href}/`);
                    
                    return (
                      <li key={item.name}>
                        <Link 
                          href={item.href}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                            isActive 
                              ? "bg-primary text-white" 
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-gray-500")} />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-xs text-gray-500">
              <p>{t('version')} 1.0.0</p>
              <p className="mt-1">&copy; {new Date().getFullYear()} {t('companyName')}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}