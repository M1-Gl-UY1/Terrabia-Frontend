import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  description: string;
  logo: ImageSourcePropType;
  hero: ImageSourcePropType;
  primaryCta?: React.ReactNode;
  showLogo?: boolean;
};

export default function OnboardingSlide({
  title,
  description,
  logo,
  hero,
  primaryCta,
  showLogo = true,
}: Props) {
  return (
    <View style={styles.slide}>
      <Image source={hero} style={styles.hero} resizeMode="cover" />
      <View style={styles.card}>
        {showLogo && (
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {primaryCta}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  hero: {
    width: '100%',
    height: '45%',
  },
  card: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    minHeight: '60%',
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 16,
    alignSelf: 'center',
    tintColor: '#F27A22',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
});


