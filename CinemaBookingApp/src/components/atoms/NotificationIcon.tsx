import React from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import {Typography} from './Typography';
import {colors} from '../../theme';

interface NotificationIconProps {
  onPress?: () => void;
  hasNotification?: boolean;
  notificationCount?: number;
  size?: number;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({
  onPress,
  hasNotification = false,
  notificationCount = 0,
  size = 24,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconContainer, {width: size, height: size}]}>
        {/* Bell Icon using Unicode */}
        <Typography
          variant="body"
          color={colors.text}
          style={[styles.bellIcon, {fontSize: size * 0.8}]}>
          🔔
        </Typography>

        {hasNotification && (
          <View style={styles.badge}>
            {notificationCount > 0 && notificationCount <= 99 ? (
              <Typography
                variant="caption"
                color={colors.white}
                style={styles.badgeText}>
                {notificationCount > 99 ? '99+' : notificationCount.toString()}
              </Typography>
            ) : (
              <View style={styles.dot} />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellIcon: {
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
});
