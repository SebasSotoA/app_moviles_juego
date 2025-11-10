import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { GameColors } from '@/constants/theme';
import { useGame } from '@/contexts/GameContext';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { resetGame } = useGame();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // Resetear juego al entrar a home
    resetGame();

    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Animación escalonada de botones
    const buttonDelays = [200, 400, 600];
    buttonAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: buttonDelays[index],
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handlePress = async (route: string) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Haptics no disponibles
    }
    router.push(`/${route}` as any);
  };

  const Button = ({
    title,
    onPress,
    delay,
    index,
  }: {
    title: string;
    onPress: () => void;
    delay: number;
    index: number;
  }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: buttonAnimations[index],
            transform: [
              {
                translateY: buttonAnimations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
              { scale },
            ],
          },
        ]}>
        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}>
        <View style={styles.header}>
          <Text style={styles.title}>SIMÓN</Text>
          <Text style={styles.subtitle}>DICE</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            title="JUGAR"
            onPress={() => handlePress('juego')}
            delay={200}
            index={0}
          />
          <Button
            title="PUNTAJES"
            onPress={() => handlePress('puntaje')}
            delay={400}
            index={1}
          />
          <Button
            title="CRÉDITOS"
            onPress={() => handlePress('creditos')}
            delay={600}
            index={2}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GameColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    color: GameColors.text,
    letterSpacing: 12,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '300',
    color: GameColors.textSecondary,
    letterSpacing: 8,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: GameColors.surface,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: GameColors.info,
    shadowColor: GameColors.info,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GameColors.text,
    letterSpacing: 2,
  },
});

