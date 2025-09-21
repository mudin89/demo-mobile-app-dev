import {Alert} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/types';

/**
 * Navigation helper functions with built-in validation and error handling
 */

export const safeNavigate = (
  navigation: NavigationProp<RootStackParamList>,
  routeName: keyof RootStackParamList,
  params?: any,
  onError?: () => void,
) => {
  try {
    // Validate required parameters based on route
    const validationResult = validateNavigationParams(routeName, params);

    if (!validationResult.isValid) {
      Alert.alert(
        'Navigation Error',
        validationResult.message || 'Invalid navigation parameters.',
        [
          {
            text: 'OK',
            onPress: onError || (() => navigation.goBack()),
          },
        ],
      );
      return false;
    }

    navigation.navigate(routeName as never, params as never);
    return true;
  } catch (error) {
    console.error('Navigation error:', error);
    Alert.alert('Navigation Error', 'Failed to navigate. Please try again.', [
      {
        text: 'OK',
        onPress: onError || (() => navigation.goBack()),
      },
    ]);
    return false;
  }
};

export const validateNavigationParams = (
  routeName: keyof RootStackParamList,
  params?: any,
): {isValid: boolean; message?: string} => {
  switch (routeName) {
    case 'MovieDetails':
      if (!params?.movieId || typeof params.movieId !== 'string') {
        return {
          isValid: false,
          message: 'Movie ID is required to view movie details.',
        };
      }
      break;

    case 'SessionSelection':
      if (!params?.movieId || typeof params.movieId !== 'string') {
        return {
          isValid: false,
          message: 'Movie ID is required to select session.',
        };
      }
      break;

    case 'SeatSelection':
      if (!params?.movie || !params?.session) {
        return {
          isValid: false,
          message: 'Movie and session information required.',
        };
      }
      if (!params.movie.id || !params.session.id) {
        return {
          isValid: false,
          message: 'Invalid movie or session data.',
        };
      }
      break;

    case 'PaymentMethod':
      if (
        !params?.totalAmount ||
        typeof params.totalAmount !== 'number' ||
        params.totalAmount <= 0
      ) {
        return {
          isValid: false,
          message: 'Valid total amount is required.',
        };
      }
      break;

    case 'PaymentDetails':
      if (!params?.paymentMethod || !params?.totalAmount) {
        return {
          isValid: false,
          message: 'Payment method and total amount are required.',
        };
      }
      break;

    case 'BookingConfirmation':
      if (!params?.bookingId || typeof params.bookingId !== 'string') {
        return {
          isValid: false,
          message: 'Booking ID is required.',
        };
      }
      break;

    case 'TicketView':
      if (!params?.bookingId || typeof params.bookingId !== 'string') {
        return {
          isValid: false,
          message: 'Booking ID is required to view ticket.',
        };
      }
      break;

    case 'AllMovies':
      // Optional parameters, always valid
      break;

    case 'Main':
    case 'FoodSelection':
    case 'BookingSummary':
      // No parameters required
      break;

    default:
      return {
        isValid: false,
        message: `Unknown route: ${routeName}`,
      };
  }

  return {isValid: true};
};

/**
 * Safe navigation to main screen with proper reset
 */
export const navigateToMain = (
  navigation: NavigationProp<RootStackParamList>,
) => {
  try {
    navigation.reset({
      index: 0,
      routes: [{name: 'Main'}],
    });
  } catch (error) {
    console.error('Error navigating to main:', error);
    // Fallback to regular navigation
    navigation.navigate('Main' as never);
  }
};

/**
 * Debounced navigation to prevent multiple rapid taps
 */
let lastNavigationTime = 0;
const NAVIGATION_DEBOUNCE_TIME = 500; // 500ms

export const debouncedNavigate = (
  navigation: NavigationProp<RootStackParamList>,
  routeName: keyof RootStackParamList,
  params?: any,
  onError?: () => void,
) => {
  const now = Date.now();
  if (now - lastNavigationTime < NAVIGATION_DEBOUNCE_TIME) {
    console.log('Navigation debounced');
    return false;
  }

  lastNavigationTime = now;
  return safeNavigate(navigation, routeName, params, onError);
};
