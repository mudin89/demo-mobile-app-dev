import React, {useCallback} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {UserProfile} from '../../components/organisms';
import {colors} from '../../theme';

export const SettingsScreen: React.FC = () => {
  // Dummy user data as specified
  const userData = {
    userName: 'Raymond',
    fullName: 'Raymont Renold',
    memberSince: 'August 2018',
    memberPoints: 1200,
    userImageUri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  };

  const handleProfilePress = useCallback(() => {
    console.log('⚙️ SettingsScreen: Profile picture pressed');
    // Future: Navigate to profile editing screen
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <UserProfile
        userName={userData.userName}
        userImageUri={userData.userImageUri}
        fullName={userData.fullName}
        memberSince={userData.memberSince}
        memberPoints={userData.memberPoints}
        onProfilePress={handleProfilePress}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
