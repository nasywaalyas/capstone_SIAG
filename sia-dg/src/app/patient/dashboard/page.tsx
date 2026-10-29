"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Queue = {
  number: string;
  doctor: string;
  service: string;
  time: string;
  status: string;
};

const todayQueues: Queue[] = [
  {
    number: "A-012",
    doctor: "drg. Andini Putri",
    service: "Pemeriksaan Gigi",
    time: "09.30 WIB",
    status: "Menunggu",
  },
];

const tomorrowQueues: Queue[] = [
  {
    number: "A-018",
    doctor: "drg. Andini Putri",
    service: "Konsultasi Gigi",
    time: "10.00 WIB",
    status: "Terjadwal",
  },
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function getJakartaDate(offset = 0) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  const date = new Date(
    Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day) + offset,
      12
    )
  );

  return formatDate(date);
}

function isClinicOpen(date: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(date)
  );

  return hour >= 8 && hour < 20;
}

export default function PatientDashboard() {
  const [now, setNow] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<"today" | "tomorrow">("today");

  useEffect(() => {
    const updateClock = () => setNow(new Date());
    updateClock();

    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const queues = activeTab === "today" ? todayQueues : tomorrowQueues;

  return (
    <main className="page">
      <aside className="sidebar">
        <Link href="/patient/dashboard" className="brand">
          <span className="brandIcon">+</span>
          <span>
            <strong>SmileCare</strong>
            <small>Dental Clinic</small>
          </span>
        </Link>

        <div className="menuLabel">MENU UTAMA</div>

        <nav className="navigation">
          <Link
            href="/patient/dashboard"
            className="navItem navActive"
          >
            <span>▦</span> Dashboard
          </Link>

          <Link href="/patient/appointments" className="navItem">
            <span>▣</span> Reservasi Antrian
          </Link>

          <Link href="/patient/history" className="navItem">
            <span>◷</span> Riwayat Kunjungan
          </Link>
        </nav>

        <div className="sidebarBottom">
          <div className="helpCard">
            <div className="helpIcon">i</div>
            <strong>Butuh bantuan?</strong>
            <p>Hubungi petugas klinik untuk informasi lebih lanjut.</p>
          </div>

          <div className="sidebarFooter">
            <span className="onlineDot" />
            Sistem antrian aktif
          </div>
        </div>
      </aside>

      <section className="main">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Pasien / Dashboard</p>
            <h1>Dashboard Pasien</h1>
          </div>

          <div className="clock">
            <span className="clockIcon">◷</span>
            <div>
              <strong>{now ? formatTime(now) : "--:--:--"} WIB</strong>
              <small>Waktu Indonesia Barat</small>
            </div>
          </div>
        </header>

        <section className="welcome">
          <div className="welcomeContent">
            <span className="welcomeTag">SELAMAT DATANG</span>
            <h2>Senyum sehat dimulai dari sini.</h2>
            <p>
              Pantau antrian, periksa jadwal kunjungan, dan lakukan reservasi
              dengan mudah.
            </p>
            <Link href="/patient/appointments" className="primaryButton">
              + Reservasi Antrian
            </Link>
          </div>

          <div className="welcomeDecoration" aria-hidden="true">
            <span>+</span>
            <div className="tooth">✦</div>
          </div>
        </section>

        <section className="section">
          <div className="sectionHeading">
            <div>
              <h2>Jadwal Antrian</h2>
              <p>Pantau jadwal kunjungan klinik Anda.</p>
            </div>

            <span className="dateBadge">
              {now ? formatDate(now) : "Memuat tanggal..."}
            </span>
          </div>

          <div className="tabs">
            <button
              type="button"
              onClick={() => setActiveTab("today")}
              className={`tab ${activeTab === "today" ? "tabActive" : ""}`}
            >
              Antrian Hari Ini
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tomorrow")}
              className={`tab ${activeTab === "tomorrow" ? "tabActive" : ""}`}
            >
              Antrian Besok
            </button>
          </div>

          <div className="queueList">
            {queues.length > 0 ? (
              queues.map((queue) => (
                <article className="queueCard" key={queue.number}>
                  <div className="queueNumber">
                    <span>NOMOR ANTRIAN</span>
                    <strong>{queue.number}</strong>
                  </div>

                  <div className="queueInfo">
                    <strong>{queue.doctor}</strong>
                    <span>{queue.service}</span>
                    <span className="queueTime">◷ {queue.time}</span>
                  </div>

                  <span
                    className={`status ${
                      activeTab === "today"
                        ? "statusWaiting"
                        : "statusScheduled"
                    }`}
                  >
                    <span className="statusDot" />
                    {queue.status}
                  </span>
                </article>
              ))
            ) : (
              <div className="emptyState">
                <span className="emptyIcon">▣</span>
                <strong>Belum ada antrian</strong>
                <p>
                  Anda belum memiliki reservasi untuk{" "}
                  {activeTab === "today" ? "hari ini" : "besok"}.
                </p>
                <Link
                  href="/patient/appointments"
                  className="secondaryButton"
                >
                  Buat Reservasi
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="bottomGrid">
          <article className="infoCard">
            <div className="cardHeading">
              <div className="cardIcon">▦</div>
              <div>
                <h3>Informasi Hari Ini</h3>
                <p>Jadwal operasional klinik</p>
              </div>
            </div>

            <div className="infoRow">
              <span>Tanggal</span>
              <strong>{now ? formatDate(now) : "Memuat..."}</strong>
            </div>

            <div className="infoRow">
              <span>Jam buka</span>
              <strong>08.00 WIB</strong>
            </div>

            <div className="infoRow">
              <span>Jam tutup</span>
              <strong>20.00 WIB</strong>
            </div>

            <div className="openNotice">
              <span
                className="onlineDot"
                style={{
                  background:
                    now && isClinicOpen(now) ? "#36b88d" : "#d97757",
                }}
              />
              {now
                ? isClinicOpen(now)
                  ? "Klinik sedang buka"
                  : "Klinik sedang tutup"
                : "Memeriksa jam operasional..."}
            </div>
          </article>

          <article className="infoCard">
            <div className="cardHeading">
              <div className="cardIcon">◷</div>
              <div>
                <h3>Jadwal Besok</h3>
                <p>Persiapkan kunjungan berikutnya</p>
              </div>
            </div>

            <div className="tomorrowDate">{getJakartaDate(1)}</div>

            <p className="tomorrowDescription">
              Pastikan Anda datang sesuai jadwal reservasi dan membawa
              informasi yang diperlukan untuk pemeriksaan.
            </p>

            <Link href="/patient/appointments" className="textLink">
              Lihat reservasi <span>→</span>
            </Link>
          </article>
        </section>

        <footer className="footer">
          <span>
            © {now ? now.getFullYear() : "2026"} SmileCare Dental Clinic
          </span>
          <span>Pelayanan gigi yang nyaman dan terpercaya.</span>
        </footer>
      </section>
    </main>
  );
}
