// admin/AdminSettings.tsx
"use client";

import { useState } from "react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    systemAlerts: true,
    autoBackup: true,
    maintenanceMode: false,
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Admin Settings</h2>

        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="font-medium text-gray-900 mb-3">
              API Configuration
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Production API Endpoint:
                </p>
                <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                  https://mypathwayapp.com/api/v1/admin/
                </code>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Authentication Method:
                </p>
                <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                  Simple Credential-based
                </code>
              </div>
            </div>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-medium text-gray-900 mb-3">
              Admin Permissions
            </h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked readOnly className="rounded" />
                <span className="text-sm">User Management</span>
                <span className="text-xs text-green-600">(Active)</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked readOnly className="rounded" />
                <span className="text-sm">Category Management</span>
                <span className="text-xs text-green-600">(Active)</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked readOnly className="rounded" />
                <span className="text-sm">System Settings</span>
                <span className="text-xs text-green-600">(Active)</span>
              </label>
            </div>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-medium text-gray-900 mb-3">
              Notification Settings
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm">
                  Email notifications for new users
                </span>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    handleSettingChange("emailNotifications", e.target.checked)
                  }
                  className="rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">Alert on system errors</span>
                <input
                  type="checkbox"
                  checked={settings.systemAlerts}
                  onChange={(e) =>
                    handleSettingChange("systemAlerts", e.target.checked)
                  }
                  className="rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">Automatic database backups</span>
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={(e) =>
                    handleSettingChange("autoBackup", e.target.checked)
                  }
                  className="rounded"
                />
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">System Control</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">Maintenance Mode</span>
                  <p className="text-xs text-gray-500">
                    Temporarily disable user access
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    handleSettingChange("maintenanceMode", e.target.checked)
                  }
                  className="rounded"
                />
              </label>

              <div className="pt-4 border-t">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-medium text-gray-900 mb-3">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Version:</span>
            <span className="ml-2 font-mono">v1.0.0</span>
          </div>
          <div>
            <span className="text-gray-600">Environment:</span>
            <span className="ml-2 font-mono">Production</span>
          </div>
          <div>
            <span className="text-gray-600">Last Deployment:</span>
            <span className="ml-2">{new Date().toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Uptime:</span>
            <span className="ml-2">99.9%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
