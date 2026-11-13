
"use client";

import { useMemo, useState } from "react";

type Pasien = {
  id: number;
  nama: string;
  email: string;
  telepon: string;
  tanggalDaftar: string;
  status: "Aktif" | "Nonaktif";
};

const dataAwal: Pasien[] = [
  {
    id: 1,
    nama: "Andi Saputra",
    email: "andi@gmail.com",
    telepon: "081234567801",
    tanggalDaftar: "10/11/2026",
    status: "Aktif",
  },
  {
    id: 2,
    nama: "Budi Santoso",
    email: "budi@gmail.com",
    telepon: "081234567802",
    tanggalDaftar: "10/11/2026",
    status: "Aktif",
  },
  {
    id: 3,
    nama: "Dewi Lestari",
    email: "dewi@gmail.com",
    telepon: "081234567803",
    tanggalDaftar: "09/11/2026",
    status: "Aktif",
  },
  {
    id: 4,
    nama: "Rina Amelia",
    email: "rina@gmail.com",
    telepon: "081234567804",
    tanggalDaftar: "08/11/2026",
    status: "Nonaktif",
  },
  {
    id: 5,
    nama: "Agus Setiawan",
    email: "agus@gmail.com",
    telepon: "081234567805",
    tanggalDaftar: "07/11/2026",
    status: "Aktif",
  },
];

export default function PatientsPage() {
  const [pasien, setPasien] = useState<Pasien[]>(dataAwal);
  const [pencarian, setPencarian] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [modalTambah, setModalTambah] = useState(false);
  const [detailPasien, setDetailPasien] = useState<Pasien | null>(null);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    telepon: "",
  });

  const pasienTerfilter = useMemo(() => {
    return pasien.filter((item) => {
      const cocokPencarian =
        item.nama.toLowerCase().includes(pencarian.toLowerCase()) ||
        item.email.toLowerCase().includes(pencarian.toLowerCase()) ||
        item.telepon.includes(pencarian);

      const cocokStatus =
        filterStatus === "Semua" || item.status === filterStatus;

      return cocokPencarian && cocokStatus;
    });
  }, [pasien, pencarian, filterStatus]);

  const tambahPasien = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const pasienBaru: Pasien = {
      id: Date.now(),
      nama: form.nama,
      email: form.email,
      telepon: form.telepon,
      tanggalDaftar: new Date().toLocaleDateString("id-ID"),
      status: "Aktif",
    };

    setPasien((prev) => [pasienBaru, ...prev]);
    setForm({ nama: "", email: "", telepon: "" });
    setModalTambah(false);
  };

  const hapusPasien = (id: number) => {
    const yakin = window.confirm("Apakah kamu yakin ingin menghapus pasien ini?");

    if (yakin) {
      setPasien((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Data Pasien
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola dan pantau informasi pasien Poli Gigi.
          </p>
        </div>

        <button
          onClick={() => setModalTambah(true)}
          className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800"
        >
          + Tambah Pasien
        </button>
      </div>

      {/* STATISTIK */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Pasien</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {pasien.length}
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            Seluruh pasien terdaftar
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Pasien Aktif</p>
          <h2 className="mt-2 text-3xl font-bold text-teal-700">
            {pasien.filter((p) => p.status === "Aktif").length}
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            Pasien dengan status aktif
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Pasien Nonaktif</p>
          <h2 className="mt-2 text-3xl font-bold text-orange-500">
            {pasien.filter((p) => p.status === "Nonaktif").length}
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            Pasien dengan status nonaktif
          </p>
        </div>

      </div>

      {/* TABEL PASIEN */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-gray-800">
              Daftar Pasien
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Informasi seluruh pasien yang terdaftar.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Cari nama, email, telepon..."
              value={pencarian}
              onChange={(e) => setPencarian(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-teal-600"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-5 py-4">No.</th>
                <th className="px-5 py-4">Nama Pasien</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">No. Telepon</th>
                <th className="px-5 py-4">Tanggal Daftar</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {pasienTerfilter.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-gray-500">
                    {index + 1}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-800">
                    {item.nama}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {item.email}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {item.telepon}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                    {item.tanggalDaftar}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.status === "Aktif"
                          ? "bg-teal-50 text-teal-700"
                          : "bg-orange-50 text-orange-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setDetailPasien(item)}
                        className="rounded-md bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100"
                      >
                        Detail
                      </button>

                      <button
                        onClick={() => hapusPasien(item.id)}
                        className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pasienTerfilter.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    Data pasien tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
          Menampilkan {pasienTerfilter.length} dari {pasien.length} pasien.
        </div>

      </section>

      {/* MODAL TAMBAH PASIEN */}
      {modalTambah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                Tambah Pasien
              </h2>

              <button
                onClick={() => setModalTambah(false)}
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={tambahPasien} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nama Lengkap
                </label>
                <input
                  required
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
                  placeholder="Masukkan nama pasien"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
                  placeholder="contoh@email.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nomor Telepon
                </label>
                <input
                  required
                  type="tel"
                  value={form.telepon}
                  onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
                  placeholder="Masukkan nomor telepon"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalTambah(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                >
                  Simpan Pasien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETAIL PASIEN */}
      {detailPasien && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                Detail Pasien
              </h2>

              <button
                onClick={() => setDetailPasien(null)}
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Nama Lengkap</p>
                <p className="font-medium text-gray-800">{detailPasien.nama}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{detailPasien.email}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Nomor Telepon</p>
                <p className="font-medium text-gray-800">{detailPasien.telepon}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Tanggal Pendaftaran</p>
                <p className="font-medium text-gray-800">{detailPasien.tanggalDaftar}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-medium text-gray-800">{detailPasien.status}</p>
              </div>
            </div>

            <button
              onClick={() => setDetailPasien(null)}
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

