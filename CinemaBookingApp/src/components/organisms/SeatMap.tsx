import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Typography} from '../../components/atoms';
import {SeatItem} from '../../components/molecules';
import {Seat} from '../../types';
import {colors} from '../../theme/colors';

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: Seat[];
  onSeatPress: (seat: Seat) => void;
  userId: string;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  selectedSeats,
  onSeatPress,
  userId,
}) => {
  const groupSeatsByRow = (seats: Seat[]) => {
    const grouped: {[key: string]: Seat[]} = {};
    seats.forEach(seat => {
      if (!grouped[seat.row]) {
        grouped[seat.row] = [];
      }
      grouped[seat.row].push(seat);
    });

    Object.keys(grouped).forEach(row => {
      grouped[row].sort((a, b) => a.number - b.number);
    });

    return grouped;
  };

  const seatRows = groupSeatsByRow(seats);
  const rows = Object.keys(seatRows).sort();

  const isSeatLocked = (seat: Seat) => {
    if (!seat.lockedBy || !seat.lockedUntil) {
      return false;
    }
    if (seat.lockedBy === userId) {
      return false;
    }
    return new Date(seat.lockedUntil) > new Date();
  };

  const renderLegend = () => (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <View style={[styles.legendSeat, styles.available]} />
        <Typography variant="caption" color={colors.textSecondary}>
          Available
        </Typography>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendSeat, styles.selected]} />
        <Typography variant="caption" color={colors.textSecondary}>
          Selected
        </Typography>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendSeat, styles.unavailable]} />
        <Typography variant="caption" color={colors.textSecondary}>
          Taken
        </Typography>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendSeat, styles.locked]} />
        <Typography variant="caption" color={colors.textSecondary}>
          Locked
        </Typography>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.screen}>
        <Typography
          variant="body"
          color={colors.textSecondary}
          style={styles.screenText}>
          SCREEN
        </Typography>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.horizontalScroll}>
        <View style={styles.seatMap}>
          {rows.map(row => (
            <View key={row} style={styles.row}>
              <Typography
                variant="caption"
                color={colors.textSecondary}
                style={styles.rowLabel}>
                {row}
              </Typography>
              <View style={styles.seats}>
                {seatRows[row].map(seat => {
                  const isSelected = selectedSeats.some(s => s.id === seat.id);
                  const seatWithSelection = {...seat, isSelected};

                  return (
                    <SeatItem
                      key={seat.id}
                      seat={seatWithSelection}
                      onPress={onSeatPress}
                      isLocked={isSeatLocked(seat)}
                    />
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {renderLegend()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  horizontalScroll: {
    maxHeight: 400,
  },
  screen: {
    height: 40,
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginHorizontal: 32,
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  screenText: {
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    minWidth: '100%',
  },
  seatMap: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  rowLabel: {
    width: 20,
    textAlign: 'center',
    marginRight: 8,
    fontWeight: '600',
  },
  seats: {
    flexDirection: 'row',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
  },
  legendItem: {
    alignItems: 'center',
  },
  legendSeat: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginBottom: 4,
    borderWidth: 1,
  },
  available: {
    backgroundColor: colors.seatStandard,
    borderColor: colors.border,
  },
  selected: {
    backgroundColor: colors.seatSelected,
    borderColor: colors.seatSelected,
  },
  unavailable: {
    backgroundColor: colors.seatOccupied,
    borderColor: colors.seatOccupied,
  },
  locked: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
});
