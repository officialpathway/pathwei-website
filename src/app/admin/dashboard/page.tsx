'use client';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { signOut } from '@/lib/new/auth';
import { getAdminUser, hasRole } from '@/lib/new/admin';
import { 
  Users, Settings, FileText, 
  LogOut, Activity, BarChart, 
  Calendar, User as UserIcon
} from 'lucide-react';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';

export default function AdminDashboard() {
  const [, setUser] = useState<User | null>(null);
  const [adminData, setAdminData] = useState<{
    name: string;
    email: string;
    role: string;
    status: string;
    last_active: string;
    avatarUrl: string | null;
  }>({
    name: '',
    email: '',
    role: '',
    status: '',
    last_active: new Date().toISOString(),
    avatarUrl: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canManageUsers, setCanManageUsers] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        const supabase = createClient()

        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
          redirect('/admin/login')
        }

        console.log('[AdminDashboard] User:', data.user)
        setUser(data.user);

        const adminUserData = await getAdminUser(data.user.id);
        if (!adminUserData) {
          setError('You do not have admin privileges');
          return;
        }

        console.log('[AdminDashboard] Admin User Data:', adminUserData)
        
        setAdminData({
          ...adminUserData,
          avatarUrl: adminUserData.avatarUrl ?? null,
        });
        
        // Check permissions based on role
        const canManage = await hasRole(data.user.id, ['admin']);
        console.log('[AdminDashboard] Can Manage Users:', canManage)
        setCanManageUsers(canManage);
      } catch (err) {
        setError('Error fetching user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

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
  
  // Ensure adminData is available before rendering the main dashboard
  if (!adminData) {
    return (
      <div className="p-8 bg-gray-950 text-gray-200">
        <Alert>
          <AlertTitle>No Data Available</AlertTitle>
          <AlertDescription>Unable to load admin data.</AlertDescription>
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

  return (
    <div className="p-4 md:p-8 bg-gray-950 text-gray-200 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome back, {adminData.name}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-3 border border-gray-700 rounded-full py-2 px-4 bg-gray-900">
            {adminData.avatarUrl ? (
              <div className="h-8 w-8 overflow-hidden rounded-full">
                <Image 
                  src={adminData.avatarUrl} 
                  alt={adminData.name}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                {adminData.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-medium text-white">{adminData.name}</div>
              <div className="text-xs text-gray-400 capitalize">{adminData.role}</div>
            </div>
          </div>
          
          <Button 
            variant="outline"
            size="icon"
            onClick={handleSignOut}
            title="Sign Out"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-900 border-gray-800 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">User Information</CardTitle>
            <CardDescription className="text-gray-400">Your account details and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                {adminData.avatarUrl ? (
                  <div className="h-12 w-12 overflow-hidden rounded-full mr-4">
                    <Image 
                      src={adminData.avatarUrl} 
                      alt={adminData.name} 
                      width={48}
                      height={48}
                      className="h-full w-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-4">
                    {adminData.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-medium text-white">{adminData.name}</div>
                  <div className="text-sm text-gray-400">{adminData.email}</div>
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Role</span>
                  <span className="font-medium capitalize text-gray-200">{adminData.role}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="font-medium capitalize text-gray-200">{adminData.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Last Active</span>
                  <span className="font-medium text-gray-200">
                    {new Date(adminData.last_active).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2 border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/profile')}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Statistics</CardTitle>
            <CardDescription className="text-gray-400">Overview of system metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="text-gray-400 text-sm">Total Users</div>
                  <div className="text-2xl font-bold text-white">152</div>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="text-gray-400 text-sm">Orders</div>
                  <div className="text-2xl font-bold text-white">24</div>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="text-gray-400 text-sm">Revenue</div>
                  <div className="text-2xl font-bold text-white">$1,240</div>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="text-gray-400 text-sm">Products</div>
                  <div className="text-2xl font-bold text-white">48</div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/analytics')}
              >
                <BarChart className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                variant="outline"
                className="w-full justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/content')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Manage Content
              </Button>
              
              {canManageUsers && (
                <Button 
                  variant="outline"
                  className="w-full justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
                  onClick={() => router.push('/admin/users')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              )}
              
              <Button 
                variant="outline"
                className="w-full justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/activity')}
              >
                <Activity className="mr-2 h-4 w-4" />
                View Activity
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/schedule')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Only show user management for admins */}
      {adminData && adminData.role === 'admin' && (
        <Card className="mb-6 bg-gray-900 border-gray-800 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Admin Controls</CardTitle>
            <CardDescription className="text-gray-400">Advanced system management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                variant="default"
                className="w-full justify-start bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => router.push('/admin/users')}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => router.push('/admin/system-logs')}
              >
                <Activity className="mr-2 h-4 w-4" />
                View System Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent activity section */}
      <Card className="bg-gray-900 border-gray-800 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
          <CardDescription className="text-gray-400">Latest actions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* This would normally come from your database */}
            <div className="border-b border-gray-800 pb-2">
              <div className="flex justify-between">
                <div className="font-medium text-gray-200">Content Updated</div>
                <div className="text-sm text-gray-400">2 hours ago</div>
              </div>
              <div className="text-sm text-gray-400">Anna Smith updated the homepage content</div>
            </div>
            
            <div className="border-b border-gray-800 pb-2">
              <div className="flex justify-between">
                <div className="font-medium text-gray-200">User Created</div>
                <div className="text-sm text-gray-400">Yesterday</div>
              </div>
              <div className="text-sm text-gray-400">John Doe created a new user account</div>
            </div>
            
            <div className="border-b border-gray-800 pb-2">
              <div className="flex justify-between">
                <div className="font-medium text-gray-200">Settings Changed</div>
                <div className="text-sm text-gray-400">3 days ago</div>
              </div>
              <div className="text-sm text-gray-400">System settings were updated</div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-gray-700 text-gray-200 hover:bg-gray-800"
              onClick={() => router.push('/admin/activity')}
            >
              <Activity className="mr-2 h-4 w-4" />
              View All Activity
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}