import React, {useState, useCallback, useMemo} from 'react';
import {View, ScrollView, FlatList, StyleSheet} from 'react-native';
import {Typography} from '../atoms/Typography';
import {Button} from '../atoms/Button';
import {PriceDisplay} from '../atoms/PriceDisplay';
import {CategoryTab} from '../molecules/CategoryTab';
import {FoodItemCard} from '../molecules/FoodItemCard';
import {FoodItem} from '../../types';
import {colors} from '../../theme/colors';

interface FoodSelection {
  [itemId: string]: number;
}

interface FoodCategoriesProps {
  foodItems: FoodItem[];
  selectedItems: FoodSelection;
  onSelectionChange: (itemId: string, quantity: number) => void;
  onConfirm: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const CATEGORIES = [
  {key: 'Combo', label: 'Combo'},
  {key: 'Food', label: 'Food/Snacks'},
  {key: 'Drink', label: 'Beverages'},
];

export const FoodCategories: React.FC<FoodCategoriesProps> = ({
  foodItems,
  selectedItems,
  onSelectionChange,
  onConfirm,
  onSkip,
  isLoading = false,
  disabled = false,
}) => {
  const [activeCategory, setActiveCategory] = useState('Combo');

  // Group items by category
  const itemsByCategory = useMemo(() => {
    return foodItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, FoodItem[]>);
  }, [foodItems]);

  // Calculate totals
  const {totalItems, totalAmount} = useMemo(() => {
    let items = 0;
    let amount = 0;

    Object.entries(selectedItems).forEach(([itemId, quantity]) => {
      if (quantity > 0) {
        const item = foodItems.find(f => f.id === itemId);
        if (item) {
          items += quantity;
          amount += item.price * quantity;
        }
      }
    });

    return {totalItems: items, totalAmount: amount};
  }, [selectedItems, foodItems]);

  // Get count of selected items for each category
  const getCategoryCount = useCallback(
    (category: string): number => {
      const categoryItems = itemsByCategory[category] || [];
      return categoryItems.reduce((count, item) => {
        return count + (selectedItems[item.id] || 0);
      }, 0);
    },
    [itemsByCategory, selectedItems],
  );

  const handleCategoryPress = useCallback((category: string) => {
    console.log('🍿 FoodCategories: Switching to category:', category);
    setActiveCategory(category);
  }, []);

  const handleQuantityChange = useCallback(
    (itemId: string, quantity: number) => {
      console.log(
        '🍿 FoodCategories: Quantity changed for item:',
        itemId,
        'quantity:',
        quantity,
      );
      onSelectionChange(itemId, quantity);
    },
    [onSelectionChange],
  );

  const handleConfirm = useCallback(() => {
    console.log(
      '🍿 FoodCategories: Confirming selection with',
      totalItems,
      'items, total:',
      totalAmount,
    );
    onConfirm();
  }, [onConfirm, totalItems, totalAmount]);

  const handleSkip = useCallback(() => {
    console.log('🍿 FoodCategories: Skipping food selection');
    if (onSkip) {
      onSkip();
    }
  }, [onSkip]);

  const renderCategoryTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tabsContainer}
      contentContainerStyle={styles.tabsContent}>
      {CATEGORIES.map(category => (
        <CategoryTab
          key={category.key}
          title={category.label}
          isActive={activeCategory === category.key}
          onPress={() => handleCategoryPress(category.key)}
          count={getCategoryCount(category.key)}
          disabled={disabled}
        />
      ))}
    </ScrollView>
  );

  const renderFoodItem = ({item}: {item: FoodItem}) => (
    <View style={styles.itemContainer}>
      <FoodItemCard
        item={item}
        quantity={selectedItems[item.id] || 0}
        onQuantityChange={quantity => handleQuantityChange(item.id, quantity)}
        disabled={disabled}
      />
    </View>
  );

  const currentCategoryItems = itemsByCategory[activeCategory] || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h2" style={styles.title}>
          Beverages & Food
        </Typography>
        {onSkip && (
          <Button
            title="Skip"
            onPress={handleSkip}
            variant="outline"
            size="small"
            disabled={disabled || isLoading}
            style={styles.skipButton}
          />
        )}
      </View>

      {/* Category Tabs */}
      {renderCategoryTabs()}

      {/* Food Items List */}
      <FlatList
        data={currentCategoryItems}
        renderItem={renderFoodItem}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />

      {/* Footer with totals and confirm button */}
      {totalItems > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Typography variant="body" style={styles.totalLabel}>
              ITEM
            </Typography>
            <Typography variant="body" style={styles.totalLabel}>
              SUB-TOTAL
            </Typography>
          </View>
          <View style={styles.totalValues}>
            <Typography variant="h3" color={colors.text}>
              {totalItems}
            </Typography>
            <PriceDisplay
              price={totalAmount}
              size="large"
              variant="default"
            />
          </View>
        </View>
      )}

      <Button
        title="Confirm"
        onPress={handleConfirm}
        disabled={disabled || isLoading}
        loading={isLoading}
        size="large"
        style={styles.confirmButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.titlePrimary,
  },
  skipButton: {
    minWidth: 80,
  },
  tabsContainer: {
    maxHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    flex: 0.5,
    marginHorizontal: 4,
  },
  row: {
    justifyContent: 'space-between',
  },
  footer: {
    backgroundColor: colors.surface,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    color: colors.textSubtle,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  totalValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmButton: {
    margin: 16,
    marginTop: 0,
  },
});
