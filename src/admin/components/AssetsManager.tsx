// admin/AssetsManager.tsx
"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  AlertTriangle,
  Plus,
  Monitor,
  Receipt,
} from "lucide-react";
import { Asset, Bill } from "../types/AssetsTypes";
import { AssetsTable } from "./AssetsTable";
import { BillsTable } from "./BillsTable";
import { AssetForm } from "./AssetForm";
import { BillForm } from "./BillForm";
import { getAssetIcon, isExpiringSoon } from "../utils/assetsUtils";

export default function AssetsManager() {
  const [activeTab, setActiveTab] = useState<"assets" | "bills">("assets");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddAssetForm, setShowAddAssetForm] = useState(false);
  const [showAddBillForm, setShowAddBillForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assetsResponse, billsResponse] = await Promise.all([
        fetch("/api/admin/assets"),
        fetch("/api/admin/bills"),
      ]);

      if (assetsResponse.ok) {
        const assetsData = await assetsResponse.json();
        setAssets(assetsData.assets || []);
      }

      if (billsResponse.ok) {
        const billsData = await billsResponse.json();
        setBills(billsData.bills || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyExpenses = () => {
    let total = 0;

    // Add recurring assets
    assets.forEach((asset) => {
      if (asset.status === "active") {
        switch (asset.recurringPeriod) {
          case "monthly":
            total += asset.cost;
            break;
          case "yearly":
            total += asset.cost / 12;
            break;
          case "quarterly":
            total += asset.cost / 3;
            break;
        }
      }
    });

    // Add recurring bills
    bills.forEach((bill) => {
      if (bill.recurring && bill.status === "paid") {
        switch (bill.recurringPeriod) {
          case "monthly":
            total += bill.amount;
            break;
          case "yearly":
            total += bill.amount / 12;
            break;
          case "quarterly":
            total += bill.amount / 3;
            break;
        }
      }
    });

    return total;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab("assets")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "assets"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Assets & Subscriptions
            </button>
            <button
              onClick={() => setActiveTab("bills")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "bills"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Bills & Expenses
            </button>
          </div>

          <div className="flex gap-2">
            {activeTab === "assets" ? (
              <button
                onClick={() => setShowAddAssetForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Asset
              </button>
            ) : (
              <button
                onClick={() => setShowAddBillForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                Add Expense
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Active Assets</p>
                <p className="text-2xl font-bold text-blue-900">
                  {assets.filter((a) => a.status === "active").length}
                </p>
              </div>
              <Monitor className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {assets.filter((a) => isExpiringSoon(a.expiryDate)).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Monthly Cost</p>
                <p className="text-2xl font-bold text-green-900">
                  ${calculateMonthlyExpenses().toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Pending Bills</p>
                <p className="text-2xl font-bold text-purple-900">
                  {bills.filter((b) => b.status === "pending").length}
                </p>
              </div>
              <Receipt className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "assets" ? (
        <AssetsTable
          assets={assets}
          onEdit={setEditingAsset}
          getAssetIcon={getAssetIcon}
          isExpiringSoon={isExpiringSoon}
        />
      ) : (
        <BillsTable bills={bills} onEdit={setEditingBill} />
      )}

      {/* Modals */}
      {showAddAssetForm && (
        <AssetForm
          onClose={() => setShowAddAssetForm(false)}
          onSuccess={() => {
            fetchData();
            setShowAddAssetForm(false);
          }}
        />
      )}

      {showAddBillForm && (
        <BillForm
          assets={assets}
          onClose={() => setShowAddBillForm(false)}
          onSuccess={() => {
            fetchData();
            setShowAddBillForm(false);
          }}
        />
      )}

      {editingAsset && (
        <AssetForm
          asset={editingAsset}
          onClose={() => setEditingAsset(null)}
          onSuccess={() => {
            fetchData();
            setEditingAsset(null);
          }}
        />
      )}

      {editingBill && (
        <BillForm
          bill={editingBill}
          assets={assets}
          onClose={() => setEditingBill(null)}
          onSuccess={() => {
            fetchData();
            setEditingBill(null);
          }}
        />
      )}
    </div>
  );
}
