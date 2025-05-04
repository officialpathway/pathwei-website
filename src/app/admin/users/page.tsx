// pages/admin/user-management.tsx
"use client";

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash, Edit, MoreHorizontal, UserPlus, FilterX, Search, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import axios from 'axios';

// Supabase
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/new/supabase';

// Components import
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { signOut } from '@/lib/new/auth';
import Sidebar from '@/components/client/admin/sidebar';

// Auth imports
import { AdminUser } from '@/lib/new/admin';

type Filter = {
  role: string | null;
  status: string | null;
  search: string;
};

export default function UsersManagement() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminData, setAdminData] = useState<any>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canManageUsers, setCanManageUsers] = useState(false);
  
  // For editing and adding users
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer',
    status: 'invited',
    customMessage: '',
    sendWelcomeEmail: true,
  });
  
  // For filtering
  const [filters, setFilters] = useState<Filter>({
    role: null,
    status: null,
    search: '',
  });

  // Loading states for buttons
  const [addingUser, setAddingUser] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.push('/admin/login');
  }

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        // Get basic user info
        const supabase = createClient()

        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
          redirect('/admin/login')
        }

        console.log('[AdminDashboard] User:', data.user)
        setCurrentUser(data.user);
        
        // Get user data from the users table to check if admin
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (userError || !userData) {
          setError('Error fetching user data');
          return;
        }
        
        if (userData.role !== 'admin') {
          setError('You do not have admin privileges');
          return;
        }
        
        setAdminData(userData);
        
        // Set permissions based on role
        setCanManageUsers(userData.role === 'admin');

        // Fetch all users
        await fetchUsers();
      } catch (err) {
        setError('Error fetching user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data || []);
      applyFilters(data || [], filters);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load users.');
    }
  };

  // Apply filters to users
  const applyFilters = (usersList: AdminUser[], currentFilters: Filter) => {
    let result = [...usersList];

    // Apply role filter
    if (currentFilters.role) {
      result = result.filter(user => user.role === currentFilters.role);
    }

    // Apply status filter
    if (currentFilters.status) {
      result = result.filter(user => user.status === currentFilters.status);
    }

    // Apply search filter (search in name and email)
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      result = result.filter(
        user => 
          user.name.toLowerCase().includes(searchTerm) || 
          user.email.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredUsers(result);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof Filter, value: string | null) => {
    const newFilters = { ...filters, [key]: value === 'all' ? null : value };
    setFilters(newFilters);
    applyFilters(users, newFilters);
  };

  // Reset all filters

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  // Open edit dialog and set form data
  const openEditDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      customMessage: '',
      sendWelcomeEmail: true,
    });
    setIsEditDialogOpen(true);
  };

  // Open invite dialog and set form data
  const openInviteDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setFormData({
      ...formData,
      name: user.name,
      email: user.email,
      customMessage: `Hello ${user.name},\n\nYou've been invited to join our platform. Please use the link below to set up your account.`,
      sendWelcomeEmail: true,
    });
    setIsInviteDialogOpen(true);
  };

  // Open add dialog and reset form
  const openAddDialog = () => {
    setFormData({
      name: '',
      email: '',
      role: 'viewer',
      status: 'invited',
      customMessage: 'Hello,\n\nYou\'ve been invited to join our platform. Please use the link below to set up your account.',
      sendWelcomeEmail: true,
    });
    setIsAddDialogOpen(true);
  };

  // Add a new user
  const addUser = async () => {
    try {
      setAddingUser(true);
      
      if (!formData.name || !formData.email) {
        toast.error('Name and email are required.');
        return;
      }

      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', formData.email)
        .single();

      if (existingUser) {
        toast.error('A user with this email already exists.');
        return;
      }
      
      // Call the API endpoint to add a user
      const response = await axios.post('/api/admin/users', {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        sendWelcomeEmail: formData.sendWelcomeEmail,
        customMessage: formData.customMessage,
      });
      
      if (response.status !== 200) {
        throw new Error('Failed to add user');
      }

      setIsAddDialogOpen(false);
      await fetchUsers();
      
      if (formData.sendWelcomeEmail) {
        toast.success('User added and invitation email sent successfully.');
      } else {
        toast.success('User added successfully.');
      }
    } catch (err) {
      console.error('Error adding user:', err);
      toast.error('Failed to add user.');
    } finally {
      setAddingUser(false);
    }
  };

  // Update an existing user
  const updateUser = async () => {
    if (!selectedUser) return;
    
    try {
      setUpdatingUser(true);
      
      // Call the API endpoint to update a user
      const response = await axios.put(`/api/admin/users/${selectedUser.id}`, {
        name: formData.name,
        role: formData.role,
        status: formData.status,
      });
      
      if (response.status !== 200) {
        throw new Error('Failed to update user');
      }

      setIsEditDialogOpen(false);
      await fetchUsers();
      toast.success('User updated successfully.');
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Failed to update user.');
    } finally {
      setUpdatingUser(false);
    }
  };

  // Send an invitation email
  const sendInvite = async () => {
    if (!selectedUser) return;
    
    try {
      setSendingInvite(true);
      
      // Call the API endpoint to send an invitation
      const response = await axios.post(`/api/admin/users/${selectedUser.id}/invite`, {
        customMessage: formData.customMessage,
      });
      
      if (response.status !== 200) {
        throw new Error('Failed to send invitation');
      }

      setIsInviteDialogOpen(false);
      toast.success('Invitation sent successfully.');
    } catch (err) {
      console.error('Error sending invitation:', err);
      toast.error('Failed to send invitation.');
    } finally {
      setSendingInvite(false);
    }
  };

  // Delete a user
  const deleteUser = async (userId: string) => {
    try {
      // Check if this is the current user
      if (userId === currentUser?.id) {
        toast.error("You cannot delete your own account.");
        return;
      }

      // Call the API endpoint to delete a user
      const response = await axios.delete(`/api/admin/users/${userId}`);
      
      if (response.status !== 200) {
        throw new Error('Failed to delete user');
      }

      await fetchUsers();
      toast.success('User deleted successfully.');
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user.');
    }
  };

  // Helper function to get avatar fallback text
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-500 hover:bg-green-500/20';
      case 'invited':
        return 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/20';
      case 'suspended':
        return 'bg-red-500/20 text-red-500 hover:bg-red-500/20';
      default:
        return 'bg-gray-500/20 text-gray-500 hover:bg-gray-500/20';
    }
  };

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

  if (error && !adminData) {
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
    <div className="flex h-screen bg-gray-950 text-gray-200">
      {/* Include Sidebar with adminData */}
      {adminData && (
        <Sidebar user={{ ...adminData, avatarUrl: adminData.avatarUrl ?? undefined }} />
      )}

      <div className="w-full p-4 space-y-6 bg-gray-950 text-gray-200">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-gray-400 mt-1">Manage your team and control their permissions</p>
          </div>
          {canManageUsers && (
            <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700 text-white">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          )}
        </div>

        <Card className="border-gray-800 bg-gray-900 shadow-md">
          <CardHeader>
            <CardTitle className="text-white">Users</CardTitle>
            <CardDescription className="text-gray-400">Manage your team members and their access levels.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="flex flex-1 items-center space-x-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    className="w-full pl-8 bg-gray-800 border-gray-700 text-gray-200"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
                <Select
                  value={filters.role || 'all'}
                  onValueChange={(value) => handleFilterChange('role', value)}
                >
                  <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-gray-200">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="all">All roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-gray-200">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="invited">Invited</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                {(filters.role || filters.status || filters.search) && (
                  <Button variant="outline" size="icon" className="border-gray-700 text-gray-200 hover:bg-gray-800">
                    <FilterX className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-md border border-gray-800">
              <Table>
                <TableHeader className="bg-gray-800/50">
                  <TableRow className="border-gray-800 hover:bg-gray-800/50">
                    <TableHead className="text-gray-300">User</TableHead>
                    <TableHead className="text-gray-300">Role</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Last Active</TableHead>
                    <TableHead className="text-gray-300">Joined</TableHead>
                    {canManageUsers && <TableHead className="text-gray-300 text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow className="border-gray-800 hover:bg-gray-800/50">
                      <TableCell colSpan={canManageUsers ? 6 : 5} className="h-24 text-center text-gray-400">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-gray-800 hover:bg-gray-800/50">
                        <TableCell className="font-medium text-gray-200">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 bg-gray-700">
                              {user.avatar ? (
                                <AvatarImage src={user.avatar} alt={user.name} />
                              ) : (
                                <AvatarFallback className="bg-gray-700 text-gray-200">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-200">{user.name}</p>
                              <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize border-gray-700 text-gray-300">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`capitalize ${getStatusColor(user.status)}`}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {user.last_active ? (
                            format(new Date(user.last_active), 'MMM d, yyyy')
                          ) : (
                            <span className="text-gray-500">Never</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {format(new Date(user.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        {canManageUsers && (
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-gray-800">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-200" align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-gray-700" />
                                <DropdownMenuItem 
                                  onClick={() => openEditDialog(user)}
                                  className="hover:bg-gray-700 cursor-pointer"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {user.status === 'invited' && (
                                  <DropdownMenuItem 
                                    onClick={() => openInviteDialog(user)}
                                    className="hover:bg-gray-700 cursor-pointer"
                                  >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Resend Invite
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-red-400 hover:bg-gray-700 focus:text-red-400 cursor-pointer"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <AlertDialog open={selectedUser?.id === user.id} onOpenChange={() => setSelectedUser(null)}>
                              <AlertDialogContent className="bg-gray-800 border-gray-700 text-gray-200">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-400">
                                    This action cannot be undone. This will permanently delete the user account and remove their data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-gray-700 text-gray-200 hover:bg-gray-600">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                    onClick={() => selectedUser && deleteUser(selectedUser.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
            <div className="text-sm text-gray-400">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </CardFooter>
        </Card>

        {/* Add User Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-gray-800 border-gray-700 text-gray-200 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Add New User</DialogTitle>
              <DialogDescription className="text-gray-400">
                Add a new user to your team. They will receive an invitation email.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-gray-300">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-gray-200"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-gray-200"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role" className="text-gray-300">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange('role', value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customMessage" className="text-gray-300">Welcome Message (Optional)</Label>
                <Textarea
                  id="customMessage"
                  name="customMessage"
                  placeholder="Add a custom message to the invitation email"
                  value={formData.customMessage}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-gray-200 min-h-[100px]"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sendWelcomeEmail" 
                  checked={formData.sendWelcomeEmail}
                  onCheckedChange={(checked: boolean) => handleCheckboxChange('sendWelcomeEmail', checked)}
                  className="border-gray-600 data-[state=checked]:bg-blue-600"
                />
                <Label 
                  htmlFor="sendWelcomeEmail" 
                  className="text-gray-300 text-sm cursor-pointer"
                >
                  Send welcome email with setup instructions
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
                className="bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                onClick={addUser}
                disabled={addingUser}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {addingUser ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Adding...
                  </>
                ) : (
                  'Add User'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-gray-800 border-gray-700 text-gray-200">
            <DialogHeader>
              <DialogTitle className="text-white">Edit User</DialogTitle>
              <DialogDescription className="text-gray-400">
                Update user information and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name" className="text-gray-300">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-gray-200"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email" className="text-gray-300">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                  className="bg-gray-700 border-gray-600 text-gray-500"
                />
                <p className="text-xs text-gray-400">Email cannot be changed.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role" className="text-gray-300">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange('role', value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status" className="text-gray-300">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="invited">Invited</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                onClick={updateUser}
                disabled={updatingUser}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {updatingUser ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Invite User Dialog */}
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogContent className="bg-gray-800 border-gray-700 text-gray-200 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Send Invitation</DialogTitle>
              <DialogDescription className="text-gray-400">
                Send a new invitation email to the user.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="invite-email" className="text-gray-300">User Email</Label>
                <Input
                  id="invite-email"
                  value={formData.email}
                  disabled
                  className="bg-gray-700 border-gray-600 text-gray-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-message" className="text-gray-300">Invitation Message</Label>
                <Textarea
                  id="invite-message"
                  name="customMessage"
                  placeholder="Add a custom message to the invitation email"
                  value={formData.customMessage}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-gray-200 min-h-[150px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsInviteDialogOpen(false)}
                className="bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                onClick={sendInvite}
                disabled={sendingInvite}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {sendingInvite ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : (
                  'Send Invitation'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}