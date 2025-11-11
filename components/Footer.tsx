import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { styles } from '@/styles/components/Footer.styles';

/**
 * Componente del footer con copyright
 * "2025 © - Fintu Technologies"
 */
export function Footer() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>2025 © - Fintu Technologies</Text>
    </View>
  );
}

