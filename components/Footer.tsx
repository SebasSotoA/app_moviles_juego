import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GameColors } from '@/constants/gameColors';
import { GameFonts } from '@/constants/gameFonts';

/**
 * Componente del footer con copyright
 * "2025 © - Fintu Technologies"
 */
export function Footer() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>2025 © - Fintu Technologies</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    alignItems: 'center',
  },
  text: {
    fontFamily: GameFonts.pixelFont,
    fontSize: GameFonts.sizes.footer,
    color: GameColors.footerText,
    textShadowColor: GameColors.textOutline,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});

