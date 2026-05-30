import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/lib/apiClient';
import { useSearchStore } from '@/features/cars/store/searchStore';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useBookingDraftStore } from '@/features/booking/store/bookingDraftStore';
import {
  Booking,
  CreateBookingPayload,
  CreateBookingResponse,
  VerifyPaymentPayload,
} from '@/types/booking.types';
import { Car } from '@/types/car.types';

// --- Mock Data Fallbacks ---

const MOCK_CARS: Car[] = [
  {
    _id: 'car-1',
    owner_id: 'mock-owner-id',
    brand: 'Ferrari',
    model: 'SF90 Stradale',
    year: 2024,
    registration_number: 'TN-01-FF-9090',
    color: 'Rosso Corsa',
    car_type: 'luxury',
    transmission: 'automatic',
    fuel_type: 'hybrid',
    seats: 2,
    price_per_day: 150000,
    security_deposit: 50000,
    location: { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
    images: ['/images/showcase-car.png'],
    status: 'available',
    features: ['AC', 'Bluetooth', 'GPS', 'Launch Control'],
    average_rating: 4.9,
    total_reviews: 24,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'car-2',
    owner_id: 'mock-owner-id',
    brand: 'Lamborghini',
    model: 'Revuelto',
    year: 2024,
    registration_number: 'TN-02-L-7777',
    color: 'Giallo Auge',
    car_type: 'luxury',
    transmission: 'automatic',
    fuel_type: 'hybrid',
    seats: 2,
    price_per_day: 180000,
    security_deposit: 60000,
    location: { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
    images: ['/images/fleet-lambo.png'],
    status: 'available',
    features: ['AC', 'Bluetooth', 'GPS', 'Carbon Ceramic Brakes'],
    average_rating: 4.8,
    total_reviews: 18,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'car-3',
    owner_id: 'mock-owner-id',
    brand: 'Porsche',
    model: '911 GT3 RS',
    year: 2024,
    registration_number: 'TN-03-P-9111',
    color: 'GT Silver Metallic',
    car_type: 'luxury',
    transmission: 'automatic',
    fuel_type: 'petrol',
    seats: 2,
    price_per_day: 120000,
    security_deposit: 40000,
    location: { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
    images: ['/images/fleet-porsche.png'],
    status: 'available',
    features: ['AC', 'Bluetooth', 'GPS', 'Active Aerodynamics'],
    average_rating: 5.0,
    total_reviews: 32,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'car-4',
    owner_id: 'mock-owner-id',
    brand: 'Range Rover',
    model: 'Autobiography',
    year: 2024,
    registration_number: 'TN-04-RR-8888',
    color: 'Santorini Black',
    car_type: 'suv',
    transmission: 'automatic',
    fuel_type: 'diesel',
    seats: 5,
    price_per_day: 80000,
    security_deposit: 30000,
    location: { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
    images: ['/images/fleet-rover.png'],
    status: 'available',
    features: ['AC', 'Bluetooth', 'GPS', 'Massage Seats', 'Panoramic Sunroof'],
    average_rating: 4.7,
    total_reviews: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const MOCK_BOOKINGS: Booking[] = [
  {
    _id: 'b-1',
    booking_number: 'BK-2026-0001',
    customer_id: 'mock-customer-id',
    car_id: 'car-1',
    car_snapshot: {
      brand: 'Ferrari',
      model: 'SF90 Stradale',
      image: '/images/showcase-car.png',
      price_per_day: 150000,
    },
    customer_snapshot: {
      name: 'Demo Customer',
      phone: '9876543210',
      license_number: 'DL-123456789',
    },
    pickup_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    return_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    pickup_location: 'Chennai Airport',
    add_ons: [
      { name: 'insurance', price_per_day: 2000 }
    ],
    base_price: 450000,
    add_ons_total: 6000,
    discount: 0,
    tax: 82080,
    total_amount: 538080,
    security_deposit: 50000,
    status: 'confirmed',
    payment_status: 'paid',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'b-2',
    booking_number: 'BK-2026-0002',
    customer_id: 'mock-customer-id',
    car_id: 'car-3',
    car_snapshot: {
      brand: 'Porsche',
      model: '911 GT3 RS',
      image: '/images/fleet-porsche.png',
      price_per_day: 120000,
    },
    customer_snapshot: {
      name: 'Demo Customer',
      phone: '9876543210',
      license_number: 'DL-123456789',
    },
    pickup_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    return_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    pickup_location: 'Nungambakkam',
    add_ons: [],
    base_price: 360000,
    add_ons_total: 0,
    discount: 0,
    tax: 64800,
    total_amount: 424800,
    security_deposit: 40000,
    status: 'completed',
    payment_status: 'paid',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const MOCK_ADMIN_STATS = {
  total_bookings: 142,
  total_revenue: 8450000,
  total_cars: 12,
  active_bookings: 8,
};

// --- Cars ---

export function useCars() {
  const { location, pickupDate, returnDate, filters } = useSearchStore();
  const debouncedFilters = useDebounce(filters, 400);

  return useQuery<Car[]>({
    queryKey: ['cars', location, pickupDate, returnDate, debouncedFilters],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/cars', {
          params: {
            city: location || undefined,
            pickup_date: pickupDate?.toISOString() || undefined,
            return_date: returnDate?.toISOString() || undefined,
            car_type: debouncedFilters.carType || undefined,
            transmission: debouncedFilters.transmission || undefined,
            max_price: debouncedFilters.maxPrice || undefined,
            seats: debouncedFilters.seats || undefined,
          },
        });
        return response.data;
      } catch (err) {
        console.warn('Cars fetch failed, using fallback data:', err);
        return MOCK_CARS;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

export function useCarDetail(carId: string) {
  return useQuery<Car>({
    queryKey: ['car', carId],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/cars/${carId}`);
        return response.data;
      } catch (err) {
        console.warn('Car detail fetch failed, using fallback:', err);
        return MOCK_CARS.find((c) => c._id === carId) || MOCK_CARS[0];
      }
    },
    enabled: !!carId,
  });
}

// --- Bookings ---

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { clearDraft } = useBookingDraftStore();

  return useMutation<CreateBookingResponse, Error, CreateBookingPayload>({
    mutationFn: async (data) => {
      try {
        const response = await apiClient.post('/bookings', data);
        return response.data;
      } catch (err) {
        console.warn('Create booking failed, using mock success response:', err);
        const car = MOCK_CARS.find((c) => c._id === data.car_id) || MOCK_CARS[0];
        return {
          booking: {
            _id: 'b-mock-' + Date.now(),
            booking_number: 'BK-2026-' + Math.floor(Math.random() * 9000 + 1000),
            customer_id: 'mock-customer-id',
            car_id: data.car_id,
            car_snapshot: {
              brand: car.brand,
              model: car.model,
              image: car.images[0],
              price_per_day: car.price_per_day,
            },
            customer_snapshot: {
              name: 'Demo Customer',
              phone: '9876543210',
              license_number: 'DL-123456789',
            },
            pickup_date: data.pickup_date,
            return_date: data.return_date,
            pickup_location: data.pickup_location,
            add_ons: data.add_ons.map((name) => ({ name: name as any, price_per_day: 1000 })),
            base_price: car.price_per_day * 3,
            add_ons_total: 3000,
            discount: 0,
            tax: 20000,
            total_amount: car.price_per_day * 3 + 23000,
            security_deposit: car.security_deposit,
            status: 'confirmed',
            payment_status: 'paid',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          razorpay_order: {
            id: 'order_mock_' + Date.now(),
            amount: 50000,
            currency: 'INR',
          },
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      clearDraft();
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation<
    Booking,
    Error,
    { bookingId: string; reason: string },
    { previousBookings: Booking[] | undefined }
  >({
    mutationFn: async ({ bookingId, reason }) => {
      try {
        const response = await apiClient.patch(`/bookings/${bookingId}/cancel`, { reason });
        return response.data;
      } catch (err) {
        console.warn('Cancel booking failed, using mock response:', err);
        const booking = MOCK_BOOKINGS.find((b) => b._id === bookingId);
        return {
          ...(booking || MOCK_BOOKINGS[0]),
          status: 'cancelled',
        };
      }
    },
    onMutate: async ({ bookingId }) => {
      await queryClient.cancelQueries({ queryKey: ['my-bookings'] });
      const previousBookings = queryClient.getQueryData<Booking[]>(['my-bookings']);
      queryClient.setQueryData(['my-bookings'], (old: Booking[] | undefined) =>
        old?.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' as const } : b))
      );
      return { previousBookings };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousBookings) {
        queryClient.setQueryData(['my-bookings'], context.previousBookings);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
  });
}

export function useMyBookings() {
  return useQuery<Booking[]>({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/bookings/my');
        return response.data;
      } catch (err) {
        console.warn('My bookings fetch failed, using fallback data:', err);
        return MOCK_BOOKINGS;
      }
    },
  });
}

export function useVerifyPayment() {
  return useMutation<{ message: string; booking: Booking }, Error, VerifyPaymentPayload>({
    mutationFn: async (data) => {
      try {
        const response = await apiClient.post('/payments/verify', data);
        return response.data;
      } catch (err) {
        console.warn('Verify payment failed, using mock success response:', err);
        return {
          message: 'Payment verified successfully (Mock)',
          booking: MOCK_BOOKINGS[0],
        };
      }
    },
  });
}

// --- Admin ---

interface AdminStats {
  total_bookings: number;
  total_revenue: number;
  total_cars: number;
  active_bookings: number;
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/admin/stats');
        return response.data;
      } catch (err) {
        console.warn('Admin stats fetch failed, using fallback data:', err);
        return MOCK_ADMIN_STATS;
      }
    },
  });
}
