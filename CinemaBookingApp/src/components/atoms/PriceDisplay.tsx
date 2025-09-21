import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Typography} from './Typography';

interface PriceDisplayProps {
  price: number;
  currency?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'highlighted' | 'discount' | 'total';
  originalPrice?: number;
  showCurrency?: boolean;
  style?: any;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  currency = 'RM',
  size = 'medium',
  variant = 'default',
  originalPrice,
  showCurrency = true,
  style,
}) => {
  const formatPrice = (amount: number): string => {
    return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getPriceColor = (): string => {
    switch (variant) {
      case 'highlighted':
        return '#e50914';
      case 'discount':
        return '#28a745';
      case 'total':
        return '#007bff';
      default:
        return '#ffffff';
    }
  };

  const getPriceSize = (): 'caption' | 'body' | 'h3' | 'h2' => {
    switch (size) {
      case 'small':
        return 'caption';
      case 'large':
        return 'h3';
      default:
        return 'body';
    }
  };

  const containerStyle = [
    styles.container,
    variant === 'total' && styles.totalContainer,
    style,
  ];

  return (
    <View style={containerStyle}>
      {originalPrice && originalPrice > price && (
        <Typography variant="caption" color="#999" style={styles.originalPrice}>
          {showCurrency && currency}
          {formatPrice(originalPrice)}
        </Typography>
      )}

      <Typography
        variant={getPriceSize()}
        color={getPriceColor()}
        style={[styles.price, variant === 'total' && styles.totalPrice]}>
        {showCurrency && currency}
        {formatPrice(price)}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  totalContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  price: {
    fontWeight: '600',
  },
  totalPrice: {
    fontWeight: '700',
  },
});
