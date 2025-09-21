import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Typography} from '../atoms/Typography';
import {colors} from '../../theme/colors';

interface TicketType {
  type: '2D' | 'IMAX';
  price: number;
  description: string;
}

interface TicketTypeSelectorProps {
  ticketTypes: TicketType[];
  selectedType?: '2D' | 'IMAX';
  onSelect: (type: '2D' | 'IMAX') => void;
  disabled?: boolean;
}

export const TicketTypeSelector: React.FC<TicketTypeSelectorProps> = ({
  ticketTypes,
  selectedType,
  onSelect,
  disabled = false,
}) => {
  const handleSelect = (type: '2D' | 'IMAX') => {
    if (!disabled) {
      console.log('🎫 TicketTypeSelector: Type selected:', type);
      onSelect(type);
    }
  };

  return (
    <View style={styles.container}>
      <Typography variant="h3" style={styles.title}>
        Ticket Type
      </Typography>

      <View style={styles.typesList}>
        {ticketTypes.map(ticketType => {
          const isSelected = selectedType === ticketType.type;

          return (
            <TouchableOpacity
              key={ticketType.type}
              style={[
                styles.typeItem,
                isSelected && styles.typeItemSelected,
                disabled && styles.typeItemDisabled,
              ]}
              onPress={() => handleSelect(ticketType.type)}
              disabled={disabled}
              activeOpacity={0.7}>
              <View style={styles.typeContent}>
                <View style={styles.typeInfo}>
                  <Typography
                    variant="body"
                    color={isSelected ? '#fff' : colors.titlePrimary}
                    style={styles.typeName}>
                    {ticketType.type}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={isSelected ? '#fff' : colors.descriptionText}
                    style={styles.typeDescription}>
                    {ticketType.description}
                  </Typography>
                </View>

                <View style={styles.priceContainer}>
                  <Typography
                    variant="body"
                    color={isSelected ? '#fff' : colors.primary}
                    style={styles.priceText}>
                    RM{ticketType.price.toFixed(0)}
                  </Typography>
                </View>
              </View>

              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Typography
                    variant="caption"
                    color="#fff"
                    style={styles.checkmark}>
                    ✓
                  </Typography>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    marginBottom: 16,
    color: colors.titlePrimary,
  },
  typesList: {
    gap: 12,
  },
  typeItem: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    position: 'relative',
  },
  typeItemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeItemDisabled: {
    opacity: 0.5,
  },
  typeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeInfo: {
    flex: 1,
  },
  typeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 12,
    fontWeight: '700',
  },
});
