import AsyncStorage from '@react-native-async-storage/async-storage';

// Claves de almacenamiento
const STORAGE_KEYS = {
  SCORES: '@simon_dice:scores',
  BEST_SCORE: '@simon_dice:best_score',
  SETTINGS: '@simon_dice:settings',
} as const;

// Tipos
export interface GameScore {
  id: string;
  score: number;
  level: number;
  round: number;
  date: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  vibrationsEnabled: boolean;
}

// Servicio de almacenamiento
export const StorageService = {
  // Guardar puntaje
  async saveScore(score: GameScore): Promise<void> {
    try {
      const scores = await this.getScores();
      scores.push(score);
      // Ordenar por puntaje descendente
      scores.sort((a, b) => b.score - a.score);
      // Mantener solo los últimos 50 puntajes
      const limitedScores = scores.slice(0, 50);
      await AsyncStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(limitedScores));
      
      // Actualizar mejor puntaje si es necesario
      const bestScore = await this.getBestScore();
      if (!bestScore || score.score > bestScore.score) {
        await AsyncStorage.setItem(STORAGE_KEYS.BEST_SCORE, JSON.stringify(score));
      }
    } catch (error) {
      console.error('Error al guardar puntaje:', error);
    }
  },

  // Obtener todos los puntajes
  async getScores(): Promise<GameScore[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SCORES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al obtener puntajes:', error);
      return [];
    }
  },

  // Obtener mejor puntaje
  async getBestScore(): Promise<GameScore | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BEST_SCORE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error al obtener mejor puntaje:', error);
      return null;
    }
  },

  // Limpiar todos los puntajes
  async clearScores(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SCORES);
      await AsyncStorage.removeItem(STORAGE_KEYS.BEST_SCORE);
    } catch (error) {
      console.error('Error al limpiar puntajes:', error);
    }
  },

  // Guardar configuración
  async saveSettings(settings: GameSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    }
  },

  // Obtener configuración
  async getSettings(): Promise<GameSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data
        ? JSON.parse(data)
        : {
            soundEnabled: true,
            vibrationsEnabled: true,
          };
    } catch (error) {
      console.error('Error al obtener configuración:', error);
      return {
        soundEnabled: true,
        vibrationsEnabled: true,
      };
    }
  },
};

