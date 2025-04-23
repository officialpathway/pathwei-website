// pages/admin/index.tsx
"use client";

import { 
  Lock, 
  BarChart2, 
  Settings, 
  Fingerprint, 
  Users, 
  Search, 
  LineChart, 
  LayoutGrid, 
  Activity,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AdminLayout from './layout';

// Import Supabase auth functions
import { supabase, signIn as supabaseSignIn } from '@/lib/db/supabase';

// Import auth utilities
import { checkAdminAuth, logoutAdmin } from '@/lib/api/auth/adminAuth';

export default function AdminHub() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [, setIsSubmitting] = useState(false);
  
  // Check for existing auth on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setAuthLoading(true);
        const isAuthenticated = await checkAdminAuth();
        setAuthenticated(isAuthenticated);
      } catch (error) {
        console.error('Auth verification error:', error);
        setAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };
  
    verifyAuth();
  }, []);
  
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      console.log('Login attempt with:', credentials.email);
      
      // First authenticate with Supabase
      const result = await supabaseSignIn(credentials.email, credentials.password);
      
      if (!result || !result.user) {
        throw new Error('Supabase authentication failed');
      }
      
      console.log('Supabase auth successful for user ID:', result.user.id);
      
      // Get the JWT claims to check for admin role
      const { data: { session } } = await supabase.auth.getSession();
      const claims = session?.user?.app_metadata;
      
      console.log('User JWT claims:', claims);
      
      // Check if user has admin role in the JWT claims
      if (!claims || claims.role !== 'admin') {
        console.error('User does not have admin role in JWT claims:', claims);
        await supabase.auth.signOut();
        throw new Error('Not authorized as admin');
      }
      
      console.log('Admin role verified in JWT claims');
      
      // Get admin JWT token from server
      const tokenResponse = await fetch('/api/auth/get-auth-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      
      if (!tokenResponse.ok) {
        const tokenErrorData = await tokenResponse.text();
        console.error('Token API error:', tokenResponse.status, tokenErrorData);
        throw new Error('Failed to get admin token');
      }
      
      const tokenData = await tokenResponse.json();
      
      if (tokenData.success && tokenData.token) {
        // Store token in localStorage
        localStorage.setItem('adminAuthToken', tokenData.token);
        localStorage.setItem('adminAuthExpires', tokenData.expiresAt.toString());
        
        // Store user data for easy access
        if (tokenData.user) {
          localStorage.setItem('adminUser', JSON.stringify(tokenData.user));
        }
        
        console.log('Admin token stored successfully');
        setAuthenticated(true);
      } else {
        throw new Error('Invalid token response');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    try {
      setAuthLoading(true);
      await logoutAdmin();
      setAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Logout failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  }

  // Rest of the component stays the same...
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-medium">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
        {/* Login form... */}
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Fingerprint className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Admin Portal</h2>
            <p className="text-slate-500 mt-2">Secure access to management tools</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  title='email'
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  title='password'
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin dashboard when authenticated
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your website configuration and monitor performance</p>
          </div>
          <button
            type='button'
            onClick={handleLogout}
            className="bg-white text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-lg border border-slate-300 flex items-center gap-2 transition-colors shadow-sm"
          >
            <Lock className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <QuickStatCard 
            icon={<Activity className="h-6 w-6 text-emerald-500" />}
            title="Daily Visitors" 
            value="1,248" 
            change="+12.5%" 
            positive={true}
          />
          <QuickStatCard 
            icon={<Users className="h-6 w-6 text-blue-500" />}
            title="Active Users" 
            value="14,385" 
            change="+3.2%" 
            positive={true}
          />
          <QuickStatCard 
            icon={<BarChart2 className="h-6 w-6 text-indigo-500" />}
            title="Conversion Rate" 
            value="3.7%" 
            change="-0.5%" 
            positive={false}
          />
          <QuickStatCard 
            icon={<LineChart className="h-6 w-6 text-orange-500" />}
            title="Avg. Session" 
            value="3m 42s" 
            change="+0.8%" 
            positive={true}
          />
        </div>

        {/* Admin features grid */}
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Management Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard 
            icon={<BarChart2 className="h-6 w-6 text-indigo-500" />}
            title="Price A/B Testing"
            description="Configure and monitor price testing experiments"
            onClick={() => router.push('/admin/price-tests')}
            bgColor="bg-indigo-50"
          />
          
          <DashboardCard 
            icon={<LineChart className="h-6 w-6 text-emerald-500" />}
            title="Analytics"
            description="View comprehensive site performance metrics"
            onClick={() => router.push('/admin/analytics')}
            bgColor="bg-emerald-50"
          />
          
          <DashboardCard 
            icon={<Search className="h-6 w-6 text-orange-500" />}
            title="SEO Settings"
            description="Optimize meta data and search configurations"
            onClick={() => router.push('/admin/settings/seo')}
            bgColor="bg-orange-50"
          />
          
          <DashboardCard 
            icon={<Users className="h-6 w-6 text-blue-500" />}
            title="User Management"
            description="Manage user accounts and permissions"
            onClick={() => router.push('/admin/settings/users')}
            bgColor="bg-blue-50"
          />
          
          <DashboardCard 
            icon={<Settings className="h-6 w-6 text-slate-500" />}
            title="General Settings"
            description="Configure core system parameters"
            onClick={() => router.push('/admin/settings/general')}
            bgColor="bg-slate-50"
          />
          
          <DashboardCard 
            icon={<LayoutGrid className="h-6 w-6 text-purple-500" />}
            title="Quick Actions"
            description="Access frequently used admin functions"
            onClick={() => router.push('/admin/quick-actions')}
            bgColor="bg-purple-50"
          />
        </div>
        
        {/* Recent Activity Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Recent Activity</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            <ActivityItem 
              icon={<Users className="h-5 w-5" />} 
              title="New user registered" 
              description="john.doe@example.com created an account"
              time="2 hours ago"
              color="text-blue-500"
            />
            <ActivityItem 
              icon={<BarChart2 className="h-5 w-5" />} 
              title="Price test completed" 
              description="Test 'Premium Plan Pricing' finished with 12% increase"
              time="Yesterday"
              color="text-green-500"
            />
            <ActivityItem 
              icon={<Search className="h-5 w-5" />} 
              title="SEO metadata updated" 
              description="Homepage meta description was modified"
              time="2 days ago"
              color="text-orange-500"
            />
            <ActivityItem 
              icon={<Settings className="h-5 w-5" />} 
              title="System settings changed" 
              description="Email notification preferences updated"
              time="3 days ago"
              color="text-purple-500"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function DashboardCard({ 
  icon, 
  title, 
  description, 
  onClick,
  bgColor = "bg-blue-50"
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  bgColor?: string;
}) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center mb-4">
        <div className={`${bgColor} p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      </div>
      <p className="text-slate-600">{description}</p>
      <div className="mt-4 flex justify-end">
        <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

function QuickStatCard({ 
  icon, 
  title, 
  value, 
  change, 
  positive 
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between">
        <span className="text-slate-500 text-sm font-medium">{title}</span>
        {icon}
      </div>
      <div className="mt-2">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        <div className="mt-1 flex items-center">
          <span className={`text-sm font-medium ${positive ? 'text-emerald-600' : 'text-red-600'}`}>
            {change}
          </span>
          <svg
            className={`h-4 w-4 ml-1 ${positive ? 'text-emerald-500' : 'text-red-500'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            {positive ? (
              <path
                fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ 
  icon, 
  title, 
  description, 
  time,
  color
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  color: string;
}) {
  return (
    <div className="flex items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
      <div className={`${color} bg-opacity-15 p-2 rounded-lg mr-4`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-slate-800">{title}</h3>
        <p className="text-slate-500 text-sm">{description}</p>
      </div>
      <div className="text-xs text-slate-400">{time}</div>
    </div>
  );
}