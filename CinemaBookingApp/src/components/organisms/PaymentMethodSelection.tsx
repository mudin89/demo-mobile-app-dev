import React, {useState, useCallback} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Typography} from '../atoms/Typography';
import {Button} from '../atoms/Button';
import {PriceDisplay} from '../atoms/PriceDisplay';
import {
  PaymentMethodCard,
  PaymentMethodType,
} from '../molecules/PaymentMethodCard';
import {colors} from '../../theme/colors';

interface PaymentMethodSelectionProps {
  totalAmount: number;
  onContinue: (paymentMethod: PaymentMethodType) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const PAYMENT_METHODS = [
  {
    type: 'card' as PaymentMethodType,
    title: 'Debit card',
    subtitle: 'Pay with 💳 VISA',
    icon: '💳',
  },
  {
    type: 'bank' as PaymentMethodType,
    title: 'Bank Transfer',
    subtitle: 'Make a transfer from your bank account',
    icon: '🏦',
  },
  {
    type: 'crypto' as PaymentMethodType,
    title: 'Crypto wallets',
    subtitle: 'Pay from your cryptocurrency wallet',
    icon: '🪙',
  },
];

export const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  totalAmount,
  onContinue,
  isLoading = false,
  disabled = false,
}) => {
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethodType | null>(null);

  const handleMethodSelect = useCallback((method: PaymentMethodType) => {
    console.log('💰 PaymentMethodSelection: Method selected:', method);
    setSelectedMethod(method);
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedMethod) {
      console.log(
        '💰 PaymentMethodSelection: Continuing with method:',
        selectedMethod,
      );
      onContinue(selectedMethod);
    }
  }, [selectedMethod, onContinue]);

  const canContinue = selectedMethod !== null && !disabled && !isLoading;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h2" style={styles.title}>
            Payment
          </Typography>
          <Typography
            variant="body"
            color={colors.textSecondary}
            style={styles.subtitle}>
            How would you like to make the payment? Kindly select your preferred
            option
          </Typography>
        </View>

        {/* Payment Methods */}
        <View style={styles.methodsContainer}>
          {PAYMENT_METHODS.map(method => (
            <PaymentMethodCard
              key={method.type}
              method={method}
              isSelected={selectedMethod === method.type}
              onPress={handleMethodSelect}
              disabled={disabled}
            />
          ))}
        </View>

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

      {/* Continue Button */}
      <View style={styles.footer}>
        <Button
          title={
            selectedMethod
              ? `Pay RM${totalAmount.toFixed(0)}`
              : 'Select Payment Method'
          }
          onPress={handleContinue}
          disabled={!canContinue}
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
    lineHeight: 20,
  },
  methodsContainer: {
    marginBottom: 24,
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
});
