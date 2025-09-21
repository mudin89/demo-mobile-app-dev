import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Typography} from '../atoms/Typography';
import {PriceFilter} from '../atoms/PriceFilter';
import {colors} from '../../theme';

interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

interface PriceFilterSelectorProps {
  priceRanges: PriceRange[];
  selectedRangeId?: string;
  onRangeSelect?: (rangeId: string) => void;
  disabled?: boolean;
}

const DEFAULT_PRICE_RANGES: PriceRange[] = [
  {id: 'all', label: 'All Prices', min: 0, max: Infinity},
  {id: 'low', label: 'RM10 - RM20', min: 10, max: 20},
  {id: 'mid', label: 'RM20 - RM50', min: 20, max: 50},
];

export const PriceFilterSelector: React.FC<PriceFilterSelectorProps> = ({
  priceRanges = DEFAULT_PRICE_RANGES,
  selectedRangeId = 'all',
  onRangeSelect,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <Typography variant="h3" style={styles.title}>
        Price Range
      </Typography>
      <View style={styles.filtersContainer}>
        {priceRanges.map(range => (
          <PriceFilter
            key={range.id}
            label={range.label}
            isSelected={selectedRangeId === range.id}
            onPress={() => onRangeSelect?.(range.id)}
            disabled={disabled}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    marginBottom: 12,
    color: colors.text,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
