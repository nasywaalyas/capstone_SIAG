"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    nama: "",
    username: "",
    telepon: "",
    nik: "",
    alamat: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "LAKI_LAKI",
    password: "",
    konfirmasiPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");
  const [lihatPassword, setLihatPassword] = useState(false);
  const [lihatKonfirmasi, setLihatKonfirmasi] = useState(false);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    // Membatasi input NIK dan telepon agar hanya menerima digit angka
    if (name === "nik" || name === "telepon") {
      const hanyaAngka = value.replace(/\D/g, "");
      setForm((data) => ({
        ...data,
        [name]: hanyaAngka,
      }));
      return;
    }

    setForm((data) => ({
      ...data,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.password !== form.konfirmasiPassword) {
      setPesan("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);
    setPesan("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setPesan(data.message || "Gagal melakukan registrasi.");
      } else {
        setPesan(data.message);
        // Mengosongkan form kembali setelah registrasi berhasil
        setForm({
          nama: "",
          username: "",
          telepon: "",
          nik: "",
          alamat: "",
          tempatLahir: "",
          tanggalLahir: "",
          jenisKelamin: "LAKI_LAKI",
          password: "",
          konfirmasiPassword: "",
        });
      }
    } catch {
      setPesan("Terjadi kesalahan koneksi ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-heading">
          <div className="register-icon">✚</div>

          <h1>Registrasi Pasien</h1>

          <p>Sistem Informasi Antrean Poli Gigi</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nama">Nama lengkap</label>

            <input
              id="nama"
              name="nama"
              type="text"
              placeholder="Masukkan nama lengkap"
              value={form.nama}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              name="username"
              type="text"
              placeholder="Masukkan username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telepon">Nomor telepon</label>

            <input
              id="telepon"
              name="telepon"
              type="tel"
              inputMode="numeric"
              placeholder="Masukkan nomor telepon"
              value={form.telepon}
              onChange={handleChange}
              autoComplete="tel"
              minLength={10}
              maxLength={15}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nik">NIK</label>

            <input
              id="nik"
              name="nik"
              type="text"
              inputMode="numeric"
              placeholder="Masukkan NIK 16 digit"
              value={form.nik}
              onChange={handleChange}
              minLength={16}
              maxLength={16}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="alamat">Alamat Lengkap</label>

            <input
              id="alamat"
              name="alamat"
              type="text"
              placeholder="Masukkan alamat lengkap"
              value={form.alamat}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tempatLahir">Tempat Lahir</label>

            <input
              id="tempatLahir"
              name="tempatLahir"
              type="text"
              placeholder="Masukkan tempat lahir"
              value={form.tempatLahir}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tanggalLahir">Tanggal Lahir</label>

            <input
              id="tanggalLahir"
              name="tanggalLahir"
              type="date"
              value={form.tanggalLahir}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="jenisKelamin">Jenis Kelamin</label>

            <select
              id="jenisKelamin"
              name="jenisKelamin"
              value={form.jenisKelamin}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="LAKI_LAKI">Laki-laki</option>
              <option value="PEREMPUAN">Perempuan</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={lihatPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setLihatPassword((sebelumnya) => !sebelumnya)}
                aria-label={
                  lihatPassword ? "Sembunyikan password" : "Lihat password"
                }
                aria-pressed={lihatPassword}
              >
                {lihatPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="konfirmasiPassword">Konfirmasi password</label>

            <div className="password-wrapper">
              <input
                id="konfirmasiPassword"
                name="konfirmasiPassword"
                type={lihatKonfirmasi ? "text" : "password"}
                placeholder="Ulangi password"
                value={form.konfirmasiPassword}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setLihatKonfirmasi((sebelumnya) => !sebelumnya)}
                aria-label={
                  lihatKonfirmasi
                    ? "Sembunyikan konfirmasi password"
                    : "Lihat konfirmasi password"
                }
                aria-pressed={lihatKonfirmasi}
              >
                {lihatKonfirmasi ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {pesan && (
            <p className="register-message" role="status">
              {pesan}
            </p>
          )}

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Memproses..." : "Daftar sebagai Pasien"}
          </button>
        </form>

        <p className="register-footer">
          Sudah mempunyai akun? <Link href={"/"}>Login di sini</Link>
        </p>
      </section>
    </main>
  );
}
