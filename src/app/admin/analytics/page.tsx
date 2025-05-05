'use client';

import { BarChart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/client/admin/sidebar';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { signOut } from '@/lib/new/auth';
import { useRouter } from 'next/navigation';

export default function AnalyticsPortal() {
  const { adminData, loading, error } = useAdminAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/admin/login');
  }

  function navigateToPriceStats() {
    router.push('/admin/analytics/price-stats');
  }

  function navigateToNewsletterStats() {
    router.push('/admin/analytics/newsletter');
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
  
  // Handle no admin data
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

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Include Sidebar with adminData */}
      <Sidebar user={{ ...adminData, avatarUrl: adminData.avatarUrl ?? undefined }} />

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Analytics Portal</h1>
          <p className="text-gray-400">Access all your analytics dashboards</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Price Stats Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center mb-4">
              <div className="rounded-full p-3 bg-blue-500/20 mr-4">
                <BarChart className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Price Performance</h2>
                <p className="text-gray-400">Analyze conversion rates across different price points</p>
              </div>
            </div>
            <Button 
              onClick={navigateToPriceStats}
              className="w-full bg-indigo-600 hover:bg-indigo-700 mt-4"
            >
              View Price Statistics
            </Button>
          </div>
          
          {/* Newsletter Stats Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center mb-4">
              <div className="rounded-full p-3 bg-green-500/20 mr-4">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Newsletter Subscribers</h2>
                <p className="text-gray-400">Manage and analyze your newsletter subscription list</p>
              </div>
            </div>
            <Button 
              onClick={navigateToNewsletterStats}
              className="w-full bg-green-600 hover:bg-green-700 mt-4"
            >
              View Subscriber Statistics
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}