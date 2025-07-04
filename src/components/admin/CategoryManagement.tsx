// src/components/admin/CategoryManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

interface PathCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  parent_category_id?: number;
  is_active: boolean;
  display_order: number;
  is_testable: boolean;
  created_at: string;
  updated_at: string;
}

// API Service for Categories
class CategoryAPIService {
  private static get baseURL() {
    return `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/v1/admin`;
  }

  private static async request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Dashboard-Secret": process.env.NEXT_PUBLIC_ADMIN_SECRET || "",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  static async getPathCategories(): Promise<PathCategory[]> {
    const response = await this.request("/categories");
    return response.data.categories;
  }

  static async createPathCategory(categoryData: {
    name: string;
    description: string;
    icon: string;
    color: string;
    parent_category_id?: number;
    is_active?: boolean;
    display_order?: number;
    is_testable?: boolean;
  }): Promise<PathCategory> {
    const response = await this.request("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
    return response.data.category;
  }

  static async updatePathCategory(
    categoryId: number,
    updates: Partial<PathCategory>
  ): Promise<PathCategory> {
    const response = await this.request(`/categories/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    return response.data.category;
  }

  static async deletePathCategory(categoryId: number): Promise<void> {
    await this.request(`/categories/${categoryId}`, {
      method: "DELETE",
    });
  }
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<PathCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PathCategory | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    color: "#3B82F6",
    parent_category_id: "",
    is_active: true,
    display_order: 1,
    is_testable: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await CategoryAPIService.getPathCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        parent_category_id: formData.parent_category_id
          ? parseInt(formData.parent_category_id)
          : undefined,
      };

      if (editingCategory) {
        await CategoryAPIService.updatePathCategory(editingCategory.id, data);
      } else {
        await CategoryAPIService.createPathCategory(data);
      }

      fetchCategories();
      resetForm();
    } catch (error) {
      console.error("Failed to save category:", error);
      alert("Failed to save category");
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await CategoryAPIService.deletePathCategory(categoryId);
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "",
      color: "#3B82F6",
      parent_category_id: "",
      is_active: true,
      display_order: 1,
      is_testable: true,
    });
    setShowAddForm(false);
    setEditingCategory(null);
  };

  const startEdit = (category: PathCategory) => {
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      parent_category_id: category.parent_category_id?.toString() || "",
      is_active: category.is_active,
      display_order: category.display_order,
      is_testable: category.is_testable,
    });
    setEditingCategory(category);
    setShowAddForm(true);
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-300 h-64 rounded"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Path Categories
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Icon (e.g., tech-icon)"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  title="Category Color"
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Display Order"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value),
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 md:col-span-2"
                  rows={3}
                  required
                />
                <div className="flex items-center space-x-4 md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_testable}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_testable: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Testable</span>
                  </label>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingCategory ? "Update" : "Create"} Category
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4 font-medium text-gray-900">
                  Name
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-900">
                  Description
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-900">
                  Color
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-900">
                  Order
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-900">
                  Status
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">{category.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {category.description}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm">{category.color}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{category.display_order}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        category.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {category.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        title="Edit Category"
                        type="button"
                        onClick={() => startEdit(category)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        title="Delete Category"
                        type="button"
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
