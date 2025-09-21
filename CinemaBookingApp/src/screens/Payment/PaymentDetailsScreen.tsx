import React, {useState, useCallback} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {PaymentForm} from '../../components/organisms/PaymentForm';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {clearBooking} from '../../store/slices/bookingSlice';
import {storageService} from '../../services/storage';
import {firestoreService} from '../../services/firestore';
import {RootStackParamList} from '../../navigation/types';
import {colors} from '../../theme';

type PaymentDetailsRouteProp = RouteProp<RootStackParamList, 'PaymentDetails'>;
type PaymentDetailsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PaymentDetails'
>;

const USER_ID = 'user_123'; // In a real app, this would come from authentication

export const PaymentDetailsScreen: React.FC = () => {
  const route = useRoute<PaymentDetailsRouteProp>();
  const navigation = useNavigation<PaymentDetailsNavigationProp>();
  const dispatch = useAppDispatch();
  const {paymentMethod, totalAmount} = route.params;

  // Get current booking data from Redux
  const {
    selectedMovie,
    selectedSession,
    selectedSeats,
    bookingItems,
    serviceCharge,
  } = useAppSelector(state => state.booking);

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = useCallback(
    async (paymentData: any) => {
      console.log('💳 PaymentDetailsScreen: Processing payment:', paymentData);
      setIsProcessing(true);

      try {
        // First, extend seat locks for payment duration to prevent expiration
        console.log(
          '🔄 PaymentDetailsScreen: Extending seat locks for payment...',
        );
        const lockExtensionPromises = selectedSeats.map(seat =>
          firestoreService.extendSeatLockForPayment(seat.id, USER_ID),
        );

        const lockResults = await Promise.all(lockExtensionPromises);
        const allLocksExtended = lockResults.every(result => result);

        if (!allLocksExtended) {
          const failedLocks = selectedSeats.filter(
            (_, index) => !lockResults[index],
          );
          console.error(
            '❌ PaymentDetailsScreen: Failed to extend locks for seats:',
            failedLocks.map(s => s.id),
          );
          throw new Error(
            'Some seat locks could not be extended. Please try booking again.',
          );
        }

        console.log(
          '✅ PaymentDetailsScreen: All seat locks extended for payment',
        );

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Generate a booking ID
        const bookingId = `BK${Date.now()}`;
        console.log(
          '✅ PaymentDetailsScreen: Payment successful, booking ID:',
          bookingId,
        );

        // Confirm seat bookings (mark as permanently purchased)
        if (selectedSeats.length > 0) {
          console.log(
            `🪑 PaymentDetailsScreen: Confirming seat bookings for ${selectedSeats.length} seats...`,
          );
          console.log(
            '🪑 PaymentDetailsScreen: Selected seat IDs:',
            selectedSeats.map(s => s.id),
          );
          console.log(
            '🪑 PaymentDetailsScreen: Selected seat locks:',
            selectedSeats.map(
              s =>
                `${s.id}: lockedBy=${s.lockedBy}, lockedUntil=${s.lockedUntil}`,
            ),
          );

          // Process all seat confirmations in parallel for better reliability
          const confirmationPromises = selectedSeats.map((seat, index) => {
            console.log(
              `🔄 PaymentDetailsScreen: Starting confirmation for seat ${
                index + 1
              }/${selectedSeats.length}: ${seat.id}`,
            );
            return firestoreService.confirmSeatBooking(seat.id, USER_ID);
          });

          const confirmationResults = await Promise.all(confirmationPromises);
          console.log(
            '🪑 PaymentDetailsScreen: All confirmation promises completed',
          );

          // Log results for each seat
          const failedSeats: string[] = [];
          selectedSeats.forEach((seat, index) => {
            const confirmed = confirmationResults[index];
            console.log(
              `🪑 PaymentDetailsScreen: Seat ${seat.id} confirmation:`,
              confirmed ? '✅ SUCCESS' : '❌ FAILED',
            );
            if (!confirmed) {
              failedSeats.push(seat.id);
            }
          });

          // Check if all confirmations were successful
          const allConfirmed = confirmationResults.every(
            result => result === true,
          );
          if (!allConfirmed) {
            console.error(
              '❌ PaymentDetailsScreen: Some seat confirmations failed:',
              failedSeats,
            );
            // Continue with payment but log the issue
          } else {
            console.log(
              '✅ PaymentDetailsScreen: All seats confirmed successfully',
            );
          }
        }

        // Save ticket before clearing booking state
        if (selectedMovie && selectedSession && selectedSeats.length > 0) {
          await storageService.saveTicket({
            bookingId,
            movie: selectedMovie,
            session: selectedSession,
            seats: selectedSeats,
            bookingItems: bookingItems || [],
            totalAmount,
            serviceCharge: serviceCharge || 0,
            bookingDate: new Date().toISOString(),
            status: 'active',
          });
          console.log('💾 PaymentDetailsScreen: Ticket saved successfully');
        }

        // Clear booking state
        dispatch(clearBooking());

        // Navigate to confirmation screen
        navigation.navigate('BookingConfirmation', {
          bookingId,
        });
      } catch (error) {
        console.error('❌ PaymentDetailsScreen: Payment failed:', error);
        setIsProcessing(false);
        Alert.alert(
          'Payment Failed',
          'There was an error processing your payment. Please try again.',
          [
            {
              text: 'OK',
              onPress: () => console.log('Payment error acknowledged'),
            },
          ],
        );
      }
    },
    [
      dispatch,
      navigation,
      selectedMovie,
      selectedSession,
      selectedSeats,
      bookingItems,
      totalAmount,
      serviceCharge,
    ],
  );

  return (
    <View style={styles.container}>
      <PaymentForm
        paymentMethod={paymentMethod}
        totalAmount={totalAmount}
        onPayment={handlePayment}
        isLoading={isProcessing}
        disabled={isProcessing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
