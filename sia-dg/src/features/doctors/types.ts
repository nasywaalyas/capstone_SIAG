export type QueueStatus = "Menunggu" | "Dipanggil" | "Dalam Pemeriksaan" | "Selesai" | "Batal";
export interface Patient {
  id: string;
  medicalNumber: string;
  name: string;
  birthDate: string;
  gender: string;
}
export interface Queue {
  id: string;
  patientId: string;
  number: string;
  time: string;
  status: QueueStatus;
}
export interface ExaminationInput {
  complaint: string;
  findings: string;
  diagnosis: string;
  treatment: string;
  notes: string;
}
export interface Examination extends ExaminationInput {
  id: string;
  queueId: string;
  patientId: string;
  examinedAt: string;
}
