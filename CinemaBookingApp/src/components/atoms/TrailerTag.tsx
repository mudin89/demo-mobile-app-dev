import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Typography} from './Typography';
import {colors} from '../../theme';

interface TrailerTagProps {
  text?: string;
}

export const TrailerTag: React.FC<TrailerTagProps> = ({text = 'TRAILER'}) => {
  return (
    <View style={styles.container}>
      <Typography variant="caption" color={colors.text} style={styles.text}>
        {text}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
