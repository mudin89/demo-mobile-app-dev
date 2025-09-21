import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Typography} from '../../components/atoms';
import {MovieCard, SearchBar} from '../../components/molecules';
import {dataService} from '../../services/dataService';
import {RootStackParamList} from '../../navigation/types';
import {Movie} from '../../types';
import {colors} from '../../theme';
import {debouncedNavigate} from '../../utils/navigationHelpers';

type AllMoviesRouteProp = RouteProp<RootStackParamList, 'AllMovies'>;
type AllMoviesNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AllMovies'
>;

export const AllMoviesScreen: React.FC = () => {
  const route = useRoute<AllMoviesRouteProp>();
  const navigation = useNavigation<AllMoviesNavigationProp>();
  const {category, title} = route.params || {};

  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'popular' | 'new' | 'recommended'
  >('all');

  const loadMovies = async () => {
    try {
      setIsLoading(true);
      console.log('🎬 AllMoviesScreen: Loading all movies');
      const allMovies = await dataService.getMovies();
      console.log('🎬 AllMoviesScreen: Loaded', allMovies.length, 'movies');
      setMovies(allMovies);
    } catch (error) {
      console.error('❌ AllMoviesScreen: Error loading movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMovies = useCallback(() => {
    let filtered = [...movies];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        movie =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.casts.some(cast =>
            cast.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Apply category filter
    if (category) {
      switch (category) {
        case 'popular':
          filtered = filtered.filter(movie => movie.overallStar >= 4.0);
          break;
        case 'new':
          filtered = filtered.filter(movie =>
            movie.releaseDate.includes('2024'),
          );
          break;
        case 'recommended':
          filtered = filtered.filter(
            movie => movie.type === 'IMAX' || movie.duration > 140,
          );
          break;
      }
    }

    // Apply selected filter
    switch (selectedFilter) {
      case 'popular':
        filtered = filtered.filter(movie => movie.overallStar >= 4.0);
        break;
      case 'new':
        filtered = filtered.filter(movie => movie.releaseDate.includes('2024'));
        break;
      case 'recommended':
        filtered = filtered.filter(
          movie => movie.type === 'IMAX' || movie.duration > 140,
        );
        break;
    }

    // Sort by rating (highest first)
    filtered.sort((a, b) => b.overallStar - a.overallStar);

    setFilteredMovies(filtered);
  }, [movies, searchQuery, selectedFilter, category]);

  // Load movies
  useEffect(() => {
    loadMovies();
  }, []);

  // Filter movies based on search and category
  useEffect(() => {
    filterMovies();
  }, [filterMovies]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMovies();
    setRefreshing(false);
  }, []);

  const handleMoviePress = useCallback(
    (movie: Movie) => {
      debouncedNavigate(navigation, 'MovieDetails', {movieId: movie.id});
    },
    [navigation],
  );

  const renderFilterButton = (filter: typeof selectedFilter, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.activeFilterButton,
      ]}
      onPress={() => setSelectedFilter(filter)}>
      <Typography
        variant="caption"
        color={selectedFilter === filter ? colors.text : colors.textSecondary}
        style={styles.filterText}>
        {label}
      </Typography>
    </TouchableOpacity>
  );

  const renderMovie = ({item}: {item: Movie}) => (
    <View style={styles.movieContainer}>
      <MovieCard movie={item} onPress={handleMoviePress} />
    </View>
  );

  const getScreenTitle = () => {
    if (title) {
      return title;
    }
    if (category) {
      switch (category) {
        case 'popular':
          return 'Popular in Cinemas';
        case 'new':
          return 'New Releases';
        case 'recommended':
          return 'Recommended for You';
        default:
          return 'All Movies';
      }
    }
    return 'All Movies';
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Typography
          variant="body"
          color={colors.textSecondary}
          style={styles.loadingText}>
          Loading movies...
        </Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h1" color={colors.text} style={styles.title}>
          {getScreenTitle()}
        </Typography>
        <Typography variant="body" color={colors.textSecondary}>
          {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''}{' '}
          available
        </Typography>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search movies, actors, genres..."
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filtersContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('popular', 'Popular')}
        {renderFilterButton('new', 'New')}
        {renderFilterButton('recommended', 'Recommended')}
      </View>

      {/* Movies Grid */}
      <FlatList
        data={filteredMovies}
        renderItem={renderMovie}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.moviesList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography variant="h3" color={colors.textSecondary}>
              No movies found
            </Typography>
            <Typography
              variant="body"
              color={colors.textMuted}
              style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Typography>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  title: {
    marginBottom: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    marginRight: 12,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontWeight: '600',
  },
  moviesList: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  movieContainer: {
    flex: 1,
    margin: 8,
    maxWidth: '50%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptySubtext: {
    marginTop: 8,
    textAlign: 'center',
  },
});
