"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    telepon: "",
    password: "",
    konfirmasiPassword: "",
  });

  const [pesan, setPesan] = useState("");
  const [lihatPassword, setLihatPassword] = useState(false);
  const [lihatKonfirmasi, setLihatKonfirmasi] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.password !== form.konfirmasiPassword) {
      setPesan("Konfirmasi password tidak sama.");
      return;
    }

    setPesan(
      "Formulir berhasil divalidasi. Penyimpanan akun akan dihubungkan berikutnya."
    );
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
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telepon">Nomor telepon</label>

            <input
              id="telepon"
              name="telepon"
              type="tel"
              placeholder="Masukkan nomor telepon"
              value={form.telepon}
              onChange={handleChange}
              autoComplete="tel"
              required
            />
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
            <label htmlFor="konfirmasiPassword">
              Konfirmasi password
            </label>

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
                onClick={() =>
                  setLihatKonfirmasi((sebelumnya) => !sebelumnya)
                }
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

          <button type="submit" className="register-button">
            Daftar sebagai Pasien
          </button>
        </form>

        <p className="register-footer">
          Sudah mempunyai akun? <a href="/auth/login">Login di sini</a>
        </p>
      </section>
    </main>
  );
}