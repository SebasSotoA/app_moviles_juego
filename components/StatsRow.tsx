import React from 'react';
import { View } from 'react-native';
import { StatsBadge } from './StatsBadge';
import { styles } from '@/styles/components/StatsRow.styles';

/**
 * Componente que renderiza la fila de estadísticas
 * Time, Score, Level
 */
export function StatsRow() {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <StatsBadge icon="⏱️" value="02:34" />
      </View>
      <View style={styles.badge}>
        <StatsBadge icon="⭐" value="1250" />
      </View>
      <View style={styles.badge}>
        <StatsBadge icon="🏆" value="LV.3" />
      </View>
    </View>
  );
}