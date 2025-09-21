import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {BottomTabNavigator} from './BottomTabNavigator';
import {colors} from '../theme';

import {MovieDetailsScreen} from '../screens/Movie/MovieDetailsScreen';
import {AllMoviesScreen} from '../screens/Movie/AllMoviesScreen';
import {SessionSelectionScreen} from '../screens/Movie/SessionSelectionScreen';
import {SeatSelectionScreen} from '../screens/Seat/SeatSelectionScreen';
import {FoodSelectionScreen} from '../screens/Food/FoodSelectionScreen';
import {BookingSummaryScreen} from '../screens/Booking/BookingSummaryScreen';
import {PaymentMethodScreen} from '../screens/Payment/PaymentMethodScreen';
import {PaymentDetailsScreen} from '../screens/Payment/PaymentDetailsScreen';
import {BookingConfirmationScreen} from '../screens/Booking/BookingConfirmationScreen';
import {TicketViewScreen} from '../screens/Booking/TicketViewScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.headerBackground,
          },
          headerTintColor: colors.text, // White text for contrast on black
          headerTitleStyle: {
            fontWeight: 'bold',
            color: colors.text, // Explicitly set white text
          },
        }}>
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AllMovies"
          component={AllMoviesScreen}
          options={{
            title: 'All Movies',
          }}
        />
        <Stack.Screen
          name="MovieDetails"
          component={MovieDetailsScreen}
          options={{
            title: 'Movie Details',
          }}
        />
        <Stack.Screen
          name="SessionSelection"
          component={SessionSelectionScreen}
          options={{
            title: 'Book Ticket',
          }}
        />
        <Stack.Screen
          name="SeatSelection"
          component={SeatSelectionScreen}
          options={{
            title: 'Select Seats',
          }}
        />
        <Stack.Screen
          name="FoodSelection"
          component={FoodSelectionScreen}
          options={{
            title: 'Food & Beverages',
            headerStyle: {
              backgroundColor: colors.headerBackground,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              color: colors.text,
            },
          }}
        />
        <Stack.Screen
          name="BookingSummary"
          component={BookingSummaryScreen}
          options={{
            title: 'Booking Summary',
          }}
        />
        <Stack.Screen
          name="PaymentMethod"
          component={PaymentMethodScreen}
          options={{
            title: 'Payment',
            headerStyle: {
              backgroundColor: colors.headerBackground,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              color: colors.text,
            },
          }}
        />
        <Stack.Screen
          name="PaymentDetails"
          component={PaymentDetailsScreen}
          options={{
            title: 'Payment Details',
            headerStyle: {
              backgroundColor: colors.headerBackground,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              color: colors.text,
            },
          }}
        />
        <Stack.Screen
          name="BookingConfirmation"
          component={BookingConfirmationScreen}
          options={{
            title: 'Booking Confirmed',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TicketView"
          component={TicketViewScreen}
          options={{
            title: 'Your Ticket',
            headerStyle: {
              backgroundColor: colors.headerBackground,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              color: colors.text,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
