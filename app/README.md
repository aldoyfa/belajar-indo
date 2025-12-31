# BelajarIndo Mobile App (Expo Router)

Aplikasi mobile React Native untuk belajar bahasa Indonesia menggunakan **Expo Router** dengan file-based routing.

## 📱 Fitur

- **Authentication**: Login dan Register dengan validasi
- **Vocabulary**: Flashcard interaktif dengan 3D flip animation
- **Quiz**: Kuis interaktif dengan tracking skor dan real-time feedback
- **Profile**: Statistik pembelajaran dengan line chart dan riwayat quiz
- **Progress Tracking**: Auto-save progress setiap 20 detik
- **Bottom Tabs**: Native tab navigation dengan Expo Router

## 🚀 Tech Stack

- **Expo Router** - File-based routing (modern!)
- **React Native** - Framework mobile
- **TypeScript** - Type-safe development
- **Expo** - Development platform
- **AsyncStorage** - Local storage
- **React Native Chart Kit** - Grafik dan visualisasi
- **Expo Linear Gradient** - Gradient backgrounds

## 🏗️ Struktur Aplikasi (Expo Router)

```
app/
├── _layout.tsx              # Root layout (Stack Navigator)
├── index.tsx                # Splash screen / Auth check
├── login.tsx                # Login & Register
│
├── (tabs)/                  # Bottom tabs group
│   ├── _layout.tsx          # Tabs configuration
│   ├── index.tsx            # Home tab
│   ├── vocabulary.tsx       # Vocabulary tab
│   ├── quiz.tsx             # Quiz tab
│   └── profile.tsx          # Profile tab
│
├── components/              # Reusable components
│   ├── CustomModal.js
│   ├── GradientButton.js
│   ├── Card.js
│   └── LoadingSpinner.js
│
└── services/                # API services
    └── api.js
```

## 📦 Instalasi

### Prerequisites
- Node.js (v14 atau lebih baru)
- npm atau yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app di smartphone (untuk testing)

### Setup

1. Install dependencies:
```bash
cd app
npm install
```

2. Jalankan aplikasi:
```bash
npm start
```

3. Scan QR code dengan Expo Go app (Android) atau Camera app (iOS)

## 🔧 Konfigurasi Backend

Edit `app/services/api.js` untuk mengubah URL backend:

```javascript
const API_URL = 'https://your-backend-url.com';
```

## 🎯 Keunggulan Expo Router

### ✅ File-Based Routing
Routes otomatis dibuat dari struktur folder - tidak perlu config manual!

### ✅ Bottom Tabs Native
Folder `(tabs)/` secara otomatis membuat bottom tab navigation yang mobile-friendly.

### ✅ TypeScript Support
Type-safe navigation dengan autocomplete untuk routes.

### ✅ Deep Linking Built-in
URL-based navigation sudah terintegrasi untuk sharing dan notifications.

### ✅ Mobile-Optimized
- Native transitions
- Gesture navigation
- Hardware back button support
- Tab bar di bottom

## 📱 Testing di Device

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Web (Development)
```bash
npm run web
```

## 🔗 Integrasi Backend

Aplikasi terhubung dengan backend di `belajarindo-backend/` untuk:
- Authentication (register, login, logout)
- Quiz submission dan results
- Progress tracking (quiz & vocabulary)
- User profile data

### API Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/quiz/submit
GET  /api/quiz/results
POST /api/quiz/progress
GET  /api/quiz/progress
POST /api/vocab/progress
GET  /api/vocab/progress
```

## 🎨 Tampilan

Aplikasi menggunakan:
- Gradient backgrounds (#667eea, #764ba2)
- Card-based UI dengan shadow
- Smooth animations dan transitions
- Mobile-friendly touch interactions
- Bottom tab navigation (native feel)

## 📚 Dokumentasi

- **QUICK_START.md** - Panduan mulai cepat 5 menit
- **EXPO_ROUTER_GUIDE.md** - Penjelasan lengkap Expo Router
- **IMPLEMENTATION_SUMMARY.md** - Summary implementasi

## 🐛 Troubleshooting

### Error: Cannot connect to backend
- Pastikan backend sudah running
- Cek URL di `services/api.js`
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

## 📝 Catatan

### Perbedaan dengan React Navigation
1. **Routing**: File-based routing vs manual configuration
2. **Navigation**: Auto-generated dari struktur folder
3. **Bottom Tabs**: `(tabs)/` folder vs manual TabNavigator
4. **TypeScript**: Auto-generated types vs manual
5. **Modern**: ✅ Expo Router lebih modern dan maintainable

### Keunggulan untuk Mobile
- Bottom tabs native positioning
- Gesture-based navigation
- Hardware back button support
- Deep linking ready
- Type-safe navigation

## 🚀 Production Build

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

### EAS Build (Recommended)
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## 🤝 Kontribusi

Aplikasi ini menggunakan Expo Router untuk file-based routing yang lebih modern dan mobile-friendly, memberikan pengalaman native yang optimal.

## 📄 License

Private project for educational purposes.

---

**Built with Expo Router** 🚀
