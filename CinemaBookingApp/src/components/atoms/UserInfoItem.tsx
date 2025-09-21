import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Typography} from './Typography';
import {colors} from '../../theme/colors';

interface UserInfoItemProps {
  label: string;
  value: string;
  style?: any;
}

export const UserInfoItem: React.FC<UserInfoItemProps> = ({
  label,
  value,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Typography variant="caption" color={colors.textMuted} style={styles.label}>
        {label}
      </Typography>
      <Typography variant="body" color={colors.titlePrimary} style={styles.value}>
        {value}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
});