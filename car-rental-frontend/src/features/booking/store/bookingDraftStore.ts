import { create } from 'zustand';
import { Car } from '@/types/car.types';
import { DriverDetails } from '@/types/booking.types';

export type AddOnName = 'insurance' | 'gps' | 'child_seat' | 'driver';

export interface AddOnItem {
  name: AddOnName;
  price_per_day: number;
}

export interface BookingDraftState {
  selectedCar: Car | null;
  addOns: AddOnItem[];
  step: number;
  driverDetails: DriverDetails | null;
  selectCar: (car: Car) => void;
  toggleAddOn: (addon: AddOnItem) => void;
  nextStep: () => void;
  prevStep: () => void;
  setDriverDetails: (details: DriverDetails) => void;
  clearDraft: () => void;
}

export const useBookingDraftStore = create<BookingDraftState>((set) => ({
  selectedCar: null,
  addOns: [],
  step: 1,
  driverDetails: null,
  selectCar: (car) => set({ selectedCar: car }),
  toggleAddOn: (addon) =>
    set((state) => ({
      addOns: state.addOns.some((a) => a.name === addon.name)
        ? state.addOns.filter((a) => a.name !== addon.name)
        : [...state.addOns, addon],
    })),
  nextStep: () => set((state) => ({ step: Math.min(4, state.step + 1) })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  setDriverDetails: (details) => set({ driverDetails: details }),
  clearDraft: () =>
    set({ selectedCar: null, addOns: [], step: 1, driverDetails: null }),
}));
