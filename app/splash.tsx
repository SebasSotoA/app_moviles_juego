import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { GameColors } from '@/constants/theme';
import { soundService } from '@/services/soundService';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Inicializar servicios
    const initializeServices = async () => {
      try {
        await soundService.initialize();
      } catch (error) {
        console.error('Error al inicializar servicios:', error);
      }
    };

    initializeServices();

    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Redirigir a Home después de 2.5 segundos
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
        <Text style={styles.title}>SIMÓN</Text>
        <Text style={styles.subtitle}>DICE</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: GameColors.text,
    letterSpacing: 8,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 48,
    fontWeight: '300',
    color: GameColors.textSecondary,
    letterSpacing: 4,
    marginBottom: 40,
  },
  loadingContainer: {
    marginTop: 40,
  },
  loadingText: {
    fontSize: 16,
    color: GameColors.textSecondary,
    letterSpacing: 2,
  },
});

