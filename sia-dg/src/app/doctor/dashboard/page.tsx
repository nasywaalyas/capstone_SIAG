"use client";
import Link from "next/link";
import { useDoctor } from "@/features/doctors/DoctorProvider";
import { PageHeading, Panel, Status, primary } from "@/features/doctors/ui";
export default function Dashboard() {
  const { queues, patients, examinations } = useDoctor();
  const cards = [
    { name: "Total Antrean", total: queues.length },
    { name: "Menunggu / Dipanggil", total: queues.filter(q => q.status === "Menunggu" || q.status === "Dipanggil").length },
    { name: "Dalam Pemeriksaan", total: queues.filter(q => q.status === "Dalam Pemeriksaan").length },
    { name: "Selesai", total: queues.filter(q => q.status === "Selesai").length },
  ];
  const active = queues.find(q => q.status === "Dalam Pemeriksaan");
  return <><PageHeading title="Dashboard Dokter" description="Pantau antrean dan pemeriksaan pasien poli gigi." />
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{cards.map(c => <Panel key={c.name}><p className="text-sm text-slate-500">{c.name}</p><p className="mt-2 text-3xl font-bold text-teal-800">{c.total}</p></Panel>)}</div>
    {active && <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4"><p className="text-sm font-semibold text-teal-900">Pemeriksaan aktif: {patients.find(p => p.id === active.patientId)?.name}</p><Link className={primary} href={`/doctor/examinations/${active.id}`}>Lanjutkan pemeriksaan</Link></div>}
    <Panel><div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-semibold">Daftar Antrean</h2><Link href="/doctor/queues" className="text-sm font-semibold text-teal-700">Lihat semua</Link></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr>{["No. antrean", "Pasien", "Waktu", "Status"].map(h => <th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead><tbody>{queues.map(q => <tr key={q.id} className="border-b border-slate-100"><td className="p-3 font-medium">{q.number}</td><td className="p-3">{patients.find(p => p.id === q.patientId)?.name ?? "-"}</td><td className="p-3">{q.time}</td><td className="p-3"><Status status={q.status}/></td></tr>)}</tbody></table></div></Panel>
    <div className="mt-6"><Panel><p className="text-sm text-slate-500">Total catatan pemeriksaan (demo)</p><div className="mt-2 flex items-center justify-between"><p className="text-2xl font-bold">{examinations.length}</p><Link className="text-sm font-semibold text-teal-700" href="/doctor/history">Lihat riwayat</Link></div></Panel></div></>;
}
