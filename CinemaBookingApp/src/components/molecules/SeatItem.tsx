import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Typography} from '../../components/atoms';
import {Seat} from '../../types';
import {colors} from '../../theme';

interface SeatItemProps {
  seat: Seat;
  onPress: (seat: Seat) => void;
  isLocked?: boolean;
}

export const SeatItem: React.FC<SeatItemProps> = ({
  seat,
  onPress,
  isLocked = false,
}) => {
  const getSeatStyle = () => {
    if (seat.isPurchased) {
      return styles.purchased;
    }
    if (!seat.isAvailable) {
      return styles.unavailable;
    }
    if (isLocked) {
      return styles.locked;
    }
    if (seat.isSelected) {
      return styles.selected;
    }
    return styles[seat.type];
  };

  const getSeatTextColor = () => {
    if (seat.isPurchased || !seat.isAvailable || isLocked || seat.isSelected) {
      return colors.seatTextLight; // Fixed: was '#fff'
    }
    return colors.seatTextDark; // Fixed: was '#333' (invisible in dark mode)
  };

  const isDisabled = seat.isPurchased || !seat.isAvailable || isLocked;

  return (
    <TouchableOpacity
      style={[styles.seat, getSeatStyle()]}
      onPress={() => !isDisabled && onPress(seat)}
      disabled={isDisabled}>
      <Typography variant="caption" color={getSeatTextColor()}>
        {seat.isPurchased ? 'X' : seat.number}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  seat: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    borderWidth: 1,
  },
  standard: {
    backgroundColor: colors.seatStandard, // Fixed: was '#f5f5f5' (invisible in dark)
    borderColor: colors.seatBorder, // Fixed: was '#ddd' (invisible in dark)
  },
  premium: {
    backgroundColor: colors.seatPremium, // Fixed: was '#fff3cd' (invisible in dark)
    borderColor: colors.seatBorder, // Fixed: was '#ffeaa7' (invisible in dark)
  },
  vip: {
    backgroundColor: colors.seatVip, // Fixed: was '#d1ecf1' (invisible in dark)
    borderColor: colors.seatBorder, // Fixed: was '#bee5eb' (invisible in dark)
  },
  selected: {
    backgroundColor: colors.seatSelected, // Fixed: was '#e50914'
    borderColor: colors.seatBorderSelected, // Fixed: was '#e50914'
  },
  unavailable: {
    backgroundColor: colors.seatOccupied, // Fixed: was '#6c757d'
    borderColor: colors.seatOccupied, // Fixed: was '#6c757d'
  },
  purchased: {
    backgroundColor: colors.error, // Use error color to clearly mark purchased seats
    borderColor: colors.error,
  },
  locked: {
    backgroundColor: colors.seatLocked, // Fixed: was '#fd7e14'
    borderColor: colors.seatLocked, // Fixed: was '#fd7e14'
  },
});
