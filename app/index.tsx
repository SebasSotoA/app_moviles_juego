import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundCheckerboard } from '@/components/BackgroundCheckerboard';
import { GradientOverlay } from '@/components/GradientOverlay';
import { Title } from '@/components/Title';
import { StatsRow } from '@/components/StatsRow';
import { CardGrid } from '@/components/CardGrid';
import { PixelButton } from '@/components/PixelButton';
import { Footer } from '@/components/Footer';

/**
 * Pantalla principal del juego Memory Quest
 * Combina todos los componentes en un layout vertical
 */
export default function MainScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <BackgroundCheckerboard />
      <GradientOverlay />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Title />
          <StatsRow />
          <CardGrid />
          <View style={styles.buttonsContainer}>
            <PixelButton
              label="PLAY"
              size="large"
              imageSource={require('@/assets/images/buttons/playButton.png')}
              pressedImageSource={require('@/assets/images/buttons/playButtonPressed.png')}
              variant="image"
              onPress={() => {
                // TODO: Navegar a pantalla de juego
                console.log('Play pressed');
              }}
            />
          </View>
          <View style={styles.secondaryButtonsContainer}>
            <View style={styles.buttonWrapper}>
              <PixelButton
                label="CREDITS"
                size="small"
                imageSource={require('@/assets/images/buttons/creditsButton.png')}
                pressedImageSource={require('@/assets/images/buttons/creditsButtonPressed.png')}
                variant="image"
                onPress={() => {
                  // TODO: Navegar a pantalla de créditos
                  console.log('Credits pressed');
                }}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <PixelButton
                label="MORE"
                size="small"
                imageSource={require('@/assets/images/buttons/moreButton.png')}
                pressedImageSource={require('@/assets/images/buttons/moreButtonPressed.png')}
                variant="image"
                onPress={() => {
                  // TODO: Navegar a pantalla de más opciones
                  console.log('More pressed');
                }}
              />
            </View>
          </View>
          <Footer />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  buttonsContainer: {
    marginTop: 24,
    marginBottom: 12,
    alignItems: 'center',
  },
  secondaryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonWrapper: {
    marginHorizontal: 6,
  },
});

