"use client";
import { useState } from "react";
import { useDoctor } from "@/features/doctors/DoctorProvider";
import { PageHeading, Panel, field, formatDate } from "@/features/doctors/ui";
export default function PatientsPage() {
  const { patients, examinations } = useDoctor();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = patients.filter(p => `${p.name} ${p.medicalNumber}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <><PageHeading title="Data Pasien" description="Lihat identitas dan riwayat pemeriksaan pasien."/><Panel>
    <label className="mb-4 block max-w-md text-sm font-medium">Cari pasien<input className={`${field} mt-1`} placeholder="Nama atau nomor rekam medis" value={search} onChange={e => setSearch(e.target.value)}/></label>
    <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr>{["No. RM", "Nama", "Tanggal lahir", "Jenis kelamin", "Aksi"].map(h => <th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead><tbody>{filtered.map(p => <tr key={p.id} className="border-b border-slate-100"><td className="p-3 font-medium">{p.medicalNumber}</td><td className="p-3">{p.name}</td><td className="p-3">{formatDate(p.birthDate)}</td><td className="p-3">{p.gender}</td><td className="p-3"><button className="font-semibold text-teal-700" onClick={() => setSelected(selected === p.id ? null : p.id)}>{selected === p.id ? "Tutup" : "Lihat riwayat"}</button></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="p-6 text-center text-sm text-slate-500">Pasien tidak ditemukan.</p>}</div>
  </Panel>{selected && <div className="mt-6"><Panel><h2 className="mb-4 font-semibold">Riwayat: {patients.find(p => p.id === selected)?.name}</h2>{examinations.filter(e => e.patientId === selected).map(e => <article key={e.id} className="mb-3 rounded-lg border border-slate-200 p-4 text-sm"><p className="mb-2 font-semibold text-teal-800">{formatDate(e.examinedAt)}</p><p><strong>Keluhan:</strong> {e.complaint}</p><p><strong>Hasil pemeriksaan:</strong> {e.findings}</p><p><strong>Diagnosis:</strong> {e.diagnosis}</p><p><strong>Tindakan:</strong> {e.treatment}</p><p><strong>Catatan:</strong> {e.notes || "-"}</p></article>)}{!examinations.some(e => e.patientId === selected) && <p className="text-sm text-slate-500">Belum ada riwayat pemeriksaan.</p>}</Panel></div>}</>;
}
