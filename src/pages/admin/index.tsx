// src/pages/admin/index.tsx
"use client";

import { Lock, BarChart2, Globe, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import AdminLayout from './layout';
import '@/src/pages/globals.css';

export default function AdminHub() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing auth cookie on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check', {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.authenticated) {
          setAuthenticated(true);
        }
      } catch {
        setAuthenticated(false);
      }
    };
  
    checkAuth();
  }, []);
  

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const basicAuth = btoa(`${credentials.username}:${credentials.password}`);
      const response = await fetch('/api/admin/validate-auth', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`
        },
        credentials: 'include' // 👈 IMPORTANTE para que acepte cookies
      });

      if (!response.ok) throw new Error('Invalid credentials');
      
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  function handleLogout() {
    Cookies.remove('adminAuth');
    setAuthenticated(false);
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <Lock className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Admin Portal</h2>
            <p className="text-gray-600 mt-2">Please sign in to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                title='username'
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
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
            onClick={() => router.push('/admin/stats')}
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