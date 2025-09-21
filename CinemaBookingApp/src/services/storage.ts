import {MMKV} from 'react-native-mmkv';
import {PaymentCard, SavedTicket} from '../types';

class StorageService {
  private storage = new MMKV({
    id: 'cinema-app-storage',
    encryptionKey: 'cinema-booking-encryption-key-2023',
  });

  private PAYMENT_CARDS_KEY = 'payment_cards';
  private SAVED_TICKETS_KEY = 'saved_tickets';

  async savePaymentCard(card: Omit<PaymentCard, 'id'>): Promise<string> {
    try {
      const existingCards = await this.getPaymentCards();
      const cardId = `card_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const newCard: PaymentCard = {
        ...card,
        id: cardId,
      };

      const updatedCards = [...existingCards, newCard];
      this.storage.set(this.PAYMENT_CARDS_KEY, JSON.stringify(updatedCards));

      return cardId;
    } catch (error) {
      console.error('Error saving payment card:', error);
      throw new Error('Failed to save payment card');
    }
  }

  async getPaymentCards(): Promise<PaymentCard[]> {
    try {
      const cardsJson = this.storage.getString(this.PAYMENT_CARDS_KEY);
      return cardsJson ? JSON.parse(cardsJson) : [];
    } catch (error) {
      console.error('Error getting payment cards:', error);
      return [];
    }
  }

  async deletePaymentCard(cardId: string): Promise<boolean> {
    try {
      const existingCards = await this.getPaymentCards();
      const updatedCards = existingCards.filter(card => card.id !== cardId);

      this.storage.set(this.PAYMENT_CARDS_KEY, JSON.stringify(updatedCards));
      return true;
    } catch (error) {
      console.error('Error deleting payment card:', error);
      return false;
    }
  }

  async getPaymentCard(cardId: string): Promise<PaymentCard | null> {
    try {
      const cards = await this.getPaymentCards();
      return cards.find(card => card.id === cardId) || null;
    } catch (error) {
      console.error('Error getting payment card:', error);
      return null;
    }
  }

  maskCardNumber(cardNumber: string): string {
    if (cardNumber.length < 4) {
      return cardNumber;
    }
    return cardNumber.slice(-4);
  }

  getCardType(cardNumber: string): PaymentCard['type'] {
    const cleaned = cardNumber.replace(/\s+/g, '');

    if (cleaned.startsWith('4')) {
      return 'visa';
    } else if (cleaned.startsWith('5') || cleaned.startsWith('2')) {
      return 'mastercard';
    } else if (cleaned.startsWith('3')) {
      return 'amex';
    }

    return 'visa';
  }

  validateExpiryDate(expiry: string): boolean {
    const [month, year] = expiry.split('/');

    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return false;
    }

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(`20${year}`, 10);

    if (monthNum < 1 || monthNum > 12) {
      return false;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (
      yearNum < currentYear ||
      (yearNum === currentYear && monthNum < currentMonth)
    ) {
      return false;
    }

    return true;
  }

  // Ticket management methods
  async saveTicket(ticket: Omit<SavedTicket, 'id'>): Promise<string> {
    try {
      const existingTickets = await this.getSavedTickets();
      const ticketId = `ticket_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const newTicket: SavedTicket = {
        ...ticket,
        id: ticketId,
      };

      const updatedTickets = [...existingTickets, newTicket];
      this.storage.set(this.SAVED_TICKETS_KEY, JSON.stringify(updatedTickets));

      console.log('💾 StorageService: Ticket saved successfully:', ticketId);
      return ticketId;
    } catch (error) {
      console.error('Error saving ticket:', error);
      throw new Error('Failed to save ticket');
    }
  }

  async getSavedTickets(): Promise<SavedTicket[]> {
    try {
      const ticketsJson = this.storage.getString(this.SAVED_TICKETS_KEY);
      const tickets = ticketsJson ? JSON.parse(ticketsJson) : [];
      console.log('💾 StorageService: Retrieved', tickets.length, 'tickets');
      return tickets;
    } catch (error) {
      console.error('Error getting saved tickets:', error);
      return [];
    }
  }

  async getTicketByBookingId(bookingId: string): Promise<SavedTicket | null> {
    try {
      const tickets = await this.getSavedTickets();
      const ticket = tickets.find(t => t.bookingId === bookingId) || null;
      console.log(
        '💾 StorageService: Ticket lookup for',
        bookingId,
        ticket ? 'found' : 'not found',
      );
      return ticket;
    } catch (error) {
      console.error('Error getting ticket by booking ID:', error);
      return null;
    }
  }

  async updateTicketStatus(
    ticketId: string,
    status: SavedTicket['status'],
  ): Promise<boolean> {
    try {
      const tickets = await this.getSavedTickets();
      const updatedTickets = tickets.map(ticket =>
        ticket.id === ticketId ? {...ticket, status} : ticket,
      );

      this.storage.set(this.SAVED_TICKETS_KEY, JSON.stringify(updatedTickets));
      console.log(
        '💾 StorageService: Ticket status updated:',
        ticketId,
        status,
      );
      return true;
    } catch (error) {
      console.error('Error updating ticket status:', error);
      return false;
    }
  }

  async deleteTicket(ticketId: string): Promise<boolean> {
    try {
      const tickets = await this.getSavedTickets();
      const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);

      this.storage.set(this.SAVED_TICKETS_KEY, JSON.stringify(updatedTickets));
      console.log('💾 StorageService: Ticket deleted:', ticketId);
      return true;
    } catch (error) {
      console.error('Error deleting ticket:', error);
      return false;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      this.storage.clearAll();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export const storageService = new StorageService();
