import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { GameFonts } from '@/constants/gameFonts';
import { GameColors } from '@/constants/gameColors';
import { useSoundEffect } from '@/hooks/useAudio';

type CountdownProps = {
  onComplete: () => void;
  duration?: number; // Duración en segundos por número (default: 1)
};

export function Countdown({ onComplete, duration = 1 }: CountdownProps) {
  const [count, setCount] = useState(3);
  const [isVisible, setIsVisible] = useState(true);
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);
  const playCardAppearSound = useSoundEffect(require('@/assets/sfx/cardAppear.wav'));

  useEffect(() => {
    if (count > 0 && isVisible) {
      // Reproducir sonido cuando aparece el número
      playCardAppearSound();

      // Animación de entrada
      scale.value = withSequence(
        withSpring(1.5, { damping: 8, stiffness: 100 }),
        withTiming(1, { duration: 200 })
      );
      opacity.value = withTiming(1, { duration: 100 });
      rotation.value = withSequence(
        withSpring(0, { damping: 10 }),
        withSpring(5, { damping: 8 }),
        withSpring(-5, { damping: 8 }),
        withSpring(0, { damping: 10 })
      );

      // Cambiar al siguiente número después de la duración
      const timeout = setTimeout(() => {
        if (count > 1) {
          // Reset para el siguiente número
          scale.value = 0.5;
          opacity.value = 0;
          setCount(count - 1);
        } else {
          // Último número, completar después de mostrar
          opacity.value = withTiming(0, { duration: 200 }, () => {
            runOnJS(setIsVisible)(false);
            runOnJS(onComplete)();
          });
        }
      }, duration * 1000);

      return () => clearTimeout(timeout);
    }
  }, [count, duration, onComplete, scale, opacity, rotation, isVisible, playCardAppearSound]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  if (!isVisible || count === 0) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.countText}>{count}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: GameColors.backgroundDark,
    borderWidth: 4,
    borderColor: GameColors.textCream,
    ...Platform.select({
      web: {
        boxShadow: '0 0 20px rgba(255, 242, 219, 0.5)',
      } as any,
      default: {
        shadowColor: GameColors.textCream,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
      },
    }),
  },
  countText: {
    fontFamily: GameFonts.pixelFont,
    fontSize: 64,
    color: GameColors.textCream,
    textAlign: 'center',
    ...Platform.select({
      web: {
        textShadow: '3px 3px 0px rgba(0, 0, 0, 0.8), -1px -1px 0px rgba(255, 242, 219, 0.3)',
      } as any,
      default: {
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 0,
      },
    }),
  },
});

