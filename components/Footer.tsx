import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
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
    ...Platform.select({
      web: {
        // @ts-expect-error - textShadow es válido en web pero no está en los tipos de RN
        textShadow: '1px 1px 0px #2C1A0A',
      },
      default: {
        textShadowColor: GameColors.textOutline,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
      },
    }),
  },
});

