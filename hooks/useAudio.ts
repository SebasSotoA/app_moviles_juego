/**
 * Hooks personalizados para manejo de audio con expo-audio
 */

import { useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer } from 'expo-audio';

/**
 * Hook para reproducir música de fondo en loop
 * @param source - Ruta del archivo de audio (require)
 * @param shouldPlay - Si debe reproducirse o no
 */
export function useBackgroundMusic(source: any, shouldPlay: boolean = true) {
  const player = useAudioPlayer(source);
  const previousSourceRef = useRef<any>(null);

  useEffect(() => {
    if (!player) return;

    // Si cambió el source, recargar
    if (previousSourceRef.current !== source) {
      previousSourceRef.current = source;
      player.replace(source);
    }

    if (shouldPlay) {
      player.loop = true;
      player.play();
    } else {
      player.pause();
    }

    return () => {
      if (player) {
        player.pause();
      }
    };
  }, [player, source, shouldPlay]);
}

/**
 * Hook para reproducir efectos de sonido (una sola vez)
 * @param source - Ruta del archivo de audio (require)
 * @returns Función para reproducir el sonido
 */
export function useSoundEffect(source: any) {
  const player = useAudioPlayer(source);

  const play = useCallback(() => {
    if (!player) return;

    try {
      player.loop = false;
      player.replay();
    } catch (error) {
      console.warn('Error playing sound effect:', error);
    }
  }, [player]);

  return play;
}

