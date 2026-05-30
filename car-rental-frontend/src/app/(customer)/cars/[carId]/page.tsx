'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CarGallery } from '@/features/cars/components/CarGallery';
import { Button } from '@/shared/components/Button';
import { Spinner } from '@/shared/components/Spinner';
import { useCarDetail } from '@/shared/hooks/useBookingQueries';
import { useBookingDraftStore } from '@/features/booking/store/bookingDraftStore';
import { useSearchStore } from '@/features/cars/store/searchStore';
import { formatDate, getDaysBetween } from '@/shared/lib/dateUtils';

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const carId = params.carId as string;
  const { data: car, isLoading, error } = useCarDetail(carId);
  const { selectCar } = useBookingDraftStore();
  const { pickupDate, returnDate } = useSearchStore();
  const [showDatesError, setShowDatesError] = useState(false);

  const handleBookNow = () => {
    if (!car) return;
    if (!pickupDate || !returnDate) {
      setShowDatesError(true);
      return;
    }
    selectCar(car);
    router.push('/booking');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Car not found or failed to load.</p>
          <Button onClick={() => router.push('/cars')}>Browse Cars</Button>
        </div>
      </div>
    );
  }

  const days = pickupDate && returnDate ? getDaysBetween(pickupDate, returnDate) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Car Images */}
          <div>
            <CarGallery images={car.images} alt={`${car.brand} ${car.model}`} />
          </div>

          {/* Car Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500">
                {car.year} &middot; {car.transmission} &middot; {car.fuel_type}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-blue-600">
                ₹{car.price_per_day}
                <span className="text-base font-normal text-gray-500">/day</span>
              </div>
            </div>

            {/* Car Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Seats</p>
                <p className="font-medium">{car.seats} seats</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Car Type</p>
                <p className="font-medium capitalize">{car.car_type}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-medium">{car.location.city}, {car.location.state}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Deposit</p>
                <p className="font-medium">₹{car.security_deposit.toLocaleString()}</p>
              </div>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Summary */}
            {pickupDate && returnDate && days > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Your Trip</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    {formatDate(pickupDate)} - {formatDate(returnDate)}
                  </p>
                  <p>{days} day{days > 1 ? 's' : ''}</p>
                  <p className="font-semibold">
                    Estimated: ₹{(car.price_per_day * days).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {showDatesError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                Please set pickup and return dates on the home page before booking.
              </div>
            )}

            <Button onClick={handleBookNow} className="w-full" size="lg">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
