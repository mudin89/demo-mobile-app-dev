import React, {useState, useCallback} from 'react';
import {View, StyleSheet, Alert, Modal, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Typography, Button, Input} from '../../components/atoms';
import {PaymentCard} from '../../components/molecules';
import {BookingSummary as BookingSummaryComponent} from '../../components/organisms';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {clearBooking} from '../../store/slices/bookingSlice';
import {firestoreService} from '../../services/firestore';
import {storageService} from '../../services/storage';
import {RootStackParamList} from '../../navigation/types';
import {PaymentCard as PaymentCardType} from '../../types';
import {colors} from '../../theme';
import {debouncedNavigate, navigateToMain} from '../../utils/navigationHelpers';

type BookingSummaryNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BookingSummary'
>;

const USER_ID = 'user_123'; // In a real app, this would come from authentication

export const BookingSummaryScreen: React.FC = () => {
  const navigation = useNavigation<BookingSummaryNavigationProp>();
  const dispatch = useAppDispatch();

  const {
    selectedMovie,
    selectedSession,
    selectedSeats,
    bookingItems,
    totalAmount,
    serviceCharge,
  } = useAppSelector(state => state.booking);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentCards, setPaymentCards] = useState<PaymentCardType[]>([]);
  const [selectedCard, setSelectedCard] = useState<PaymentCardType | null>(
    null,
  );
  const [showAddCardForm, setShowAddCardForm] = useState(false);

  // New card form state
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    holder: '',
  });

  // Load saved payment cards
  React.useEffect(() => {
    loadPaymentCards();
  }, []);

  const loadPaymentCards = async () => {
    try {
      console.log('💳 BookingSummaryScreen: Loading saved payment cards');
      const cards = await storageService.getPaymentCards();
      console.log(
        '💳 BookingSummaryScreen: Found',
        cards.length,
        'saved payment cards',
      );
      setPaymentCards(cards);
      if (cards.length > 0) {
        setSelectedCard(cards[0]);
        console.log('💳 BookingSummaryScreen: Auto-selected first card');
      }
    } catch (error) {
      console.error(
        '❌ BookingSummaryScreen: Error loading payment cards:',
        error,
      );
    }
  };

  const handleAddCard = useCallback(async () => {
    // Validate card details
    if (!newCard.number || !newCard.expiry || !newCard.cvv || !newCard.holder) {
      Alert.alert('Error', 'Please fill in all card details.');
      return;
    }

    if (!storageService.validateExpiryDate(newCard.expiry)) {
      Alert.alert('Error', 'Please enter a valid expiry date (MM/YY).');
      return;
    }

    try {
      // Create masked card for storage (no CVV)
      const maskedCard = {
        maskedNumber: storageService.maskCardNumber(newCard.number),
        expiryDate: newCard.expiry,
        cardholderName: newCard.holder,
        type: storageService.getCardType(newCard.number),
      };

      await storageService.savePaymentCard(maskedCard);
      await loadPaymentCards();

      setShowAddCardForm(false);
      setNewCard({number: '', expiry: '', cvv: '', holder: ''});

      Alert.alert('Success', 'Payment card added successfully!');
    } catch (error) {
      console.error('Error adding payment card:', error);
      Alert.alert('Error', 'Failed to save payment card. Please try again.');
    }
  }, [newCard]);

  const handleDeleteCard = useCallback(
    async (cardId: string) => {
      try {
        const success = await storageService.deletePaymentCard(cardId);
        if (success) {
          await loadPaymentCards();
          if (selectedCard?.id === cardId) {
            setSelectedCard(null);
          }
        }
      } catch (error) {
        console.error('Error deleting payment card:', error);
        Alert.alert('Error', 'Failed to delete payment card.');
      }
    },
    [selectedCard],
  );

  const handleConfirmBooking = useCallback(async () => {
    // Comprehensive state validation
    if (!selectedMovie || !selectedSession || selectedSeats.length === 0) {
      console.error('❌ BookingSummaryScreen: Invalid booking state:', {
        hasMovie: !!selectedMovie,
        hasSession: !!selectedSession,
        seatCount: selectedSeats.length,
      });

      Alert.alert(
        'Booking Error',
        'Missing booking information. Please start the booking process again. ',
        [
          {
            text: 'Start Over',
            onPress: () => navigateToMain(navigation),
          },
        ],
      );
      return;
    }

    // Validate total amount
    if (!totalAmount || totalAmount <= 0) {
      Alert.alert(
        'Payment Error',
        'Invalid total amount. Please review your booking.',
        [
          {
            text: 'OK',
            onPress: () => console.log('Invalid amount acknowledged'),
          },
        ],
      );
      return;
    }

    console.log(
      '💰 BookingSummaryScreen: Proceeding to payment with total:',
      totalAmount,
    );

    debouncedNavigate(navigation, 'PaymentMethod', {totalAmount});
  }, [selectedMovie, selectedSession, selectedSeats, totalAmount, navigation]);

  const processPayment = useCallback(async () => {
    if (!selectedCard) {
      Alert.alert('Error', 'Please select a payment method.');
      return;
    }

    setIsProcessing(true);

    try {
      console.log(
        '💰 BookingSummaryScreen: Processing payment with card:',
        selectedCard?.maskedNumber,
      );
      console.log(
        '🎫 BookingSummaryScreen: Confirming booking for',
        selectedSeats.length,
        'seats',
      );

      // First, extend seat locks for payment duration to prevent expiration
      console.log(
        '🔄 BookingSummaryScreen: Extending seat locks for payment...',
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
          '❌ BookingSummaryScreen: Failed to extend locks for seats:',
          failedLocks.map(s => s.id),
        );
        throw new Error(
          'Some seat locks could not be extended. Please try again.',
        );
      }

      console.log(
        '✅ BookingSummaryScreen: All seat locks extended for payment',
      );

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Confirm seat bookings in Firestore
      console.log('🎯 BookingSummaryScreen: Confirming seat bookings...');
      const confirmationPromises = selectedSeats.map(seat =>
        firestoreService.confirmSeatBooking(seat.id, USER_ID),
      );

      const results = await Promise.all(confirmationPromises);
      const allSuccessful = results.every(result => result);

      if (!allSuccessful) {
        const failedSeats = selectedSeats.filter((_, index) => !results[index]);
        console.error(
          '❌ BookingSummaryScreen: Failed to confirm bookings for seats:',
          failedSeats.map(s => s.id),
        );
        throw new Error('Failed to confirm some seat bookings');
      }

      console.log('✅ BookingSummaryScreen: Payment processed successfully');
      console.log('✅ BookingSummaryScreen: All seats confirmed');

      // Clear booking state first
      dispatch(clearBooking());

      // Then update UI state
      setShowPaymentModal(false);
      setIsProcessing(false);

      // Finally navigate
      Alert.alert(
        'Booking Confirmed!',
        'Your movie tickets have been booked successfully. Enjoy your movie!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Use navigateToMain helper for consistent navigation
              navigateToMain(navigation);
            },
          },
        ],
      );
    } catch (error) {
      console.error(
        '❌ BookingSummaryScreen: Error processing payment:',
        error,
      );
      setIsProcessing(false);
      Alert.alert(
        'Booking Failed',
        'There was an error processing your booking. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => setShowPaymentModal(false),
          },
        ],
      );
    }
  }, [selectedCard, selectedSeats, dispatch, navigation]);

  const renderPaymentModal = () => (
    <Modal
      visible={showPaymentModal}
      animationType="slide"
      presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Typography variant="h2">Payment</Typography>
          <Button
            title="Cancel"
            variant="outline"
            size="small"
            onPress={() => setShowPaymentModal(false)}
          />
        </View>

        <ScrollView style={styles.modalContent}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Select Payment Method
          </Typography>

          {paymentCards.map(card => (
            <PaymentCard
              key={card.id}
              card={card}
              isSelected={selectedCard?.id === card.id}
              onPress={setSelectedCard}
              onDelete={handleDeleteCard}
            />
          ))}

          {!showAddCardForm ? (
            <Button
              title="Add New Card"
              variant="outline"
              onPress={() => setShowAddCardForm(true)}
              style={styles.addCardButton}
            />
          ) : (
            <View style={styles.addCardForm}>
              <Typography variant="h3" style={styles.formTitle}>
                Add New Card
              </Typography>

              <Input
                label="Card Number"
                value={newCard.number}
                onChangeText={text =>
                  setNewCard(prev => ({...prev, number: text}))
                }
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
              />

              <Input
                label="Expiry Date"
                value={newCard.expiry}
                onChangeText={text =>
                  setNewCard(prev => ({...prev, expiry: text}))
                }
                placeholder="MM/YY"
                keyboardType="numeric"
              />

              <Input
                label="CVV"
                value={newCard.cvv}
                onChangeText={text =>
                  setNewCard(prev => ({...prev, cvv: text}))
                }
                placeholder="123"
                keyboardType="numeric"
                secureTextEntry
              />

              <Input
                label="Cardholder Name"
                value={newCard.holder}
                onChangeText={text =>
                  setNewCard(prev => ({...prev, holder: text}))
                }
                placeholder="John Doe"
              />

              <View style={styles.formButtons}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => {
                    setShowAddCardForm(false);
                    setNewCard({number: '', expiry: '', cvv: '', holder: ''});
                  }}
                  style={styles.formButton}
                />
                <Button
                  title="Add Card"
                  onPress={handleAddCard}
                  style={styles.formButton}
                />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.modalFooter}>
          <Typography
            variant="h3"
            color={colors.primary}
            style={styles.totalText}>
            Total: RM{totalAmount.toFixed(2)}
          </Typography>
          <Button
            title={isProcessing ? 'Processing...' : 'Pay Now'}
            onPress={processPayment}
            disabled={!selectedCard || isProcessing}
            size="large"
          />
        </View>
      </View>
    </Modal>
  );

  if (!selectedMovie || !selectedSession) {
    return (
      <View style={styles.errorContainer}>
        <Typography variant="h2" color={colors.textSecondary}>
          No booking information found
        </Typography>
        <Button
          title="Start Over"
          onPress={() => navigateToMain(navigation)}
          style={styles.startOverButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BookingSummaryComponent
        movie={selectedMovie}
        session={selectedSession}
        seats={selectedSeats}
        bookingItems={bookingItems}
        totalAmount={totalAmount}
        serviceCharge={serviceCharge}
        onConfirmBooking={handleConfirmBooking}
        isProcessing={isProcessing}
      />
      {renderPaymentModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  startOverButton: {
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  addCardButton: {
    marginTop: 16,
  },
  addCardForm: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  formTitle: {
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  formButton: {
    flex: 0.48,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  totalText: {
    textAlign: 'center',
    marginBottom: 16,
  },
});
