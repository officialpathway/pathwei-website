// admin/components/AssetsTable.tsx
"use client";

import { Edit, AlertTriangle } from "lucide-react";
import { Asset } from "../types/AssetsTypes";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from "../utils/assetsUtils";

interface AssetsTableProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  getAssetIcon: (type: string) => React.ReactNode;
  isExpiringSoon: (date?: string) => boolean;
}

export function AssetsTable({
  assets,
  onEdit,
  getAssetIcon,
  isExpiringSoon,
}: AssetsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Assets & Subscriptions
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Provider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Billing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiry
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No assets found. Click &quot;Add Asset&quot; to create your
                  first asset.
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getAssetIcon(asset.type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {asset.name}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {asset.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {asset.provider || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(asset.cost, asset.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="capitalize">
                      {asset.recurringPeriod || "one-time"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {asset.expiryDate ? (
                      <div
                        className={`flex items-center gap-1 ${
                          isExpiringSoon(asset.expiryDate)
                            ? "text-yellow-600"
                            : "text-gray-900"
                        }`}
                      >
                        {isExpiringSoon(asset.expiryDate) && (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                        {formatDate(asset.expiryDate)}
                      </div>
                    ) : (
                      "No expiry"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        asset.status
                      )}`}
                    >
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEdit(asset)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Edit Asset"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
