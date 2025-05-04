'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { 
  WidgetGrid, 
  Widget, 
  StatsWidget, 
  ActivityWidget, 
  UserWidget 
} from '@/components/client/admin/widget';
import { 
  Users, Settings, FileText, 
  Activity, BarChart, 
  User as UserIcon, DollarSign,
  ArrowUpRight, Plus
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import Sidebar from '@/components/client/admin/sidebar';
import { useAdminAuth } from '@/hooks/use-admin-auth'; // Adjust path as needed
import { signOut } from '@/lib/new/auth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function Dashboard() {
  const { adminData, loading, error } = useAdminAuth();
  const router = useRouter();
  
  async function handleSignOut() {
    await signOut();
    router.push('/admin/login');
  }
  
  // Handle loading state
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
  
  // Handle error state
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
  
  // Handle no admin data (shouldn't happen if useAdminAuth is working correctly)
  if (!adminData) {
    return (
      <div className="p-8 bg-gray-950 text-gray-200">
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have admin privileges.</AlertDescription>
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
  
  const activities = [
    {
      title: 'Content Updated',
      time: '2 hours ago',
      description: 'Anna Smith updated the homepage content'
    },
    {
      title: 'User Created',
      time: 'Yesterday',
      description: 'John Doe created a new user account'
    },
    {
      title: 'Settings Changed',
      time: '3 days ago',
      description: 'System settings were updated'
    },
    {
      title: 'New Product Added',
      time: '5 days ago',
      description: 'Maria Garcia added new product "Premium Plan"'
    }
  ];
  
  const currentQuarterStats = {
    usersGrowth: 12.5,
    revenueGrowth: 18.2,
    ordersGrowth: -5.3,
    productsGrowth: 7.8
  };
  
  const goals = [
    { name: 'User Growth', current: 152, target: 200, percentage: 76 },
    { name: 'Monthly Revenue', current: 18500, target: 25000, percentage: 74 },
    { name: 'Product Launch', current: 2, target: 3, percentage: 67 }
  ];
  
  return (
    <div className="flex h-screen bg-gray-950">
      {/* Include Sidebar with adminData */}
      <Sidebar user={{ ...adminData, avatarUrl: adminData.avatarUrl ?? undefined }} />
      
      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {adminData.name}</p>
        </div>
        
        <WidgetGrid>
          {/* User Information Widget */}
          <UserWidget 
            user={adminData}
            size="1x2"
            footerAction={
              <Button 
                variant="outline" 
                className="w-full border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/profile')}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            }
          />
          
          {/* Stats Widgets */}
          <StatsWidget 
            title="Total Users"
            value="152"
            change={
              <>
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {currentQuarterStats.usersGrowth}% from last quarter
              </>
            }
            changeType="positive"
            icon={Users}
            size="1x1"
          />
          
          <StatsWidget 
            title="Revenue"
            value="$18,500"
            change={
              <>
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {currentQuarterStats.revenueGrowth}% from last quarter
              </>
            }
            changeType="positive"
            icon={DollarSign}
            size="1x1"
          />
          
          {/* Goals Widget */}
          <Widget 
            title="Quarterly Goals" 
            description="Progress towards targets"
            size="2x1"
          >
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">{goal.name}</span>
                    <span className="text-sm text-gray-400">
                      {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={goal.percentage} 
                    className="h-2 bg-gray-700" 
                    indicatorClassName="bg-indigo-500" 
                  />
                </div>
              ))}
            </div>
          </Widget>
          
          {/* Quick Actions Widget */}
          <Widget 
            title="Quick Actions" 
            description="Common administrative tasks"
            size="2x1"
          >
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                className="justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/content')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Manage Content
              </Button>
              
              <Button 
                variant="outline"
                className="justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/users')}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
              
              <Button 
                variant="outline"
                className="justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/analytics')}
              >
                <BarChart className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
              
              <Button 
                variant="outline"
                className="justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </Widget>
          
          {/* Activity Widget */}
          <ActivityWidget 
            activities={activities}
            size="4x1"
            footerAction={
              <Button 
                variant="outline" 
                className="w-full border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/activity')}
              >
                <Activity className="mr-2 h-4 w-4" />
                View All Activity
              </Button>
            }
          />
          
          {/* System Status Widget */}
          <Widget 
            title="System Status" 
            description="Performance and uptime"
            size="2x1"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">API Status</span>
                <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Database</span>
                <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Storage</span>
                <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full">High Usage</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Server Load</span>
                <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">Normal</span>
              </div>
            </div>
          </Widget>
          
          {/* Calendar Widget */}
          <Widget 
            title="Upcoming Events" 
            description={`For ${format(new Date(), 'MMMM yyyy')}`}
            size="2x1"
            headerAction={
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => router.push('/admin/schedule')}
                className="h-8 w-8 text-gray-400 hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            }
          >
            <div className="space-y-3">
              <div className="bg-gray-800/50 p-2 rounded border-l-2 border-indigo-500">
                <div className="font-medium text-white">Team Meeting</div>
                <div className="text-xs text-gray-400">Tomorrow, 10:00 AM</div>
              </div>
              <div className="bg-gray-800/50 p-2 rounded border-l-2 border-blue-500">
                <div className="font-medium text-white">Product Launch</div>
                <div className="text-xs text-gray-400">May 10, 2025</div>
              </div>
              <div className="bg-gray-800/50 p-2 rounded border-l-2 border-green-500">
                <div className="font-medium text-white">Marketing Campaign</div>
                <div className="text-xs text-gray-400">May 15, 2025</div>
              </div>
            </div>
          </Widget>
        </WidgetGrid>
      </main>
    </div>
  );
}