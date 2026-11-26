"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
const menus = [
  { href: "/doctor/dashboard", label: "Dashboard" },
  { href: "/doctor/queues", label: "Antrean Pasien" },
  { href: "/doctor/patients", label: "Data Pasien" },
  { href: "/doctor/history", label: "Riwayat Pemeriksaan" },
];
export default function DoctorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <aside className="bg-slate-900 text-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0">
        <div className="border-b border-slate-700 px-6 py-6"><p className="text-xl font-bold tracking-wide">SIAG</p><p className="mt-1 text-sm text-slate-300">Panel Dokter Gigi</p></div>
        <nav aria-label="Menu dokter" className="flex gap-1 overflow-x-auto p-3 md:flex-col">
          {menus.map(menu => {
            const active = pathname === menu.href || pathname.startsWith(menu.href + "/") || (menu.href.endsWith("/queues") && pathname.startsWith("/doctor/examinations/"));
            return <Link key={menu.href} href={menu.href} aria-current={active ? "page" : undefined} className={`whitespace-nowrap rounded-lg px-4 py-3 text-sm font-medium ${active ? "bg-teal-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}>{menu.label}</Link>;
          })}
        </nav>
        <div className="px-6 py-4 text-xs text-slate-400">Mode demo frontend</div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-8"><div><p className="text-sm text-slate-500">Sistem Informasi Antrean</p><p className="font-semibold">Poli Gigi</p></div><span className="rounded-full bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800">Dokter Gigi</span></header>
        <main className="mx-auto max-w-7xl p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
