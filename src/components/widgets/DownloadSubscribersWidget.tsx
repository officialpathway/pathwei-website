'use client';

import { Download } from 'lucide-react';
import { Widget, WidgetSize } from '@/components/widgets/Widgets';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SubscriberData {
  email: string;
}

interface DownloadSubscribersWidgetProps {
  subscribers: SubscriberData[];
  size?: WidgetSize;
  className?: string;
  requiredRole?: 'admin' | 'manager' | 'editor' | 'viewer' | 'all';
  userRole?: string;
}

export function DownloadSubscribersWidget({
  subscribers,
  size = '1x1',
  className,
  requiredRole = 'admin',
  userRole = 'all'
}: DownloadSubscribersWidgetProps) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    try {
      setDownloading(true);
      
      // Create a CSV string from the subscribers
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Email\n" 
        + subscribers.map(s => s.email).join("\n");
      
      // Create a download link and trigger the download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "newsletter_subscribers.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading subscribers:', error);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Widget
      title="Export Subscribers"
      description="Download subscriber list as CSV"
      icon={Download}
      iconClassName="bg-purple-500/20"
      size={size}
      className={className}
      requiredRole={requiredRole}
      userRole={userRole}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-400 mb-4 text-center">
          {subscribers.length} subscribers available for export
        </p>
        <Button
          onClick={handleDownload}
          disabled={downloading || subscribers.length === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          <Download className="h-4 w-4 mr-2" />
          {downloading ? 'Downloading...' : 'Export CSV'}
        </Button>
      </div>
    </Widget>
  );
}