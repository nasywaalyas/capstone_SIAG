"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDoctor } from "@/features/doctors/DoctorProvider";
import { PageHeading, Panel, Status, primary, field } from "@/features/doctors/ui";
export default function QueuesPage() {
  const { queues, patients, startExamination } = useDoctor();
  const [filter, setFilter] = useState("Semua");
  const [error, setError] = useState("");
  const router = useRouter();
  const active = queues.some(q => q.status === "Dalam Pemeriksaan");
  const filtered = queues.filter(q => filter === "Semua" || q.status === filter);
  function start(id: string) {
    const result = startExamination(id);
    if (result.ok) router.push(`/doctor/examinations/${id}`);
    else setError(result.error);
  }
  return <><PageHeading title="Antrean Pasien" description="Lihat status antrean dan mulai pemeriksaan pasien."/><Panel>
    <label className="mb-4 block max-w-xs text-sm font-medium">Status antrean<select className={`${field} mt-1`} value={filter} onChange={e => setFilter(e.target.value)}>{["Semua", "Menunggu", "Dipanggil", "Dalam Pemeriksaan", "Selesai", "Batal"].map(s => <option key={s}>{s}</option>)}</select></label>
    {active && <p className="mb-4 text-sm text-slate-600">Hanya satu pemeriksaan dapat berlangsung pada satu waktu.</p>}
    {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
    <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr>{["No. antrean", "Nama pasien", "Waktu", "Status", "Aksi"].map(h => <th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead><tbody>{filtered.map(q => <tr key={q.id} className="border-b border-slate-100"><td className="p-3 font-medium">{q.number}</td><td className="p-3">{patients.find(p => p.id === q.patientId)?.name ?? "-"}</td><td className="p-3">{q.time}</td><td className="p-3"><Status status={q.status}/></td><td className="p-3">{q.status === "Dalam Pemeriksaan" ? <Link className={primary} href={`/doctor/examinations/${q.id}`}>Lanjutkan</Link> : q.status === "Menunggu" || q.status === "Dipanggil" ? <button className={primary} disabled={active} onClick={() => start(q.id)}>Periksa</button> : <span className="text-slate-400">—</span>}</td></tr>)}</tbody></table>{filtered.length === 0 && <p className="p-6 text-center text-sm text-slate-500">Tidak ada antrean.</p>}</div>
  </Panel></>;
}
