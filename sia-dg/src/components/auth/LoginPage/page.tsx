
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);

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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      // Jika login gagal
      if (!response.ok) {
        setPesan(data.message || "Username atau password salah.");
        return;
      }

      // Mengambil role dari backend
      const role = String(
        data.user?.role ?? data.role ?? ""
      ).toUpperCase();

      // Menentukan dashboard berdasarkan role
      switch (role) {
        case "ADMIN":
          setPesan("Login admin berhasil!");
          router.replace("/admin");
          break;

        case "DOCTOR":
          setPesan("Login dokter berhasil!");
          router.replace("/doctor/dashboard");
          break;

        case "PATIENT":
          setPesan("Login pasien berhasil!");
          router.replace("/dashboard");
          break;

        default:
          setPesan("Role pengguna tidak dikenali.");
          break;
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

        {/* HEADER LOGIN */}
        <div className="register-heading">
          <div className="register-icon">✚</div>

          <h1>Login SIAG</h1>

          <p>Sistem Informasi Antrean Poli Gigi</p>
        </div>

        {/* FORM LOGIN */}
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

          {/* PESAN LOGIN */}
          {pesan && (
            <p className="register-message" role="status">
              {pesan}
            </p>
          )}

          {/* TOMBOL LOGIN */}
          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </button>

        </form>

        {/* REGISTRASI KHUSUS PASIEN */}
        <p className="register-footer">
          Belum mempunyai akun?{" "}
          <Link href="/auth/register">
            Daftar sebagai Pasien
          </Link>
        </p>

      </section>
    </main>
  );
}