import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Typography} from './Typography';
import {colors} from '../../theme';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  minQuantity?: number;
  maxQuantity?: number;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  minQuantity = 0,
  maxQuantity = 99,
  size = 'medium',
  disabled = false,
}) => {
  const canDecrease = quantity > minQuantity && !disabled;
  const canIncrease = quantity < maxQuantity && !disabled;

  const containerStyle = [
    styles.container,
    styles[`container_${size}`],
    disabled && styles.containerDisabled,
  ];

  const buttonStyle = [styles.button, styles[`button_${size}`]];

  const decreaseButtonStyle = [
    buttonStyle,
    !canDecrease && styles.buttonDisabled,
  ];

  const increaseButtonStyle = [
    buttonStyle,
    !canIncrease && styles.buttonDisabled,
  ];

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={decreaseButtonStyle}
        onPress={onDecrease}
        disabled={!canDecrease}
        activeOpacity={0.7}>
        <Typography
          variant="body"
          color={canDecrease ? colors.text : colors.textDark} // Fixed: was '#fff' : '#666'
          style={styles.buttonText}>
          −
        </Typography>
      </TouchableOpacity>

      <View
        style={[styles.quantityContainer, styles[`quantityContainer_${size}`]]}>
        <Typography
          variant="body"
          style={[
            styles.quantityText,
            disabled && styles.quantityTextDisabled,
          ]}>
          {quantity}
        </Typography>
      </View>

      <TouchableOpacity
        style={increaseButtonStyle}
        onPress={onIncrease}
        disabled={!canIncrease}
        activeOpacity={0.7}>
        <Typography
          variant="body"
          color={canIncrease ? colors.text : colors.textDark} // Fixed: was '#fff' : '#666'
          style={styles.buttonText}>
          +
        </Typography>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.quantityBackground, // Fixed: was '#f8f9fa' (invisible in dark)
    borderRadius: 6,
    overflow: 'hidden',
  },
  container_small: {
    height: 32,
  },
  container_medium: {
    height: 36,
  },
  container_large: {
    height: 40,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  button: {
    backgroundColor: colors.quantityButton, // Fixed: was '#333'
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 32,
  },
  button_small: {
    height: 32,
    paddingHorizontal: 8,
  },
  button_medium: {
    height: 36,
    paddingHorizontal: 10,
  },
  button_large: {
    height: 40,
    paddingHorizontal: 12,
  },
  buttonDisabled: {
    backgroundColor: colors.quantityButtonDisabled, // Fixed: was '#999'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityContainer: {
    backgroundColor: colors.quantityCenter, // Fixed: was '#fff' (blinds users in dark)
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.quantityBorder, // Fixed: was '#e9ecef' (invisible in dark)
    minWidth: 40,
  },
  quantityContainer_small: {
    height: 32,
    paddingHorizontal: 8,
  },
  quantityContainer_medium: {
    height: 36,
    paddingHorizontal: 10,
  },
  quantityContainer_large: {
    height: 40,
    paddingHorizontal: 12,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.quantityText, // Fixed: was '#333' (invisible in dark)
  },
  quantityTextDisabled: {
    color: colors.quantityTextDisabled, // Fixed: was '#999'
  },
});
