import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Typography} from './Typography';

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  maxRating = 5,
  size = 'medium',
  showText = true,
}) => {
  // Handle edge cases
  const safeRating = isNaN(rating)
    ? 0
    : Math.max(0, Math.min(rating, maxRating));
  const filledStars = Math.max(0, Math.floor(safeRating));
  const hasHalfStar = safeRating % 1 !== 0;
  const emptyStars = Math.max(
    0,
    maxRating - filledStars - (hasHalfStar ? 1 : 0),
  );

  const starSize = size === 'small' ? 12 : size === 'medium' ? 16 : 20;

  return (
    <View style={styles.container}>
      <View style={styles.stars}>
        {[...Array(filledStars)].map((_, index) => (
          <Typography
            key={`filled-${index}`}
            style={[styles.star, {fontSize: starSize}]}
            color="#FFD700">
            ★
          </Typography>
        ))}
        {hasHalfStar && (
          <Typography
            style={[styles.star, {fontSize: starSize}]}
            color="#FFD700">
            ☆
          </Typography>
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <Typography
            key={`empty-${index}`}
            style={[styles.star, {fontSize: starSize}]}
            color="#DDD">
            ☆
          </Typography>
        ))}
      </View>
      {showText && (
        <Typography variant="caption" style={styles.ratingText} color="#666">
          {safeRating.toFixed(1)}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
  ratingText: {
    marginLeft: 8,
  },
});
