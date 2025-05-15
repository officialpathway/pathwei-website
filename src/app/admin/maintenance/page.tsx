'use client';

import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/client/admin/sidebar';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { signOut } from '@/lib/auth/auth';
import { useRouter } from 'next/navigation';

export default function MaintenancePage() {
  const { adminData, loading, error } = useAdminAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/admin/login');
  }

  function navigateBack() {
    router.back();
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
          <Button 
            variant="ghost" 
            className="text-gray-400 hover:text-white mb-4"
            onClick={navigateBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Maintenance in Progress</h1>
          <p className="text-gray-400">This feature is currently unavailable</p>
        </div>
        
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full p-4 bg-amber-500/20 mb-6">
              <AlertTriangle className="h-10 w-10 text-amber-400" />
            </div>
            
            <h2 className="text-2xl font-semibold text-white mb-4">Under Construction</h2>
            
            <p className="text-gray-300 mb-6 max-w-lg">
              We&apos;re currently building this feature to provide you with better analytics and insights. 
              Our development team is working to make this section available as soon as possible.
            </p>
            
            <div className="bg-gray-800/50 p-4 rounded-md mb-8 max-w-lg">
              <p className="text-amber-300 font-medium">Expected completion date: June 2025</p>
            </div>
            
            <Button 
              onClick={navigateBack}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Return to Admin Portal
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}