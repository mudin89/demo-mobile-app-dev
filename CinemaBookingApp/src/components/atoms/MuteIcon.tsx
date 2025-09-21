import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Typography} from './Typography';
import {colors} from '../../theme';

interface MuteIconProps {
  isMuted?: boolean;
  onPress?: () => void;
  size?: number;
}

export const MuteIcon: React.FC<MuteIconProps> = ({
  isMuted = true,
  onPress,
  size = 24,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: size + 16,
          height: size + 16,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Typography
        variant="body"
        color={colors.white}
        style={[styles.icon, {fontSize: size}]}>
        {isMuted ? '🔇' : '🔊'}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  icon: {
    textAlign: 'center',
  },
});
