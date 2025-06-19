'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { signOut } from '@/lib/auth/auth';
import { 
  ArrowLeft, 
  Activity,
  Users,
  Settings,
  FileText,
  Database,
  Clock,
  Calendar,
  Filter,
  RefreshCw,
  Search,
  LucideIcon
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import Sidebar from '@/components/client/admin/sidebar';
import { 
  WidgetGrid, 
  Widget,
  ActivityWidget,
  TableWidget,
  ActivityItem,
  TableColumn
} from '@/components/client/admin/widget';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import React from 'react';
import { useSearchParams } from 'next/navigation';

// Define activity types
type ActivityType = 'content' | 'user' | 'settings' | 'product' | 'system';
type TimeFilter = 'all-time' | 'today' | 'this-week' | 'this-month';
type ActivityTab = 'all' | ActivityType;

// Define interface for activity entry
interface ActivityEntry {
  id: string;
  type: ActivityType;
  title: string;
  time: string;
  description: string;
  user: string;
  details: string;
}

// Define interface for activity summary item
interface ActivitySummaryItem {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

// Define interface for activity data structure
interface ActivityData {
  content: ActivityEntry[];
  user: ActivityEntry[];
  settings: ActivityEntry[];
  system: ActivityEntry[];
}

// Mock activity data - in a real app, this would come from an API
const mockActivityData: ActivityData = {
  content: [
    {
      id: '1',
      type: 'content',
      title: 'Homepage Updated',
      time: '2 hours ago',
      description: 'Anna Smith updated the homepage hero section',
      user: 'anna.smith@example.com',
      details: 'Changed hero image and updated call-to-action text'
    },
    {
      id: '2',
      type: 'content',
      title: 'Blog Post Published',
      time: '1 week ago',
      description: 'James Wilson published a new blog post',
      user: 'james.wilson@example.com',
      details: 'Published article "Top 10 Features in Our Latest Release"'
    }
  ],
  user: [
    {
      id: '3',
      type: 'user',
      title: 'User Created',
      time: 'Yesterday',
      description: 'John Doe created a new user account',
      user: 'admin@example.com',
      details: 'Added user: james.wilson@example.com with Editor role'
    },
    {
      id: '4',
      type: 'user',
      title: 'User Login',
      time: '1 hour ago',
      description: 'Admin user logged in from new device',
      user: 'admin@example.com',
      details: 'Login from IP: 192.168.1.1 using Chrome on Windows'
    },
    {
      id: '5',
      type: 'user',
      title: 'Password Reset',
      time: 'Yesterday',
      description: 'Maria Garcia requested password reset',
      user: 'maria.garcia@example.com',
      details: 'Reset link sent to registered email address'
    },
    {
      id: '6',
      type: 'user',
      title: 'Role Changed',
      time: '4 days ago',
      description: 'James Wilson promoted to Editor role',
      user: 'james.wilson@example.com',
      details: 'Role changed from Contributor to Editor by admin@example.com'
    },
    {
      id: '7',
      type: 'user',
      title: 'Account Deactivated',
      time: '1 week ago',
      description: 'John Smith account temporarily deactivated',
      user: 'john.smith@example.com',
      details: 'Deactivated due to 30 days of inactivity'
    }
  ],
  settings: [
    {
      id: '8',
      type: 'settings',
      title: 'Email Settings Changed',
      time: '3 days ago',
      description: 'System settings were updated',
      user: 'admin@example.com',
      details: 'Updated SMTP server settings and notification templates'
    },
    {
      id: '9',
      type: 'settings',
      title: 'Security Settings Updated',
      time: '3 days ago',
      description: 'Admin updated security policies',
      user: 'admin@example.com',
      details: 'Enabled 2FA requirement for all admin users'
    },
    {
      id: '10',
      type: 'settings',
      title: 'API Keys Rotated',
      time: '1 week ago',
      description: 'Scheduled API key rotation completed',
      user: 'system',
      details: 'All API keys older than 90 days were automatically rotated'
    },
    {
      id: '11',
      type: 'settings',
      title: 'Backup Schedule Changed',
      time: '2 weeks ago',
      description: 'Admin modified backup frequency',
      user: 'admin@example.com',
      details: 'Changed from weekly to daily backups with 30-day retention'
    },
    {
      id: '12',
      type: 'settings',
      title: 'Email Templates Updated',
      time: '3 weeks ago',
      description: 'Maria Garcia updated notification templates',
      user: 'maria.garcia@example.com',
      details: 'Modified welcome email and password reset templates'
    }
  ],
  system: [
    {
      id: '13',
      type: 'system',
      title: 'Server Restarted',
      time: '12 hours ago',
      description: 'Automated server restart after updates',
      user: 'system',
      details: 'Completed in 3 minutes with no errors'
    },
    {
      id: '14',
      type: 'system',
      title: 'Database Backup',
      time: '1 day ago',
      description: 'Daily database backup completed',
      user: 'system',
      details: 'Backup size: 2.3GB, stored in secure cloud storage'
    },
    {
      id: '15',
      type: 'system',
      title: 'Error Alert',
      time: '3 days ago',
      description: 'High CPU usage detected and resolved',
      user: 'system',
      details: 'Spike lasted 15 minutes, caused by analytical query'
    },
    {
      id: '16',
      type: 'system',
      title: 'Software Update',
      time: '1 week ago',
      description: 'System updated to version 2.4.1',
      user: 'admin@example.com',
      details: 'Security patches and performance improvements'
    },
    {
      id: '17',
      type: 'system',
      title: 'Storage Alert',
      time: '2 weeks ago',
      description: 'Storage capacity reached 80%',
      user: 'system',
      details: 'Automatic cleanup of temp files performed'
    }
  ]
};

// Activity type icons mapping
const activityTypeIcons: Record<ActivityType, LucideIcon> = {
  content: FileText,
  user: Users,
  settings: Settings,
  product: Database,
  system: Activity
};

// Component that uses searchParams - placed inside Suspense boundary
interface ActivityContentProps {
  adminData: {
    name: string;
    email: string;
    role: string;
    status: string;
    last_active: string;
    avatarUrl: string | null;
  } | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ActivityContent({ adminData }: ActivityContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get filter from URL if present
  const initialFilter = searchParams.get('filter') || 'all';
  
  const [activeTab, setActiveTab] = useState<ActivityTab>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all-time');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  // Format activities for display with appropriate icons
  const formatActivitiesForWidget = (activities: ActivityEntry[]): ActivityItem[] => {
    return activities.map(activity => ({
      id: activity.id,
      title: activity.title,
      time: activity.time,
      description: activity.description,
      icon: activityTypeIcons[activity.type] || Activity
    }));
  };
  
  // Filter activities by type and search query
  const getFilteredActivities = (): ActivityEntry[] => {
    let filtered: ActivityEntry[] = [];
    
    if (activeTab === 'all') {
      filtered = [
        ...mockActivityData.content,
        ...mockActivityData.user,
        ...mockActivityData.settings,
        ...mockActivityData.system
      ];
    } else if (activeTab in mockActivityData) {
      filtered = mockActivityData[activeTab as keyof ActivityData] || [];
    }
    
    // Apply search filter if present
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query) ||
        activity.user.toLowerCase().includes(query) ||
        activity.details.toLowerCase().includes(query)
      );
    }
    
    // Apply time filter
    if (timeFilter !== 'all-time') {
      // This is just mock filtering - in real app would use actual dates
      switch (timeFilter) {
        case 'today':
          filtered = filtered.filter(a => a.time.includes('hour') || a.time === 'Today');
          break;
        case 'this-week':
          filtered = filtered.filter(a => 
            a.time.includes('hour') || 
            a.time === 'Today' || 
            a.time === 'Yesterday' || 
            a.time.includes('days')
          );
          break;
        case 'this-month':
          filtered = filtered.filter(a => 
            !a.time.includes('month') || 
            a.time.includes('this month')
          );
          break;
      }
    }
    
    return filtered;
  };
  
  // Get table columns for detailed view
  const getActivityColumns = (): TableColumn[] => [
    {
      key: 'title',
      title: 'Activity',
      render: (value: string, item: ActivityEntry) => (
        <div className="flex items-center">
          <div className="p-1 mr-2 rounded-full bg-gray-800">
            {React.createElement(activityTypeIcons[item.type] || Activity, { 
              className: "h-4 w-4 text-indigo-400" 
            })}
          </div>
          <div className="font-medium">{value}</div>
        </div>
      )
    },
    {
      key: 'time',
      title: 'Time',
    },
    {
      key: 'user',
      title: 'User',
    },
    {
      key: 'details',
      title: 'Details',
      render: (value: string) => (
        <div className="max-w-md truncate">{value}</div>
      )
    }
  ];
  
  // Handle refresh
  const handleRefresh = (): void => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  // Create activity summary counts
  const getActivitySummary = (): ActivitySummaryItem[] => {
    return [
      {
        title: 'Content Changes',
        value: mockActivityData.content.length,
        icon: FileText,
        color: 'bg-blue-500/20'
      },
      {
        title: 'User Activity',
        value: mockActivityData.user.length,
        icon: Users,
        color: 'bg-green-500/20'
      },
      {
        title: 'Settings Changes',
        value: mockActivityData.settings.length,
        icon: Settings,
        color: 'bg-purple-500/20'
      },
      {
        title: 'System Events',
        value: mockActivityData.system.length,
        icon: Activity,
        color: 'bg-orange-500/20'
      }
    ];
  };
  
  // Use effect to set active tab from URL
  useEffect(() => {
    if (initialFilter && ['all', 'content', 'user', 'settings', 'system'].includes(initialFilter)) {
      setActiveTab(initialFilter as ActivityTab);
    }
  }, [initialFilter]);
  
  const filteredActivities = getFilteredActivities();
  const activitySummary = getActivitySummary();

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Activity Log</h1>
            <p className="text-gray-400">System activity and audit trail</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            title="Refresh"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <WidgetGrid>
        {/* Activity Summary Widget - Shows counts by category */}
        <Widget 
          title="Activity Summary" 
          description={`As of ${(() => {
            try {
              return format(new Date(), 'PPP');
            } catch {
              return new Date().toLocaleDateString();
            }
          })()}`}
          size="4x1"
          icon={Clock}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {activitySummary.map((item, index) => (
              <div 
                key={index} 
                className="bg-gray-800 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">{item.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{item.value}</p>
                  </div>
                  <div className={`p-2 rounded-full ${item.color}`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Widget>
        
        {/* Activity Filters Widget */}
        <Widget 
          title="Filters" 
          description="Refine activity display"
          size="4x1"
          icon={Filter}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Tabs 
                defaultValue={activeTab} 
                onValueChange={(value) => setActiveTab(value as ActivityTab)}
                className="w-full"
              >
                <TabsList className="grid grid-cols-5 text-white bg-gray-800">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="user">Users</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex gap-2 flex-wrap md:flex-nowrap">
              <div className="w-full md:w-48">
                <Select 
                  value={timeFilter} 
                  onValueChange={(value) => setTimeFilter(value as TimeFilter)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                    <SelectItem value="all-time">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-200 pl-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </Widget>
        
        {/* Recent Activity List Widget */}
        <ActivityWidget 
          title="Recent Activity" 
          description={`${filteredActivities.length} events found`}
          activities={formatActivitiesForWidget(filteredActivities.slice(0, 5))}
          size="2x2"
          icon={Activity}
          footerAction={
            filteredActivities.length > 5 ? (
              <Button 
                variant="outline" 
                className="w-full border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => {
                  // Scroll to detailed view
                  const element = document.getElementById('detailed-activity');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                View All {filteredActivities.length} Activities
              </Button>
            ) : null
          }
        />
        
        {/* Activity Timeline Widget */}
        <Widget 
          title="Activity Timeline" 
          description="Recent system events by time"
          size="2x2"
          icon={Calendar}
        >
          <div className="space-y-4 overflow-y-auto max-h-full">
            {filteredActivities.slice(0, 7).map((activity, index) => {
              // Determine color based on activity type
              const colorMap: Record<ActivityType, string> = {
                content: 'border-blue-500',
                user: 'border-green-500',
                settings: 'border-purple-500',
                system: 'border-orange-500',
                product: 'border-pink-500'
              };
              
              const borderColor = colorMap[activity.type] || 'border-gray-500';
              
              return (
                <div 
                  key={activity.id} 
                  className={`relative pl-6 pb-4 ${
                    index !== filteredActivities.slice(0, 7).length - 1 ? 'border-l-2 border-gray-700' : ''
                  }`}
                >
                  <div className={`absolute left-[-5px] top-0 h-3 w-3 rounded-full ${borderColor.replace('border', 'bg')}`} />
                  <div className="bg-gray-800/50 p-2 rounded">
                    <div className="font-medium text-white">{activity.title}</div>
                    <div className="text-xs text-gray-400">{activity.time}</div>
                    <div className="text-sm text-gray-300 mt-1">{activity.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Widget>
        
        {/* Detailed Activity Table Widget */}
        <TableWidget
          title="Detailed Activity Log"
          description={`Complete audit trail - ${filteredActivities.length} records`}
          columns={getActivityColumns()}
          data={filteredActivities}
          emptyMessage="No activities match your filters"
          size="4x2"
          icon={Database}
        />
      </WidgetGrid>
    </main>
  );
}

// Fallback for Suspense boundary
function ActivityLoadingSkeleton() {
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-800 rounded animate-pulse"></div>
          <div>
            <div className="h-8 w-40 bg-gray-800 rounded animate-pulse"></div>
            <div className="h-4 w-60 bg-gray-800 rounded animate-pulse mt-2"></div>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-800 rounded animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="h-40 bg-gray-800 rounded animate-pulse"></div>
        <div className="h-20 bg-gray-800 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-800 rounded animate-pulse"></div>
          <div className="h-80 bg-gray-800 rounded animate-pulse"></div>
        </div>
        <div className="h-80 bg-gray-800 rounded animate-pulse"></div>
      </div>
    </main>
  );
}

export default function AdminActivity(): React.ReactNode {
  const { adminData, loading, error } = useAdminAuth();
  const router = useRouter();

  async function handleSignOut(): Promise<void> {
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

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Include Sidebar with adminData */}
      {adminData && (
        <Sidebar user={{ ...adminData, avatarUrl: adminData.avatarUrl ?? undefined }} />
      )}
      
      {/* Wrap the component using searchParams in Suspense */}
      <Suspense fallback={<ActivityLoadingSkeleton />}>
        <ActivityContent adminData={adminData} />
      </Suspense>
    </div>
  );
}