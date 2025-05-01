'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/server/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/server/ui/card';
import { Input } from '@/components/server/ui/input';
import { Label } from '@/components/server/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/server/ui/select';
import { Textarea } from '@/components/server/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/server/ui/alert';
import { getUser, signOut } from '@/lib/new/auth';
import { getAdminUser, updateAdminUser } from '@/lib/new/admin';
import { 
  ArrowLeft, 
  LogOut, 
  Save,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';

export default function AdminProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    status: '',
    bio: '',
    phone: '',
    location: '',
    timezone: '',
    avatarUrl: '',
    notifications: {
      email: true,
      push: false,
      sms: false
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        // Get basic user info
        const currentUser = await getUser();
        
        if (!currentUser) {
          router.push('/admin/login');
          return;
        }
        
        setUser(currentUser);
        
        // Get admin-specific data
        const adminUserData = await getAdminUser(currentUser.id);
        if (!adminUserData) {
          setError('You do not have admin privileges');
          return;
        }
        
        setProfileData({
          name: adminUserData.name || '',
          email: adminUserData.email || '',
          role: adminUserData.role || '',
          status: adminUserData.status || 'active',
          bio: adminUserData.bio || '',
          phone: adminUserData.phone || '',
          location: adminUserData.location || '',
          timezone: adminUserData.timezone || 'UTC',
          avatarUrl: adminUserData.avatarUrl || '',
          notifications: adminUserData.notifications || {
            email: true,
            push: false,
            sms: false
          }
        });
      } catch (err) {
        setError('Error fetching user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (type: 'email' | 'push' | 'sms', checked: boolean) => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: checked
      }
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSignOut() {
    await signOut();
    router.push('/admin/login');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setSaving(true);
      setSuccess(null);
      setError(null);
      
      if (!user) {
        setError('User not authenticated');
        return;
      }
      
      // Here you would typically upload the avatar if changed
      // and get the new URL, then update the user profile
      // This is a simplified version without actual file upload
      let avatarUrlToSave = profileData.avatarUrl;
      
      if (avatarFile) {
        // Simulate file upload - in real implementation you would upload to storage
        // and get back the URL
        avatarUrlToSave = avatarPreview || profileData.avatarUrl;
        // Example: avatarUrlToSave = await uploadAvatar(user.id, avatarFile);
      }
      
      await updateAdminUser(user.id, {
        
      });
      
      setSuccess('Profile updated successfully');
      
      // Update the current profile data
      setProfileData(prev => ({
        ...prev,
        avatarUrl: avatarUrlToSave
      }));
      
      // Clear the file input
      setAvatarFile(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profileData.name) {
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
    <div className="p-4 md:p-8 bg-gray-950 text-gray-200 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/admin')}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          </div>
          
          <Button 
            variant="outline"
            size="icon"
            onClick={handleSignOut}
            title="Sign Out"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        
        {success && (
          <Alert className="mb-6 bg-green-900 border-green-800 text-green-100">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Avatar and basic info */}
            <Card className="md:col-span-1 bg-gray-900 border-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Profile Picture</CardTitle>
                <CardDescription className="text-gray-400">Update your profile image</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="mb-6">
                  {avatarPreview || profileData.avatarUrl ? (
                    <div className="h-32 w-32 overflow-hidden rounded-full mx-auto">
                      <Image 
                        src={avatarPreview || profileData.avatarUrl} 
                        alt={profileData.name}
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl mx-auto">
                      {profileData.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="avatar" className="text-gray-300">Upload New Picture</Label>
                    <Input 
                      id="avatar" 
                      type="file" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="bg-gray-800 border-gray-700 text-gray-200"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-1.5 w-full">
                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="bg-gray-800 border-gray-700 text-gray-200"
                    required
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5 w-full">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="bg-gray-800 border-gray-700 text-gray-200"
                    required
                    disabled
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
              </CardFooter>
            </Card>
            
            {/* Main profile information */}
            <Card className="md:col-span-2 bg-gray-900 border-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-gray-400">Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="bg-gray-800 border-gray-700 text-gray-200"
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="location" className="text-gray-300">Location</Label>
                    <Input 
                      id="location" 
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      placeholder="City, Country"
                      className="bg-gray-800 border-gray-700 text-gray-200"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="role" className="text-gray-300">Role</Label>
                    <Input 
                      id="role" 
                      name="role"
                      value={profileData.role}
                      className="bg-gray-800 border-gray-700 text-gray-200"
                      disabled
                    />
                    <p className="text-xs text-gray-400 mt-1">Role can only be changed by super admin</p>
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="timezone" className="text-gray-300">Timezone</Label>
                    <Select 
                      value={profileData.timezone} 
                      onValueChange={(value) => handleSelectChange('timezone', value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                        <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                        <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                        <SelectItem value="CST">CST (Central Standard Time)</SelectItem>
                        <SelectItem value="MST">MST (Mountain Standard Time)</SelectItem>
                        <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                        <SelectItem value="IST">IST (Indian Standard Time)</SelectItem>
                        <SelectItem value="JST">JST (Japan Standard Time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                  <Textarea 
                    id="bio" 
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    placeholder="Write a short bio about yourself"
                    className="h-32 bg-gray-800 border-gray-700 text-gray-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-gray-300 font-medium">Notification Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        title="Email Notifications"
                        type="checkbox"
                        id="email-notifications"
                        checked={profileData.notifications.email}
                        onChange={(e) => handleNotificationChange('email', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-indigo-600"
                      />
                      <Label htmlFor="email-notifications" className="text-gray-300">
                        Email Notifications
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        title="Push Notifications"
                        type="checkbox"
                        id="push-notifications"
                        checked={profileData.notifications.push}
                        onChange={(e) => handleNotificationChange('push', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-indigo-600"
                      />
                      <Label htmlFor="push-notifications" className="text-gray-300">
                        Push Notifications
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        title="SMS Notifications"
                        type="checkbox"
                        id="sms-notifications"
                        checked={profileData.notifications.sms}
                        onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-indigo-600"
                      />
                      <Label htmlFor="sms-notifications" className="text-gray-300">
                        SMS Notifications
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => router.push('/admin')}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}