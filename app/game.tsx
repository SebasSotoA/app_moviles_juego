import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, Dimensions, Platform, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { BackgroundCheckerboard } from '@/components/BackgroundCheckerboard';
import { GradientOverlay } from '@/components/GradientOverlay';
import { GameStatsRow } from '@/components/GameStatsRow';
import { GameHeader } from '@/components/GameHeader';
import { SuccessMessage } from '@/components/SuccessMessage';
import { Card } from '@/components/Card';
import { useGame } from '@/hooks/useGame';
import { useScore } from '@/hooks/useScore';
import { GAME_LEVELS, GameLevel } from '@/constants/gameLevels';
import { calculateScore } from '@/utils/score';

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const level = parseInt(params.level as string, 10) as GameLevel;

  // Validar nivel
  const validLevel = (level >= 1 && level <= 3 ? level : 1) as GameLevel;
  const levelConfig = GAME_LEVELS[validLevel];

  // Estado para mensaje de éxito
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Callback cuando se encuentra un par
  const handlePairFound = () => {
    setShowSuccessMessage(true);
    // Feedback háptico en móvil
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  // Callback para salir del nivel
  const handleExit = () => {
    // Navegar a la pantalla de selección de nivel
    router.push('/select-level');
  };

  const {
    cards,
    attempts,
    timeUsed,
    isGameComplete,
    isGameStarted,
    flippedCardsCount,
    handleCardPress,
  } = useGame(validLevel, handlePairFound);

  const { calculateAndSaveScore } = useScore();
  const hasNavigatedRef = useRef(false);

  // Debug: Verificar estado del juego
  useEffect(() => {
    if (cards.length > 0) {
      console.log('[GameScreen] Estado del juego:', {
        cardsCount: cards.length,
        level: validLevel,
        isGameStarted,
        isGameComplete,
        attempts,
        timeUsed,
      });
    }
  }, [cards.length, validLevel, isGameStarted, isGameComplete, attempts, timeUsed]);

  // Calcular puntaje actual (actualizado en tiempo real)
  const currentScore = isGameStarted
    ? calculateScore(timeUsed, attempts, validLevel)
    : 0;

  // Cuando el juego se complete, navegar a resultados
  useEffect(() => {
    if (isGameComplete && timeUsed > 0 && attempts > 0 && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      
      const handleGameComplete = async () => {
        try {
          const result = await calculateAndSaveScore(timeUsed, attempts, validLevel);
          router.push({
            pathname: '/results',
            params: {
              score: result.score.toString(),
              time: timeUsed.toString(),
              attempts: attempts.toString(),
              level: validLevel.toString(),
              isNewRecord: result.isNewRecord.toString(),
            },
          });
        } catch (error) {
          console.error('Error completing game:', error);
          hasNavigatedRef.current = false; // Reset para permitir reintento
        }
      };
      
      // Pequeño delay para permitir que las animaciones terminen
      const timeout = setTimeout(() => {
        handleGameComplete();
      }, 500);
      
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameComplete, timeUsed, attempts, validLevel]);

  // Calcular dimensiones del grid (responsive para móvil)
  const screenWidth = Dimensions.get('window').width;
  const padding = Platform.select({
    web: 16,
    default: 12,
  });
  const gap = Platform.select({
    web: 8,
    default: 6,
  });
  const availableWidth = screenWidth - padding * 2 - 32; // Espacio adicional para seguridad
  const cardsPerRow = levelConfig.columns;
  const totalGapWidth = gap * (cardsPerRow - 1);
  const calculatedCardWidth = Math.max(50, Math.floor((availableWidth - totalGapWidth) / cardsPerRow)); // Mínimo 50px
  
  // Determinar tamaño de carta según nivel (para referencia, pero usamos calculatedCardWidth)
  const getCardSize = (): 'small' | 'medium' | 'large' => {
    if (validLevel === 3) return 'small';
    if (validLevel === 2) return 'medium';
    return 'medium';
  };
  
  const cardSize = getCardSize();
  
  // Calcular altura de carta manteniendo proporción (75/105 ≈ 0.714)
  const cardAspectRatio = 75 / 105;
  const calculatedCardHeight = Math.max(70, Math.floor(calculatedCardWidth / cardAspectRatio)); // Mínimo 70px
  
  // Debug: Log de dimensiones
  console.log('[GameScreen] Dimensiones calculadas:', {
    screenWidth,
    availableWidth,
    calculatedCardWidth,
    calculatedCardHeight,
    cardsPerRow,
    totalGapWidth,
    gap,
  });

  // No validar aquí porque las cartas se generan asíncronamente
  // El componente debe renderizarse siempre y mostrar las cartas cuando estén disponibles

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <BackgroundCheckerboard />
      <GradientOverlay />
      <View style={styles.gameContent}>
        <GameHeader onExit={handleExit} level={validLevel} />
        <SuccessMessage
          visible={showSuccessMessage}
          onHide={() => setShowSuccessMessage(false)}
          duration={2000}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          style={styles.scrollView}
        >
          <View style={styles.content}>
            <GameStatsRow time={timeUsed} score={currentScore} level={validLevel} />

            {cards.length > 0 && calculatedCardWidth > 0 && calculatedCardHeight > 0 ? (
              <View style={styles.cardsContainer}>
                <View style={styles.grid}>
                  {cards.map((card, index) => {
                    const row = Math.floor(index / cardsPerRow);
                    const col = index % cardsPerRow;
                    const isLastInRow = col === cardsPerRow - 1;
                    return (
                      <View
                        key={card.id}
                        style={[
                          styles.cardWrapper,
                          {
                            width: calculatedCardWidth,
                            height: calculatedCardHeight,
                            marginRight: isLastInRow ? 0 : gap,
                            marginBottom: gap,
                          },
                        ]}
                      >
                        <Card
                          id={card.id}
                          imageSource={card.imageSource}
                          isFlipped={card.isFlipped}
                          isMatched={card.isMatched}
                          onPress={() => handleCardPress(card.id)}
                          disabled={isGameComplete || (flippedCardsCount >= 2 && !card.isFlipped)}
                          size={cardSize}
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>
                  {cards.length === 0 
                    ? 'Cargando cartas...' 
                    : `Calculando dimensiones... (W: ${calculatedCardWidth}, H: ${calculatedCardHeight})`}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameContent: {
    flex: 1,
    zIndex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Platform.select({
      web: 16,
      default: 12,
    }),
    paddingBottom: Platform.select({
      web: 16,
      default: 24,
    }),
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: Platform.select({
      web: 16,
      default: 12,
    }),
    minHeight: 400,
  },
  cardsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: Platform.select({
      web: 16,
      default: 12,
    }),
    minHeight: 200,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: '100%',
  },
  cardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#FFF2DB',
  },
});

