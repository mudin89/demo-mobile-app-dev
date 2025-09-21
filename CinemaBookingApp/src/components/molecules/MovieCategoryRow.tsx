import React from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {Typography} from '../../components/atoms';
import {MovieCard} from '../../components/molecules';
import {Movie} from '../../types';
import {colors} from '../../theme';

interface MovieCategoryRowProps {
  title: string;
  movies: Movie[];
  onMoviePress: (movie: Movie) => void;
  onViewAll?: (category: string) => void;
  category?: string;
}

export const MovieCategoryRow: React.FC<MovieCategoryRowProps> = ({
  title,
  movies,
  onMoviePress,
  onViewAll,
  category,
}) => {
  const renderMovie = ({item}: {item: Movie}) => (
    <View style={styles.movieCardContainer}>
      <MovieCard movie={item} onPress={onMoviePress} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Typography variant="h2" style={styles.categoryTitle}>
          {title}
        </Typography>
        {onViewAll && category && (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => onViewAll(category)}>
            <Typography
              variant="body"
              color={colors.primary}
              style={styles.viewAllText}>
              View All
            </Typography>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moviesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  categoryTitle: {
    color: colors.text,
    fontWeight: 'bold',
    flex: 1,
  },
  viewAllButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  viewAllText: {
    fontWeight: '600',
    fontSize: 14,
  },
  moviesList: {
    paddingHorizontal: 8,
  },
  movieCardContainer: {
    marginHorizontal: 8,
    width: 140,
  },
});
