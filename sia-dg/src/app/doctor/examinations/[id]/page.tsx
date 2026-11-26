"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useDoctor } from "@/features/doctors/DoctorProvider";
import { PageHeading, Panel, field, primary, formatDate } from "@/features/doctors/ui";
import type { ExaminationInput } from "@/features/doctors/types";
const fields: { key: keyof ExaminationInput; label: string; required: boolean; placeholder: string }[] = [
  { key: "complaint", label: "Keluhan pasien", required: true, placeholder: "Tuliskan keluhan pasien" },
  { key: "findings", label: "Hasil pemeriksaan", required: true, placeholder: "Tuliskan temuan pemeriksaan" },
  { key: "diagnosis", label: "Diagnosis", required: true, placeholder: "Tuliskan diagnosis dokter" },
  { key: "treatment", label: "Tindakan", required: true, placeholder: "Tuliskan tindakan yang dilakukan" },
  { key: "notes", label: "Catatan tambahan", required: false, placeholder: "Catatan tambahan bila diperlukan" },
];
export default function ExaminationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { queues, patients, examinations, saveExamination } = useDoctor();
  const [input, setInput] = useState<ExaminationInput>({ complaint: "", findings: "", diagnosis: "", treatment: "", notes: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const queue = queues.find(q => q.id === id);
  const patient = patients.find(p => p.id === queue?.patientId);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    const result = saveExamination(id, input);
    if (result.ok) router.push("/doctor/history");
    else { setError(result.error); setSaving(false); }
  }
  if (!queue || !patient || (queue.status !== "Dalam Pemeriksaan" && !saving)) return <><PageHeading title="Pemeriksaan" description="Pemeriksaan tidak tersedia atau tidak aktif."/><Link href="/doctor/queues" className={primary}>Kembali ke antrean</Link></>;
  return <><PageHeading title="Pemeriksaan Pasien" description="Catat hasil pemeriksaan, diagnosis, dan tindakan pasien."/>
    <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
      <div className="space-y-5"><Panel><h2 className="mb-4 font-semibold">Identitas pasien</h2><dl className="space-y-3 text-sm">{[["Nomor antrean", queue.number], ["Nomor rekam medis", patient.medicalNumber], ["Nama pasien", patient.name], ["Tanggal lahir", formatDate(patient.birthDate)], ["Jenis kelamin", patient.gender]].map(([k,v]) => <div key={k}><dt className="text-slate-500">{k}</dt><dd className="font-medium">{v}</dd></div>)}</dl></Panel><Panel><h2 className="mb-3 font-semibold">Riwayat sebelumnya</h2>{examinations.filter(e => e.patientId === patient.id).map(e => <div key={e.id} className="mb-3 border-b border-slate-100 pb-3 text-sm"><p className="font-medium text-teal-700">{formatDate(e.examinedAt)}</p><p>Keluhan: {e.complaint}</p><p>Hasil: {e.findings}</p><p>Diagnosis: {e.diagnosis}</p><p>Tindakan: {e.treatment}</p><p>Catatan: {e.notes || "-"}</p></div>)}{!examinations.some(e => e.patientId === patient.id) && <p className="text-sm text-slate-500">Belum ada riwayat.</p>}</Panel></div>
      <Panel><form onSubmit={submit} className="space-y-4">{fields.map(f => <label key={f.key} className="block text-sm font-medium">{f.label}{f.required && <span className="text-red-600"> *</span>}<textarea rows={3} className={`${field} mt-1 resize-y`} required={f.required} placeholder={f.placeholder} value={input[f.key]} onChange={e => setInput(prev => ({ ...prev, [f.key]: e.target.value }))}/></label>)}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <p className="text-xs text-slate-500">Simpan untuk menambahkan riwayat pasien dan menyelesaikan antrean.</p>
        <div className="flex flex-wrap justify-end gap-3"><Link href="/doctor/queues" className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Kembali</Link><button type="submit" className={primary} disabled={saving}>{saving ? "Menyimpan..." : "Simpan Pemeriksaan"}</button></div>
      </form></Panel>
    </div></>;
}
