"use client";

import { useState } from "react";
import AdminLayout from "../layout";
import { Switch } from "@/components/server/ui/switch";
import { Button } from "@/components/server/ui/button";
import { Input } from "@/components/server/ui/input";
import { Textarea } from "@/components/server/ui/textarea";
import Image from "next/image";
import { useAdminAuthGuard } from "@/hooks/api/useAdminAuthGuard";

export default function GeneralSettings() {
  useAdminAuthGuard();

  const [settings, setSettings] = useState({
    siteTitle: "AI Haven Labs",
    siteDescription: "Building AI tools to enhance human potential through technology",
    defaultLocale: "en",
    maintenanceMode: false,
    allowRegistrations: true,
    googleAnalyticsId: "",
    favicon: "/favicon.ico",
    appleTouchIcon: "/apple-touch-icon.png",
    ogImage: "https://aihavenlabs.com/og-aihl.jpg",
    twitterImage: "https://aihavenlabs.com/twitter-aihl.jpg",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage("Settings saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6">General Settings</h2>

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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <Button variant="outline" className="ml-3" size="sm">
                      Change
                    </Button>
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
                    <Button variant="outline" className="ml-3" size="sm">
                      Change
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OG Image</label>
                  <div className="flex items-center mt-1">
                    <Image
                      src={settings.ogImage}
                      alt="OG preview"
                      width={40}
                      height={40}
                      className="rounded-md object-cover border border-gray-200"
                    />
                    <Button variant="outline" className="ml-3" size="sm">
                      Change
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Image</label>
                  <div className="flex items-center mt-1">
                    <Image
                      src={settings.twitterImage}
                      alt="Twitter preview"
                      width={40}
                      height={40}
                      className="rounded-md object-cover border border-gray-200"
                    />
                    <Button variant="outline" className="ml-3" size="sm">
                      Change
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              {successMessage && (
                <div className="flex-1 text-green-600 text-sm flex items-center">{successMessage}</div>
              )}
              <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
