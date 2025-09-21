import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {Typography} from '../../components/atoms';
import {MovieCategoryRow, SearchBar} from '../../components/molecules';
import {Movie} from '../../types';
import {colors} from '../../theme';

interface MovieListProps {
  movies: Movie[];
  isLoading?: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onMoviePress: (movie: Movie) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  onViewAll?: (category: string) => void;
}

export const MovieList: React.FC<MovieListProps> = ({
  movies,
  isLoading = false,
  searchQuery,
  onSearchChange,
  onMoviePress,
  onRefresh,
  refreshing = false,
  onViewAll,
}) => {
  // Categorize movies based on different criteria
  const categorizeMovies = () => {
    // For demo purposes, I'll create simple categorization logic
    // In a real app, these categories would come from the API or movie metadata

    const newReleases = movies.filter(movie => {
      // Consider movies from 2024 as new releases
      return movie.releaseDate.includes('2024');
    });

    const popularInCinemas = movies.filter(movie => {
      // Consider movies with high ratings as popular
      return movie.overallStar >= 4.0;
    });

    const recommendedForYou = movies.filter(movie => {
      // Consider action and sci-fi movies as recommended (based on user preference simulation)
      return movie.type === 'IMAX' || movie.duration > 140;
    });

    return {
      newReleases: newReleases.slice(0, 6), // Limit to 6 movies per category
      popularInCinemas: popularInCinemas.slice(0, 6),
      recommendedForYou: recommendedForYou.slice(0, 6),
    };
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Typography variant="h2" color={colors.textSecondary}>
        No movies found
      </Typography>
      <Typography
        variant="body"
        color={colors.textMuted}
        style={styles.emptyText}>
        Try adjusting your search criteria
      </Typography>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Typography
        variant="body"
        color={colors.textSecondary}
        style={styles.loadingText}>
        Loading movies...
      </Typography>
    </View>
  );

  const renderSearchResults = () => (
    <View style={styles.searchResults}>
      <Typography variant="h2" style={styles.searchTitle}>
        Search Results ({movies.length})
      </Typography>
      <View style={styles.searchMoviesGrid}>
        {movies.map(movie => (
          <View key={movie.id} style={styles.searchMovieCard}>
            <MovieCategoryRow
              title=""
              movies={[movie]}
              onMoviePress={onMoviePress}
            />
          </View>
        ))}
      </View>
    </View>
  );

  if (isLoading && movies.length === 0) {
    return (
      <View style={styles.container}>
        <SearchBar
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search by movie or cinema hall"
        />
        {renderLoadingState()}
      </View>
    );
  }

  // If user is searching, show search results instead of categories
  if (searchQuery.trim()) {
    return (
      <View style={styles.container}>
        <SearchBar
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search by movie or cinema hall"
        />
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {movies.length === 0 ? renderEmptyState() : renderSearchResults()}
        </ScrollView>
      </View>
    );
  }

  const {newReleases, popularInCinemas, recommendedForYou} = categorizeMovies();

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholder="Search movies or cinema locations..."
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {movies.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.categoriesContainer}>
            {newReleases.length > 0 && (
              <MovieCategoryRow
                title="New Releases"
                movies={newReleases}
                onMoviePress={onMoviePress}
                onViewAll={onViewAll}
                category="new"
              />
            )}

            {popularInCinemas.length > 0 && (
              <MovieCategoryRow
                title="Popular in Cinemas"
                movies={popularInCinemas}
                onMoviePress={onMoviePress}
                onViewAll={onViewAll}
                category="popular"
              />
            )}

            {recommendedForYou.length > 0 && (
              <MovieCategoryRow
                title="Recommended for You"
                movies={recommendedForYou}
                onMoviePress={onMoviePress}
                onViewAll={onViewAll}
                category="recommended"
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  categoriesContainer: {
    paddingVertical: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    minHeight: 400,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 8,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  searchResults: {
    padding: 16,
  },
  searchTitle: {
    marginBottom: 16,
    color: colors.text,
    fontWeight: 'bold',
  },
  searchMoviesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  searchMovieCard: {
    width: '48%',
    marginBottom: 16,
  },
});
