'use client';

import React, { useState } from 'react';
import { Booking, BookingStatus, STATUS_COLORS } from '@/types/booking.types';
import { formatDate } from '@/shared/lib/dateUtils';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';

interface BookingTableProps {
  bookings: Booking[];
  onStatusChange?: (bookingId: string, status: BookingStatus) => void;
  showActions?: boolean;
}

export function BookingTable({ bookings, onStatusChange, showActions = false }: BookingTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm">
        No bookings found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Car
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => {
              const statusColor = STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-800';
              return (
                <tr
                  key={booking._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.booking_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {booking.car_snapshot.brand} {booking.car_snapshot.model}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(booking.pickup_date)} - {formatDate(booking.return_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{booking.total_amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </td>
                  {showActions && onStatusChange && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className="text-sm border border-gray-300 rounded-md px-2 py-1"
                        value={booking.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          onStatusChange(booking._id, e.target.value as BookingStatus);
                        }}
                      >
                        <option value="pending_payment">Pending Payment</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refund_initiated">Refund Initiated</option>
                      </select>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title={`Booking #${selectedBooking?.booking_number}`}
        footer={
          <Button variant="outline" onClick={() => setSelectedBooking(null)}>
            Close
          </Button>
        }
      >
        {selectedBooking && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Car</p>
                <p className="font-medium">
                  {selectedBooking.car_snapshot.brand} {selectedBooking.car_snapshot.model}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    STATUS_COLORS[selectedBooking.status]
                  }`}
                >
                  {selectedBooking.status.replace('_', ' ')}
                </span>
              </div>
              <div>
                <p className="text-gray-500">Pickup</p>
                <p className="font-medium">{formatDate(selectedBooking.pickup_date)}</p>
              </div>
              <div>
                <p className="text-gray-500">Return</p>
                <p className="font-medium">{formatDate(selectedBooking.return_date)}</p>
              </div>
              <div>
                <p className="text-gray-500">Base Price</p>
                <p className="font-medium">₹{selectedBooking.base_price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Add-ons</p>
                <p className="font-medium">₹{selectedBooking.add_ons_total.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Tax</p>
                <p className="font-medium">₹{selectedBooking.tax.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Amount</p>
                <p className="font-bold text-blue-600">
                  ₹{selectedBooking.total_amount.toLocaleString()}
                </p>
              </div>
            </div>
            {selectedBooking.add_ons.length > 0 && (
              <div>
                <p className="text-gray-500 mb-1">Add-ons</p>
                <div className="flex flex-wrap gap-1">
                  {selectedBooking.add_ons.map((addon, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs"
                    >
                      {addon.name.replace('_', ' ')} (₹{addon.price_per_day}/day)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
