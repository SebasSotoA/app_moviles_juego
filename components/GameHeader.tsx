import React from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { GameColors } from '@/constants/gameColors';
import { GameFonts } from '@/constants/gameFonts';

type GameHeaderProps = {
  onExit: () => void;
  level: number;
};

export function GameHeader({ onExit, level }: GameHeaderProps) {
  const handleExitPress = () => {
    Alert.alert(
      'Salir del Nivel',
      '¿Estás seguro de que quieres salir? Tu progreso no se guardará.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: onExit,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <Pressable
          onPress={handleExitPress}
          style={({ pressed }) => [
            styles.exitButton,
            pressed && styles.exitButtonPressed,
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.exitButtonText}>← SALIR</Text>
        </Pressable>
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>NIVEL {level}</Text>
        </View>
        <View style={styles.spacer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: Platform.select({
      web: 16,
      default: 12,
    }),
    paddingTop: Platform.select({
      web: 8,
      default: 4,
    }),
    paddingBottom: Platform.select({
      web: 8,
      default: 6,
    }),
    zIndex: 100,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  exitButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: GameColors.gradient.colors[0],
    borderWidth: 2,
    borderColor: GameColors.borderDark,
    ...Platform.select({
      web: {
        boxShadow: '2px 2px 0px rgba(0, 0, 0, 0.3)',
      } as any,
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 0,
        elevation: 3,
      },
    }),
  },
  exitButtonPressed: {
    transform: [{ translateY: 2 }],
    opacity: 0.9,
  },
  exitButtonText: {
    fontFamily: GameFonts.pixelFont,
    fontSize: Platform.select({
      web: 10,
      default: 8,
    }),
    color: GameColors.textCream,
    ...Platform.select({
      web: {
        textShadow: '1px 1px 0px rgba(0, 0, 0, 0.8)',
      } as any,
      default: {
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
      },
    }),
  },
  levelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    fontFamily: GameFonts.pixelFont,
    fontSize: Platform.select({
      web: 14,
      default: 12,
    }),
    color: GameColors.textCream,
    textAlign: 'center',
    ...Platform.select({
      web: {
        textShadow: '2px 2px 0px rgba(0, 0, 0, 0.8)',
      } as any,
      default: {
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
      },
    }),
  },
  spacer: {
    width: 80,
  },
});

