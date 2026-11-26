"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { patients, initialQueues, initialExaminations } from "./data";
import type { Queue, Patient, Examination, ExaminationInput } from "./types";

type Result = { ok: true } | { ok: false; error: string };
type DoctorContextValue = {
  patients: Patient[];
  queues: Queue[];
  examinations: Examination[];
  startExamination: (id: string) => Result;
  saveExamination: (id: string, input: ExaminationInput) => Result;
};
const DoctorContext = createContext<DoctorContextValue | null>(null);
export function DoctorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({ queues: initialQueues, examinations: initialExaminations });
  function startExamination(id: string): Result {
    const queue = state.queues.find(q => q.id === id);
    if (!queue || !["Menunggu", "Dipanggil"].includes(queue.status)) return { ok: false, error: "Antrean tidak dapat dimulai." };
    if (state.queues.some(q => q.status === "Dalam Pemeriksaan")) return { ok: false, error: "Selesaikan pemeriksaan aktif terlebih dahulu." };
    setState(prev => ({ ...prev, queues: prev.queues.map(q => q.id === id ? { ...q, status: "Dalam Pemeriksaan" } : q) }));
    return { ok: true };
  }
  function saveExamination(id: string, input: ExaminationInput): Result {
    const queue = state.queues.find(q => q.id === id);
    if (!queue || queue.status !== "Dalam Pemeriksaan") return { ok: false, error: "Pemeriksaan belum dimulai atau sudah selesai." };
    if (state.examinations.some(e => e.queueId === id)) return { ok: false, error: "Hasil pemeriksaan sudah tersimpan." };
    if (![input.complaint, input.findings, input.diagnosis, input.treatment].every(v => v.trim())) return { ok: false, error: "Lengkapi keluhan, hasil pemeriksaan, diagnosis, dan tindakan." };
    const record: Examination = {
      complaint: input.complaint.trim(), findings: input.findings.trim(), diagnosis: input.diagnosis.trim(), treatment: input.treatment.trim(), notes: input.notes.trim(),
      id: `exam-${id}`, queueId: id, patientId: queue.patientId, examinedAt: new Date().toISOString(),
    };
    setState(prev => ({
      queues: prev.queues.map(q => q.id === id ? { ...q, status: "Selesai" } : q),
      examinations: prev.examinations.some(e => e.queueId === id) ? prev.examinations : [record, ...prev.examinations],
    }));
    return { ok: true };
  }
  return <DoctorContext.Provider value={{ patients, ...state, startExamination, saveExamination }}>{children}</DoctorContext.Provider>;
}
export function useDoctor() {
  const context = useContext(DoctorContext);
  if (!context) throw new Error("useDoctor harus berada dalam DoctorProvider");
  return context;
}
