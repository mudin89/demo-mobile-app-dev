import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Typography} from './Typography';
import {colors} from '../../theme';

interface TimeSlotProps {
  time: string;
  isSelected: boolean;
  isAvailable: boolean;
  price?: number;
  onPress: () => void;
  disabled?: boolean;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({
  time,
  isSelected,
  isAvailable,
  price,
  onPress,
  disabled = false,
}) => {
  const containerStyle = [
    styles.container,
    isSelected && styles.selected,
    !isAvailable && styles.unavailable,
    disabled && styles.disabled,
  ];

  const textColor = isSelected
    ? colors.timeSlotTextSelected
    : !isAvailable
    ? colors.timeSlotTextUnavailable
    : colors.timeSlotText; // Fixed: was '#fff' : '#999' : '#333'

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || !isAvailable}
      activeOpacity={0.7}>
      <Typography variant="body" color={textColor} style={styles.timeText}>
        {time}
      </Typography>
      {price && isAvailable && (
        <Typography
          variant="caption"
          color={textColor}
          style={styles.priceText}>
          RM{price.toFixed(0)}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.timeSlotBorder, // Fixed: was '#e9ecef' (invisible in dark)
    backgroundColor: colors.timeSlotBackground, // Fixed: was '#fff' (blinds users in dark)
    marginRight: 8,
    marginBottom: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  selected: {
    backgroundColor: colors.timeSlotSelected, // Fixed: was '#e50914'
    borderColor: colors.timeSlotBorderSelected, // Fixed: was '#e50914'
  },
  unavailable: {
    backgroundColor: colors.timeSlotUnavailable, // Fixed: was '#f8f9fa' (invisible in dark)
    borderColor: colors.timeSlotBorderUnavailable, // Fixed: was '#dee2e6' (invisible in dark)
  },
  disabled: {
    opacity: 0.5,
  },
  timeText: {
    fontWeight: '600',
    fontSize: 14,
  },
  priceText: {
    fontSize: 10,
    marginTop: 2,
  },
});
