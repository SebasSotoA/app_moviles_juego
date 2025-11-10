import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

/**
 * Componente que renderiza un grid 2x2 de cartas
 * Usa Back Blue 1.png como card back
 * Cards estáticas (no interactivas en esta pantalla)
 */
export function CardGrid() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.cardContainer}>
          <Image
            source={require('@/assets/images/cardAssets/BackBlue1.png')}
            style={styles.card}
            contentFit="contain"
          />
        </View>
        <View style={styles.cardContainer}>
          <Image
            source={require('@/assets/images/cardAssets/BackBlue1.png')}
            style={styles.card}
            contentFit="contain"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.cardContainer}>
          <Image
            source={require('@/assets/images/cardAssets/BackBlue1.png')}
            style={styles.card}
            contentFit="contain"
          />
        </View>
        <View style={styles.cardContainer}>
          <Image
            source={require('@/assets/images/cardAssets/BackBlue1.png')}
            style={styles.card}
            contentFit="contain"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  cardContainer: {
    width: 90,
    height: 125,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  card: {
    width: '100%',
    height: '100%',
  },
});

