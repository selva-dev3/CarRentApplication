'use client';

import React from 'react';
import { useBookingDraftStore, AddOnItem } from '@/features/booking/store/bookingDraftStore';
import { useBookingPrice, ADD_ON_PRICES } from '@/features/booking/hooks/useBookingPrice';
import { Button } from '@/shared/components/Button';

const ADD_ONS: { name: AddOnItem['name']; label: string; description: string }[] = [
  { name: 'insurance', label: 'Insurance', description: 'Full coverage protection' },
  { name: 'gps', label: 'GPS Navigation', description: 'Never get lost' },
  { name: 'child_seat', label: 'Child Seat', description: 'Safe travel for kids' },
  { name: 'driver', label: 'Driver Service', description: 'Professional chauffeur' },
];

export default function Step2_AddOns() {
  const { addOns, toggleAddOn, nextStep, prevStep } = useBookingDraftStore();
  const price = useBookingPrice();

  const isSelected = (name: AddOnItem['name']) => addOns.some((a) => a.name === name);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Choose Add-ons</h2>

      <div className="grid gap-4">
        {ADD_ONS.map((addon) => {
          const selected = isSelected(addon.name);
          const pricePerDay = ADD_ON_PRICES[addon.name];

          return (
            <button
              key={addon.name}
              onClick={() => toggleAddOn({ name: addon.name, price_per_day: pricePerDay })}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors text-left ${
                selected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}
                >
                  {selected && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{addon.label}</p>
                  <p className="text-sm text-gray-500">{addon.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-blue-600">₹{pricePerDay}/day</p>
                {selected && <p className="text-xs text-green-600">Selected</p>}
              </div>
            </button>
          );
        })}
      </div>

      {price && addOns.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Add-ons Total</span>
            <span className="font-medium">₹{price.addOnsTotal.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>Continue</Button>
      </div>
    </div>
  );
}
