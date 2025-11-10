import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { GameColors } from '@/constants/theme';

export default function CreditosScreen() {
  const router = useRouter();

  const technologies = [
    'React Native',
    'Expo',
    'TypeScript',
    'React Navigation',
    'React Native Reanimated',
    'Expo AV',
    'AsyncStorage',
    'Expo Haptics',
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>CRÉDITOS</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Información del Juego */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SIMÓN DICE</Text>
          <Text style={styles.sectionText}>
            Juego de memoria desarrollado con React Native y Expo
          </Text>
        </View>

        {/* Información del Autor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DESARROLLADO POR</Text>
          <Text style={styles.sectionText}>
            [Nombre del Autor]
          </Text>
          <Text style={styles.sectionSubtext}>
            Curso: Aplicaciones Móviles
          </Text>
          <Text style={styles.sectionSubtext}>
            Universidad: [Nombre de la Universidad]
          </Text>
        </View>

        {/* Tecnologías Utilizadas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TECNOLOGÍAS</Text>
          <View style={styles.techContainer}>
            {technologies.map((tech, index) => (
              <View key={index} style={styles.techItem}>
                <Text style={styles.techText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Información Adicional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CARACTERÍSTICAS</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• 3 niveles de dificultad progresiva</Text>
            <Text style={styles.featureItem}>• Sistema de vidas (3 vidas por partida)</Text>
            <Text style={styles.featureItem}>• Animaciones fluidas con Reanimated</Text>
            <Text style={styles.featureItem}>• Efectos de sonido programáticos</Text>
            <Text style={styles.featureItem}>• Persistencia de puntajes</Text>
            <Text style={styles.featureItem}>• Interfaz personalizada</Text>
            <Text style={styles.featureItem}>• Compatible con Android e iOS</Text>
          </View>
        </View>

        {/* Versión */}
        <View style={styles.section}>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 - Todos los derechos reservados</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GameColors.background,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: GameColors.text,
    letterSpacing: 4,
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: GameColors.surface,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: GameColors.textSecondary,
  },
  backButtonText: {
    color: GameColors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 30,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GameColors.level,
    marginBottom: 15,
    letterSpacing: 2,
  },
  sectionText: {
    fontSize: 16,
    color: GameColors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionSubtext: {
    fontSize: 14,
    color: GameColors.textSecondary,
    textAlign: 'center',
    marginBottom: 5,
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  techItem: {
    backgroundColor: GameColors.surface,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GameColors.info,
    margin: 5,
  },
  techText: {
    fontSize: 14,
    color: GameColors.text,
    fontWeight: '600',
  },
  featureList: {
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 300,
  },
  featureItem: {
    fontSize: 14,
    color: GameColors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  versionText: {
    fontSize: 14,
    color: GameColors.textSecondary,
    textAlign: 'center',
    marginBottom: 5,
  },
  copyrightText: {
    fontSize: 12,
    color: GameColors.textSecondary,
    textAlign: 'center',
  },
});

