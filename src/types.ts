/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'karyawan' | 'supervisor';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department: string;
    joinDate: string;
    photoUrl?: string;
    faceRegistered: boolean;
}

export interface AttendanceRecord {
    id: string;
    userId: string;
    userName: string;
    department: string;
    timestamp: string; // ISO string
    timeOnly: string; // HH:mm:ss
    dateOnly: string; // YYYY-MM-DD
    type: 'clock_in' | 'clock_out';
    status: 'hadir' | 'lambat' | 'izin' | 'alpha';
    location: {
        lat: number;
        lng: number;
        address: string;
        distance: number; // distance in meters from office center
    };
    confidenceScore: number; // confidence score of facial recognition (0 - 100)
    livenessVerified: boolean; // anti-spoof liveness check
    selfieUrl: string; // base64 payload or representation
    osDevice: string;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'bot';
    message: string;
    timestamp: string;
}

export interface OfficeGeofence {
    lat: number;
    lng: number;
    radius: number; // in meters
    address: string;
    name: string;
}

export interface AIInsightResponse {
    summary: string;
    stats: {
        hadirPercent: number;
        lambatCount: number;
        izinCount: number;
        alphaCount: number;
        lateProbability: string;
        peakArrivalHours: string;
    };
    recommendations: string[];
}
