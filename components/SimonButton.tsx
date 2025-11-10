import { SimonColor } from '@/constants/game';
import { SimonColors } from '@/constants/theme';
import { soundService } from '@/services/soundService';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface SimonButtonProps {
  color: SimonColor;
  onPress: (color: SimonColor) => void;
  disabled?: boolean;
  isActive?: boolean;
  size?: number;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const SimonButton: React.FC<SimonButtonProps> = ({
  color,
  onPress,
  disabled = false,
  isActive = false,
  size = 150,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const glow = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      // Animación cuando se activa (secuencia del juego)
      scale.value = withSequence(
        withTiming(0.95, { duration: 100, easing: Easing.out(Easing.ease) }),
        withTiming(1.05, { duration: 100, easing: Easing.in(Easing.ease) }),
        withSpring(1, { damping: 10, stiffness: 200 })
      );
      glow.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 300 })
      );
      opacity.value = withSequence(
        withTiming(0.8, { duration: 100 }),
        withTiming(1, { duration: 300 })
      );
    }
  }, [isActive]);

  const handlePress = async () => {
    if (disabled) return;

    // Animación de pulsado
    scale.value = withSequence(
      withTiming(0.9, { duration: 50 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    glow.value = withSequence(
      withTiming(1, { duration: 50 }),
      withTiming(0, { duration: 200 })
    );

    // Haptic feedback
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Haptics no disponibles
    }

    // Reproducir sonido
    await soundService.playSound(color);

    // Llamar al callback
    onPress(color);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glow.value * 0.6,
      shadowOpacity: glow.value * 0.8,
    };
  });

  const getColorStyles = () => {
    const colors = SimonColors[color];
    return {
      backgroundColor: colors.primary,
      borderColor: colors.light,
      shadowColor: colors.primary,
    };
  };

  const colorStyles = getColorStyles();

  return (
    <AnimatedTouchable
      style={[animatedStyle]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}>
      <View
        style={[
          styles.button,
          {
            width: size,
            height: size,
            backgroundColor: colorStyles.backgroundColor,
            borderColor: colorStyles.borderColor,
            shadowColor: colorStyles.shadowColor,
            opacity: disabled ? 0.5 : 1,
          },
        ]}>
        <Animated.View
          style={[
            styles.glow,
            glowStyle,
            {
              width: size,
              height: size,
              backgroundColor: colorStyles.backgroundColor,
              shadowColor: colorStyles.shadowColor,
            },
          ]}
        />
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 20,
    shadowOpacity: 0.6,
    elevation: 8,
  },
  glow: {
    position: 'absolute',
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 30,
    elevation: 12,
  },
});

