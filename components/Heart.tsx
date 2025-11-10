import React from 'react';
import { StyleSheet, View } from 'react-native';

type HeartProps = {
  filled: boolean;
  size?: number;
};

export function Heart({ filled, size = 28 }: HeartProps) {
  // Pixel art heart - diseño más grande y visible
  const pixelSize = size / 14; // 14 píxeles de ancho
  
  const renderPixel = (x: number, y: number) => (
    <View
      key={`${x}-${y}`}
      style={[
        styles.pixel,
        {
          left: x * pixelSize,
          top: y * pixelSize,
          width: pixelSize,
          height: pixelSize,
        },
        filled && styles.pixelFilled,
      ]}
    />
  );

  // Patrón del corazón en pixel art (8x8 grid) - diseño mejorado
  const heartPattern = [
    [0, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.heart}>
        {heartPattern.map((row, y) =>
          row.map((pixel, x) => pixel === 1 && renderPixel(x, y))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heart: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  pixel: {
    position: 'absolute',
    backgroundColor: '#333',
    borderRadius: 0,
  },
  pixelFilled: {
    backgroundColor: '#ff1744',
    borderWidth: 0.5,
    borderColor: '#ff6b9d',
    shadowColor: '#ff1744',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 4,
  },
});

