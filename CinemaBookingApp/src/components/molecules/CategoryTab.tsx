import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Typography} from '../atoms/Typography';
import {colors} from '../../theme/colors';

interface CategoryTabProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
  count?: number;
  disabled?: boolean;
}

export const CategoryTab: React.FC<CategoryTabProps> = ({
  title,
  isActive,
  onPress,
  count,
  disabled = false,
}) => {
  const containerStyle = [
    styles.container,
    isActive && styles.containerActive,
    disabled && styles.containerDisabled,
  ];

  const textColor = isActive
    ? colors.primary
    : disabled
    ? colors.disabledText
    : colors.text; // Changed from colors.textSecondary to colors.text for better visibility

  const displayTitle =
    count !== undefined && count > 0 ? `${title} (${count})` : title;

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}>
      <Typography
        variant="body"
        color={textColor}
        style={[styles.text, isActive && styles.textActive]}>
        {displayTitle}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerActive: {
    borderBottomColor: colors.primary,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  textActive: {
    fontWeight: '600',
  },
});
