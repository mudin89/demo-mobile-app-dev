import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Typography} from '../atoms/Typography';
import {UserInfoItem} from '../atoms/UserInfoItem';
import {colors} from '../../theme/colors';

interface MembershipCardProps {
  fullName: string;
  memberSince: string;
  memberPoints: number;
  style?: any;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  fullName,
  memberSince,
  memberPoints,
  style,
}) => {
  const formatPoints = (points: number): string => {
    return points.toLocaleString() + ' pts';
  };

  return (
    <View style={[styles.container, style]}>
      <Typography variant="h3" color={colors.titlePrimary} style={styles.title}>
        Membership Details
      </Typography>

      <View style={styles.content}>
        <UserInfoItem label="Full Name" value={fullName} />
        <UserInfoItem label="Member Since" value={memberSince} />
        <UserInfoItem label="Member Points" value={formatPoints(memberPoints)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    gap: 4,
  },
});