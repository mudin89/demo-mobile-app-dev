import React, {useState, useCallback, useMemo} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Typography} from '../atoms/Typography';
import {Button} from '../atoms/Button';
import {TimeSlot} from '../atoms/TimeSlot';
import {Dropdown} from '../atoms/Dropdown';
import {DatePicker} from '../atoms/DatePicker';
import {Cinema, Movie} from '../../types';
import {colors} from '../../theme/colors';

interface SessionDetails {
  cinemaId: string;
  location: string;
  cinemaBrand: string;
  date: string;
  timeSlot: string;
}

interface SessionBookingProps {
  movie: Movie;
  cinemas: Cinema[];
  onContinue: (sessionDetails: SessionDetails) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

interface TimeSlotOption {
  time: string;
  price: number;
  isAvailable: boolean;
}

const TIME_SLOTS: TimeSlotOption[] = [
  {time: '9:20AM', price: 15, isAvailable: true},
  {time: '11:40AM', price: 20, isAvailable: true},
  {time: '1:20PM', price: 25, isAvailable: true},
  {time: '3:30PM', price: 30, isAvailable: true},
  {time: '5:40PM', price: 35, isAvailable: true},
  {time: '7:30PM', price: 40, isAvailable: true},
  {time: '9:20PM', price: 45, isAvailable: true},
];

type PriceFilter = 'all' | 'low' | 'high';

interface PriceRange {
  label: string;
  filter: PriceFilter;
  min: number;
  max: number;
}

export const SessionBooking: React.FC<SessionBookingProps> = ({
  movie,
  cinemas,
  onContinue,
  isLoading = false,
  disabled = false,
}) => {
  // Fixed: Removed ticket type and number selection
  const [_selectedCinema, setSelectedCinema] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedCinemaBrand, setSelectedCinemaBrand] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedPriceFilter, setSelectedPriceFilter] =
    useState<PriceFilter>('all');

  // Price filter options
  const priceRanges: PriceRange[] = [
    {label: 'All Prices', filter: 'all', min: 0, max: 999},
    {label: 'RM 15 - RM 25', filter: 'low', min: 15, max: 25},
    {label: 'RM 26 - RM 50', filter: 'high', min: 26, max: 50},
  ];

  // Filter time slots based on selected price filter
  const filteredTimeSlots = useMemo(() => {
    if (selectedPriceFilter === 'all') {
      return TIME_SLOTS;
    }

    const selectedRange = priceRanges.find(
      range => range.filter === selectedPriceFilter,
    );
    if (!selectedRange) {
      return TIME_SLOTS;
    }

    return TIME_SLOTS.filter(
      slot =>
        slot.price >= selectedRange.min && slot.price <= selectedRange.max,
    );
  }, [selectedPriceFilter]);

  // Get unique locations
  const locationOptions = useMemo(() => {
    const locations = [...new Set(cinemas.map(cinema => cinema.location))];
    return locations.map(location => ({
      label: location.includes('KLCC')
        ? 'KLCC'
        : location.includes('Mid Valley')
        ? 'Mid Valley'
        : location.includes('Utama')
        ? 'One Utama'
        : location,
      value: location,
    }));
  }, [cinemas]);

  // Get cinema brands filtered by selected location
  const cinemaBrandOptions = useMemo(() => {
    if (!selectedLocation) {
      return [];
    }

    const availableBrands = cinemas
      .filter(cinema => cinema.location === selectedLocation)
      .map(cinema => cinema.brand);

    const uniqueBrands = [...new Set(availableBrands)];
    return uniqueBrands.map(brand => ({
      label: brand,
      value: brand,
    }));
  }, [cinemas, selectedLocation]);

  // Get final cinema options based on location and brand
  const availableCinemas = useMemo(() => {
    if (!selectedLocation || !selectedCinemaBrand) {
      return [];
    }

    return cinemas.filter(
      cinema =>
        cinema.location === selectedLocation &&
        cinema.brand === selectedCinemaBrand,
    );
  }, [cinemas, selectedLocation, selectedCinemaBrand]);

  // Check if all required fields are selected
  const canContinue = useMemo(() => {
    return (
      selectedLocation &&
      selectedCinemaBrand &&
      selectedDate &&
      selectedTimeSlot &&
      availableCinemas.length > 0
    );
  }, [
    selectedLocation,
    selectedCinemaBrand,
    selectedDate,
    selectedTimeSlot,
    availableCinemas,
  ]);

  const handleLocationSelect = useCallback((location: string) => {
    console.log('📍 SessionBooking: Location selected:', location);
    setSelectedLocation(location);
    setSelectedCinemaBrand(''); // Reset cinema brand when location changes
    setSelectedCinema('');
  }, []);

  const handleCinemaBrandSelect = useCallback((brand: string) => {
    console.log('🏢 SessionBooking: Cinema brand selected:', brand);
    setSelectedCinemaBrand(brand);
    setSelectedCinema('');
  }, []);

  const handleDateSelect = useCallback((date: string) => {
    console.log('📅 SessionBooking: Date selected:', date);
    setSelectedDate(date);
  }, []);

  const handleTimeSlotSelect = useCallback((timeSlot: string) => {
    console.log('⏰ SessionBooking: Time slot selected:', timeSlot);
    setSelectedTimeSlot(timeSlot);
  }, []);

  const handlePriceFilterSelect = useCallback(
    (filter: PriceFilter) => {
      console.log('💰 SessionBooking: Price filter selected:', filter);
      setSelectedPriceFilter(filter);

      // Clear selected time slot if it doesn't exist in the new filter
      setSelectedTimeSlot(currentSlot => {
        if (!currentSlot) return currentSlot;

        // Calculate filtered slots for the new filter
        let newFilteredSlots = TIME_SLOTS;
        if (filter !== 'all') {
          const selectedRange = priceRanges.find(
            range => range.filter === filter,
          );
          if (selectedRange) {
            newFilteredSlots = TIME_SLOTS.filter(
              slot =>
                slot.price >= selectedRange.min &&
                slot.price <= selectedRange.max,
            );
          }
        }

        // Check if current slot exists in new filtered list
        const isTimeSlotInFilter = newFilteredSlots.some(
          slot => slot.time === currentSlot,
        );
        return isTimeSlotInFilter ? currentSlot : '';
      });
    },
    [priceRanges],
  );

  const handleContinue = useCallback(() => {
    if (canContinue && availableCinemas.length > 0) {
      const selectedCinemaData = availableCinemas[0]; // Use first available cinema

      const sessionDetails: SessionDetails = {
        cinemaId: selectedCinemaData.id,
        location: selectedLocation,
        cinemaBrand: selectedCinemaBrand,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
      };

      console.log(
        '🎬 SessionBooking: Continuing with session details:',
        sessionDetails,
      );
      onContinue(sessionDetails);
    }
  }, [
    canContinue,
    availableCinemas,
    selectedLocation,
    selectedCinemaBrand,
    selectedDate,
    selectedTimeSlot,
    onContinue,
  ]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Movie Info Header */}
        <View style={styles.header}>
          <Typography variant="h2" numberOfLines={2} style={styles.movieTitle}>
            {movie.title}
          </Typography>
          <Typography
            variant="body"
            color={colors.textSecondary}
            style={styles.movieInfo}>
            {movie.type} • {movie.duration}min • {movie.rating}
          </Typography>
        </View>

        {/* Price Filter */}
        <View style={styles.priceFilterSection}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Ticket Price Range
          </Typography>
          <View style={styles.filterButtonsContainer}>
            {priceRanges.map(range => (
              <Button
                key={range.filter}
                title={range.label}
                variant={
                  selectedPriceFilter === range.filter ? 'primary' : 'outline'
                }
                size="small"
                onPress={() => handlePriceFilterSelect(range.filter)}
                disabled={disabled}
                style={styles.filterButton}
              />
            ))}
          </View>
        </View>

        {/* Location Selection */}
        <Dropdown
          label="Location"
          placeholder="Select Location"
          options={locationOptions}
          selectedValue={selectedLocation}
          onSelect={handleLocationSelect}
          disabled={disabled}
        />

        {/* Cinema Hall Selection */}
        <Dropdown
          label="Cinema Hall"
          placeholder="Select Cinema Hall"
          options={cinemaBrandOptions}
          selectedValue={selectedCinemaBrand}
          onSelect={handleCinemaBrandSelect}
          disabled={disabled || !selectedLocation}
        />

        {/* Date Selection */}
        <DatePicker
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          disabled={disabled}
        />

        {/* Available Times */}
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Available Time ({filteredTimeSlots.length} slot
            {filteredTimeSlots.length !== 1 ? 's' : ''})
          </Typography>
          {filteredTimeSlots.length > 0 ? (
            <View style={styles.timeSlotsGrid}>
              {filteredTimeSlots.map(slot => (
                <TimeSlot
                  key={slot.time}
                  time={slot.time}
                  price={slot.price}
                  isSelected={selectedTimeSlot === slot.time}
                  isAvailable={slot.isAvailable}
                  onPress={() => handleTimeSlotSelect(slot.time)}
                  disabled={disabled}
                />
              ))}
            </View>
          ) : (
            <View style={styles.noTimeSlotsContainer}>
              <Typography
                variant="body"
                color={colors.textSecondary}
                style={styles.noTimeSlotsText}>
                No time slots available in the selected price range.
              </Typography>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <Button
          title="Select Seat"
          onPress={handleContinue}
          disabled={!canContinue || disabled || isLoading}
          loading={isLoading}
          size="large"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  movieTitle: {
    marginBottom: 4,
    color: colors.titlePrimary,
  },
  movieInfo: {
    marginBottom: 8,
  },
  section: {
    marginVertical: 16,
  },
  priceFilterSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    color: colors.titlePrimary,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  filterButton: {
    flex: 1,
  },
  noTimeSlotsContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noTimeSlotsText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
