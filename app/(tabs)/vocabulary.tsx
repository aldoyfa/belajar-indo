import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    Animated,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { vocabService } from '../../services/api';
import { VOCAB_CATEGORIES, getAllVocabItems, searchVocab } from './vocabulary-data';

type CategoryKey = keyof typeof VOCAB_CATEGORIES;

export default function VocabularyScreen() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
        setLearnedCount(progress.currentQuestion || 0);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async () => {
    try {
      const allItems = getAllVocabItems();
      const progress = Math.round(((learnedCount + 1) / allItems.length) * 100);
      await vocabService.saveProgress({
        quizCategory: 'vocab',
        progress,
        currentQuestion: learnedCount + 1,
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
    const currentItems = selectedCategory 
      ? VOCAB_CATEGORIES[selectedCategory].items 
      : getAllVocabItems();
    
    if (currentIndex < currentItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
    }
  };

  const handleMarkLearned = async () => {
    setLearnedCount(learnedCount + 1);
    await saveProgress();
    handleNext();
  };

  const handleCategorySelect = (category: CategoryKey) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setIsFlipped(false);
    flipAnimation.setValue(0);
    setSearchMode(false);
    setSearchQuery('');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setCurrentIndex(0);
    setIsFlipped(false);
    flipAnimation.setValue(0);
    setSearchMode(false);
    setSearchQuery('');
  };

  const handleSearch = () => {
    setSearchMode(!searchMode);
    if (!searchMode) {
      setSearchQuery('');
    }
  };

  // Render Category Selection
  if (!selectedCategory && !searchMode) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
          <Text style={styles.headerTitle}>Vocabulary Categories</Text>
          <Text style={styles.headerSubtitle}>45 words across 3 categories</Text>
          <Text style={styles.learnedText}>Learned: {learnedCount} cards</Text>
        </LinearGradient>

        <ScrollView style={styles.categoriesContainer}>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearch}
          >
            <Ionicons name="search" size={20} color="#667eea" />
            <Text style={styles.searchButtonText}>Search Vocabulary</Text>
          </TouchableOpacity>

          {Object.entries(VOCAB_CATEGORIES).map(([key, category]) => (
            <TouchableOpacity
              key={key}
              activeOpacity={0.8}
              onPress={() => handleCategorySelect(key as CategoryKey)}
            >
              <LinearGradient
                colors={category.color}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.categoryCard}
              >
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryCount}>{category.items.length} words</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Render Search Mode
  if (searchMode) {
    const searchResults = searchQuery.length > 0 ? searchVocab(searchQuery) : getAllVocabItems();

    return (
      <View style={styles.container}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
          <View style={styles.headerWithBack}>
            <TouchableOpacity onPress={handleBackToCategories}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Search Vocabulary</Text>
          </View>
        </LinearGradient>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by word, meaning, or example..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>

        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => `${item.word}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.searchResultCard}>
              <View style={styles.searchResultContent}>
                <Text style={styles.searchResultWord}>{item.word}</Text>
                <Text style={styles.searchResultMeaning}>{item.meaning}</Text>
                <Text style={styles.searchResultExample}>{item.example}</Text>
              </View>
              <View style={[styles.categoryBadgeSmall, { backgroundColor: '#667eea' }]}>
                <Text style={styles.categoryBadgeText}>{item.category}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color="#ccc" />
              <Text style={styles.emptyStateText}>No results found</Text>
            </View>
          }
        />
      </View>
    );
  }

  // Render Flashcard Mode
  const currentItems = selectedCategory ? VOCAB_CATEGORIES[selectedCategory].items : [];
  const currentCard = currentItems[currentIndex];
  const progress = ((currentIndex + 1) / currentItems.length) * 100;
  const categoryColors = selectedCategory ? VOCAB_CATEGORIES[selectedCategory].color : ['#667eea', '#764ba2'];

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
      <LinearGradient colors={categoryColors} style={styles.header}>
        <View style={styles.headerWithBack}>
          <TouchableOpacity onPress={handleBackToCategories}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              {selectedCategory && VOCAB_CATEGORIES[selectedCategory].title}
            </Text>
            <Text style={styles.headerSubtitle}>
              Card {currentIndex + 1} of {currentItems.length}
            </Text>
          </View>
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </LinearGradient>

      {/* Flashcard */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleFlip}
          style={styles.flashcardTouchable}
        >
          {/* Front Side */}
          <Animated.View
            style={[
              styles.flashcard,
              { transform: [{ rotateY: frontInterpolate }] },
              isFlipped && styles.flashcardHidden,
            ]}
          >
            <LinearGradient
              colors={categoryColors}
              style={styles.flashcardGradient}
            >
              <Text style={styles.categoryLabel}>{currentCard.category}</Text>
              <Text style={styles.flashcardText}>{currentCard.word}</Text>
              <Text style={styles.tapHint}>Tap to flip</Text>
            </LinearGradient>
          </Animated.View>

          {/* Back Side */}
          <Animated.View
            style={[
              styles.flashcard,
              styles.flashcardBack,
              { transform: [{ rotateY: backInterpolate }] },
              !isFlipped && styles.flashcardHidden,
            ]}
          >
            <View style={styles.flashcardBackContent}>
              <Text style={styles.flashcardBackLabel}>Translation</Text>
              <Text style={styles.flashcardBackText}>{currentCard.meaning}</Text>
              <View style={styles.exampleContainer}>
                <Text style={styles.exampleLabel}>Example:</Text>
                <Text style={styles.exampleText}>{currentCard.example}</Text>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Navigation Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Ionicons name="chevron-back" size={24} color={currentIndex === 0 ? '#ccc' : '#667eea'} />
          <Text style={[styles.navButtonText, currentIndex === 0 && styles.navButtonTextDisabled]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.learnedButton}
          onPress={handleMarkLearned}
        >
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.learnedButtonGradient}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.learnedButtonText}>Mark Learned</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === currentItems.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={currentIndex === currentItems.length - 1}
        >
          <Text
            style={[
              styles.navButtonText,
              currentIndex === currentItems.length - 1 && styles.navButtonTextDisabled,
            ]}
          >
            Next
          </Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentIndex === currentItems.length - 1 ? '#ccc' : '#667eea'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <Text style={styles.statsText}>Total Learned: {learnedCount} / {getAllVocabItems().length}</Text>
      </View>
    </View>
  );
}

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
  headerWithBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  learnedText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  
  // Categories
  categoriesContainer: {
    flex: 1,
    padding: 20,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  searchResultCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchResultContent: {
    marginBottom: 8,
  },
  searchResultWord: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  searchResultMeaning: {
    fontSize: 16,
    color: '#667eea',
    marginBottom: 8,
  },
  searchResultExample: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  categoryBadgeSmall: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },

  // Flashcard
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  flashcardTouchable: {
    width: '100%',
    height: 400,
  },
  flashcard: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backfaceVisibility: 'hidden',
    position: 'absolute',
  },
  flashcardHidden: {
    opacity: 0,
  },
  flashcardGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  categoryLabel: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  flashcardText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  tapHint: {
    position: 'absolute',
    bottom: 20,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  flashcardBack: {
    backgroundColor: '#fff',
  },
  flashcardBackContent: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  flashcardBackLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  flashcardBackText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 24,
  },
  exampleContainer: {
    backgroundColor: '#f4f6fb',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  exampleLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    fontWeight: '600',
  },
  exampleText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    fontStyle: 'italic',
  },

  // Controls
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
  learnedButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  learnedButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  learnedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  stats: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
});
