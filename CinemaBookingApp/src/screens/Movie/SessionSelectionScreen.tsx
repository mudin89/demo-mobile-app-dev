import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SessionBooking} from '../../components/organisms/SessionBooking';
import {dataService} from '../../services/dataService';
import {useAppDispatch} from '../../store/hooks';
import {
  setSelectedMovie,
  setSelectedSession,
  clearSeatsOnly,
} from '../../store/slices/bookingSlice';
import {RootStackParamList} from '../../navigation/types';
import {Movie, Cinema, MovieSession} from '../../types';
import {colors} from '../../theme';

type SessionSelectionRouteProp = RouteProp<
  RootStackParamList,
  'SessionSelection'
>;
type SessionSelectionNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SessionSelection'
>;

interface SessionDetails {
  cinemaId: string;
  location: string;
  cinemaBrand: string;
  date: string;
  timeSlot: string;
}

export const SessionSelectionScreen: React.FC = () => {
  const route = useRoute<SessionSelectionRouteProp>();
  const navigation = useNavigation<SessionSelectionNavigationProp>();
  const dispatch = useAppDispatch();
  const {movieId} = route.params;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load movie and cinema data
  useEffect(() => {
    const loadData = async () => {
      console.log(
        '🎬 SessionSelectionScreen: Loading data for movie:',
        movieId,
      );
      setIsLoading(true);

      try {
        // Load movie details
        const movieData = await dataService.getMovieById(movieId);
        if (!movieData) {
          setIsLoading(false);
          Alert.alert('Error', 'Movie not found', [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]);
          return;
        }

        console.log(
          '🎬 SessionSelectionScreen: Movie loaded:',
          movieData.title,
        );
        setMovie(movieData);

        // Load cinemas showing this movie
        const cinemasData = await dataService.getCinemasByMovie(movieId);
        console.log(
          '🏢 SessionSelectionScreen: Cinemas loaded:',
          cinemasData.length,
        );
        setCinemas(cinemasData);

        // Store movie in Redux
        dispatch(setSelectedMovie(movieData));
      } catch (error) {
        console.error('❌ SessionSelectionScreen: Error loading data:', error);
        Alert.alert(
          'Error',
          'Failed to load movie information. Please try again.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [movieId, dispatch, navigation]);

  const handleContinue = useCallback(
    async (sessionDetails: SessionDetails) => {
      if (!movie) {
        Alert.alert('Error', 'Movie information not available');
        return;
      }

      console.log(
        '🎫 SessionSelectionScreen: Processing session selection:',
        sessionDetails,
      );
      setIsProcessing(true);

      try {
        // Create proper datetime strings from date and time
        const sessionDate = new Date(sessionDetails.date);
        const timeSlot = sessionDetails.timeSlot;

        // Parse time slot (e.g., "11:40AM" or "2:30PM")
        const timeMatch = timeSlot.match(/(\d{1,2}):(\d{2})(AM|PM)/i);
        if (!timeMatch) {
          throw new Error(`Invalid time format: ${timeSlot}`);
        }

        let hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const ampm = timeMatch[3].toUpperCase();

        // Convert to 24-hour format
        if (ampm === 'PM' && hours !== 12) {
          hours += 12;
        } else if (ampm === 'AM' && hours === 12) {
          hours = 0;
        }

        // Create start time
        const startDateTime = new Date(sessionDate);
        startDateTime.setHours(hours, minutes, 0, 0);

        // Calculate end time (add movie duration)
        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + movie.duration);

        // Define time slot prices mapping (should match SessionBooking component)
        const timeSlotPrices: {[key: string]: number} = {
          '9:20AM': 15,
          '11:40AM': 20,
          '1:20PM': 25,
          '3:30PM': 30,
          '5:40PM': 35,
          '7:30PM': 40,
          '9:20PM': 45,
        };

        // Get the price from the selected time slot
        const ticketPrice = timeSlotPrices[sessionDetails.timeSlot] || 25; // Default to RM 25

        // Create a session object from the selection
        const session: MovieSession = {
          id: `session-${movieId}-${sessionDetails.cinemaId}-${sessionDetails.date}-${sessionDetails.timeSlot}`,
          movieId: movie.id,
          cinemaId: sessionDetails.cinemaId,
          hallId: 'hall-1', // Default hall
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          date: sessionDetails.date,
          price: ticketPrice, // Use actual price from selected time slot
        };

        console.log('🎫 SessionSelectionScreen: Created session:', session);

        // Clear any previously selected seats when selecting a new session
        console.log(
          '🧹 SessionSelectionScreen: Clearing previous seat selections',
        );
        dispatch(clearSeatsOnly());

        // Store session in Redux
        dispatch(setSelectedSession(session));

        // Navigate to seat selection
        navigation.navigate('SeatSelection', {
          movie,
          session,
        });
      } catch (error) {
        console.error(
          '❌ SessionSelectionScreen: Error processing session:',
          error,
        );
        Alert.alert(
          'Error',
          'Failed to process your selection. Please try again.',
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [movie, movieId, dispatch, navigation],
  );

  if (isLoading || !movie) {
    return (
      <View style={styles.loadingContainer}>
        <SessionBooking
          movie={{
            id: '',
            title: 'Loading...',
            type: '2D',
            duration: 0,
            rating: '',
            releaseDate: '',
            poster: '',
            synopsis: '',
            casts: [],
            directors: [],
            writers: [],
            language: '',
            overallStar: 0,
          }}
          cinemas={[]}
          onContinue={() => {}}
          isLoading={true}
          disabled={true}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SessionBooking
        movie={movie}
        cinemas={cinemas}
        onContinue={handleContinue}
        isLoading={isProcessing}
        disabled={isProcessing}
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
    backgroundColor: colors.background,
  },
});
