import { create } from 'zustand';

export interface SearchFilters {
  carType?: string;
  transmission?: string;
  maxPrice: number;
  seats?: number;
}

export interface SearchState {
  location: string;
  pickupDate: Date | null;
  returnDate: Date | null;
  filters: SearchFilters;
  setLocation: (location: string) => void;
  setDates: (pickupDate: Date | null, returnDate: Date | null) => void;
  setFilter: (key: keyof SearchFilters, val: SearchFilters[keyof SearchFilters]) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: SearchFilters = { maxPrice: 10000 };

export const useSearchStore = create<SearchState>((set) => ({
  location: '',
  pickupDate: null,
  returnDate: null,
  filters: DEFAULT_FILTERS,
  setLocation: (location) => set({ location }),
  setDates: (pickupDate, returnDate) => set({ pickupDate, returnDate }),
  setFilter: (key, val) =>
    set((state) => ({
      filters: { ...state.filters, [key]: val },
    })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
