import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Typography} from '../../components/atoms';
import {Movie} from '../../types';
import {colors} from '../../theme';

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({movie, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(movie)}>
      <Image source={{uri: movie.poster}} style={styles.poster} />
      <View style={styles.content}>
        <Typography variant="body" numberOfLines={2} style={styles.title}>
          {movie.title}
        </Typography>
        <View style={styles.typeContainer}>
          <Typography
            variant="caption"
            color={colors.textMuted}
            style={styles.type}>
            {movie.type}
          </Typography>
        </View>
        <View style={styles.ratingContainer}>
          <View style={styles.rating}>
            <Icon name="star" size={16} color="#FFD700" />
            <Typography
              variant="caption"
              color={colors.text}
              style={styles.ratingText}>
              {movie.overallStar.toFixed(1)}
            </Typography>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 8,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
    minHeight: 80,
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 6,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 18,
    height: 36, // Fixed height for exactly 2 lines (18 * 2)
  },
  typeContainer: {
    marginBottom: 8,
  },
  type: {
    backgroundColor: colors.surface,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    fontSize: 10,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
