import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type SimpleLogoProps = {
  size?: number;
  showText?: boolean;
  variant?: 'default' | 'minimal';
};

export default function SimpleLogo({ 
  size = 50, 
  showText = true, 
  variant = 'default' 
}: SimpleLogoProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Icône du sac de shopping */}
      <View style={styles.iconContainer}>
        <View style={styles.bagIcon}>
          {/* Anse */}
          <View style={styles.handle} />
          {/* Corps du sac */}
          <View style={styles.body} />
          {/* Ligne décorative */}
          <View style={styles.decorativeLine} />
        </View>
      </View>
      
      {/* Texte KOM-B */}
      {showText && (
        <Text style={[styles.logoText, { fontSize: size * 0.2 }]}>
          <Text style={styles.komText}>KOM-</Text>
          <Text style={styles.bText}>B</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bagIcon: {
    position: 'relative',
    alignItems: 'center',
  },
  handle: {
    width: 18,
    height: 6,
    backgroundColor: '#FFD700',
    borderRadius: 3,
    marginBottom: 2,
  },
  body: {
    width: 22,
    height: 26,
    backgroundColor: '#F27A22',
    borderRadius: 10,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  decorativeLine: {
    position: 'absolute',
    bottom: 8,
    width: 14,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    transform: [{ rotate: '15deg' }],
  },
  logoText: {
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'center',
  },
  komText: {
    color: '#F27A22',
  },
  bText: {
    color: '#6B7280',
  },
});

