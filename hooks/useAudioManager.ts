/**
 * Gestor global de audio para evitar que múltiples músicas se reproduzcan simultáneamente
 */

import { useRef } from 'react';
import { useAudioPlayer } from 'expo-audio';

type MusicInstance = {
  player: ReturnType<typeof useAudioPlayer>;
  source: any;
};

class AudioManager {
  private static instance: AudioManager;
  private currentMusic: MusicInstance | null = null;

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  setCurrentMusic(player: ReturnType<typeof useAudioPlayer>, source: any) {
    // Detener música anterior si existe
    if (this.currentMusic && this.currentMusic.player !== player) {
      try {
        if (this.currentMusic.player) {
          this.currentMusic.player.pause();
        }
      } catch (error) {
        // Ignorar errores - el player puede estar liberado
      }
    }
    this.currentMusic = { player, source };
  }

  clearCurrentMusic(player: ReturnType<typeof useAudioPlayer>) {
    if (this.currentMusic?.player === player) {
      this.currentMusic = null;
    }
  }

  stopAllMusic() {
    if (this.currentMusic) {
      try {
        if (this.currentMusic.player) {
          this.currentMusic.player.pause();
        }
      } catch (error) {
        // Ignorar errores - el player puede estar liberado
      }
      this.currentMusic = null;
    }
  }
}

export const audioManager = AudioManager.getInstance();

