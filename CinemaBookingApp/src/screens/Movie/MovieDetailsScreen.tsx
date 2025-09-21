import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Typography, Button, Rating, HeartIcon} from '../../components/atoms';
import {RatingBreakdown, TrailerPlayer} from '../../components/molecules';
import {dataService} from '../../services/dataService';
import {formatReleaseDate, formatDuration} from '../../utils/dateTime';
import {RootStackParamList} from '../../navigation/types';
import {Movie, Review} from '../../types';
import {colors} from '../../theme';
import {debouncedNavigate} from '../../utils/navigationHelpers';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {toggleFavourite, selectIsFavourite} from '../../store/slices/favouriteSlice';

type MovieDetailsRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>;
type MovieDetailsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MovieDetails'
>;

export const MovieDetailsScreen: React.FC = () => {
  const route = useRoute<MovieDetailsRouteProp>();
  const navigation = useNavigation<MovieDetailsNavigationProp>();
  const dispatch = useAppDispatch();
  const {movieId} = route.params;

  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [_selectedDate, _setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [_sessions, _setSessions] = useState<any[]>([]);
  const [movieLoading, setMovieLoading] = useState(true);
  const [_reviewsLoading, setReviewsLoading] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState<{
    [key: string]: boolean;
  }>({});
  const [_sessionsLoading, _setSessionsLoading] = useState(true);

  // Favourite state
  const isFavourite = useAppSelector(selectIsFavourite(movieId));

  useEffect(() => {
    const loadMovieData = async () => {
      console.log('🎬 MovieDetailsScreen: Loading movie data for ID:', movieId);
      setMovieLoading(true);
      setReviewsLoading(true);
      _setSessionsLoading(true);

      try {
        // Load movie details
        const movieData = await dataService.getMovieById(movieId);
        console.log(
          '🎬 MovieDetailsScreen: Movie data loaded:',
          movieData?.title || 'Not found',
        );
        setMovie(movieData);

        // Load reviews
        const reviewsData = await dataService.getMovieReviews(movieId);
        console.log(
          '⭐ MovieDetailsScreen: Reviews loaded:',
          reviewsData.length,
          'reviews',
        );
        setReviews(reviewsData);

        // Load sessions (mock data)
        const sessionsData = await dataService.getMovieSessions(movieId);
        console.log(
          '🎫 MovieDetailsScreen: Sessions loaded:',
          sessionsData.length,
          'sessions',
        );
        _setSessions(sessionsData);
      } catch (error) {
        console.error(
          '❌ MovieDetailsScreen: Error loading movie data:',
          error,
        );
      } finally {
        setMovieLoading(false);
        setReviewsLoading(false);
        _setSessionsLoading(false);
      }
    };

    loadMovieData();
  }, [movieId]);

  const handleTrailerPlay = useCallback(() => {
    console.log('🎬 MovieDetailsScreen: Trailer play pressed');
    // Implement trailer playback logic
  }, []);

  const handleTrailerMuteToggle = useCallback(() => {
    console.log('🔇 MovieDetailsScreen: Trailer mute toggled');
    // Implement trailer mute toggle logic
  }, []);

  const handleFavouriteToggle = useCallback(() => {
    if (!movie) {
      console.warn('💖 MovieDetailsScreen: Cannot toggle favourite - movie not loaded');
      return;
    }

    console.log(
      '💖 MovieDetailsScreen: Toggling favourite for movie:',
      movie.title,
      'Current state:',
      isFavourite ? 'favourited' : 'not favourited',
    );

    dispatch(toggleFavourite(movie));
  }, [movie, isFavourite, dispatch]);

  const renderTabs = () => (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'details' && styles.activeTab]}
        onPress={() => setActiveTab('details')}>
        <Typography
          variant="body"
          color={activeTab === 'details' ? colors.primary : colors.textMuted}
          style={styles.tabText}>
          Details
        </Typography>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
        onPress={() => setActiveTab('reviews')}>
        <Typography
          variant="body"
          color={activeTab === 'reviews' ? colors.primary : colors.textMuted}
          style={styles.tabText}>
          Reviews ({reviews.length})
        </Typography>
      </TouchableOpacity>
    </View>
  );

  const renderDetails = () => {
    if (!movie) {
      return null;
    }

    return (
      <View style={styles.tabContent}>
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Synopsis
          </Typography>
          <Typography
            variant="body"
            color={colors.textSecondary}
            style={styles.synopsis}>
            {movie.synopsis}
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Cast
          </Typography>
          <Typography variant="body" color={colors.textSecondary}>
            {movie.casts.join(', ')}
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Directors
          </Typography>
          <Typography variant="body" color={colors.textSecondary}>
            {movie.directors.join(', ')}
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Writers
          </Typography>
          <Typography variant="body" color={colors.textSecondary}>
            {movie.writers.join(', ')}
          </Typography>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Typography variant="caption" color={colors.textMuted}>
              Release Date
            </Typography>
            <Typography variant="body" color={colors.text}>
              {formatReleaseDate(movie.releaseDate)}
            </Typography>
          </View>
          <View style={styles.infoItem}>
            <Typography variant="caption" color={colors.textMuted}>
              Duration
            </Typography>
            <Typography variant="body" color={colors.text}>
              {formatDuration(movie.duration)}
            </Typography>
          </View>
          <View style={styles.infoItem}>
            <Typography variant="caption" color={colors.textMuted}>
              Type
            </Typography>
            <Typography variant="body" color={colors.text}>
              {movie.type}
            </Typography>
          </View>
          <View style={styles.infoItem}>
            <Typography variant="caption" color={colors.textMuted}>
              Language
            </Typography>
            <Typography variant="body" color={colors.text}>
              {movie.language}
            </Typography>
          </View>
        </View>
      </View>
    );
  };

  const renderReviews = () => (
    <View style={styles.tabContent}>
      {reviews.length > 0 && <RatingBreakdown reviews={reviews} />}

      {reviews.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.reviewsContainer}
          style={styles.reviewsScrollView}>
          {reviews.map(review => {
            const isExpanded = expandedReviews[review.id];
            return (
              <TouchableOpacity
                key={review.id}
                style={styles.reviewCard}
                onPress={() => toggleReviewExpansion(review.id)}>
                <View style={styles.reviewHeader}>
                  <Typography variant="body" style={styles.reviewAuthor}>
                    {review.user}
                  </Typography>
                  <Rating rating={review.stars} size="small" />
                </View>
                <Typography
                  variant="body"
                  color={colors.textSecondary}
                  style={styles.reviewContent}
                  numberOfLines={isExpanded ? undefined : 3}>
                  {review.comment}
                </Typography>
                {review.comment.length > 150 && (
                  <Typography
                    variant="caption"
                    color={colors.primary}
                    style={styles.expandText}>
                    {isExpanded ? 'Show less' : 'Show more'}
                  </Typography>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyReviews}>
          <Typography variant="body" color={colors.textSecondary}>
            No reviews available for this movie.
          </Typography>
        </View>
      )}
    </View>
  );

  const toggleReviewExpansion = useCallback((reviewId: string) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  }, []);

  if (movieLoading || !movie) {
    return (
      <View style={styles.loadingContainer}>
        <Typography variant="body" color={colors.textSecondary}>
          Loading movie details...
        </Typography>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Trailer Section - Moved to Top */}
      <View style={styles.trailerSection}>
        <TrailerPlayer
          thumbnailUri={movie.poster}
          onPlay={handleTrailerPlay}
          onMuteToggle={handleTrailerMuteToggle}
        />
      </View>

      <View style={styles.header}>
        <Image source={{uri: movie.poster}} style={styles.poster} />
        <View style={styles.movieInfo}>
          <View style={styles.titleContainer}>
            <Typography
              variant="h2"
              numberOfLines={2}
              style={styles.title}
              color={colors.text}>
              {movie.title}
            </Typography>
            <HeartIcon
              isFilled={isFavourite}
              onPress={handleFavouriteToggle}
              size={28}
            />
          </View>

          {/* Genre/Category Tags */}
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Typography variant="caption" color={colors.textLight}>
                {movie.type}
              </Typography>
            </View>
            <View style={styles.tag}>
              <Typography variant="caption" color={colors.textLight}>
                {movie.rating}
              </Typography>
            </View>
          </View>

          {/* Metadata Row with Icons */}
          <View style={styles.metadataRow}>
            <View style={styles.metadataItem}>
              <Typography variant="caption" style={styles.metadataIcon}>
                🎬
              </Typography>
              <Typography
                variant="caption"
                color={colors.textSecondary}
                style={styles.metadataText}>
                {formatReleaseDate(movie.releaseDate)}
              </Typography>
            </View>
            <View style={styles.metadataItem}>
              <Typography variant="caption" style={styles.metadataIcon}>
                ⭐
              </Typography>
              <Typography
                variant="caption"
                color={colors.textSecondary}
                style={styles.metadataText}>
                {movie.rating}
              </Typography>
            </View>
            <View style={styles.metadataItem}>
              <Typography variant="caption" style={styles.metadataIcon}>
                ⏱
              </Typography>
              <Typography
                variant="caption"
                color={colors.textSecondary}
                style={styles.metadataText}>
                {formatDuration(movie.duration)}
              </Typography>
            </View>
          </View>

          {/* Overall Rating and Count */}
          <View style={styles.ratingSection}>
            <Rating rating={movie.overallStar} />
            <Typography
              variant="caption"
              color={colors.textSecondary}
              style={styles.ratingCount}>
              {movie.overallStar.toFixed(1)} ({reviews.length} reviews)
            </Typography>
          </View>
        </View>
      </View>

      {renderTabs()}
      {activeTab === 'details' ? renderDetails() : renderReviews()}

      {/* Book Ticket Button */}
      <View style={styles.bookButtonContainer}>
        <Button
          title="Book Ticket"
          onPress={() => {
            if (!movie || !movie.id) {
              Alert.alert(
                'Error',
                'Movie information is not available. Please try again.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ],
              );
              return;
            }
            debouncedNavigate(navigation, 'SessionSelection', {
              movieId: movie.id,
            });
          }}
          size="large"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.headerBackground,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 16,
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
    minHeight: 52, // Ensure enough height for heart icon
    overflow: 'visible', // Prevent clipping
  },
  title: {
    flex: 1,
    marginRight: 12,
    paddingTop: 4, // Align with heart icon center
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    marginTop: 8,
  },
  tag: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingRight: 20,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metadataIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  metadataText: {
    fontSize: 12,
    flex: 1,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingCount: {
    fontSize: 12,
    marginLeft: 8,
  },
  trailerSection: {
    padding: 16,
    backgroundColor: colors.background,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    color: colors.text,
  },
  synopsis: {
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 16,
  },
  reviewItem: {
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewsScrollView: {
    marginTop: 16,
  },
  reviewsContainer: {
    paddingHorizontal: 16,
  },
  reviewCard: {
    width: 280,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontWeight: '600',
    color: '#FFFFFF',
    fontSize: 14,
  },
  reviewContent: {
    marginBottom: 8,
    lineHeight: 20,
  },
  reviewDate: {
    textAlign: 'right',
  },
  emptyReviews: {
    alignItems: 'center',
    padding: 32,
  },
  expandText: {
    textAlign: 'right',
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  sessionsContainer: {
    padding: 16,
    backgroundColor: colors.surface,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionPrice: {
    fontWeight: '600',
    fontSize: 18,
  },
  bookButtonContainer: {
    padding: 16,
    backgroundColor: colors.background,
  },
});
