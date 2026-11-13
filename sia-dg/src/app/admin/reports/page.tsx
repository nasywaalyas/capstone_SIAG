
"use client";

import { useMemo, useState } from "react";

type StatusAntrean =
  | "Menunggu"
  | "Dipanggil"
  | "Dalam Pemeriksaan"
  | "Selesai"
  | "Batal";

type Laporan = {
  id: number;
  nomor: string;
  nama: string;
  layanan: string;
  tanggal: string;
  status: StatusAntrean;
};

// Sistem hanya memiliki satu dokter gigi.
// Ganti nama ini dengan nama dokter yang sebenarnya.
const NAMA_DOKTER = "drg. Siti";

const DATA_LAPORAN: Laporan[] = [
  {
    id: 1,
    nomor: "A001",
    nama: "Andi Saputra",
    layanan: "Pemeriksaan Gigi",
    tanggal: "2026-11-10",
    status: "Selesai",
  },
  {
    id: 2,
    nomor: "A002",
    nama: "Siti Rahma",
    layanan: "Pembersihan Karang Gigi",
    tanggal: "2026-11-10",
    status: "Selesai",
  },
  {
    id: 3,
    nomor: "A003",
    nama: "Budi Santoso",
    layanan: "Tambal Gigi",
    tanggal: "2026-11-10",
    status: "Batal",
  },
  {
    id: 4,
    nomor: "A004",
    nama: "Dewi Anggraini",
    layanan: "Pemeriksaan Gigi",
    tanggal: "2026-11-11",
    status: "Selesai",
  },
  {
    id: 5,
    nomor: "A005",
    nama: "Rizky Pratama",
    layanan: "Cabut Gigi",
    tanggal: "2026-11-11",
    status: "Menunggu",
  },
  {
    id: 6,
    nomor: "A006",
    nama: "Nadia Putri",
    layanan: "Pembersihan Karang Gigi",
    tanggal: "2026-11-11",
    status: "Dalam Pemeriksaan",
  },
  {
    id: 7,
    nomor: "A007",
    nama: "Fajar Hidayat",
    layanan: "Tambal Gigi",
    tanggal: "2026-11-12",
    status: "Selesai",
  },
  {
    id: 8,
    nomor: "A008",
    nama: "Maya Lestari",
    layanan: "Pemeriksaan Gigi",
    tanggal: "2026-11-12",
    status: "Dipanggil",
  },
  {
    id: 9,
    nomor: "A009",
    nama: "Agus Setiawan",
    layanan: "Cabut Gigi",
    tanggal: "2026-11-12",
    status: "Menunggu",
  },
  {
    id: 10,
    nomor: "A010",
    nama: "Rina Amelia",
    layanan: "Tambal Gigi",
    tanggal: "2026-11-12",
    status: "Selesai",
  },
];

const DAFTAR_STATUS = [
  "Semua Status",
  "Menunggu",
  "Dipanggil",
  "Dalam Pemeriksaan",
  "Selesai",
  "Batal",
];

function formatTanggal(tanggal: string) {
  return new Date(`${tanggal}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function statusWarna(status: StatusAntrean) {
  switch (status) {
    case "Selesai":
      return "bg-green-100 text-green-700";
    case "Menunggu":
      return "bg-yellow-100 text-yellow-700";
    case "Dipanggil":
      return "bg-blue-100 text-blue-700";
    case "Dalam Pemeriksaan":
      return "bg-purple-100 text-purple-700";
    case "Batal":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function AdminReportsPage() {
  const [tanggalMulai, setTanggalMulai] = useState("2026-11-10");
  const [tanggalSelesai, setTanggalSelesai] = useState("2026-11-12");
  const [filterStatus, setFilterStatus] = useState("Semua Status");

  const dataFilter = useMemo(() => {
    if (tanggalMulai > tanggalSelesai) {
      return [];
    }

    return DATA_LAPORAN.filter((item) => {
      const sesuaiTanggal =
        item.tanggal >= tanggalMulai &&
        item.tanggal <= tanggalSelesai;

      const sesuaiStatus =
        filterStatus === "Semua Status" ||
        item.status === filterStatus;

      return sesuaiTanggal && sesuaiStatus;
    });
  }, [tanggalMulai, tanggalSelesai, filterStatus]);

  const totalPasien = dataFilter.length;

  const totalSelesai = dataFilter.filter(
    (item) => item.status === "Selesai"
  ).length;

  const totalMenunggu = dataFilter.filter(
    (item) => item.status === "Menunggu"
  ).length;

  const totalBatal = dataFilter.filter(
    (item) => item.status === "Batal"
  ).length;

  const totalProses = dataFilter.filter(
    (item) =>
      item.status === "Dipanggil" ||
      item.status === "Dalam Pemeriksaan"
  ).length;

  const dataHarian = useMemo(() => {
    const kelompok: Record<
      string,
      {
        selesai: number;
        menunggu: number;
        proses: number;
        batal: number;
        total: number;
      }
    > = {};

    dataFilter.forEach((item) => {
      if (!kelompok[item.tanggal]) {
        kelompok[item.tanggal] = {
          selesai: 0,
          menunggu: 0,
          proses: 0,
          batal: 0,
          total: 0,
        };
      }

      kelompok[item.tanggal].total += 1;

      if (item.status === "Selesai") {
        kelompok[item.tanggal].selesai += 1;
      } else if (item.status === "Menunggu") {
        kelompok[item.tanggal].menunggu += 1;
      } else if (
        item.status === "Dipanggil" ||
        item.status === "Dalam Pemeriksaan"
      ) {
        kelompok[item.tanggal].proses += 1;
      } else if (item.status === "Batal") {
        kelompok[item.tanggal].batal += 1;
      }
    });

    return Object.entries(kelompok).sort(([a], [b]) =>
      a.localeCompare(b)
    );
  }, [dataFilter]);

  function exportCSV() {
    const header = [
      "Nomor Antrean",
      "Nama Pasien",
      "Nama Dokter",
      "Layanan",
      "Tanggal",
      "Status",
    ];

    const rows = dataFilter.map((item) => [
      item.nomor,
      item.nama,
      NAMA_DOKTER,
      item.layanan,
      item.tanggal,
      item.status,
    ]);

    const escapeCSV = (value: string) =>
      `"${value.replace(/"/g, '""')}"`;

    const isiCSV = [header, ...rows]
      .map((row) => row.map((value) => escapeCSV(String(value))).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + isiCSV], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "laporan-antrean-poli-gigi.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  const jumlahMaksimal = Math.max(
    ...dataHarian.map(([, data]) => data.total),
    1
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Laporan Antrean
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Rekapitulasi pelayanan pasien poli gigi.
          </p>
        </div>

        <button
          onClick={exportCSV}
          disabled={dataFilter.length === 0}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Export CSV
        </button>
      </div>

      {/* Informasi dokter */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm text-blue-600">Dokter Gigi</p>
        <p className="mt-1 font-semibold text-blue-900">
          {NAMA_DOKTER}
        </p>
        <p className="mt-1 text-xs text-blue-700">
          Seluruh pelayanan dan laporan antrean ditangani oleh satu dokter
          gigi.
        </p>
      </div>

      {/* Filter */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-gray-800">
          Filter Laporan
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={tanggalMulai}
              onChange={(e) => setTanggalMulai(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Tanggal Selesai
            </label>
            <input
              type="date"
              value={tanggalSelesai}
              onChange={(e) => setTanggalSelesai(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Status Antrean
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              {DAFTAR_STATUS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {tanggalMulai > tanggalSelesai && (
          <p className="mt-3 text-sm text-red-600">
            Tanggal mulai tidak boleh melebihi tanggal selesai.
          </p>
        )}
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Pasien</p>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            {totalPasien}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Selesai</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {totalSelesai}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Menunggu</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {totalMenunggu}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Dibatalkan</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {totalBatal}
          </p>
        </div>
      </div>

      {/* Grafik laporan harian */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="font-semibold text-gray-800">
          Ringkasan Antrean Harian
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Jumlah pasien berdasarkan status antrean.
        </p>

        <div className="mt-5 space-y-5">
          {dataHarian.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              Tidak ada data untuk ditampilkan.
            </p>
          ) : (
            dataHarian.map(([tanggal, data]) => (
              <div key={tanggal}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    {formatTanggal(tanggal)}
                  </span>
                  <span className="text-gray-500">
                    {data.total} pasien
                  </span>
                </div>

                <div className="flex h-5 w-full overflow-hidden rounded-full bg-gray-100">
                  {[
                    {
                      jumlah: data.selesai,
                      warna: "bg-green-500",
                    },
                    {
                      jumlah: data.menunggu,
                      warna: "bg-yellow-400",
                    },
                    {
                      jumlah: data.proses,
                      warna: "bg-blue-500",
                    },
                    {
                      jumlah: data.batal,
                      warna: "bg-red-500",
                    },
                  ].map((bagian, index) => (
                    <div
                      key={index}
                      className={bagian.warna}
                      style={{
                        width: `${(bagian.jumlah / jumlahMaksimal) * 100}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-green-500" />
            Selesai
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-yellow-400" />
            Menunggu
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-blue-500" />
            Dipanggil / Dalam Pemeriksaan
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-red-500" />
            Batal
          </span>
        </div>
      </div>

      {/* Tabel laporan */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800">
            Detail Laporan Pasien
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Data pelayanan oleh {NAMA_DOKTER}.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 font-semibold">
                  No. Antrean
                </th>
                <th className="px-5 py-3 font-semibold">
                  Nama Pasien
                </th>
                <th className="px-5 py-3 font-semibold">
                  Layanan
                </th>
                <th className="px-5 py-3 font-semibold">
                  Tanggal
                </th>
                <th className="px-5 py-3 font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {dataFilter.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Tidak ada data laporan yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                dataFilter.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-blue-600">
                      {item.nomor}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-800">
                      {item.nama}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {item.layanan}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatTanggal(item.tanggal)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusWarna(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 px-5 py-3 text-sm text-gray-500">
          Menampilkan {dataFilter.length} data pasien.
          <span className="ml-1">
            Total dalam pemeriksaan atau dipanggil: {totalProses}.
          </span>
        </div>
      </div>
    </div>
  );
}
