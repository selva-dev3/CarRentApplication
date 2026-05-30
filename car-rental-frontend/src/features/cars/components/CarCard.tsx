'use client';

import React from 'react';
import Link from 'next/link';
import { Car } from '@/types/car.types';
import { formatDate, getDaysBetween } from '@/shared/lib/dateUtils';
import { useSearchStore } from '@/features/cars/store/searchStore';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const { pickupDate, returnDate } = useSearchStore();
  const days = pickupDate && returnDate ? getDaysBetween(pickupDate, returnDate) : 1;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-200">
        {car.images && car.images.length > 0 ? (
          <img
            src={car.images[0]}
            alt={`${car.brand} ${car.model}`}
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
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
          {car.car_type}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-gray-500">
              {car.year} &middot; {car.transmission} &middot; {car.fuel_type} &middot; {car.seats} seats
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">₹{car.price_per_day}</div>
            <div className="text-xs text-gray-500">per day</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {car.location.city}
          </div>
          {car.average_rating > 0 && (
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-gray-700">
                {car.average_rating.toFixed(1)} ({car.total_reviews})
              </span>
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <Link
            href={`/cars/${car._id}`}
            className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
        {pickupDate && returnDate && (
          <p className="mt-2 text-xs text-gray-500 text-center">
            {formatDate(pickupDate)} - {formatDate(returnDate)} &middot; {days} days
          </p>
        )}
      </div>
    </div>
  );
}
