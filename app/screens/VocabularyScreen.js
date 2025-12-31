import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { vocabService } from '../services/api';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';

// Sample vocabulary data (flashcards)
const VOCAB_DATA = [
  { indonesian: 'Selamat pagi', english: 'Good morning', category: 'Greetings' },
  { indonesian: 'Terima kasih', english: 'Thank you', category: 'Courtesy' },
  { indonesian: 'Apa kabar?', english: 'How are you?', category: 'Greetings' },
  { indonesian: 'Saya cinta kamu', english: 'I love you', category: 'Expressions' },
  { indonesian: 'Sampai jumpa', english: 'Goodbye', category: 'Greetings' },
  { indonesian: 'Tolong', english: 'Please', category: 'Courtesy' },
  { indonesian: 'Maaf', english: 'Sorry', category: 'Courtesy' },
  { indonesian: 'Permisi', english: 'Excuse me', category: 'Courtesy' },
  { indonesian: 'Baik', english: 'Good', category: 'Basic' },
  { indonesian: 'Buruk', english: 'Bad', category: 'Basic' },
];

const VocabularyScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));
  const [learnedCount, setLearnedCount] = useState(0);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const progressResponse = await vocabService.getProgress();
      if (progressResponse.ok && progressResponse.data.progress) {
        const progress = progressResponse.data.progress;
        if (progress.currentQuestion) {
          setCurrentIndex(Math.min(progress.currentQuestion, VOCAB_DATA.length - 1));
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async () => {
    try {
      const progress = Math.round(((currentIndex + 1) / VOCAB_DATA.length) * 100);
      await vocabService.saveProgress({
        quizCategory: 'vocab',
        progress,
        currentQuestion: currentIndex + 1,
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleFlip = () => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const handleNext = async () => {
    if (currentIndex < VOCAB_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
      await saveProgress();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
    }
  };

  const handleMarkLearned = () => {
    setLearnedCount(learnedCount + 1);
    handleNext();
  };

  const currentCard = VOCAB_DATA[currentIndex];
  const progress = ((currentIndex + 1) / VOCAB_DATA.length) * 100;

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <Text style={styles.headerTitle}>Vocabulary</Text>
        <Text style={styles.headerSubtitle}>
          Card {currentIndex + 1} of {VOCAB_DATA.length}
        </Text>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <Text style={styles.learnedText}>
          Learned: {learnedCount} cards
        </Text>
      </LinearGradient>

      {/* Flashcard */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleFlip}
          style={styles.flashcardTouchable}
        >
          <Animated.View
            style={[
              styles.flashcard,
              { transform: [{ rotateY: frontInterpolate }] },
              isFlipped && styles.flashcardHidden,
            ]}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.flashcardGradient}
            >
              <Text style={styles.categoryBadge}>{currentCard.category}</Text>
              <Text style={styles.flashcardText}>{currentCard.indonesian}</Text>
              <Text style={styles.tapHint}>Tap to flip</Text>
            </LinearGradient>
          </Animated.View>

          <Animated.View
            style={[
              styles.flashcard,
              styles.flashcardBack,
              { transform: [{ rotateY: backInterpolate }] },
              !isFlipped && styles.flashcardHidden,
            ]}
          >
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.flashcardGradient}
            >
              <Text style={styles.categoryBadge}>{currentCard.category}</Text>
              <Text style={styles.flashcardText}>{currentCard.english}</Text>
              <Text style={styles.tapHint}>Tap to flip back</Text>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navButtonText}>← Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.learnedButton}
          onPress={handleMarkLearned}
        >
          <Text style={styles.learnedButtonText}>✓ Learned</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === VOCAB_DATA.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={currentIndex === VOCAB_DATA.length - 1}
        >
          <Text style={styles.navButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <GradientButton
          title="Take Quiz"
          onPress={() => navigation.navigate('Quiz')}
          colors={['#f093fb', '#f5576c']}
          style={styles.button}
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 15,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  learnedText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  flashcardTouchable: {
    width: '100%',
    height: 300,
  },
  flashcard: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  flashcardBack: {
    position: 'absolute',
  },
  flashcardHidden: {
    opacity: 0,
  },
  flashcardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  categoryBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  flashcardText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  tapHint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  navButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  learnedButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#10b981',
    borderRadius: 25,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  learnedButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  button: {
    marginBottom: 15,
  },
  backButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 25,
  },
  backButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VocabularyScreen;
