'use client';

import { Users, Mail, Trash2, Calendar } from 'lucide-react';
import { Widget, WidgetSize } from '@/components/widgets/Widgets';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface SubscriberData {
  email: string;
  subscribedAt?: string;
  isActive?: boolean;
}

interface SubscribersTableWidgetProps {
  subscribers: SubscriberData[];
  size?: WidgetSize;
  className?: string;
  requiredRole?: 'admin' | 'manager' | 'editor' | 'viewer' | 'all';
  userRole?: string;
  onDeleteSubscriber: (email: string) => Promise<void>;
}

export function SubscribersTableWidget({
  subscribers,
  size = '4x4',
  className,
  requiredRole = 'admin',
  userRole = 'all',
  onDeleteSubscriber
}: SubscribersTableWidgetProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleDelete() {
    if (!deleteEmail) return;
    
    try {
      setDeleteLoading(true);
      await onDeleteSubscriber(deleteEmail);
      setShowDeleteModal(false);
      setDeleteEmail(null);
    } catch (error) {
      console.error("Error in delete handler:", error);
    } finally {
      setDeleteLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <>
      <Widget
        title="Newsletter Subscribers"
        description={`${subscribers.length} active subscribers`}
        icon={Users}
        iconClassName="bg-indigo-500/20"
        size={size}
        className={className}
        requiredRole={requiredRole}
        userRole={userRole}
      >
        {subscribers.length > 0 ? (
          <div className="overflow-auto max-h-[calc(100%-2rem)]">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-850 sticky top-0">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email Address
                  </th>
                  {subscribers.some(s => s.subscribedAt) && (
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Subscribed
                    </th>
                  )}
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {subscribers.map((subscriber, index) => (
                  <tr key={subscriber.email || index} className="hover:bg-gray-850 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <div className="text-sm font-medium text-gray-200 truncate">
                          {subscriber.email}
                        </div>
                        {subscriber.isActive === false && (
                          <span className="ml-2 px-2 py-1 text-xs bg-red-900/20 text-red-400 rounded-full">
                            Inactive
                          </span>
                        )}
                      </div>
                    </td>
                    {subscriber.subscribedAt && (
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                          <div>
                            <div className="text-gray-300">{getRelativeTime(subscriber.subscribedAt)}</div>
                            <div className="text-xs text-gray-500">{formatDate(subscriber.subscribedAt)}</div>
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeleteEmail(subscriber.email);
                          setShowDeleteModal(true);
                        }}
                        className="hover:bg-red-900/20 hover:text-red-400 transition-colors"
                        title="Delete subscriber"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Users className="h-12 w-12 mb-3 text-gray-600" />
            <div className="text-center">
              <p className="font-medium">No subscribers yet</p>
              <p className="text-sm text-gray-500">Newsletter subscribers will appear here</p>
            </div>
          </div>
        )}
      </Widget>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-gray-200">
          <DialogHeader>
            <DialogTitle className="text-white">Remove Subscriber</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to remove <strong>{deleteEmail}</strong> from your newsletter subscribers? 
              This action will mark them as inactive and can be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteLoading}
              className="border-gray-700 text-gray-200 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? 'Removing...' : 'Remove Subscriber'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}