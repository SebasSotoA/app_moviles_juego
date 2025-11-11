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

type SuccessMessageProps = {
  visible: boolean;
  onHide?: () => void;
  duration?: number;
};

export function SuccessMessage({ visible, onHide, duration = 1000 }: SuccessMessageProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const translateY = useSharedValue(-20);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (visible) {
      // Resetear valores antes de mostrar
      opacity.value = 0;
      scale.value = 0.5;
      translateY.value = -20;
      setShouldRender(true);
      
      // Animación de entrada
      const enterTimeout = setTimeout(() => {
        opacity.value = withTiming(1, { duration: 200 });
        scale.value = withSpring(1.2, { damping: 12, stiffness: 150 });
        translateY.value = withSpring(0, { damping: 12, stiffness: 150 });
      }, 50);

      // Animación de salida después de la duración
      const exitTimeout = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 200 });
        scale.value = withTiming(0.8, { duration: 200 });
        translateY.value = withTiming(-30, { duration: 200 }, () => {
          runOnJS(() => {
            setShouldRender(false);
            if (onHide) {
              onHide();
            }
          })();
        });
      }, duration + 250);

      return () => {
        clearTimeout(enterTimeout);
        clearTimeout(exitTimeout);
      };
    } else if (shouldRender) {
      // Si se oculta manualmente, animar salida inmediatamente
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.8, { duration: 150 });
      translateY.value = withTiming(-30, { duration: 150 }, () => {
        runOnJS(setShouldRender)(false);
      });
    }
  }, [visible, duration, onHide, opacity, scale, translateY, shouldRender]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  // No renderizar si no debe mostrarse
  if (!shouldRender) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none">
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>¡PAR ENCONTRADO!</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.select({
      web: '10%',
      default: '8%',
    }),
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    pointerEvents: 'none',
  },
  messageContainer: {
    backgroundColor: GameColors.gradient.colors[4], // '#FFF2DB'
    paddingHorizontal: Platform.select({
      web: 20,
      default: 14,
    }),
    paddingVertical: Platform.select({
      web: 10,
      default: 8,
    }),
    borderRadius: 6,
    borderWidth: 3,
    borderColor: GameColors.borderDark,
    opacity: 0.95,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
      } as any,
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
      },
    }),
  },
  messageText: {
    fontFamily: GameFonts.pixelFont,
    fontSize: Platform.select({
      web: 14,
      default: 12,
    }),
    color: GameColors.textOutline,
    textAlign: 'center',
    ...Platform.select({
      web: {
        textShadow: '2px 2px 0px rgba(0, 0, 0, 0.6)',
      } as any,
      default: {
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
      },
    }),
  },
});

