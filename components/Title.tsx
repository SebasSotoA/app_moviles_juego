import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText, TSpan } from 'react-native-svg';
import { GameFonts } from '@/constants/gameFonts';

/**
 * Componente del título del juego
 * "Mobile dev's MEMORY QUEST"
 * Fuente pixelada PressStart2P con estilos específicos
 * Gradiente vertical para "MEMORY QUEST"
 */
export function Title() {
  // Dimensiones para los SVG
  const subtitleWidth = 180;
  const subtitleHeight = 36;
  const titleWidth = 220;
  const titleHeight = 32;

  return (
    <View style={styles.container}>
      <View style={styles.subtitleContainer}>
        <Svg width={subtitleWidth} height={subtitleHeight}>
          <SvgText
            x="50%"
            y={subtitleHeight / 2 + 7}
            fontSize="20"
            fontFamily={GameFonts.pixelFont}
            fontWeight="normal"
            fill="#FFFFFF"
            textAnchor="middle"
            stroke="#9D6631"
            strokeWidth="1"
          >
            <TSpan x="50%" dy="0">Mobile dev&apos;s</TSpan>
          </SvgText>
        </Svg>
      </View>
      <View style={styles.titleContainer}>
        <Svg width={titleWidth} height={titleHeight}>
          <Defs>
            <LinearGradient id="titleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#BD9A4B" stopOpacity="1" />
              <Stop offset="0%" stopColor="#ECD8A3" stopOpacity="1" />
              <Stop offset="3%" stopColor="#FBF5D1" stopOpacity="1" />
              <Stop offset="6%" stopColor="#EAC885" stopOpacity="1" />
              <Stop offset="17%" stopColor="#FFF2DB" stopOpacity="1" />
              <Stop offset="96%" stopColor="#94641E" stopOpacity="1" />
              <Stop offset="99%" stopColor="#FFF0DA" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <SvgText
            x="50%"
            y={titleHeight / 2 + 8}
            fontSize="24"
            fontFamily={GameFonts.pixelFont}
            fontWeight="normal"
            fill="url(#titleGradient)"
            textAnchor="middle"
            stroke="#522B04"
            strokeWidth="1"
          >
            <TSpan x="50%" dy="0">MEMORY QUEST</TSpan>
          </SvgText>
        </Svg>
      </View>
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
  subtitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    marginBottom: 4,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
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

