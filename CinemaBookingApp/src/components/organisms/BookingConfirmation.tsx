import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Typography} from '../atoms/Typography';
import {Button} from '../atoms/Button';
import {colors} from '../../theme/colors';

interface BookingConfirmationProps {
  bookingId: string;
  onMainMenu: () => void;
  onViewTicket: () => void;
  disabled?: boolean;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingId,
  onMainMenu,
  onViewTicket,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.successIcon}>
          <Typography variant="h1" style={styles.checkmark}>
            ✓
          </Typography>
        </View>
      </View>

      {/* Success Message */}
      <View style={styles.messageContainer}>
        <Typography variant="h2" style={styles.title}>
          Congratulations!
        </Typography>
        <Typography
          variant="body"
          color={colors.descriptionText}
          style={styles.message}>
          Your ticket purchase is successful, a confirmation has been sent to
          your e-mail
        </Typography>
      </View>

      {/* Booking ID */}
      <View style={styles.bookingIdContainer}>
        <Typography
          variant="caption"
          color={colors.captionText}
          style={styles.bookingIdLabel}>
          Booking ID
        </Typography>
        <Typography variant="body" style={styles.bookingId}>
          {bookingId}
        </Typography>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <Button
          title="📧 Main menu"
          onPress={onMainMenu}
          disabled={disabled}
          variant="outline"
          size="large"
          style={[styles.button, styles.outlineButton]}
        />
        <Button
          title="🎫 View ticket"
          onPress={onViewTicket}
          disabled={disabled}
          size="large"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: colors.titlePrimary,
    fontSize: 48,
    fontWeight: '700',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: colors.titlePrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  bookingIdContainer: {
    alignItems: 'center',
    marginBottom: 48,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bookingIdLabel: {
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bookingId: {
    color: colors.titlePrimary,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2,
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: colors.text,
    borderWidth: 1,
  },
});
