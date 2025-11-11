/**
 * Hooks personalizados para manejo de audio con expo-audio
 */

import { useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { audioManager } from './useAudioManager';

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
      try {
        player.replace(source);
      } catch (error) {
        // Ignorar errores al reemplazar
      }
    }

    if (shouldPlay) {
      // Registrar esta música como la actual y detener otras
      audioManager.setCurrentMusic(player, source);
      try {
        player.loop = true;
        player.play();
      } catch (error) {
        // Ignorar errores al reproducir
      }
    } else {
      try {
        player.pause();
      } catch (error) {
        // Ignorar errores al pausar
      }
      audioManager.clearCurrentMusic(player);
    }

    return () => {
      // No hacer cleanup aquí porque el player puede estar liberado
      // El cleanup se maneja automáticamente cuando el componente se desmonta
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
      // Reproducir sin detener primero para evitar problemas
      player.play();
    } catch (error) {
      // Ignorar errores silenciosamente
    }
  }, [player]);

  return play;
}

