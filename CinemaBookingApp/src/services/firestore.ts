import AsyncStorage from '@react-native-async-storage/async-storage';
import {Seat} from '../types';

const SEAT_LOCK_DURATION = parseInt(
  process.env.SEAT_LOCK_DURATION_MINUTES || '2',
  10,
);

// Extended lock duration for payment flow (10 minutes)
const PAYMENT_LOCK_DURATION = parseInt(
  process.env.PAYMENT_LOCK_DURATION_MINUTES || '10',
  10,
);

const PURCHASED_SEATS_KEY = 'purchasedSeats';

// Mock Firestore service for development without Firebase
export class FirestoreService {
  private mockSeats: {[sessionId: string]: Seat[]} = {};
  private subscriptions: {[sessionId: string]: Array<(seats: Seat[]) => void>} =
    {};

  private async loadPurchasedSeats(): Promise<{[seatId: string]: Seat}> {
    try {
      const purchasedSeatsData = await AsyncStorage.getItem(
        PURCHASED_SEATS_KEY,
      );
      return purchasedSeatsData ? JSON.parse(purchasedSeatsData) : {};
    } catch (error) {
      console.error('Error loading purchased seats:', error);
      return {};
    }
  }

  private async savePurchasedSeat(seat: Seat): Promise<void> {
    try {
      const purchasedSeats = await this.loadPurchasedSeats();
      purchasedSeats[seat.id] = seat;
      await AsyncStorage.setItem(
        PURCHASED_SEATS_KEY,
        JSON.stringify(purchasedSeats),
      );
    } catch (error) {
      console.error('Error saving purchased seat:', error);
    }
  }

  private async generateMockSeats(sessionId: string): Promise<Seat[]> {
    if (!this.mockSeats[sessionId]) {
      const seats: Seat[] = [];
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const purchasedSeats = await this.loadPurchasedSeats();

      rows.forEach((row, rowIndex) => {
        // Row A has 6 seats, Rows B-G have 8 seats, Row H has 6 seats
        const seatsInRow = row === 'A' ? 6 : row === 'H' ? 6 : 8;

        for (let number = 1; number <= seatsInRow; number++) {
          const seatId = `${sessionId}-${row}${number}`;
          const purchasedSeat = purchasedSeats[seatId];

          seats.push({
            id: seatId,
            hallId: `hall-${sessionId}`,
            sessionId,
            row,
            number,
            isAvailable: !purchasedSeat?.isPurchased,
            price: 12.5,
            // Front rows (A-B) are premium, middle rows (C-F) are standard, back rows (G-H) are VIP
            type: rowIndex < 2 ? 'premium' : rowIndex >= 6 ? 'vip' : 'standard',
            // Restore purchased state from storage
            isPurchased: purchasedSeat?.isPurchased || false,
            purchasedBy: purchasedSeat?.purchasedBy,
            purchasedAt: purchasedSeat?.purchasedAt,
          });
        }
      });

      this.mockSeats[sessionId] = seats;
    }
    return this.mockSeats[sessionId];
  }

  async lockSeat(seatId: string, userId: string): Promise<boolean> {
    try {
      // Find the seat across all sessions
      for (const sessionId in this.mockSeats) {
        const seats = this.mockSeats[sessionId];
        const seatIndex = seats.findIndex(seat => seat.id === seatId);

        if (seatIndex !== -1) {
          const seat = seats[seatIndex];

          // Check if seat is already locked by another user
          if (
            seat.lockedBy &&
            seat.lockedUntil &&
            new Date(seat.lockedUntil) > new Date()
          ) {
            if (seat.lockedBy !== userId) {
              return false; // Already locked by another user
            }
          }

          if (!seat.isAvailable || seat.isPurchased) {
            return false; // Seat is not available or already purchased
          }

          // Lock the seat
          const lockUntil = new Date(
            Date.now() + SEAT_LOCK_DURATION * 60 * 1000,
          );
          seats[seatIndex] = {
            ...seat,
            lockedBy: userId,
            lockedUntil: lockUntil,
          };

          // Notify subscribers
          this.notifySubscribers(sessionId);
          return true;
        }
      }

      return false; // Seat not found
    } catch (error) {
      console.error('Error locking seat:', error);
      return false;
    }
  }

  async unlockSeat(seatId: string, userId: string): Promise<boolean> {
    try {
      for (const sessionId in this.mockSeats) {
        const seats = this.mockSeats[sessionId];
        const seatIndex = seats.findIndex(seat => seat.id === seatId);

        if (seatIndex !== -1) {
          const seat = seats[seatIndex];

          if (seat.lockedBy !== userId) {
            return false; // Seat is not locked by this user
          }

          // Unlock the seat
          seats[seatIndex] = {
            ...seat,
            lockedBy: undefined,
            lockedUntil: undefined,
          };

          // Notify subscribers
          this.notifySubscribers(sessionId);
          return true;
        }
      }

      return false; // Seat not found
    } catch (error) {
      console.error('Error unlocking seat:', error);
      return false;
    }
  }

  async getSeatsBySession(sessionId: string): Promise<Seat[]> {
    try {
      return [...(await this.generateMockSeats(sessionId))];
    } catch (error) {
      console.error('Error getting seats:', error);
      return [];
    }
  }

  subscribeToSeats(
    sessionId: string,
    callback: (seats: Seat[]) => void,
  ): () => void {
    // Initialize mock seats for this session asynchronously
    this.initializeSeats(sessionId, callback);

    // Add callback to subscriptions
    if (!this.subscriptions[sessionId]) {
      this.subscriptions[sessionId] = [];
    }
    this.subscriptions[sessionId].push(callback);

    // Return unsubscribe function
    return () => {
      if (this.subscriptions[sessionId]) {
        const index = this.subscriptions[sessionId].indexOf(callback);
        if (index > -1) {
          this.subscriptions[sessionId].splice(index, 1);
        }
      }
    };
  }

  private async initializeSeats(
    sessionId: string,
    callback: (seats: Seat[]) => void,
  ): Promise<void> {
    try {
      // Generate seats if they don't exist
      if (!this.mockSeats[sessionId]) {
        await this.generateMockSeats(sessionId);
      }

      // Initial callback with current seats
      if (this.mockSeats[sessionId]) {
        callback([...this.mockSeats[sessionId]]);
      }
    } catch (error) {
      console.error('Error initializing seats:', error);
      callback([]); // Fallback to empty array
    }
  }

  private notifySubscribers(sessionId: string): void {
    if (this.subscriptions[sessionId] && this.mockSeats[sessionId]) {
      this.subscriptions[sessionId].forEach(callback => {
        callback([...this.mockSeats[sessionId]]);
      });
    }
  }

  async confirmSeatBooking(seatId: string, userId: string): Promise<boolean> {
    try {
      console.log(
        `🎯 FirestoreService: Confirming booking for seat ${seatId} by user ${userId}`,
      );

      for (const sessionId in this.mockSeats) {
        const seats = this.mockSeats[sessionId];
        const seatIndex = seats.findIndex(seat => seat.id === seatId);

        if (seatIndex !== -1) {
          const seat = seats[seatIndex];
          console.log(
            `🔍 FirestoreService: Found seat ${seatId} in session ${sessionId}, lockedBy: ${seat.lockedBy}, isPurchased: ${seat.isPurchased}`,
          );

          if (seat.lockedBy !== userId) {
            console.warn(
              `❌ FirestoreService: Seat ${seatId} is not locked by user ${userId} (locked by: ${seat.lockedBy})`,
            );
            // Check if seat is purchased - if so, it might have been double-booked
            if (seat.isPurchased) {
              console.warn(
                `ℹ️  FirestoreService: Seat ${seatId} is already purchased, skipping confirmation`,
              );
              return true; // Consider this a success since seat is already booked
            }
            return false; // Seat is not locked by this user
          }

          // Confirm booking - mark as permanently purchased
          const purchasedSeat = {
            ...seat,
            isAvailable: false,
            lockedBy: undefined,
            lockedUntil: undefined,
            isPurchased: true,
            purchasedBy: userId,
            purchasedAt: new Date().toISOString(),
          };

          seats[seatIndex] = purchasedSeat;
          console.log(
            `✅ FirestoreService: Seat ${seatId} marked as purchased`,
          );

          // Save to persistent storage
          await this.savePurchasedSeat(purchasedSeat);
          console.log(
            `💾 FirestoreService: Seat ${seatId} saved to persistent storage`,
          );

          // Notify subscribers
          this.notifySubscribers(sessionId);
          console.log(
            `📡 FirestoreService: Notified subscribers for session ${sessionId}`,
          );
          return true;
        }
      }

      console.error(
        `❌ FirestoreService: Seat ${seatId} not found in any session`,
      );
      return false; // Seat not found
    } catch (error) {
      console.error(
        `❌ FirestoreService: Error confirming seat booking for ${seatId}:`,
        error,
      );
      return false;
    }
  }

  async extendSeatLockForPayment(
    seatId: string,
    userId: string,
  ): Promise<boolean> {
    try {
      console.log(
        `🔄 FirestoreService: Extending lock for payment - seat ${seatId} by user ${userId}`,
      );

      for (const sessionId in this.mockSeats) {
        const seats = this.mockSeats[sessionId];
        const seatIndex = seats.findIndex(seat => seat.id === seatId);

        if (seatIndex !== -1) {
          const seat = seats[seatIndex];

          if (seat.lockedBy !== userId) {
            console.warn(
              `❌ FirestoreService: Cannot extend lock - seat ${seatId} not locked by user ${userId} (locked by: ${seat.lockedBy})`,
            );

            // Failsafe: If seat is available and not purchased, try to re-lock it
            if (seat.isAvailable && !seat.isPurchased && !seat.lockedBy) {
              console.log(
                `🔄 FirestoreService: Attempting to re-lock available seat ${seatId}`,
              );
              const lockSuccess = await this.lockSeat(seatId, userId);
              if (lockSuccess) {
                console.log(
                  `✅ FirestoreService: Successfully re-locked seat ${seatId}`,
                );
                // Now extend the newly acquired lock
                return this.extendSeatLockForPayment(seatId, userId);
              }
            }
            return false;
          }

          // Extend lock for payment duration (10 minutes)
          const extendedLockUntil = new Date(
            Date.now() + PAYMENT_LOCK_DURATION * 60 * 1000,
          );

          seats[seatIndex] = {
            ...seat,
            lockedUntil: extendedLockUntil,
          };

          console.log(
            `✅ FirestoreService: Lock extended for seat ${seatId} until ${extendedLockUntil.toISOString()}`,
          );

          // Notify subscribers
          this.notifySubscribers(sessionId);
          return true;
        }
      }

      console.error(
        `❌ FirestoreService: Seat ${seatId} not found for lock extension`,
      );
      return false;
    } catch (error) {
      console.error(
        `❌ FirestoreService: Error extending lock for seat ${seatId}:`,
        error,
      );
      return false;
    }
  }

  async cleanupExpiredLocks(): Promise<void> {
    try {
      const now = new Date();
      let cleanedCount = 0;
      console.log(
        `🧹 FirestoreService: Starting cleanup at ${now.toISOString()}`,
      );

      for (const sessionId in this.mockSeats) {
        const seats = this.mockSeats[sessionId];
        let sessionChanged = false;

        seats.forEach((seat, index) => {
          if (seat.lockedUntil && seat.lockedBy) {
            const lockExpiry = new Date(seat.lockedUntil);
            const timeRemaining = lockExpiry.getTime() - now.getTime();

            if (lockExpiry < now) {
              console.log(
                `🧹 FirestoreService: Cleaning expired lock - seat ${
                  seat.id
                }, locked by ${seat.lockedBy}, expired ${Math.abs(
                  timeRemaining,
                )}ms ago`,
              );
              seats[index] = {
                ...seat,
                lockedBy: undefined,
                lockedUntil: undefined,
              };
              cleanedCount++;
              sessionChanged = true;
            } else {
              console.log(
                `⏰ FirestoreService: Seat ${seat.id} lock still valid for ${timeRemaining}ms`,
              );
            }
          }
        });

        if (sessionChanged) {
          this.notifySubscribers(sessionId);
        }
      }

      if (cleanedCount > 0) {
        console.log(
          `🧹 FirestoreService: Cleaned up ${cleanedCount} expired seat locks`,
        );
      } else {
        console.log(
          '🧹 FirestoreService: No expired locks found during cleanup',
        );
      }
    } catch (error) {
      console.error(
        '❌ FirestoreService: Error cleaning up expired locks:',
        error,
      );
    }
  }
}

export const firestoreService = new FirestoreService();
