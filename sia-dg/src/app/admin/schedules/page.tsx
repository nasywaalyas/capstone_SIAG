
"use client";

import { useMemo, useState } from "react";

type JadwalDokter = {
  id: number;
  nama: string;
  spesialis: string;
  hari: string;
  mulai: string;
  selesai: string;
  kuota: number;
  status: "Aktif" | "Tidak Aktif";
};

const NAMA_DOKTER = "drg. Siti";
const SPESIALIS = "Dokter Gigi Umum";

const dataAwal: JadwalDokter[] = [
  {
    id: 1,
    nama: NAMA_DOKTER,
    spesialis: SPESIALIS,
    hari: "Senin",
    mulai: "08:00",
    selesai: "12:00",
    kuota: 15,
    status: "Aktif",
  },
  {
    id: 2,
    nama: NAMA_DOKTER,
    spesialis: SPESIALIS,
    hari: "Senin",
    mulai: "13:00",
    selesai: "16:00",
    kuota: 12,
    status: "Aktif",
  },
  {
    id: 3,
    nama: NAMA_DOKTER,
    spesialis: SPESIALIS,
    hari: "Rabu",
    mulai: "08:00",
    selesai: "12:00",
    kuota: 15,
    status: "Aktif",
  },
  {
    id: 4,
    nama: NAMA_DOKTER,
    spesialis: SPESIALIS,
    hari: "Kamis",
    mulai: "09:00",
    selesai: "13:00",
    kuota: 10,
    status: "Aktif",
  },
  {
    id: 5,
    nama: NAMA_DOKTER,
    spesialis: SPESIALIS,
    hari: "Jumat",
    mulai: "08:00",
    selesai: "11:00",
    kuota: 10,
    status: "Tidak Aktif",
  },
];

const hariPilihan = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const formKosong = {
  nama: NAMA_DOKTER,
  spesialis: SPESIALIS,
  hari: "Senin",
  mulai: "08:00",
  selesai: "12:00",
  kuota: "15",
  status: "Aktif" as "Aktif" | "Tidak Aktif",
};

export default function SchedulesPage() {
  const [jadwal, setJadwal] = useState<JadwalDokter[]>(dataAwal);
  const [pencarian, setPencarian] = useState("");
  const [filterHari, setFilterHari] = useState("Semua");
  const [modalTerbuka, setModalTerbuka] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(formKosong);

  // STATISTIK
  const totalDokter = 1;

  const totalAktif = jadwal.filter(
    (item) => item.status === "Aktif"
  ).length;

  const totalJadwal = jadwal.length;

  // FILTER JADWAL
  const dataTerfilter = useMemo(() => {
    return jadwal.filter((item) => {
      const cocokNama = item.nama
        .toLowerCase()
        .includes(pencarian.toLowerCase());

      const cocokHari =
        filterHari === "Semua" || item.hari === filterHari;

      return cocokNama && cocokHari;
    });
  }, [jadwal, pencarian, filterHari]);

  // TAMBAH JADWAL
  const bukaTambah = () => {
    setEditId(null);
    setForm(formKosong);
    setModalTerbuka(true);
  };

  // EDIT JADWAL
  const bukaEdit = (item: JadwalDokter) => {
    setEditId(item.id);

    setForm({
      nama: NAMA_DOKTER,
      spesialis: SPESIALIS,
      hari: item.hari,
      mulai: item.mulai,
      selesai: item.selesai,
      kuota: String(item.kuota),
      status: item.status,
    });

    setModalTerbuka(true);
  };

  // SIMPAN JADWAL
  const simpanJadwal = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (form.mulai >= form.selesai) {
      alert("Jam selesai harus lebih besar dari jam mulai.");
      return;
    }

    if (Number(form.kuota) < 1) {
      alert("Kuota pasien minimal 1.");
      return;
    }

    const dataBaru: JadwalDokter = {
      id: editId ?? Date.now(),
      nama: NAMA_DOKTER,
      spesialis: SPESIALIS,
      hari: form.hari,
      mulai: form.mulai,
      selesai: form.selesai,
      kuota: Number(form.kuota),
      status: form.status,
    };

    if (editId !== null) {
      setJadwal((prev) =>
        prev.map((item) =>
          item.id === editId ? dataBaru : item
        )
      );
    } else {
      setJadwal((prev) => [...prev, dataBaru]);
    }

    setModalTerbuka(false);
    setForm(formKosong);
    setEditId(null);
  };

  // HAPUS JADWAL
  const hapusJadwal = (id: number) => {
    if (!window.confirm("Yakin ingin menghapus jadwal ini?")) {
      return;
    }

    setJadwal((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Jadwal Dokter
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola jadwal pelayanan dokter gigi.
          </p>
        </div>

        <button
          onClick={bukaTambah}
          className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800"
        >
          + Tambah Jadwal
        </button>
      </div>

      {/* STATISTIK */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {/* TOTAL DOKTER */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Dokter
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {totalDokter}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            Dokter terdaftar
          </p>
        </div>

        {/* JADWAL AKTIF */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Jadwal Aktif
          </p>

          <h2 className="mt-2 text-3xl font-bold text-teal-700">
            {totalAktif}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            Jadwal pelayanan aktif
          </p>
        </div>

        {/* TOTAL JADWAL */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Jadwal
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {totalJadwal}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            Seluruh jadwal dokter
          </p>
        </div>

      </div>

      {/* DAFTAR JADWAL */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center">

          <div>
            <h2 className="font-semibold text-gray-800">
              Daftar Jadwal Pelayanan
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Informasi hari dan jam praktik dokter.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <input
              type="text"
              value={pencarian}
              onChange={(e) =>
                setPencarian(e.target.value)
              }
              placeholder="Cari nama dokter..."
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-teal-600"
            />

            <select
              value={filterHari}
              onChange={(e) =>
                setFilterHari(e.target.value)
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
            >
              <option value="Semua">Semua Hari</option>

              {hariPilihan.map((hari) => (
                <option key={hari} value={hari}>
                  {hari}
                </option>
              ))}
            </select>

          </div>
        </div>

        {/* TABEL */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">

            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-5 py-4">No.</th>
                <th className="px-5 py-4">Nama Dokter</th>
                <th className="px-5 py-4">Spesialisasi</th>
                <th className="px-5 py-4">Hari</th>
                <th className="px-5 py-4">Jam Praktik</th>
                <th className="px-5 py-4">Kuota</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {dataTerfilter.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4 text-gray-500">
                    {index + 1}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-800">
                    {item.nama}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                    {item.spesialis}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {item.hari}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                    {item.mulai} - {item.selesai}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {item.kuota} pasien
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.status === "Aktif"
                          ? "bg-teal-50 text-teal-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => bukaEdit(item)}
                        className="rounded-md bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => hapusJadwal(item.id)}
                        className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                      >
                        Hapus
                      </button>

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
                    Jadwal dokter tidak ditemukan.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
          Menampilkan {dataTerfilter.length} dari {jadwal.length} jadwal.
        </div>

      </section>

      {/* MODAL TAMBAH DAN EDIT */}
      {modalTerbuka && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-lg font-bold text-gray-800">
                {editId !== null
                  ? "Edit Jadwal Dokter"
                  : "Tambah Jadwal Dokter"}
              </h2>

              <button
                onClick={() => setModalTerbuka(false)}
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={simpanJadwal}
              className="space-y-4"
            >

              {/* NAMA DOKTER */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nama Dokter
                </label>

                <input
                  value={NAMA_DOKTER}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-600"
                />
              </div>

              {/* SPESIALISASI */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Spesialisasi
                </label>

                <input
                  value={SPESIALIS}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-600"
                />
              </div>

              {/* HARI */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Hari Praktik
                </label>

                <select
                  value={form.hari}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      hari: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600"
                >
                  {hariPilihan.map((hari) => (
                    <option key={hari} value={hari}>
                      {hari}
                    </option>
                  ))}
                </select>
              </div>

              {/* JAM PRAKTIK */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Jam Mulai
                  </label>

                  <input
                    required
                    type="time"
                    value={form.mulai}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        mulai: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Jam Selesai
                  </label>

                  <input
                    required
                    type="time"
                    value={form.selesai}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        selesai: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                  />
                </div>

              </div>

              {/* KUOTA */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Kuota Pasien
                </label>

                <input
                  required
                  min="1"
                  type="number"
                  value={form.kuota}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      kuota: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600"
                />
              </div>

              {/* STATUS */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Status Jadwal
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as
                        | "Aktif"
                        | "Tidak Aktif",
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">
                    Tidak Aktif
                  </option>
                </select>
              </div>

              {/* TOMBOL */}
              <div className="flex gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setModalTerbuka(false)}
                  className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-teal-700 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
                >
                  {editId !== null
                    ? "Simpan Perubahan"
                    : "Simpan Jadwal"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
