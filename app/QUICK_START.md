# 🚀 Quick Start Guide - BelajarIndo Mobile (Expo Router)

## Mulai Cepat dalam 5 Menit!

### 1️⃣ Install Dependencies

```bash
cd app
npm install
```

Atau jika menggunakan yarn:
```bash
cd app
yarn install
```

### 2️⃣ Konfigurasi Backend

Buka file `app/services/api.js` dan pastikan URL backend sudah benar:

```javascript
const API_URL = 'https://belajar-indo.vercel.app';
```

Jika backend lokal:
```javascript
const API_URL = 'http://192.168.x.x:3000'; // Ganti dengan IP komputer Anda
```

### 3️⃣ Install Expo Go di Smartphone

- **Android**: Download dari [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: Download dari [App Store](https://apps.apple.com/app/expo-go/id982107779)

### 4️⃣ Jalankan Aplikasi

```bash
npm start
```

Atau:
```bash
npx expo start
```

### 5️⃣ Scan QR Code

- **Android**: Buka Expo Go → Scan QR Code
- **iOS**: Buka Camera → Scan QR Code

## ✅ Verifikasi

Setelah aplikasi terbuka, coba:

1. ✅ Register user baru
2. ✅ Login dengan user yang baru dibuat
3. ✅ Navigate ke Vocabulary → coba flashcard
4. ✅ Navigate ke Quiz → selesaikan quiz
5. ✅ Navigate ke Profile → lihat statistik dan grafik

## 🎯 Struktur Expo Router (File-Based Routing)

```
app/
├── _layout.tsx           # Root layout
├── index.tsx             # Splash/auth check
├── login.tsx             # Login screen
└── (tabs)/               # Tab navigation group
    ├── _layout.tsx       # Tabs layout
    ├── index.tsx         # Home tab
    ├── vocabulary.tsx    # Vocabulary tab
    ├── quiz.tsx          # Quiz tab
    └── profile.tsx       # Profile tab
```

## ✨ Keunggulan Expo Router

✅ **File-based routing** - Route otomatis dari struktur folder
✅ **TypeScript support** - Type-safe navigation
✅ **Deep linking** - URL-based navigation
✅ **Bottom tabs** - Native tab navigation di `(tabs)/`
✅ **Stack navigation** - Built-in stack navigator
✅ **Mobile-friendly** - Optimized untuk mobile

## ❌ Troubleshooting Cepat

### Error: "Cannot connect to backend"
```bash
# Pastikan backend running
cd belajarindo-backend
npm start

# Atau cek status backend
curl https://belajar-indo.vercel.app/api/health
```

### Error: "Expo command not found"
```bash
npm install -g expo-cli
```

### Error: "Dependencies tidak lengkap"
```bash
cd app
rm -rf node_modules
rm package-lock.json
npm install
```

## 📱 Testing di Emulator

### Android Emulator
```bash
npm run android
```

### iOS Simulator (Mac only)
```bash
npm run ios
```

## 🎯 Next Steps

Lihat `EXPO_ROUTER_GUIDE.md` untuk dokumentasi lengkap tentang Expo Router!

---

**Need Help?** Check the full documentation in `EXPO_ROUTER_GUIDE.md`
