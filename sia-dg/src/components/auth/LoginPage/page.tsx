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
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setPesan(data.message || "Gagal melakukan login.");
        return;
      }

      setPesan(data.message || "Login berhasil! Mengarahkan ke dashboard...");

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setForm({
        username: "",
        password: "",
      });

      router.push(data.redirectUrl || "/patient/dashboard");
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
        <div className="register-heading">
          <div className="register-icon">✚</div>

          <h1>Login Sistem</h1>

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
          <Link href="/auth/register">Daftar sebagai Pasien</Link>
        </p>
      </section>
    </main>
  );
}
