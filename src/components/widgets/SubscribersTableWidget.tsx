'use client';

import { Users, Mail, Trash2 } from 'lucide-react';
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
  size = '3x2',
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

  return (
    <>
      <Widget
        title="Newsletter Subscribers"
        description="Complete list of all newsletter subscribers"
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
              <thead className="bg-gray-850">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {subscribers.map((subscriber, index) => (
                  <tr key={index} className="hover:bg-gray-850 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-200 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {subscriber.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeleteEmail(subscriber.email);
                          setShowDeleteModal(true);
                        }}
                        className="hover:bg-red-900/20 hover:text-red-400"
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
          <div className="flex items-center justify-center h-full text-gray-400">
            No subscribers available
          </div>
        )}
      </Widget>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-gray-200">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Subscriber</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to remove {deleteEmail} from your newsletter subscribers? 
              This action cannot be undone.
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
              {deleteLoading ? 'Deleting...' : 'Delete Subscriber'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}