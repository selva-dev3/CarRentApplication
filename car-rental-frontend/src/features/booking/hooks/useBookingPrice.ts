import { useMemo } from 'react';
import { differenceInDays } from 'date-fns';
import { useBookingDraftStore } from '@/features/booking/store/bookingDraftStore';
import { useSearchStore } from '@/features/cars/store/searchStore';

export const ADD_ON_PRICES: Record<string, number> = {
  insurance: 300,
  gps: 150,
  child_seat: 200,
  driver: 800,
};

export interface BookingPriceBreakdown {
  days: number;
  base: number;
  addOnsTotal: number;
  tax: number;
  total: number;
  deposit: number;
}

export function useBookingPrice(): BookingPriceBreakdown | null {
  const { selectedCar, addOns } = useBookingDraftStore();
  const { pickupDate, returnDate } = useSearchStore();

  return useMemo(() => {
    if (!selectedCar || !pickupDate || !returnDate) return null;

    const days = differenceInDays(returnDate, pickupDate);
    if (days <= 0) return null;

    const base = selectedCar.price_per_day * days;
    const addOnsTotal = addOns.reduce((sum, a) => sum + (ADD_ON_PRICES[a.name] ?? 0), 0) * days;
    const tax = (base + addOnsTotal) * 0.18;
    const total = base + addOnsTotal + tax;

    return {
      days,
      base: Math.round(base),
      addOnsTotal: Math.round(addOnsTotal),
      tax: Math.round(tax),
      total: Math.round(total),
      deposit: selectedCar.security_deposit,
    };
  }, [selectedCar, addOns, pickupDate, returnDate]);
}
