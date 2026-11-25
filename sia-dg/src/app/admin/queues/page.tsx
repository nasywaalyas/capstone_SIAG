"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type StatusAntrean =
  | "Menunggu"
  | "Dipanggil"
  | "Dalam Pemeriksaan"
  | "Selesai"
  | "Batal";

type Antrean = {
  id: string;
  nomor: string;
  nama: string;
  telepon: string;
  layanan: string;
  dokter: string;
  tanggal: string;
  waktu: string;
  keluhan: string;
  status: StatusAntrean;
};

function getJakartaDateInput() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export default function QueuesPage() {
  const [antrean, setAntrean] = useState<Antrean[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pesan, setPesan] = useState<{
    tipe: "sukses" | "error";
    teks: string;
  } | null>(null);

  const [pencarian, setPencarian] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [tanggal, setTanggal] = useState("");
  const [detail, setDetail] = useState<Antrean | null>(null);

  useEffect(() => {
    setTanggal(getJakartaDateInput());
  }, []);

  const ambilDataAntrean = useCallback(async (selectedDate: string) => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/queues?tanggal=${encodeURIComponent(selectedDate)}`,
        { cache: "no-store" },
      );
      const data = await response.json();

      if (response.ok) {
        setAntrean(data.queues ?? []);
      }
    } catch (error) {
      console.error("Gagal memuat data antrean:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tanggal) {
      ambilDataAntrean(tanggal);
    }
  }, [tanggal, ambilDataAntrean]);

  const totalMenunggu = antrean.filter(
    (item) => item.status === "Menunggu",
  ).length;

  const totalDipanggil = antrean.filter(
    (item) => item.status === "Dipanggil",
  ).length;

  const totalPemeriksaan = antrean.filter(
    (item) => item.status === "Dalam Pemeriksaan",
  ).length;

  const totalSelesai = antrean.filter(
    (item) => item.status === "Selesai",
  ).length;

  const dataTerfilter = useMemo(() => {
    return antrean.filter((item) => {
      const cocokPencarian =
        item.nama.toLowerCase().includes(pencarian.toLowerCase()) ||
        item.nomor.toLowerCase().includes(pencarian.toLowerCase()) ||
        item.telepon.includes(pencarian);

      const cocokStatus =
        filterStatus === "Semua" || item.status === filterStatus;

      return cocokPencarian && cocokStatus;
    });
  }, [antrean, pencarian, filterStatus]);

  const ubahStatus = async (id: string, statusBaru: StatusAntrean) => {
    const konfirmasi = window.confirm(
      `Ubah status antrean menjadi "${statusBaru}"?`,
    );

    if (!konfirmasi) return;

    setSubmitting(true);
    setPesan(null);

    try {
      const response = await fetch(`/api/admin/queues/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: statusBaru }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPesan({
          tipe: "error",
          teks: data.message || "Gagal memperbarui status antrean.",
        });
        return;
      }

      setPesan({ tipe: "sukses", teks: data.message });
      setDetail(null);
      await ambilDataAntrean(tanggal);
    } catch {
      setPesan({
        tipe: "error",
        teks: "Terjadi kesalahan koneksi ke server.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const warnaStatus = (status: StatusAntrean) => {
    switch (status) {
      case "Menunggu":
        return "bg-orange-50 text-orange-600";
      case "Dipanggil":
        return "bg-blue-50 text-blue-600";
      case "Dalam Pemeriksaan":
        return "bg-purple-50 text-purple-600";
      case "Selesai":
        return "bg-teal-50 text-teal-700";
      case "Batal":
        return "bg-red-50 text-red-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Data Antrean</h1>
        <p className="mt-1 text-sm text-gray-500">
          Pantau dan kelola antrean pasien Poli Gigi berdasarkan tanggal.
        </p>
      </div>

      {/* NOTIFIKASI */}
      {pesan && (
        <div
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            pesan.tipe === "sukses"
              ? "border-teal-200 bg-teal-50 text-teal-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {pesan.teks}
        </div>
      )}

      {/* FILTER TANGGAL */}
      <div className="flex flex-col justify-between gap-3 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-semibold text-gray-800">
            Pilih Tanggal Pelayanan
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Tampilkan antrean sesuai tanggal yang dipilih.
          </p>
        </div>

        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-teal-600"
        />
      </div>

      {/* STATISTIK */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Antrean</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {loading ? "..." : antrean.length}
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            Antrean pada tanggal terpilih
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Menunggu</p>
          <h2 className="mt-2 text-3xl font-bold text-orange-500">
            {loading ? "..." : totalMenunggu}
          </h2>
          <p className="mt-2 text-xs text-gray-400">Belum dipanggil</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Dalam Proses</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {loading ? "..." : totalDipanggil + totalPemeriksaan}
          </h2>
          <p className="mt-2 text-xs text-gray-400">Dipanggil atau diperiksa</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Selesai</p>
          <h2 className="mt-2 text-3xl font-bold text-teal-700">
            {loading ? "..." : totalSelesai}
          </h2>
          <p className="mt-2 text-xs text-gray-400">Sudah dilayani</p>
        </div>
      </div>

      {/* TABEL ANTREAN */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-semibold text-gray-800">
              Daftar Antrean Pasien
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Kelola status pelayanan pasien.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={pencarian}
              onChange={(e) => setPencarian(e.target.value)}
              placeholder="Cari nomor atau nama..."
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-teal-600"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Dipanggil">Dipanggil</option>
              <option value="Dalam Pemeriksaan">Dalam Pemeriksaan</option>
              <option value="Selesai">Selesai</option>
              <option value="Batal">Batal</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-5 py-4">No. Antrean</th>
                <th className="px-5 py-4">Nama Pasien</th>
                <th className="px-5 py-4">No. Telepon</th>
                <th className="px-5 py-4">Layanan</th>
                <th className="px-5 py-4">Dokter</th>
                <th className="px-5 py-4">Waktu</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Memuat data antrean dari database...
                  </td>
                </tr>
              ) : (
                dataTerfilter.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-teal-700">
                      {item.nomor}
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
                      {item.waktu}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${warnaStatus(item.status)}`}
                      >
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

                        <select
                          disabled={submitting}
                          value={item.status}
                          onChange={(e) =>
                            ubahStatus(item.id, e.target.value as StatusAntrean)
                          }
                          className="max-w-[145px] rounded-md border border-gray-200 px-2 py-2 text-xs outline-none focus:border-teal-600 disabled:opacity-60"
                        >
                          <option value="Menunggu">Menunggu</option>
                          <option value="Dipanggil">Dipanggil</option>
                          <option value="Dalam Pemeriksaan">
                            Dalam Pemeriksaan
                          </option>
                          <option value="Selesai">Selesai</option>
                          <option value="Batal">Batal</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {!loading && dataTerfilter.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Tidak ada antrean pada tanggal atau pencarian tersebut.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
          Menampilkan {dataTerfilter.length} dari {antrean.length} antrean.
        </div>
      </section>

      {/* MODAL DETAIL */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                Detail Antrean
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
                ["Nomor Antrean", detail.nomor],
                ["Nama Pasien", detail.nama],
                ["Nomor Telepon", detail.telepon],
                ["Jenis Layanan", detail.layanan],
                ["Dokter", detail.dokter],
                ["Tanggal", detail.tanggal],
                ["Waktu", detail.waktu],
                ["Keluhan", detail.keluhan],
                ["Status", detail.status],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-medium text-gray-800">{value}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setDetail(null)}
              className="mt-6 w-full rounded-lg bg-teal-700 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
