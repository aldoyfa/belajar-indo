# 🚀 IMPLEMENTATION PRIORITY GUIDE
## Quick Fix Checklist untuk Align Mobile dengan Web Version

**Status:** Ready to implement  
**Estimated Time:** 1-2 hari untuk semua fixes  
**Difficulty:** Low to Medium

---

## 🔴 PRIORITY 1: CRITICAL (Must Do)

### Issue #1: Vocabulary Feature Incomplete
**Impact:** HIGH - Core feature missing 80% of content  
**Current State:** 10 words, no categories, no search  
**Target State:** 45+ words, 3 categories, search function  

#### Fix #1.1: Add Complete Vocabulary Data
**File:** `app/(tabs)/vocabulary.tsx`

```typescript
// BEFORE: 10 hardcoded words
const VOCAB_DATA = [
  { indonesian: 'Selamat pagi', english: 'Good morning', category: 'Greetings' },
  // ... 9 more
];

// AFTER: 45+ words with categories (from web version)
const VOCAB_CATEGORIES = {
  makanan: {
    title: '🍽️ Food & Drinks',
    items: [
      { word: 'Nasi', meaning: 'Rice', example: 'I eat rice every day.' },
      { word: 'Air', meaning: 'Water', example: 'Drinking water is healthy.' },
      { word: 'Makan', meaning: 'Eat', example: 'We eat together.' },
      { word: 'Minum', meaning: 'Drink', example: 'I drink hot tea.' },
      { word: 'Roti', meaning: 'Bread', example: 'I have bread for breakfast.' },
      // ... 10 more food words
    ]
  },
  keluarga: {
    title: '👨‍👩‍👧 Family',
    items: [
      { word: 'Ayah', meaning: 'Father', example: 'Father goes to work.' },
      { word: 'Ibu', meaning: 'Mother', example: 'Mother cooks in the kitchen.' },
      // ... 14 more family words
    ]
  },
  sehari: {
    title: '🏠 Daily Activities',
    items: [
      { word: 'Belajar', meaning: 'Study', example: 'I study Indonesian.' },
      { word: 'Tidur', meaning: 'Sleep', example: 'Getting enough sleep is important.' },
      // ... 14 more daily activity words
    ]
  }
};
```

#### Fix #1.2: Add Category Selection Screen
```typescript
// Show categories first, then flashcards for selected category
const [selectedCategory, setSelectedCategory] = useState(null);

return (
  <View>
    {!selectedCategory ? (
      // Show categories
      <FlatList
        data={Object.entries(VOCAB_CATEGORIES)}
        renderItem={({item: [key, category]}) => (
          <TouchableOpacity 
            onPress={() => setSelectedCategory(key)}
            style={styles.categoryCard}
          >
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text>{category.items.length} words</Text>
          </TouchableOpacity>
        )}
      />
    ) : (
      // Show flashcards for selected category
      <Flashcard 
        items={VOCAB_CATEGORIES[selectedCategory].items}
        onBack={() => setSelectedCategory(null)}
      />
    )}
  </View>
);
```

#### Fix #1.3: Add Search Functionality
```typescript
const [searchQuery, setSearchQuery] = useState('');

const filteredVocab = useMemo(() => {
  if (!searchQuery) return allVocabItems;
  
  return allVocabItems.filter(item =>
    item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.example?.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [searchQuery, allVocabItems]);

return (
  <>
    <TextInput
      placeholder="🔍 Search vocabulary..."
      value={searchQuery}
      onChangeText={setSearchQuery}
      style={styles.searchInput}
    />
    <FlatList
      data={filteredVocab}
      renderItem={({item}) => <VocabCard item={item} />}
    />
  </>
);
```

#### Fix #1.4: Add Text-to-Speech Audio Buttons
```typescript
import * as Speech from 'expo-speech';

const speakIndonesian = async (text) => {
  await Speech.speak(text, {
    language: 'id-ID',
    rate: 0.8,
    pitch: 1,
  });
};

const speakEnglish = async (text) => {
  await Speech.speak(text, {
    language: 'en-US',
    rate: 0.8,
    pitch: 1,
  });
};

// In flashcard component:
<View style={styles.audioButtons}>
  <TouchableOpacity 
    onPress={() => speakIndonesian(vocab.word)}
    style={styles.audioBtn}
  >
    <Text>🔊</Text>
  </TouchableOpacity>
  <TouchableOpacity 
    onPress={() => speakEnglish(vocab.meaning)}
    style={styles.audioBtn}
  >
    <Text>🔊</Text>
  </TouchableOpacity>
</View>
```

---

### Issue #2: Quiz History Not Implemented
**Impact:** MEDIUM - Users can't review past performance  
**Current State:** No history feature  
**Target State:** Display previous quiz results  

#### Fix #2.1: Create Quiz History Component
**File:** Create new `app/(tabs)/quiz-history.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { quizService } from '../../services/api';

export default function QuizHistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const result = await quizService.getResults();
      if (result.ok && result.data) {
        setHistory(result.data);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz History</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <View style={styles.itemHeader}>
              <Text style={styles.category}>{item.quizCategory}</Text>
              <Text style={styles.score}>{item.score}%</Text>
            </View>
            <Text style={styles.details}>
              {item.correctAnswers}/{item.totalQuestions} correct • {item.timeSpent}s
            </Text>
            <Text style={styles.date}>
              {new Date(item.completedAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f6fb' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  historyItem: { backgroundColor: 'white', padding: 12, marginBottom: 8, borderRadius: 8 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  category: { fontWeight: '600' },
  score: { fontSize: 16, fontWeight: 'bold', color: '#667eea' },
  details: { marginTop: 8, fontSize: 12, color: '#666' },
  date: { marginTop: 4, fontSize: 11, color: '#999' },
});
```

#### Fix #2.2: Add History Button to Quiz Screen
```typescript
// In app/(tabs)/quiz.tsx, add:
import { router } from 'expo-router';

<TouchableOpacity 
  onPress={() => router.push('/quiz-history')}
  style={styles.historyButton}
>
  <Text>📊 View History</Text>
</TouchableOpacity>
```

---

### Issue #3: Offline Support Missing
**Impact:** MEDIUM - Quiz submissions fail without internet  
**Current State:** No offline queue  
**Target State:** Queue submissions, retry when online  

#### Fix #3.1: Create Offline Queue Service
**File:** Create new `services/offline.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_QUIZ_KEY = 'pendingQuizSubmissions';

export const offlineService = {
  // Save quiz submission for later
  savePendingQuizSubmit: async (quizData: any) => {
    try {
      const pending = JSON.parse(
        await AsyncStorage.getItem(PENDING_QUIZ_KEY) || '[]'
      );
      pending.push({
        ...quizData,
        _pendingId: Date.now(),
        _savedAt: new Date().toISOString(),
      });
      await AsyncStorage.setItem(PENDING_QUIZ_KEY, JSON.stringify(pending));
      console.log('Quiz saved to pending queue');
    } catch (error) {
      console.error('Failed to save pending quiz:', error);
    }
  },

  // Get all pending submissions
  getPendingSubmissions: async () => {
    try {
      const pending = await AsyncStorage.getItem(PENDING_QUIZ_KEY);
      return pending ? JSON.parse(pending) : [];
    } catch (error) {
      console.error('Failed to get pending submissions:', error);
      return [];
    }
  },

  // Retry all pending submissions
  retryPendingSubmissions: async () => {
    const pending = await offlineService.getPendingSubmissions();
    if (pending.length === 0) return;

    console.log(`Retrying ${pending.length} pending submissions...`);
    const succeeded = [];

    for (let i = 0; i < pending.length; i++) {
      try {
        const result = await quizService.submitQuiz(pending[i]);
        if (result.ok) {
          succeeded.push(i);
          console.log(`Successfully submitted pending quiz ${i + 1}`);
        }
      } catch (error) {
        console.warn(`Failed to retry submission ${i + 1}:`, error);
      }
    }

    // Remove succeeded items
    if (succeeded.length > 0) {
      const remaining = pending.filter((_, i) => !succeeded.includes(i));
      if (remaining.length > 0) {
        await AsyncStorage.setItem(PENDING_QUIZ_KEY, JSON.stringify(remaining));
      } else {
        await AsyncStorage.removeItem(PENDING_QUIZ_KEY);
      }
    }
  },
};
```

#### Fix #3.2: Update Quiz Submission Handler
```typescript
// In app/(tabs)/quiz.tsx

import { offlineService } from '../../services/offline';
import NetInfo from '@react-native-community/netinfo';

const submitQuiz = async () => {
  const payload = {
    quizType: 'vocabulary',
    score: Math.round((score / QUIZ_DATA.length) * 100),
    totalQuestions: QUIZ_DATA.length,
    correctAnswers: score,
    timeSpent: Math.round((Date.now() - quizStartTime) / 1000),
  };

  try {
    // Check if online
    const state = await NetInfo.fetch();
    
    if (state.isConnected) {
      // Submit directly
      const result = await quizService.submitQuiz(payload);
      if (result.ok) {
        Alert.alert('Success', 'Quiz submitted!');
        // Also retry any pending submissions
        await offlineService.retryPendingSubmissions();
      } else {
        // If server error, save for later
        await offlineService.savePendingQuizSubmit(payload);
        Alert.alert('Saved', 'Quiz saved to pending. Will retry when online.');
      }
    } else {
      // Offline - queue for later
      await offlineService.savePendingQuizSubmit(payload);
      Alert.alert('Offline', 'Quiz saved locally. Will sync when online.');
    }
  } catch (error) {
    // Save to pending on error
    await offlineService.savePendingQuizSubmit(payload);
    Alert.alert('Error', 'Quiz saved. Will retry automatically.');
  }
};

// Listen for network changes
useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected) {
      console.log('Back online - retrying pending submissions');
      offlineService.retryPendingSubmissions();
    }
  });

  return unsubscribe;
}, []);
```

---

## 🟡 PRIORITY 2: IMPORTANT (Should Do)

### Issue #4: No Text-to-Speech for Audio
**Impact:** MEDIUM - Vocabulary less engaging without audio  
**Current State:** No audio playback  
**Target State:** Play pronunciation for both languages  

**Solution:** Already included in Fix #1.4 above

---

### Issue #5: Limited Quiz Questions
**Impact:** LOW - Only 5 questions available  
**Current State:** 5 hardcoded questions  
**Target State:** 15+ questions with difficulty levels  

#### Fix #5.1: Expand Quiz Questions
```typescript
// In app/(tabs)/quiz.tsx

const EXTENDED_QUIZ_DATA = [
  // Easy (5 questions)
  {
    difficulty: 'easy',
    question: 'What does "Rumah" mean in English?',
    options: ['House', 'School', 'Car', 'Book'],
    correct: 0,
  },
  // ... 4 more easy questions
  
  // Medium (5 questions)
  {
    difficulty: 'medium',
    question: 'Which word means "to eat"?',
    options: ['Minum', 'Makan', 'Tidur', 'Belajar'],
    correct: 1,
  },
  // ... 4 more medium questions
  
  // Hard (5 questions)
  {
    difficulty: 'hard',
    question: 'Choose the correct past tense form...',
    options: ['...', '...', '...', '...'],
    correct: 0,
  },
  // ... 4 more hard questions
];

const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
const filteredQuestions = EXTENDED_QUIZ_DATA.filter(
  q => q.difficulty === selectedDifficulty
);
```

---

## ✅ VERIFICATION CHECKLIST

After implementing all fixes, verify:

- [ ] **Vocabulary:**
  - [ ] All 3 categories display correctly
  - [ ] Search finds words, meanings, and examples
  - [ ] Audio buttons play for both Indonesian and English
  - [ ] 45+ words in system
  - [ ] Category badges show correctly

- [ ] **Quiz:**
  - [ ] Can view quiz history
  - [ ] Offline submissions saved locally
  - [ ] Auto-retry when connection restored
  - [ ] 15+ questions available
  - [ ] Difficulty selection works

- [ ] **Overall:**
  - [ ] No crashes on quiz/vocab screens
  - [ ] Styling consistent with web version
  - [ ] Performance acceptable
  - [ ] All data persists properly

---

## 📊 PROGRESS TRACKER

### Phase 1: Vocabulary (2-3 hours)
- [ ] Add complete vocab data
- [ ] Implement category selection
- [ ] Add search functionality
- [ ] Add text-to-speech buttons
- [ ] Test all features

### Phase 2: Quiz History & Offline (2-3 hours)
- [ ] Create history screen
- [ ] Implement offline queue
- [ ] Add network listener
- [ ] Test retry mechanism
- [ ] Test history display

### Phase 3: Expand Questions (1 hour)
- [ ] Add more quiz questions
- [ ] Implement difficulty selection
- [ ] Test difficulty filtering
- [ ] Balance question distribution

### Phase 4: Testing & Polish (2 hours)
- [ ] Manual testing all features
- [ ] Fix styling issues
- [ ] Performance optimization
- [ ] Final verification

**Total Estimated Time: 7-9 hours (1 day of focused work)**

---

## 🎯 FINAL ALIGNMENT TARGET

After all fixes:

```
Vocabulary Feature:    100% ✅ (currently 30%)
Quiz Feature:          95% ✅ (currently 80%)
Offline Support:       100% ✅ (currently 0%)
Overall Alignment:     97% ✅ (currently 82%)
```

---

*Ready to implement? Start with Priority 1, one issue at a time!*
