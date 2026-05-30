export type BookingStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'refund_initiated';

export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface AddOn {
  name: 'insurance' | 'gps' | 'child_seat' | 'driver';
  price_per_day: number;
}

export interface CarSnapshot {
  brand: string;
  model: string;
  image: string;
  price_per_day: number;
}

export interface Booking {
  _id: string;
  booking_number: string;
  car_snapshot: CarSnapshot;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  add_ons: AddOn[];
  base_price: number;
  add_ons_total: number;
  tax: number;
  total_amount: number;
  security_deposit: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  created_at: string;
}

export interface CreateBookingPayload {
  car_id: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  add_ons: string[];
  promo_code?: string;
}

export interface CreateBookingResponse {
  booking: Booking;
  razorpay_order: {
    id: string;
    amount: number;
    currency: string;
  };
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  booking_id: string;
}

export interface DriverDetails {
  license_number: string;
  license_expiry: string;
}

export const STATUS_COLORS: Record<BookingStatus, string> = {
  pending_payment: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  refund_initiated: 'bg-orange-100 text-orange-800',
};
