'use client';

import React from 'react';
import { Booking, STATUS_COLORS } from '@/types/booking.types';
import { formatDate } from '@/shared/lib/dateUtils';
import { Button } from '@/shared/components/Button';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const statusColor = STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-48 bg-gray-200 flex-shrink-0">
          {booking.car_snapshot.image ? (
            <img
              src={booking.car_snapshot.image}
              alt={`${booking.car_snapshot.brand} ${booking.car_snapshot.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {booking.car_snapshot.brand} {booking.car_snapshot.model}
              </h3>
              <p className="text-sm text-gray-500">Booking #{booking.booking_number}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}>
              {booking.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
            <div>
              <p className="text-gray-500">Pickup</p>
              <p className="font-medium">{formatDate(booking.pickup_date)}</p>
            </div>
            <div>
              <p className="text-gray-500">Return</p>
              <p className="font-medium">{formatDate(booking.return_date)}</p>
            </div>
            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium">{booking.pickup_location}</p>
            </div>
            <div>
              <p className="text-gray-500">Total</p>
              <p className="font-medium">₹{booking.total_amount.toLocaleString()}</p>
            </div>
          </div>

          {booking.add_ons.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Add-ons:</p>
              <div className="flex flex-wrap gap-1">
                {booking.add_ons.map((addon, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full"
                  >
                    {addon.name.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {onCancel &&
            (booking.status === 'pending_payment' || booking.status === 'confirmed') && (
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => onCancel(booking._id)}>
                  Cancel Booking
                </Button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
