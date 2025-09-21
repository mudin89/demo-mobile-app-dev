import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FoodCategories} from '../../components/organisms/FoodCategories';
import {dataService} from '../../services/dataService';
import {useAppDispatch} from '../../store/hooks';
import {addBookingItem} from '../../store/slices/bookingSlice';
import {RootStackParamList} from '../../navigation/types';
import {FoodItem, BookingItem} from '../../types';
import {colors} from '../../theme';

type FoodSelectionNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'FoodSelection'
>;

interface FoodSelection {
  [itemId: string]: number;
}

export const FoodSelectionScreen: React.FC = () => {
  const navigation = useNavigation<FoodSelectionNavigationProp>();
  const dispatch = useAppDispatch();

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<FoodSelection>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);

  // Load food items
  useEffect(() => {
    const loadFoodItems = async () => {
      console.log('🍿 FoodSelectionScreen: Loading food items');
      setIsLoading(true);
      try {
        const items = await dataService.getFoodItems();
        console.log(
          '🍿 FoodSelectionScreen: Loaded',
          items.length,
          'food items',
        );
        setFoodItems(items);
      } catch (error) {
        console.error(
          '❌ FoodSelectionScreen: Error loading food items:',
          error,
        );
        Alert.alert('Error', 'Failed to load food items. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadFoodItems();
  }, []);

  const handleSelectionChange = useCallback(
    (itemId: string, quantity: number) => {
      console.log(
        '🍿 FoodSelectionScreen: Selection changed - Item:',
        itemId,
        'Quantity:',
        quantity,
      );
      setSelectedItems(prev => ({
        ...prev,
        [itemId]: quantity,
      }));
    },
    [],
  );

  const handleConfirm = useCallback(async () => {
    console.log('🍿 FoodSelectionScreen: Confirming food selection');
    setIsConfirming(true);

    try {
      // Convert selected items to booking items
      const bookingItems: BookingItem[] = [];

      Object.entries(selectedItems).forEach(([itemId, quantity]) => {
        if (quantity > 0) {
          const foodItem = foodItems.find(item => item.id === itemId);
          if (foodItem) {
            bookingItems.push({
              type: 'food',
              id: foodItem.id,
              name: foodItem.name,
              price: foodItem.price,
              quantity,
            });
          }
        }
      });

      console.log(
        '🍿 FoodSelectionScreen: Adding',
        bookingItems.length,
        'food items to booking',
      );

      // Add items to booking state
      bookingItems.forEach(item => {
        dispatch(addBookingItem(item));
      });

      // Navigate to booking summary
      navigation.navigate('BookingSummary');
    } catch (error) {
      console.error(
        '❌ FoodSelectionScreen: Error confirming selection:',
        error,
      );
      Alert.alert('Error', 'Failed to add food items. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  }, [selectedItems, foodItems, dispatch, navigation]);

  const handleSkip = useCallback(() => {
    console.log('🍿 FoodSelectionScreen: Skipping food selection');
    // Navigate directly to booking summary without adding any food items
    navigation.navigate('BookingSummary');
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <FoodCategories
          foodItems={[]}
          selectedItems={{}}
          onSelectionChange={() => {}}
          onConfirm={() => {}}
          onSkip={handleSkip}
          isLoading={true}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FoodCategories
        foodItems={foodItems}
        selectedItems={selectedItems}
        onSelectionChange={handleSelectionChange}
        onConfirm={handleConfirm}
        onSkip={handleSkip}
        isLoading={isConfirming}
        disabled={isConfirming}
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
