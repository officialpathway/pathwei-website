/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Search, Mail, Trash2, Edit, UserPlus, RefreshCw, Check, X, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useAdminAuthGuard } from '@/hooks/useAdminAuthGuard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { User, getUsers, deleteUser, updateUser, addUser, resendInvite, uploadAvatar, removeAvatar } from '@/lib/db/users';

type InviteUserForm = {
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
};

type EditUserForm = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
};

export default function UserManagement() {
  useAdminAuthGuard();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [userForAvatar, setUserForAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inviteForm, setInviteForm] = useState<InviteUserForm>({
    email: '',
    name: '',
    role: 'editor',
  });
  const [editForm, setEditForm] = useState<EditUserForm>({
    id: '',
    email: '',
    name: '',
    role: 'editor',
  });
  const [users, setUsers] = useState<User[]>([]);
  const usersPerPage = 8;

  // Data Fetching
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        toast.error("Failed to load users");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const formatLastActive = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleResendInvite = async (email: string) => {
    try {
      setIsLoading(true);
      await resendInvite(email);
      toast.success(`Invite resent to ${email}`);
    } catch (error) {
      toast.error('Failed to resend invite');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (userId: string) => {
    // Find the user to edit
    const userToEdit = users.find(u => u.id === userId);
    if (!userToEdit) {
      toast.error("User not found");
      return;
    }
    
    // Initialize the edit form with the user's current details
    setEditForm({
      id: userToEdit.id,
      email: userToEdit.email,
      name: userToEdit.name,
      role: userToEdit.role as 'admin' | 'editor' | 'viewer',
    });
    
    // Open the edit dialog
    setIsEditDialogOpen(true);
  };

  // Handle save edited user
  const handleSaveEditedUser = async () => {
    if (!editForm.email || !editForm.name) {
      toast.error('Name and email are required');
      return;
    }

    try {
      setIsLoading(true);
      
      // Update the user in the database
      await updateUser(editForm.id, {
        email: editForm.email,
        name: editForm.name,
        role: editForm.role,
      });
      
      // Update the user in the local state
      setUsers(users.map(user => 
        user.id === editForm.id 
        ? { ...user, email: editForm.email, name: editForm.name, role: editForm.role } 
        : user
      ));
      
      toast.success('User updated successfully');
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update user');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add User
  const handleInviteUser = async () => {
    if (!inviteForm.email) {
      toast.error('Email is required');
      return;
    }

    try {
      setIsLoading(true);
      await addUser({
        email: inviteForm.email,
        name: inviteForm.name || inviteForm.email.split('@')[0],
        role: inviteForm.role,
        status: 'invited',
        lastActive: new Date().toISOString()
      });
      
      // Refresh the user list
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
      
      toast.success(`Invite sent to ${inviteForm.email}`);
      setIsInviteDialogOpen(false);
      setInviteForm({ email: '', name: '', role: 'editor' });
    } catch (error) {
      toast.error('Failed to send invite');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsLoading(true);
      await deleteUser(userToDelete);
      
      // Refresh the user list
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
      
      toast.success('User deleted');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete user');
      console.error(error);
    } finally {
      setIsLoading(false);
      setUserToDelete(null);
    }
  };

  // Update Status
  const handleStatusChange = async (userId: string, newStatus: 'active' | 'suspended') => {
    try {
      setIsLoading(true);
      await updateUser(userId, { status: newStatus });
      
      // Refresh the user list
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
      
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`);
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Open file input dialog
  const handleOpenFileDialog = (userId: string) => {
    setUserForAvatar(userId);
    // Trigger file input click programmatically
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userForAvatar) return;
    
    try {
      setIsUploadingAvatar(true);
      const avatarUrl = await uploadAvatar(userForAvatar, file);
      
      // Update user in the local state with new avatar
      setUsers(users.map(u => 
        u.id === userForAvatar ? { ...u, avatar: avatarUrl } : u
      ));
      
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Failed to upload avatar');
      console.error(error);
    } finally {
      setIsUploadingAvatar(false);
      setUserForAvatar(null);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  
  // Handle avatar removal
  const handleRemoveAvatar = async (userId: string) => {
    try {
      setIsUploadingAvatar(true);
      await removeAvatar(userId);
      
      // Update user in the local state to remove avatar
      setUsers(users.map(u => 
        u.id === userId ? { ...u, avatar: undefined } : u
      ));
      
      toast.success('Avatar removed');
    } catch (error) {
      toast.error('Failed to remove avatar');
      console.error(error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">User Management</h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users..."
                className="pl-10"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
            <Button 
              onClick={() => setIsInviteDialogOpen(true)}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium border-0"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </div>
        </div>

        {/* Hidden file input for avatar upload */}
        <input
          title='Avatar upload'
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleAvatarUpload}
        />

        {/* Users Table */}
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-4 w-[120px]" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              ) : currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {/* Avatar with dropdown for management */}
                        <div className="relative">
                          <button
                            onClick={() => handleOpenFileDialog(user.id)}
                            className="h-10 w-10 rounded-full relative group cursor-pointer overflow-hidden"
                            type="button"
                            aria-label={user.avatar ? "Update avatar" : "Add avatar"}
                          >
                            {user.avatar ? (
                              <>
                                <Image
                                  src={user.avatar}
                                  alt={user.name}
                                  width={40}
                                  height={40}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity">
                                  <Camera className="h-5 w-5 text-white" />
                                </div>
                              </>
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                                <span className="text-gray-500 text-sm">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                                <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity">
                                  <Camera className="h-5 w-5 text-gray-600" />
                                </div>
                              </div>
                            )}
                          </button>
                          
                          {user.avatar && (
                            <button
                              onClick={() => handleRemoveAvatar(user.id)}
                              className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
                              type="button"
                              aria-label="Remove avatar"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === 'admin' ? 'default' :
                          user.role === 'editor' ? 'secondary' : 'outline'
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === 'active' ? 'default' :
                          user.status === 'invited' ? 'secondary' : 'destructive'
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatLastActive(user.lastActive)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              size="sm" 
                              disabled={isLoading}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 border-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {user.status === 'invited' && (
                              <DropdownMenuItem 
                                onClick={() => handleResendInvite(user.email)}
                                disabled={isLoading}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Resend Invite
                              </DropdownMenuItem>
                            )}
                            {user.status === 'suspended' && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(user.id, 'active')}
                                disabled={isLoading}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            {user.status === 'active' && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(user.id, 'suspended')}
                                disabled={isLoading}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleEditUser(user.id)}
                              disabled={isLoading}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => {
                                setUserToDelete(user.id);
                                setIsDeleteDialogOpen(true);
                              }}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {searchTerm ? 'No users match your search' : 'No users found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > usersPerPage && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                <button 
                  type='button'
                  title='Previous'
                  disabled={currentPage === 1 || isLoading}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 || isLoading ? 'pointer-events-none opacity-50' : ''}
                >
                  <PaginationPrevious />
                </button>
                </PaginationItem>
                <PaginationItem>
                  <span className="px-4 py-1 rounded-md bg-gray-100 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                <button 
                  type="button"
                  title="Go to next page"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  disabled={isLoading}
                >
                  <PaginationNext />
                </button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Invite User Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Send an invitation to join your team. They&apos;ll receive an email with instructions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Name (Optional)
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium">
                Role
              </label>
              <Select
                value={inviteForm.role}
                onValueChange={(value) => setInviteForm({...inviteForm, role: value as any})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsInviteDialogOpen(false)}
              disabled={isLoading}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleInviteUser}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Mail className="h-4 w-4 mr-2" />
              )}
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-email" className="block text-sm font-medium">
                Email Address
              </label>
              <Input
                id="edit-email"
                type="email"
                placeholder="user@example.com"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-name" className="block text-sm font-medium">
                Name
              </label>
              <Input
                id="edit-name"
                type="text"
                placeholder="John Doe"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-role" className="block text-sm font-medium">
                Role
              </label>
              <Select
                value={editForm.role}
                onValueChange={(value) => setEditForm({...editForm, role: value as any})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isLoading}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEditedUser}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Edit className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteUser}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}