import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BackgroundCheckerboard } from '@/components/BackgroundCheckerboard';
import { GradientOverlay } from '@/components/GradientOverlay';
import { PixelButton } from '@/components/PixelButton';
import { ScoreBadge } from '@/components/ScoreBadge';
import { GameOverStatBadge } from '@/components/GameOverStatBadge';
import { useScore } from '@/hooks/useScore';
import { GameColors } from '@/constants/gameColors';
import { GameFonts } from '@/constants/gameFonts';
import { Platform } from 'react-native';

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { bestRecord } = useScore();

  const score = parseInt(params.score as string, 10) || 0;
  const time = parseInt(params.time as string, 10) || 0;
  const attempts = parseInt(params.attempts as string, 10) || 0;
  const level = parseInt(params.level as string, 10) || 1;

  // Formatear tiempo como MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleQuit = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <BackgroundCheckerboard />
      <GradientOverlay />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>GAME OVER</Text>
            <Text style={styles.subtitle}>Good luck on the next one</Text>
          </View>

          <View style={styles.scoreSection}>
            <ScoreBadge score={score} />
          </View>

          <View style={styles.statsSection}>
            <GameOverStatBadge icon="⏱️" label="Time" value={formatTime(time)} />
            <GameOverStatBadge icon="❤️" label="Remaining Lives" value={`x${attempts}`} />
            <GameOverStatBadge icon="🏆" label="Difficulty" value={`Lvl. ${level}`} />
          </View>

          {bestRecord && (
            <View style={styles.recordSection}>
              <Text style={styles.recordTitle}>BEST RECORD</Text>
              <View style={styles.recordBadges}>
                <GameOverStatBadge icon="⭐" label="Best Score" value={bestRecord.bestScore.toString()} />
                <GameOverStatBadge icon="⏱️" label="Best Time" value={formatTime(bestRecord.bestTime)} />
                <GameOverStatBadge icon="🎯" label="Best Attempts" value={bestRecord.bestAttempts.toString()} />
              </View>
            </View>
          )}

          <View style={styles.buttonsContainer}>
            <PixelButton
              label="QUIT"
              size="large"
              imageSource={require('@/assets/images/buttons/quitTextButton.png')}
              pressedImageSource={require('@/assets/images/buttons/quitTextButtonPressed.png')}
              variant="image"
              onPress={handleQuit}
            />
          </View>
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
  titleContainer: {
    marginTop: 32,
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontFamily: GameFonts.pixelFont,
    fontSize: 20,
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
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: GameFonts.pixelFont,
    fontSize: 10,
    color: '#FFFFFF',
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
  scoreSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  statsSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  recordSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  recordTitle: {
    fontFamily: GameFonts.pixelFont,
    fontSize: 12,
    color: GameColors.textBrown,
    marginBottom: 16,
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
  recordBadges: {
    width: '100%',
    alignItems: 'center',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
});

