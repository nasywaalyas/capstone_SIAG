
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Role = "admin" | "doctor";

export default function StaffLogin({ role }: { role: Role }) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = role === "admin";
  const title = isAdmin ? "Admin" : "Dokter";

  const dashboard = isAdmin
    ? "/admin"
    : "/doctor/dashboard";

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
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPesan(data.message || "Username atau password salah.");
        return;
      }

      const userRole = String(
        data.user?.role ?? data.role ?? ""
      ).toLowerCase();

      if (!userRole) {
        setPesan("Role akun belum dikirimkan oleh server.");
        return;
      }

      if (userRole !== role) {
        setPesan(`Akun ini tidak memiliki akses sebagai ${title}.`);
        return;
      }

      setPesan("Login berhasil!");

      router.replace(dashboard);

    } catch {
      setPesan("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className={`staff-auth-page ${
        isAdmin ? "staff-theme-admin" : "staff-theme-doctor"
      }`}
    >

      {/* BAGIAN KIRI */}
      <section className="staff-auth-banner">

        <div className="staff-brand">
          <div className="staff-brand-icon">✚</div>

          <div>
            <h1>SIAG</h1>
            <p>Sistem Informasi Antrean Poli Gigi</p>
          </div>
        </div>

        <div className="staff-banner-content">

          <span className="staff-portal">
            Portal {title}
          </span>

          <h2>
            {isAdmin
              ? "Kelola pelayanan dengan lebih efisien."
              : "Pelayanan terbaik untuk setiap pasien."}
          </h2>

          <p>
            {isAdmin
              ? "Kelola data pasien, antrean, jadwal dokter, dan laporan pelayanan dalam satu sistem."
              : "Kelola pemeriksaan pasien, diagnosis, tindakan, serta riwayat pemeriksaan secara terintegrasi."}
          </p>

          <ul>
            {isAdmin ? (
              <>
                <li>✓ Pengelolaan data pasien</li>
                <li>✓ Verifikasi pendaftaran</li>
                <li>✓ Pengelolaan antrean dan jadwal</li>
                <li>✓ Laporan pelayanan</li>
              </>
            ) : (
              <>
                <li>✓ Melihat antrean pasien</li>
                <li>✓ Melihat data pasien</li>
                <li>✓ Mencatat diagnosis dan tindakan</li>
                <li>✓ Melihat riwayat pemeriksaan</li>
              </>
            )}
          </ul>

        </div>

        <p className="staff-copyright">
          SIAG — Sistem Informasi Antrean Poli Gigi
        </p>

      </section>

      {/* BAGIAN KANAN */}
      <section className="staff-auth-content">

        <div className="staff-auth-card">

          <div className="staff-auth-heading">

            <div className="staff-auth-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                {isAdmin ? (
                  <>
                    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                    <path d="m9 12 2 2 4-4" />
                  </>
                ) : (
                  <>
                    <path d="M5 3v7a5 5 0 0 0 10 0V3" />
                    <path d="M8 3H3M17 3h-4" />
                    <path d="M10 15v2a5 5 0 0 0 10 0v-3" />
                    <circle cx="20" cy="11" r="3" />
                  </>
                )}
              </svg>
            </div>

            <h1>Login {title}</h1>

            <p>Silakan masuk menggunakan akun Anda.</p>

          </div>

          {/* FORM LOGIN */}
          <form
            onSubmit={handleSubmit}
            className="staff-auth-form"
          >

            <div className="staff-form-group">
              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="staff-form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="staff-password-wrapper">

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="staff-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-pressed={showPassword}
                >
                  {showPassword ? "Tutup" : "Lihat"}
                </button>

              </div>

            </div>

            {pesan && (
              <p className="staff-auth-message" role="status">
                {pesan}
              </p>
            )}

            <button
              type="submit"
              className="staff-submit-button"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk ke Dashboard"}
            </button>

          </form>

          {/* NAVIGASI */}
          <div className="staff-auth-footer">

            <Link
              href={
                isAdmin
                  ? "/auth/doctor/login"
                  : "/auth/admin/login"
              }
            >
              {isAdmin
                ? "Masuk sebagai Dokter"
                : "Masuk sebagai Admin"}
            </Link>

            <Link href="/" className="staff-back-link">
              ← Kembali ke Login Pasien
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}