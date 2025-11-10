/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// Colores del juego Simón Dice
export const SimonColors = {
  red: {
    primary: '#E74C3C',
    light: '#EC7063',
    dark: '#C0392B',
    pressed: '#A93226',
  },
  blue: {
    primary: '#3498DB',
    light: '#5DADE2',
    dark: '#2874A6',
    pressed: '#1F618D',
  },
  green: {
    primary: '#2ECC71',
    light: '#58D68D',
    dark: '#239B56',
    pressed: '#1E8449',
  },
  yellow: {
    primary: '#F1C40F',
    light: '#F7DC6F',
    dark: '#D4AC0D',
    pressed: '#B7950B',
  },
  orange: {
    primary: '#E67E22',
    light: '#EB984E',
    dark: '#D35400',
    pressed: '#BA4A00',
  },
  purple: {
    primary: '#9B59B6',
    light: '#BB8FCE',
    dark: '#7D3C98',
    pressed: '#6C3483',
  },
  pink: {
    primary: '#E91E63',
    light: '#F48FB1',
    dark: '#C2185B',
    pressed: '#AD1457',
  },
  cyan: {
    primary: '#1ABC9C',
    light: '#48C9B0',
    dark: '#16A085',
    pressed: '#138D75',
  },
  lime: {
    primary: '#CDDC39',
    light: '#D4E157',
    dark: '#AFB42B',
    pressed: '#9E9D24',
  },
  teal: {
    primary: '#009688',
    light: '#4DB6AC',
    dark: '#00796B',
    pressed: '#00695C',
  },
  indigo: {
    primary: '#3F51B5',
    light: '#7986CB',
    dark: '#303F9F',
    pressed: '#283593',
  },
  amber: {
    primary: '#FFC107',
    light: '#FFD54F',
    dark: '#FFA000',
    pressed: '#FF8F00',
  },
};

// Colores del juego (estados y UI)
export const GameColors = {
  background: '#1A1A2E',
  surface: '#16213E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  success: '#2ECC71',
  error: '#E74C3C',
  warning: '#F39C12',
  info: '#3498DB',
  life: '#E74C3C',
  level: '#9B59B6',
  score: '#F1C40F',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
