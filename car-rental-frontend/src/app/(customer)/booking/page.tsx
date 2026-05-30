'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingDraftStore } from '@/features/booking/store/bookingDraftStore';
import { StepIndicator } from '@/features/booking/components/BookingForm/StepIndicator';
import Step1_CarDates from '@/features/booking/components/BookingForm/Step1_CarDates';
import Step2_AddOns from '@/features/booking/components/BookingForm/Step2_AddOns';
import Step3_DriverDetails from '@/features/booking/components/BookingForm/Step3_DriverDetails';
import Step4_Payment from '@/features/booking/components/BookingForm/Step4_Payment';

export default function BookingPage() {
  const router = useRouter();
  const { selectedCar, step } = useBookingDraftStore();

  // Redirect if no car selected
  useEffect(() => {
    if (!selectedCar) {
      router.push('/cars');
    }
  }, [selectedCar, router]);

  if (!selectedCar) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Book Your Car</h1>
        <StepIndicator currentStep={step} totalSteps={4} />
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          {step === 1 && <Step1_CarDates />}
          {step === 2 && <Step2_AddOns />}
          {step === 3 && <Step3_DriverDetails />}
          {step === 4 && <Step4_Payment />}
        </div>
      </div>
    </div>
  );
}
