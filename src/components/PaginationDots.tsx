import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  total: number;
  current: number;
  activeColor?: string;
  inactiveColor?: string;
};

export default function PaginationDots({
  total,
  current,
  activeColor = '#F27A22',
  inactiveColor = '#E5E7EB',
}: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === current ? activeColor : inactiveColor,
              width: index === current ? 20 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
});
