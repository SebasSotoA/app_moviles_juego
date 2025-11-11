import { Image } from 'expo-image';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSoundEffect } from '@/hooks/useAudio';

// Importar la imagen de reverso de la carta
const CARD_BACK_IMAGE = require('@/assets/images/cardAssets/BackBlue1.png');

type CardProps = {
  id: string;
  imageSource: any;
  isFlipped: boolean;
  isMatched: boolean;
  onPress: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large'; // Para grid responsivo
};

export function Card({ id, imageSource, isFlipped, isMatched, onPress, disabled, size = 'medium' }: CardProps) {
  const playCardSelectSound = useSoundEffect(require('@/assets/sfx/cardSelect.mp3'));

  const handlePress = () => {
    if (disabled || isFlipped || isMatched) return;
    // Llamar onPress primero para que la interacción sea inmediata
    onPress();
    // Reproducir sonido de forma asíncrona para no bloquear
    setTimeout(() => {
      playCardSelectSound();
    }, 0);
  };

  // Determinar si la carta está deshabilitada
  const isDisabled = disabled || isFlipped || isMatched;

  // Renderizar solo la cara visible - simplificado para que funcione primero
  const showFront = isFlipped || isMatched;

  return (
    <Pressable 
      onPress={handlePress} 
      disabled={isDisabled} 
      style={styles.pressable}
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
    >
      <View style={styles.container}>
        {!showFront ? (
          // Mostrar reverso cuando la carta está boca abajo
          <View style={[styles.card, styles.cardBack]}>
            <Image
              source={CARD_BACK_IMAGE}
              style={styles.cardImage}
              contentFit="cover"
              priority="high"
            />
          </View>
        ) : (
          // Mostrar frente cuando la carta está volteada
          <View style={[styles.card, styles.cardFront]}>
            <Image
              source={imageSource}
              style={styles.cardImage}
              contentFit="cover"
              priority="high"
            />
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  container: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '3px 3px 4px rgba(0, 0, 0, 0.4)',
      } as any,
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 6,
      },
    }),
    borderWidth: 2,
    borderColor: '#fff',
  },
  cardBack: {
    backgroundColor: '#1a4d7a',
  },
  cardFront: {
    backgroundColor: '#fff',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
});

