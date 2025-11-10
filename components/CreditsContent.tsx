import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameColors } from '@/constants/gameColors';
import { GameFonts } from '@/constants/gameFonts';

/**
 * Componente de contenido de créditos
 * Usa el estilo de los badges del scoreboard
 */
export function CreditsContent() {
  return (
    <View style={styles.container}>
      {/* Sombra para efecto 3D */}
      <View style={styles.shadowLayer} />
      {/* Capa principal con gradiente */}
      {/* @ts-expect-error - expo-linear-gradient compatibility with React 19 */}
      <LinearGradient
        colors={GameColors.gradient.colors}
        locations={GameColors.gradient.locations}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.borderContainer}>
          {/* Borde superior e izquierdo claro para efecto embossed */}
          <View style={styles.borderTop} />
          <View style={styles.borderLeft} />
          {/* Borde inferior y derecho oscuro para efecto embossed */}
          <View style={styles.borderBottom} />
          <View style={styles.borderRight} />
          
          <View style={styles.content}>
            <Text style={styles.title}>CREDITS</Text>
            
            <View style={styles.section}>
              <Text style={styles.text}>Forged in the halls of</Text>
              <Text style={styles.highlightText}>Fintu Technologies</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.text}>By the hands of</Text>
              <Text style={styles.nameText}>Alfonso Jiménez</Text>
              <Text style={styles.nameText}>Sebastián Soto</Text>
              <Text style={styles.nameText}>Gregorio Carvajal</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.text}>May this work stand as proof</Text>
              <Text style={styles.text}>that even in lines of code,</Text>
              <Text style={styles.text}>there dwells a spark of magic.</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    minWidth: 300,
    maxWidth: 350,
    position: 'relative',
    marginTop: 60,
  },
  shadowLayer: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -3,
    borderRadius: 8,
    backgroundColor: GameColors.shadowDark,
    zIndex: 0,
  },
  gradient: {
    borderRadius: 8,
    padding: 3,
    zIndex: 1,
  },
  borderContainer: {
    borderRadius: 6,
    borderWidth: 2,
    borderColor: GameColors.borderDark,
    paddingHorizontal: 20,
    paddingVertical: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: GameColors.borderLight,
    opacity: 0.6,
  },
  borderLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 2,
    backgroundColor: GameColors.borderLight,
    opacity: 0.6,
  },
  borderBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: GameColors.shadowDark,
    opacity: 0.8,
  },
  borderRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 2,
    backgroundColor: GameColors.shadowDark,
    opacity: 0.8,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  title: {
    fontFamily: GameFonts.pixelFont,
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 24,
    ...Platform.select({
      web: {
        // @ts-expect-error - textShadow es válido en web pero no está en los tipos de RN
        textShadow: '2px 2px 0px #2C1A0A',
      },
      default: {
        textShadowColor: GameColors.textOutline,
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
      },
    }),
  },
  section: {
    marginBottom: 20,
    alignItems: 'center',
  },
  text: {
    fontFamily: GameFonts.pixelFont,
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 4,
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
  highlightText: {
    fontFamily: GameFonts.pixelFont,
    fontSize: 12,
    color: '#FFD700',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
    ...Platform.select({
      web: {
        // @ts-expect-error - textShadow es válido en web pero no está en los tipos de RN
        textShadow: '2px 2px 0px #2C1A0A',
      },
      default: {
        textShadowColor: GameColors.textOutline,
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
      },
    }),
  },
  nameText: {
    fontFamily: GameFonts.pixelFont,
    fontSize: 11,
    color: '#FFF2DB',
    textAlign: 'center',
    marginTop: 6,
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

