import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SimonColor, LEVELS, GAME_CONFIG, SCORING } from '@/constants/game';
import { StorageService, GameScore } from '@/services/storage';

// Tipos
interface GameState {
  isPlaying: boolean;
  currentLevel: number;
  currentRound: number;
  lives: number;
  score: number;
  sequence: SimonColor[];
  userSequence: SimonColor[];
  isShowingSequence: boolean;
  isWaitingInput: boolean;
  gameOver: boolean;
  gameWon: boolean;
}

interface GameContextType {
  gameState: GameState;
  startGame: (selectedLevel?: number) => void;
  resetGame: () => void;
  generateSequence: (length: number, level: number) => SimonColor[];
  setShowingSequence: (showing: boolean) => void;
  setWaitingInput: (waiting: boolean) => void;
  handleUserInput: (color: SimonColor) => Promise<{ isCorrect: boolean; isComplete: boolean }>;
  nextRound: () => void;
  loseLife: () => void;
  calculateScore: () => number;
}

const initialState: GameState = {
  isPlaying: false,
  currentLevel: 1,
  currentRound: 1,
  lives: GAME_CONFIG.MAX_LIVES,
  score: 0,
  sequence: [],
  userSequence: [],
  isShowingSequence: false,
  isWaitingInput: false,
  gameOver: false,
  gameWon: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  // Generar secuencia aleatoria
  const generateSequence = useCallback((length: number, level: number): SimonColor[] => {
    const sequence: SimonColor[] = [];
    const levelConfig = LEVELS[level - 1];
    const availableColors = GAME_CONFIG.COLORS.slice(0, levelConfig.buttonCount);
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * availableColors.length);
      sequence.push(availableColors[randomIndex]);
    }
    return sequence;
  }, []);

  // Iniciar juego
  const startGame = useCallback((selectedLevel: number = 1) => {
    const levelConfig = LEVELS[selectedLevel - 1];
    const firstRound = levelConfig.rounds[0];
    const sequence = generateSequence(firstRound.sequenceLength, selectedLevel);

    setGameState({
      isPlaying: true,
      currentLevel: selectedLevel,
      currentRound: 1,
      lives: GAME_CONFIG.MAX_LIVES,
      score: 0,
      sequence,
      userSequence: [],
      isShowingSequence: false,
      isWaitingInput: false,
      gameOver: false,
      gameWon: false,
    });
  }, [generateSequence]);

  // Reiniciar juego
  const resetGame = useCallback(() => {
    setGameState(initialState);
  }, []);

  // Establecer estado de mostrando secuencia
  const setShowingSequence = useCallback((showing: boolean) => {
    setGameState((prev) => ({
      ...prev,
      isShowingSequence: showing,
    }));
  }, []);

  // Establecer estado de esperando input
  const setWaitingInput = useCallback((waiting: boolean) => {
    setGameState((prev) => ({
      ...prev,
      isWaitingInput: waiting,
      userSequence: waiting ? [] : prev.userSequence,
    }));
  }, []);

  // Manejar input del usuario
  const handleUserInput = useCallback(
    async (color: SimonColor): Promise<{ isCorrect: boolean; isComplete: boolean }> => {
      return new Promise((resolve) => {
        setGameState((prev) => {
          if (!prev.isWaitingInput || prev.isShowingSequence || !prev.isPlaying) {
            resolve({ isCorrect: false, isComplete: false });
            return prev;
          }

          const newUserSequence = [...prev.userSequence, color];
          const expectedIndex = newUserSequence.length - 1;
          const expectedColor = prev.sequence[expectedIndex];

          // Verificar si el color es correcto
          if (color !== expectedColor) {
            // Error
            resolve({ isCorrect: false, isComplete: false });
            return {
              ...prev,
              userSequence: newUserSequence,
              isWaitingInput: false,
            };
          }

          // Verificar si la secuencia está completa
          const isComplete = newUserSequence.length === prev.sequence.length;
          
          if (isComplete) {
            // Secuencia correcta y completa
            resolve({ isCorrect: true, isComplete: true });
            return {
              ...prev,
              userSequence: [],
              isWaitingInput: false,
              score: prev.score + SCORING.POINTS_PER_COLOR * prev.sequence.length,
            };
          }

          // Continuar con la secuencia (aún falta más)
          resolve({ isCorrect: true, isComplete: false });
          return {
            ...prev,
            userSequence: newUserSequence,
          };
        });
      });
    },
    []
  );

  // Siguiente ronda
  const nextRound = useCallback(() => {
    setGameState((prev) => {
      const levelConfig = LEVELS[prev.currentLevel - 1];
      const nextRoundIndex = prev.currentRound;

      // Verificar si hay más rondas en el nivel actual
      if (nextRoundIndex < levelConfig.rounds.length) {
        // Siguiente ronda en el mismo nivel
        const nextRoundConfig = levelConfig.rounds[nextRoundIndex];
        const newSequence = generateSequence(nextRoundConfig.sequenceLength, prev.currentLevel);
        return {
          ...prev,
          currentRound: prev.currentRound + 1,
          sequence: newSequence,
          userSequence: [],
          isShowingSequence: false,
          isWaitingInput: false,
          score: prev.score + SCORING.ROUND_BONUS,
        };
      } else {
        // Completar nivel, avanzar al siguiente
        if (prev.currentLevel < LEVELS.length) {
          const nextLevelConfig = LEVELS[prev.currentLevel];
          const nextRoundConfig = nextLevelConfig.rounds[0];
          const newSequence = generateSequence(nextRoundConfig.sequenceLength, prev.currentLevel + 1);
          return {
            ...prev,
            currentLevel: prev.currentLevel + 1,
            currentRound: 1,
            sequence: newSequence,
            userSequence: [],
            isShowingSequence: false,
            isWaitingInput: false,
            score: prev.score + SCORING.LEVEL_BONUS,
          };
        } else {
          // Juego completado
          return {
            ...prev,
            gameWon: true,
            isPlaying: false,
          };
        }
      }
    });
  }, [generateSequence]);

  // Perder vida
  const loseLife = useCallback(() => {
    setGameState((prev) => {
      const newLives = prev.lives - 1;

      if (newLives <= 0) {
        // Game Over
        return {
          ...prev,
          lives: 0,
          gameOver: true,
          isPlaying: false,
        };
      }

      // Continuar con menos vidas
      const levelConfig = LEVELS[prev.currentLevel - 1];
      const currentRoundConfig = levelConfig.rounds[prev.currentRound - 1];
      const newSequence = generateSequence(currentRoundConfig.sequenceLength, prev.currentLevel);

      return {
        ...prev,
        lives: newLives,
        sequence: newSequence,
        userSequence: [],
        isShowingSequence: false,
        isWaitingInput: false,
      };
    });
  }, [generateSequence]);

  // Calcular puntaje final
  const calculateScore = useCallback((): number => {
    return gameState.score;
  }, [gameState.score]);

  const value: GameContextType = {
    gameState,
    startGame,
    resetGame,
    generateSequence,
    setShowingSequence,
    setWaitingInput,
    handleUserInput,
    nextRound,
    loseLife,
    calculateScore,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame debe ser usado dentro de un GameProvider');
  }
  return context;
};

