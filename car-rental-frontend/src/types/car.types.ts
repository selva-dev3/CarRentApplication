export interface CarLocation {
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export interface Car {
  _id: string;
  brand: string;
  model: string;
  year: number;
  car_type: string;
  transmission: string;
  fuel_type: string;
  seats: number;
  price_per_day: number;
  security_deposit: number;
  location: CarLocation;
  images: string[];
  status: string;
  average_rating: number;
  total_reviews: number;
  features: string[];
}
