"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter untuk navigasi

export default function LoginPage() {
  const router = useRouter(); // Inisialisasi router

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false); // State untuk tombol loading

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((data) => ({
      ...data,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setPesan("");

    try {
      // Memanggil API login
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        // Jika gagal (contoh: username/password salah)
        setPesan(data.message || "Gagal melakukan login.");
      } else {
        // Jika sukses
        setPesan("Login berhasil! Mengarahkan ke dashboard...");

        // Pindah ke halaman dashboard
        // Gunakan data.redirectUrl jika Anda ingin arahannya dinamis sesuai Role (dari API)
        // Atau ketik "/dashboard" jika Anda hanya punya 1 halaman dashboard general
        router.push("/dashboard");
      }
    } catch {
      setPesan("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
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

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="register-footer">
          Belum mempunyai akun?{" "}
          <Link href={"/auth/register"}>Daftar sebagai Pasien</Link>
        </p>
      </section>
    </main>
  );
}
