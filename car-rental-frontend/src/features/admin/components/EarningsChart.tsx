'use client';

import React from 'react';

interface EarningsChartProps {
  data?: { label: string; value: number }[];
}

export function EarningsChart({ data }: EarningsChartProps) {
  const chartData = data && data.length > 0 ? data : [
    { label: 'Jan', value: 45000 },
    { label: 'Feb', value: 52000 },
    { label: 'Mar', value: 48000 },
    { label: 'Apr', value: 61000 },
    { label: 'May', value: 55000 },
    { label: 'Jun', value: 67000 },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
      <div className="space-y-3">
        {chartData.map((item) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium">₹{item.value.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
