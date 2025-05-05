'use client';

import { Widget, WidgetProps } from '@/components/widgets/Widgets';
import React, { ReactNode } from 'react';

export interface TableColumn<T> {
  key: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, item: T) => ReactNode;
}

export interface TableWidgetProps<T> extends Omit<WidgetProps, 'children'> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
}

export function TableWidget<T>({
  title,
  description,
  size = '3x2',
  columns,
  data,
  emptyMessage = 'No data available',
  ...props
}: TableWidgetProps<T>) {
  return (
    <Widget
      title={title}
      description={description}
      size={size}
      {...props}
    >
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b border-gray-800">
                {columns.map((column, index) => (
                  <th 
                    key={index}
                    className="px-4 py-3 text-left font-medium"
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className="border-b border-gray-800 hover:bg-gray-800/30"
                >
                  {columns.map((column, colIndex) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const value = (item as any)[column.key];
                    return (
                      <td 
                        key={colIndex}
                        className="px-4 py-3"
                      >
                        {column.render ? column.render(value, item) : value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Widget>
  );
}