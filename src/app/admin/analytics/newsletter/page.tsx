'use client';

import { useState, useEffect } from 'react';
import { WidgetGrid } from '@/components/widgets/WidgetGrid';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/client/admin/sidebar';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { signOut } from '@/lib/auth/auth';
import { useRouter } from 'next/navigation';

// Import individual widgets
import { SubscriberCountWidget } from '@/components/widgets/SubscriberCountWidget';
import { 
  LastUpdatedWidget,
  DownloadSubscribersWidget,
  SubscribersTableWidget,
 } from '@/components/widgets/index';

// Define the SubscriberData type to match what the existing widget expects
interface SubscriberData {
  email: string;
}

export default function NewsletterSubscribersPage() {
  const { adminData, loading, error } = useAdminAuth();
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<SubscriberData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  async function handleSignOut() {
    await signOut();
    router.push('/admin/login');
  }

  // Helper function to get the correct API path
  function getApiPath(endpoint: string): string {
    // If we're in development, we need to handle the locale differently
    if (process.env.NODE_ENV === 'development') {
      // Remove the locale from the pathname if it exists
      // Get the current pathname from window.location
      const currentPath = window.location.pathname;
      // Check if the path starts with a locale (e.g., /es/, /en/)
      const localeMatch = currentPath.match(/^\/([a-z]{2})\//);
      
      if (localeMatch) {
        // If there's a locale prefix, we need to ensure it's excluded from API calls
        return endpoint; // The rewrite rule should handle this
      }
    }
    
    // Default case - just use the endpoint directly
    return endpoint;
  }

  async function fetchSubscribers() {
    try {
      setDataLoading(true);
      setStatsError(null);
      
      console.log('Fetching newsletter subscribers...');
      const apiPath = getApiPath('/api/newsletter/subscribers');
      console.log('Using API path:', apiPath);
      
      const response = await fetch(apiPath, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching subscribers: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Successfully fetched subscribers:', data);
      
      // Fix the data transformation - convert to simple email objects to match existing widget
      let subscribersList: SubscriberData[] = [];
      
      if (Array.isArray(data.subscribers)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        subscribersList = data.subscribers.map((item: any) => {
          // If item is a string (old format from blob storage)
          if (typeof item === 'string') {
            return { email: item };
          }
          // If item is an object (new format from database)
          else if (typeof item === 'object' && item.email) {
            return { email: item.email };
          }
          // Fallback
          else {
            console.warn('Unexpected subscriber format:', item);
            return { email: String(item) };
          }
        });
      } else {
        console.warn('Unexpected data format - subscribers is not an array:', data);
        subscribersList = [];
      }
      
      setSubscribers(subscribersList);
      setLastUpdated(data.lastUpdated || null);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setStatsError(errorMessage);
    } finally {
      setDataLoading(false);
    }
  }

  // Fetch subscribers when authorized
  useEffect(() => {
    if (adminData) {
      fetchSubscribers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminData]);

  async function handleDeleteSubscriber(email: string) {
    try {
      console.log("Deleting subscriber:", email);
      
      const apiPath = getApiPath('/api/newsletter/subscribers');
      console.log('Using API path:', apiPath);
      
      const response = await fetch(apiPath, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting subscriber: ${response.status} ${response.statusText}`);
      }
      
      console.log("Deletion successful, fetching updated subscribers");
      
      await fetchSubscribers();
      console.log("Subscribers refreshed successfully");
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete subscriber';
      setStatsError(errorMessage);
      throw error; // Rethrow so the widget can handle it
    }
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

  // Extract user role safely
  const userRole = typeof adminData.role === 'string' ? adminData.role : 'viewer';

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Include Sidebar with adminData */}
      <Sidebar user={{ ...adminData, avatarUrl: adminData.avatarUrl ?? undefined }} />

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Newsletter Subscribers</h1>
            <p className="text-gray-400">Manage your newsletter subscription list</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button
              onClick={fetchSubscribers}
              disabled={dataLoading}
              variant="outline" 
              className="border-gray-700 text-gray-200 hover:bg-gray-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {dataLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
        
        {statsError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{String(statsError)}</AlertDescription>
          </Alert>
        )}
        
        <WidgetGrid>
          {/* Stats Summary Widgets */}
          <SubscriberCountWidget 
            count={subscribers.length} 
            userRole={userRole}
          />
          
          <LastUpdatedWidget 
            lastUpdated={lastUpdated} 
            userRole={userRole}
          />
          
          <DownloadSubscribersWidget 
            subscribers={subscribers} 
            userRole={userRole}
          />
          
          {/* Subscribers Table Widget */}
          <SubscribersTableWidget
            subscribers={subscribers}
            onDeleteSubscriber={handleDeleteSubscriber}
            userRole={userRole}
          />
        </WidgetGrid>
      </main>
    </div>
  );
}