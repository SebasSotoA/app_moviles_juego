import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BackgroundCheckerboard } from '@/components/BackgroundCheckerboard';
import { GradientOverlay } from '@/components/GradientOverlay';
import { Title } from '@/components/Title';
import { StatsRow } from '@/components/StatsRow';
import { CardGrid } from '@/components/CardGrid';
import { PixelButton } from '@/components/PixelButton';
import { Footer } from '@/components/Footer';
import { GameColors } from '@/constants/gameColors';
import { useBackgroundMusic } from '@/providers/BackgroundMusicProvider';

/**
 * Pantalla principal del juego Memory Quest
 * Combina todos los componentes en un layout vertical
 */
export default function MainScreen() {
  const router = useRouter();
  const { ensurePlaying } = useBackgroundMusic();

  useEffect(() => {
    void ensurePlaying();
  }, [ensurePlaying]);

  const handlePlayPress = () => {
    router.push('/select-level');
  };

  return (
    <View style={styles.wrapper}>
      <BackgroundCheckerboard />
      <GradientOverlay />
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.content}>
        <View style={styles.topSection}>
          <Title />
          <StatsRow />
          <CardGrid />
        </View>
        <View style={styles.buttonsContainer}>
          <PixelButton
            label="PLAY"
            size="large"
            imageSource={require('@/assets/images/buttons/playButton.png')}
            pressedImageSource={require('@/assets/images/buttons/playButtonPressed.png')}
            variant="image"
            onPress={handlePlayPress}
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
                router.push({ pathname: '/credits' as any });
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 16,
  },
  buttonsContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  secondaryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonWrapper: {
    marginHorizontal: 6,
  },
});

