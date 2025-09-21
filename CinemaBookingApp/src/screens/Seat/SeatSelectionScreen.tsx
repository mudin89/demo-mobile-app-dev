import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Alert, BackHandler} from 'react-native';
import {
  useRoute,
  useNavigation,
  RouteProp,
  useFocusEffect,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Typography, Button} from '../../components/atoms';
import {SeatMap} from '../../components/organisms';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {toggleSeat, clearSeatsOnly} from '../../store/slices/bookingSlice';
import {firestoreService} from '../../services/firestore';
import {RootStackParamList} from '../../navigation/types';
import {Seat} from '../../types';
import {colors} from '../../theme';

type SeatSelectionRouteProp = RouteProp<RootStackParamList, 'SeatSelection'>;
type SeatSelectionNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SeatSelection'
>;

const USER_ID = 'user_123'; // In a real app, this would come from authentication

export const SeatSelectionScreen: React.FC = () => {
  const route = useRoute<SeatSelectionRouteProp>();
  const navigation = useNavigation<SeatSelectionNavigationProp>();
  const dispatch = useAppDispatch();

  const {session} = route.params;
  const {selectedSeats} = useAppSelector(state => state.booking);

  const [seats, setSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load seats and subscribe to real-time updates
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const loadSeats = async () => {
      try {
        console.log(
          '🪑 SeatSelectionScreen: Loading seats for session:',
          session.id,
        );
        setIsLoading(true);

        // Subscribe to real-time seat updates
        unsubscribe = firestoreService.subscribeToSeats(
          session.id,
          updatedSeats => {
            console.log(
              '🪑 SeatSelectionScreen: Received seat updates:',
              updatedSeats.length,
              'seats',
            );
            setSeats(updatedSeats);
            setIsLoading(false);
          },
        );

        // Clean up expired locks
        console.log('🧹 SeatSelectionScreen: Cleaning up expired seat locks');
        await firestoreService.cleanupExpiredLocks();
      } catch (error) {
        console.error('❌ SeatSelectionScreen: Error loading seats:', error);
        setIsLoading(false);
        Alert.alert('Error', 'Failed to load seats. Please try again.');
      }
    };

    loadSeats();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      console.log(
        '🧹 SeatSelectionScreen: Cleanup triggered - component unmounting',
      );
      // Note: We don't unlock seats here anymore to prevent race conditions
      // Seats will be unlocked by:
      // 1. handleGoBack() when user explicitly goes back
      // 2. Payment process after successful booking
      // 3. cleanupExpiredLocks() for expired locks
    };
  }, [session.id]);

  const handleGoBack = useCallback(async () => {
    console.log(
      '🪑 SeatSelectionScreen: User exiting, clearing seat selection',
    );

    // Unlock all selected seats
    const unlockPromises = selectedSeats.map(seat =>
      firestoreService.unlockSeat(seat.id, USER_ID),
    );

    try {
      await Promise.all(unlockPromises);
      console.log('🪑 SeatSelectionScreen: All seats unlocked successfully');
    } catch (error) {
      console.error('❌ SeatSelectionScreen: Error unlocking seats:', error);
    }

    // Clear seat selection from Redux
    dispatch(clearSeatsOnly());

    // Navigate back
    navigation.goBack();
  }, [selectedSeats, dispatch, navigation]);

  // Handle back button and navigation cleanup
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleGoBack();
        return true; // Prevent default back action
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription?.remove();
    }, [handleGoBack]),
  );

  const handleSeatPress = useCallback(
    async (seat: Seat) => {
      // Check if seat is already selected by this user
      const isCurrentlySelected = selectedSeats.some(s => s.id === seat.id);

      if (isCurrentlySelected) {
        // Unlock and deselect seat
        console.log(`🪑 SeatSelectionScreen: Unlocking seat ${seat.id}`);
        const success = await firestoreService.unlockSeat(seat.id, USER_ID);
        if (success) {
          // Create serializable seat object for Redux
          const serializableSeat: any = {
            ...seat,
            lockedUntil:
              seat.lockedUntil instanceof Date
                ? seat.lockedUntil.toISOString()
                : seat.lockedUntil,
          };
          dispatch(toggleSeat(serializableSeat));
          console.log(
            `✅ SeatSelectionScreen: Seat ${seat.id} unlocked and removed from selection`,
          );
        } else {
          console.error(
            `❌ SeatSelectionScreen: Failed to unlock seat ${seat.id}`,
          );
          Alert.alert('Error', 'Failed to release seat. Please try again.');
        }
      } else {
        // Try to lock and select seat
        console.log(
          `🪑 SeatSelectionScreen: Attempting to lock seat ${seat.id}`,
        );
        const success = await firestoreService.lockSeat(seat.id, USER_ID);
        if (success) {
          // Create serializable seat object for Redux
          const serializableSeat: any = {
            ...seat,
            lockedUntil:
              seat.lockedUntil instanceof Date
                ? seat.lockedUntil.toISOString()
                : seat.lockedUntil,
            isSelected: true, // Ensure isSelected is set
          };
          dispatch(toggleSeat(serializableSeat));
          console.log(
            `✅ SeatSelectionScreen: Seat ${seat.id} locked and added to selection`,
          );
        } else {
          console.error(
            `❌ SeatSelectionScreen: Failed to lock seat ${seat.id}`,
          );
          Alert.alert(
            'Seat Unavailable',
            'This seat is currently being selected by another user. Please choose a different seat.',
          );
        }
      }
    },
    [selectedSeats, dispatch],
  );

  const handleContinue = useCallback(() => {
    if (selectedSeats.length === 0) {
      Alert.alert(
        'No Seats Selected',
        'Please select at least one seat to continue.',
      );
      return;
    }

    console.log(
      '🪑 SeatSelectionScreen: Seats selected, asking about food & beverages',
    );

    // Decision point from flow diagram: "Select Food & Bev.?"
    // Automatically proceed to food selection
    console.log('🪑 SeatSelectionScreen: Proceeding to food selection');
    navigation.navigate('FoodSelection');
  }, [selectedSeats.length, navigation]);

  const totalPrice = selectedSeats.reduce(
    (total, seat) => total + seat.price,
    0,
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Typography variant="body" color={colors.textSecondary}>
          Loading seats...
        </Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Progress Indicators */}
      <View style={styles.header}>
        <View style={styles.progressIndicators}>
          <View style={styles.progressStep} />
          <View style={styles.progressStep} />
          <View style={styles.progressStepActive} />
        </View>
        <Typography variant="h2" color={colors.text} style={styles.title}>
          Ticket Booking
        </Typography>
      </View>

      {/* Select Seat Section */}
      <View style={styles.selectSeatSection}>
        <Typography variant="h3" color={colors.text} style={styles.subtitle}>
          Select Seat
        </Typography>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.availableSeat]} />
            <Typography variant="caption" color={colors.textSecondary}>
              Available
            </Typography>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.unavailableSeat]}>
              <Typography
                variant="caption"
                color={colors.text}
                style={styles.unavailableIcon}>
                ✕
              </Typography>
            </View>
            <Typography variant="caption" color={colors.textSecondary}>
              Unavailable
            </Typography>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.selectedSeat]} />
            <Typography variant="caption" color={colors.textSecondary}>
              Selected
            </Typography>
          </View>
        </View>

        {/* Screen */}
        <View style={styles.screenContainer}>
          <View style={styles.screen} />
          <Typography
            variant="body"
            color={colors.textSecondary}
            style={styles.screenLabel}>
            Screen
          </Typography>
        </View>

        {/* Seat Map */}
        <View style={styles.seatMapContainer}>
          <SeatMap
            seats={seats}
            selectedSeats={selectedSeats}
            onSeatPress={handleSeatPress}
            userId={USER_ID}
          />
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.footer}>
        {/* Selected Seats Display */}
        {selectedSeats.length > 0 && (
          <View style={styles.selectedSeatsCard}>
            <View style={styles.seatDisplay}>
              <Typography
                variant="body"
                color={colors.text}
                style={styles.seatLabel}>
                SEAT
              </Typography>
              <View style={styles.seatNumbers}>
                {selectedSeats.map((seat, _index) => (
                  <View key={seat.id} style={styles.seatNumber}>
                    <Typography variant="body" color={colors.text}>
                      {seat.row}
                      {seat.number}
                    </Typography>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.priceDisplay}>
              <Typography
                variant="body"
                color={colors.text}
                style={styles.priceLabel}>
                SUB-TOTAL
              </Typography>
              <Typography
                variant="h3"
                color={colors.text}
                style={styles.priceAmount}>
                RM{totalPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Typography>
            </View>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <Button
            title="Cancel"
            onPress={handleGoBack}
            variant="outline"
            size="large"
            style={styles.cancelButton}
          />
          <Button
            title="Proceed"
            onPress={handleContinue}
            disabled={selectedSeats.length === 0}
            size="large"
            style={styles.proceedButton}
          />
        </View>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  header: {
    padding: 16,
    backgroundColor: colors.headerBackground,
    alignItems: 'center',
  },
  progressIndicators: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  progressStep: {
    width: 60,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  progressStepActive: {
    width: 60,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  title: {
    textAlign: 'center',
  },
  selectSeatSection: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  legendItem: {
    alignItems: 'center',
    gap: 8,
  },
  legendSeat: {
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableSeat: {
    backgroundColor: colors.textSecondary,
  },
  unavailableSeat: {
    backgroundColor: colors.textSecondary,
  },
  selectedSeat: {
    backgroundColor: colors.primary,
  },
  unavailableIcon: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  screenContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  screen: {
    width: 200,
    height: 20,
    backgroundColor: colors.textSecondary,
    borderRadius: 10,
    marginBottom: 8,
  },
  screenLabel: {
    textAlign: 'center',
  },
  seatMapContainer: {
    flex: 1,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.background,
  },
  selectedSeatsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  seatDisplay: {
    flex: 1,
  },
  seatLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  seatNumbers: {
    flexDirection: 'row',
    gap: 8,
  },
  seatNumber: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceDisplay: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  proceedButton: {
    flex: 1,
  },
});
