// admin/components/AssetForm.tsx
"use client";

import { useState } from "react";
import { Asset, AssetFormData } from "@/admin/types";

interface AssetFormProps {
  asset?: Asset;
  onClose: () => void;
  onSuccess: () => void;
}

export function AssetForm({ asset, onClose, onSuccess }: AssetFormProps) {
  const [formData, setFormData] = useState<AssetFormData>({
    name: asset?.name || "",
    type: asset?.type || "domain",
    provider: asset?.provider || "",
    cost: asset?.cost?.toString() || "",
    currency: asset?.currency || "USD",
    purchaseDate:
      asset?.purchaseDate?.split("T")[0] ||
      new Date().toISOString().split("T")[0],
    expiryDate: asset?.expiryDate?.split("T")[0] || "",
    recurringPeriod: asset?.recurringPeriod || "yearly",
    autoRenew: asset?.autoRenew || false,
    status: asset?.status || "active",
    notes: asset?.notes || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const url = asset ? `/api/admin/assets/${asset.id}` : "/api/admin/assets";
      const method = asset ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cost: parseFloat(formData.cost),
          expiryDate: formData.expiryDate || null,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save asset");
      }
    } catch (error) {
      console.error("Failed to save asset:", error);
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof AssetFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {asset ? "Edit Asset" : "Add New Asset"}
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asset Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="myapp.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              title="Select asset type"
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="domain">Domain</option>
              <option value="hosting">Hosting</option>
              <option value="software">Software</option>
              <option value="service">Service</option>
              <option value="saas">SaaS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provider
            </label>
            <input
              type="text"
              value={formData.provider}
              onChange={(e) => handleInputChange("provider", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="GoDaddy, Vercel, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.cost}
                onChange={(e) => handleInputChange("cost", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                title="Select currency"
                value={formData.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Billing Period
            </label>
            <select
              title="Select billing period"
              value={formData.recurringPeriod}
              onChange={(e) =>
                handleInputChange("recurringPeriod", e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="one-time">One-time</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Date *
            </label>
            <input
              title="Select purchase date"
              type="date"
              required
              value={formData.purchaseDate}
              onChange={(e) =>
                handleInputChange("purchaseDate", e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {formData.recurringPeriod !== "one-time" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date (Optional)
              </label>
              <input
                title="Select expiry date"
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  handleInputChange("expiryDate", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              title="Select status"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoRenew"
              checked={formData.autoRenew}
              onChange={(e) => handleInputChange("autoRenew", e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoRenew" className="text-sm text-gray-700">
              Auto-renew
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Additional notes about this asset..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submitting
                ? "Saving..."
                : asset
                ? "Update Asset"
                : "Create Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
