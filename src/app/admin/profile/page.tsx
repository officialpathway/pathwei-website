'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { signOut } from '@/lib/auth/auth';
import { updateAdminUser } from '@/lib/auth/admin';
import { 
  ArrowLeft, 
  Save,
  Loader2,
  User,
  Camera,
  Shield
} from 'lucide-react';
import Image from 'next/image';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import Sidebar from '@/components/client/admin/sidebar';
import { 
  WidgetGrid, 
  Widget
} from '@/components/client/admin/widget';

export default function AdminProfile() {
  const { adminData, loading, error } = useAdminAuth();
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    status: '',
    avatarUrl: '',
  });
  
  // Initialize profileData from adminData when it becomes available
  useEffect(() => {
    if (adminData) {
      setProfileData({
        name: adminData.name || '',
        email: adminData.email || '',
        role: adminData.role || '',
        status: adminData.status || '',
        avatarUrl: adminData.avatarUrl || '',
      });
    }
  }, [adminData]);
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
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
      setUpdateError(null);
      
      if (!adminData) {
        setUpdateError('No user data available');
        return;
      }
      
      // Here you would typically upload the avatar if changed
      // and get the new URL, then update the user profile
      let avatarUrlToSave = profileData.avatarUrl;
      
      if (avatarFile) {
        // Simulate file upload - in real implementation you would upload to storage
        // and get back the URL
        avatarUrlToSave = avatarPreview || profileData.avatarUrl;
        // Example: avatarUrlToSave = await uploadAvatar(adminData.id, avatarFile);
      }
      
      // Update the user profile with the new data
      await updateAdminUser(adminData.name, {
        name: profileData.name,
        avatar_id: avatarUrlToSave,
        // Add other fields that should be updatable
      });
      
      setSuccess('Profile updated successfully');
      
      // Clear the file input
      setAvatarFile(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setUpdateError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
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
    <div className="flex h-screen bg-gray-950">
      {/* Include Sidebar with adminData */}
      {adminData && (
        <Sidebar user={{ ...adminData, avatarUrl: adminData.avatarUrl ?? undefined }} />
      )}
      
      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-2">
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Profile</h1>
            <p className="text-gray-400">Update your personal information</p>
          </div>
        </div>
        
        {success && (
          <Alert className="mb-6 bg-green-900 border-green-800 text-green-100">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        {(error || updateError) && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || updateError}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <WidgetGrid columns={3}>
            {/* Profile Picture Widget */}
            <Widget 
              title="Profile Picture" 
              description="Update your profile image"
              size="1x2"
              icon={Camera}
            >
              <div className="flex flex-col items-center space-y-6">
                <div>
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
              </div>
            </Widget>
            
            {/* Personal Details Widget */}
            <Widget 
              title="Personal Details" 
              description="Update your basic information"
              size="2x1"
              icon={User}
            >
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
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
                
                <div className="flex flex-col space-y-1.5">
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
              </div>
            </Widget>
            
            {/* Account Role Widget */}
            <Widget 
              title="Account Role" 
              description="Your system permissions"
              size="2x1"
              icon={Shield}
            >
              <div className="space-y-4">
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
                  <Label htmlFor="status" className="text-gray-300">Status</Label>
                  <Input 
                    id="status" 
                    name="status"
                    value={profileData.status}
                    className="bg-gray-800 border-gray-700 text-gray-200 capitalize"
                    disabled
                  />
                </div>
              </div>
            </Widget>
            
            {/* Actions Widget */}
            <Widget 
              title="Actions" 
              description="Save or cancel changes"
              size="3x1"
              icon={Save}
              footerAction={
                <div className="flex justify-between w-full">
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
                </div>
              }
            >
              <div className="space-y-3">
                <p className="text-gray-400">
                  Review your changes before saving. Your profile information will be visible to other system administrators.
                </p>
                <div className="bg-gray-800/50 p-3 rounded border-l-2 border-yellow-500">
                  <p className="text-sm text-gray-300">
                    Note: Some information can only be changed by users with higher permission levels.
                  </p>
                </div>
                
                {/* Security details - you could expand this in a real app */}
                <div className="bg-gray-800/50 p-3 rounded border-l-2 border-green-500">
                  <p className="text-sm text-gray-300">
                    Last login: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </Widget>
          </WidgetGrid>
        </form>
      </main>
    </div>
  );
}