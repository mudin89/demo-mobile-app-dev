import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Seat, BookingItem, MovieSession, Movie} from '../../types';

interface BookingState {
  selectedSession: MovieSession | null;
  selectedMovie: Movie | null;
  selectedSeats: Seat[];
  bookingItems: BookingItem[];
  totalAmount: number;
  serviceCharge: number;
  seatLockTimers: {[seatId: string]: NodeJS.Timeout};
  lockExpiryTimes: {[seatId: string]: Date};
}

const initialState: BookingState = {
  selectedSession: null,
  selectedMovie: null,
  selectedSeats: [],
  bookingItems: [],
  totalAmount: 0,
  serviceCharge: 2.5,
  seatLockTimers: {},
  lockExpiryTimes: {},
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedSession: (state, action: PayloadAction<MovieSession>) => {
      state.selectedSession = action.payload;
    },
    setSelectedMovie: (state, action: PayloadAction<Movie>) => {
      state.selectedMovie = action.payload;
    },
    toggleSeat: (state, action: PayloadAction<Seat>) => {
      const seat = action.payload;
      const existingIndex = state.selectedSeats.findIndex(
        s => s.id === seat.id,
      );

      if (existingIndex >= 0) {
        state.selectedSeats.splice(existingIndex, 1);
      } else {
        state.selectedSeats.push({...seat, isSelected: true});
      }

      bookingSlice.caseReducers.calculateTotal(state);
    },
    addBookingItem: (state, action: PayloadAction<BookingItem>) => {
      const item = action.payload;
      const existingIndex = state.bookingItems.findIndex(i => i.id === item.id);

      if (existingIndex >= 0) {
        state.bookingItems[existingIndex].quantity += item.quantity;
      } else {
        state.bookingItems.push(item);
      }

      bookingSlice.caseReducers.calculateTotal(state);
    },
    removeBookingItem: (state, action: PayloadAction<string>) => {
      state.bookingItems = state.bookingItems.filter(
        item => item.id !== action.payload,
      );
      bookingSlice.caseReducers.calculateTotal(state);
    },
    calculateTotal: state => {
      const ticketTotal = state.selectedSeats.reduce(
        (total, seat) => total + seat.price,
        0,
      );
      const itemsTotal = state.bookingItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      state.totalAmount = ticketTotal + itemsTotal + state.serviceCharge;
    },
    clearBooking: state => {
      // Clear all timers before resetting state
      Object.values(state.seatLockTimers).forEach(timer => {
        if (timer) {
          clearTimeout(timer);
        }
      });
      return initialState;
    },
    clearSeatsOnly: state => {
      // Clear seat selection and timers but keep other booking data
      Object.values(state.seatLockTimers).forEach(timer => {
        if (timer) {
          clearTimeout(timer);
        }
      });
      state.selectedSeats = [];
      state.seatLockTimers = {};
      state.lockExpiryTimes = {};
      bookingSlice.caseReducers.calculateTotal(state);
    },
    setSeatLockTimer: (
      state,
      action: PayloadAction<{
        seatId: string;
        timer: NodeJS.Timeout;
        expiryTime: Date;
      }>,
    ) => {
      const {seatId, timer, expiryTime} = action.payload;
      state.seatLockTimers[seatId] = timer;
      state.lockExpiryTimes[seatId] = expiryTime;
    },
    clearSeatLockTimer: (state, action: PayloadAction<string>) => {
      const seatId = action.payload;
      if (state.seatLockTimers[seatId]) {
        clearTimeout(state.seatLockTimers[seatId]);
        delete state.seatLockTimers[seatId];
        delete state.lockExpiryTimes[seatId];
      }
    },
  },
});

export const {
  setSelectedSession,
  setSelectedMovie,
  toggleSeat,
  addBookingItem,
  removeBookingItem,
  calculateTotal,
  clearBooking,
  clearSeatsOnly,
  setSeatLockTimer,
  clearSeatLockTimer,
} = bookingSlice.actions;

export default bookingSlice.reducer;
