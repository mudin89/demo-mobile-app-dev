import React, {useState, useCallback, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Switch, TouchableOpacity} from 'react-native';
import {Typography} from '../atoms/Typography';
import {Button} from '../atoms/Button';
import {Input} from '../atoms/Input';
import {PriceDisplay} from '../atoms/PriceDisplay';
import {PaymentMethodType} from '../molecules/PaymentMethodCard';
import {storageService} from '../../services/storage';
import {PaymentCard} from '../../types';
import {colors} from '../../theme/colors';

interface PaymentFormProps {
  paymentMethod: PaymentMethodType;
  totalAmount: number;
  onPayment: (paymentData: any) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentMethod,
  totalAmount,
  onPayment,
  isLoading = false,
  disabled = false,
}) => {
  // Saved cards state
  const [savedCards, setSavedCards] = useState<PaymentCard[]>([]);
  const [selectedSavedCard, setSelectedSavedCard] = useState<PaymentCard | null>(null);
  const [useNewCard, setUseNewCard] = useState(false);

  // Card payment state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  // Bank transfer state
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');

  // Crypto wallet state
  const [walletAddress, setWalletAddress] = useState('');
  const [walletType, setWalletType] = useState('');

  const validateCardPayment = useCallback(() => {
    return (
      cardNumber.length >= 16 &&
      expiryDate.length >= 5 &&
      cvv.length >= 3 &&
      cardHolder.trim() !== ''
    );
  }, [cardNumber, expiryDate, cvv, cardHolder]);

  const validateBankTransfer = useCallback(() => {
    return (
      accountNumber.length >= 10 &&
      bankName.trim() !== '' &&
      accountName.trim() !== ''
    );
  }, [accountNumber, bankName, accountName]);

  const validateCryptoPayment = useCallback(() => {
    return walletAddress.trim() !== '' && walletType.trim() !== '';
  }, [walletAddress, walletType]);

  const isFormValid = useCallback(() => {
    switch (paymentMethod) {
      case 'card':
        // If a saved card is selected, it's valid
        if (selectedSavedCard) {
          return true;
        }
        // Otherwise validate new card input
        return validateCardPayment();
      case 'bank':
        return validateBankTransfer();
      case 'crypto':
        return validateCryptoPayment();
      default:
        return false;
    }
  }, [
    paymentMethod,
    selectedSavedCard,
    validateCardPayment,
    validateBankTransfer,
    validateCryptoPayment,
  ]);

  const handlePayment = useCallback(async () => {
    if (!isFormValid()) {
      console.warn('💳 PaymentForm: Form is not valid, cannot process payment');
      return;
    }

    let paymentData: any = {
      method: paymentMethod,
      amount: totalAmount,
    };

    switch (paymentMethod) {
      case 'card':
        if (selectedSavedCard) {
          // Use saved card data
          paymentData = {
            ...paymentData,
            cardId: selectedSavedCard.id,
            cardNumber: selectedSavedCard.maskedNumber,
            expiryDate: selectedSavedCard.expiryDate,
            cardHolder: selectedSavedCard.cardholderName,
            cardType: selectedSavedCard.type,
            isStoredCard: true,
          };
        } else {
          // Use new card data
          paymentData = {
            ...paymentData,
            cardNumber: cardNumber.replace(/\s/g, ''),
            expiryDate,
            cvv,
            cardHolder,
            saveCard,
            isStoredCard: false,
          };
        }
        break;
      case 'bank':
        paymentData = {
          ...paymentData,
          accountNumber,
          bankName,
          accountName,
        };
        break;
      case 'crypto':
        paymentData = {
          ...paymentData,
          walletAddress,
          walletType,
        };
        break;
    }

    // Save new card if requested
    if (paymentMethod === 'card' && !selectedSavedCard && saveCard) {
      try {
        const cardToSave: Omit<PaymentCard, 'id'> = {
          maskedNumber: storageService.maskCardNumber(cardNumber.replace(/\s/g, '')),
          expiryDate,
          cardholderName: cardHolder,
          type: storageService.getCardType(cardNumber.replace(/\s/g, '')),
        };

        const cardId = await storageService.savePaymentCard(cardToSave);
        console.log('💳 PaymentForm: Saved new card with ID:', cardId);

        // Reload saved cards
        const updatedCards = await storageService.getPaymentCards();
        setSavedCards(updatedCards);
      } catch (error) {
        console.error('💳 PaymentForm: Error saving card:', error);
      }
    }

    console.log('💳 PaymentForm: Processing payment:', paymentData);
    onPayment(paymentData);
  }, [
    paymentMethod,
    totalAmount,
    cardNumber,
    expiryDate,
    cvv,
    cardHolder,
    saveCard,
    accountNumber,
    bankName,
    accountName,
    walletAddress,
    walletType,
    onPayment,
    isFormValid,
  ]);

  const formatCardNumber = (text: string) => {
    // Only allow numbers (remove all non-numeric characters)
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // Limit to 16 digits + spaces
  };

  const formatCardHolderName = (text: string) => {
    // Only allow alphanumeric characters (letters and numbers, no special symbols)
    return text.replace(/[^a-zA-Z0-9\s]/g, '');
  };

  const formatCVV = (text: string) => {
    // Only allow numbers for CVV
    return text.replace(/\D/g, '');
  };

  const formatExpiryDate = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');

    // If empty, return empty string (allows complete clearing)
    if (cleaned.length === 0) {
      return '';
    }

    // If less than 2 digits, return as is
    if (cleaned.length <= 2) {
      return cleaned;
    }

    // If 3 or more digits, format as MM/YY
    return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
  };

  // Load saved cards on mount
  useEffect(() => {
    const loadSavedCards = async () => {
      try {
        const cards = await storageService.getPaymentCards();
        setSavedCards(cards);
        console.log('💳 PaymentForm: Loaded', cards.length, 'saved cards');
      } catch (error) {
        console.error('💳 PaymentForm: Error loading saved cards:', error);
      }
    };

    loadSavedCards();
  }, []);

  const handleSavedCardSelect = (card: PaymentCard) => {
    setSelectedSavedCard(card);
    setUseNewCard(false);
    // Clear new card form
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardHolder('');
    console.log('💳 PaymentForm: Selected saved card:', card.id);
  };

  const handleUseNewCard = () => {
    setUseNewCard(true);
    setSelectedSavedCard(null);
    console.log('💳 PaymentForm: Switched to new card');
  };

  const renderSavedCards = () => {
    if (savedCards.length === 0) return null;

    return (
      <View style={styles.savedCardsContainer}>
        <Typography variant="h3" style={styles.formTitle}>
          Saved Cards
        </Typography>

        {savedCards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.savedCardItem,
              selectedSavedCard?.id === card.id && styles.selectedCardItem,
            ]}
            onPress={() => handleSavedCardSelect(card)}
            disabled={disabled}>
            <View style={styles.cardInfo}>
              <Typography variant="body" style={styles.cardBrand}>
                {card.type.toUpperCase()}
              </Typography>
              <Typography variant="body" style={styles.cardNumber}>
                •••• •••• •••• {card.maskedNumber}
              </Typography>
              <Typography variant="caption" color={colors.textMuted}>
                {card.cardholderName}
              </Typography>
            </View>
            {selectedSavedCard?.id === card.id && (
              <View style={styles.selectedIndicator}>
                <Typography style={styles.checkmark}>✓</Typography>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.newCardButton}
          onPress={handleUseNewCard}
          disabled={disabled}>
          <Typography variant="body" style={styles.newCardText}>
            + Use New Card
          </Typography>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCardForm = () => (
    <View style={styles.formContainer}>
      <Typography variant="h3" style={styles.formTitle}>
        Card Details
      </Typography>

      <Input
        label="Card number"
        value={cardNumber}
        onChangeText={text => setCardNumber(formatCardNumber(text))}
        placeholder="Enter card number"
        keyboardType="numeric"
        editable={!disabled}
      />

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Input
            label="Expiry date"
            value={expiryDate}
            onChangeText={text => setExpiryDate(formatExpiryDate(text))}
            placeholder="MM/YY"
            keyboardType="numeric"
            editable={!disabled}
          />
        </View>
        <View style={styles.halfWidth}>
          <Input
            label="CVV2"
            value={cvv}
            onChangeText={text => setCvv(formatCVV(text))}
            placeholder="Enter CVV"
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            editable={!disabled}
          />
        </View>
      </View>

      <Input
        label="Card holder name"
        value={cardHolder}
        onChangeText={text => setCardHolder(formatCardHolderName(text))}
        placeholder="Enter cardholder name"
        editable={!disabled}
      />

      <View style={styles.switchContainer}>
        <Typography variant="body" color={colors.titlePrimary}>
          Save card info for future transactions
        </Typography>
        <Switch
          value={saveCard}
          onValueChange={setSaveCard}
          disabled={disabled}
          trackColor={{false: colors.border, true: colors.primary}}
          thumbColor={saveCard ? colors.text : colors.textMuted}
        />
      </View>
    </View>
  );

  const renderBankForm = () => (
    <View style={styles.formContainer}>
      <Typography variant="h3" style={styles.formTitle}>
        Bank Transfer Details
      </Typography>

      <Input
        label="Account Number"
        value={accountNumber}
        onChangeText={setAccountNumber}
        placeholder="Enter account number"
        keyboardType="numeric"
        editable={!disabled}
      />

      <Input
        label="Bank Name"
        value={bankName}
        onChangeText={setBankName}
        placeholder="Enter bank name"
        editable={!disabled}
      />

      <Input
        label="Account Name"
        value={accountName}
        onChangeText={setAccountName}
        placeholder="Enter account name"
        editable={!disabled}
      />
    </View>
  );

  const renderCryptoForm = () => (
    <View style={styles.formContainer}>
      <Typography variant="h3" style={styles.formTitle}>
        Crypto Wallet Details
      </Typography>

      <Input
        label="Wallet Type"
        value={walletType}
        onChangeText={setWalletType}
        placeholder="e.g., Bitcoin, Ethereum"
        editable={!disabled}
      />

      <Input
        label="Wallet Address"
        value={walletAddress}
        onChangeText={setWalletAddress}
        placeholder="Enter wallet address"
        editable={!disabled}
      />
    </View>
  );

  const renderForm = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <View>
            {renderSavedCards()}
            {(useNewCard || savedCards.length === 0) && renderCardForm()}
          </View>
        );
      case 'bank':
        return renderBankForm();
      case 'crypto':
        return renderCryptoForm();
      default:
        return null;
    }
  };

  const getMethodTitle = () => {
    switch (paymentMethod) {
      case 'card':
        return 'Card payment';
      case 'bank':
        return 'Bank Transfer';
      case 'crypto':
        return 'Crypto Payment';
      default:
        return 'Payment';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h2" style={styles.title}>
            {getMethodTitle()}
          </Typography>
          <Typography
            variant="body"
            color={colors.textLight}
            style={styles.subtitle}>
            Please enter your {paymentMethod} details
          </Typography>
        </View>

        {/* Form */}
        {renderForm()}

        {/* Total Amount */}
        <View style={styles.totalContainer}>
          <View style={styles.totalRow}>
            <Typography variant="body" style={styles.totalLabel}>
              Total Amount
            </Typography>
            <PriceDisplay
              price={totalAmount}
              size="large"
              variant="highlighted"
            />
          </View>
        </View>
      </ScrollView>

      {/* Payment Button */}
      <View style={styles.footer}>
        <Button
          title={`Pay RM${totalAmount.toFixed(0)}`}
          onPress={handlePayment}
          disabled={!isFormValid() || disabled}
          loading={isLoading}
          size="large"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    color: colors.titlePrimary,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textLight,
  },
  formContainer: {
    marginBottom: 24,
  },
  formTitle: {
    color: colors.titlePrimary,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
  },
  totalContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: colors.titlePrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  savedCardsContainer: {
    marginBottom: 24,
  },
  savedCardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  selectedCardItem: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  cardInfo: {
    flex: 1,
  },
  cardBrand: {
    color: colors.titlePrimary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardNumber: {
    color: colors.titlePrimary,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  newCardButton: {
    padding: 16,
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  newCardText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
});
