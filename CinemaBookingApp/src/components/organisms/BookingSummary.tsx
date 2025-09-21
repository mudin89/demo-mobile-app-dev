import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, TextInput, ScrollView} from 'react-native';
import {Typography, Button} from '../../components/atoms';
import {Movie, MovieSession, Seat, BookingItem, Cinema} from '../../types';
import {dataService} from '../../services/dataService';
import {colors} from '../../theme';

interface BookingSummaryProps {
  movie: Movie;
  session: MovieSession;
  seats: Seat[];
  bookingItems: BookingItem[];
  totalAmount: number;
  serviceCharge: number;
  onConfirmBooking: () => void;
  isProcessing?: boolean;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  movie,
  session,
  seats,
  bookingItems,
  totalAmount,
  serviceCharge,
  onConfirmBooking,
  isProcessing = false,
}) => {
  const [cinema, setCinema] = useState<Cinema | null>(null);
  const [promoCode, setPromoCode] = useState('');

  const ticketTotal = seats
    ? seats.reduce((total, seat) => total + seat.price, 0)
    : 0;

  // Load cinema information
  useEffect(() => {
    const loadCinema = async () => {
      if (session?.cinemaId) {
        try {
          console.log('🏢 BookingSummary: Loading cinema:', session.cinemaId);
          const cinemaData = await dataService.getCinemaById(session.cinemaId);
          setCinema(cinemaData);
          console.log('🏢 BookingSummary: Cinema loaded:', cinemaData?.name);
        } catch (error) {
          console.error('❌ BookingSummary: Error loading cinema:', error);
        }
      }
    };

    loadCinema();
  }, [session?.cinemaId]);

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid time string:', timeString);
        return 'Invalid Time';
      }
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid Time';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}>
      {/* Movie Card with Ticket Design */}
      <View style={styles.movieCard}>
        <View style={styles.movieInfo}>
          <Image source={{uri: movie.poster}} style={styles.poster} />
          <View style={styles.movieDetails}>
            <Typography variant="h3" numberOfLines={2} color={colors.text}>
              {movie.title}
            </Typography>
            <Typography
              variant="body"
              color={colors.textSecondary}
              style={styles.genres}>
              Action, Adventure, Sci-fi
            </Typography>
            <Typography variant="body" color={colors.textSecondary}>
              {movie.duration}m
            </Typography>
            <Typography variant="body" color={colors.textSecondary}>
              {movie.language}, {movie.type}
            </Typography>
          </View>
        </View>

        {/* Ticket perforations */}
        <View style={styles.ticketDivider} />

        {/* Cinema and Session Details */}
        <View style={styles.sessionInfo}>
          <Typography
            variant="caption"
            color={colors.textSecondary}
            style={styles.cinemaLabel}>
            Cinema
          </Typography>
          <Typography
            variant="h3"
            color={colors.text}
            style={styles.cinemaName}>
            {cinema ? `${cinema.name} ${cinema.location}` : 'Loading cinema...'}
          </Typography>

          <View style={styles.sessionTable}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Typography variant="caption" color={colors.textSecondary}>
                  Date
                </Typography>
                <Typography variant="body" color={colors.text}>
                  {new Date(session.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Typography>
              </View>
              <View style={styles.tableCell}>
                <Typography variant="caption" color={colors.textSecondary}>
                  Hall
                </Typography>
                <Typography variant="body" color={colors.text}>
                  {session.hallId
                    ? `Hall ${session.hallId.split('-')[1] || '1'}`
                    : 'Hall 1'}
                </Typography>
              </View>
              <View style={styles.tableCell}>
                <Typography variant="caption" color={colors.textSecondary}>
                  Time
                </Typography>
                <Typography variant="body" color={colors.text}>
                  {formatTime(session.startTime)} -{' '}
                  {formatTime(session.endTime)}
                </Typography>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableCellFull]}>
                <Typography variant="caption" color={colors.textSecondary}>
                  Seats
                </Typography>
                <Typography variant="body" color={colors.text}>
                  {seats && seats.length > 0
                    ? seats.map(seat => `${seat.row}${seat.number}`).join(', ')
                    : 'None selected'}
                </Typography>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Pricing Summary */}
      <View style={styles.pricingCard}>
        {/* Tickets Section */}
        <View style={styles.pricingSection}>
          <Typography
            variant="h3"
            color={colors.text}
            style={styles.sectionTitle}>
            Tickets
          </Typography>
          <View style={styles.summaryRow}>
            <Typography variant="body" color={colors.textSecondary}>
              Seat Total
            </Typography>
            <Typography variant="body" color={colors.text}>
              RM{ticketTotal.toFixed(0)}
            </Typography>
          </View>
        </View>

        {/* Food & Beverage Section */}
        {bookingItems && bookingItems.length > 0 && (
          <View style={styles.pricingSection}>
            <Typography
              variant="h3"
              color={colors.text}
              style={styles.sectionTitle}>
              Food & Beverage
            </Typography>
            {bookingItems.map(item => (
              <View key={item.id} style={styles.summaryRow}>
                <Typography variant="body" color={colors.textSecondary}>
                  {item.name} [x{item.quantity}]
                </Typography>
                <Typography variant="body" color={colors.text}>
                  RM{(item.price * item.quantity).toFixed(0)}
                </Typography>
              </View>
            ))}
          </View>
        )}

        {/* Charges Section */}
        <View style={styles.pricingSection}>
          <Typography
            variant="h3"
            color={colors.text}
            style={styles.sectionTitle}>
            Charges
          </Typography>
          <View style={styles.summaryRow}>
            <Typography variant="body" color={colors.textSecondary}>
              Service charge
            </Typography>
            <Typography variant="body" color={colors.text}>
              RM{serviceCharge.toFixed(0)}
            </Typography>
          </View>
        </View>

        {/* Promo Code Section */}
        <View style={styles.pricingSection}>
          <Typography
            variant="h3"
            color={colors.text}
            style={styles.sectionTitle}>
            Promo Code
          </Typography>
          <TextInput
            style={styles.promoInput}
            value={promoCode}
            onChangeText={setPromoCode}
            placeholder="Enter promo code"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Total Amount */}
        <View style={styles.totalSection}>
          <Typography variant="h3" color={colors.text}>
            Total Amount Payable
          </Typography>
          <Typography
            variant="h2"
            color={colors.text}
            style={styles.totalAmount}>
            RM{totalAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Typography>
        </View>
      </View>

      {/* Proceed Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={isProcessing ? 'Processing...' : 'Proceed to payment'}
          onPress={onConfirmBooking}
          disabled={isProcessing}
          size="large"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  movieCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
    overflow: 'hidden',
  },
  movieInfo: {
    flexDirection: 'row',
    padding: 16,
  },
  poster: {
    width: 120,
    height: 160,
    borderRadius: 8,
    marginRight: 16,
  },
  movieDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  genres: {
    marginTop: 4,
    marginBottom: 8,
  },
  ticketDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sessionInfo: {
    padding: 16,
  },
  cinemaLabel: {
    marginBottom: 4,
  },
  cinemaName: {
    marginBottom: 16,
  },
  sessionTable: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableCell: {
    flex: 1,
    alignItems: 'center',
  },
  tableCellFull: {
    flex: 3,
    alignItems: 'flex-start',
  },
  pricingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 24,
  },
  pricingSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  promoInput: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16,
  },
  totalSection: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 16,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
});
