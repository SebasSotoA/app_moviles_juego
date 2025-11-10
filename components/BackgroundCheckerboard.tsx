import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { GameColors } from '@/constants/gameColors';

/**
 * Componente que renderiza un fondo con patrón checkerboard
 * Colores: #0B3C1D (base) y variante más clara
 * Optimizado para web y móvil usando un enfoque eficiente
 */
export function BackgroundCheckerboard() {
  // Para web, usar un fondo sólido más eficiente
  // Para móvil, usar patrón sutil
  if (Platform.OS === 'web') {
    return <View style={styles.containerWeb} />;
  }

  // Para móvil, crear un patrón sutil con menos tiles
  const tileSize = 64;
  const tiles: React.ReactNode[] = [];
  const cols = 8;
  const rows = 12;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const isEven = (row + col) % 2 === 0;
      tiles.push(
        <View
          key={`${row}-${col}`}
          style={[
            styles.tile,
            {
              width: tileSize,
              height: tileSize,
              backgroundColor: isEven ? GameColors.backgroundDark : GameColors.backgroundLight,
              left: col * tileSize,
              top: row * tileSize,
            },
          ]}
        />
      );
    }
  }

  return (
    <View style={styles.container}>
      {tiles}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: GameColors.backgroundDark,
  },
  containerWeb: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: GameColors.backgroundDark,
    // En web, el gradiente overlay proporciona suficiente variación visual
  },
  tile: {
    position: 'absolute',
  },
});

