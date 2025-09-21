import React, {useState, useCallback, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MovieList, AppHeader} from '../../components/organisms';
import {dataService} from '../../services/dataService';
import {Movie} from '../../types';
import {RootStackParamList} from '../../navigation/types';
import {debouncedNavigate} from '../../utils/navigationHelpers';

type MovieListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MovieList'
>;

export const MovieListScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const navigation = useNavigation<MovieListScreenNavigationProp>();

  const loadMovies = useCallback(async () => {
    console.log(
      '🎬 MovieListScreen: Loading movies with search query:',
      searchQuery || 'none',
    );
    setIsLoading(true);
    try {
      let moviesData: Movie[];
      if (searchQuery.trim()) {
        moviesData = await dataService.searchMovies(searchQuery.trim());
      } else {
        moviesData = await dataService.getMovies();
      }
      console.log(
        '🎬 MovieListScreen: Successfully loaded',
        moviesData.length,
        'movies',
      );
      setMovies(moviesData);
    } catch (error) {
      console.error('❌ MovieListScreen: Error loading movies:', error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  useFocusEffect(
    useCallback(() => {
      console.log('🎬 MovieListScreen: Screen focused, reloading movies');
      loadMovies();
    }, [loadMovies]),
  );

  const handleMoviePress = useCallback(
    (movie: Movie) => {
      debouncedNavigate(navigation, 'MovieDetails', {movieId: movie.id});
    },
    [navigation],
  );

  const handleSearchChange = useCallback((query: string) => {
    console.log('🔍 MovieListScreen: Search query changed to:', query);
    setSearchQuery(query);
  }, []);

  const handleRefresh = useCallback(async () => {
    console.log('🔄 MovieListScreen: Refreshing movies');
    setIsFetching(true);
    await loadMovies();
    setIsFetching(false);
  }, [loadMovies]);

  const handleViewAll = useCallback(
    (category: string) => {
      console.log(
        '👀 MovieListScreen: View all pressed for category:',
        category,
      );
      debouncedNavigate(navigation, 'AllMovies', {category});
    },
    [navigation],
  );

  const handleProfilePress = useCallback(() => {
    console.log('👤 MovieListScreen: Profile pressed');
    // Navigate to profile screen when implemented
  }, []);

  const handleNotificationPress = useCallback(() => {
    console.log('🔔 MovieListScreen: Notification pressed');
    // Navigate to notifications screen when implemented
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader
        userName="Raymond"
        userImageUri="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        onProfilePress={handleProfilePress}
        onNotificationPress={handleNotificationPress}
        hasNotification={true}
        notificationCount={3}
      />
      <MovieList
        movies={movies}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onMoviePress={handleMoviePress}
        onRefresh={handleRefresh}
        refreshing={isFetching}
        onViewAll={handleViewAll}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
