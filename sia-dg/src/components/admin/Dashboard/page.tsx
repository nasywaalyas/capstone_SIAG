"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type QueueItem = {
  id: string;
  nomor: string;
  nama: string;
  dokter: string;
  waktu: string;
  status: string;
};

type DoctorItem = {
  id: string;
  userId: string;
  nama: string;
  username: string;
  spesialisasi: string;
  totalAntrian?: number;
};

type PatientItem = {
  id: string;
  userId: string;
  nama: string;
  username: string;
  nik: string;
  alamat: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: "LAKI_LAKI" | "PEREMPUAN";
  noTelp: string;
};

type ActiveTab = "overview" | "doctors" | "patients";

const initialDoctorForm = {
  id: "",
  nama: "",
  username: "",
  password: "",
  spesialisasi: "",
};

const initialPatientForm = {
  id: "",
  nama: "",
  username: "",
  password: "",
  nik: "",
  alamat: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "LAKI_LAKI" as "LAKI_LAKI" | "PEREMPUAN",
  noTelp: "",
};

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [stats, setStats] = useState({
    totalPasien: 0,
    pendaftaranHariIni: 0,
    antreanMenunggu: 0,
    antreanSelesai: 0,
  });
  const [antrean, setAntrean] = useState<QueueItem[]>([]);
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [patients, setPatients] = useState<PatientItem[]>([]);

  const [doctorSearch, setDoctorSearch] = useState("");
  const [patientSearch, setPatientSearch] = useState("");

  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [doctorMode, setDoctorMode] = useState<"create" | "edit">("create");
  const [doctorForm, setDoctorForm] = useState(initialDoctorForm);
  const [savingDoctor, setSavingDoctor] = useState(false);

  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [patientMode, setPatientMode] = useState<"create" | "edit">("create");
  const [patientForm, setPatientForm] = useState(initialPatientForm);
  const [savingPatient, setSavingPatient] = useState(false);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [overviewRes, doctorsRes, patientsRes] = await Promise.all([
        fetch("/api/admin/overview", { cache: "no-store" }),
        fetch("/api/admin/doctors", { cache: "no-store" }),
        fetch("/api/admin/patients", { cache: "no-store" }),
      ]);

      if (overviewRes.ok) {
        const overviewData = await overviewRes.json();
        setStats(overviewData.stats);
        setAntrean(overviewData.antrean ?? []);
      }

      if (doctorsRes.ok) {
        const doctorsData = await doctorsRes.json();
        setDoctors(doctorsData.doctors ?? []);
      }

      if (patientsRes.ok) {
        const patientsData = await patientsRes.json();
        setPatients(patientsData.patients ?? []);
      }
    } catch (error) {
      console.error("Gagal memuat data admin:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  function openCreateDoctor() {
    setDoctorMode("create");
    setDoctorForm(initialDoctorForm);
    setFeedback(null);
    setDoctorModalOpen(true);
  }

  function openEditDoctor(doctor: DoctorItem) {
    setDoctorMode("edit");
    setDoctorForm({
      id: doctor.id,
      nama: doctor.nama,
      username: doctor.username,
      password: "",
      spesialisasi: doctor.spesialisasi ?? "",
    });
    setFeedback(null);
    setDoctorModalOpen(true);
  }

  async function handleSaveDoctor(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingDoctor(true);
    setFeedback(null);

    try {
      const url =
        doctorMode === "create"
          ? "/api/admin/doctors"
          : `/api/admin/doctors/${doctorForm.id}`;
      const method = doctorMode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorForm),
      });

      const result = await response.json();

      if (!response.ok) {
        setFeedback({
          type: "error",
          text: result.message || "Gagal menyimpan data dokter.",
        });
        return;
      }

      setFeedback({ type: "success", text: result.message });
      setDoctorModalOpen(false);
      await loadAllData();
    } catch {
      setFeedback({
        type: "error",
        text: "Terjadi kesalahan koneksi ke server.",
      });
    } finally {
      setSavingDoctor(false);
    }
  }

  function openCreatePatient() {
    setPatientMode("create");
    setPatientForm(initialPatientForm);
    setFeedback(null);
    setPatientModalOpen(true);
  }

  function openEditPatient(patient: PatientItem) {
    setPatientMode("edit");
    setPatientForm({
      id: patient.id,
      nama: patient.nama,
      username: patient.username,
      password: "",
      nik: patient.nik,
      alamat: patient.alamat,
      tempatLahir: patient.tempatLahir,
      tanggalLahir: patient.tanggalLahir,
      jenisKelamin: patient.jenisKelamin,
      noTelp: patient.noTelp,
    });
    setFeedback(null);
    setPatientModalOpen(true);
  }

  async function handleSavePatient(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingPatient(true);
    setFeedback(null);

    try {
      const url =
        patientMode === "create"
          ? "/api/admin/patients"
          : `/api/admin/patients/${patientForm.id}`;
      const method = patientMode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientForm),
      });

      const result = await response.json();

      if (!response.ok) {
        setFeedback({
          type: "error",
          text: result.message || "Gagal menyimpan data pasien.",
        });
        return;
      }

      setFeedback({ type: "success", text: result.message });
      setPatientModalOpen(false);
      await loadAllData();
    } catch {
      setFeedback({
        type: "error",
        text: "Terjadi kesalahan koneksi ke server.",
      });
    } finally {
      setSavingPatient(false);
    }
  }

  const statistik = [
    {
      judul: "Total Pasien",
      jumlah: String(stats.totalPasien),
      keterangan: "Pasien terdaftar",
      icon: "♙",
      warna: "green",
    },
    {
      judul: "Pendaftaran Hari Ini",
      jumlah: String(stats.pendaftaranHariIni),
      keterangan: "Pendaftaran masuk",
      icon: "▣",
      warna: "blue",
    },
    {
      judul: "Antrean Menunggu",
      jumlah: String(stats.antreanMenunggu),
      keterangan: "Menunggu pelayanan",
      icon: "◷",
      warna: "orange",
    },
    {
      judul: "Antrean Selesai",
      jumlah: String(stats.antreanSelesai),
      keterangan: "Sudah dilayani",
      icon: "✓",
      warna: "purple",
    },
  ];

  const filteredDoctors = doctors.filter(
    (d) =>
      d.nama.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      d.username.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      d.spesialisasi.toLowerCase().includes(doctorSearch.toLowerCase()),
  );

  const filteredPatients = patients.filter(
    (p) =>
      p.nama.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.nik.includes(patientSearch) ||
      p.username.toLowerCase().includes(patientSearch.toLowerCase()),
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-welcome">
        <div>
          <h1>Selamat Datang, Admin!</h1>
          <p>
            Kelola antrean harian, data dokter gigi, dan data pasien terdaftar.
          </p>
        </div>

        <div className="admin-date">
          <span>◷</span> Dashboard Pelayanan
        </div>
      </div>

      <div className="admin-stat-grid">
        {statistik.map((item) => (
          <div className="admin-stat-card" key={item.judul}>
            <div className={`admin-stat-icon ${item.warna}`}>{item.icon}</div>

            <div>
              <p>{item.judul}</p>
              <h2>{loading ? "..." : item.jumlah}</h2>
              <span>{item.keterangan}</span>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          style={{
            padding: "10px 18px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            background: activeTab === "overview" ? "#0f766e" : "#ffffff",
            color: activeTab === "overview" ? "#ffffff" : "#1f2937",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ▣ Ringkasan & Antrean
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("doctors")}
          style={{
            padding: "10px 18px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            background: activeTab === "doctors" ? "#0f766e" : "#ffffff",
            color: activeTab === "doctors" ? "#ffffff" : "#1f2937",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ✚ Data Dokter ({doctors.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("patients")}
          style={{
            padding: "10px 18px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            background: activeTab === "patients" ? "#0f766e" : "#ffffff",
            color: activeTab === "patients" ? "#ffffff" : "#1f2937",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ♙ Data Pasien ({patients.length})
        </button>
      </div>

      {feedback && (
        <div
          role="status"
          style={{
            padding: "12px 16px",
            borderRadius: "10px",
            marginBottom: "18px",
            background: feedback.type === "success" ? "#ecfdf5" : "#fef2f2",
            color: feedback.type === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${feedback.type === "success" ? "#a7f3d0" : "#fecaca"}`,
            fontWeight: 500,
          }}
        >
          {feedback.text}
        </div>
      )}

      {activeTab === "overview" && (
        <div className="admin-section-grid">
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Antrean Hari Ini</h2>
                <p>Ringkasan antrean pasien dari database</p>
              </div>

              <span className="admin-total-badge">{antrean.length} Pasien</span>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>No. Antrean</th>
                    <th>Nama Pasien</th>
                    <th>Dokter</th>
                    <th>Waktu</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center" }}>
                        Memuat data antrean...
                      </td>
                    </tr>
                  ) : antrean.length > 0 ? (
                    antrean.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.nomor}</strong>
                        </td>
                        <td>{item.nama}</td>
                        <td>{item.dokter}</td>
                        <td>{item.waktu}</td>
                        <td>
                          <span
                            className={`admin-queue-status ${item.status.toLowerCase()}`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center" }}>
                        Belum ada antrean untuk hari ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-panel admin-activity">
            <div className="admin-panel-heading">
              <div>
                <h2>Manajemen Cepat</h2>
                <p>Akses data dokter dan pasien</p>
              </div>
            </div>

            <div
              className="admin-info-item"
              onClick={() => setActiveTab("doctors")}
              style={{ cursor: "pointer" }}
            >
              <div className="admin-info-icon orange">✚</div>
              <div>
                <strong>Kelola Data Dokter</strong>
                <p>
                  Lihat daftar dokter, tambah dokter baru, atau edit profil.
                </p>
              </div>
            </div>

            <div
              className="admin-info-item"
              onClick={() => setActiveTab("patients")}
              style={{ cursor: "pointer" }}
            >
              <div className="admin-info-icon blue">♙</div>
              <div>
                <strong>Kelola Data Pasien</strong>
                <p>
                  Lihat pasien terdaftar, tambah pasien, atau perbarui
                  NIK/alamat.
                </p>
              </div>
            </div>

            <div
              className="admin-info-item"
              onClick={openCreateDoctor}
              style={{ cursor: "pointer" }}
            >
              <div className="admin-info-icon green">+</div>
              <div>
                <strong>+ Tambah Dokter Baru</strong>
                <p>Buat akun login dan profil dokter gigi baru.</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === "doctors" && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Daftar Dokter Gigi</h2>
              <p>Kelola akun dan spesialisasi dokter</p>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Cari nama / spesialisasi..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                }}
              />
              <button
                type="button"
                onClick={openCreateDoctor}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#0f766e",
                  color: "#ffffff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                + Tambah Dokter
              </button>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nama Dokter</th>
                  <th>Username</th>
                  <th>Spesialisasi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <strong>{doc.nama}</strong>
                      </td>
                      <td>{doc.username}</td>
                      <td>{doc.spesialisasi || "-"}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => openEditDoctor(doc)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid #0f766e",
                            background: "#f0fdfa",
                            color: "#0f766e",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                      Data dokter tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "patients" && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Daftar Pasien Terdaftar</h2>
              <p>Kelola identitas dan akun pasien klinik</p>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Cari nama / NIK / username..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                }}
              />
              <button
                type="button"
                onClick={openCreatePatient}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#0f766e",
                  color: "#ffffff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                + Tambah Pasien
              </button>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nama Pasien</th>
                  <th>NIK</th>
                  <th>No. Telepon</th>
                  <th>Jenis Kelamin</th>
                  <th>Alamat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((pasien) => (
                    <tr key={pasien.id}>
                      <td>
                        <strong>{pasien.nama}</strong>
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>
                          @{pasien.username}
                        </div>
                      </td>
                      <td>{pasien.nik}</td>
                      <td>{pasien.noTelp}</td>
                      <td>
                        {pasien.jenisKelamin === "LAKI_LAKI"
                          ? "Laki-laki"
                          : "Perempuan"}
                      </td>
                      <td>{pasien.alamat}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => openEditPatient(pasien)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid #0f766e",
                            background: "#f0fdfa",
                            color: "#0f766e",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      Data pasien tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {doctorModalOpen && (
        <div style={modalBackdropStyle}>
          <div style={modalCardStyle}>
            <h2 style={{ marginBottom: "14px" }}>
              {doctorMode === "create"
                ? "Tambah Dokter Baru"
                : "Edit Data Dokter"}
            </h2>

            <form
              onSubmit={handleSaveDoctor}
              style={{ display: "grid", gap: "12px" }}
            >
              <div>
                <label style={labelStyle}>Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  placeholder="Contoh: drg. Andini Putri"
                  value={doctorForm.nama}
                  onChange={(e) =>
                    setDoctorForm({ ...doctorForm, nama: e.target.value })
                  }
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Username *</label>
                <input
                  type="text"
                  placeholder="Contoh: drg_andini"
                  value={doctorForm.username}
                  onChange={(e) =>
                    setDoctorForm({ ...doctorForm, username: e.target.value })
                  }
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Spesialisasi</label>
                <input
                  type="text"
                  placeholder="Contoh: Dokter Gigi Umum / Ortodonsia"
                  value={doctorForm.spesialisasi}
                  onChange={(e) =>
                    setDoctorForm({
                      ...doctorForm,
                      spesialisasi: e.target.value,
                    })
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  {doctorMode === "create"
                    ? "Password (minimal 8 karakter) *"
                    : "Password Baru (kosongkan jika tidak diubah)"}
                </label>
                <input
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={doctorForm.password}
                  onChange={(e) =>
                    setDoctorForm({ ...doctorForm, password: e.target.value })
                  }
                  minLength={doctorMode === "create" ? 8 : undefined}
                  required={doctorMode === "create"}
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setDoctorModalOpen(false)}
                  style={cancelButtonStyle}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingDoctor}
                  style={submitButtonStyle}
                >
                  {savingDoctor ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {patientModalOpen && (
        <div style={modalBackdropStyle}>
          <div style={{ ...modalCardStyle, maxWidth: "560px" }}>
            <h2 style={{ marginBottom: "14px" }}>
              {patientMode === "create"
                ? "Tambah Pasien Baru"
                : "Edit Data Pasien"}
            </h2>

            <form
              onSubmit={handleSavePatient}
              style={{ display: "grid", gap: "12px" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <div>
                  <label style={labelStyle}>Nama Lengkap *</label>
                  <input
                    type="text"
                    value={patientForm.nama}
                    onChange={(e) =>
                      setPatientForm({ ...patientForm, nama: e.target.value })
                    }
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>NIK (16 Digit) *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={16}
                    minLength={16}
                    value={patientForm.nik}
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        nik: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <div>
                  <label style={labelStyle}>Username *</label>
                  <input
                    type="text"
                    value={patientForm.username}
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        username: e.target.value,
                      })
                    }
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>No. Telepon *</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={patientForm.noTelp}
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        noTelp: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "10px",
                }}
              >
                <div>
                  <label style={labelStyle}>Jenis Kelamin *</label>
                  <select
                    value={patientForm.jenisKelamin}
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        jenisKelamin: e.target.value as
                          | "LAKI_LAKI"
                          | "PEREMPUAN",
                      })
                    }
                    style={inputStyle}
                  >
                    <option value="LAKI_LAKI">Laki-laki</option>
                    <option value="PEREMPUAN">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Tempat Lahir *</label>
                  <input
                    type="text"
                    value={patientForm.tempatLahir}
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        tempatLahir: e.target.value,
                      })
                    }
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>Tanggal Lahir *</label>
                  <input
                    type="date"
                    value={patientForm.tanggalLahir}
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        tanggalLahir: e.target.value,
                      })
                    }
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Alamat Lengkap *</label>
                <input
                  type="text"
                  value={patientForm.alamat}
                  onChange={(e) =>
                    setPatientForm({ ...patientForm, alamat: e.target.value })
                  }
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>
                  {patientMode === "create"
                    ? "Password (minimal 8 karakter) *"
                    : "Password Baru (kosongkan jika tidak diubah)"}
                </label>
                <input
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={patientForm.password}
                  onChange={(e) =>
                    setPatientForm({ ...patientForm, password: e.target.value })
                  }
                  minLength={patientMode === "create" ? 8 : undefined}
                  required={patientMode === "create"}
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setPatientModalOpen(false)}
                  style={cancelButtonStyle}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingPatient}
                  style={submitButtonStyle}
                >
                  {savingPatient ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const modalBackdropStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px",
  zIndex: 50,
};

const modalCardStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "14px",
  padding: "24px",
  width: "100%",
  maxWidth: "460px",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  marginBottom: "4px",
  color: "#374151",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
};

const cancelButtonStyle: React.CSSProperties = {
  padding: "9px 16px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  color: "#374151",
  fontWeight: 600,
  cursor: "pointer",
};

const submitButtonStyle: React.CSSProperties = {
  padding: "9px 18px",
  borderRadius: "8px",
  border: "none",
  background: "#0f766e",
  color: "#ffffff",
  fontWeight: 600,
  cursor: "pointer",
};
