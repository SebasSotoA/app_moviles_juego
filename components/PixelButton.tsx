import React, { useState } from 'react';
import { Platform, StyleSheet, Text, Pressable, View} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { GameColors } from '@/constants/gameColors';
import { GameFonts } from '@/constants/gameFonts';

type PixelButtonProps = {
  label?: string;
  onPress?: () => void;
  size?: 'large' | 'small';
  imageSource?: any;
  pressedImageSource?: any;
  variant?: 'gradient' | 'image';
};

/**
 * Componente de botón pixelado reutilizable
 * Soporta estados normal y pressed
 * Puede usar gradiente o imágenes
 */
export function PixelButton({
  label,
  onPress,
  size = 'small',
  imageSource,
  pressedImageSource,
  variant = 'gradient',
}: PixelButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const buttonStyle = size === 'large' ? styles.largeButton : styles.smallButton;
  const textStyle = size === 'large' ? styles.largeText : styles.smallText;

  // Manejar eventos de presión de forma más robusta
  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    // Asegurar que el estado se resetee después del press
    setIsPressed(false);
  };

  if (variant === 'image' && imageSource) {
    const imageStyle = size === 'large' ? styles.largeImageButton : styles.smallImageButton;
    
    return (
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.imageButtonContainer,
          size === 'small' && styles.imageButtonContainerSmall,
        ]}
        // Área táctil más grande para mejor UX en móvil
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        // Deshabilitar el efecto ripple de Android
        android_ripple={null}
      >
        <View style={[styles.imageWrapper, imageStyle]}>
          {/* Imagen normal - siempre renderizada */}
          <Image
            source={imageSource}
            style={[
              imageStyle,
              styles.buttonImage,
              styles.imageBase,
              { opacity: isPressed && pressedImageSource ? 0 : 1 },
            ]}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={0}
          />
          {/* Imagen presionada - solo si existe */}
          {pressedImageSource && (
            <Image
              source={pressedImageSource}
              style={[
                imageStyle,
                styles.buttonImage,
                styles.imagePressedOverlay,
                { opacity: isPressed ? 1 : 0 },
              ]}
              contentFit="contain"
              cachePolicy="memory-disk"
              transition={0}
            />
          )}
        </View>
      </Pressable>
    );
  }

  // Botón con gradiente (para PLAY)
  return (
    <View style={styles.buttonWrapper}>
      {/* Sombra para efecto 3D */}
      <View style={[styles.shadowLayer, size === 'large' && styles.shadowLayerLarge]} />
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          buttonStyle,
          isPressed && styles.pressedButton,
        ]}
        // Área táctil más grande para mejor UX en móvil
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        // Deshabilitar el efecto ripple de Android
        android_ripple={null}
      >
        {/* @ts-expect-error - expo-linear-gradient compatibility with React 19 */}
        <LinearGradient
          colors={GameColors.gradient.colors}
          locations={GameColors.gradient.locations}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={[
            styles.borderContainer,
            size === 'small' && styles.borderContainerSmall,
            isPressed && styles.pressedBorder
          ]}>
            {/* Bordes para efecto embossed */}
            {!isPressed && (
              <>
                <View style={styles.borderTop} />
                <View style={styles.borderLeft} />
              </>
            )}
            <View style={[styles.borderBottom, isPressed && styles.pressedBorderBottom]} />
            <View style={[styles.borderRight, isPressed && styles.pressedBorderRight]} />
            
            <Text style={[textStyle, isPressed && styles.pressedText]}>{label}</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    position: 'relative',
    marginVertical: 8,
  },
  shadowLayer: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -3,
    borderRadius: 8,
    backgroundColor: GameColors.shadowDark,
    zIndex: 0,
  },
  shadowLayerLarge: {
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    borderRadius: 10,
  },
  largeButton: {
    minWidth: 220,
    minHeight: 65,
    zIndex: 1,
  },
  smallButton: {
    minWidth: 120,
    minHeight: 50,
    zIndex: 1,
  },
  gradient: {
    flex: 1,
    borderRadius: 8,
    padding: 2,
  },
  borderContainer: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: GameColors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  borderContainerSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: GameColors.borderLight,
    opacity: 0.7,
  },
  borderLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 2,
    backgroundColor: GameColors.borderLight,
    opacity: 0.7,
  },
  borderBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: GameColors.shadowDark,
    opacity: 0.9,
  },
  borderRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 2,
    backgroundColor: GameColors.shadowDark,
    opacity: 0.9,
  },
  pressedBorder: {
    transform: [{ translateY: 2 }],
  },
  pressedBorderBottom: {
    opacity: 1,
    height: 3,
  },
  pressedBorderRight: {
    opacity: 1,
    width: 3,
  },
  largeText: {
    fontFamily: GameFonts.pixelFont,
    fontSize: 16,
    color: '#FFFFFF',
    ...Platform.select({
      web: {
        textShadow: '2px 2px 0px ' + GameColors.textOutline,
      } as any,
      default: {
        textShadowColor: GameColors.textOutline,
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
      },
    }),
    letterSpacing: 1,
    zIndex: 2,
  },
  smallText: {
    fontFamily: GameFonts.pixelFont,
    fontSize: GameFonts.sizes.badge,
    color: '#FFFFFF',
    ...Platform.select({
      web: {
        textShadow: '1px 1px 0px ' + GameColors.textOutline,
      } as any,
      default: {
        textShadowColor: GameColors.textOutline,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
      },
    }),
    zIndex: 2,
  },
  pressedText: {
    opacity: 0.95,
  },
  pressedContainer: {
    opacity: 0.95,
  },
  pressedButton: {
    opacity: 0.98,
  },
  imageButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageButtonContainerSmall: {
    marginHorizontal: 6,
  },
  imageWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    // Estilos aplicados dinámicamente
  },
  imageBase: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  imagePressedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  largeImageButton: {
    width: 240,
    height: 70,
  },
  smallImageButton: {
    width: 140,
    height: 50,
  },
});

