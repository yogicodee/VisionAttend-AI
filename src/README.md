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