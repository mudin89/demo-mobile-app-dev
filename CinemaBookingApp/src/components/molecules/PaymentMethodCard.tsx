import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {Typography} from '../atoms/Typography';
import {colors} from '../../theme/colors';

export type PaymentMethodType = 'card' | 'bank' | 'crypto';

interface PaymentMethodOption {
  type: PaymentMethodType;
  title: string;
  subtitle: string;
  icon: string;
}

interface PaymentMethodCardProps {
  method: PaymentMethodOption;
  isSelected: boolean;
  onPress: (type: PaymentMethodType) => void;
  disabled?: boolean;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  isSelected,
  onPress,
  disabled = false,
}) => {
  const handlePress = () => {
    if (!disabled) {
      console.log('💳 PaymentMethodCard: Method selected:', method.type);
      onPress(method.type);
    }
  };

  const containerStyle = [
    styles.container,
    isSelected && styles.selected,
    disabled && styles.disabled,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Typography variant="h2" style={styles.icon}>
            {method.icon}
          </Typography>
        </View>

        <View style={styles.textContainer}>
          <Typography
            variant="body"
            color={isSelected ? '#fff' : colors.titlePrimary}
            style={styles.title}>
            {method.title}
          </Typography>
          <Typography
            variant="caption"
            color={isSelected ? '#fff' : colors.textSecondary}
            style={styles.subtitle}>
            {method.subtitle}
          </Typography>
        </View>

        <View style={styles.arrow}>
          <Typography
            variant="body"
            color={isSelected ? '#fff' : colors.textSecondary}>
            ▶
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
  },
  arrow: {
    marginLeft: 8,
  },
});
