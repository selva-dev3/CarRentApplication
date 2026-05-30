'use client';

import React from 'react';
import { CarCard } from '@/features/cars/components/CarCard';
import { CarFilters } from '@/features/cars/components/CarFilters';
import { Spinner } from '@/shared/components/Spinner';
import { useCars } from '@/shared/hooks/useBookingQueries';
import { useSearchStore } from '@/features/cars/store/searchStore';
import { formatDate } from '@/shared/lib/dateUtils';

export default function CarsPage() {
  const { data: cars, isLoading, error } = useCars();
  const { location, pickupDate, returnDate } = useSearchStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Summary Bar */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Available Cars
            </h1>
            {location && (
              <p className="text-sm text-gray-500">
                {location}
                {pickupDate && returnDate && (
                  <span>
                    {' '} &middot; {formatDate(pickupDate)} - {formatDate(returnDate)}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <CarFilters />
          </div>

          {/* Cars Grid */}
          <div className="flex-1">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                <p>Failed to load cars. Please try again later.</p>
              </div>
            )}

            {!isLoading && !error && (!cars || cars.length === 0) && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500 mb-2">No cars found matching your criteria.</p>
                <p className="text-sm text-gray-400">
                  Try adjusting your filters or search dates.
                </p>
              </div>
            )}

            {!isLoading && !error && cars && cars.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
