// admin/components/BillForm.tsx
"use client";

import { useState } from "react";
import { Asset, Bill, BillFormData } from "@/admin/types";

interface BillFormProps {
  bill?: Bill;
  assets: Asset[];
  onClose: () => void;
  onSuccess: () => void;
}

export function BillForm({ bill, assets, onClose, onSuccess }: BillFormProps) {
  const [formData, setFormData] = useState<BillFormData>({
    assetId: bill?.assetId || "",
    description: bill?.description || "",
    amount: bill?.amount?.toString() || "",
    currency: bill?.currency || "USD",
    category: bill?.category || "other",
    vendor: bill?.vendor || "",
    dueDate:
      bill?.dueDate?.split("T")[0] || new Date().toISOString().split("T")[0],
    paidDate: bill?.paidDate?.split("T")[0] || "",
    status: bill?.status || "pending",
    recurring: bill?.recurring || false,
    recurringPeriod: bill?.recurringPeriod || "monthly",
    paymentMethod: bill?.paymentMethod || "",
    reference: bill?.reference || "",
    notes: bill?.notes || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const url = bill ? `/api/admin/bills/${bill.id}` : "/api/admin/bills";
      const method = bill ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          assetId: formData.assetId || null,
          paidDate: formData.paidDate || null,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save bill");
      }
    } catch (error) {
      console.error("Failed to save bill:", error);
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof BillFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {bill ? "Edit Bill/Expense" : "Add New Bill/Expense"}
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Google Play Console Fee, Domain Registration, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related Asset (Optional)
            </label>
            <select
              title="Select an asset"
              value={formData.assetId}
              onChange={(e) => handleInputChange("assetId", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Not related to any asset</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name} ({asset.type})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
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
              Category
            </label>
            <select
              title="Select category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="hosting">Hosting</option>
              <option value="domain">Domain</option>
              <option value="software">Software</option>
              <option value="legal">Legal</option>
              <option value="marketing">Marketing</option>
              <option value="development">Development</option>
              <option value="design">Design</option>
              <option value="consulting">Consulting</option>
              <option value="lifetime">Lifetime</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor *
            </label>
            <input
              type="text"
              required
              value={formData.vendor}
              onChange={(e) => handleInputChange("vendor", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Google, Apple, GoDaddy, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date {formData.category !== "lifetime" && "*"}
            </label>
            <input
              title="Select due date"
              type="date"
              required={formData.category !== "lifetime"}
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={formData.category === "lifetime"}
            />
            {formData.category === "lifetime" && (
              <p className="text-xs text-gray-500 mt-1">
                Lifetime purchases don&apos;t have due dates
              </p>
            )}
          </div>

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
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {formData.status === "paid" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paid Date
              </label>
              <input
                title="Select paid date"
                type="date"
                value={formData.paidDate}
                onChange={(e) => handleInputChange("paidDate", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.recurring}
              onChange={(e) => handleInputChange("recurring", e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="recurring" className="text-sm text-gray-700">
              Recurring expense
            </label>
          </div>

          {formData.recurring && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recurring Period
              </label>
              <select
                title="Select recurring period"
                value={formData.recurringPeriod}
                onChange={(e) =>
                  handleInputChange("recurringPeriod", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method (Optional)
            </label>
            <select
              title="Select payment method"
              value={formData.paymentMethod}
              onChange={(e) =>
                handleInputChange("paymentMethod", e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select payment method</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="crypto">Cryptocurrency</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference/Invoice # (Optional)
            </label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => handleInputChange("reference", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Invoice number, transaction ID, etc."
            />
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
              placeholder="Additional details about this expense..."
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
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Saving..." : bill ? "Update Bill" : "Create Bill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
