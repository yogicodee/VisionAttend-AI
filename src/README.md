# VisionAttend AI - Sistem Absensi Pintar dengan AI Face Recognition & Geofencing 🚀

VisionAttend AI adalah platform absensi berbasis kecerdasan buatan (Artificial Intelligence) dengan tampilan modern, futuristik, profesional, dan *user-friendly* berstandar *enterprise*. Sistem dirancang untuk menangkal titip absen (*anti-spoofing liveness detection*), memverifikasi keabsahan lokasi koordinat GPS secara akurat (*geofencing*), menyajikan analitik performa otomatis dengan Google Gemini AI, serta mengintegrasikan Chatbot Asisten HR cerdas demi efisiensi operasional harian.

---
## 🎨 Gambaran Estetika UI & Arsitektur
- **Tema Visual**: Sleek Interface bertema futuristik gelap (glowing neon blue & cosmic purple) berpadu tekstur *Glassmorphism* modern.
- **Teknologi Utama**:
  - **Frontend**: React 19, Tailwind CSS v4, Lucide Icons, Recharts, Motion (Animate & Transition).
  - **Backend**: Node.js / Express untuk server-side proxy API dan rendering statis terpadu.
  - **AI Model**: Google Gemini 3.5 Flash SDK via API Server-Side untuk instan analisis foto *Selfie Liveness* (Anti-Spoofing 2D/3D screen match) dan Analisis Pola Kedisiplinan Tim.
  - **Keamanan**: GPS Haversine Geofencing (150 meter limit) dan Blockchain-simulated Face Registries.

---
## 📂 Struktur Utama Project

```text
├── .env.example            # Kerangka konfigurasi enkripsi API Key Gemini
├── .gitignore              # Proteksi penyimpanan build artifacts
├── index.html              # Entry point HTML5 utama
├── metadata.json           # Izin perangkat keras (Camera, Geolocation) & metadata platform
├── package.json            # Daftar dependensi & script build produksi CJS
├── tsconfig.json           # Standarisasi kompilasi TypeScript
├── vite.config.ts          # Konfigurasi plugin React & optimasi CPU Watcher
├── server.ts               # Core Backend Server Express & Integrasi Gemini GenAI
├── README.md               # Dokumentasi panduan operasional (File ini)
└── src/
    ├── main.tsx            # Entry rendering React DOM
    ├── index.css           # Styling warna khusus & animasi laser scanning
    ├── types.ts            # Standarisasi tipe data TypeScript (User, Attendance, Chat)
    ├── App.tsx             # Workspace utama & orchestrator tab halaman aplikasi
    └── components/
        └── LandingPage.tsx # Landing Page Interaktif VisionAttend AI
```

---
## 🛣️ Alur Verifikasi Kehadiran VisionAttend AI
Sistem absensi memproses setiap rekam jejak karyawan melalui rantai otentikasi ketat:
1. **Face Geometrical Analysis & Liveness Check (AI Server)**: Membaca potret wajah secara real-time, mendeteksi pola kelopak mata, tingkat percaya diri pencocokan (*confidence score*), dan memblokir visual statis cetak foto gawai (Anti-Spoofing).
2. **GPS Geofence Tracking**: Memeriksa koordinat satelit terkunci dan menghitung radius jarak terhadap pusat pangkalan Menara VisionAttend Sudirman (maksimum toleransi 150m).
3. **Pencatatan Log & Gemini AI Analytics**: Menandai tingkat kedisiplinan (Hadir, Lambat >08:30 WIB, Izin) dan merangkum diagram grafik interaktif beserta saran otomatis performa organisasi.
4. **Interactive HR Assistant**: Asisten ramah bertenaga AI siap menjawab pertanyaan aturan cuti, kalkulasi denda, atau mendaftarkan ulang wajah.

---
## ⚡ Instalasi dan Penginstalan Lokal

Ikuti langkah cepat berikut untuk menjalankan sistem VisionAttend AI di komputer lokal Anda:

### 1. Prasyarat Sistem
Pastikan Node.js (versi >= 18.x) dan npm sudah terinstal di komputer Anda.

### 2. Kloning dan Instal Dependensi
```bash
# Instal paket dependensi yang dideklarasikan di package.json
npm install
```

### 3. Konfigurasi Kunci Enkripsi .env
Buat file bernama `.env` di direktori utama lalu tambahkan kode kredensial Anda:
```env
GEMINI_API_KEY="ISI_DENGAN_API_KEY_GEMINI_ANDA"
APP_URL="http://localhost:3000"
```

### 4. Jalankan Server Pengembangan (Dev Mode)
```bash
npm run dev
```
Buka peramban browser Anda di alamat `http://localhost:3000`.

---
## ⚙️ Panduan Manajemen Pemeliharaan Produksi

### Eksekusi Build Kompilasi
Untuk menghasilkan berkas bundle JavaScript statis untuk disajikan stabil ke server Cloud hosting Anda:
```bash
npm run build
```
Perintah di atas akan mengeksekusi kompilasi esbuild dan mengemas backend server statis ke dalam lintasan mandiri di folder `dist/server.cjs` yang tervalidasi bebas dari konflik ES Module Node.js.

### Menjalankan Server Produksi
```bash
npm run start
```
Sistem akan langsung mendengarkan lalu lintas server rujukan pada port `3000`.

---