'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { signOut } from '@/lib/auth/auth';
import { 
  LogOut, ArrowLeft, 
  Save, Loader2
} from 'lucide-react';
import Image from 'next/image';
import { useAdminAuth } from '@/hooks/use-admin-auth';

export default function GeneralSettings() {
  const { adminData, loading, error } = useAdminAuth();
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [settings, setSettings] = useState({
    siteName: 'My Awesome Site',
    siteDescription: 'A comprehensive platform for all your needs',
    contactEmail: 'admin@example.com',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Main Street, City, Country',
    maintenanceMode: false,
    enableRegistration: true,
    showFooterCredits: true,
    defaultLanguage: 'en',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'UTC'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would save these to your database
      // await saveSiteSettings(settings);
      
      setSuccessMessage('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  async function handleSignOut() {
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
    <div className="p-4 md:p-8 bg-gray-950 text-gray-200 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="icon"
            onClick={() => router.push('/admin/settings')}
            title="Back to Settings"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">General Settings</h1>
            <p className="text-gray-400">Configure basic site settings</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-3 border border-gray-700 rounded-full py-2 px-4 bg-gray-900">
            {adminData?.avatarUrl ? (
              <div className="h-8 w-8 overflow-hidden rounded-full">
                <Image 
                  src={adminData?.avatarUrl} 
                  alt={adminData?.name}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                {adminData?.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-medium text-white">{adminData?.name}</div>
              <div className="text-xs text-gray-400 capitalize">{adminData?.role}</div>
            </div>
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
      </div>

      {successMessage && (
        <Alert className="mb-6 bg-green-900 border-green-800 text-white">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-gray-900 border-gray-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Site Information</CardTitle>
              <CardDescription className="text-gray-400">Basic information about your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="text-gray-200">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription" className="text-gray-200">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleChange}
                  rows={3}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-gray-200">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-gray-200">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={settings.phoneNumber}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-200">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  rows={2}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Site Configuration</CardTitle>
              <CardDescription className="text-gray-400">General website settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode" className="text-gray-200">Maintenance Mode</Label>
                  <p className="text-sm text-gray-400">Enable to show maintenance page to visitors</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={() => handleSwitchChange('maintenanceMode')}
                  className="data-[state=checked]:bg-indigo-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableRegistration" className="text-gray-200">Enable Registration</Label>
                  <p className="text-sm text-gray-400">Allow users to create new accounts</p>
                </div>
                <Switch
                  id="enableRegistration"
                  checked={settings.enableRegistration}
                  onCheckedChange={() => handleSwitchChange('enableRegistration')}
                  className="data-[state=checked]:bg-indigo-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showFooterCredits" className="text-gray-200">Show Footer Credits</Label>
                  <p className="text-sm text-gray-400">Display credits in the site footer</p>
                </div>
                <Switch
                  id="showFooterCredits"
                  checked={settings.showFooterCredits}
                  onCheckedChange={() => handleSwitchChange('showFooterCredits')}
                  className="data-[state=checked]:bg-indigo-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultLanguage" className="text-gray-200">Default Language</Label>
                <Input
                  id="defaultLanguage"
                  name="defaultLanguage"
                  value={settings.defaultLanguage}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat" className="text-gray-200">Date Format</Label>
                <Input
                  id="dateFormat"
                  name="dateFormat"
                  value={settings.dateFormat}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-gray-200">Timezone</Label>
                <Input
                  id="timezone"
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-900 border-gray-800 shadow-lg mb-6">
          <CardFooter className="justify-between pt-6">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => router.push('/admin/settings')}
              className="border-gray-700 text-gray-200 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="default"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={saving}
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
      </form>
    </div>
  );
}