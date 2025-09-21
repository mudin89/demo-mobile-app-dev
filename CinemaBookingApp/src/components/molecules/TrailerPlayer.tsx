import React, {useState} from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';
import {PlayButton, TrailerTag, MuteIcon} from '../atoms';
import {colors} from '../../theme';

interface TrailerPlayerProps {
  thumbnailUri?: string;
  trailerUri?: string;
  onPlay?: () => void;
  onMuteToggle?: () => void;
  width?: number;
  aspectRatio?: number;
}

const screenWidth = Dimensions.get('window').width;

export const TrailerPlayer: React.FC<TrailerPlayerProps> = ({
  thumbnailUri,
  trailerUri: _trailerUri,
  onPlay,
  onMuteToggle,
  width = screenWidth - 32,
  aspectRatio = 16 / 9,
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const height = width / aspectRatio;

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    onPlay?.();
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    onMuteToggle?.();
  };

  return (
    <View style={[styles.container, {width, height}]}>
      {/* Background Image/Video */}
      <View style={styles.mediaContainer}>
        {thumbnailUri ? (
          <Image
            source={{uri: thumbnailUri}}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.placeholder, {backgroundColor: colors.surface}]}>
            {/* Placeholder for when no thumbnail is provided */}
          </View>
        )}

        {/* Overlay */}
        <View style={styles.overlay} />
      </View>

      {/* Controls Layer */}
      <View style={styles.controlsContainer}>
        {/* Trailer Tag - Bottom Left */}
        <View style={styles.bottomLeft}>
          <TrailerTag />
        </View>

        {/* Play Button - Center */}
        <View style={styles.center}>
          <PlayButton onPress={handlePlay} size={60} />
        </View>

        {/* Mute Icon - Bottom Right */}
        <View style={styles.bottomRight}>
          <MuteIcon isMuted={isMuted} onPress={handleMuteToggle} size={20} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mediaContainer: {
    flex: 1,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -30}, {translateY: -30}],
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  bottomRight: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
});
