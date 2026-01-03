<div align="center">
  <img src="https://github.com/aldoyfa/belajar-indo/blob/virtual-lab-migration/assets/images/icon/Belajar.png" alt="BelajarIndo Logo" width="7600/>

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61dafb?style=flat-square&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0.25-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169e1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)

</div>

---

## Overview

> BelajarIndo adalah aplikasi lintas platform yang dirancang untuk memudahkan proses belajar Bahasa Indonesia secara interaktif dan mudah diakses. Aplikasi ini dibangun menggunakan React Native dan Expo, sehingga dapat berjalan dengan lancar di iOS, Android, dan Web.

---

##  Features
Berikut ini adalah fitur-fitur utama yang disediakan dalam aplikasi **BelajarIndo**:

| Fitur | Deskripsi |
|------|----------|
| **Home Dashboard** | Akses cepat ke seluruh modul pembelajaran, menampilkan ringkasan progres, statistik belajar, serta rekomendasi materi yang dipersonalisasi. |
| **Pembelajaran Kosakata** | Lebih dari **45 kosakata** dalam 3 kategori: <br>• Makanan & Minuman (15 kata) <br>• Keluarga (15 kata) <br>• Aktivitas Sehari-hari (15 kata). <br>Dilengkapi flashcard interaktif dengan animasi flip, contoh kalimat, pelacakan progres per kategori, dan fitur pencarian lanjutan. |
| **Kuis Interaktif** | Kuis pilihan ganda dengan penilaian real-time, riwayat kuis lengkap, sistem nilai (A–F) dengan umpan balik visual, analitik performa dan tren, serta pencatatan waktu pengerjaan. |
| **Virtual Lab** | Terdiri dari **15 modul** dalam 3 kategori: <br>• Tata Bahasa & Struktur (5 modul) <br>• Latihan Percakapan (5 modul) <br>• Laboratorium Pelafalan (5 modul). <br>Menyediakan tingkat kesulitan (Mudah, Menengah, Sulit), estimasi durasi 10–30 menit, dan pelacakan progres per modul. |
| **Profil Pengguna** | Dashboard statistik personal, grafik tren performa, visualisasi riwayat kuis, pengelolaan akun, serta kustomisasi avatar pengguna. |


---

## Getting Started

Sebelum menjalankan aplikasi, pastikan perangkat telah memenuhi kebutuhan berikut:

- Node.js (versi 18 atau lebih baru)
- npm atau yarn
- Expo CLI (opsional, namun direkomendasikan)
- PostgreSQL (versi 15 atau lebih baru)
- Git

Untuk pengembangan aplikasi mobile:
- Android Studio (untuk Android)
- Xcode (untuk iOS, khusus macOS)


---

## Running on Devices

### **Web**
```bash
npm run web
```
Aplikasi akan terbuka melalui browser pada alamat:
`http://localhost:8081`

### **Android**
```bash
npm run android
```

### **iOS**
```bash
npm run ios
```

### **Expo Go (Quick Testing)**

1. Instal aplikasi Expo Go pada perangkat mobile:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Jalankan `npm start` dan pindai QR Code yang muncul menggunakan aplikasi Expo Go

---

## Project Structure
Dibawah ini adalah struktur folder utama yang digunakan dalam pengembangan aplikasi BelajarIndo beserta fungsi dari masing-masing direktori:

```
belajarindo/
├── app/                → Kode utama aplikasi frontend (halaman & navigasi)
├── components/         → Komponen UI yang dapat digunakan ulang
├── services/           → Layanan API dan integrasi backend
├── constants/          → Konstanta aplikasi (warna, konfigurasi)
├── types/              → Definisi tipe data
├── belajarindo-backend/→ Kode backend dan manajemen basis data
├── assets/             → Aset statis aplikasi
├── package.json        → Konfigurasi dependensi
└── README.md           → Dokumentasi proyek
```

## Contributors
Berikut adalah daftar kontributor beserta pembagian tugasnya masing-masing:

| No | Nama | NIM | Tugas / Kontribusi |
|----|------|-----|--------------------|
| 1 | **Aldoy Fauzan Avanza** | 18223113 | - Pengembangan fitur inti aplikasi<br>- Implementasi backend dan Integrasi<br>- Membuat splash screen aplikasi<br>- Finalisasi Project<br>- Menulis dan merapikan dokumentasi serta laporan proyek |
| 2 | **Laras Hati Mahendra** | 18223118 | - Inisiasi ide dan perencanaan proyek<br>-Penyusunan struktur repository dan alur pengembangan<br>- Melakukan migrasi Expo<br>- Mendesain UI<br>- Menyusun analisis sistem (use case, activity diagram, sequence diagram)<br> - Menulis dan merapikan dokumentasi serta laporan proyek |

---
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
