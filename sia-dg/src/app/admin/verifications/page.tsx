
"use client";

import { useMemo, useState, type FormEvent } from "react";

type StatusPendaftaran = "Menunggu" | "Diterima" | "Ditolak";

type Pendaftaran = {
  id: number;
  nama: string;
  telepon: string;
  email: string;
  tanggal: string;
  layanan: string;
  dokter: string;
  keluhan: string;
  status: StatusPendaftaran;
};

const dataAwal: Pendaftaran[] = [
  {
    id: 1,
    nama: "Andi Saputra",
    telepon: "081234567801",
    email: "andi@gmail.com",
    tanggal: "12/11/2026",
    layanan: "Pemeriksaan Umum",
    dokter: "drg. Siti",
    keluhan: "Sakit gigi bagian belakang",
    status: "Menunggu",
  },
  {
    id: 2,
    nama: "Budi Santoso",
    telepon: "081234567802",
    email: "budi@gmail.com",
    tanggal: "12/11/2026",
    layanan: "Pembersihan Karang Gigi",
    dokter: "drg. Siti",
    keluhan: "Ingin membersihkan karang gigi",
    status: "Menunggu",
  },
  {
    id: 3,
    nama: "Dewi Lestari",
    telepon: "081234567803",
    email: "dewi@gmail.com",
    tanggal: "11/11/2026",
    layanan: "Pemeriksaan Umum",
    dokter: "drg. Siti",
    keluhan: "Gigi terasa ngilu",
    status: "Diterima",
  },
  {
    id: 4,
    nama: "Rina Amelia",
    telepon: "081234567804",
    email: "rina@gmail.com",
    tanggal: "11/11/2026",
    layanan: "Pencabutan Gigi",
    dokter: "drg. Siti",
    keluhan: "Gigi berlubang dan terasa sakit",
    status: "Ditolak",
  },
  {
    id: 5,
    nama: "Agus Setiawan",
    telepon: "081234567805",
    email: "agus@gmail.com",
    tanggal: "10/11/2026",
    layanan: "Pemeriksaan Umum",
    dokter: "drg. Siti",
    keluhan: "Pemeriksaan kondisi gigi",
    status: "Menunggu",
  },
];

export default function VerificationsPage() {
  const [pendaftaran, setPendaftaran] =
    useState<Pendaftaran[]>(dataAwal);

  const [pencarian, setPencarian] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [detail, setDetail] = useState<Pendaftaran | null>(null);

  const totalMenunggu = pendaftaran.filter(
    (item) => item.status === "Menunggu"
  ).length;

  const totalDiterima = pendaftaran.filter(
    (item) => item.status === "Diterima"
  ).length;

  const totalDitolak = pendaftaran.filter(
    (item) => item.status === "Ditolak"
  ).length;

  const dataTerfilter = useMemo(() => {
    return pendaftaran.filter((item) => {
      const cocokPencarian =
        item.nama.toLowerCase().includes(pencarian.toLowerCase()) ||
        item.telepon.includes(pencarian);

      const cocokStatus =
        filterStatus === "Semua" ||
        item.status === filterStatus;

      return cocokPencarian && cocokStatus;
    });
  }, [pendaftaran, pencarian, filterStatus]);

  const ubahStatus = (
    id: number,
    statusBaru: StatusPendaftaran
  ) => {
    const konfirmasi = window.confirm(
      `Apakah kamu yakin ingin ${statusBaru.toLowerCase()} pendaftaran ini?`
    );

    if (!konfirmasi) return;

    setPendaftaran((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: statusBaru }
          : item
      )
    );

    setDetail(null);
  };

  const statusStyle = (status: StatusPendaftaran) => {
    if (status === "Diterima") {
      return "bg-teal-50 text-teal-700";
    }

    if (status === "Ditolak") {
      return "bg-red-50 text-red-600";
    }

    return "bg-orange-50 text-orange-600";
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Verifikasi Pendaftaran
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Periksa dan kelola pendaftaran pasien Poli Gigi.
        </p>
      </div>

      {/* STATISTIK */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Pendaftaran
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {pendaftaran.length}
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            Seluruh pendaftaran
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Menunggu Verifikasi
          </p>
          <h2 className="mt-2 text-3xl font-bold text-orange-500">
            {totalMenunggu}
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            Belum diperiksa admin
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Diterima
          </p>
          <h2 className="mt-2 text-3xl font-bold text-teal-700">
            {totalDiterima}
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            Pendaftaran disetujui
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Ditolak
          </p>
          <h2 className="mt-2 text-3xl font-bold text-red-500">
            {totalDitolak}
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            Pendaftaran tidak disetujui
          </p>
        </div>

      </div>

      {/* TABEL PENDAFTARAN */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-semibold text-gray-800">
              Daftar Pendaftaran Pasien
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Periksa status pendaftaran pasien yang masuk.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={pencarian}
              onChange={(e) => setPencarian(e.target.value)}
              placeholder="Cari nama atau telepon..."
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-teal-600"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Diterima">Diterima</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-5 py-4">No.</th>
                <th className="px-5 py-4">Nama Pasien</th>
                <th className="px-5 py-4">No. Telepon</th>
                <th className="px-5 py-4">Layanan</th>
                <th className="px-5 py-4">Dokter</th>
                <th className="px-5 py-4">Tanggal</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {dataTerfilter.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">

                  <td className="px-5 py-4 text-gray-500">
                    {index + 1}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-800">
                    {item.nama}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                    {item.telepon}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                    {item.layanan}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                    {item.dokter}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                    {item.tanggal}
                  </td>

                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap justify-center gap-2">

                      <button
                        onClick={() => setDetail(item)}
                        className="rounded-md bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100"
                      >
                        Detail
                      </button>

                      {item.status === "Menunggu" && (
                        <>
                          <button
                            onClick={() => ubahStatus(item.id, "Diterima")}
                            className="rounded-md bg-teal-50 px-3 py-2 text-xs font-medium text-teal-700 hover:bg-teal-100"
                          >
                            Terima
                          </button>

                          <button
                            onClick={() => ubahStatus(item.id, "Ditolak")}
                            className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                          >
                            Tolak
                          </button>
                        </>
                      )}

                    </div>
                  </td>
                </tr>
              ))}

              {dataTerfilter.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Tidak ada data pendaftaran ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
          Menampilkan {dataTerfilter.length} dari {pendaftaran.length} pendaftaran.
        </div>

      </section>

      {/* MODAL DETAIL */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                Detail Pendaftaran
              </h2>

              <button
                onClick={() => setDetail(null)}
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">

              {[
                ["Nama Pasien", detail.nama],
                ["Email", detail.email],
                ["Nomor Telepon", detail.telepon],
                ["Tanggal Pendaftaran", detail.tanggal],
                ["Jenis Layanan", detail.layanan],
                ["Dokter", detail.dokter],
                ["Keluhan", detail.keluhan],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-medium text-gray-800">{value}</p>
                </div>
              ))}

              <div>
                <p className="text-xs text-gray-500">Status Pendaftaran</p>
                <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyle(detail.status)}`}>
                  {detail.status}
                </span>
              </div>

            </div>

            {detail.status === "Menunggu" && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => ubahStatus(detail.id, "Diterima")}
                  className="flex-1 rounded-lg bg-teal-700 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
                >
                  Terima Pendaftaran
                </button>

                <button
                  onClick={() => ubahStatus(detail.id, "Ditolak")}
                  className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
                >
                  Tolak Pendaftaran
                </button>
              </div>
            )}

            <button
              onClick={() => setDetail(null)}
              className="mt-3 w-full rounded-lg border border-gray-200 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              Tutup
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

