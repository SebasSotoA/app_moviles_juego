import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatsBadge } from './StatsBadge';

type GameStatsRowProps = {
  time: number; // en segundos
  score: number;
  level: number;
};

/**
 * Componente que renderiza la fila de estadísticas del juego
 * Time, Score, Level con valores dinámicos
 */
export function GameStatsRow({ time, score, level }: GameStatsRowProps) {
  // Formatear tiempo como MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <StatsBadge icon="⏱️" value={formatTime(time)} />
      </View>
      <View style={styles.badge}>
        <StatsBadge icon="⭐" value={score.toString()} />
      </View>
      <View style={styles.badge}>
        <StatsBadge icon="🏆" value={`LV.${level}`} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  badge: {
    marginHorizontal: 6,
  },
});

