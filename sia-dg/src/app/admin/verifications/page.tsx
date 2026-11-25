"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type StatusPendaftaran = "Menunggu" | "Diterima" | "Ditolak";

type Pendaftaran = {
  id: string;
  nomorAntrian: number;
  nama: string;
  username: string;
  nik: string;
  telepon: string;
  tanggal: string;
  layanan: string;
  dokterId: string;
  dokter: string;
  keluhan: string;
  status: StatusPendaftaran;
};

type DokterOption = {
  id: string;
  nama: string;
  spesialisasi: string;
};

export default function VerificationsPage() {
  const [pendaftaran, setPendaftaran] = useState<Pendaftaran[]>([]);
  const [daftarDokter, setDaftarDokter] = useState<DokterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pesan, setPesan] = useState<{
    tipe: "sukses" | "error";
    teks: string;
  } | null>(null);

  const [pencarian, setPencarian] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [detail, setDetail] = useState<Pendaftaran | null>(null);
  const [selectedDokterId, setSelectedDokterId] = useState("");

  const ambilDataPendaftaran = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/verifications", {
        cache: "no-store",
      });
      const data = await response.json();

      if (response.ok) {
        setPendaftaran(data.registrations ?? []);
        setDaftarDokter(data.doctors ?? []);
      }
    } catch (error) {
      console.error("Gagal memuat data verifikasi:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    ambilDataPendaftaran();
  }, [ambilDataPendaftaran]);

  const totalMenunggu = pendaftaran.filter(
    (item) => item.status === "Menunggu",
  ).length;

  const totalDiterima = pendaftaran.filter(
    (item) => item.status === "Diterima",
  ).length;

  const totalDitolak = pendaftaran.filter(
    (item) => item.status === "Ditolak",
  ).length;

  const dataTerfilter = useMemo(() => {
    return pendaftaran.filter((item) => {
      const cocokPencarian =
        item.nama.toLowerCase().includes(pencarian.toLowerCase()) ||
        item.telepon.includes(pencarian) ||
        item.nik.includes(pencarian);

      const cocokStatus =
        filterStatus === "Semua" || item.status === filterStatus;

      return cocokPencarian && cocokStatus;
    });
  }, [pendaftaran, pencarian, filterStatus]);

  const bukaDetail = (item: Pendaftaran) => {
    setDetail(item);
    setSelectedDokterId(item.dokterId || "");
  };

  const ubahStatus = async (
    id: string,
    statusBaru: StatusPendaftaran,
    dokterId?: string,
  ) => {
    const konfirmasi = window.confirm(
      `Apakah kamu yakin ingin ${statusBaru.toLowerCase()} pendaftaran ini?`,
    );

    if (!konfirmasi) return;

    setSubmitting(true);
    setPesan(null);

    try {
      const response = await fetch(`/api/admin/verifications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: statusBaru,
          ...(dokterId !== undefined ? { dokterId } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPesan({
          tipe: "error",
          teks: data.message || "Gagal memperbarui status pendaftaran.",
        });
        return;
      }

      setPesan({ tipe: "sukses", teks: data.message });
      setDetail(null);
      await ambilDataPendaftaran();
    } catch {
      setPesan({
        tipe: "error",
        teks: "Terjadi kesalahan koneksi ke server.",
      });
    } finally {
      setSubmitting(false);
    }
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Pendaftaran</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {loading ? "..." : pendaftaran.length}
          </h2>
          <p className="mt-2 text-xs text-gray-400">Seluruh pendaftaran</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Menunggu Verifikasi</p>
          <h2 className="mt-2 text-3xl font-bold text-orange-500">
            {loading ? "..." : totalMenunggu}
          </h2>
          <p className="mt-2 text-xs text-gray-400">Belum diperiksa admin</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Diterima</p>
          <h2 className="mt-2 text-3xl font-bold text-teal-700">
            {loading ? "..." : totalDiterima}
          </h2>
          <p className="mt-2 text-xs text-gray-400">Pendaftaran disetujui</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Ditolak</p>
          <h2 className="mt-2 text-3xl font-bold text-red-500">
            {loading ? "..." : totalDitolak}
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
              placeholder="Cari nama, NIK, atau telepon..."
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
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Memuat data pendaftaran dari database...
                  </td>
                </tr>
              ) : (
                dataTerfilter.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 text-gray-500">{index + 1}</td>

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
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          onClick={() => bukaDetail(item)}
                          className="rounded-md bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100"
                        >
                          Detail
                        </button>

                        {item.status === "Menunggu" && (
                          <>
                            <button
                              disabled={submitting}
                              onClick={() => ubahStatus(item.id, "Diterima")}
                              className="rounded-md bg-teal-50 px-3 py-2 text-xs font-medium text-teal-700 hover:bg-teal-100 disabled:opacity-60"
                            >
                              Terima
                            </button>

                            <button
                              disabled={submitting}
                              onClick={() => ubahStatus(item.id, "Ditolak")}
                              className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-60"
                            >
                              Tolak
                            </button>
                          </>
                        )}
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
                    Tidak ada data pendaftaran ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
          Menampilkan {dataTerfilter.length} dari {pendaftaran.length}{" "}
          pendaftaran.
        </div>
      </section>

      {/* MODAL DETAIL */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
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
                ["Nomor Antrian", `#${detail.nomorAntrian}`],
                ["Nama Pasien", detail.nama],
                ["Username", `@${detail.username}`],
                ["NIK", detail.nik],
                ["Nomor Telepon", detail.telepon],
                ["Tanggal Pendaftaran", detail.tanggal],
                ["Jenis Layanan", detail.layanan],
                ["Keluhan", detail.keluhan],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-medium text-gray-800">{value}</p>
                </div>
              ))}

              <div>
                <p className="text-xs text-gray-500">Dokter Pemeriksa</p>
                {detail.status === "Menunggu" && daftarDokter.length > 0 ? (
                  <select
                    value={selectedDokterId}
                    onChange={(e) => setSelectedDokterId(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
                  >
                    <option value="">-- Pilih Dokter --</option>
                    {daftarDokter.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.nama} ({doc.spesialisasi})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="font-medium text-gray-800">{detail.dokter}</p>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500">Status Pendaftaran</p>
                <span
                  className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyle(detail.status)}`}
                >
                  {detail.status}
                </span>
              </div>
            </div>

            {detail.status === "Menunggu" && (
              <div className="mt-6 flex gap-3">
                <button
                  disabled={submitting}
                  onClick={() =>
                    ubahStatus(detail.id, "Diterima", selectedDokterId)
                  }
                  className="flex-1 rounded-lg bg-teal-700 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
                >
                  {submitting ? "Memproses..." : "Terima Pendaftaran"}
                </button>

                <button
                  disabled={submitting}
                  onClick={() => ubahStatus(detail.id, "Ditolak")}
                  className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                >
                  {submitting ? "Memproses..." : "Tolak Pendaftaran"}
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
