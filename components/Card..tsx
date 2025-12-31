import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export interface CardProps {
  children?: ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
  colors?: string[];
}

export function Card({ 
  children, 
  style, 
  gradient = false, 
  colors = ['#ffffff', '#fbfbff'] 
}: CardProps = {}): JSX.Element {
  const gradientColors = colors as [ColorValue, ColorValue, ...ColorValue[]];
  
  if (gradient) {
    return (
      <LinearGradient
        colors={gradientColors}
        style={[styles.card, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
  },
});
