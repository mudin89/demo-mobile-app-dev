import React from 'react';
import {View, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {Typography} from './Typography';
import {colors} from '../../theme/colors';

interface DateOption {
  date: string;
  displayDate: string;
  dayName: string;
  isAvailable: boolean;
}

interface DatePickerProps {
  selectedDate?: string;
  onDateSelect: (date: string) => void;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateSelect,
  disabled = false,
}) => {
  // Generate next 7 days
  const generateDates = (): DateOption[] => {
    const dates: DateOption[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dateString = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', {weekday: 'short'});
      const displayDate = date.getDate().toString();

      dates.push({
        date: dateString,
        displayDate,
        dayName,
        isAvailable: true, // For now, all dates are available
      });
    }

    return dates;
  };

  const dates = generateDates();

  const handleDatePress = (date: string) => {
    if (!disabled) {
      console.log('📅 DatePicker: Date selected:', date);
      onDateSelect(date);
    }
  };

  return (
    <View style={styles.container}>
      <Typography variant="h3" style={styles.title}>
        Select a date
      </Typography>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datesContainer}>
        {dates.map(dateOption => {
          const isSelected = selectedDate === dateOption.date;

          return (
            <TouchableOpacity
              key={dateOption.date}
              style={[
                styles.dateItem,
                isSelected && styles.dateItemSelected,
                !dateOption.isAvailable && styles.dateItemDisabled,
                disabled && styles.dateItemDisabled,
              ]}
              onPress={() => handleDatePress(dateOption.date)}
              disabled={disabled || !dateOption.isAvailable}
              activeOpacity={0.7}>
              <Typography
                variant="caption"
                color={isSelected ? '#fff' : colors.textSecondary}
                style={styles.dayName}>
                {dateOption.dayName}
              </Typography>
              <Typography
                variant="h3"
                color={isSelected ? '#fff' : colors.titlePrimary}
                style={styles.dateNumber}>
                {dateOption.displayDate}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  datesContainer: {
    paddingHorizontal: 4,
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minWidth: 60,
  },
  dateItemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateItemDisabled: {
    opacity: 0.5,
    backgroundColor: colors.card,
  },
  dayName: {
    fontSize: 10,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  dateNumber: {
    fontWeight: '700',
  },
});
