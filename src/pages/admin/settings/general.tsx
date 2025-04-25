// pages/admin/settings/general.tsx
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../layout";
import { Switch } from "@/components/server/ui/switch";
import { Button } from "@/components/server/ui/button";
import { Input } from "@/components/server/ui/input";
import { Textarea } from "@/components/server/ui/textarea";
import Image from "next/image";
import { useAdminAuthGuard } from "@/hooks/api/useAdminAuthGuard";
import toast from 'react-hot-toast';
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/server/ui/alert";

// Define types for our settings
interface GeneralSettingsType {
  siteTitle: string;
  siteDescription: string;
  defaultLocale: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  googleAnalyticsId: string;
  favicon: string;
  appleTouchIcon: string;
  ogImage: string;
  twitterImage: string;
}

export default function GeneralSettings() {
  useAdminAuthGuard();

  const [settings, setSettings] = useState<GeneralSettingsType>({
    siteTitle: "",
    siteDescription: "",
    defaultLocale: "es",
    maintenanceMode: false,
    allowRegistrations: true,
    googleAnalyticsId: "",
    favicon: "/icons/pathway/favicon.ico",
    appleTouchIcon: "/icons/pathway/apple-touch-icon.png",
    ogImage: "",
    twitterImage: "",
  });

  const [originalSettings, setOriginalSettings] = useState<GeneralSettingsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaUploads, setMediaUploads] = useState<{
    favicon: File | null;
    appleTouchIcon: File | null;
    ogImage: File | null;
    twitterImage: File | null;
  }>({
    favicon: null,
    appleTouchIcon: null,
    ogImage: null,
    twitterImage: null,
  });

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/settings/general");
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setSettings(data);
      setOriginalSettings(data); // Store original state for comparison
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      setError(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof mediaUploads) => {
    if (e.target.files && e.target.files[0]) {
      setMediaUploads((prev) => ({
        ...prev,
        [field]: e.target.files![0],
      }));
      
      // Set preview
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        if (event.target?.result) {
          setSettings((prev) => ({
            ...prev,
            [field]: event.target!.result as string,
          }));
        }
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  const uploadMedia = async () => {
    const uploads = Object.entries(mediaUploads).filter(([, file]) => file !== null);
    
    if (uploads.length === 0) return {};
    
    const mediaUrls: Record<string, string> = {};
    
    for (const [field, file] of uploads) {
      if (!file) continue;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('field', field);
      
      try {
        const response = await fetch('/api/admin/upload-media', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Failed to upload ${field}`);
        }
        
        const data = await response.json();
        mediaUrls[field] = data.url;
      } catch (err) {
        console.error(`Error uploading ${field}:`, err);
        throw new Error(`Error uploading ${field}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
    
    return mediaUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Upload any media files first
      const mediaUrls = await uploadMedia();
      
      // Merge updated settings with any new media URLs
      const updatedSettings = {
        ...settings,
        ...mediaUrls,
      };
      
      // Send updated settings to API
      const response = await fetch("/api/admin/settings/general", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Update saved settings with server response
      const result = await response.json();
      setSettings(result);
      setOriginalSettings(result);
      
      // Reset media uploads
      setMediaUploads({
        favicon: null,
        appleTouchIcon: null,
        ogImage: null,
        twitterImage: null,
      });
      
      toast.success("Changes saved successfully")
    } catch (err) {
      console.error("Error saving settings:", err);
      setError(err instanceof Error ? err.message : "Failed to save settings");
      
      toast.error("Error saving changes")
    } finally {
      setIsSaving(false);
    }
  };

  // Detect if there are changes to save
  const hasChanges = () => {
    if (!originalSettings) return false;
    
    // Compare current settings with original
    return Object.keys(settings).some(key => {
      const k = key as keyof GeneralSettingsType;
      return settings[k] !== originalSettings[k];
    }) || Object.values(mediaUploads).some(file => file !== null);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-2 text-gray-600">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6">General Settings</h2>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Site Identity */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4 text-lg">Site Identity</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
                    <Input
                      name="siteTitle"
                      value={settings.siteTitle}
                      onChange={handleChange}
                      placeholder="Your site name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
                    <Textarea
                      name="siteDescription"
                      value={settings.siteDescription}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Brief description of your site"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Locale</label>
                    <select
                      title="defaultLocale"
                      name="defaultLocale"
                      value={settings.defaultLocale}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ja">Japanese</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* System Settings */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4 text-lg">System</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Maintenance Mode</label>
                      <p className="text-xs text-gray-500">Disable public access to the site</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked: boolean) => handleToggle("maintenanceMode", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Allow Registrations</label>
                      <p className="text-xs text-gray-500">Enable new user signups</p>
                    </div>
                    <Switch
                      checked={settings.allowRegistrations}
                      onCheckedChange={(checked: boolean) => handleToggle("allowRegistrations", checked)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
                    <Input
                      name="googleAnalyticsId"
                      value={settings.googleAnalyticsId}
                      onChange={handleChange}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Media Assets */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-4 text-lg">Media Assets</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Favicon</label>
                  <div className="flex items-center mt-1">
                    <Image
                      src={settings.favicon}
                      alt="Favicon preview"
                      width={40}
                      height={40}
                      className="rounded-md object-contain bg-white p-1 border border-gray-200"
                    />
                    <label className="ml-3">
                      <input
                        type="file"
                        accept=".ico,.png"
                        onChange={(e) => handleFileChange(e, "favicon")}
                        className="hidden"
                      />
                      <Button type="button" variant="outline" size="sm">
                        {mediaUploads.favicon ? "Selected" : "Change"}
                      </Button>
                    </label>
                    {mediaUploads.favicon && (
                      <span className="ml-2 text-xs text-gray-500">
                        {mediaUploads.favicon.name}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apple Touch Icon</label>
                  <div className="flex items-center mt-1">
                    <Image
                      src={settings.appleTouchIcon}
                      alt="Apple icon preview"
                      width={40}
                      height={40}
                      className="rounded-md object-contain bg-white p-1 border border-gray-200"
                    />
                    <label className="ml-3">
                      <input
                        type="file"
                        accept=".png"
                        onChange={(e) => handleFileChange(e, "appleTouchIcon")}
                        className="hidden"
                      />
                      <Button type="button" variant="outline" size="sm">
                        {mediaUploads.appleTouchIcon ? "Selected" : "Change"}
                      </Button>
                    </label>
                    {mediaUploads.appleTouchIcon && (
                      <span className="ml-2 text-xs text-gray-500">
                        {mediaUploads.appleTouchIcon.name}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OG Image</label>
                  <div className="flex items-center mt-1">
                    <Image
                      src={settings.ogImage || "/placeholder-og.jpg"}
                      alt="OG preview"
                      width={40}
                      height={40}
                      className="rounded-md object-cover border border-gray-200"
                    />
                    <label className="ml-3">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, "ogImage")}
                        className="hidden"
                      />
                      <Button type="button" variant="outline" size="sm">
                        {mediaUploads.ogImage ? "Selected" : "Change"}
                      </Button>
                    </label>
                    {mediaUploads.ogImage && (
                      <span className="ml-2 text-xs text-gray-500">
                        {mediaUploads.ogImage.name}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Image</label>
                  <div className="flex items-center mt-1">
                    <Image
                      src={settings.twitterImage || "/placeholder-twitter.jpg"}
                      alt="Twitter preview"
                      width={40}
                      height={40}
                      className="rounded-md object-cover border border-gray-200"
                    />
                    <label className="ml-3">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, "twitterImage")}
                        className="hidden"
                      />
                      <Button type="button" variant="outline" size="sm">
                        {mediaUploads.twitterImage ? "Selected" : "Change"}
                      </Button>
                    </label>
                    {mediaUploads.twitterImage && (
                      <span className="ml-2 text-xs text-gray-500">
                        {mediaUploads.twitterImage.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={fetchSettings} 
                disabled={isLoading || isSaving || !hasChanges()}
              >
                Reset Changes
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || isSaving || !hasChanges()} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}