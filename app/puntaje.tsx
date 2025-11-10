import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { GameColors } from '@/constants/theme';
import { StorageService, GameScore } from '@/services/storage';
import { LEVELS } from '@/constants/game';

export default function PuntajeScreen() {
  const router = useRouter();
  const [scores, setScores] = useState<GameScore[]>([]);
  const [bestScore, setBestScore] = useState<GameScore | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      const allScores = await StorageService.getScores();
      const best = await StorageService.getBestScore();
      setScores(allScores);
      setBestScore(best);
    } catch (error) {
      console.error('Error al cargar puntajes:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadScores();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLevelName = (level: number) => {
    const levelConfig = LEVELS[level - 1];
    return levelConfig ? levelConfig.name : `Nivel ${level}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header fijo */}
      <View style={styles.header}>
        <Text style={styles.title}>PUNTAJES</Text>
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        
        {/* Mejor Puntaje */}
        {bestScore && (
          <View style={styles.bestScoreContainer}>
            <Text style={styles.bestScoreLabel}>MEJOR PUNTAJE</Text>
            <View style={styles.bestScoreCard}>
              <Text style={styles.bestScoreValue}>{bestScore.score}</Text>
              <View style={styles.bestScoreInfo}>
                <Text style={styles.bestScoreText}>
                  {getLevelName(bestScore.level)} - Ronda {bestScore.round}
                </Text>
                <Text style={styles.bestScoreDate}>{formatDate(bestScore.date)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Lista de Puntajes */}
        <View style={styles.scoresContainer}>
          <Text style={styles.scoresTitle}>HISTORIAL</Text>
          {scores.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay puntajes guardados</Text>
              <Text style={styles.emptySubtext}>¡Juega para obtener puntajes!</Text>
            </View>
          ) : (
            scores.map((score, index) => (
              <View key={score.id} style={styles.scoreItem}>
                <View style={styles.scoreRank}>
                  <Text style={styles.scoreRankText}>#{index + 1}</Text>
                </View>
                <View style={styles.scoreInfo}>
                  <Text style={styles.scoreValue}>{score.score}</Text>
                  <Text style={styles.scoreDetails}>
                    {getLevelName(score.level)} - Ronda {score.round}
                  </Text>
                  <Text style={styles.scoreDate}>{formatDate(score.date)}</Text>
                </View>
              </View>
            ))
          )}
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: GameColors.background,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: GameColors.surface,
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
    marginTop: 120,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bestScoreContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  bestScoreLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GameColors.score,
    letterSpacing: 2,
    marginBottom: 10,
  },
  bestScoreCard: {
    backgroundColor: GameColors.surface,
    borderRadius: 15,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: GameColors.score,
    shadowColor: GameColors.score,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bestScoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: GameColors.score,
    marginBottom: 10,
  },
  bestScoreInfo: {
    alignItems: 'center',
  },
  bestScoreText: {
    fontSize: 16,
    color: GameColors.text,
    marginBottom: 5,
  },
  bestScoreDate: {
    fontSize: 12,
    color: GameColors.textSecondary,
  },
  scoresContainer: {
    marginTop: 20,
  },
  scoresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GameColors.text,
    marginBottom: 15,
    letterSpacing: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: GameColors.textSecondary,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: GameColors.textSecondary,
  },
  scoreItem: {
    flexDirection: 'row',
    backgroundColor: GameColors.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GameColors.textSecondary,
  },
  scoreRank: {
    width: 50,
    alignItems: 'center',
    marginRight: 15,
  },
  scoreRankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GameColors.level,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: GameColors.text,
    marginBottom: 5,
  },
  scoreDetails: {
    fontSize: 14,
    color: GameColors.textSecondary,
    marginBottom: 3,
  },
  scoreDate: {
    fontSize: 12,
    color: GameColors.textSecondary,
  },
});

