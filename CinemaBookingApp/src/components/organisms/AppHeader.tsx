import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {ProfilePicture, NotificationIcon} from '../atoms';
import {WelcomeMessage} from '../molecules';
import {colors} from '../../theme';

interface AppHeaderProps {
  userName?: string;
  userImageUri?: string;
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  hasNotification?: boolean;
  notificationCount?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  userName = 'Raymond',
  userImageUri,
  onProfilePress,
  onNotificationPress,
  hasNotification = false,
  notificationCount = 0,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <ProfilePicture
            imageUri={userImageUri}
            name={userName}
            size={40}
            onPress={onProfilePress}
          />
        </View>

        <View style={styles.centerSection}>
          <WelcomeMessage userName={userName} />
        </View>

        <View style={styles.rightSection}>
          <NotificationIcon
            onPress={onNotificationPress}
            hasNotification={hasNotification}
            notificationCount={notificationCount}
            size={24}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftSection: {
    width: 48,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    paddingHorizontal: 12,
  },
  rightSection: {
    width: 48,
    alignItems: 'flex-end',
  },
});
