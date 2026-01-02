# Belajar Indo — Universal Mobile/Web App

Cross-platform Bahasa Indonesia learning app built with Expo Router. Includes flashcard vocabulary (45 kata), quiz with history, and virtual lab modules, running on iOS, Android, and Web from a single codebase.

---

## 🚀 Fitur Utama
- **Vocabulary**: 45 kata dalam 3 kategori (Makanan, Keluarga, Aktivitas Harian) dengan flashcard, flip animation, dan pencarian.
- **Quiz + History**: Kuis pilihan ganda dengan riwayat hasil, grade badge, dan progress bar.
- **Virtual Lab**: 15 modul latihan (Grammar, Conversation, Pronunciation) dengan indikator durasi & difficulty.
- **Auth & Progress**: JWT auth, penyimpanan progress vocabulary/quiz.
- **Multi-Platform**: Satu kode untuk iOS, Android, dan Web (Expo Router).

## 🧰 Tech Stack
- **Runtime**: React Native 0.81.5, Expo 54
- **Routing**: Expo Router 6 (file-based routing)
- **UI**: React Native, Expo Linear Gradient, Vector Icons
- **State & Storage**: React hooks, AsyncStorage, Context
- **Backend**: Node.js/Express + Prisma (folder `belajarindo-backend/`)

## ✅ Prasyarat
- Node.js 18+ (disarankan terbaru LTS)
- npm 9+ (atau bun/yarn jika diinginkan)
- Expo CLI (opsional, karena memakai `npx expo start`)
- Git

## 🛠️ Setup Cepat (Windows PowerShell)
```powershell
# 1) Install dependencies
npm install

# 2) Jalankan dev server (pilih web/ios/android di menu Expo)

```

## 🔑 Konfigurasi Environment
Buat file `.env` di root (sudah di-.gitignore). Contoh minimal:
```env
API_BASE_URL=https://belajar-indo.vercel.app
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key
```

## ▶️ Menjalankan Aplikasi
```powershell
# Jalankan Metro/Expo server
npm start

# Saat menu Expo muncul:
#   w -> Web (browser)
#   a -> Android emulator / device
#   i -> iOS simulator (macOS)
#   j -> Jest (jika diset)
```

## 🧪 Testing
- Manual testing panduan: lihat `TESTING_GUIDE.md` (cek Vocabulary, Quiz History, Virtual Lab).
- Saat ini tidak ada suite unit/E2E di repo. Jalankan smoke test via `npm start` dan uji di Web/Android/iOS.

## 🗂️ Struktur Proyek (utama)
```
app/                    # Expo Router screens (tabs, auth, layouts)
components/             # Reusable UI components
constants/              # Color, theme, shared constants
hooks/                  # Custom hooks
services/               # API clients (auth, lab, quiz, vocab)
types/                  # TypeScript types
utils/                  # Helpers
assets/                 # Images/assets
belajarindo-backend/    # Backend (Express + Prisma)
prisma/                 # Database schema & migrations
```

## 📚 Dokumentasi Penting
- `FINAL_COMPLETION_SUMMARY.md` — Ringkasan lengkap progres & compliance UAS.
- `TESTING_GUIDE.md` — Langkah pengujian cepat semua fitur utama.
- `UAS_SUBMISSION_CHECKLIST.md` — Checklist siap submit.

## ❓ Troubleshooting Singkat
- **Port/Metro error**: stop semua proses node, lalu `npm start` lagi.
- **Dependency mismatch**: jalankan `npm install` ulang, pastikan tidak ada `app/package.json` duplikat (sudah dibersihkan).
- **ENV tidak terbaca**: pastikan `.env` ada di root dan tidak di-commit; restart dev server setelah update ENV.

## 🧭 Road to Submit
1) `npm install`
2) `npm start` dan uji Web/Android/iOS
3) Ikuti `TESTING_GUIDE.md`
4) Review `FINAL_COMPLETION_SUMMARY.md`
5) Commit & push (branch: `virtual-lab-migration`)
6) Submit ke UAS

Selamat belajar! 🎉
