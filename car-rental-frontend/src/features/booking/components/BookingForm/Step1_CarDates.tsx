'use client';

import React from 'react';
import { useBookingDraftStore } from '@/features/booking/store/bookingDraftStore';
import { useSearchStore } from '@/features/cars/store/searchStore';
import { formatDate, getDaysBetween } from '@/shared/lib/dateUtils';
import { Button } from '@/shared/components/Button';

export default function Step1_CarDates() {
  const { selectedCar } = useBookingDraftStore();
  const { nextStep } = useBookingDraftStore();
  const { location, pickupDate, returnDate } = useSearchStore();

  if (!selectedCar) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No car selected. Please go back and select a car.</p>
      </div>
    );
  }

  const days = pickupDate && returnDate ? getDaysBetween(pickupDate, returnDate) : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Review Your Selection</h2>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
            {selectedCar.images && selectedCar.images.length > 0 ? (
              <img
                src={selectedCar.images[0]}
                alt={`${selectedCar.brand} ${selectedCar.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {selectedCar.brand} {selectedCar.model}
            </h3>
            <p className="text-sm text-gray-500">
              {selectedCar.year} &middot; {selectedCar.transmission} &middot; {selectedCar.fuel_type}
            </p>
            <p className="text-sm text-gray-500">{selectedCar.seats} seats</p>
            <p className="text-blue-600 font-medium mt-1">
              ₹{selectedCar.price_per_day} / day
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">Trip Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Pickup Location</p>
            <p className="font-medium text-gray-900">{location || 'Not specified'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Duration</p>
            <p className="font-medium text-gray-900">
              {days > 0 ? `${days} day${days > 1 ? 's' : ''}` : 'Not set'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Pickup Date</p>
            <p className="font-medium text-gray-900">
              {pickupDate ? formatDate(pickupDate) : 'Not set'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Return Date</p>
            <p className="font-medium text-gray-900">
              {returnDate ? formatDate(returnDate) : 'Not set'}
            </p>
          </div>
        </div>
      </div>

      {pickupDate && returnDate && days > 0 && location && (
        <div className="flex justify-end">
          <Button onClick={nextStep}>Continue to Add-ons</Button>
        </div>
      )}

      {(!pickupDate || !returnDate || days <= 0 || !location) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          Please set your location, pickup date, and return date to continue.
        </div>
      )}
    </div>
  );
}
