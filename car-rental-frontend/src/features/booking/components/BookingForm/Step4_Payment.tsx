'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingDraftStore } from '@/features/booking/store/bookingDraftStore';
import { useSearchStore } from '@/features/cars/store/searchStore';
import { useBookingPrice } from '@/features/booking/hooks/useBookingPrice';
import { useCreateBooking, useVerifyPayment } from '@/shared/hooks/useBookingQueries';
import { Button } from '@/shared/components/Button';
import { formatDate } from '@/shared/lib/dateUtils';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (response: unknown) => void) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export default function Step4_Payment() {
  const router = useRouter();
  const { selectedCar, addOns, driverDetails, clearDraft } = useBookingDraftStore();
  const { location, pickupDate, returnDate } = useSearchStore();
  const price = useBookingPrice();
  const createBooking = useCreateBooking();
  const verifyPayment = useVerifyPayment();
  const [error, setError] = useState<string | null>(null);
  const [isLoadingScript, setIsLoadingScript] = useState(false);

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      setIsLoadingScript(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        setIsLoadingScript(false);
        resolve(true);
      };
      script.onerror = () => {
        setIsLoadingScript(false);
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!selectedCar || !pickupDate || !returnDate || !price || !driverDetails) {
      setError('Missing required booking information');
      return;
    }

    setError(null);

    try {
      // 1. Create booking
      const createRes = await createBooking.mutateAsync({
        car_id: selectedCar._id,
        pickup_date: pickupDate.toISOString(),
        return_date: returnDate.toISOString(),
        pickup_location: location,
        add_ons: addOns.map((a) => a.name),
      });

      const booking = createRes.booking;
      const order = createRes.razorpay_order;

      // 2. Load Razorpay
      const loaded = await loadRazorpay();
      if (!loaded) {
        setError('Failed to load payment gateway. Please try again.');
        return;
      }

      // 3. Get user info for prefill
      const stored = localStorage.getItem('auth-storage');
      const authData = stored ? JSON.parse(stored) : null;
      const user = authData?.state?.user;

      // 4. Open Razorpay
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: order.amount,
        currency: order.currency,
        name: 'Car Rental',
        description: `Booking ${booking.booking_number}`,
        order_id: order.id,
        handler: async (response: RazorpayResponse) => {
          try {
            await verifyPayment.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              booking_id: booking._id,
            });
            clearDraft();
            router.push('/my-bookings');
          } catch {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#2563eb',
        },
      });

      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.');
      });

      rzp.open();
    } catch {
      setError('Failed to initiate booking. Please try again.');
    }
  };

  if (!price) {
    return (
      <div className="text-center py-8 text-gray-500">
        Unable to calculate price. Please check your selections.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Price Summary</h2>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {price.days} day{price.days > 1 ? 's' : ''} rental
          </span>
          <span className="font-medium">₹{price.base.toLocaleString()}</span>
        </div>

        {addOns.length > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Add-ons ({addOns.map((a) => a.name.replace('_', ' ')).join(', ')})
            </span>
            <span className="font-medium">₹{price.addOnsTotal.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (18% GST)</span>
          <span className="font-medium">₹{price.tax.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Security Deposit</span>
          <span className="font-medium">₹{price.deposit.toLocaleString()}</span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total Payable</span>
            <span className="font-bold text-xl text-blue-600">
              ₹{price.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p>
          <span className="font-medium">Pickup:</span> {formatDate(pickupDate)}{' '}
          {location && `from ${location}`}
        </p>
        <p>
          <span className="font-medium">Return:</span> {formatDate(returnDate)}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => useBookingDraftStore.getState().prevStep()}>
          Back
        </Button>
        <Button
          onClick={handlePayment}
          isLoading={createBooking.isPending || verifyPayment.isPending || isLoadingScript}
          className="min-w-[200px]"
        >
          Pay with Razorpay
        </Button>
      </div>
    </div>
  );
}
