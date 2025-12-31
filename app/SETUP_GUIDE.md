# BelajarIndo - Panduan Setup React Native App

## 📋 Ringkasan

Saya telah berhasil membuat komponen React Native yang lengkap di folder `app/` berdasarkan kode web dari `belajarindo-frontend/`. Semua fitur dan tampilan telah dikonversi menjadi mobile-friendly.

## ✅ Komponen yang Sudah Dibuat

### 1. **Struktur Folder**
```
app/
├── screens/              # Layar utama aplikasi
├── components/           # Komponen reusable
├── services/             # API services
├── navigation/           # Setup navigasi
├── App.js               # Entry point
├── package.json         # Dependencies
└── app.json             # Expo config
```

### 2. **Screens (Layar)**

#### LoginScreen.js
- **Fungsi**: Login dan Register dengan tab switching
- **Fitur**:
  - Form login dengan validasi
  - Form register dengan validasi
  - Password minimal 6 karakter
  - Custom modal untuk feedback
  - Auto-redirect setelah login berhasil
  - Image slider placeholder
- **Konversi dari**: `login.html` + `login.js`

#### HomeScreen.js
- **Fungsi**: Dashboard utama aplikasi
- **Fitur**:
  - Header dengan gradient dan avatar
  - Greeting personalized
  - Feature cards dengan gradient
  - Navigation ke Vocabulary, Quiz, Profile
  - About section
  - Logout button
- **Konversi dari**: `index.html`

#### ProfileScreen.js
- **Fungsi**: Menampilkan profil dan statistik user
- **Fitur**:
  - Profile header dengan photo dan info
  - Summary statistics (Total quiz, Avg score, Correct answers)
  - Line chart untuk performance trend
  - Quiz history list
  - Performance insights
  - Pull-to-refresh
  - Logout button
- **Konversi dari**: `profile.html`

#### VocabularyScreen.js
- **Fungsi**: Flashcard interaktif untuk belajar kosakata
- **Fitur**:
  - Flip animation untuk flashcard
  - Progress bar
  - Previous/Next navigation
  - Mark as learned counter
  - Auto-save progress
  - Navigate to quiz
- **Fitur Baru**: Interactive flashcard dengan animasi 3D flip

#### QuizScreen.js
- **Fungsi**: Kuis interaktif dengan tracking
- **Fitur**:
  - Multiple choice questions
  - Real-time feedback (correct/wrong)
  - Progress bar
  - Score tracking
  - Time tracking
  - Submit ke backend
  - Auto-save progress
  - Navigate to profile after submit
- **Konversi dari**: `quiz.js`

### 3. **Components (Komponen Reusable)**

#### CustomModal.js
- Modal dengan icon dan animasi
- Support 3 types: success, error, warning
- Custom styling

#### GradientButton.js
- Button dengan linear gradient
- Loading state
- Disabled state
- Customizable colors

#### Card.js
- Card component dengan shadow
- Support gradient background
- Reusable styling

#### LoadingSpinner.js
- Full-screen loading indicator
- Customizable size dan color

### 4. **Services (API Layer)**

#### api.js
- **Fungsi**: Komunikasi dengan backend
- **Services**:
  - `authService`: register, login, logout, getCurrentUser
  - `quizService`: submitQuiz, getResults, getStats, saveProgress, getProgress
  - `vocabService`: saveProgress, getProgress
  - `healthCheck`: Check backend status
- **Features**:
  - Auto-attach JWT token dari AsyncStorage
  - Error handling
  - Response parsing

### 5. **Navigation**

#### AppNavigator.js
- **Stack Navigator**: Login → MainTabs
- **Bottom Tab Navigator**: Home, Vocabulary, Quiz, Profile
- Custom icons dengan Ionicons
- No header untuk semua screens

## 🎨 Design & Styling

### Color Scheme
- Primary gradient: `#667eea` → `#764ba2`
- Secondary gradient: `#f093fb` → `#f5576c`
- Tertiary gradient: `#4facfe` → `#00f2fe`
- Background: `#f4f6fb`
- Text primary: `#1f2937`
- Text secondary: `#6c7a89`

### UI Elements
- Rounded corners (12-25px)
- Card shadows dan elevation
- Smooth animations
- Touch feedback
- Mobile-optimized spacing

## 🔗 Integrasi Backend

### API Endpoints yang Digunakan
```
POST /api/auth/register    - Register user baru
POST /api/auth/login       - Login user
POST /api/auth/logout      - Logout user
GET  /api/auth/me          - Get current user
POST /api/quiz/submit      - Submit quiz result
GET  /api/quiz/results     - Get quiz history
GET  /api/quiz/stats       - Get quiz statistics
POST /api/quiz/progress    - Save quiz progress
GET  /api/quiz/progress    - Get quiz progress
POST /api/vocab/progress   - Save vocab progress
GET  /api/vocab/progress   - Get vocab progress
GET  /api/health           - Health check
```

### Data Storage
- AsyncStorage untuk token dan user data
- Progress auto-save setiap 20 detik (quiz)
- Manual save saat navigasi

## 📱 Setup dan Instalasi

### Prerequisites
```bash
# Install Node.js dan npm
# Install Expo CLI
npm install -g expo-cli
```

### Install Dependencies
```bash
cd app
npm install
```

### Konfigurasi Backend URL
Edit `app/services/api.js`:
```javascript
const API_URL = 'https://belajar-indo.vercel.app'; // Ganti dengan URL Anda
```

### Run Aplikasi
```bash
# Development
npm start

# Android
npm run android

# iOS
npm run ios
```

## 📦 Dependencies

### Core
- `expo`: Platform development
- `react-native`: Framework
- `react`: UI library

### Navigation
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `@react-navigation/bottom-tabs`
- `react-native-screens`
- `react-native-safe-area-context`

### UI & Graphics
- `expo-linear-gradient`: Gradient backgrounds
- `react-native-chart-kit`: Charts
- `react-native-svg`: SVG support
- `@expo/vector-icons`: Icons

### Storage
- `@react-native-async-storage/async-storage`: Local storage

## 🚀 Cara Menggunakan

### 1. Testing di Device
- Install Expo Go dari Play Store/App Store
- Jalankan `npm start` di terminal
- Scan QR code dengan Expo Go (Android) atau Camera (iOS)

### 2. Build Production

#### Android APK
```bash
expo build:android
```

#### iOS IPA
```bash
expo build:ios
```

### 3. Testing dengan Backend Lokal
Jika backend running di localhost:
```javascript
// Ganti di api.js
const API_URL = 'http://YOUR_LOCAL_IP:3000';
// Jangan gunakan localhost, gunakan IP address komputer
```

## 🔧 Troubleshooting

### Error: Cannot connect to backend
- Pastikan backend sudah running
- Cek URL di `api.js`
- Jika backend lokal, gunakan IP address bukan localhost

### Error: Module not found
```bash
cd app
rm -rf node_modules
npm install
```

### Error: Expo not found
```bash
npm install -g expo-cli
```

### Image tidak muncul
- Pastikan path image sesuai dengan struktur folder
- Gunakan `require()` untuk local images
- Gunakan URL untuk remote images

## 📝 Catatan Penting

### Perbedaan dengan Web Version
1. **Navigation**: Web menggunakan HTML links, Mobile menggunakan React Navigation
2. **Storage**: Web menggunakan localStorage, Mobile menggunakan AsyncStorage
3. **Styling**: Mobile menggunakan StyleSheet, bukan CSS
4. **Images**: Mobile require local images, tidak support lazy loading HTML
5. **Forms**: Mobile tidak support HTML form submission, semua handled dengan state

### Fitur yang Ditambahkan
1. **Bottom Tab Navigation**: Easy access ke semua fitur
2. **Pull to Refresh**: Di ProfileScreen
3. **Flashcard Animation**: 3D flip effect di VocabularyScreen
4. **Touch Interactions**: Haptic feedback dan touch animations
5. **Loading States**: Spinner saat data loading

### Rekomendasi Pengembangan Lanjutan
1. Add splash screen animation
2. Add onboarding screens untuk user baru
3. Add dark mode support
4. Add offline mode dengan local caching
5. Add push notifications
6. Add social sharing untuk quiz results
7. Add audio pronunciation untuk vocabulary
8. Add leaderboard untuk kompetisi

## 🎯 Next Steps

1. **Install dependencies**:
   ```bash
   cd app
   npm install
   ```

2. **Update backend URL** di `app/services/api.js`

3. **Test aplikasi**:
   ```bash
   npm start
   ```

4. **Scan QR code** dengan Expo Go

5. **Test semua fitur**:
   - Register user baru
   - Login
   - Buka vocabulary flashcards
   - Take quiz
   - Lihat profile dan statistics
   - Logout

## ✨ Kesimpulan

Semua komponen telah berhasil dibuat dengan:
- ✅ Fungsi yang sama dengan web version
- ✅ Mobile-friendly UI/UX
- ✅ Integrasi dengan backend yang sudah ada
- ✅ Ready to run dengan Expo
- ✅ Production-ready code structure

Aplikasi siap untuk development dan testing! 🚀
