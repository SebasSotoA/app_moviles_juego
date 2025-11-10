import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { GameColors } from '@/constants/theme';
import { useGame } from '@/contexts/GameContext';
import { SimonButton } from '@/components/SimonButton';
import { LEVELS, GAME_CONFIG, SimonColor } from '@/constants/game';
import { soundService } from '@/services/soundService';
import { StorageService } from '@/services/storage';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// Función para calcular posiciones de botones en círculo
const getButtonPositions = (buttonCount: number, radius: number, centerX: number, centerY: number) => {
  const positions: Array<{ x: number; y: number }> = [];
  const angleStep = (2 * Math.PI) / buttonCount;
  const startAngle = -Math.PI / 2; // Empezar desde arriba

  for (let i = 0; i < buttonCount; i++) {
    const angle = startAngle + i * angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    positions.push({ x, y });
  }

  return positions;
};

export default function JuegoScreen() {
  const router = useRouter();
  const {
    gameState,
    startGame,
    handleUserInput,
    nextRound,
    loseLife,
    calculateScore,
    setShowingSequence,
    setWaitingInput,
    resetGame,
  } = useGame();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [activeButton, setActiveButton] = useState<SimonColor | null>(null);
  const [showMessage, setShowMessage] = useState<string>('');
  const sequenceShownRef = useRef(false);
  const sequenceCancelledRef = useRef(false);
  const [containerLayout, setContainerLayout] = useState<{ width: number; height: number } | null>(null);

  // Calcular tamaño y posiciones de botones
  const getButtonLayout = () => {
    if (!selectedLevel || !containerLayout) return { buttonSize: 0, positions: [], colors: [] };
    
    const levelConfig = LEVELS[selectedLevel - 1];
    const buttonCount = levelConfig.buttonCount;
    const colors = GAME_CONFIG.COLORS.slice(0, buttonCount);
    
    // Usar las dimensiones reales del contenedor
    const containerWidth = containerLayout.width;
    const containerHeight = containerLayout.height;
    const minDimension = Math.min(containerWidth, containerHeight);
    
    // Radio del círculo y tamaño de botón basado en número de botones
    // Ajustar para que los botones no toquen los bordes y se vean bien en móviles
    let radius: number;
    let buttonSize: number;
    
    // Calcular tamaño de botón basado en el espacio disponible
    // Dejar margen de al menos 20px en cada lado
    const maxButtonSize = (minDimension - 40) / (buttonCount <= 4 ? 2.5 : buttonCount <= 6 ? 3 : buttonCount <= 8 ? 3.5 : 4);
    
    if (buttonCount <= 4) {
      radius = minDimension * 0.22;
      buttonSize = Math.min(90, Math.max(60, maxButtonSize));
    } else if (buttonCount <= 6) {
      radius = minDimension * 0.28;
      buttonSize = Math.min(75, Math.max(50, maxButtonSize));
    } else if (buttonCount <= 8) {
      radius = minDimension * 0.30;
      buttonSize = Math.min(65, Math.max(45, maxButtonSize));
    } else {
      // 12 botones
      radius = minDimension * 0.33;
      buttonSize = Math.min(55, Math.max(40, maxButtonSize));
    }
    
    // Centro del contenedor (relativo al contenedor de botones)
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    
    const positions = getButtonPositions(buttonCount, radius, centerX, centerY);
    
    return { buttonSize, positions, colors };
  };

  const handleLevelSelection = (level: number) => {
    soundService.resetCancelFlag();
    setSelectedLevel(level);
    resetGame();
    startGame(level);
  };

  // Limpiar cuando se desmonta el componente o se sale
  useEffect(() => {
    return () => {
      // Detener todos los sonidos y cancelar secuencia cuando se desmonta
      sequenceCancelledRef.current = true;
      soundService.stopAllSounds();
    };
  }, []);

  useEffect(() => {
    // No iniciar automáticamente, esperar selección de nivel
  }, []);

  // Mostrar secuencia
  const showSequence = useCallback(async () => {
    if (!gameState.sequence.length || sequenceShownRef.current || sequenceCancelledRef.current) return;
    sequenceShownRef.current = true;
    sequenceCancelledRef.current = false;

    setShowingSequence(true);
    setWaitingInput(false);

    // Esperar un momento antes de empezar
    await new Promise((resolve) => setTimeout(resolve, GAME_CONFIG.SEQUENCE_DELAY));

    if (sequenceCancelledRef.current) {
      return;
    }

    const levelConfig = LEVELS[gameState.currentLevel - 1];
    const speed = levelConfig.speed;

    // Mostrar cada color de la secuencia
    for (let i = 0; i < gameState.sequence.length; i++) {
      if (sequenceCancelledRef.current) {
        break;
      }
      const color = gameState.sequence[i];
      setActiveButton(color);
      await soundService.playSound(color);
      if (sequenceCancelledRef.current) {
        break;
      }
      await new Promise((resolve) => {
        const timeout = setTimeout(resolve, speed);
        if (sequenceCancelledRef.current) {
          clearTimeout(timeout);
          resolve(undefined);
        }
      });
      setActiveButton(null);
      if (sequenceCancelledRef.current) {
        break;
      }
      await new Promise((resolve) => {
        const timeout = setTimeout(resolve, 100);
        if (sequenceCancelledRef.current) {
          clearTimeout(timeout);
          resolve(undefined);
        }
      });
    }

    if (sequenceCancelledRef.current) {
      return;
    }

    // Activar input del usuario
    setShowingSequence(false);
    setWaitingInput(true);
  }, [gameState.sequence, gameState.currentLevel, setShowingSequence, setWaitingInput]);

  useEffect(() => {
    // Resetear flag cuando cambia la secuencia
    sequenceShownRef.current = false;
    sequenceCancelledRef.current = false;
    
    // Mostrar secuencia cuando cambia y el juego está activo
    if (
      gameState.isPlaying &&
      gameState.sequence.length > 0 &&
      !gameState.isShowingSequence &&
      !gameState.isWaitingInput &&
      !gameState.gameOver &&
      !gameState.gameWon &&
      selectedLevel !== null
    ) {
      showSequence();
    }
  }, [gameState.sequence, gameState.isPlaying, gameState.currentRound, showSequence, selectedLevel]);

  useEffect(() => {
    // Manejar game over
    if (gameState.gameOver) {
      handleGameOver();
    }
  }, [gameState.gameOver]);

  useEffect(() => {
    // Manejar juego ganado
    if (gameState.gameWon) {
      handleGameWon();
    }
  }, [gameState.gameWon]);

  // Manejar input del usuario
  const handleButtonPress = async (color: SimonColor) => {
    if (gameState.isShowingSequence || !gameState.isWaitingInput || !gameState.isPlaying) return;

    setActiveButton(color);
    
    const result = await handleUserInput(color);
    await new Promise((resolve) => setTimeout(resolve, GAME_CONFIG.BUTTON_ANIMATION_DURATION));
    setActiveButton(null);

    if (!result.isCorrect) {
      // Error
      setShowMessage('¡Error!');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      await new Promise((resolve) => setTimeout(resolve, GAME_CONFIG.ERROR_FEEDBACK_DURATION));
      setShowMessage('');
      loseLife();
    } else if (result.isComplete) {
      // Secuencia completada correctamente
      setShowMessage('¡Correcto!');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await new Promise((resolve) => setTimeout(resolve, GAME_CONFIG.SUCCESS_FEEDBACK_DURATION));
      setShowMessage('');
      
      // Pequeña pausa antes de la siguiente ronda
      await new Promise((resolve) => setTimeout(resolve, 500));
      nextRound();
    }
    // Si no está completa, el usuario debe continuar presionando botones
  };

  // Manejar game over
  const handleGameOver = async () => {
    const finalScore = calculateScore();
    await StorageService.saveScore({
      id: Date.now().toString(),
      score: finalScore,
      level: gameState.currentLevel,
      round: gameState.currentRound,
      date: new Date().toISOString(),
    });

    Alert.alert('¡Game Over!', `Puntaje final: ${finalScore}`, [
      {
        text: 'Ver Puntajes',
        onPress: () => router.replace('/puntaje'),
      },
      {
        text: 'Volver al Inicio',
        onPress: () => {
          sequenceCancelledRef.current = true;
          soundService.stopAllSounds();
          resetGame();
          setSelectedLevel(null);
          router.replace('/home');
        },
        style: 'cancel',
      },
    ]);
  };

  // Manejar juego ganado
  const handleGameWon = async () => {
    const finalScore = calculateScore();
    await StorageService.saveScore({
      id: Date.now().toString(),
      score: finalScore,
      level: gameState.currentLevel,
      round: gameState.currentRound,
      date: new Date().toISOString(),
    });

    Alert.alert('¡Felicidades!', `Has completado todos los niveles!\nPuntaje: ${finalScore}`, [
      {
        text: 'Ver Puntajes',
        onPress: () => router.replace('/puntaje'),
      },
      {
        text: 'Volver al Inicio',
        onPress: () => {
          sequenceCancelledRef.current = true;
          soundService.stopAllSounds();
          resetGame();
          setSelectedLevel(null);
          router.replace('/home');
        },
        style: 'cancel',
      },
    ]);
  };

  // Mostrar selector de dificultad si no se ha seleccionado
  if (!selectedLevel) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.levelSelectionContainer}>
          <Text style={styles.levelSelectionTitle}>SELECCIONA LA DIFICULTAD</Text>
          <ScrollView 
            contentContainerStyle={styles.levelSelectionScroll}
            showsVerticalScrollIndicator={false}>
            {LEVELS.map((level) => (
              <TouchableOpacity
                key={level.level}
                style={styles.levelButton}
                onPress={() => handleLevelSelection(level.level)}
                activeOpacity={0.8}>
                <Text style={styles.levelButtonTitle}>{level.name}</Text>
                <Text style={styles.levelButtonSubtitle}>
                  {level.buttonCount} botones
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              soundService.stopAllSounds();
              router.back();
            }}
            activeOpacity={0.7}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const levelConfig = LEVELS[gameState.currentLevel - 1] || LEVELS[0];
  const totalRounds = levelConfig.rounds.length;
  const progress = gameState.currentRound / totalRounds;
  const layout = getButtonLayout();
  const { buttonSize, positions, colors } = layout;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header fijo con información del juego */}
      <View style={styles.header}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nivel</Text>
            <Text style={styles.infoValue}>{gameState.currentLevel}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Ronda</Text>
            <Text style={styles.infoValue}>
              {gameState.currentRound}/{totalRounds}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Vidas</Text>
            <Text style={styles.infoValue}>{gameState.lives}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Puntaje</Text>
            <Text style={styles.infoValue}>{gameState.score}</Text>
          </View>
        </View>

        {/* Barra de progreso */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Mensaje de feedback */}
      {showMessage && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.messageContainer}>
          <Text style={styles.messageText}>{showMessage}</Text>
        </Animated.View>
      )}

      {/* Contenedor de botones en círculo */}
      <View style={styles.gameArea}>
        <View 
          style={styles.buttonsContainer}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setContainerLayout({ width, height });
          }}>
          {containerLayout && colors.map((color, index) => {
            const position = positions[index];
            if (!position) return null;
            return (
              <View
                key={color}
                style={[
                  styles.buttonWrapper,
                  {
                    left: position.x - buttonSize / 2,
                    top: position.y - buttonSize / 2,
                    width: buttonSize,
                    height: buttonSize,
                  },
                ]}>
                <SimonButton
                  color={color as SimonColor}
                  onPress={handleButtonPress}
                  disabled={gameState.isShowingSequence || !gameState.isWaitingInput}
                  isActive={activeButton === color}
                  size={buttonSize}
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* Indicador de estado */}
      <View style={styles.statusContainer}>
        {gameState.isShowingSequence && (
          <Text style={styles.statusText}>Observa la secuencia...</Text>
        )}
        {gameState.isWaitingInput && !gameState.isShowingSequence && (
          <Text style={styles.statusText}>¡Repite la secuencia!</Text>
        )}
      </View>

      {/* Botón para volver */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          // Cancelar secuencia y detener sonidos
          sequenceCancelledRef.current = true;
          soundService.stopAllSounds();
          resetGame();
          setSelectedLevel(null);
          router.back();
        }}
        activeOpacity={0.7}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GameColors.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: GameColors.background,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: GameColors.surface,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    color: GameColors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GameColors.text,
  },
  progressContainer: {
    height: 4,
    backgroundColor: GameColors.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: GameColors.level,
    borderRadius: 2,
  },
  messageContainer: {
    position: 'absolute',
    top: 180,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  messageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: GameColors.text,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  gameArea: {
    flex: 1,
    marginTop: 140,
    marginBottom: 100,
    width: '100%',
  },
  buttonsContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  buttonWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: GameColors.textSecondary,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: GameColors.surface,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: GameColors.textSecondary,
  },
  backButtonText: {
    color: GameColors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  levelSelectionContainer: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  levelSelectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: GameColors.text,
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 2,
  },
  levelSelectionScroll: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  levelButton: {
    backgroundColor: GameColors.surface,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: GameColors.info,
    alignItems: 'center',
  },
  levelButtonTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: GameColors.text,
    marginBottom: 5,
  },
  levelButtonSubtitle: {
    fontSize: 16,
    color: GameColors.textSecondary,
  },
});
