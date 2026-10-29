"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [pesan, setPesan] = useState("");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPesan(
      "Tampilan login berhasil. Fitur autentikasi akan dihubungkan berikutnya."
    );
  }

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-heading">
          <div className="register-icon">✚</div>

          <h1>Login Pasien</h1>

          <p>Sistem Informasi Antrean Poli Gigi</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Masukkan email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Masukkan password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {pesan && (
            <p className="register-message" role="status">
              {pesan}
            </p>
          )}

          <button type="submit" className="register-button">
            Login
          </button>
        </form>

        <p className="register-footer">
          Belum mempunyai akun?{" "}
          <a href="/auth/register">Daftar sebagai Pasien</a>
        </p>
      </section>
    </main>
  );
}