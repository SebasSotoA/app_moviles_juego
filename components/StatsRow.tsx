import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatsBadge } from './StatsBadge';

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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  badge: {
    marginHorizontal: 6,
  },
});

