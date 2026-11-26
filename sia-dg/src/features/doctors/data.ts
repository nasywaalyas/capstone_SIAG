import type { Patient, Queue, Examination } from "./types";

// Semua data berikut fiktif untuk pengujian UI.
export const patients: Patient[] = [
  { id: "p1", medicalNumber: "RM-001", name: "Andi Saputra", birthDate: "2000-05-15", gender: "Laki-laki" },
  { id: "p2", medicalNumber: "RM-002", name: "Dewi Lestari", birthDate: "1999-08-20", gender: "Perempuan" },
  { id: "p3", medicalNumber: "RM-003", name: "Budi Santoso", birthDate: "2001-03-11", gender: "Laki-laki" },
];
export const initialQueues: Queue[] = [
  { id: "q1", patientId: "p1", number: "A-001", time: "08:00", status: "Dipanggil" },
  { id: "q2", patientId: "p2", number: "A-002", time: "08:30", status: "Menunggu" },
  { id: "q3", patientId: "p3", number: "A-003", time: "09:00", status: "Selesai" },
];
export const initialExaminations: Examination[] = [
  { id: "e1", queueId: "q3", patientId: "p3", examinedAt: "2026-11-18T02:00:00.000Z", complaint: "Contoh keluhan", findings: "Contoh hasil pemeriksaan", diagnosis: "Contoh diagnosis", treatment: "Contoh tindakan", notes: "Data simulasi" },
];
