import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BackgroundCheckerboard } from '@/components/BackgroundCheckerboard';
import { GradientOverlay } from '@/components/GradientOverlay';
import { PixelButton } from '@/components/PixelButton';
import { GameColors } from '@/constants/gameColors';
import { GameFonts } from '@/constants/gameFonts';
import { GameLevel } from '@/types/game';
import { LEVEL_LABELS, LEVEL_DESCRIPTIONS } from '@/constants/gameLevels';
import { Platform } from 'react-native';
import { useBackgroundMusic } from '@/providers/BackgroundMusicProvider';

export default function SelectLevelScreen() {
  const router = useRouter();
  const { ensurePlaying } = useBackgroundMusic();

  useEffect(() => {
    void ensurePlaying();
  }, [ensurePlaying]);

  const handleLevelSelect = (level: GameLevel) => {
    router.push({
      pathname: '/game',
      params: { level: level.toString() },
    });
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <View style={styles.wrapper}>
      <BackgroundCheckerboard />
      <GradientOverlay />
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>SELECT LEVEL</Text>
          </View>

          <View style={styles.levelsContainer}>
            <View style={styles.levelButtonContainer}>
              <PixelButton
                label={LEVEL_LABELS[1]}
                size="large"
                variant="gradient"
                onPress={() => handleLevelSelect(1)}
              />
              <Text style={styles.levelDescription}>{LEVEL_DESCRIPTIONS[1]}</Text>
            </View>

            <View style={styles.levelButtonContainer}>
              <PixelButton
                label={LEVEL_LABELS[2]}
                size="large"
                variant="gradient"
                onPress={() => handleLevelSelect(2)}
              />
              <Text style={styles.levelDescription}>{LEVEL_DESCRIPTIONS[2]}</Text>
            </View>

            <View style={styles.levelButtonContainer}>
              <PixelButton
                label={LEVEL_LABELS[3]}
                size="large"
                variant="gradient"
                onPress={() => handleLevelSelect(3)}
              />
              <Text style={styles.levelDescription}>{LEVEL_DESCRIPTIONS[3]}</Text>
            </View>
          </View>

          <View style={styles.backButtonContainer}>
            <PixelButton
              label="BACK"
              size="small"
              variant="gradient"
              onPress={handleBack}
            />
          </View>
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
  titleContainer: {
    marginTop: 32,
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontFamily: GameFonts.pixelFont,
    fontSize: 18,
    color: GameColors.textGold,
    ...Platform.select({
      web: {
        textShadow: '3px 3px 0px ' + GameColors.textGoldDark,
      } as any,
      default: {
        textShadowColor: GameColors.textGoldDark,
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 0,
      },
    }),
    letterSpacing: 2,
  },
  levelsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  levelButtonContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  levelDescription: {
    fontFamily: GameFonts.pixelFont,
    fontSize: 10,
    color: GameColors.textBrown,
    marginTop: 8,
    ...Platform.select({
      web: {
        textShadow: '1px 1px 0px ' + GameColors.textOutline,
      } as any,
      default: {
        textShadowColor: GameColors.textOutline,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
      },
    }),
  },
  backButtonContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
});

