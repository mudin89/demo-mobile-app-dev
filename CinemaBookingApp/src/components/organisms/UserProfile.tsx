import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ProfilePicture} from '../atoms/ProfilePicture';
import {Typography} from '../atoms/Typography';
import {MembershipCard} from '../molecules/MembershipCard';
import {colors} from '../../theme/colors';

interface UserProfileProps {
  userName: string;
  userImageUri?: string;
  fullName: string;
  memberSince: string;
  memberPoints: number;
  onProfilePress?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userName,
  userImageUri,
  fullName,
  memberSince,
  memberPoints,
  onProfilePress,
}) => {
  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profilePicture}>
          <ProfilePicture
            imageUri={userImageUri}
            name={userName}
            size={120}
            onPress={onProfilePress}
          />
        </View>
        <Typography
          variant="h2"
          color={colors.titlePrimary}
          style={styles.welcomeText}
        >
          Welcome, {userName}!
        </Typography>
        <Typography
          variant="body"
          color={colors.textSecondary}
          style={styles.subText}
        >
          Manage your account and preferences
        </Typography>
      </View>

      {/* Membership Information */}
      <MembershipCard
        fullName={fullName}
        memberSince={memberSince}
        memberPoints={memberPoints}
        style={styles.membershipCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: colors.headerBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profilePicture: {
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  welcomeText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    textAlign: 'center',
    fontSize: 14,
  },
  membershipCard: {
    marginTop: 24,
  },
});