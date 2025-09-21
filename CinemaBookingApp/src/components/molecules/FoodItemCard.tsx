import React, {useState} from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Typography} from '../atoms/Typography';
import {PriceDisplay} from '../atoms/PriceDisplay';
import {QuantitySelector} from '../atoms/QuantitySelector';
import {FoodItem} from '../../types';
import {colors} from '../../theme/colors';

interface FoodItemCardProps {
  item: FoodItem;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({
  item,
  quantity,
  onQuantityChange,
  onPress,
  disabled = false,
  style,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  const handleDecrease = () => {
    onQuantityChange(Math.max(0, quantity - 1));
  };

  const handleCardPress = () => {
    if (onPress && !disabled) {
      onPress();
    }
  };

  const handleImageError = () => {
    console.log('🖼️ Image failed to load for:', item.name);
    setImageError(true);
  };

  const getPlaceholderEmoji = () => {
    switch (item.category) {
      case 'Combo':
        return '🍿';
      case 'Food':
        if (item.name.toLowerCase().includes('popcorn')) return '🍿';
        if (item.name.toLowerCase().includes('nachos')) return '🌮';
        if (item.name.toLowerCase().includes('hot dog')) return '🌭';
        if (item.name.toLowerCase().includes('chicken')) return '🍗';
        if (item.name.toLowerCase().includes('fries')) return '🍟';
        if (item.name.toLowerCase().includes('pretzel')) return '🥨';
        if (item.name.toLowerCase().includes('candy') || item.name.toLowerCase().includes('m&m') || item.name.toLowerCase().includes('sour')) return '🍬';
        return '🍕';
      case 'Drink':
        if (item.name.toLowerCase().includes('cola') || item.name.toLowerCase().includes('coke')) return '🥤';
        if (item.name.toLowerCase().includes('coffee')) return '☕';
        if (item.name.toLowerCase().includes('water')) return '💧';
        if (item.name.toLowerCase().includes('tea')) return '🧊';
        if (item.name.toLowerCase().includes('energy')) return '⚡';
        return '🥤';
      default:
        return '🍿';
    }
  };

  const containerStyle = [
    styles.container,
    disabled && styles.containerDisabled,
    quantity > 0 && styles.containerSelected,
    style,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handleCardPress}
      disabled={disabled}
      activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {!imageError && item.image ? (
          <Image
            source={{uri: item.image}}
            style={styles.image}
            resizeMode="cover"
            onError={handleImageError}
            onLoadStart={() => console.log('🖼️ Loading image for:', item.name)}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Typography style={styles.placeholderEmoji}>
              {getPlaceholderEmoji()}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary} style={styles.placeholderText}>
              {item.category}
            </Typography>
          </View>
        )}
        {quantity > 0 && (
          <View style={styles.quantityBadge}>
            <Typography variant="caption" color="#fff" style={styles.badgeText}>
              {quantity}
            </Typography>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Typography variant="body" numberOfLines={2} style={styles.name}>
            {item.name}
          </Typography>

          {item.category === 'Combo' && (
            <View style={styles.comboBadge}>
              <Typography
                variant="caption"
                color="#fff"
                style={styles.comboText}>
                COMBO
              </Typography>
            </View>
          )}
        </View>

        <Typography
          variant="caption"
          color={colors.descriptionText}
          numberOfLines={2}
          style={styles.description}>
          {item.description}
        </Typography>

        <View style={styles.footer}>
          <PriceDisplay
            price={item.price}
            size="medium"
            variant="default"
          />

          <QuantitySelector
            quantity={quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            disabled={disabled}
            size="small"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  containerSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  placeholderContainer: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeholderEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  placeholderText: {
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  quantityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontWeight: '600',
    marginRight: 8,
    color: colors.titlePrimary,
  },
  comboBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  comboText: {
    fontSize: 10,
    fontWeight: '700',
  },
  description: {
    marginBottom: 12,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
