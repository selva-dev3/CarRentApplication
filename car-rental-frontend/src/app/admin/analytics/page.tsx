'use client';

import React from 'react';
import { EarningsChart } from '@/features/admin/components/EarningsChart';
import { StatsCard } from '@/features/admin/components/StatsCard';
import { useAdminStats } from '@/shared/hooks/useBookingQueries';
import { Spinner } from '@/shared/components/Spinner';

export default function AdminAnalyticsPage() {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Failed to load analytics data.</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Revenue" value={`₹${(stats?.total_revenue ?? 0).toLocaleString()}`} />
        <StatsCard title="Total Bookings" value={stats?.total_bookings ?? 0} />
        <StatsCard title="Active Rentals" value={stats?.active_bookings ?? 0} />
        <StatsCard title="Fleet Size" value={stats?.total_cars ?? 0} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <EarningsChart />
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average booking value</span>
              <span className="font-medium">
                ₹
                {stats && stats.total_bookings > 0
                  ? Math.round(stats.total_revenue / stats.total_bookings).toLocaleString()
                  : 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Utilization rate</span>
              <span className="font-medium">{stats?.active_bookings ?? 0} active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fleet utilization</span>
              <span className="font-medium">
                {stats && stats.total_cars > 0
                  ? `${Math.round((stats.active_bookings / stats.total_cars) * 100)}%`
                  : '0%'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
