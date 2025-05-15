'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { 
  WidgetGrid,
  WidgetGridWrapper,
  StatsWidget,
  ActivityLogWidget,
  UserProfileWidget,
  QuarterlyGoalsWidget,
  QuickActionsWidget,
  SystemStatusWidget,
  UpcomingEventsWidget
} from '@/components/widgets';
import { Users, DollarSign } from 'lucide-react';
import Sidebar from '@/components/client/admin/sidebar';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { signOut } from '@/lib/auth/auth';
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
        <Button onClick={handleSignOut} className="mt-4">Sign Out</Button>
      </div>
    );
  }
  
  // Handle no admin data
  if (!adminData) {
    return (
      <div className="p-8 bg-gray-950 text-gray-200">
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have admin privileges.</AlertDescription>
        </Alert>
        <Button onClick={handleSignOut} className="mt-4">Sign Out</Button>
      </div>
    );
  }
  
  // Sample data for widgets
  const activities = [
    { title: 'Content Updated', time: '2 hours ago', description: 'Anna Smith updated the homepage content' },
    { title: 'User Created', time: 'Yesterday', description: 'John Doe created a new user account' },
    { title: 'Settings Changed', time: '3 days ago', description: 'System settings were updated' },
    { title: 'New Product Added', time: '5 days ago', description: 'Maria Garcia added new product "Premium Plan"' }
  ];
  
  const goals = [
    { name: 'User Growth', current: 152, target: 200, percentage: 76 },
    { name: 'Monthly Revenue', current: 18500, target: 25000, percentage: 74 },
    { name: 'Product Launch', current: 2, target: 3, percentage: 67 }
  ];
  
  // Get user role from adminData
  const userRole = adminData.role || 'viewer';
  
  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar user={{ ...adminData, avatarUrl: adminData.avatarUrl ?? undefined }} />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <WidgetGridWrapper>
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {adminData.name}</p>
          </div>
          
          <WidgetGrid>
            <UserProfileWidget 
              user={adminData} 
              userRole={userRole}
            />

            <QuickActionsWidget 
              userRole={userRole}
            />
            
            <StatsWidget 
              title="Total Users"
              value="152"
              change={12.5}
              changeType="positive"
              icon={Users}
              userRole={userRole}
              requiredRole="editor" // Only editors and above can see this
            />

            <QuarterlyGoalsWidget 
              goals={goals} 
              userRole={userRole}
              requiredRole="editor" // Only editors and above
            />
            
            <StatsWidget 
              title="Revenue"
              value="$18,500"
              change={18.2}
              changeType="positive"
              icon={DollarSign}
              userRole={userRole}
              requiredRole="manager" // Only managers and above can see revenue
            />
            
            <ActivityLogWidget 
              activities={activities} 
              userRole={userRole}
            />
            
            <SystemStatusWidget 
              userRole={userRole}
              requiredRole="admin" // Only admins can see system status
            />
            
            <UpcomingEventsWidget 
              userRole={userRole}
            />
          </WidgetGrid>
        </WidgetGridWrapper>
      </main>
    </div>
  );
}