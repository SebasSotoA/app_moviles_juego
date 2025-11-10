import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from './Card';
import { Heart } from './Heart';

type CardData = {
  id: string;
  pairId: string;
  imageSource: any;
  isFlipped: boolean;
  isMatched: boolean;
};

// Seleccionamos algunas cartas para el juego (6 pares = 12 cartas)
const CARD_PAIRS = [
  { id: '1', image: require('@/assets/images/Medium/Clubs 1.png') },
  { id: '2', image: require('@/assets/images/Medium/Diamond 1.png') },
  { id: '3', image: require('@/assets/images/Medium/Hearts 1.png') },
  { id: '4', image: require('@/assets/images/Medium/Spades 1.png') },
  { id: '5', image: require('@/assets/images/Medium/Clubs 2.png') },
  { id: '6', image: require('@/assets/images/Medium/Diamond 2.png') },
];

const INITIAL_LIVES = 3;

export function MemoryGame() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [matches, setMatches] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Inicializar y barajar cartas
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newCards: CardData[] = [];
    
    // Crear pares de cartas
    CARD_PAIRS.forEach((pair) => {
      newCards.push(
        {
          id: `${pair.id}-a`,
          pairId: pair.id,
          imageSource: pair.image,
          isFlipped: false,
          isMatched: false,
        },
        {
          id: `${pair.id}-b`,
          pairId: pair.id,
          imageSource: pair.image,
          isFlipped: false,
          isMatched: false,
        }
      );
    });

    // Barajar las cartas
    const shuffled = shuffleArray([...newCards]);
    setCards(shuffled);
    setFlippedCards([]);
    setLives(INITIAL_LIVES);
    setMatches(0);
    setGameOver(false);
    setGameWon(false);
    setDisabled(false);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleCardPress = (cardId: string) => {
    if (disabled || flippedCards.length >= 2) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Actualizar estado de la carta
    setCards((prevCards) =>
      prevCards.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    // Si se han volteado 2 cartas, verificar si hacen pareja
    if (newFlippedCards.length === 2) {
      setDisabled(true);
      setTimeout(() => {
        checkMatch(newFlippedCards);
      }, 1000);
    }
  };

  const checkMatch = (flippedIds: string[]) => {
    const [firstId, secondId] = flippedIds;
    const firstCard = cards.find((c) => c.id === firstId);
    const secondCard = cards.find((c) => c.id === secondId);

    if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
      // ¡Pareja encontrada!
      setCards((prevCards) =>
        prevCards.map((c) =>
          flippedIds.includes(c.id) ? { ...c, isMatched: true, isFlipped: false } : c
        )
      );
      setMatches((prev) => {
        const newMatches = prev + 1;
        if (newMatches === CARD_PAIRS.length) {
          setGameWon(true);
        }
        return newMatches;
      });
    } else {
      // No es pareja, perder una vida
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives === 0) {
          setGameOver(true);
        }
        return newLives;
      });
      
      // Voltear las cartas de nuevo
      setCards((prevCards) =>
        prevCards.map((c) =>
          flippedIds.includes(c.id) ? { ...c, isFlipped: false } : c
        )
      );
    }

    setFlippedCards([]);
    setDisabled(false);
  };

  return (
    <View style={styles.container}>
      {/* Header con vidas y puntuación */}
      <View style={styles.header}>
        <View style={styles.livesContainer}>
          {Array.from({ length: INITIAL_LIVES }).map((_, index) => (
            <Heart key={index} filled={index < lives} size={28} />
          ))}
        </View>
        <Text style={styles.scoreText}>Pares: {matches}/{CARD_PAIRS.length}</Text>
      </View>

      {/* Mesa verde con cartas */}
      <View style={styles.table}>
        <View style={styles.cardsGrid}>
          {cards.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              imageSource={card.imageSource}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onPress={() => handleCardPress(card.id)}
              disabled={disabled || gameOver || gameWon}
            />
          ))}
        </View>
      </View>

      {/* Mensajes de fin de juego */}
      {gameOver && (
        <View style={styles.gameOverlay}>
          <View style={styles.gameMessage}>
            <Text style={styles.gameMessageText}>¡Game Over!</Text>
            <Text style={styles.gameMessageSubtext} onPress={initializeGame}>
              Toca para reiniciar
            </Text>
          </View>
        </View>
      )}

      {gameWon && (
        <View style={styles.gameOverlay}>
          <View style={styles.gameMessage}>
            <Text style={styles.gameMessageText}>¡Ganaste!</Text>
            <Text style={styles.gameMessageSubtext} onPress={initializeGame}>
              Toca para jugar de nuevo
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a5f3f', // Verde fieltro oscuro
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#0d4a2a',
    borderBottomWidth: 4,
    borderBottomColor: '#0a3d20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  livesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  scoreText: {
    fontFamily: 'monospace',
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 2,
    textTransform: 'uppercase',
  },
  table: {
    flex: 1,
    backgroundColor: '#1a5f3f', // Verde fieltro
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // Efecto de textura de fieltro con sombras
    shadowColor: '#0a3d20',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 400,
    paddingVertical: 10,
  },
  gameOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameMessage: {
    backgroundColor: '#1a5f3f',
    padding: 30,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
  },
  gameMessageText: {
    fontFamily: 'monospace',
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 16,
    letterSpacing: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 3,
    textTransform: 'uppercase',
  },
  gameMessageSubtext: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#ffd700',
    letterSpacing: 1,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    textTransform: 'uppercase',
  },
});

