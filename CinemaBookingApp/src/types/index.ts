export interface Movie {
  id: string;
  title: string;
  type: '2D' | 'IMAX';
  releaseDate: string;
  rating: string; // PG-13, R, etc.
  duration: number;
  poster: string;
  synopsis: string;
  casts: string[];
  directors: string[];
  writers: string[];
  language: string;
  overallStar: number;
}

export interface Review {
  id: string;
  movieId: string;
  user: string;
  comment: string;
  stars: number; // 1-5
}

export interface Cinema {
  id: string;
  name: string;
  location: string;
  brand: string;
  availableMovies: string[];
}

export interface FoodItem {
  id: string;
  category: 'Combo' | 'Food' | 'Drink';
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface MovieSession {
  id: string;
  movieId: string;
  cinemaId: string;
  hallId: string;
  startTime: string;
  endTime: string;
  date: string;
  price: number;
}

export interface Hall {
  id: string;
  cinemaId: string;
  name: string;
  totalSeats: number;
  rows: number;
  seatsPerRow: number;
}

export interface Seat {
  id: string;
  sessionId: string;
  hallId: string;
  row: string;
  number: number;
  type: 'standard' | 'premium' | 'vip';
  price: number;
  isAvailable: boolean;

  // UI state
  isSelected?: boolean;

  // Lock management (temporary 2-minute locks)
  lockedBy?: string;
  lockedUntil?: Date | string;

  // Purchase tracking (permanent unavailability)
  isPurchased?: boolean;
  purchasedBy?: string;
  purchasedAt?: Date | string;
}

export interface BookingItem {
  type: 'ticket' | 'food';
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Booking {
  id: string;
  sessionId: string;
  seatIds: string[];
  items: BookingItem[];
  totalAmount: number;
  serviceCharge: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  userId: string;
}

export interface PaymentCard {
  id: string;
  maskedNumber: string;
  expiryDate: string;
  cardholderName: string;
  type: 'visa' | 'mastercard' | 'amex';
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SavedTicket {
  id: string;
  bookingId: string;
  movie: Movie;
  session: MovieSession;
  seats: Seat[];
  bookingItems: BookingItem[];
  totalAmount: number;
  serviceCharge: number;
  bookingDate: string;
  status: 'active' | 'used' | 'expired';
}
