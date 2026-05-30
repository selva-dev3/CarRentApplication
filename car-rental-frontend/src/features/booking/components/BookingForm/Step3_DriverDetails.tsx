'use client';

import React, { useState } from 'react';
import { useBookingDraftStore } from '@/features/booking/store/bookingDraftStore';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';

export default function Step3_DriverDetails() {
  const { driverDetails, setDriverDetails, nextStep, prevStep } = useBookingDraftStore();
  const [formData, setFormData] = useState({
    license_number: driverDetails?.license_number || '',
    license_expiry: driverDetails?.license_expiry || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.license_number.trim()) newErrors.license_number = 'License number is required';
    if (!formData.license_expiry) newErrors.license_expiry = 'License expiry is required';
    else {
      const expiry = new Date(formData.license_expiry);
      if (expiry <= new Date()) newErrors.license_expiry = 'License must not be expired';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setDriverDetails(formData);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Driver Details</h2>

      <Input
        label="License Number"
        placeholder="e.g., DL1234567890"
        value={formData.license_number}
        onChange={(e) => setFormData((p) => ({ ...p, license_number: e.target.value }))}
        error={errors.license_number}
      />

      <Input
        label="License Expiry Date"
        type="date"
        value={formData.license_expiry}
        onChange={(e) => setFormData((p) => ({ ...p, license_expiry: e.target.value }))}
        error={errors.license_expiry}
      />

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button type="submit">Continue to Payment</Button>
      </div>
    </form>
  );
}
