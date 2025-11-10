import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameColors } from '@/constants/gameColors';
import { GameFonts } from '@/constants/gameFonts';

type StatsBadgeProps = {
  icon: string;
  value: string;
};

/**
 * Componente reutilizable para badges de estadísticas
 * Time, Score, Level
 * Con efecto 3D embossed
 */
export function StatsBadge({ icon, value }: StatsBadgeProps) {
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
            <Text style={[styles.icon, styles.iconText]}>{icon}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    minWidth: 85,
    position: 'relative',
  },
  shadowLayer: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: -2,
    bottom: -2,
    borderRadius: 6,
    backgroundColor: GameColors.shadowDark,
    zIndex: 0,
  },
  gradient: {
    borderRadius: 6,
    padding: 2,
    zIndex: 1,
  },
  borderContainer: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: GameColors.borderDark,
    paddingHorizontal: 10,
    paddingVertical: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: GameColors.borderLight,
    opacity: 0.6,
  },
  borderLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 1,
    backgroundColor: GameColors.borderLight,
    opacity: 0.6,
  },
  borderBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: GameColors.shadowDark,
    opacity: 0.8,
  },
  borderRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 1,
    backgroundColor: GameColors.shadowDark,
    opacity: 0.8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconText: {
    marginRight: 4,
  },
  icon: {
    fontSize: 16,
  },
  value: {
    fontFamily: GameFonts.pixelFont,
    fontSize: 11,
    color: '#FFFFFF',
    ...(Platform.OS !== 'web' && {
      textShadowColor: GameColors.textOutline,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 0,
    }),
    ...(Platform.OS === 'web' && {
      textShadow: '1px 1px 0px ' + GameColors.textOutline,
    }),
  },
});

