import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {PaymentMethodSelection} from '../../components/organisms/PaymentMethodSelection';
import {PaymentMethodType} from '../../components/molecules/PaymentMethodCard';
import {RootStackParamList} from '../../navigation/types';
import {colors} from '../../theme';

type PaymentMethodRouteProp = RouteProp<RootStackParamList, 'PaymentMethod'>;
type PaymentMethodNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PaymentMethod'
>;

export const PaymentMethodScreen: React.FC = () => {
  const route = useRoute<PaymentMethodRouteProp>();
  const navigation = useNavigation<PaymentMethodNavigationProp>();
  const {totalAmount} = route.params;

  const handleContinue = useCallback(
    (paymentMethod: PaymentMethodType) => {
      console.log(
        '💰 PaymentMethodScreen: Selected payment method:',
        paymentMethod,
      );
      console.log('💰 PaymentMethodScreen: Total amount:', totalAmount);

      // Navigate to payment details screen
      navigation.navigate('PaymentDetails', {
        paymentMethod,
        totalAmount,
      });
    },
    [totalAmount, navigation],
  );

  return (
    <View style={styles.container}>
      <PaymentMethodSelection
        totalAmount={totalAmount}
        onContinue={handleContinue}
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
