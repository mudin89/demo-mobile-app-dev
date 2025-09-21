import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet, ScrollView, Image} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Typography, Button} from '../../components/atoms';
import {storageService} from '../../services/storage';
import {RootStackParamList} from '../../navigation/types';
import {SavedTicket} from '../../types';
import {colors} from '../../theme';

type TicketViewRouteProp = RouteProp<RootStackParamList, 'TicketView'>;
type TicketViewNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TicketView'
>;

export const TicketViewScreen: React.FC = () => {
  const route = useRoute<TicketViewRouteProp>();
  const navigation = useNavigation<TicketViewNavigationProp>();
  const {bookingId} = route.params;

  const [ticket, setTicket] = useState<SavedTicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load ticket from storage
  useEffect(() => {
    const loadTicket = async () => {
      console.log('🎫 TicketView: Loading ticket for booking ID:', bookingId);
      setIsLoading(true);
      try {
        const savedTicket = await storageService.getTicketByBookingId(
          bookingId,
        );
        setTicket(savedTicket);
        console.log(
          '🎫 TicketView: Ticket loaded:',
          savedTicket ? 'found' : 'not found',
        );
      } catch (error) {
        console.error('❌ TicketView: Error loading ticket:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTicket();
  }, [bookingId]);

  const handleMainMenu = useCallback(() => {
    console.log('🏠 TicketView: Navigating to main menu');
    navigation.reset({
      index: 0,
      routes: [{name: 'Main'}],
    });
  }, [navigation]);

  const formatDateTime = (dateString: string, timeString: string) => {
    try {
      console.log('🗓️ TicketView formatting date:', dateString, 'time:', timeString);

      if (!dateString || !timeString) {
        return 'Invalid Date/Time';
      }

      // If timeString is already a full ISO string, use it directly
      let fullDateTime: Date;

      if (timeString && (timeString.includes('T') || timeString.includes(':'))) {
        // timeString is likely an ISO string or time format
        fullDateTime = new Date(timeString);

        // Verify the date is valid
        if (isNaN(fullDateTime.getTime())) {
          // Fallback: combine date and time manually
          const sessionDate = new Date(dateString);
          if (timeString.includes(':')) {
            // Extract time from string like "10:00" or full ISO
            const timeMatch = timeString.match(/(\d{1,2}):(\d{2})/);
            if (timeMatch) {
              sessionDate.setHours(parseInt(timeMatch[1], 10), parseInt(timeMatch[2], 10), 0, 0);
            }
          }
          fullDateTime = sessionDate;
        }
      } else {
        // Fallback to using just the date
        fullDateTime = new Date(dateString);
      }

      // Double-check the date is valid
      if (isNaN(fullDateTime.getTime())) {
        console.warn('Invalid date created from:', dateString, timeString);
        return 'Invalid Date/Time';
      }

      // Format to "DD MMM YYYY, hh:mm A"
      const day = fullDateTime.getDate().toString().padStart(2, '0');
      const month = fullDateTime.toLocaleDateString('en-US', { month: 'short' });
      const year = fullDateTime.getFullYear();
      const time = fullDateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const formatted = `${day} ${month} ${year}, ${time}`;
      console.log('🗓️ TicketView formatted result:', formatted);
      return formatted;
    } catch (error) {
      console.error('Error formatting date/time:', error, 'inputs:', dateString, timeString);
      return 'Invalid Date/Time';
    }
  };

  const formatEndTime = (startTimeString: string, endTimeString: string) => {
    try {
      if (!endTimeString) {
        return '';
      }
      const endTime = new Date(endTimeString);
      if (isNaN(endTime.getTime())) {
        return '';
      }
      return endTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      console.error('Error formatting end time:', error);
      return '';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.errorContainer}>
        <Typography variant="h2" color={colors.text}>
          Loading ticket...
        </Typography>
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={styles.errorContainer}>
        <Typography variant="h2" color={colors.text}>
          Ticket not found
        </Typography>
        <Typography
          variant="body"
          color={colors.textSecondary}
          style={styles.errorText}>
          No ticket found for booking {bookingId}
        </Typography>
        <View style={styles.errorActions}>
          <Button
            title="Go Back"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Button
            title="Main Menu"
            onPress={handleMainMenu}
            style={styles.backButton}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Ticket Header */}
      <View style={styles.ticketContainer}>
        <View style={styles.ticketHeader}>
          <Typography
            variant="h1"
            color={colors.text}
            style={styles.ticketTitle}>
            Your Ticket
          </Typography>
          <Typography variant="body" color={colors.textSecondary}>
            Booking ID: {bookingId}
          </Typography>
        </View>

        {/* Movie Info */}
        <View style={styles.movieSection}>
          <Image source={{uri: ticket.movie.poster}} style={styles.poster} />
          <View style={styles.movieDetails}>
            <Typography variant="h2" color={colors.text} numberOfLines={2}>
              {ticket.movie.title}
            </Typography>
            <Typography variant="body" color={colors.textSecondary}>
              {ticket.movie.type} • {ticket.movie.duration} min
            </Typography>
            <Typography variant="body" color={colors.textSecondary}>
              {ticket.movie.rating}
            </Typography>
          </View>
        </View>

        {/* Session Info */}
        <View style={styles.section}>
          <Typography
            variant="h3"
            color={colors.text}
            style={styles.sectionTitle}>
            Session Details
          </Typography>
          <View style={styles.detailRow}>
            <Typography variant="body" color={colors.textSecondary}>
              Date & Time:
            </Typography>
            <Typography variant="body" color={colors.text}>
              {formatDateTime(ticket.session.date, ticket.session.startTime)}
            </Typography>
          </View>
          <View style={styles.detailRow}>
            <Typography variant="body" color={colors.textSecondary}>
              End Time:
            </Typography>
            <Typography variant="body" color={colors.text}>
              {formatEndTime(ticket.session.startTime, ticket.session.endTime)}
            </Typography>
          </View>
          <View style={styles.detailRow}>
            <Typography variant="body" color={colors.textSecondary}>
              Hall:
            </Typography>
            <Typography variant="body" color={colors.text}>
              Hall {ticket.session.hallId}
            </Typography>
          </View>
        </View>

        {/* Seat Info */}
        <View style={styles.section}>
          <Typography
            variant="h3"
            color={colors.text}
            style={styles.sectionTitle}>
            Seats
          </Typography>
          <View style={styles.seatsContainer}>
            {ticket.seats.map((seat, _index) => (
              <View key={seat.id} style={styles.seatBadge}>
                <Typography variant="body" color={colors.background}>
                  {seat.row}
                  {seat.number}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        {/* Food Items */}
        {ticket.bookingItems && ticket.bookingItems.length > 0 && (
          <View style={styles.section}>
            <Typography
              variant="h3"
              color={colors.text}
              style={styles.sectionTitle}>
              Food & Beverages
            </Typography>
            {ticket.bookingItems.map(item => (
              <View key={item.id} style={styles.detailRow}>
                <Typography variant="body" color={colors.textSecondary}>
                  {item.name} x{item.quantity}
                </Typography>
                <Typography variant="body" color={colors.text}>
                  RM{(item.price * item.quantity).toFixed(2)}
                </Typography>
              </View>
            ))}
          </View>
        )}

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.detailRow}>
            <Typography variant="h3" color={colors.text}>
              Total Paid:
            </Typography>
            <Typography variant="h3" color={colors.primary}>
              RM{ticket.totalAmount.toFixed(2)}
            </Typography>
          </View>
        </View>

        {/* QR Code Placeholder */}
        <View style={styles.qrSection}>
          <Typography
            variant="h3"
            color={colors.text}
            style={styles.sectionTitle}>
            Entry Code
          </Typography>
          <View style={styles.qrCode}>
            <Typography
              variant="body"
              color={colors.background}
              style={styles.qrText}>
              QR CODE
            </Typography>
            <Typography variant="caption" color={colors.textMuted}>
              {bookingId}
            </Typography>
          </View>
          <Typography
            variant="caption"
            color={colors.textSecondary}
            style={styles.qrInstructions}>
            Show this code at the cinema entrance
          </Typography>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button title="Back to Movies" onPress={handleMainMenu} size="large" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    marginTop: 16,
  },
  errorActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    width: '100%',
  },
  ticketContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ticketHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ticketTitle: {
    marginBottom: 8,
  },
  movieSection: {
    flexDirection: 'row',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  movieDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  section: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  seatBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  totalSection: {
    marginBottom: 24,
    paddingTop: 16,
  },
  qrSection: {
    alignItems: 'center',
    marginTop: 16,
  },
  qrCode: {
    width: 120,
    height: 120,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 16,
  },
  qrText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  qrInstructions: {
    textAlign: 'center',
    marginTop: 8,
  },
  actions: {
    marginTop: 16,
  },
});
