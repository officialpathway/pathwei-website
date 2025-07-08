// src/admin/components/email/EmailForm.tsx
"use client";

import { useState } from "react";
import { X, Send, Users, Crown, UserCheck, Mail } from "lucide-react";

interface EmailFormData {
  subject: string;
  htmlContent: string;
  textContent: string;
  recipients: "all" | "premium" | "active" | "custom";
  customEmails: string;
  tags: string;
}

interface RecipientCounts {
  all: number;
  premium: number;
  active: number;
  inactive: number;
}

interface EmailFormProps {
  onClose: () => void;
  onSuccess: () => void;
  recipientCounts: RecipientCounts;
  type?: "newsletter" | "bulk";
}

export function EmailForm({
  onClose,
  onSuccess,
  recipientCounts,
  type = "bulk",
}: EmailFormProps) {
  const [formData, setFormData] = useState<EmailFormData>({
    subject: "",
    htmlContent: "",
    textContent: "",
    recipients: "active",
    customEmails: "",
    tags: "",
  });

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<"html" | "text">("html");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.subject.trim() ||
      (!formData.htmlContent.trim() && !formData.textContent.trim())
    ) {
      setError("Please fill in subject and at least one content field");
      return;
    }

    if (formData.recipients === "custom" && !formData.customEmails.trim()) {
      setError("Please enter custom email addresses");
      return;
    }

    const confirmMessage = `Are you sure you want to send this email to ${getRecipientCount()} recipients?`;
    if (!confirm(confirmMessage)) return;

    setSending(true);
    setError("");

    try {
      const endpoint =
        type === "newsletter"
          ? "/api/admin/newsletter/send"
          : `${
              process.env.NEXT_PUBLIC_APP_URL || "https://mypathwayapp.com"
            }/api/v1/email/bulk-email/send`;

      const emailData = {
        subject: formData.subject,
        htmlContent: formData.htmlContent || undefined,
        textContent: formData.textContent || undefined,
        recipients: formData.recipients,
        customEmails:
          formData.recipients === "custom"
            ? formData.customEmails
                .split(",")
                .map((email) => email.trim())
                .filter(Boolean)
            : undefined,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : undefined,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(type === "bulk" && {
            "X-Admin-Dashboard-Secret": "PathwegAdmin2025!",
          }),
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (field: keyof EmailFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(""); // Clear error when user starts typing
  };

  const getRecipientCount = () => {
    switch (formData.recipients) {
      case "all":
        return recipientCounts.all;
      case "premium":
        return recipientCounts.premium;
      case "active":
        return recipientCounts.active;
      case "custom":
        return formData.customEmails.split(",").filter((email) => email.trim())
          .length;
      default:
        return 0;
    }
  };

  const recipientOptions = [
    {
      id: "all",
      label: "All Users",
      count: recipientCounts.all,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      description: "Send to all registered users",
    },
    {
      id: "premium",
      label: "Premium Users",
      count: recipientCounts.premium,
      icon: <Crown className="w-6 h-6 text-yellow-600" />,
      description: "Send to premium subscribers only",
    },
    {
      id: "active",
      label: "Active Users",
      count: recipientCounts.active,
      icon: <UserCheck className="w-6 h-6 text-green-600" />,
      description: "Send to recently active users",
    },
    {
      id: "custom",
      label: "Custom List",
      count: formData.recipients === "custom" ? getRecipientCount() : 0,
      icon: <Mail className="w-6 h-6 text-purple-600" />,
      description: "Enter specific email addresses",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">
            {type === "newsletter" ? "Send Newsletter" : "Send Bulk Email"}
          </h3>
          <button
            title="Close form"
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipient Selection */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                Select Recipients
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recipientOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.recipients === option.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      handleInputChange("recipients", option.id as never)
                    }
                  >
                    <div className="flex items-center space-x-3">
                      {option.icon}
                      <div>
                        <p className="font-medium text-gray-900">
                          {option.label}
                        </p>
                        <p className="text-sm text-gray-600">
                          {option.count} users
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {option.description}
                    </p>
                  </div>
                ))}
              </div>

              {formData.recipients === "custom" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Email Addresses (comma-separated)
                  </label>
                  <textarea
                    value={formData.customEmails}
                    onChange={(e) =>
                      handleInputChange("customEmails", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="user1@example.com, user2@example.com, ..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {getRecipientCount()} email addresses detected
                  </p>
                </div>
              )}
            </div>

            {/* Email Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email subject..."
              />
            </div>

            {/* Email Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Content
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("html")}
                    className={`px-3 py-1 text-xs rounded ${
                      previewMode === "html"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    HTML
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("text")}
                    className={`px-3 py-1 text-xs rounded ${
                      previewMode === "text"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    Plain Text
                  </button>
                </div>
              </div>

              {previewMode === "html" ? (
                <div>
                  <textarea
                    value={formData.htmlContent}
                    onChange={(e) =>
                      handleInputChange("htmlContent", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    rows={12}
                    placeholder="Enter HTML email content..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    HTML content for rich email formatting
                  </p>
                </div>
              ) : (
                <div>
                  <textarea
                    value={formData.textContent}
                    onChange={(e) =>
                      handleInputChange("textContent", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={12}
                    placeholder="Enter plain text email content..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Plain text fallback for email clients that don&apos;t
                    support HTML
                  </p>
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (optional)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="newsletter, announcement, marketing (comma-separated)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tags help organize and track your email campaigns
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Will be sent to <strong>{getRecipientCount()}</strong> recipients
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={sending}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={sending || getRecipientCount() === 0}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? "Sending..." : "Send Email"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
