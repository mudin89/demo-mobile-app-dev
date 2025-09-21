import React from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import {Typography} from './Typography';
import {colors} from '../../theme';

interface PlayButtonProps {
  onPress?: () => void;
  size?: number;
  disabled?: boolean;
}

export const PlayButton: React.FC<PlayButtonProps> = ({
  onPress,
  size = 60,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}>
      <View style={[styles.playIcon, {marginLeft: size * 0.05}]}>
        <Typography
          variant="h1"
          color={colors.white}
          style={[styles.playText, {fontSize: size * 0.4}]}>
          ▶
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
