'use client';

import React from 'react';
import { useSearchStore } from '@/features/cars/store/searchStore';

export function CarFilters() {
  const { filters, setFilter, resetFilters } = useSearchStore();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Reset
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Car Type
        </label>
        <select
          value={filters.carType || ''}
          onChange={(e) => setFilter('carType', e.target.value || undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          <option value="hatchback">Hatchback</option>
          <option value="luxury">Luxury</option>
          <option value="van">Van</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Transmission
        </label>
        <select
          value={filters.transmission || ''}
          onChange={(e) => setFilter('transmission', e.target.value || undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="manual">Manual</option>
          <option value="automatic">Automatic</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Max Price: ₹{filters.maxPrice}
        </label>
        <input
          type="range"
          min={500}
          max={50000}
          step={500}
          value={filters.maxPrice}
          onChange={(e) => setFilter('maxPrice', Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>₹500</span>
          <span>₹50,000</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Seats
        </label>
        <select
          value={filters.seats || ''}
          onChange={(e) => setFilter('seats', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any</option>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7+</option>
        </select>
      </div>
    </div>
  );
}
