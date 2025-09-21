import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Typography} from './Typography';
import {colors} from '../../theme/colors';

interface HeartIconProps {
  isFilled?: boolean;
  onPress?: () => void;
  size?: number;
  disabled?: boolean;
}

export const HeartIcon: React.FC<HeartIconProps> = ({
  isFilled = false,
  onPress,
  size = 24,
  disabled = false,
}) => {
  const heartSymbol = isFilled ? '❤️' : '🤍';

  // Add extra padding for emoji rendering space
  const containerSize = size + 24;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}>
      <Typography
        style={[
          styles.heart,
          {
            fontSize: size,
            color: isFilled ? colors.primary : colors.textSecondary,
            lineHeight: size * 1.2, // Add line height for better vertical centering
          },
        ]}>
        {heartSymbol}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    overflow: 'visible', // Ensure emoji doesn't get clipped
  },
  heart: {
    textAlign: 'center',
    textAlignVertical: 'center', // For Android
    includeFontPadding: false, // Reduce extra padding on Android
  },
});