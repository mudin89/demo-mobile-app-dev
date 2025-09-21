import React, {useCallback} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Typography} from '../../components/atoms';
import {MovieCard} from '../../components/molecules/MovieCard';
import {useAppSelector} from '../../store/hooks';
import {selectFavouriteMovies} from '../../store/slices/favouriteSlice';
import {BottomTabParamList, RootStackParamList} from '../../navigation/types';
import {Movie} from '../../types';
import {colors} from '../../theme';

type FavouriteListNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Favourites'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const FavouriteListScreen: React.FC = () => {
  const navigation = useNavigation<FavouriteListNavigationProp>();
  const favouriteMovies = useAppSelector(selectFavouriteMovies);

  const handleMoviePress = useCallback(
    (movie: Movie) => {
      console.log('💖 FavouriteListScreen: Navigating to movie details:', movie.title);
      navigation.navigate('MovieDetails', {movieId: movie.id});
    },
    [navigation],
  );

  const renderMovieItem = ({item}: {item: Movie}) => (
    <View style={styles.movieItem}>
      <MovieCard movie={item} onPress={handleMoviePress} />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Typography variant="h2" style={styles.emptyTitle} color={colors.textSecondary}>
        No Favourites Yet
      </Typography>
      <Typography
        variant="body"
        style={styles.emptySubtitle}
        color={colors.textMuted}>
        Movies you favourite will appear here. Tap the heart icon on any movie to add it to your favourites!
      </Typography>
    </View>
  );

  if (favouriteMovies.length === 0) {
    return (
      <View style={styles.container}>
        {renderEmptyState()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favouriteMovies}
        renderItem={renderMovieItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  movieItem: {
    flex: 0.5,
    marginBottom: 16,
    marginHorizontal: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
});
