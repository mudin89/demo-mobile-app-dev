import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Typography, Button} from '../../components/atoms';
import {storageService} from '../../services/storage';
import {SavedTicket} from '../../types';
import {RootStackParamList} from '../../navigation/types';
import {colors} from '../../theme';

type TicketListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TicketView'
>;

export const TicketListScreen: React.FC = () => {
  const navigation = useNavigation<TicketListNavigationProp>();
  const [tickets, setTickets] = useState<SavedTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SavedTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'below25' | 'above25'
  >('all');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    console.log('🎫 TicketList: Loading saved tickets');
    setIsLoading(true);
    try {
      const savedTickets = await storageService.getSavedTickets();
      setTickets(savedTickets);
      setFilteredTickets(savedTickets);
      console.log('🎫 TicketList: Loaded', savedTickets.length, 'tickets');
    } catch (error) {
      console.error('❌ TicketList: Error loading tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilter = useCallback(
    (filterType: 'all' | 'below25' | 'above25') => {
      setActiveFilter(filterType);
      let filtered = tickets;

      switch (filterType) {
        case 'below25':
          filtered = tickets.filter(ticket => ticket.totalAmount < 25);
          break;
        case 'above25':
          filtered = tickets.filter(ticket => ticket.totalAmount >= 25);
          break;
        case 'all':
        default:
          filtered = tickets;
          break;
      }

      setFilteredTickets(filtered);
      console.log(
        `🎫 TicketList: Applied ${filterType} filter, showing ${filtered.length} tickets`,
      );
    },
    [tickets],
  );

  const handleTicketPress = useCallback(
    (ticket: SavedTicket) => {
      console.log('🎫 TicketList: Opening ticket:', ticket.bookingId);
      navigation.navigate('TicketView', {bookingId: ticket.bookingId});
    },
    [navigation],
  );

  const formatDateTime = (dateString: string, timeString: string) => {
    try {
      console.log('🗓️ Formatting date:', dateString, 'time:', timeString);

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
        return 'Invalid Date';
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
      console.log('🗓️ Formatted result:', formatted);
      return formatted;
    } catch (error) {
      console.error('Error formatting date/time:', error, 'inputs:', dateString, timeString);
      return 'Invalid Date';
    }
  };

  const renderTicketItem = ({item}: {item: SavedTicket}) => (
    <TouchableOpacity
      style={styles.ticketItem}
      onPress={() => handleTicketPress(item)}>
      <Image source={{uri: item.movie.poster}} style={styles.ticketPoster} />
      <View style={styles.ticketInfo}>
        <Typography variant="h3" color={colors.text} numberOfLines={1}>
          {item.movie.title}
        </Typography>
        <Typography variant="body" color={colors.textSecondary}>
          {formatDateTime(item.session.date, item.session.startTime)}
        </Typography>
        <Typography variant="body" color={colors.textSecondary}>
          Hall {item.session.hallId} • {item.seats.length} seat
          {item.seats.length > 1 ? 's' : ''}
        </Typography>
        <Typography
          variant="body"
          color={colors.primary}
          style={styles.ticketPrice}>
          RM{item.totalAmount.toFixed(2)}
        </Typography>
      </View>
      <View
        style={[
          styles.statusBadge,
          item.status === 'active' && styles.statusActive,
          item.status === 'used' && styles.statusUsed,
          item.status === 'expired' && styles.statusExpired,
        ]}>
        <Typography
          variant="caption"
          color={colors.text}
          style={styles.statusText}>
          {item.status.toUpperCase()}
        </Typography>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Typography variant="body" color={colors.textSecondary}>
          Loading tickets...
        </Typography>
      </View>
    );
  }

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <Button
        title="All"
        variant={activeFilter === 'all' ? 'primary' : 'outline'}
        size="small"
        onPress={() => applyFilter('all')}
        style={styles.filterButton}
      />
      <Button
        title="Below RM25"
        variant={activeFilter === 'below25' ? 'primary' : 'outline'}
        size="small"
        onPress={() => applyFilter('below25')}
        style={styles.filterButton}
      />
      <Button
        title="Above RM25"
        variant={activeFilter === 'above25' ? 'primary' : 'outline'}
        size="small"
        onPress={() => applyFilter('above25')}
        style={styles.filterButton}
      />
    </View>
  );

  if (tickets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Typography variant="h1" style={styles.title} color={colors.text}>
          My Tickets
        </Typography>
        <Typography
          variant="body"
          style={styles.subtitle}
          color={colors.textSecondary}>
          Your booked tickets will appear here
        </Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h1" style={styles.title} color={colors.text}>
          My Tickets
        </Typography>
        <Typography variant="body" color={colors.textSecondary}>
          {filteredTickets.length} of {tickets.length} ticket
          {tickets.length > 1 ? 's' : ''}
        </Typography>
      </View>
      {renderFilterButtons()}
      <FlatList
        data={filteredTickets}
        renderItem={renderTicketItem}
        keyExtractor={item => item.id}
        style={styles.ticketList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  ticketList: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  ticketItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ticketPoster: {
    width: 60,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },
  ticketInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  ticketPrice: {
    fontWeight: '600',
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusActive: {
    backgroundColor: colors.success,
  },
  statusUsed: {
    backgroundColor: colors.textMuted,
  },
  statusExpired: {
    backgroundColor: colors.error,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    flex: 1,
  },
});
