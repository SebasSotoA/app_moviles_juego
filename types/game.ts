/**
 * Tipos TypeScript para el juego de memoria
 */

export type GameLevel = 1 | 2 | 3;

export interface Card {
  id: string;
  imageSource: any;
  pairId: string; // ID de la pareja (mismo para ambas cartas de un par)
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: Card[];
  flippedCards: string[]; // IDs de cartas volteadas
  attempts: number;
  timeUsed: number; // en segundos
  isGameComplete: boolean;
  isGameStarted: boolean; // para iniciar el timer
  countdownActive: boolean; // para el contador 3-2-1
}

export interface GameResult {
  score: number;
  timeUsed: number;
  attempts: number;
  level: GameLevel;
  isNewRecord: boolean;
}

export interface BestRecord {
  bestScore: number;
  bestTime: number;
  bestAttempts: number;
}

