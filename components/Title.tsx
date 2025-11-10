import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { GameColors } from '@/constants/gameColors';
import { GameFonts } from '@/constants/gameFonts';

/**
 * Componente del título del juego
 * "Mobile dev's MEMORY QUEST"
 * Fuente pixelada, bold para "MEMORY QUEST"
 * Efecto 3D con sombras para dar profundidad
 */
export function Title() {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Mobile dev's</Text>
      <Text style={styles.title}>MEMORY QUEST</Text>
      <View style={styles.underline} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  subtitle: {
    fontFamily: GameFonts.pixelFont,
    fontSize: 10,
    color: GameColors.textBrown,
    ...(Platform.OS !== 'web' && {
      textShadowColor: GameColors.textOutline,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 0,
    }),
    ...(Platform.OS === 'web' && {
      textShadow: '1px 1px 0px ' + GameColors.textOutline,
    }),
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: GameFonts.pixelFont,
    fontSize: 18,
    color: GameColors.textGold,
    fontWeight: 'bold',
    ...(Platform.OS !== 'web' && {
      textShadowColor: GameColors.textGoldDark,
      textShadowOffset: { width: 3, height: 3 },
      textShadowRadius: 0,
    }),
    ...(Platform.OS === 'web' && {
      textShadow: '3px 3px 0px ' + GameColors.textGoldDark,
    }),
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  underline: {
    width: 130,
    height: 2,
    backgroundColor: '#4CAF50',
    marginTop: 8,
    borderRadius: 1,
  },
});

