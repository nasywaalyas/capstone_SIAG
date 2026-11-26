
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
  const [lihatPassword, setLihatPassword] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((data) => ({
      ...data,
      [name]: value,
    }));

    if (pesan) {
      setPesan("");
    }
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

      // Mengambil role pengguna dari backend
      const role = String(
        data.user?.role ?? data.role ?? ""
      ).toUpperCase();

      // Menentukan dashboard berdasarkan role
      let redirectUrl: string;

      switch (role) {
        case "ADMIN":
          redirectUrl = "/admin";
          break;

        case "DOCTOR":
          redirectUrl = "/doctor/dashboard";
          break;

        case "PATIENT":
          redirectUrl = "/patient/dashboard";
          break;

        default:
          setPesan("Role pengguna tidak dikenali.");
          return;
      }

      // Menyimpan informasi pengguna non-sensitif
      // untuk kompatibilitas dengan frontend dari main
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.user.id,
            username: data.user.username,
            name: data.user.name,
            role,
          })
        );
      }

      // Pesan berhasil login
      setPesan(
        data.message ||
          "Login berhasil! Mengarahkan ke dashboard..."
      );

      // Mengosongkan form
      setForm({
        username: "",
        password: "",
      });

      // Mengarahkan pengguna ke dashboard
      router.replace(redirectUrl);
      router.refresh();

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

          {/* USERNAME */}
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

          {/* PASSWORD */}
          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-wrapper">

              <input
                id="password"
                name="password"
                type={lihatPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setLihatPassword((sebelumnya) => !sebelumnya)
                }
                aria-label={
                  lihatPassword
                    ? "Sembunyikan password"
                    : "Lihat password"
                }
                aria-pressed={lihatPassword}
              >
                {lihatPassword ? "🙈" : "👁"}
              </button>

            </div>
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
