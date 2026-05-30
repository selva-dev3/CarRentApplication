'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useMyBookings } from '@/shared/hooks/useBookingQueries';
import { Spinner } from '@/shared/components/Spinner';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { data: bookings, isLoading, error } = useMyBookings();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Calculate statistics
  const totalBookings = bookings?.length ?? 0;
  const activeBookings = bookings?.filter((b) => b.status === 'confirmed').length ?? 0;
  const pendingPayments = bookings?.filter((b) => b.status === 'pending_payment').length ?? 0;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] py-12 px-6 md:px-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <span className="text-xs tracking-[3px] uppercase text-accent font-semibold mb-2 block">
            Welcome Back
          </span>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] tracking-[2px] leading-none uppercase">
            {user?.name || 'Customer'}
          </h1>
          <p className="text-sm text-dim mt-2 font-body max-w-md">
            Manage your elite bookings, explore exclusive vehicles, and view your reservation details.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Link
            href="/profile"
            className="bg-glass border border-glass-border px-5 py-2.5 font-body text-xs font-semibold tracking-[1.5px] uppercase rounded-md hover:text-accent hover:border-accent transition-all"
          >
            Profile Settings
          </Link>
          <button
            onClick={handleLogout}
            className="bg-accent text-white border-none px-5 py-2.5 font-body text-xs font-semibold tracking-[1.5px] uppercase rounded-md cursor-pointer transition-all hover:shadow-[0_0_20px_var(--accent-glow)]"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[
          { title: 'Total Bookings', value: totalBookings, desc: 'All time reservations' },
          { title: 'Active Rentals', value: activeBookings, desc: 'Current confirmed drives' },
          { title: 'Pending Payments', value: pendingPayments, desc: 'Awaiting payment confirmation' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-glass border border-glass-border p-6 rounded-2xl backdrop-blur-[20px]"
          >
            <div className="text-xs text-dim tracking-[2px] uppercase mb-1 font-body">
              {stat.title}
            </div>
            <div className="font-display text-4xl tracking-[1px] text-accent mb-2">
              {stat.value}
            </div>
            <div className="text-[0.7rem] text-dim font-body">{stat.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Actions and Quick reservation */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-glass border border-glass-border p-8 rounded-2xl backdrop-blur-[20px]">
            <h2 className="font-display text-2xl tracking-[1.5px] mb-6">
              QUICK ACTIONS
            </h2>
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="w-full bg-accent text-white py-3 px-4 font-body text-xs font-bold tracking-[1.5px] uppercase rounded-lg text-center cursor-pointer transition-all hover:shadow-[0_8px_25px_var(--accent-glow)] hover:-translate-y-0.5"
              >
                Book a New Ride
              </Link>
              <Link
                href="/cars"
                className="w-full bg-[rgba(255,255,255,0.03)] border border-glass-border py-3 px-4 font-body text-xs font-bold tracking-[1.5px] uppercase rounded-lg text-center hover:bg-glass hover:border-accent transition-all"
              >
                Browse All Cars
              </Link>
              <Link
                href="/my-bookings"
                className="w-full bg-[rgba(255,255,255,0.03)] border border-glass-border py-3 px-4 font-body text-xs font-bold tracking-[1.5px] uppercase rounded-lg text-center hover:bg-glass hover:border-accent transition-all"
              >
                Detailed Bookings List
              </Link>
            </div>
          </div>

          <div className="bg-glass border border-glass-border p-8 rounded-2xl backdrop-blur-[20px]">
            <h2 className="font-display text-2xl tracking-[1.5px] mb-4">
              ELITE MEMBERSHIP
            </h2>
            <p className="text-xs text-dim leading-relaxed font-body">
              As an APEX luxury rental client, you have 24/7 dedicated concierge access, complimentary airport drop-off, and track event invitations.
            </p>
          </div>
        </div>

        {/* Right Column: Recent Bookings */}
        <div className="lg:col-span-2">
          <div className="bg-glass border border-glass-border p-8 rounded-2xl backdrop-blur-[20px] h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl tracking-[1.5px]">
                RECENT RESERVATIONS
              </h2>
              <Link href="/my-bookings" className="text-xs text-accent hover:underline uppercase tracking-[1px]">
                View All
              </Link>
            </div>

            {error ? (
              <div className="text-red-500 text-sm py-4">Failed to load bookings details.</div>
            ) : !bookings || bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-dim text-sm mb-4 font-body">
                  You do not have any active or previous bookings.
                </p>
                <Link
                  href="/"
                  className="bg-accent text-white border-none px-6 py-2.5 font-body text-xs font-semibold tracking-[1.5px] uppercase rounded-md transition-all hover:scale-105"
                >
                  Book Your First Ride
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking._id}
                    className="p-5 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-glass-border transition-colors"
                  >
                    <div>
                      <div className="font-display text-lg tracking-[1px]">
                        {booking.car_snapshot?.brand} {booking.car_snapshot?.model}
                      </div>
                      <div className="text-xs text-dim mt-1 font-body">
                        {new Date(booking.pickup_date).toLocaleDateString()} - {new Date(booking.return_date).toLocaleDateString()} &middot; {booking.pickup_location}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="font-display text-lg text-accent">
                          ₹{booking.total_amount.toLocaleString()}
                        </div>
                        <div className="text-[0.65rem] text-dim uppercase tracking-[1px] font-body mt-0.5">
                          Total Price
                        </div>
                      </div>
                      <span className={`text-[0.65rem] font-bold tracking-[1.5px] uppercase px-3 py-1 rounded ${
                        booking.status === 'confirmed'
                          ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                          : booking.status === 'pending_payment'
                          ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-red-600/20 text-red-400 border border-red-500/30'
                      }`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
