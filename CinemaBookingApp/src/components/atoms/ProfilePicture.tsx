import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Typography} from './Typography';
import {colors} from '../../theme';

interface ProfilePictureProps {
  imageUri?: string;
  name?: string;
  size?: number;
  onPress?: () => void;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  imageUri,
  name = 'User',
  size = 40,
  onPress,
}) => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return onPress ? (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress}>
      {imageUri ? (
        <Image
          source={{uri: imageUri}}
          style={[styles.image, containerStyle]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.placeholder, containerStyle]}>
          <Typography
            variant="caption"
            color={colors.white}
            style={[styles.initials, {fontSize: size * 0.4}]}>
            {initials}
          </Typography>
        </View>
      )}
    </TouchableOpacity>
  ) : (
    <View style={[styles.container, containerStyle]}>
      {imageUri ? (
        <Image
          source={{uri: imageUri}}
          style={[styles.image, containerStyle]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.placeholder, containerStyle]}>
          <Typography
            variant="caption"
            color={colors.white}
            style={[styles.initials, {fontSize: size * 0.4}]}>
            {initials}
          </Typography>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderWidth: 2,
    borderColor: colors.white,
  },
  placeholder: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  initials: {
    fontWeight: 'bold',
  },
});
