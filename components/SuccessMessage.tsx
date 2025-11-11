import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
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
  const [shouldRender, setShouldRender] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onHideRef = useRef(onHide);
  const isMountedRef = useRef(true);
  const visibleRef = useRef(visible);

  // Función para ocultar el mensaje
  const hideMessage = () => {
    if (isMountedRef.current) {
      setShouldRender(false);
      if (onHideRef.current) {
        onHideRef.current();
      }
    }
  };

  // Función para ocultar sin callback
  const hideMessageOnly = () => {
    if (isMountedRef.current) {
      setShouldRender(false);
    }
  };

  // Actualizar la ref cuando cambie el callback
  useEffect(() => {
    onHideRef.current = onHide;
  }, [onHide]);

  // Actualizar la ref de visible
  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  // Cleanup al desmontar
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (visible && isMountedRef.current) {
      // Resetear y mostrar
      opacity.value = 0;
      setShouldRender(true);
      
      // Fade in suave
      opacity.value = withTiming(1, { duration: 150 });

      // Fade out y ocultar después de la duración (solo si aún está visible)
      timeoutRef.current = setTimeout(() => {
        if (!isMountedRef.current || !visibleRef.current) {
          return;
        }
        opacity.value = withTiming(0, { duration: 150 }, () => {
          runOnJS(hideMessage)();
        });
      }, duration);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    } else if (!visible && shouldRender && isMountedRef.current) {
      // Si se oculta manualmente (se presiona otra tarjeta), fade out inmediatamente
      opacity.value = withTiming(0, { duration: 150 }, () => {
        runOnJS(hideMessageOnly)();
      });
    }
  }, [visible, duration, opacity, shouldRender]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
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
    bottom: Platform.select({
      web: 120,
      default: 110,
    }),
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 500,
    pointerEvents: 'none',
  },
  messageContainer: {
    backgroundColor: GameColors.gradient.colors[4], // '#FFF2DB'
    paddingHorizontal: Platform.select({
      web: 12,
      default: 10,
    }),
    paddingVertical: Platform.select({
      web: 6,
      default: 5,
    }),
    borderRadius: 4,
    borderWidth: 2,
    borderColor: GameColors.borderDark,
    opacity: 0.95,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      } as any,
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
      },
    }),
  },
  messageText: {
    fontFamily: GameFonts.pixelFont,
    fontSize: Platform.select({
      web: 10,
      default: 9,
    }),
    color: GameColors.textOutline,
    textAlign: 'center',
    ...Platform.select({
      web: {
        textShadow: '1px 1px 0px rgba(0, 0, 0, 0.6)',
      } as any,
      default: {
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
      },
    }),
  },
});

