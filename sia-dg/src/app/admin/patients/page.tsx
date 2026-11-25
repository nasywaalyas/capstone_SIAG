"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Pasien = {
  id: string;
  userId: string;
  nama: string;
  username: string;
  nik: string;
  telepon: string;
  alamat: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  tanggalDaftar: string;
  status: "Aktif" | "Nonaktif";
};

const initialForm = {
  nama: "",
  username: "",
  nik: "",
  telepon: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "LAKI_LAKI",
  alamat: "",
  password: "",
};

export default function PatientsPage() {
  const [pasien, setPasien] = useState<Pasien[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pesan, setPesan] = useState<{
    tipe: "sukses" | "error";
    teks: string;
  } | null>(null);

  const [pencarian, setPencarian] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [modalTambah, setModalTambah] = useState(false);
  const [detailPasien, setDetailPasien] = useState<Pasien | null>(null);
  const [form, setForm] = useState(initialForm);

  const ambilDataPasien = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/patients", {
        cache: "no-store",
      });
      const data = await response.json();

      if (response.ok) {
        setPasien(data.patients ?? []);
      }
    } catch (error) {
      console.error("Gagal memuat pasien:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    ambilDataPasien();
  }, [ambilDataPasien]);

  const pasienTerfilter = useMemo(() => {
    return pasien.filter((item) => {
      const cocokPencarian =
        item.nama.toLowerCase().includes(pencarian.toLowerCase()) ||
        item.username.toLowerCase().includes(pencarian.toLowerCase()) ||
        item.nik.includes(pencarian) ||
        item.telepon.includes(pencarian);

      const cocokStatus =
        filterStatus === "Semua" || item.status === filterStatus;

      return cocokPencarian && cocokStatus;
    });
  }, [pasien, pencarian, filterStatus]);

  const tambahPasien = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setPesan(null);

    try {
      const response = await fetch("/api/admin/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setPesan({
          tipe: "error",
          teks: data.message || "Gagal menambahkan pasien.",
        });
        return;
      }

      setPesan({ tipe: "sukses", teks: data.message });
      setForm(initialForm);
      setModalTambah(false);
      await ambilDataPasien();
    } catch {
      setPesan({
        tipe: "error",
        teks: "Terjadi kesalahan koneksi ke server.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const hapusPasien = async (id: string, nama: string) => {
    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus pasien ${nama}?`,
    );
    if (!yakin) return;

    setPesan(null);

    try {
      const response = await fetch(`/api/admin/patients/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setPesan({
          tipe: "error",
          teks: data.message || "Gagal menghapus pasien.",
        });
        return;
      }

      setPesan({ tipe: "sukses", teks: data.message });
      await ambilDataPasien();
    } catch {
      setPesan({
        tipe: "error",
        teks: "Terjadi kesalahan koneksi ke server.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Pasien</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola dan pantau informasi pasien Poli Gigi.
          </p>
        </div>

        <button
          onClick={() => {
            setPesan(null);
            setModalTambah(true);
          }}
          className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800"
        >
          + Tambah Pasien
        </button>
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

      {/* STATISTIK */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Pasien</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {loading ? "..." : pasien.length}
          </h2>
          <p className="mt-2 text-xs text-gray-400">Seluruh pasien terdaftar</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Pasien Aktif</p>
          <h2 className="mt-2 text-3xl font-bold text-teal-700">
            {loading
              ? "..."
              : pasien.filter((p) => p.status === "Aktif").length}
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            Pasien dengan status aktif
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Pasien Nonaktif</p>
          <h2 className="mt-2 text-3xl font-bold text-orange-500">
            {loading
              ? "..."
              : pasien.filter((p) => p.status === "Nonaktif").length}
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
            <h2 className="font-semibold text-gray-800">Daftar Pasien</h2>
            <p className="mt-1 text-xs text-gray-500">
              Informasi seluruh pasien yang terdaftar.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Cari nama, username, NIK, telepon..."
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
                <th className="px-5 py-4">Username & NIK</th>
                <th className="px-5 py-4">No. Telepon</th>
                <th className="px-5 py-4">Tanggal Daftar</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Memuat data pasien dari database...
                  </td>
                </tr>
              ) : (
                pasienTerfilter.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 text-gray-500">{index + 1}</td>

                    <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-800">
                      {item.nama}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      <div className="font-medium text-gray-700">
                        @{item.username}
                      </div>
                      <div className="text-xs text-gray-400">
                        NIK: {item.nik}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600">{item.telepon}</td>

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
                          onClick={() => hapusPasien(item.id, item.nama)}
                          className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {!loading && pasienTerfilter.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-gray-500"
                  >
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
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Tambah Pasien</h2>

              <button
                onClick={() => setModalTambah(false)}
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={tambahPasien} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    Username Login
                  </label>
                  <input
                    required
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
                    placeholder="Contoh: andi_saputra"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    NIK (16 Digit)
                  </label>
                  <input
                    required
                    inputMode="numeric"
                    minLength={16}
                    maxLength={16}
                    value={form.nik}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        nik: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
                    placeholder="16 digit NIK"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nomor Telepon
                  </label>
                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    minLength={10}
                    maxLength={15}
                    value={form.telepon}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        telepon: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tempat Lahir
                  </label>
                  <input
                    required
                    value={form.tempatLahir}
                    onChange={(e) =>
                      setForm({ ...form, tempatLahir: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
                    placeholder="Kota lahir"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tanggal Lahir
                  </label>
                  <input
                    required
                    type="date"
                    value={form.tanggalLahir}
                    onChange={(e) =>
                      setForm({ ...form, tanggalLahir: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Jenis Kelamin
                  </label>
                  <select
                    value={form.jenisKelamin}
                    onChange={(e) =>
                      setForm({ ...form, jenisKelamin: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
                  >
                    <option value="LAKI_LAKI">Laki-laki</option>
                    <option value="PEREMPUAN">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Alamat Lengkap
                </label>
                <input
                  required
                  value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
                  placeholder="Masukkan alamat lengkap"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Password Akun
                </label>
                <input
                  required
                  type="password"
                  minLength={8}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
                  placeholder="Minimal 8 karakter"
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
                  disabled={submitting}
                  className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
                >
                  {submitting ? "Menyimpan..." : "Simpan Pasien"}
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
              <h2 className="text-lg font-bold text-gray-800">Detail Pasien</h2>

              <button
                onClick={() => setDetailPasien(null)}
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">Nama Lengkap</p>
                <p className="font-medium text-gray-800">{detailPasien.nama}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Username</p>
                  <p className="font-medium text-gray-800">
                    @{detailPasien.username}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">NIK</p>
                  <p className="font-medium text-gray-800">
                    {detailPasien.nik}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Nomor Telepon</p>
                  <p className="font-medium text-gray-800">
                    {detailPasien.telepon}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Jenis Kelamin</p>
                  <p className="font-medium text-gray-800">
                    {detailPasien.jenisKelamin}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Tempat, Tanggal Lahir</p>
                <p className="font-medium text-gray-800">
                  {detailPasien.tempatLahir}, {detailPasien.tanggalLahir}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Alamat Lengkap</p>
                <p className="font-medium text-gray-800">
                  {detailPasien.alamat}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Tanggal Pendaftaran</p>
                  <p className="font-medium text-gray-800">
                    {detailPasien.tanggalDaftar}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-medium text-gray-800">
                    {detailPasien.status}
                  </p>
                </div>
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
