import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Typography} from '../atoms/Typography';
import {colors} from '../../theme';

interface WelcomeMessageProps {
  userName?: string;
  greeting?: string;
  subtitle?: string;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  userName = 'Raymond',
  greeting = 'Hello',
  subtitle = 'Want to see a movies? Get your ticket today',
}) => {
  return (
    <View style={styles.container}>
      <Typography variant="h3" color={colors.text} style={styles.greeting}>
        {greeting}, {userName}
      </Typography>
      <Typography
        variant="body"
        color={colors.textSecondary}
        style={styles.subtitle}>
        {subtitle}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  greeting: {
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
});
