import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Typography} from './Typography';
import {colors} from '../../theme';

interface PriceFilterProps {
  label: string;
  isSelected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  label,
  isSelected = false,
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selected,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}>
      <Typography
        variant="body"
        color={isSelected ? colors.white : colors.text}
        style={styles.label}>
        {label}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    marginRight: 8,
    marginBottom: 8,
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
