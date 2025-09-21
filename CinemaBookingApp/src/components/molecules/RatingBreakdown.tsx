import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Typography, Rating} from '../../components/atoms';
import {Review} from '../../types';
import {colors} from '../../theme';

interface RatingBreakdownProps {
  reviews: Review[];
}

export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({reviews}) => {
  // Calculate count for each star rating (1-5)
  const calculateRatingCounts = () => {
    const counts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};

    reviews.forEach(review => {
      if (review.stars >= 1 && review.stars <= 5) {
        counts[review.stars as keyof typeof counts]++;
      }
    });

    return counts;
  };

  const ratingCounts = calculateRatingCounts();
  const totalReviews = reviews.length;

  // Calculate percentage for progress bar
  const getPercentage = (count: number) => {
    if (totalReviews === 0) {
      return 0;
    }
    return (count / totalReviews) * 100;
  };

  const renderRatingRow = (stars: number, count: number) => {
    const percentage = getPercentage(count);

    return (
      <View key={stars} style={styles.ratingRow}>
        <View style={styles.starContainer}>
          <Typography variant="caption" color={colors.textSecondary}>
            {stars}
          </Typography>
          <Rating rating={stars} size="small" />
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {width: `${percentage}%`}]} />
          </View>
        </View>

        <View style={styles.countContainer}>
          <Typography variant="caption" color={colors.textSecondary}>
            {count}
          </Typography>
        </View>
      </View>
    );
  };

  if (totalReviews === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Typography variant="h3" style={styles.title} color={colors.text}>
        Rating Breakdown
      </Typography>

      <View style={styles.breakdownContainer}>
        {[5, 4, 3, 2, 1].map(stars =>
          renderRatingRow(
            stars,
            ratingCounts[stars as keyof typeof ratingCounts],
          ),
        )}
      </View>

      <View style={styles.totalContainer}>
        <Typography variant="caption" color={colors.textMuted}>
          Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  title: {
    marginBottom: 16,
  },
  breakdownContainer: {
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    marginRight: 12,
  },
  progressContainer: {
    flex: 1,
    marginRight: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  countContainer: {
    width: 30,
    alignItems: 'flex-end',
  },
  totalContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
});
