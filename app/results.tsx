import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BackgroundCheckerboard } from '@/components/BackgroundCheckerboard';
import { GradientOverlay } from '@/components/GradientOverlay';
import { PixelButton } from '@/components/PixelButton';
import { StatsBadge } from '@/components/StatsBadge';
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
  const isNewRecord = params.isNewRecord === 'true';

  // Formatear tiempo como MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayAgain = () => {
    router.push('/select-level');
  };

  const handleMenu = () => {
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
            <Text style={styles.title}>RESULTS</Text>
            {isNewRecord && (
              <View style={styles.newRecordContainer}>
                <Text style={styles.newRecordText}>🎉 ¡NUEVO RÉCORD!</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PARTIDA ACTUAL</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <StatsBadge icon="⭐" value={score.toString()} />
                <Text style={styles.statLabel}>Puntaje</Text>
              </View>
              <View style={styles.statItem}>
                <StatsBadge icon="⏱️" value={formatTime(time)} />
                <Text style={styles.statLabel}>Tiempo</Text>
              </View>
              <View style={styles.statItem}>
                <StatsBadge icon="🎯" value={attempts.toString()} />
                <Text style={styles.statLabel}>Intentos</Text>
              </View>
              <View style={styles.statItem}>
                <StatsBadge icon="🏆" value={`LV.${level}`} />
                <Text style={styles.statLabel}>Nivel</Text>
              </View>
            </View>
          </View>

          {bestRecord && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MEJOR RÉCORD</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <StatsBadge icon="⭐" value={bestRecord.bestScore.toString()} />
                  <Text style={styles.statLabel}>Mejor Puntaje</Text>
                </View>
                <View style={styles.statItem}>
                  <StatsBadge icon="⏱️" value={formatTime(bestRecord.bestTime)} />
                  <Text style={styles.statLabel}>Mejor Tiempo</Text>
                </View>
                <View style={styles.statItem}>
                  <StatsBadge icon="🎯" value={bestRecord.bestAttempts.toString()} />
                  <Text style={styles.statLabel}>Menos Intentos</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.buttonsContainer}>
            <View style={styles.buttonWrapper}>
              <PixelButton
                label="PLAY AGAIN"
                size="large"
                variant="gradient"
                onPress={handlePlayAgain}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <PixelButton
                label="MENU"
                size="small"
                variant="gradient"
                onPress={handleMenu}
              />
            </View>
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
    marginBottom: 32,
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
    marginBottom: 16,
  },
  newRecordContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: GameColors.textGold,
    borderWidth: 2,
    borderColor: GameColors.borderDark,
  },
  newRecordText: {
    fontFamily: GameFonts.pixelFont,
    fontSize: 12,
    color: '#000',
    ...Platform.select({
      web: {
        textShadow: '2px 2px 0px ' + GameColors.textOutline,
      } as any,
      default: {
        textShadowColor: GameColors.textOutline,
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
      },
    }),
  },
  section: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionTitle: {
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 8,
  },
  statLabel: {
    fontFamily: GameFonts.pixelFont,
    fontSize: 8,
    color: GameColors.textCream,
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
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonWrapper: {
    marginVertical: 8,
  },
});

