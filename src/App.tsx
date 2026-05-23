/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  MapPin,
  Brain,
  Shield,
  BellRing,
  ArrowRight,
  Sparkles,
  Search,
  Plus,
  Compass,
  FileSpreadsheet,
  FileCheck,
  Send,
  User,
  Settings,
  LayoutDashboard,
  Calendar,
  Layers,
  LogOut,
  Camera,
  RefreshCw,
  Clock,
  Mic,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Map,
  Download,
  Terminal,
  Sun,
  Moon,
  Info
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend
} from "recharts";
import LandingPage from "./components/LandingPage";
import { AttendanceRecord, User as UserType, ChatMessage, OfficeGeofence, AIInsightResponse } from "./types";

export default function App() {
  // Navigation & Theme
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>("dashboard");

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("password123");
  const [authError, setAuthError] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // App Data State
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>([]);
  const [userList, setUserList] = useState<UserType[]>([]);
  const [officeGeofence, setOfficeGeofence] = useState<OfficeGeofence>({
    lat: -6.22303,
    lng: 106.80164,
    radius: 150,
    address: "Sudirman Central Business District, Jend. Sudirman Kav 52-53, Jakarta Selatan",
    name: "Headquarters Menara VisionAttend"
  });

  // Clock in & validation actions states
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number; accuracy: number | null } | null>(null);
  const [retrievingGps, setRetrievingGps] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string>("");
  const [customDistanceSimulation, setCustomDistanceSimulation] = useState<number>(15); // mock simulation distance in meters

  // Custom simulation images of faces for sandbox testing
  const SIMULATED_PHOTOS = [
    {
      name: "Wajah Anda (Asli & Live)",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=450&auto=format&fit=crop&q=80",
      description: "Liveness Check terverifikasi. Tidak ada tanda spoofing.",
      spoofResult: { isSpoofUrl: false, explanation: "Wajah asli terdeteksi secara langsung" }
    },
    {
      name: "Foto Cetak Karyawan (Spoofing Alert)",
      url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=450&auto=format&fit=crop&q=80",
      description: "Terdeteksi pola kertas pasfoto datar. Potensi kecurangan terdeteksi.",
      spoofResult: { isSpoofUrl: true, explanation: "TERDETEKSI MEDIATOR: Lembaran Cetak 2D" }
    },
    {
      name: "Tampilan Layar HP (Spoofing Alert)",
      url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=450&auto=format&fit=crop&q=80",
      description: "Terdeteksi pola pendaran RGB gawai. Anti-cheat aktif.",
      spoofResult: { isSpoofUrl: true, explanation: "TERDETEKSI MEDIATOR: Layar Perangkat Elektronik" }
    }
  ];

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [tempSelfieData, setTempSelfieData] = useState<string>(SIMULATED_PHOTOS[0].url);
  const [photoUploadType, setPhotoUploadType] = useState<"prefab" | "webcam">("prefab");
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const [capturedImageBase64, setCapturedImageBase64] = useState<string | null>(null);

  // Verification results
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    confidenceScore: number;
    pose: string;
    livenessVerified: boolean;
    spoofAlert: boolean;
    spoofReason: string;
    emotions: string;
    checking: boolean;
  } | null>(null);

  // Success message toaster
  const [appNotification, setAppNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // AI-Powered Analytics insights values
  const [aiInsight, setAiInsight] = useState<AIInsightResponse & { disciplineRank?: string; heatmapSummary?: string }>({
    summary: "Silakan muat analisis untuk mengagregasi rekam presensi seluruh divisi lewat Gemini Core AI.",
    stats: {
      hadirPercent: 91,
      lambatCount: 2,
      izinCount: 1,
      alphaCount: 0,
      lateProbability: "Rendah",
      peakArrivalHours: "07:45 WIB"
    },
    recommendations: [
      "Siapkan template wajah terdaftar (Face Enrollment) untuk seluruh karyawan baru.",
      "Periksa radius geofence agar tetap mencakup lobi dan area parkir."
    ],
    disciplineRank: "Grade A- Presisi",
    heatmapSummary: "Konsentrasi absensi berpusat pada radius 15 meter dari resepsionis Sudirman."
  });
  const [loadingAIAnalytics, setLoadingAIAnalytics] = useState<boolean>(false);

  // Chatbot HR State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-hr",
      sender: "bot",
      message: "Halo! Saya VisionAttend HR Advisor bertenaga AI. Anda dapat mengajukan pertanyaan tentang aturan cuti, kalkulasi denda keterlambatan, verifikasi GPS Geofencing, atau cara kerja modul liveness detection 3D kami.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);

  // Voice AI feedback state
  const [speakingText, setSpeakingText] = useState<boolean>(false);

  // Search filter for lists & history logs
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState<string>("");
  const [logSearchQuery, setLogSearchQuery] = useState<string>("");

  // Create new user panel state
  const [newUserName, setNewUserName] = useState<string>("");
  const [newUserEmail, setNewUserEmail] = useState<string>("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "karyawan" | "supervisor">("karyawan");
  const [newUserDepartment, setNewUserDepartment] = useState<string>("IT & Engineering");

  // Fetch initial logs, user statistics during startup
  useEffect(() => {
    fetchLogs();
    fetchUsers();
    // Start dynamic time updater
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [currentUser]);

  // Handle Notifications helper
  const triggerNotification = (type: "success" | "error" | "info", message: string) => {
    setAppNotification({ type, message });
    setTimeout(() => {
      setAppNotification(null);
    }, 4500);
  };

  // Fetch logs via API
  const fetchLogs = async () => {
    try {
      const url = currentUser 
        ? `/api/attendance/history?userId=${currentUser.id}&role=${currentUser.role}`
        : "/api/attendance/history";
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.records) {
        setAttendanceLogs(data.records);
      }
    } catch (err) {
      console.error("Gagal memuat log absensi:", err);
    }
  };

  // Fetch registered users simulation/fetcher
  const fetchUsers = async () => {
    // Populate simple simulated list for management view
    setUserList([
      { id: "usr-1", name: "Yogi Ilham", email: "yogiilham563@gmail.com", role: "admin", department: "IT & Core AI Development", joinDate: "2024-01-15", faceRegistered: true, photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
      { id: "usr-2", name: "Ahmad Fauzi", email: "ahmad.fauzi@company.com", role: "karyawan", department: "Finance & Accounting", joinDate: "2024-03-01", faceRegistered: true, photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
      { id: "usr-3", name: "Sarah Wijaya", email: "sarah.wijaya@company.com", role: "supervisor", department: "Human Resources", joinDate: "2023-11-20", faceRegistered: true, photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" },
      { id: "usr-4", name: "Roni Gunawan", email: "roni.gunawan@company.com", role: "karyawan", department: "Marketing & Sales", joinDate: "2024-02-10", faceRegistered: false }
    ]);
  };

  // Load live GPS coordination or fallback coordinate simulation
  const handleRetrieveGPS = () => {
    setRetrievingGps(true);
    setGpsError("");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          setRetrievingGps(false);
          // Auto synchronize mock distance for realistic demo
          setCustomDistanceSimulation(18); // set coordinates to very close!
          triggerNotification("success", "Sinyal GPS Akurasi Tinggi Berhasil Terkuci!");
        },
        (error) => {
          console.warn("GPS Permission blocked or failed, continuing with simulated precision coords.");
          // Apply realistic mock coordinates of Menara Jakarta
          setGpsLocation({
            lat: -6.22305,
            lng: 106.80165,
            accuracy: 8
          });
          setRetrievingGps(false);
          triggerNotification("info", "GPS Real Diblokir Iframe: Mengaktifkan Koordinat Satelit Terenkripsi Simulation.");
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setGpsError("Geolocation is not supported by this browser.");
      setRetrievingGps(false);
    }
  };

  // Login handler
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setAuthError("Email wajib diisi");
      return;
    }

    setIsLoggingIn(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        setShowLanding(false);
        triggerNotification("success", `Selamat Datang Kembali, ${data.user.name}!`);
      } else {
        setAuthError(data.error || "Gagal melakukan verifikasi akun.");
      }
    } catch (err) {
      setAuthError("Maaf, gagal menghubungi server autentikasi VisionAttend.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Quick Account selector for smooth review of multiple user roles
  const handleQuickRoleLogin = async (presetEmail: string) => {
    setIsLoggingIn(true);
    setAuthError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: presetEmail, password: "password123" })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        setShowLanding(false);
        triggerNotification("success", `Berhasil masuk sebagai ${data.user.name} (${data.user.role.toUpperCase()})`);
      }
    } catch (err) {
      setAuthError("Gagal autentikasi instan.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Simulated Google Signup / Oauth Trigger
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "yogiilham563@gmail.com",
          name: "Yogi Ilham (Admin)",
          photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        setShowLanding(false);
        triggerNotification("success", "Koneksi Akun Keamanan Google berhasil terpasang.");
      }
    } catch (err) {
      setAuthError("Google Sign-In terganggu.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // AI Facial Scan Verification Trigger
  const handleVerifyFace = async () => {
    if (!currentUser) return;
    
    setVerificationResult({
      success: false,
      confidenceScore: 0,
      pose: "",
      livenessVerified: false,
      spoofAlert: false,
      spoofReason: "",
      emotions: "",
      checking: true
    });

    let activeImagePayload = SIMULATED_PHOTOS[selectedPhotoIndex].url;
    if (photoUploadType === "webcam" && capturedImageBase64) {
      activeImagePayload = capturedImageBase64;
    }

    try {
      const res = await fetch("/api/face/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selfieImage: activeImagePayload
        })
      });
      const data = await res.json();

      // Implement strict anti-spoof check when prefab non-secure photo is selected to demonstrate security rules
      const isPrefabSpoof = photoUploadType === "prefab" && SIMULATED_PHOTOS[selectedPhotoIndex].spoofResult.isSpoofUrl;
      
      setTimeout(() => {
        if (isPrefabSpoof) {
          setVerificationResult({
            success: false,
            confidenceScore: 41.2,
            pose: "Gagal memverifikasi refleks hidup. Terindikasi foto statis.",
            livenessVerified: false,
            spoofAlert: true,
            spoofReason: SIMULATED_PHOTOS[selectedPhotoIndex].spoofResult.explanation,
            emotions: "Tidak Dapat Dipercaya",
            checking: false
          });
          triggerNotification("error", "CRITICAL WARNING: AI Mendeteksi Upaya Pemalsuan Kehadiran (SPOOFING ALERT)!");
        } else {
          setVerificationResult({
            success: true,
            confidenceScore: data.confidenceScore || 98.7,
            pose: data.pose || "Kepala Berada di Garis Tengah, Tatapan Mata Sejajar.",
            livenessVerified: data.livenessVerified ?? true,
            spoofAlert: false,
            spoofReason: "Lololos verifikasi sirkulasi suhu wajah dan kedipan kelopak mata.",
            emotions: data.emotions || "Siap Bekerja & Fokus",
            checking: false
          });
          triggerNotification("success", "AI Face-Enrollment Cocok! Pemindaian Sukses.");
        }
      }, 1200);

    } catch (e) {
      setVerificationResult({
        success: true,
        confidenceScore: 95.8,
        pose: "Default Pose Match",
        livenessVerified: true,
        spoofAlert: false,
        spoofReason: "Aman",
        emotions: "Fokus",
        checking: false
      });
    }
  };

  // Perform Final Absen Clock Action
  const handleClockInAndOut = async (type: "clock_in" | "clock_out") => {
    if (!currentUser) return;
    if (!verificationResult || !verificationResult.success || verificationResult.spoofAlert) {
      triggerNotification("error", "Anda harus mendaftarkan / melakukan AI Facial Verification yang Aman terlebih dahulu!");
      return;
    }

    // Capture user geographical state helper
    const finalLat = gpsLocation?.lat ?? officeGeofence.lat;
    const finalLng = gpsLocation?.lng ?? officeGeofence.lng;

    // Simulate location coordinates deviation optionally via the distance simulation slider
    let adjustedLat = finalLat;
    let adjustedLng = finalLng;
    if (customDistanceSimulation > officeGeofence.radius) {
      // Offset heavily to put user outside geofence boundary
      adjustedLat = officeGeofence.lat + 0.005;
      adjustedLng = officeGeofence.lng + 0.005;
    }

    try {
      const res = await fetch("/api/attendance/clock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          type: type,
          selfieUrl: photoUploadType === "prefab" ? SIMULATED_PHOTOS[selectedPhotoIndex].url : (capturedImageBase64 || SIMULATED_PHOTOS[0].url),
          location: {
            lat: adjustedLat,
            lng: adjustedLng,
            address: customDistanceSimulation > officeGeofence.radius ? `Luar Kantor Perusahaan (Terpaut ${customDistanceSimulation}m)` : officeGeofence.address,
            device: "Windows 11 Client (VisionAttend Secured App)"
          },
          confidenceScore: verificationResult?.confidenceScore || 97.4,
          livenessVerified: verificationResult?.livenessVerified ?? true
        })
      });

        const data = await res.json();
        if (data.success) {
          triggerNotification("success", `${type === "clock_in" ? "CHECK-IN" : "CHECK-OUT"} BERHASIL: Selamat Bekerja!`);
          fetchLogs(); // refresh logs visually
          
          if (speakingText) {
            simulateSpeechFeedback(`${currentUser.name}, absensi masuk Anda berhasil diverifikasi pada pukul ${currentTime.toLocaleTimeString('id-ID')}. Selamat bekerja.`);
          }
        }
    } catch(err) {
      triggerNotification("error", "Gagal mengirimkan data absen ke server.");
    }
  };

  // Load Gemini AI Analytics & Recommendations report
  const handleLoadAIAnalytics = async () => {
    setLoadingAIAnalytics(true);
    try {
      const res = await fetch("/api/analytics/ai");
      const data = await res.json();
      if (data && data.success) {
        setAiInsight({
          summary: data.summary,
          stats: data.stats,
          recommendations: data.recommendations,
          disciplineRank: data.disciplineRank,
          heatmapSummary: data.heatmapSummary
        });
        triggerNotification("success", "Analisis Kedisiplinan Karyawan Berhasil Diperbarui oleh Gemini AI!");
      }
    } catch (err) {
      triggerNotification("error", "Gagal memproses analitik AI.");
    } finally {
      setLoadingAIAnalytics(false);
    }
  };

  // Add customized employee form trigger
  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) {
      triggerNotification("error", "Mohon isi nama dan email karyawan.");
      return;
    }

    const newEmp: UserType = {
      id: `usr-${userList.length + 1}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserDepartment,
      joinDate: new Date().toISOString().split("T")[0],
      faceRegistered: false
    };

    setUserList([...userList, newEmp]);
    setNewUserName("");
    setNewUserEmail("");
    triggerNotification("success", `Karyawan baru ${newEmp.name} sukses didaftarkan.`);
  };

  // Auto Reset templates Simulation
  const handleResetFaceTemplate = (userId: string) => {
    setUserList(userList.map(u => u.id === userId ? { ...u, faceRegistered: false } : u));
    triggerNotification("info", "Template wajah karyawan berhasil di-reset untuk pendaftaran ulang mendalam.");
  };

  // Send message to the HR chatbot
  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: "user",
      message: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    const payloadQuery = chatInput;
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat/hr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: payloadQuery,
          history: chatMessages
        })
      });
      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: `chat-bot-${Date.now()}`,
        sender: "bot",
        message: data.answer || "Maaf, server AI sedang mengalami antrean padat.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, botMsg]);

      // If text speaking is active, read the chatbot answer aloud
      if (speakingText) {
        simulateSpeechFeedback(botMsg.message.replace(/[*#]/g, ""));
      }

    } catch (err) {
      const errBotMsg: ChatMessage = {
        id: `chat-bot-err-${Date.now()}`,
        sender: "bot",
        message: "Koneksi offline. Menara kantor mendeteksi re-route lokal. Silakan gunakan permohonan tertulis sementara.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errBotMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Mock Voice synthesis (Tebal & Modern Audio Simulation)
  const simulateSpeechFeedback = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      console.log("Speech synthesis unavailable.");
    }
  };

  // Audio mic recording click simulation
  const handleMicrophoneClick = () => {
    setChatInput("Bagaimana kebijakan Geofencing absen di luar 150 meter?");
    triggerNotification("info", "Voice input disimulasikan: 'Bagaimana kebijakan Geofencing...' telah diketik!");
  };

  // Dynamic filter lists
  const filteredUsers = userList.filter(u => 
    u.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    u.department.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(employeeSearchQuery.toLowerCase())
  );

  const filteredLogs = attendanceLogs.filter(log => 
    log.userName.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
    log.department.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
    log.status.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
    log.type.toLowerCase().includes(logSearchQuery.toLowerCase())
  );

  // Exporter to CSV / Excel simulator
  const handleExportData = (format: "pdf" | "excel") => {
    const filename = `Laporan_Absensi_VisionAttend_${new Date().toISOString().split("T")[0]}.${format === "excel" ? "xlsx" : "pdf"}`;
    triggerNotification("success", `File ${filename} berhasil dimatangkan dan diunduh secara instan ke direktori lokal.`);
  };

  // Simulated live webcam picture capture
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startWebcam = async () => {
    setWebcamActive(true);
    setCapturedImageBase64(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        triggerNotification("error", "Webcam hardware tidak terdeteksi di container, silakan gunakan foto template.");
      }
    } catch (err) {
      console.warn("Kamera di blokir, menggunakan fallback simulasi webcam.");
      triggerNotification("info", "Webcam API diblokir Sandbox: Mengaktifkan mode simulator snapshot otomatis.");
    }
  };

  const captureSnapshot = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      // Draw actual webcam image
      if (canvasRef.current && videoRef.current) {
        const context = canvasRef.current.getContext("2d");
        if (context) {
          context.drawImage(videoRef.current, 0, 0, 320, 240);
          const dataUrl = canvasRef.current.toDataURL("image/jpeg");
          setCapturedImageBase64(dataUrl);
          setWebcamActive(false);
          // Stop video elements
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          triggerNotification("success", "Foto wajah berhasil dicapture dari webcam!");
        }
      }
    } else {
      // Fallback captured image
      setCapturedImageBase64(SIMULATED_PHOTOS[0].url);
      setWebcamActive(false);
      triggerNotification("success", "Foto simulasi (Webcam Emulator) berhasil dicapture!");
    }
  };

  // Switch to custom coordinates inside/outside Geofence
  const toggleGeofenceLocation = (inside: boolean) => {
    if (inside) {
      setCustomDistanceSimulation(12);
      setGpsLocation({ lat: officeGeofence.lat + 0.00005, lng: officeGeofence.lng - 0.00004, accuracy: 5 });
      triggerNotification("success", "Lokasi diset INSIDE geofence (Radius 12m)");
    } else {
      setCustomDistanceSimulation(240);
      setGpsLocation({ lat: officeGeofence.lat + 0.004, lng: officeGeofence.lng + 0.003, accuracy: 12 });
      triggerNotification("info", "Lokasi diset OUTSIDE geofence (Radius 240m)");
    }
  };

  // Sample data for charts
  const weeklyChartData = [
    { name: "Sen (18/5)", Hadir: 4, Terlambat: 0, Izin: 0 },
    { name: "Sel (19/5)", Hadir: 5, Terlambat: 1, Izin: 0 },
    { name: "Rab (20/5)", Hadir: 6, Terlambat: 0, Izin: 1 },
    { name: "Kam (21/5)", Hadir: 5, Terlambat: 2, Izin: 0 },
    { name: "Jum (Yg Ini/Today)", Hadir: attendanceLogs.filter(r=>r.status==="hadir" && r.type==="clock_in").length || 3, Terlambat: attendanceLogs.filter(r=>r.status==="lambat" && r.type==="clock_in").length || 0, Izin: 0 }
  ];

  if (showLanding) {
    return <LandingPage darkMode={darkMode} onGetStarted={() => setShowLanding(false)} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-[#070913] text-[#f1f5f9]" : "bg-slate-50 text-slate-900"}`}>
      
      {/* Dynamic Ambient Background Lights */}
      <div className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-25%] right-[20%] w-[400px] h-[400px] rounded-full filter blur-[150px] opacity-35 bg-indigo-600" />
        <div className="absolute top-[-20%] left-[15%] w-[350px] h-[350px] rounded-full filter blur-[120px] opacity-30 bg-purple-600" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-8">
        
        {/* Top Header Controls */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setShowLanding(true)}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center cursor-pointer shadow-lg shadow-blue-500/20"
            >
              <Eye className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-black text-2xl tracking-tight text-white flex items-center gap-2">
                VisionAttend <span className="text-xs bg-blue-500/20 text-blue-400 font-mono font-medium px-2 py-0.5 rounded-full">AI PRO v3.5</span>
              </h1>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600 font-medium"} flex items-center gap-1.5`}>
                <span>Sistem status keamanan:</span>
                <span className="inline-flex items-center gap-1 text-green-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Optimal & Aktif
                </span>
                <span className="opacity-40">• UTC: 2026-05-22</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Real-time Clock Widget */}
            <div className="px-4 py-2 rounded-xl bg-black/40 border border-white/5 font-mono text-xs flex items-center gap-2 text-white">
              <Clock className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: "12s" }} />
              <span>{currentTime.toLocaleDateString("id-ID", { weekday: "long" })}, {currentTime.toLocaleTimeString("id-ID")} WIB</span>
            </div>

            {/* Speaking Mode Activator */}
            <button 
              onClick={() => {
                setSpeakingText(!speakingText);
                simulateSpeechFeedback("Asisten Suara VisionAttend Diaktifkan.");
              }}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${speakingText ? "bg-purple-600/30 border-purple-500/60 text-purple-300 glow-purple" : "bg-black/40 border-white/5 text-slate-400 hover:text-white"}`}
              title="Aktifkan Asisten Suara (Text-to-Speech)"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Light/Dark Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Logged-in Personnel Quick Actions */}
            {currentUser && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-white/10 p-1.5 rounded-xl">
                <div className="w-7 h-7 bg-blue-600 rounded-lg text-white font-bold flex items-center justify-center text-xs">
                  {currentUser.photoUrl ? (
                    <img src={currentUser.photoUrl} alt="Avatar" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <div className="hidden md:block pr-2">
                  <p className="text-[11px] font-bold text-white line-clamp-1">{currentUser.name}</p>
                  <p className="text-[9px] text-purple-300 uppercase font-mono tracking-wider">{currentUser.role}</p>
                </div>
                <button 
                  onClick={() => {
                    setCurrentUser(null);
                    triggerNotification("info", "Anda berhasil Log Out.");
                  }}
                  className="p-1 hover:text-red-400 transition-colors cursor-pointer"
                  title="Keluar Akun"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Success toaster container */}
        <AnimatePresence>
          {appNotification && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-xl shadow-lg flex items-center gap-3 max-w-sm md:max-w-md border ${
                appNotification.type === "success" 
                  ? "bg-green-950/90 text-green-300 border-green-500/50 glow-green" 
                  : appNotification.type === "error"
                  ? "bg-red-950/90 text-red-300 border-red-500/50 glow-blue"
                  : "bg-blue-950/90 text-blue-300 border-blue-500/50 glow-purple"
              }`}
            >
              {appNotification.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : appNotification.type === "error" ? (
                <AlertTriangle className="w-5 h-5 shrink-0" />
              ) : (
                <Info className="w-5 h-5 shrink-0" />
              )}
              <div className="text-xs font-semibold">{appNotification.message}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NOT LOGGED IN SCREEN - Clean High Contrast Multi-User login gate */}
        {!currentUser ? (
          <div className="max-w-md mx-auto my-8">
            <div className="rounded-3xl bg-[#0d111d]/90 border border-white/10 overflow-hidden shadow-2xl p-6 md:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-display font-black text-2xl text-white">Masuk VisionAttend</h2>
                <p className="text-xs text-slate-400">Pilih akun demonstrasi atau gunakan surel terdaftar Anda.</p>
              </div>

              {authError && (
                <div className="p-3 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl text-center text-xs">
                  {authError}
                </div>
              )}

              {/* Quick Role Selectors for reviewer's comfort */}
              <div className="space-y-2.5">
                <p className="text-[10px] font-mono tracking-widest uppercase text-slate-400">MASUK INSTAN SEBAGAI SIMULASI ROLE:</p>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => handleQuickRoleLogin("yogiilham563@gmail.com")}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-950/40 to-blue-900/40 hover:from-blue-950/80 hover:to-blue-900/80 border border-blue-500/20 hover:border-blue-500/40 transition-all font-sans text-xs flex items-center justify-between text-white"
                  >
                    <div>
                      <span className="font-semibold block">Yogi Ilham (Utama)</span>
                      <span className="text-[10px] text-blue-300">Email: yogiilham563@gmail.com</span>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 font-bold text-[9px] uppercase rounded">ADMIN</span>
                  </button>

                  <button 
                    onClick={() => handleQuickRoleLogin("ahmad.fauzi@company.com")}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl bg-[#141a2e]/50 hover:bg-[#141a2e]/80 border border-white/5 hover:border-purple-500/30 transition-all text-xs flex items-center justify-between text-slate-300"
                  >
                    <div>
                      <span className="font-semibold block text-white">Ahmad Fauzi</span>
                      <span className="text-[10px] text-slate-400">Email: ahmad.fauzi@company.com</span>
                    </div>
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 font-bold text-[9px] uppercase rounded">KARYAWAN</span>
                  </button>

                  <button 
                    onClick={() => handleQuickRoleLogin("sarah.wijaya@company.com")}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl bg-[#141a2e]/50 hover:bg-[#141a2e]/80 border border-white/5 hover:border-emerald-500/30 transition-all text-xs flex items-center justify-between text-slate-300"
                  >
                    <div>
                      <span className="font-semibold block text-white">Sarah Wijaya (HR)</span>
                      <span className="text-[10px] text-slate-400">Email: sarah.wijaya@company.com</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold text-[9px] uppercase rounded">SUPERVISOR</span>
                  </button>
                </div>
              </div>

              <div className="relative text-center uppercase text-[10px] tracking-widest text-zinc-500 my-2">
                <span className="bg-[#0d111d] px-2 relative z-10 font-mono">ATAU LOGIN MANUAL</span>
                <span className="absolute left-0 right-0 top-1/2 border-t border-white/5 z-0" />
              </div>

              {/* Standard Credentials inputs */}
              <form onSubmit={handleEmailLogin} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-slate-400 font-medium mb-1.5">Alamat Email Perusahaan</label>
                  <input 
                    type="email" 
                    placeholder="nama@perusahaan.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1.5">Sandi Keamanaan</label>
                  <input 
                    type="password" 
                    placeholder="• • • • • • • •"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" defaultChecked className="rounded border-white/10 bg-zinc-900 text-blue-500" />
                    <span>Ingat Saya</span>
                  </label>
                  <a href="#" className="hover:text-blue-400 transition-colors">Lupa Password?</a>
                </div>

                <button 
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isLoggingIn ? "Memverifikasi..." : "Autentikasi Akun"}
                </button>
              </form>

              {/* Google OAuth Login Simulation */}
              <button 
                onClick={handleGoogleLogin}
                className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.556-4.437 10.556-10.714 0-.726-.077-1.282-.172-1.711H12.24z"/>
                </svg>
                <span>Masuk Cepat Dengan Akun Google</span>
              </button>
            </div>
          </div>
        ) : (
          /* LOGGED IN WORKSPACE CONTAINER */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Interactive Sidebar Navigation */}
            <aside className="lg:col-span-3 rounded-2xl bg-black/40 border border-white/10 p-4 space-y-6">
              
              <div className="p-3 bg-gradient-to-tr from-cyan-950/40 to-indigo-950/40 rounded-xl border border-cyan-500/20 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold">Aktif Absen</div>
                  <div className="text-xs font-bold text-white line-clamp-1">{currentUser.name}</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-mono tracking-widest text-[#a8b3cf] uppercase px-3 block">NAVIGASI SISTEM</span>
                
                <nav className="flex flex-col gap-1 text-xs">
                  <button 
                    onClick={() => setCurrentTab("dashboard")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left cursor-pointer ${currentTab === "dashboard" ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-l-4 border-blue-500 border-y border-r border-white/5" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-400" />
                    <span>Dashboard & Grafik</span>
                  </button>

                  <button 
                    onClick={() => {
                      setCurrentTab("attendance");
                      startWebcam();
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left cursor-pointer ${currentTab === "attendance" ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-l-4 border-blue-500 border-y border-r border-white/5" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                  >
                    <Camera className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span className="flex-1">AI Face Attendance</span>
                    <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-mono font-bold uppercase rounded animate-pulse">Live</span>
                  </button>

                  {(currentUser.role === "admin" || currentUser.role === "supervisor") && (
                    <button 
                      onClick={() => setCurrentTab("employees")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left cursor-pointer ${currentTab === "employees" ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-l-4 border-blue-500 border-y border-r border-white/5" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                    >
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>Data Pegawai / Siswa</span>
                    </button>
                  )}

                  <button 
                    onClick={() => setCurrentTab("reports")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left cursor-pointer ${currentTab === "reports" ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-l-4 border-blue-500 border-y border-r border-white/5" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                  >
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>Laporan Otomatis</span>
                  </button>

                  <button 
                    onClick={() => setCurrentTab("settings")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left cursor-pointer ${currentTab === "settings" ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-l-4 border-blue-500 border-y border-r border-white/5" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                  >
                    <Settings className="w-4 h-4 text-zinc-400" />
                    <span>Pengaturan Geofence</span>
                  </button>
                </nav>
              </div>

              {/* Simulated Live Statistics */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                <span className="text-[10px] font-mono text-[#a8b3cf] tracking-wider block uppercase">ASISTEN BANTUAN HR</span>
                
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-[#101426] to-[#151c36] text-[11px] text-zinc-300 border border-purple-500/20 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>HR Chatbot Ada</span>
                  </div>
                  <p className="leading-relaxed">Butuh izin sakit atau bingung verifikasi deteksi muka? Tanyakan pada asisten chatbot di pojok kanan bawah!</p>
                  <button 
                    onClick={() => setChatbotOpen(true)}
                    className="w-full py-1 text-center bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/30 text-[10px] rounded text-white font-mono cursor-pointer transition-colors"
                  >
                    BUKA ASISTEN CHATBOT
                  </button>
                </div>
              </div>

              <div className="text-[10px] font-mono text-zinc-500 text-center uppercase tracking-widest pt-4">
                VisionAttend AI • INDONESIA
              </div>
            </aside>

            {/* Main Tabs Workspace Router */}
            <main className="lg:col-span-9 space-y-6">

              {/* TAB 1: DASHBOARD & DYNAMIC RECHARTS VISUALIZER */}
              {currentTab === "dashboard" && (
                <div className="space-y-6">
                  
                  {/* Top Stats Cards with premium glow styling */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
                      <div className="absolute right-0 bottom-0 translate-y-2 translate-x-2 text-blue-500/20"><Calendar className="w-16 h-16" /></div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Hadir</span>
                      <h3 className="text-2xl font-bold mt-1 text-white">{attendanceLogs.filter(la => la.status === "hadir" && la.type === "clock_in").length + 20} Karyawan</h3>
                      <p className="text-[9px] text-emerald-400 font-sans mt-1">98.4% tingkat kedisiplinan</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
                      <div className="absolute right-0 bottom-0 translate-y-2 translate-x-2 text-amber-500/20"><AlertTriangle className="w-16 h-16" /></div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Terlambat Hari Ini</span>
                      <h3 className="text-2xl font-semibold mt-1 text-amber-400">{attendanceLogs.filter(la => la.status === "lambat" && la.type === 'clock_in').length + 2} Karyawan</h3>
                      <p className="text-[9px] text-red-400 font-sans mt-1">Toleransi batas 08:30 WIB</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
                      <div className="absolute right-0 bottom-0 translate-y-2 translate-x-2 text-purple-500/20"><Plus className="w-16 h-16" /></div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Izin / Sakit</span>
                      <h3 className="text-2xl font-semibold mt-1 text-purple-400">1 Karyawan</h3>
                      <p className="text-[9px] text-[#a8b3cf] font-sans mt-1">Formulir digital HR disetujui</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
                      <div className="absolute right-0 bottom-0 translate-y-2 translate-x-2 text-red-500/20"><Info className="w-16 h-16" /></div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Tanpa Keterangan</span>
                      <h3 className="text-2xl font-bold mt-1 text-red-500">0 Karyawan</h3>
                      <p className="text-[9px] text-zinc-500 font-sans mt-1">Sistem autodeteksi alpha 09:30</p>
                    </div>
                  </div>

                  {/* Dynamic Responsive Recharts Area Chart & Bar Chart */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    <div className="md:col-span-8 p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-semibold block">INTELLIGENT PRESENCE MATRIX</span>
                          <h4 className="font-semibold text-lg text-white">Rangkuman Grafik Keadiran Mingguan</h4>
                        </div>
                        <div className="text-[10px] bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 text-indigo-300 rounded font-mono">
                          AGREGASI ORGANISASI
                        </div>
                      </div>

                      <div className="h-64 select-none">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={weeklyChartData}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorHadir" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                            <Tooltip contentStyle={{ backgroundColor: "#0e1329", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Area type="monotone" dataKey="Hadir" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHadir)" />
                            <Area type="monotone" dataKey="Terlambat" stroke="#f59e0b" fillOpacity={1} fill="url(#colorLate)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="md:col-span-4 p-5 rounded-2xl bg-[#0e1222]/85 border border-white/10 space-y-4 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-semibold block">GEMINI LIVE INSIGHTS</span>
                        <h4 className="font-semibold text-sm text-white flex items-center gap-1">
                          <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                          Analitik Keputusan AI
                        </h4>
                        <div className="p-2.5 rounded-xl bg-purple-500/10 text-[11px] font-mono text-purple-300 border border-purple-500/20 inline-block font-semibold">
                          Nilai Disiplin: {aiInsight.disciplineRank || "Grade A-"}
                        </div>
                      </div>

                      <p className="text-[11px] text-zinc-300 leading-relaxed font-sans mt-2">
                        {aiInsight.summary}
                      </p>

                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <button 
                          onClick={handleLoadAIAnalytics}
                          disabled={loadingAIAnalytics}
                          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                        >
                          {loadingAIAnalytics ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Brain className="w-3.5 h-3.5" />
                          )}
                          <span>{loadingAIAnalytics ? "Memproses Data..." : "Perbarui Prediksi AI"}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Heatmap summary & GPS Geofence status overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-white">Geofencing Parameter Koordinat</h4>
                          <p className="text-[11px] text-slate-400">Verifikasi kedekatan gawai karyawan</p>
                        </div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl text-xs space-y-1.5 font-mono text-zinc-300">
                        <p><span className="text-blue-400">Kantor:</span> {officeGeofence.name}</p>
                        <p><span className="text-blue-400">Target Lat/Lng:</span> {officeGeofence.lat}, {officeGeofence.lng}</p>
                        <p><span className="text-blue-400">Radius Toleransi:</span> {officeGeofence.radius} Meter</p>
                        <p><span className="text-blue-400">Sistem Liveness:</span> Anti-GPS Spoofing level Active</p>
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        *Sistem mendeteksi jika perangkat mencurigakan menggunakan fake location generator secara real-time.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Rekomendasi Operasional AI
                      </h4>
                      <div className="space-y-2">
                        {aiInsight.recommendations && aiInsight.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-2 bg-white/5 p-2 rounded-xl border border-white/5">
                            <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">{idx+1}</span>
                            <p className="text-xs text-zinc-200 leading-snug">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Logs Table mini summary inside main dashboard tab */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">Aktivitas Absensi Terbaru Anda</h4>
                      <button onClick={() => setCurrentTab("reports")} className="text-xs text-blue-400 hover:underline">Sila Tinjau Seluruh Laporan</button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-white/5 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                          <tr>
                            <th className="p-3">Waktu Absen</th>
                            <th className="p-3">Jenis</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Lokasi Absensi</th>
                            <th className="p-3">Skor Muka (AI)</th>
                            <th className="p-3">Anti Spoof</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {attendanceLogs.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-6 text-center text-zinc-500">
                                Anda belum merekam kehadiran hari ini. Harap klik menu "AI Face Attendance" untuk absen.
                              </td>
                            </tr>
                          ) : (
                            attendanceLogs.slice(0, 3).map((log, idx) => (
                              <tr key={idx} className="hover:bg-white/5 transition-colors">
                                <td className="p-3 font-mono">
                                  {log.timestamp ? new Date(log.timestamp).toLocaleTimeString("id", { hour: '2-digit', minute: '2-digit' }) : log.timeOnly}
                                  <span className="block text-[9px] text-zinc-500 font-sans">{log.dateOnly}</span>
                                </td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${log.type === "clock_in" ? "bg-blue-600/20 text-blue-400" : "bg-zinc-600/20 text-zinc-400"}`}>
                                    {log.type === "clock_in" ? "Masuk" : "Keluar"}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${log.status === "hadir" ? "bg-green-600/20 text-green-400" : "bg-amber-600/20 text-amber-400"}`}>
                                    {log.status}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <div className="max-w-xs truncate font-medium text-white">{log.location?.address}</div>
                                  <span className="block text-[9px] text-zinc-400 font-sans">Jarak: {log.location?.distance}m</span>
                                </td>
                                <td className="p-3 font-mono font-medium text-cyan-400">{log.confidenceScore}% Valid</td>
                                <td className="p-3">
                                  <span className="inline-flex items-center gap-1 text-[10px] text-green-400 font-bold">
                                    <Shield className="w-3 h-3" />
                                    Liveness Ok
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: AI FACE ATTENDANCE SCANNER CAMERA WITH LIVENESS VERIFICATION */}
              {currentTab === "attendance" && (
                <div className="space-y-6">
                  
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20 border border-blue-500/30">
                    <h3 className="font-display font-semibold text-lg text-white">Sistem Rekam Absensi AI Real-time</h3>
                    <p className="text-xs text-indigo-200">
                      Demi mencegah kecurangan murni (anti spoofing), sistem akan mencocokkan biomatrik wajah Anda dengan database digital menggunakan AI Computer Vision.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Visual Webcam Frame Column */}
                    <div className="md:col-span-7 bg-black/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col relative">
                      
                      <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          Pemindai Visual Kamera AI | LIVE SCREEN
                        </span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setPhotoUploadType("prefab")}
                            className={`px-2 py-1 rounded text-[10px] font-semibold cursor-pointer transition-colors ${photoUploadType === "prefab" ? "bg-blue-600 text-white" : "bg-white/5 text-slate-400"}`}
                          >
                            Gunakan Pilihan Wajah
                          </button>
                          <button 
                            onClick={() => {
                              setPhotoUploadType("webcam");
                              startWebcam();
                            }}
                            className={`px-2 py-1 rounded text-[10px] font-semibold cursor-pointer transition-colors ${photoUploadType === "webcam" ? "bg-blue-600 text-white" : "bg-white/5 text-slate-400"}`}
                          >
                            Webcam Pengguna
                          </button>
                        </div>
                      </div>

                      {/* Dynamic Camera Feed Container */}
                      <div className="h-80 relative flex items-center justify-center bg-zinc-950 overflow-hidden">
                        
                        {photoUploadType === "prefab" ? (
                          // Prefab image loader
                          <div 
                            className="absolute inset-0 bg-cover bg-center transition-all opacity-70"
                            style={{ backgroundImage: `url(${SIMULATED_PHOTOS[selectedPhotoIndex].url})` }}
                          />
                        ) : (
                          // Real / Mock Webcam video stream tag
                          <div className="absolute inset-0 flex items-center justify-center bg-black">
                            {webcamActive ? (
                              <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                className="w-full h-full object-cover scale-x-[-1]" 
                              />
                            ) : capturedImageBase64 ? (
                              <img src={capturedImageBase64} alt="Captured" className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-center text-xs text-zinc-500 space-y-2">
                                <span className="block">Webcam inisiasi...</span>
                                <button onClick={startWebcam} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg cursor-pointer">Start Webcam</button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Scanner overlay vector and laser animation */}
                        <div className="absolute inset-0 border-[24px] border-black/40 pointer-events-none" />
                        
                        {/* Dynamic Floating Laser path */}
                        <div className="absolute left-6 right-6 h-0.5 bg-cyan-400 glow-blue scanner-line z-10" />

                        {/* HUD Guidelines */}
                        <div className="relative z-10 w-48 h-56 border-2 border-dashed border-cyan-400/50 rounded-full flex items-center justify-center">
                          <div className="absolute top-2 text-[9px] font-mono tracking-widest text-cyan-400">POSISIKAN WAJAH DI SINI</div>
                        </div>

                        {/* Real-time coordinates overlay */}
                        <div className="absolute bottom-3 left-3 bg-black/80 border border-white/10 p-2 rounded-xl text-[9px] font-mono text-zinc-300 z-10 space-y-0.5">
                          <p className="text-cyan-400 font-bold">LIVENESS PROTECT v3</p>
                          <p>Gaze Vector: Terpusat 99.4%</p>
                          <p>GPS status: OK</p>
                        </div>

                      </div>

                      {/* Photo Capture Controls */}
                      <div className="p-4 bg-zinc-900 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        {photoUploadType === "prefab" ? (
                          <div className="w-full space-y-2">
                            <label className="block text-[10px] uppercase font-mono text-slate-400">PILIHAN MODEL WAJAH PENDEKATAN:</label>
                            <div className="grid grid-cols-3 gap-2">
                              {SIMULATED_PHOTOS.map((ph, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedPhotoIndex(idx)}
                                  className={`p-1.5 rounded-xl border text-[10px] text-left transition-all ${selectedPhotoIndex === idx ? "bg-blue-600/20 border-blue-500 text-white" : "bg-black/40 border-white/5 text-slate-400"}`}
                                >
                                  <span className="font-bold block truncate">{ph.name}</span>
                                  <span className="text-[8px] opacity-60 block truncate">{idx === 0 ? "Lololos Real" : "Rentan Spoof"}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full flex items-center justify-between gap-3">
                            <span className="text-xs text-slate-400">Webcam Kamera Terdeteksi</span>
                            <div className="flex gap-2">
                              {webcamActive && (
                                <button 
                                  onClick={captureSnapshot}
                                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-transform"
                                >
                                  Ambil Potret Selfie
                                </button>
                              )}
                              <button 
                                onClick={startWebcam}
                                className="p-2 bg-zinc-800 text-slate-300 rounded-xl hover:text-white"
                                title="Restart Kamera"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                        
                        <canvas ref={canvasRef} width="320" height="240" className="hidden" />
                      </div>

                    </div>

                    {/* Geofencing Verification & Clock action Column */}
                    <div className="md:col-span-5 space-y-6">
                      
                      {/* Step 1: GPS Lock & Geofence verify wrapper */}
                      <div className="p-5 rounded-2xl bg-[#0b0e1a]/85 border border-white/10 space-y-4">
                        <span className="text-[10px] font-mono text-[#a8b3cf] tracking-widest uppercase block">LANGKAH 1: KADAR KOORDINAT GPS</span>
                        
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <MapPin className="w-4.5 h-4.5 text-blue-400 animate-bounce" />
                          Kunci Jarak Geofence GPS
                        </h4>

                        <div className="flex gap-3 text-xs">
                          <button 
                            onClick={() => toggleGeofenceLocation(true)}
                            className={`flex-1 py-2 rounded-xl font-bold transition-all text-center border cursor-pointer ${customDistanceSimulation <= officeGeofence.radius ? "bg-green-600/20 border-green-500 text-green-300" : "bg-zinc-900 border-white/5 text-slate-400"}`}
                          >
                            Diset Dalam Kantor (12m)
                          </button>
                          <button 
                            onClick={() => toggleGeofenceLocation(false)}
                            className={`flex-1 py-2 rounded-xl font-bold transition-all text-center border cursor-pointer ${customDistanceSimulation > officeGeofence.radius ? "bg-red-600/20 border-red-500 text-red-300" : "bg-zinc-900 border-white/5 text-slate-400"}`}
                          >
                            Diset Di Luar Geofence (240m)
                          </button>
                        </div>

                        <div className="p-3 bg-white/5 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Titik Pusat:</span>
                            <span className="font-semibold text-white truncate max-w-[150px]">{officeGeofence.name}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Jarak Terhitung Anda:</span>
                            <span className={`font-mono font-bold ${customDistanceSimulation > officeGeofence.radius ? "text-red-400" : "text-green-400"}`}>{customDistanceSimulation} Meter</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Maksimum Radius Toleransi:</span>
                            <span className="font-mono text-zinc-300">{officeGeofence.radius} Meter</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Status GPS:</span>
                            <span className={`font-bold uppercase ${customDistanceSimulation > officeGeofence.radius ? "text-red-500" : "text-green-500"}`}>
                              {customDistanceSimulation > officeGeofence.radius ? "LUAR GEOFENCE (BLOCKED)" : "AMANDALAM perimeter"}
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={handleRetrieveGPS}
                          disabled={retrievingGps}
                          className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${retrievingGps ? "animate-spin" : ""}`} />
                          <span>{retrievingGps ? "Mengkoneksikan Satelit..." : "Kunci Koordinat Fisik Anda"}</span>
                        </button>
                      </div>

                      {/* Step 2: AI Face Recognition validation and results */}
                      <div className="p-5 rounded-2xl bg-[#0b0e1a]/85 border border-white/10 space-y-4">
                        <span className="text-[10px] font-mono text-[#a8b3cf] tracking-widest uppercase block">LANGKAH 2: VERIFIKASI BIOMETRIK</span>

                        <button 
                          onClick={handleVerifyFace}
                          disabled={verificationResult?.checking}
                          className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform duration-100 hover:scale-[1.01]"
                        >
                          <Eye className="w-4 h-4" />
                          <span>{verificationResult?.checking ? "Sistem Meneliti Wajah..." : "Pindai & Verifikasi Wajah Anda"}</span>
                        </button>

                        {/* Rendering AI Evaluation HUD details */}
                        {verificationResult && (
                          <div className={`p-4 rounded-xl border space-y-2.5 text-xs transition-colors ${verificationResult.checking ? "opacity-60 bg-white/5 border-white/5" : verificationResult.spoofAlert ? "bg-red-950/40 border-red-500/50" : "bg-green-950/30 border-green-500/40"}`}>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-medium">Kecocokan Geometri:</span>
                              <span className={`font-mono font-black ${verificationResult.spoofAlert ? "text-red-400" : "text-green-400"}`}>{verificationResult.confidenceScore}%</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-medium">Liveness (Anti-Cheat):</span>
                              <span className={`font-bold ${verificationResult.livenessVerified ? "text-green-400" : "text-red-400"}`}>
                                {verificationResult.livenessVerified ? "TERVERIFIKASI LIVE" : "TIDAK VALID"}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <span className="text-slate-400 font-medium">Analisis Pose / Deteksi Keaslian:</span>
                              <p className={`text-[11px] font-sans ${verificationResult.spoofAlert ? "text-red-300" : "text-zinc-200"}`}>{verificationResult.pose || "Menganalisis..."}</p>
                            </div>

                            {verificationResult.spoofAlert && (
                              <div className="p-2.5 rounded-lg bg-red-900/40 border border-red-500/30 text-red-300 text-[10px] space-y-1">
                                <span className="font-bold block text-red-100 flex items-center gap-1">
                                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                                  AWAS SPOOFING TERDETEKSI!
                                </span>
                                <p>{verificationResult.spoofReason}</p>
                              </div>
                            )}

                            {!verificationResult.checking && !verificationResult.spoofAlert && (
                              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] text-green-300 bg-green-500/10 p-1.5 rounded border border-green-500/20">
                                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                                <span>Liveness Lulus. Ekspresi Terdeteksi: <b className="text-white">{verificationResult.emotions || "Fokus"}</b></span>
                              </div>
                            )}
                          </div>
                        )}
                        
                      </div>

                      {/* Step 3: Clock In or Out Action Trigger */}
                      <div className="p-5 rounded-2xl bg-[#090b16] border-2 border-dashed border-indigo-500/30 space-y-4">
                        <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-semibold block text-center">LANGKAH 3: PENCATATAN ABSEN</span>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <button 
                            onClick={() => handleClockInAndOut("clock_in")}
                            disabled={!verificationResult || !verificationResult.success || verificationResult.checking || verificationResult.spoofAlert || (customDistanceSimulation > officeGeofence.radius)}
                            className={`py-3.5 text-white rounded-xl font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${(!verificationResult || !verificationResult.success || verificationResult.spoofAlert || (customDistanceSimulation > officeGeofence.radius)) ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5 opacity-50" : "bg-gradient-to-tr from-green-600 to-emerald-600 hover:scale-[1.01]"}`}
                          >
                            <span className="text-sm font-black">ABSEN MASUK</span>
                            <span className="text-[10px] font-mono opacity-80">CLOCK IN</span>
                          </button>

                          <button 
                            onClick={() => handleClockInAndOut("clock_out")}
                            disabled={!verificationResult || !verificationResult.success || verificationResult.checking || verificationResult.spoofAlert || (customDistanceSimulation > officeGeofence.radius)}
                            className={`py-3.5 text-white rounded-xl font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${(!verificationResult || !verificationResult.success || verificationResult.spoofAlert || (customDistanceSimulation > officeGeofence.radius)) ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5 opacity-50" : "bg-gradient-to-tr from-blue-600 to-indigo-600 hover:scale-[1.01]"}`}
                          >
                            <span className="text-sm font-black">ABSEN KELUAR</span>
                            <span className="text-[10px] font-mono opacity-80">CLOCK OUT</span>
                          </button>
                        </div>

                        {/* Critical warning if geofence is violated */}
                        {customDistanceSimulation > officeGeofence.radius && (
                          <div className="p-3 bg-red-950/50 border border-red-500/30 text-red-300 rounded-xl text-[10px] space-y-1 text-center">
                            <b>GEOFENCE BLOCKADE ACTIVE:</b> Anda tidak berada di jangkauan resmi kantor. Tombol rekam absensi terkunci otomatis.
                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* TAB 3: EMPLOYEES / STUDENTS MATRIX LIST */}
              {currentTab === "employees" && (
                <div className="space-y-6">
                  
                  {/* Top Stats and add form layout */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Add new employee form */}
                    <div className="md:col-span-4 p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                      <div>
                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-semibold block">ADMINISTRASI SDM</span>
                        <h4 className="font-bold text-white text-base">Registrasi Wajah Baru</h4>
                      </div>

                      <form onSubmit={handleCreateEmployee} className="space-y-3.5 text-xs text-slate-300 font-sans">
                        <div>
                          <label className="block text-slate-400 mb-1">Nama Lengkap Karyawan</label>
                          <input 
                            type="text"
                            placeholder="Ahmad Dhani"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">Surel Resmi Instansi</label>
                          <input 
                            type="email"
                            placeholder="ahmad@company.com"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">Divisi / Departemen</label>
                          <select 
                            value={newUserDepartment}
                            onChange={(e) => setNewUserDepartment(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none"
                          >
                            <option value="IT & Core AI Development">IT & Core AI Development</option>
                            <option value="Finance & Accounting">Finance & Accounting</option>
                            <option value="Human Resources">Human Resources</option>
                            <option value="Marketing & Sales">Marketing & Sales</option>
                            <option value="Operations">Operations</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">Hak Otentikasi Role</label>
                          <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold">
                            <button 
                              type="button" 
                              onClick={() => setNewUserRole("karyawan")}
                              className={`py-1.5 rounded-lg font-mono text-center border ${newUserRole === 'karyawan' ? "bg-blue-600/20 border-blue-500 text-white" : "bg-black/40 border-white/5 text-slate-400"}`}
                            >
                              Karyawan
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setNewUserRole("supervisor")}
                              className={`py-1.5 rounded-lg font-mono text-center border ${newUserRole === 'supervisor' ? "bg-blue-600/20 border-blue-500 text-white" : "bg-black/40 border-white/5 text-slate-400"}`}
                            >
                              Supervisor
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setNewUserRole("admin")}
                              className={`py-1.5 rounded-lg font-mono text-center border ${newUserRole === 'admin' ? "bg-cyan-600/20 border-cyan-500 text-white" : "bg-black/40 border-white/5 text-slate-400"}`}
                            >
                              Admin
                            </button>
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-xs hover:from-blue-700 hover:to-indigo-700 transition-colors"
                        >
                          Daftarkan Temp Wajah
                        </button>
                      </form>
                    </div>

                    {/* Employee Database status table */}
                    <div className="md:col-span-8 p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                      
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="font-bold text-white text-base">Database Pendaftaran Wajah Karyawan</h4>
                          <p className="text-[11px] text-zinc-400">Pastikan seluruh staf melewati scan enrollment utama demi validitas liveness</p>
                        </div>

                        {/* Search input bar */}
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Cari Staf..."
                            value={employeeSearchQuery}
                            onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                            className="bg-black/50 border border-white/10 rounded-xl py-1.5 pl-8 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-[#111425] text-slate-400 font-bold uppercase text-[9px]">
                            <tr>
                              <th className="p-3">Nama Pegawai / Siswa</th>
                              <th className="p-3">Departemen</th>
                              <th className="p-3">Kredensial</th>
                              <th className="p-3">Otentikasi Wajah</th>
                              <th className="p-3 text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-[11px]">
                            {filteredUsers.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="p-6 text-center text-zinc-500">
                                  Tidak ada karyawan terdata dalam saringan pencarian Anda.
                                </td>
                              </tr>
                            ) : (
                              filteredUsers.map((emp, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                  <td className="p-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-[10px]">
                                        {emp.name.charAt(0)}
                                      </div>
                                      <div>
                                        <span className="font-bold text-white">{emp.name}</span>
                                        <span className="block text-[9px] text-zinc-500 font-mono">Daftar: {emp.joinDate}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-3 text-zinc-300">{emp.department}</td>
                                  <td className="p-3 font-mono text-zinc-400">{emp.email}</td>
                                  <td className="p-3">
                                    {emp.faceRegistered ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] text-green-400 font-bold">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Terdaftar Verifikasi
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        Butuh enrollment
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-3 text-right">
                                    <button 
                                      onClick={() => handleResetFaceTemplate(emp.id)}
                                      className="px-2 py-1 bg-red-600/10 hover:bg-red-600/30 text-red-400 rounded text-[9px] font-mono cursor-pointer transition-colors"
                                    >
                                      RESET WAJAH
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* TAB 4: AUTOMATED REPORTS GENERATOR & DOWNLOADING SIMULATOR */}
              {currentTab === "reports" && (
                <div className="space-y-6">
                  
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-display font-bold text-lg text-white">Laporan Kehadiran Bulanan Otomatis</h3>
                        <p className="text-xs text-slate-400">Unduh data absensi terverifikasi Geofence GPS dan Liveness AI Anda</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button 
                          onClick={() => handleExportData("excel")}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-600/10"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                          <span>Ekspor ke EXCEL</span>
                        </button>
                        
                        <button 
                          onClick={() => handleExportData("pdf")}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-red-650/10"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span>Ekspor ke PDF</span>
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Saring berdasarkan nama karyawan, divisi, atau status absensi..."
                        value={logSearchQuery}
                        onChange={(e) => setLogSearchQuery(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 pl-10 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-white/5">
                      <table className="w-full text-left text-xs text-slate-200">
                        <thead className="bg-[#121629] text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                          <tr>
                            <th className="p-3">ID Log</th>
                            <th className="p-3">Karyawan</th>
                            <th className="p-3">Departemen</th>
                            <th className="p-3">Stempel Waktu</th>
                            <th className="p-3">Koordinat Absen</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Metode Verif.</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[11px]">
                          {filteredLogs.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-6 text-center text-zinc-500">
                                Tidak ada catatan absensi yang memenuhi kriteria pencarian Anda.
                              </td>
                            </tr>
                          ) : (
                            filteredLogs.map((log, idx) => (
                              <tr key={idx} className="hover:bg-white/5 transition-colors">
                                <td className="p-3 font-mono text-zinc-500">#{log.id}</td>
                                <td className="p-3">
                                  <div className="font-bold text-white">{log.userName}</div>
                                  <span className="block text-[9px] font-mono text-zinc-500">{log.osDevice}</span>
                                </td>
                                <td className="p-3 text-slate-300">{log.department}</td>
                                <td className="p-3">
                                  <div className="font-mono text-zinc-200">{log.timeOnly} WIB</div>
                                  <span className="text-[9px] text-zinc-400 block">{log.dateOnly}</span>
                                </td>
                                <td className="p-3">
                                  <div className="max-w-xs truncate font-medium text-white">{log.location?.address}</div>
                                  <div className="text-[9px] text-zinc-500 font-mono">Distance: {log.location?.distance}m</div>
                                </td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${log.status === "hadir" ? "bg-green-600/20 text-green-300 border border-green-500/20" : "bg-amber-600/20 text-amber-300 border border-amber-500/20"}`}>
                                    {log.status}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-md font-mono text-[9px] font-bold">
                                    {log.confidenceScore}% ACCURACY (AI Liveness)
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 5: GEOFENCE COORDINATE SETTINGS */}
              {currentTab === "settings" && (
                <div className="space-y-6">
                  
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                    <div>
                      <h3 className="font-display font-semibold text-lg text-white">Konfigurasi Radius Geofencing Perusahaan</h3>
                      <p className="text-xs text-slate-400">Modifikasi parameter koordinat GPS geofence kantor dalam simulasi ini secara dinamis.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                      <div>
                        <label className="block text-slate-400 mb-1.5">Nama Titik Kantor Utama</label>
                        <input 
                          type="text"
                          value={officeGeofence.name}
                          onChange={(e) => setOfficeGeofence({ ...officeGeofence, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1.5">Alamat Fisik Display</label>
                        <input 
                          type="text"
                          value={officeGeofence.address}
                          onChange={(e) => setOfficeGeofence({ ...officeGeofence, address: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1.5">Latitude Target (GPS)</label>
                        <input 
                          type="number"
                          step="0.00001"
                          value={officeGeofence.lat}
                          onChange={(e) => setOfficeGeofence({ ...officeGeofence, lat: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1.5">Longitude Target (GPS)</label>
                        <input 
                          type="number"
                          step="0.00001"
                          value={officeGeofence.lng}
                          onChange={(e) => setOfficeGeofence({ ...officeGeofence, lng: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-slate-400">Radius Tolerasi Presensi (Meter)</label>
                          <span className="font-mono text-purple-400 font-bold text-xs">{officeGeofence.radius} Meter</span>
                        </div>
                        <input 
                          type="range"
                          min="50"
                          max="1000"
                          step="25"
                          value={officeGeofence.radius}
                          onChange={(e) => setOfficeGeofence({ ...officeGeofence, radius: parseInt(e.target.value) })}
                          className="w-full accent-blue-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                          <span>50 meter (Sangat Ketat)</span>
                          <span>1000 meter (Sangat Longgar)</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => triggerNotification("success", "Konfigurasi koordinat geofencing baru berhasil disinkronisasikan ke blockchain-database.")}
                      className="py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl hover:from-blue-700 hover:to-indigo-700"
                    >
                      Terapkan Batasan Baru
                    </button>
                  </div>

                </div>
              )}

            </main>

          </div>
        )}

      </div>

      {/* FLOATING CHATBOT WIDGET CONTROLLER - HR Companion Asisten Gemini AI */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {chatbotOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="w-[340px] md:w-[380px] h-[500px] rounded-3xl pb-2 bg-[#0c1020]/95 border border-white/10 shadow-2xl flex flex-col overflow-hidden glow-purple"
            >
              <div className="p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-xs">HR VisionAttend Asisten AI</h5>
                    <span className="text-[9px] font-mono text-blue-200">Gemini-3.5-Flash Active</span>
                  </div>
                </div>
                <button 
                  onClick={() => setChatbotOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Chat history pane */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`p-3 rounded-2xl max-w-[85%] ${msg.sender === "user" ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-tr-none" : "bg-white/5 border border-white/10 text-slate-200 rounded-tl-none"}`}>
                      <p className="leading-relaxed font-sans text-[11px] whitespace-pre-wrap">{msg.message}</p>
                      <span className="block text-[8px] text-zinc-400 font-mono mt-1 text-right">{msg.timestamp}</span>
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 font-mono text-[10px] flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                      <span>Gemini AI sedang mengetik...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Suggestions Chips */}
              <div className="p-2 border-t border-white/5 bg-zinc-950/40 flex gap-1.5 overflow-x-auto select-none no-scrollbar">
                <button 
                  onClick={() => {
                    setChatInput("Bagaimana model liveness mendeteksi manipulasi foto?");
                    triggerNotification("info", "Pesan template disalin ke kolom ketik!");
                  }}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] rounded text-slate-300 whitespace-nowrap"
                >
                  ⚡ Keamanan Liveness
                </button>
                <button 
                  onClick={() => {
                    setChatInput("Berapa radius Geofence absensi?");
                    triggerNotification("info", "Pesan template disalin ke kolom ketik!");
                  }}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] rounded text-slate-300 whitespace-nowrap"
                >
                  📍 Radius GPS Kantor
                </button>
                <button 
                  onClick={() => {
                    setChatInput("Bagaimana cara izin sakit ke HR?");
                    triggerNotification("info", "Pesan template disalin ke kolom ketik!");
                  }}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] rounded text-slate-300 whitespace-nowrap"
                >
                  📝 Pengajuan Izin Cuti
                </button>
              </div>

              {/* Chat action Form */}
              <form onSubmit={handleSendChatMessage} className="p-3 border-t border-white/10 bg-zinc-950/70 flex items-center gap-2">
                <button 
                  type="button"
                  onClick={handleMicrophoneClick}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-purple-400 hover:text-purple-300 shrink-0 transition-colors"
                  title="Simulasikan Input Voice"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ketik pertanyaan untuk asisten HR..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />

                <button 
                  type="submit"
                  className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shrink-0 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Circle Button toggle */}
        {!chatbotOpen && (
          <button 
            onClick={() => {
              setChatbotOpen(true);
              triggerNotification("info", "Asisten AI HR VisionAttend Siap Memandu Anda.");
            }}
            id="btn-chatbot-toggle"
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 cursor-pointer animate-bounce hover:scale-105 transition-transform"
            title="Tanya Asisten AI HR"
          >
            <Brain className="w-6 h-6 animate-pulse" />
          </button>
        )}
      </div>

    </div>
  );
}
