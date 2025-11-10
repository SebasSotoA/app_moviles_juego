import { Platform } from 'react-native';
import { SOUND_FREQUENCIES, SOUND_DURATION, SimonColor } from '@/constants/game';

class SoundService {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;
  private soundEnabled = true;
  private activeOscillators: OscillatorNode[] = [];
  private isCancelled = false;

  // Inicializar el servicio de sonidos
  async initialize(): Promise<void> {
    // Si ya está inicializado y el contexto existe, solo reanudar si está suspendido
    if (this.isInitialized && this.audioContext) {
      if (this.audioContext.state === 'suspended') {
        try {
          await this.audioContext.resume();
        } catch (error) {
          console.warn('Error al reanudar AudioContext:', error);
        }
      }
      return;
    }

    // Si el contexto está cerrado, necesitamos crear uno nuevo
    if (this.audioContext && this.audioContext.state === 'closed') {
      this.audioContext = null;
      this.isInitialized = false;
    }

    if (this.isInitialized) return;

    try {
      // Crear contexto de audio para generar tonos usando Web Audio API
      // Web Audio API está disponible en web y en algunos entornos de React Native
      if (typeof window !== 'undefined') {
        // Web: usar AudioContext nativo del navegador
        if ('AudioContext' in window) {
          this.audioContext = new window.AudioContext();
        } else if ('webkitAudioContext' in window) {
          // Fallback para navegadores antiguos
          this.audioContext = new (window as any).webkitAudioContext();
        }
      } else if (Platform.OS !== 'web') {
        // En React Native, Web Audio API puede no estar disponible directamente
        // En este caso, los sonidos no se reproducirán pero la app seguirá funcionando
        // Para una implementación completa en móvil, se recomendaría:
        // 1. Pre-generar archivos de audio para cada frecuencia
        // 2. Usar expo-audio para cargar y reproducir esos archivos
        console.log('Web Audio API no disponible en este entorno nativo');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Error al inicializar el servicio de sonidos:', error);
    }
  }

  // Detener todos los sonidos activos
  stopAllSounds(): void {
    this.isCancelled = true;
    this.activeOscillators.forEach((oscillator) => {
      try {
        oscillator.stop();
        oscillator.disconnect();
      } catch (error) {
        // El oscilador ya puede estar detenido
      }
    });
    this.activeOscillators = [];
  }

  // Cancelar flag de cancelación (para permitir nuevos sonidos)
  resetCancelFlag(): void {
    this.isCancelled = false;
  }

  // Reproducir sonido para un color
  async playSound(color: SimonColor): Promise<void> {
    if (!this.soundEnabled || this.isCancelled) return;

    try {
      await this.initialize();
      const frequency = SOUND_FREQUENCIES[color];

      // Intentar usar Web Audio API si está disponible
      if (this.audioContext) {
        try {
          await this.playToneWithWebAudio(frequency);
          return;
        } catch (error) {
          console.warn('Error al reproducir con Web Audio API, intentando alternativa:', error);
        }
      }

      // Fallback: Para entornos donde Web Audio API no está disponible (React Native móvil)
      // En una implementación completa para producción, se recomendaría:
      // 1. Pre-generar archivos de audio WAV/MP3 para cada frecuencia (red, blue, green, yellow)
      // 2. Guardarlos en la carpeta assets/audio/
      // 3. Usar expo-audio para cargar y reproducir esos archivos:
      //    import { useAudioPlayer } from 'expo-audio';
      //    const player = useAudioPlayer(require('@/assets/audio/red.wav'));
      //    player.play();
      // Esto proporcionaría una experiencia más consistente en todas las plataformas
      console.log(`Playing sound for ${color} at ${frequency}Hz (Web Audio API no disponible)`);
    } catch (error) {
      console.error(`Error al reproducir sonido para ${color}:`, error);
    }
  }

  // Reproducir tono con Web Audio API
  private async playToneWithWebAudio(frequency: number): Promise<void> {
    if (!this.audioContext || this.isCancelled) {
      return;
    }

    try {
      // Reanudar contexto si está suspendido
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      if (this.isCancelled) return;

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      // Agregar a la lista de osciladores activos
      this.activeOscillators.push(oscillator);

      // Envolvente ADSR para suavizar el sonido
      const now = this.audioContext.currentTime;
      const attackTime = 0.01;
      const decayTime = 0.05;
      const sustainLevel = 0.3;
      const releaseTime = 0.1;
      const duration = SOUND_DURATION / 1000;

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + attackTime);
      gainNode.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
      gainNode.gain.setValueAtTime(sustainLevel, now + duration - releaseTime);
      gainNode.gain.linearRampToValueAtTime(0, now + duration);

      oscillator.start(now);
      
      // Limpiar cuando termine
      oscillator.onended = () => {
        const index = this.activeOscillators.indexOf(oscillator);
        if (index > -1) {
          this.activeOscillators.splice(index, 1);
        }
      };

      // Si no está cancelado, programar el stop
      if (!this.isCancelled) {
        oscillator.stop(now + duration);
        
        // Esperar a que termine el sonido (pero verificar cancelación)
        await new Promise((resolve) => {
          const timeout = setTimeout(resolve, SOUND_DURATION + 50);
          // Si se cancela, resolver inmediatamente
          if (this.isCancelled) {
            clearTimeout(timeout);
            resolve(undefined);
          }
        });
      } else {
        // Si se canceló, detener inmediatamente
        oscillator.stop();
        oscillator.disconnect();
        const index = this.activeOscillators.indexOf(oscillator);
        if (index > -1) {
          this.activeOscillators.splice(index, 1);
        }
      }
    } catch (error) {
      console.error('Error al reproducir tono con Web Audio API:', error);
      // No lanzar error si fue cancelado
      if (!this.isCancelled) {
        throw error;
      }
    }
  }

  // Habilitar/deshabilitar sonidos
  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  // Verificar si los sonidos están habilitados
  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  // Limpiar recursos (solo detener sonidos, no cerrar el contexto)
  async cleanup(): Promise<void> {
    try {
      // Detener todos los sonidos activos
      this.stopAllSounds();
      // No cerrar el contexto para poder reutilizarlo
    } catch (error) {
      console.error('Error al limpiar recursos de sonido:', error);
    }
  }
}

// Instancia singleton del servicio
export const soundService = new SoundService();

