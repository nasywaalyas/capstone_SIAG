import type { ReactNode } from "react";
import type { QueueStatus } from "./types";
export function PageHeading({ title, description }: { title: string; description: string }) {
  return <div className="mb-6"><h1 className="text-2xl font-bold tracking-tight">{title}</h1><p className="mt-1 text-sm text-slate-600">{description}</p></div>;
}
export function Status({ status }: { status: QueueStatus }) {
  const colors: Record<QueueStatus, string> = { Menunggu: "bg-amber-100 text-amber-800", Dipanggil: "bg-blue-100 text-blue-800", "Dalam Pemeriksaan": "bg-violet-100 text-violet-800", Selesai: "bg-emerald-100 text-emerald-800", Batal: "bg-slate-100 text-slate-600" };
  return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${colors[status]}`}>{status}</span>;
}
export function Panel({ children }: { children: ReactNode }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">{children}</section>;
}
export const primary = "inline-flex items-center justify-center rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50";
export const field = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
export const formatDate = (value: string) => new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeZone: "Asia/Jakarta" }).format(new Date(value));
