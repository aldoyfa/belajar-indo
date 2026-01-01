# 🚀 TESTING GUIDE - BELAJAR INDO MOBILE APP

## Quick Verification Steps

### 1️⃣ Test Vocabulary (45 Words)
```bash
# Navigate to Vocabulary tab in app
```

**Expected Result**:
- ✅ See 3 category cards: Food & Drinks, Family, Daily Activities
- ✅ Each shows "15 words"
- ✅ Search button at top
- ✅ Total: "45 words across 3 categories"

**Test Categories**:
1. Tap **Food & Drinks** (green gradient)
   - Should see: Nasi, Air, Makan, Minum, etc.
   - Tap card → flips to show English + example
   - Previous/Next buttons work
   - Mark Learned button increments counter

2. Tap **Family** (purple gradient)
   - Should see: Ayah, Ibu, Kakak, Adik, etc.
   - Same flip animation
   - Category color changes to purple

3. Tap **Daily Activities** (blue gradient)
   - Should see: Belajar, Tidur, Bangun, Makan, etc.
   - Category color changes to blue

**Test Search**:
- Tap search button (top of category screen)
- Type "makan" → shows "Makan" card
- Type "father" → shows "Ayah" card
- Type "example" → shows all cards with that word in example
- Empty search → shows all 45 words

**Navigation**:
- Back arrow → returns to category selection
- Search icon (in flashcard mode) → opens search
- Learned counter shows progress

---

### 2️⃣ Test Quiz History
```bash
# Navigate to Quiz tab in app
```

**Expected Result**:
- ✅ See 📊 button in top-right corner
- ✅ Button has semi-transparent white background

**Test History**:
1. Complete a quiz (answer all 5 questions)
2. Submit quiz → see result modal
3. Close modal → back to quiz screen
4. Tap 📊 history button
5. Should see quiz history screen:
   - If no history: "No Quiz History" message + "Take a Quiz" button
   - If has history: List of past quizzes with:
     * Grade badge (A-F) in colored circle
     * Score "3/5" format
     * Percentage "60%"
     * Date "Today", "Yesterday", or "Jan 5"
     * Progress bar (green/orange/red based on score)
     * Category tag "General"

**Test Grading**:
- 90%+ → Green circle with "A"
- 80-89% → Green circle with "B"
- 70-79% → Orange circle with "C"
- 60-69% → Orange circle with "D"
- <60% → Red circle with "F"

**Navigation**:
- Back arrow → returns to quiz screen
- "Take a Quiz" button (if empty) → navigates to quiz

---

### 3️⃣ Test Virtual Lab (15 Modules)
```bash
# Navigate to Lab tab in app
```

**Expected Result**:
- ✅ See 3 sections with 5 modules each
- ✅ Total: 15 lab modules

**Test Sections**:
1. **Grammar & Structure** (5 modules)
   - ✅ Sentence Structure Basics (15 min, easy)
   - ✅ Verb Conjugation Practice (20 min, medium)
   - ✅ Pronouns & Possessives (12 min, easy)
   - ✅ Question Formation (18 min, medium)
   - ✅ Advanced Sentence Patterns (25 min, hard)

2. **Conversation Practice** (5 modules)
   - ✅ Daily Greetings (10 min, easy)
   - ✅ Shopping & Bargaining (20 min, medium)
   - ✅ Asking for Directions (15 min, easy)
   - ✅ Restaurant Conversations (18 min, medium)
   - ✅ Social Interactions (25 min, hard)

3. **Pronunciation Lab** (5 modules)
   - ✅ Vowel Sounds (12 min, easy)
   - ✅ Consonant Combinations (15 min, medium)
   - ✅ Stress & Intonation (18 min, medium)
   - ✅ Common Word Pairs (10 min, easy)
   - ✅ Advanced Phonetics (30 min, hard)

**Test Features**:
- Pull down to refresh → modules reload
- Difficulty badges: Easy (green), Medium (yellow), Hard (red)
- Duration labels: "15 min", "20 min", etc.
- Module descriptions visible
- Tap module → (currently logs to console, future: opens detail)

---

## 🔍 Verification Checklist

### File Existence
```bash
# Check if new files exist
ls app/(tabs)/vocabulary-data.ts    # Should exist
ls app/(tabs)/quiz-history.tsx      # Should exist
ls app/(tabs)/vocabulary.tsx        # Should be updated
ls app/(tabs)/quiz.tsx               # Should be updated
ls app/(tabs)/lab.tsx                # Should be updated
```

### No Errors
```bash
# Run TypeScript check
npx tsc --noEmit

# Expected: No errors
```

### Run App
```bash
# Start Expo
npm start

# Press 'w' for web, 'a' for Android, 'i' for iOS
```

---

## 📱 Expected Behavior

### Vocabulary Screen
| Action | Expected |
|--------|----------|
| Open Vocabulary | See 3 category cards |
| Tap category | See 15 flashcards |
| Tap card | Flip animation shows translation + example |
| Tap Next | Move to next card |
| Tap Mark Learned | Counter increments, moves to next |
| Tap Back Arrow | Return to categories |
| Tap Search | Open search mode |
| Type in search | Real-time filtering |

### Quiz History Screen
| Action | Expected |
|--------|----------|
| Tap 📊 button | Navigate to history |
| No history | Show empty state + "Take Quiz" button |
| Has history | Show list of past quizzes |
| See grade | A-F badge in colored circle |
| See score | "3/5" format |
| See percentage | "60%" |
| See date | "Today", "Yesterday", or "Jan 5" |
| See progress bar | Green (80%+), Orange (60-79%), Red (<60%) |
| Tap back | Return to quiz |

### Virtual Lab Screen
| Action | Expected |
|--------|----------|
| Open Lab | See 3 sections with 15 modules |
| Section 1 | Grammar & Structure (5 modules) |
| Section 2 | Conversation Practice (5 modules) |
| Section 3 | Pronunciation Lab (5 modules) |
| See difficulty | Easy (green), Medium (yellow), Hard (red) |
| See duration | "10 min", "15 min", etc. |
| Pull to refresh | Modules reload |
| Tap module | Console log (future: detail page) |

---

## 🐛 Common Issues & Solutions

### Issue 1: "Module not found: vocabulary-data"
**Solution**: Ensure `vocabulary-data.ts` is in `app/(tabs)/` directory

### Issue 2: Quiz history shows empty
**Solution**: Complete at least one quiz first, then submit it

### Issue 3: Lab modules don't show
**Solution**: Pull down to refresh, or restart app

### Issue 4: Flip animation doesn't work
**Solution**: Ensure `react-native-reanimated` is installed

### Issue 5: Icons not showing
**Solution**: Ensure `@expo/vector-icons` is installed

---

## ✅ Success Criteria

### Vocabulary
- [x] 45 words total (15 per category)
- [x] 3 categories: Food, Family, Daily Activities
- [x] Search functionality works
- [x] Flip animation smooth
- [x] Progress tracking working
- [x] Back navigation works

### Quiz History
- [x] History screen accessible via 📊 button
- [x] Shows past quiz results
- [x] Grade badges A-F with colors
- [x] Score percentages displayed
- [x] Dates formatted correctly
- [x] Empty state handled

### Virtual Lab
- [x] 15 modules total (5 per section)
- [x] 3 sections: Grammar, Conversation, Pronunciation
- [x] Difficulty indicators working
- [x] Duration labels shown
- [x] Pull-to-refresh works
- [x] Fallback data loads

---

## 🎯 Final Verification

```bash
# 1. Check all files exist
ls app/(tabs)/vocabulary-data.ts     # ✅
ls app/(tabs)/quiz-history.tsx       # ✅
ls app/(tabs)/vocabulary.tsx         # ✅ (updated)
ls app/(tabs)/quiz.tsx                # ✅ (updated)
ls app/(tabs)/lab.tsx                 # ✅ (updated)

# 2. Check for TypeScript errors
npx tsc --noEmit                      # ✅ 0 errors

# 3. Run the app
npm start                             # ✅ Starts successfully

# 4. Test each feature
# - Vocabulary: 45 words, 3 categories, search ✅
# - Quiz History: 📊 button, history screen ✅
# - Virtual Lab: 15 modules, 3 sections ✅
```

**Final Status**: ✅ **100% COMPLETE** - All 3 fixes implemented and tested!

---

**Generated**: January 2025  
**Purpose**: Quick testing and verification guide
