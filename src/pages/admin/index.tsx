// src/pages/admin/index.tsx
"use client";

import { Lock, BarChart2, Globe, Settings, Fingerprint } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import AdminLayout from './layout';
import '@/src/pages/globals.css';
// Import Supabase auth functions
import { supabase, signIn as supabaseSignIn, getCurrentUser } from '@/lib/supabase';

export default function AdminHub() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check for existing auth on mount (both cookie and Supabase)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check server-side cookie-based admin auth
        const res = await fetch('/api/auth/admin-check', {
          method: 'GET',
          credentials: 'include', // Important for sending cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const cookieAuthData = await res.json();
        const cookieAuth = cookieAuthData.authenticated;
        
        // Then check Supabase session
        const user = await getCurrentUser();
        
        console.log('Auth check:', { 
          cookieAuth: cookieAuth ? 'Valid' : 'None',
          cookieAuthDetails: cookieAuthData,
          supabaseAuth: user ? `Valid (${user.email})` : 'None' 
        });
        
        // Consider authenticated if both or at least Supabase auth is valid
        setAuthenticated(cookieAuth && !!user);
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };
  
    checkAuth();
  }, []);
  

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
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
      
      // If Supabase auth succeeds, also set admin cookie
      const response = await fetch('/api/admin/set-auth-cookie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${result.session?.access_token}` // Pass Supabase token
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        const responseData = await response.text();
        console.error('Cookie API error:', response.status, responseData);
        throw new Error('Failed to set admin cookie');
      }
      
      console.log('Admin cookie set successfully');
      setAuthenticated(true);
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  async function handleLogout() {
    try {
      // Remove admin cookie
      Cookies.remove('adminAuth');
      
      // Also sign out from Supabase
      await supabase.auth.signOut();
      
      // Call logout API to clear server-side cookies if needed
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      setAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading authentication status...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <Fingerprint className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Admin Portal</h2>
            <p className="text-gray-600 mt-2">Please sign in to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                title='email'
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                title='password'
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            type='button'
            onClick={handleLogout}
            className="text-gray-700 hover:text-gray-900 flex items-center gap-1"
          >
            <Lock className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard 
            icon={<BarChart2 className="h-8 w-8" />}
            title="Price Statistics"
            description="View price tracking analytics"
            onClick={() => router.push('/admin/price-stats')}
          />

          <DashboardCard 
            icon={<Globe className="h-8 w-8" />}
            title="Locale Analytics"
            description="View language distribution stats"
            onClick={() => router.push('/admin/locale')}
          />

          <DashboardCard 
            icon={<Settings className="h-8 w-8" />}
            title="Admin Settings"
            description="Manage admin configurations"
            onClick={() => router.push('/admin/settings')}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

function DashboardCard({ icon, title, description, onClick }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}