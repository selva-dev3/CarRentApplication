'use client';

import React, { useState } from 'react';
import { BookingCard } from '@/features/booking/components/BookingCard';
import { Spinner } from '@/shared/components/Spinner';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { useMyBookings, useCancelBooking } from '@/shared/hooks/useBookingQueries';

export default function MyBookingsPage() {
  const { data: bookings, isLoading, error } = useMyBookings();
  const cancelBooking = useCancelBooking();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const handleCancelClick = (bookingId: string) => {
    setCancelBookingId(bookingId);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelBookingId) return;
    try {
      await cancelBooking.mutateAsync({
        bookingId: cancelBookingId,
        reason: cancelReason || 'Customer requested cancellation',
      });
      setCancelModalOpen(false);
      setCancelBookingId(null);
      setCancelReason('');
    } catch {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600">Failed to load bookings. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

        {!bookings || bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 mb-2">You haven&apos;t made any bookings yet.</p>
            <p className="text-sm text-gray-400">Start by searching for cars on the home page.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={
                  booking.status === 'pending_payment' || booking.status === 'confirmed'
                    ? handleCancelClick
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Booking"
        footer={
          <>
            <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
              Keep Booking
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmCancel}
              isLoading={cancelBooking.isPending}
            >
              Cancel Booking
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to cancel this booking? Cancellation policies may apply.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason (optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter reason for cancellation"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>
          {cancelBooking.isError && (
            <p className="text-sm text-red-600">
              {cancelBooking.error?.message || 'Failed to cancel booking'}
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
