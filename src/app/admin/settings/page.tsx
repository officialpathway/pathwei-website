'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { signOut } from '@/lib/auth/auth';
import { 
  Settings,
  ArrowLeft, Globe, Sliders, Shield,
  Users, Database,
  Clock, History,
  RefreshCw
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import Sidebar from '@/components/client/admin/sidebar';
import { 
  WidgetGrid,
  NavigationWidget,
  ActivityWidget,
  StatusWidget
} from '@/components/widgets/index';
import IndexNowButton from '@/components/client/admin/indexnow-button';

export default function AdminSettings() {
  const { adminData, loading, error } = useAdminAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/admin/login');
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-950 text-gray-200">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          onClick={handleSignOut} 
          className="mt-4"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  // Recent settings changes for the activity widget
  const recentChanges = [
    {
      title: 'SEO Title Updated',
      time: '1 day ago',
      description: `Changes made by ${adminData?.name}`
    },
    {
      title: 'Email Templates Modified',
      time: '3 days ago',
      description: 'Changes made by Admin'
    },
    {
      title: 'Security Settings Updated',
      time: '1 week ago',
      description: 'Changes made by System'
    },
    {
      title: 'Notification Preferences Changed',
      time: '2 weeks ago',
      description: `Changes made by ${adminData?.name}`
    }
  ];

  // Navigation items for Site Settings
  const siteSettingsItems = [
    {
      icon: Sliders,
      label: 'General Settings',
      path: '/admin/settings/general'
    },
    {
      icon: Globe,
      label: 'SEO Settings',
      path: '/admin/settings/seo'
    },
    {
      icon: Shield,
      label: 'Security Settings',
      path: '/admin/settings/security'
    }
  ];

  // Navigation items for Advanced Settings
  const advancedSettingsItems = [
    {
      icon: Users,
      label: 'Role Management',
      path: '/admin/settings/roles'
    },
    {
      icon: Database,
      label: 'Database Settings',
      path: '/admin/settings/database'
    },
    {
      icon: Settings,
      label: 'System Configuration',
      path: '/admin/settings/system'
    }
  ];

  // Actions for settings backup
  const backupActions = [
    {
      label: 'Backup Now',
      onClick: () => console.log('Backup triggered')
    },
    {
      label: 'Restore Settings',
      onClick: () => console.log('Restore dialog opened')
    },
    {
      label: 'Index Now',
      onClick: () => console.log('Index Now triggered')
    }
  ];

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Include Sidebar with adminData */}
      {adminData && (
        <Sidebar user={{ ...adminData, avatarUrl: adminData.avatarUrl ?? undefined }} />
      )}
      
      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Button 
            variant="outline"
            size="icon"
            onClick={() => router.push('/admin')}
            title="Back to Dashboard"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-400">Manage system settings and configurations</p>
          </div>
        </div>
        
        <WidgetGrid>
          {/* Site Settings Widget */}
          <NavigationWidget 
            title="Site Settings" 
            description="Manage website configuration"
            size="1x1"
            icon={Settings}
            items={siteSettingsItems}
            requiredRole="editor"
            userRole={adminData?.role || 'viewer'}
          />

          {/* Recent Changes Activity Widget */}
          <ActivityWidget 
            title="Recent Settings Changes"
            description="Latest configuration updates"
            activities={recentChanges}
            size="3x2"
            icon={History}
            footerAction={
              <Button 
                variant="outline" 
                className="w-full border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/activity?filter=settings')}
              >
                <Clock className="mr-2 h-4 w-4" />
                View All Settings History
              </Button>
            }
            requiredRole="viewer"
            userRole={adminData?.role || 'viewer'}
          />

          {/* Advanced Settings Widget */}
          <NavigationWidget 
            title="Advanced Settings" 
            description="System configuration and maintenance"
            size="1x1"
            icon={Sliders}
            items={advancedSettingsItems}
            requiredRole="admin"
            userRole={adminData?.role || 'viewer'}
          />
          
          {/* System Status Summary Widget */}
          <StatusWidget 
            title="Settings Backup" 
            description="Configuration backup status"
            size="4x1"
            icon={Database}
            statusInfo={{
              title: 'Last Backup',
              details: 'Today at 02:00 AM • Automatic • Successful',
              status: 'success'
            }}
            actions={backupActions}
            requiredRole="manager"
            userRole={adminData?.role || 'viewer'}
          />
          
          {/* IndexNow Widget */}
          <StatusWidget 
            title="Search Engine Indexing" 
            description="Notify search engines of content updates"
            size="2x1"
            icon={RefreshCw}
            statusInfo={{
              title: 'IndexNow API',
              details: 'Submit URLs for immediate crawling',
              status: 'info'
            }}
            customContent={<IndexNowButton />}
            requiredRole="editor"
            userRole={adminData?.role || 'viewer'}
          />
        </WidgetGrid>
      </main>
    </div>
  );
}