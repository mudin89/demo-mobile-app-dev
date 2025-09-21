import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BookingConfirmation} from '../../components/organisms/BookingConfirmation';
import {RootStackParamList} from '../../navigation/types';
import {colors} from '../../theme';

type BookingConfirmationRouteProp = RouteProp<
  RootStackParamList,
  'BookingConfirmation'
>;
type BookingConfirmationNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BookingConfirmation'
>;

export const BookingConfirmationScreen: React.FC = () => {
  const route = useRoute<BookingConfirmationRouteProp>();
  const navigation = useNavigation<BookingConfirmationNavigationProp>();
  const {bookingId} = route.params;

  const handleMainMenu = useCallback(() => {
    console.log('🏠 BookingConfirmationScreen: Navigating to main menu');
    // Reset navigation stack to Main
    navigation.reset({
      index: 0,
      routes: [{name: 'Main'}],
    });
  }, [navigation]);

  const handleViewTicket = useCallback(() => {
    console.log(
      '🎫 BookingConfirmationScreen: Viewing ticket for booking:',
      bookingId,
    );
    navigation.navigate('TicketView', {bookingId});
  }, [bookingId, navigation]);

  return (
    <View style={styles.container}>
      <BookingConfirmation
        bookingId={bookingId}
        onMainMenu={handleMainMenu}
        onViewTicket={handleViewTicket}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
