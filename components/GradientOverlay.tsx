import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameColors } from '@/constants/gameColors';

/**
 * Componente que renderiza un overlay con gradiente vertical
 * Usa los color stops especificados en la especificación
 */
export function GradientOverlay() {
  return (
    // @ts-expect-error - expo-linear-gradient compatibility with React 19
    <LinearGradient
      colors={GameColors.gradient.colors}
      locations={GameColors.gradient.locations}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    />
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.08, // Opacidad muy baja para que el checkerboard sea más visible
  },
});

