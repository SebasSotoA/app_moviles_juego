import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type CardProps = {
  id: string;
  imageSource: any;
  isFlipped: boolean;
  isMatched: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export function Card({ id, imageSource, isFlipped, isMatched, onPress, disabled }: CardProps) {
  const rotationY = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (isFlipped || isMatched) {
      rotationY.value = withSpring(180, { damping: 15, stiffness: 100 });
    } else {
      rotationY.value = withSpring(0, { damping: 15, stiffness: 100 });
    }
  }, [isFlipped, isMatched]);

  const handlePress = () => {
    if (disabled || isFlipped || isMatched) return;
    
    scale.value = withTiming(0.95, { duration: 100 }, () => {
      scale.value = withTiming(1, { duration: 100 });
    });
    onPress();
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = rotationY.value;
    return {
      transform: [
        { rotateY: `${rotateY}deg` },
        { scale: scale.value },
        { perspective: 1000 },
      ],
      opacity: rotateY < 90 ? 1 : 0,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = rotationY.value;
    return {
      transform: [
        { rotateY: `${rotateY + 180}deg` },
        { perspective: 1000 },
      ],
      opacity: rotateY >= 90 ? 1 : 0,
    };
  });

  return (
    <Pressable onPress={handlePress} disabled={disabled || isFlipped || isMatched}>
      <View style={styles.container}>
        {/* Back of card */}
        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
          <Image
            source={require('@/assets/images/Medium/Back Blue 1.png')}
            style={styles.cardImage}
            contentFit="contain"
          />
        </Animated.View>
        
        {/* Front of card */}
        <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
          <Image
            source={imageSource}
            style={styles.cardImage}
            contentFit="contain"
          />
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 75,
    height: 105,
    position: 'relative',
  },
  card: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
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

