import React, { useEffect } from 'react';
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

export function SuccessMessage({ visible, onHide, duration = 2000 }: SuccessMessageProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const translateY = useSharedValue(-20);

  useEffect(() => {
    if (visible) {
      // Animación de entrada
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
      translateY.value = withSpring(0, { damping: 10, stiffness: 100 });

      // Animación de salida después de la duración
      const timeout = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        scale.value = withTiming(0.5, { duration: 300 });
        translateY.value = withTiming(-20, { duration: 300 }, () => {
          if (onHide) {
            runOnJS(onHide)();
          }
        });
      }, duration);

      return () => clearTimeout(timeout);
    } else {
      // Reset cuando no es visible - usar withTiming para evitar lectura directa
      opacity.value = withTiming(0, { duration: 0 });
      scale.value = withTiming(0.5, { duration: 0 });
      translateY.value = withTiming(-20, { duration: 0 });
    }
  }, [visible, duration, onHide, opacity, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  // Solo renderizar cuando está visible - NO leer opacity.value durante el render
  if (!visible) {
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
      web: '20%',
      default: '15%',
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
      web: 24,
      default: 16,
    }),
    paddingVertical: Platform.select({
      web: 12,
      default: 10,
    }),
    borderRadius: 8,
    borderWidth: 3,
    borderColor: GameColors.borderLight,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      } as any,
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      },
    }),
  },
  messageText: {
    fontFamily: GameFonts.pixelFont,
    fontSize: Platform.select({
      web: 16,
      default: 14,
    }),
    color: GameColors.textOutline,
    textAlign: 'center',
    ...Platform.select({
      web: {
        textShadow: '2px 2px 0px rgba(0, 0, 0, 0.5)',
      } as any,
      default: {
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
      },
    }),
  },
});

