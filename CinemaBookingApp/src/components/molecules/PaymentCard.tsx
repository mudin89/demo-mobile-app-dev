import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Typography} from '../../components/atoms';
import {PaymentCard as PaymentCardType} from '../../types';
import {colors} from '../../theme';

interface PaymentCardProps {
  card: PaymentCardType;
  isSelected?: boolean;
  onPress?: (card: PaymentCardType) => void;
  onDelete?: (cardId: string) => void;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  card,
  isSelected = false,
  onPress,
  onDelete,
}) => {
  const getCardTypeColor = () => {
    switch (card.type) {
      case 'visa':
        return '#1A1F71';
      case 'mastercard':
        return '#EB001B';
      case 'amex':
        return '#006FCF';
      default:
        return colors.titlePrimary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selected]}
      onPress={() => onPress?.(card)}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Typography variant="h3" color={getCardTypeColor()}>
            {card.type.toUpperCase()}
          </Typography>
          {onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(card.id)}>
              <Typography variant="caption" color={colors.primary}>
                Delete
              </Typography>
            </TouchableOpacity>
          )}
        </View>
        <Typography
          variant="body"
          style={styles.cardNumber}
          color={colors.titlePrimary}>
          •••• •••• •••• {card.maskedNumber}
        </Typography>
        <View style={styles.footer}>
          <Typography variant="caption" color={colors.textSecondary}>
            {card.cardholderName}
          </Typography>
          <Typography variant="caption" color={colors.textSecondary}>
            {card.expiryDate}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selected: {
    borderColor: colors.primary,
  },
  content: {
    minHeight: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    padding: 4,
  },
  cardNumber: {
    marginBottom: 12,
    letterSpacing: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
