import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Audio } from 'expo-av';

type BackgroundMusicContextValue = {
  ensurePlaying: () => Promise<void>;
  pause: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  isPlaying: boolean;
};

const BackgroundMusicContext = createContext<BackgroundMusicContextValue | undefined>(undefined);

const clampVolume = (volume: number) => {
  if (Number.isNaN(volume)) {
    return 1;
  }
  return Math.min(1, Math.max(0, volume));
};

export function BackgroundMusicProvider({ children }: { children: React.ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const loadingPromiseRef = useRef<Promise<Audio.Sound> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const loadSound = useCallback(async () => {
    if (soundRef.current) {
      return soundRef.current;
    }

    if (!loadingPromiseRef.current) {
      loadingPromiseRef.current = (async () => {
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            shouldDuckAndroid: false,
            playThroughEarpieceAndroid: false,
          });
        } catch (error) {
          console.warn('No se pudo configurar el modo de audio', error);
        }

        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/music/DwarvenMine.mp3'),
          {
            volume: 0.6,
            isLooping: true,
            shouldPlay: false,
          },
          (status) => {
            if (!status.isLoaded) {
              return;
            }
            setIsPlaying(status.isPlaying ?? false);
          },
        );

        soundRef.current = sound;
        return sound;
      })();
    }

    try {
      const sound = await loadingPromiseRef.current;
      return sound;
    } catch (error) {
      loadingPromiseRef.current = null;
      throw error;
    }
  }, []);

  const ensurePlaying = useCallback(async () => {
    try {
      const sound = await loadSound();
      const status = await sound.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await sound.playAsync();
      }
    } catch (error) {
      console.warn('No se pudo reproducir la música de fondo', error);
    }
  }, [loadSound]);

  const pause = useCallback(async () => {
    try {
      const sound = soundRef.current;
      if (!sound) {
        return;
      }
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await sound.pauseAsync();
      }
    } catch (error) {
      console.warn('No se pudo pausar la música de fondo', error);
    }
  }, []);

  const setVolume = useCallback(async (volume: number) => {
    try {
      const sound = await loadSound();
      const nextVolume = clampVolume(volume);
      await sound.setVolumeAsync(nextVolume);
    } catch (error) {
      console.warn('No se pudo ajustar el volumen de la música de fondo', error);
    }
  }, [loadSound]);

  useEffect(() => {
    ensurePlaying();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {
          // Silenciar cualquier error durante el desmontaje
        });
        soundRef.current = null;
      }
    };
  }, [ensurePlaying]);

  const value = useMemo<BackgroundMusicContextValue>(
    () => ({
      ensurePlaying,
      pause,
      setVolume,
      isPlaying,
    }),
    [ensurePlaying, pause, setVolume, isPlaying],
  );

  return <BackgroundMusicContext.Provider value={value}>{children}</BackgroundMusicContext.Provider>;
}

export function useBackgroundMusic() {
  const context = useContext(BackgroundMusicContext);
  if (!context) {
    throw new Error('useBackgroundMusic debe utilizarse dentro de un BackgroundMusicProvider');
  }
  return context;
}

