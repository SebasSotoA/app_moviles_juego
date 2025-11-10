/**
 * Constantes de configuración del juego Simón Dice
 */

// Configuración de niveles
export const LEVELS = [
  {
    level: 1,
    name: 'Principiante',
    buttonCount: 4,
    rounds: [
      { round: 1, sequenceLength: 3 },
      { round: 2, sequenceLength: 4 },
      { round: 3, sequenceLength: 5 },
      { round: 4, sequenceLength: 6 },
      { round: 5, sequenceLength: 7 },
    ],
    speed: 800, // ms entre cada color en la secuencia
  },
  {
    level: 2,
    name: 'Intermedio',
    buttonCount: 6,
    rounds: [
      { round: 1, sequenceLength: 5 },
      { round: 2, sequenceLength: 6 },
      { round: 3, sequenceLength: 7 },
      { round: 4, sequenceLength: 8 },
      { round: 5, sequenceLength: 9 },
      { round: 6, sequenceLength: 10 },
    ],
    speed: 600, // ms entre cada color en la secuencia
  },
  {
    level: 3,
    name: 'Avanzado',
    buttonCount: 8,
    rounds: [
      { round: 1, sequenceLength: 7 },
      { round: 2, sequenceLength: 8 },
      { round: 3, sequenceLength: 9 },
      { round: 4, sequenceLength: 10 },
      { round: 5, sequenceLength: 11 },
      { round: 6, sequenceLength: 12 },
      { round: 7, sequenceLength: 13 },
    ],
    speed: 400, // ms entre cada color en la secuencia
  },
  {
    level: 4,
    name: 'Experto',
    buttonCount: 12,
    rounds: [
      { round: 1, sequenceLength: 8 },
      { round: 2, sequenceLength: 9 },
      { round: 3, sequenceLength: 10 },
      { round: 4, sequenceLength: 11 },
      { round: 5, sequenceLength: 12 },
      { round: 6, sequenceLength: 13 },
      { round: 7, sequenceLength: 14 },
      { round: 8, sequenceLength: 15 },
    ],
    speed: 300, // ms entre cada color en la secuencia
  },
];

// Configuración general del juego
export const GAME_CONFIG = {
  MAX_LIVES: 3,
  COLORS: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'cyan', 'lime', 'teal', 'indigo', 'amber'] as const,
  BUTTON_ANIMATION_DURATION: 200, // ms
  SEQUENCE_DELAY: 500, // ms antes de empezar a mostrar la secuencia
  USER_INPUT_DELAY: 100, // ms entre inputs del usuario
  SUCCESS_FEEDBACK_DURATION: 500, // ms
  ERROR_FEEDBACK_DURATION: 1000, // ms
};

// Frecuencias de sonido para cada color (en Hz)
export const SOUND_FREQUENCIES = {
  red: 523.25, // Do5
  blue: 659.25, // Mi5
  green: 783.99, // Sol5
  yellow: 987.77, // Si5
  orange: 554.37, // Do#5
  purple: 698.46, // Fa5
  pink: 830.61, // Sol#5
  cyan: 932.33, // La#5
  lime: 1046.50, // Do6
  teal: 1174.66, // Re6
  indigo: 1318.51, // Mi6
  amber: 1396.91, // Fa6
};

// Duración del sonido (en ms)
export const SOUND_DURATION = 300;

// Puntos por nivel y ronda
export const SCORING = {
  POINTS_PER_COLOR: 10,
  LEVEL_BONUS: 100,
  ROUND_BONUS: 50,
  PERFECT_ROUND_BONUS: 25,
};

// Tipos
export type SimonColor = (typeof GAME_CONFIG.COLORS)[number];

