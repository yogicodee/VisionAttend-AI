/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Shield, Eye, MapPin, Brain, Sparkles, BellRing, ArrowRight, CheckCircle2 } from "lucide-react";

interface LandingPageProps {
    onGetStarted: () => void;
    darkMode: boolean;
}

export default function LandingPage({ onGetStarted, darkMode }: LandingPageProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const itemVariants = {
        hidden: { y: 25, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className={`min-h-screen font-sans transition-colors duration-500 overflow-x-hidden ${darkMode ? "bg-[#090d16] text-[#e2e8f0]" : "bg-slate-50 text-slate-800"}`}>

            {/* Dynamic Ambient Background Elements */}
            <div className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none overflow-hidden">
                <div className={`absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full filter blur-[120px] opacity-40 mix-blend-screen bg-blue-600 animate-pulse`} />
                <div className={`absolute top-[-10%] right-[15%] w-[450px] h-[450px] rounded-full filter blur-[150px] opacity-35 mix-blend-screen bg-purple-600`} />
            </div>

            {/* Header / Navbar */}
            <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Eye className="w-5.5 h-5.5 text-white animate-pulse" />
                    </div>
                    <div>
                        <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent">
                            VisionAttend <span className="text-blue-500">AI</span>
                        </span>
                        <div className="text-[9px] font-mono tracking-widest uppercase opacity-60">Sistem Absensi Masa Depan</div>
                    </div>
                </div>

                <button
                    onClick={onGetStarted}
                    className="relative group overflow-hidden px-5 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
                >
                    <span>Masuk Sistem</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24 text-center md:pt-28 md:pb-32">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
                        <span>Teknologi Computer Vision & Liveness Checking Terbaru v3.5</span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight max-w-4xl mx-auto"
                    >
                        Aplikasi Absensi Berbasis{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
                            Kecerdasan Buatan (AI)
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-sm md:text-lg max-w-2xl mx-auto opacity-75 font-sans leading-relaxed"
                    >
                        Sistem rekam kehadiran real-time yang canggih dengan enkripsi liveness anti titip absen (anti spoofing), verifikasi lokasi GPS terakreditasi, rekap mandiri, & asisten analitik otomatis terpadu.
                    </motion.p>

                    <motion.div variants={itemVariants} className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onGetStarted}
                            id="btn-get-started"
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl text-sm font-semibold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 group"
                        >
                            <span>Mulai Absensi Wajah Sekarang</span>
                            <Eye className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
                        </button>
                        <a
                            href="#fitur"
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-xs font-semibold rounded-2xl border border-white/5 transition-all text-center"
                        >
                            Pelajari Fitur Premium
                        </a>
                    </motion.div>

                    {/* Simulated Interface Showcase card */}
                    <motion.div
                        variants={itemVariants}
                        className="pt-16 max-w-5xl mx-auto"
                    >
                        <div className="p-1 rounded-3xl bg-gradient-to-tr from-blue-500/30 to-purple-500/30 shadow-2xl shadow-blue-500/10">
                            <div className="rounded-[22px] overflow-hidden bg-[#0d1020]/95 border border-white/10 relative p-6 md:p-8 text-left space-y-6">

                                {/* Simulated Face Scan frame overlay */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                    <div className="md:col-span-5 relative rounded-2xl bg-zinc-950 overflow-hidden aspect-video md:aspect-square flex flex-col items-center justify-center border border-white/10 p-4">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
                                        <div className="absolute top-4 left-4 border-t-2 border-l-2 border-blue-500 w-6 h-6" />
                                        <div className="absolute top-4 right-4 border-t-2 border-r-2 border-blue-500 w-6 h-6" />
                                        <div className="absolute bottom-4 left-4 border-b-2 border-l-2 border-blue-500 w-6 h-6" />
                                        <div className="absolute bottom-4 right-4 border-b-2 border-r-2 border-blue-500 w-6 h-6" />

                                        {/* Simulated laser path */}
                                        <div className="absolute left-0 right-0 h-0.5 bg-cyan-500/80 shadow-[0_0_10px_#22d3ee] top-1/3 scanner-line" />

                                        <div className="text-center space-y-3 relative z-10">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-500/50 flex items-center justify-center mx-auto bg-blue-500/10">
                                                <UserIcon className="w-10 h-10 text-blue-400" />
                                            </div>
                                            <div className="text-xs font-mono text-cyan-400">MEMINDAI GEOMETRI WAJAH...</div>
                                            <div className="text-[10px] text-zinc-400 px-3 py-1 rounded-md bg-zinc-900 border border-white/5 inline-block">Liveness Level: 99.8% | Confidence: 99.1%</div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-7 space-y-4">
                                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-mono">VISION MATRIX OK</div>
                                        <h3 className="font-display font-bold text-2xl text-white">Bagaimana Smart Face Recognition Bekerja?</h3>
                                        <p className="text-xs text-zinc-400 leading-relaxed">
                                            Menggunakan algoritma Face Geometrical Analysis untuk memetakan koordinat unik pada pupil mata, kontur wajah, dan hidung. Ditambah modul Anti-Spoofing berkemampuan tinggi untuk menangkal segala upaya manipulasi potret foto dua dimensi.
                                        </p>
                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div className="flex items-center gap-2 text-zinc-300 bg-white/5 p-2 rounded-xl">
                                                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                                                <span>Verifikasi GPS Presisi</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-300 bg-white/5 p-2 rounded-xl">
                                                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                                                <span>Analitik Kedisiplinan AI</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-300 bg-white/5 p-2 rounded-xl">
                                                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                                                <span>Chatbot HR Terintegrasi</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-300 bg-white/5 p-2 rounded-xl">
                                                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                                                <span>Laporan PDF & Excel Instan</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Grid Features Section */}
            <section id="fitur" className="relative max-w-7xl mx-auto px-6 py-12 border-t border-white/5">
                <div className="text-center space-y-3 mb-16">
                    <span className="text-blue-500 font-mono text-xs uppercase tracking-widest font-semibold">ARSITEKTUR PRESTASI</span>
                    <h2 className="font-display font-semibold text-3xl md:text-4xl">Teknologi Pelacak Kehadiran Terpadu</h2>
                    <p className="text-sm opacity-70 max-w-xl mx-auto">Kami mengintegrasikan komponen kecerdasan buatan, enkripsi spasial, serta fungsionalitas asisten pintar dalam satu panel terpadu.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1 */}
                    <div className="p-6 rounded-2xl glass-panel relative group overflow-hidden transition-all duration-300 hover:scale-[1.02]">
                        <div className="absolute -right-2 -bottom-2 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                            <Eye className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-semibold text-white mb-2">Face Recognition & Anti-Spoofing</h3>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">Keamanan tingkat enkripsi militer yang mengenali wajah pengguna asli dan menangkal penipuan dengan media visual apa pun.</p>
                    </div>

                    {/* Card 2 */}
                    <div className="p-6 rounded-2xl glass-panel relative group overflow-hidden transition-all duration-300 hover:scale-[1.02]">
                        <div className="absolute -right-2 -bottom-2 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-semibold text-white mb-2">GPS Verifikasi & Geofencing</h3>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">Mengamankan parameter lokasi absensi dalam perimeter kerja instansi kantor/sekolah demi mengeliminasi celah manipulasi lokasi.</p>
                    </div>

                    {/* Card 3 */}
                    <div className="p-6 rounded-2xl glass-panel relative group overflow-hidden transition-all duration-300 hover:scale-[1.02]">
                        <div className="absolute -right-2 -bottom-2 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                            <Brain className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-semibold text-white mb-2">Analitik Kedisiplinan Gemini AI</h3>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">Dapatkan ringkasan pola keterlambatan, analisis grafik, prediksi tren absen karyawan otomatis dikomposisi oleh LLM terbaik.</p>
                    </div>

                    {/* Card 4 */}
                    <div className="p-6 rounded-2xl glass-panel relative group overflow-hidden transition-all duration-300 hover:scale-[1.02]">
                        <div className="absolute -right-2 -bottom-2 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-semibold text-white mb-2">Asisten HR Chat & Aplikasi Izin</h3>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">Ajukan permohonan leave/sakit secara interaktif melalui chatbot asisten HR bertenaga AI yang ramah, sopan, dan pintar.</p>
                    </div>
                </div>
            </section>

            {/* Visual Workflow Flowchart section */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <div className="rounded-3xl bg-white/5 border border-white/10 p-6 md:p-8 space-y-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-display font-bold text-xl text-white">Alur Keamanan Sistem Absensi AI</h3>
                            <p className="text-xs text-zinc-400">Setiap instruksi dan absensi melintasi 4 tahap verifikasi real-time untuk menjamin otentisitas data.</p>
                        </div>
                        <div className="flex gap-2 text-[10px] font-mono">
                            <span className="px-2 py-1 bg-blue-500/20 rounded">REST API SAFE</span>
                            <span className="px-2 py-1 bg-purple-500/20 rounded">ANTI-SPOOF SECURE</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                        <div className="p-4 rounded-xl bg-zinc-900 border border-dashed border-white/10 relative">
                            <div className="absolute top-2 right-2 text-xs font-mono text-blue-500 font-bold">Langkah 1</div>
                            <div className="text-xs font-semibold text-white mb-1">Face Capture & GPS Check</div>
                            <p className="text-[10px] text-zinc-400">Aplikasi mengamankan geolokasi presisi perangkat dan mengambil satu potret selfie liveness wajah.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-900 border border-dashed border-white/10 relative">
                            <div className="absolute top-2 right-2 text-xs font-mono text-purple-500 font-bold">Langkah 2</div>
                            <div className="text-xs font-semibold text-white mb-1">Liveness Check (AI Server)</div>
                            <p className="text-[10px] text-zinc-400">Teknologi anti-spoofing mengevaluasi kontur wajah, refleks cahaya mata untuk menolak rekayasa cetak foto.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-900 border border-dashed border-white/10 relative">
                            <div className="absolute top-2 right-2 text-xs font-mono text-indigo-500 font-bold">Langkah 3</div>
                            <div className="text-xs font-semibold text-white mb-1">Geofence Compliance</div>
                            <p className="text-[10px] text-zinc-400">Sistem membandingkan jarak absensi dengan pusat koordinat kantor, menghitung status keterlambatan instan.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-900 border border-dashed border-white/10 relative">
                            <div className="absolute top-2 right-2 text-xs font-mono text-emerald-500 font-bold">Langkah 4</div>
                            <div className="text-xs font-semibold text-white mb-1">Autorekap & AI Analytics</div>
                            <p className="text-[10px] text-zinc-400">Laporan direkam dalam database instan, Gemini AI menyusun heatmap dan ramalan indeks kedisiplinan organisasi.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-[#070b12] text-zinc-500 text-xs py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <p>© 2026 VisionAttend AI. Sistem Absensi Pintar Enterprise berkelas dunia.</p>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Yogi Ilham Admin Dev</a>
                    </div>
                </div>
            </footer>

        </div>
    );
}

// Minimal fallback SVG for users
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}
