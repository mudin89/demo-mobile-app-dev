import {Movie, MovieSession} from '../types';
import {PaymentMethodType} from '../components/molecules/PaymentMethodCard';

export type BottomTabParamList = {
  Home: undefined;
  Tickets: undefined;
  Favourites: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  MovieList: undefined;
  AllMovies: {
    category?: string;
    title?: string;
  };
  MovieDetails: {
    movieId: string;
  };
  SessionSelection: {
    movieId: string;
  };
  SeatSelection: {
    movie: Movie;
    session: MovieSession;
  };
  FoodSelection: undefined;
  BookingSummary: undefined;
  PaymentMethod: {
    totalAmount: number;
  };
  PaymentDetails: {
    paymentMethod: PaymentMethodType;
    totalAmount: number;
  };
  BookingConfirmation: {
    bookingId: string;
  };
  TicketView: {
    bookingId: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
