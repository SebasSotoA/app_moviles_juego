import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BackgroundCheckerboard } from '@/components/BackgroundCheckerboard';
import { GradientOverlay } from '@/components/GradientOverlay';
import { PixelButton } from '@/components/PixelButton';
import { CreditsContent } from '@/components/CreditsContent';
import { GameColors } from '@/constants/gameColors';

/**
 * Pantalla de créditos del juego
 * Muestra información sobre los desarrolladores
 */
export default function CreditsScreen() {
  return (
    <View style={styles.wrapper}>
      <BackgroundCheckerboard />
      <GradientOverlay />
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.quitButtonContainer}>
            <PixelButton
              label=""
              size="small"
              imageSource={require('@/assets/images/buttons/quitButton.png')}
              pressedImageSource={require('@/assets/images/buttons/quitButtonPressed.png')}
              variant="image"
              soundType="back"
              onPress={() => {
                router.back();
              }}
            />
          </View>
          <CreditsContent />
        </View>
      </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: GameColors.backgroundDark,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    paddingVertical: 32,
  },
  quitButtonContainer: {
    position: 'absolute',
    top: 16,
    right: 4,
    zIndex: 10,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

