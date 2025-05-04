'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { signOut } from '@/lib/new/auth';
import { 
  Settings,
  ArrowLeft, Globe, Sliders, Shield,
  Users, Database,
  Clock, History
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import Sidebar from '@/components/client/admin/sidebar';
import { 
  WidgetGrid, 
  Widget,
  ActivityWidget
} from '@/components/client/admin/widget';

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
          <Widget 
            title="Site Settings" 
            description="Manage website configuration"
            size="1x2"
            icon={Settings}
          >
            <div className="space-y-2">
              <Button 
                variant="outline"
                className="w-full justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/settings/general')}
              >
                <Sliders className="mr-2 h-4 w-4" />
                General Settings
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/settings/seo')}
              >
                <Globe className="mr-2 h-4 w-4" />
                SEO Settings
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/settings/security')}
              >
                <Shield className="mr-2 h-4 w-4" />
                Security Settings
              </Button>
            </div>
          </Widget>
          {/* Advanced Settings Widget */}
          <Widget 
            title="Advanced Settings" 
            description="System configuration and maintenance"
            size="1x2"
            icon={Sliders}
          >
            <div className="space-y-2">
              <Button 
                variant="outline"
                className="w-full justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/settings/roles')}
              >
                <Users className="mr-2 h-4 w-4" />
                Role Management
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/settings/database')}
              >
                <Database className="mr-2 h-4 w-4" />
                Database Settings
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/settings/system')}
              >
                <Settings className="mr-2 h-4 w-4" />
                System Configuration
              </Button>
            </div>
          </Widget>

          {/* Recent Changes Activity Widget */}
          <ActivityWidget 
            title="Recent Settings Changes"
            description="Latest configuration updates"
            activities={recentChanges}
            size="3x1"
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
          />
          
          {/* System Status Summary Widget */}
          <Widget 
            title="Settings Backup" 
            description="Configuration backup status"
            size="3x1"
            icon={Database}
          >
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-3 rounded border-l-2 border-green-500">
                <div className="font-medium text-white">Last Backup</div>
                <div className="text-sm text-gray-400">Today at 02:00 AM • Automatic • Successful</div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  className="flex-1 justify-center border-gray-700 text-gray-200 hover:bg-gray-800"
                >
                  Backup Now
                </Button>
                
                <Button 
                  variant="outline"
                  className="flex-1 justify-center border-gray-700 text-gray-200 hover:bg-gray-800"
                >
                  Restore Settings
                </Button>
              </div>
            </div>
          </Widget>
        </WidgetGrid>
      </main>
    </div>
  );
}