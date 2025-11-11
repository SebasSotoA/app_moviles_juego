import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { GameColors } from '@/constants/gameColors';
import { GameFonts } from '@/constants/gameFonts';
import { ConfirmModal } from './ConfirmModal';
import { PixelButton } from './PixelButton';

type GameHeaderProps = {
  onExit: () => void;
  level: number;
};

export function GameHeader({ onExit, level }: GameHeaderProps) {
  const [showExitModal, setShowExitModal] = useState(false);

  const handleExitPress = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    onExit();
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContent}>
          <View style={styles.exitButtonContainer}>
            <PixelButton
              label=""
              size="small"
              imageSource={require('@/assets/images/buttons/quitTextButton.png')}
              pressedImageSource={require('@/assets/images/buttons/quitTextButtonPressed.png')}
              variant="image"
              onPress={handleExitPress}
            />
          </View>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>NIVEL {level}</Text>
          </View>
          <View style={styles.spacer} />
        </View>
      </View>
      <ConfirmModal
        visible={showExitModal}
        title="SALIR DEL NIVEL"
        message="¿Estás seguro de que quieres salir? Tu progreso no se guardará."
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
        confirmText="SALIR"
        cancelText="CANCELAR"
      />
    </>
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
  exitButtonContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
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

