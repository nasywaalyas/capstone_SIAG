"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

const examinationTypes = [
  {
    value: "Scaling",
    title: "Scaling",
    description:
      "Pembersihan karang gigi dan plak yang menempel pada permukaan gigi. Cocok untuk menjaga kebersihan gigi dan kesehatan gusi.",
  },
  {
    value: "Tambal Gigi",
    title: "Tambal Gigi",
    description:
      "Pemeriksaan dan penambalan gigi berlubang atau gigi yang mengalami kerusakan tertentu sesuai hasil pemeriksaan dokter gigi.",
  },
  {
    value: "Cabut Gigi",
    title: "Cabut Gigi",
    description:
      "Konsultasi untuk gigi yang perlu dicabut. Keputusan pencabutan dilakukan dokter gigi setelah pemeriksaan.",
  },
  {
    value: "Perawatan Gigi",
    title: "Perawatan Gigi",
    description:
      "Konsultasi perawatan untuk keluhan gigi atau gusi, termasuk evaluasi kondisi dan pilihan perawatan yang sesuai.",
  },
  {
    value: "Ortodonto",
    title: "Ortodonto / Behel",
    description:
      "Konsultasi susunan gigi dan gigitan, termasuk pemeriksaan awal bila ingin menggunakan behel atau perawatan ortodonti.",
  },
  {
    value: "Pemeriksaan lainnya",
    title: "Pemeriksaan lainnya",
    description:
      "Pilih ini jika kebutuhan Anda belum tercantum, misalnya konsultasi keluhan gigi atau pemeriksaan awal.",
  },
];

function getJakartaDateInfo(offsetDays = 0) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  const hour = Number(values.hour);
  const targetDate = new Date(
    Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day) + offsetDays,
      12,
    ),
  );

  const year = targetDate.getUTCFullYear();
  const month = String(targetDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(targetDate.getUTCDate()).padStart(2, "0");

  return {
    dateInput: `${year}-${month}-${day}`,
    hour,
    isClosedToday: hour >= 20,
    isOpenNow: hour >= 8 && hour < 20,
  };
}

function formatJakartaTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export default function PatientAppointmentsPage() {
  const [minDate, setMinDate] = useState("");
  const [todayStr, setTodayStr] = useState("");
  const [isClosedToday, setIsClosedToday] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState<boolean | null>(null);

  const [clock, setClock] = useState("--:--");
  const [date, setDate] = useState("");
  const [complaint, setComplaint] = useState("");
  const [type, setType] = useState("");
  const [otherDetails, setOtherDetails] = useState("");
  const [year, setYear] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedQueue, setSavedQueue] = useState<{
    queueNumber: string;
    date: string;
  } | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());

    const updateClockAndSchedule = () => {
      const todayInfo = getJakartaDateInfo(0);
      const tomorrowInfo = getJakartaDateInfo(1);

      setTodayStr(todayInfo.dateInput);
      setIsClosedToday(todayInfo.isClosedToday);
      setIsOpenNow(todayInfo.isOpenNow);
      setMinDate(
        todayInfo.isClosedToday ? tomorrowInfo.dateInput : todayInfo.dateInput,
      );
      setClock(formatJakartaTime(new Date()));
    };

    updateClockAndSchedule();
    const timer = window.setInterval(updateClockAndSchedule, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Reset pilihan tanggal jika pengguna sempat memilih hari ini lalu melewati pukul 20.00 WIB
  useEffect(() => {
    if (isClosedToday && date && date === todayStr) {
      setDate("");
      setErrorMessage(
        "Jam operasional hari ini sudah tutup (pukul 20.00 WIB). Silakan pilih tanggal mulai besok.",
      );
    }
  }, [isClosedToday, date, todayStr]);

  const selectedType = examinationTypes.find((item) => item.value === type);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSavedQueue(null);

    const currentInfo = getJakartaDateInfo(0);
    if (currentInfo.isClosedToday && date <= currentInfo.dateInput) {
      setErrorMessage(
        "Jam operasional hari ini sudah tutup (pukul 20.00 WIB). Silakan pilih tanggal mulai besok.",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/patient/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          complaint,
          type,
          otherDetails,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Gagal menyimpan reservasi.");
        return;
      }

      setSavedQueue({
        queueNumber: result.data.queueNumber,
        date: result.data.date,
      });

      setDate("");
      setComplaint("");
      setType("");
      setOtherDetails("");
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="appointmentPage">
      <div className="appointmentContainer">
        <header className="appointmentTopbar">
          <div>
            <Link href="/dashboard" className="appointmentBack">
              <span aria-hidden="true">←</span> Kembali ke Dashboard
            </Link>
            <p className="appointmentEyebrow" style={{ marginTop: 22 }}>
              SMILECARE DENTAL CLINIC
            </p>
            <h1 className="appointmentTitle">Reservasi Antrian</h1>
            <p className="appointmentSubtitle">
              Isi formulir berikut untuk mengajukan jadwal kunjungan ke dokter
              gigi.
            </p>
          </div>

          <div className="appointmentTimeBadge">
            Waktu saat ini: <strong>{clock} WIB</strong>
          </div>
        </header>

        {savedQueue && (
          <div className="appointmentSuccess" role="status">
            <strong>
              Reservasi berhasil diajukan! Nomor Antrian Anda:{" "}
              {savedQueue.queueNumber}
            </strong>
            Jadwal kunjungan tanggal {savedQueue.date} telah tersimpan ke
            database dengan status Menunggu konfirmasi klinik.
          </div>
        )}

        {errorMessage && (
          <div
            className="appointmentInfoNotice"
            role="alert"
            style={{ marginBottom: 20 }}
          >
            <strong>Perhatian:</strong> {errorMessage}
          </div>
        )}

        <div className="appointmentLayout">
          <form className="appointmentForm" onSubmit={handleSubmit}>
            <section className="appointmentFormSection">
              <div className="appointmentSectionHeading">
                <span className="appointmentStep">1</span>
                <div>
                  <h2>Hari dan Tanggal Kunjungan</h2>
                  <p>
                    Pilih tanggal yang Anda inginkan untuk melakukan
                    pemeriksaan.
                  </p>
                </div>
              </div>

              <div className="appointmentField">
                <label htmlFor="appointment-date">
                  Hari/Tanggal <span className="appointmentRequired">*</span>
                </label>
                <input
                  id="appointment-date"
                  className="appointmentInput"
                  type="date"
                  value={date}
                  min={minDate || undefined}
                  onChange={(event) => {
                    const chosenDate = event.target.value;
                    setSavedQueue(null);

                    if (minDate && chosenDate && chosenDate < minDate) {
                      setDate("");
                      setErrorMessage(
                        isClosedToday
                          ? "Jam operasional hari ini sudah tutup (pukul 20.00 WIB). Silakan pilih tanggal mulai besok."
                          : "Tanggal kunjungan tidak boleh sebelum hari ini.",
                      );
                      return;
                    }

                    setDate(chosenDate);
                    setErrorMessage("");
                  }}
                  required
                />
                <span className="appointmentHelpText">
                  {isClosedToday
                    ? "Klinik sudah tutup untuk hari ini (lewat pukul 20.00 WIB). Pilihan tanggal dibuka mulai besok."
                    : "Tanggal yang dipilih belum menjamin ketersediaan jadwal. Petugas perlu mengonfirmasi reservasi Anda."}
                </span>
              </div>
            </section>

            <section className="appointmentFormSection">
              <div className="appointmentSectionHeading">
                <span className="appointmentStep">2</span>
                <div>
                  <h2>Keluhan yang Dirasakan</h2>
                  <p>
                    Ceritakan keluhan utama agar petugas memahami kebutuhan
                    Anda.
                  </p>
                </div>
              </div>

              <div className="appointmentField">
                <label htmlFor="complaint">
                  Keluhan <span className="appointmentRequired">*</span>
                </label>
                <textarea
                  id="complaint"
                  className="appointmentTextarea"
                  value={complaint}
                  onChange={(event) => {
                    setComplaint(event.target.value);
                    setSavedQueue(null);
                    setErrorMessage("");
                  }}
                  placeholder="Contoh: gigi geraham terasa ngilu saat minum dingin..."
                  minLength={5}
                  maxLength={1000}
                  required
                />
                <span className="appointmentHelpText">
                  Tulis keluhan secara singkat dan jelas. Maksimal 1.000
                  karakter.
                </span>
              </div>
            </section>

            <section className="appointmentFormSection">
              <div className="appointmentSectionHeading">
                <span className="appointmentStep">3</span>
                <div>
                  <h2>Jenis Pemeriksaan</h2>
                  <p>
                    Pilih jenis layanan yang paling sesuai dengan kebutuhan
                    Anda.
                  </p>
                </div>
              </div>

              <div className="appointmentTypes">
                {examinationTypes.map((item) => (
                  <label
                    key={item.value}
                    className={`appointmentTypeOption ${
                      type === item.value ? "appointmentTypeOptionSelected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="examinationType"
                      value={item.value}
                      checked={type === item.value}
                      onChange={() => {
                        setType(item.value);
                        setSavedQueue(null);
                        setErrorMessage("");
                      }}
                      required
                    />
                    <span className="appointmentTypeCopy">
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </span>
                  </label>
                ))}
              </div>

              {selectedType && (
                <div className="appointmentOtherField">
                  <span className="appointmentLabel">
                    {type === "Pemeriksaan lainnya"
                      ? "Jelaskan pemeriksaan yang dibutuhkan"
                      : `Catatan untuk ${selectedType.title} (opsional)`}
                  </span>
                  <div className="appointmentField">
                    <textarea
                      className="appointmentTextarea"
                      value={otherDetails}
                      onChange={(event) => {
                        setOtherDetails(event.target.value);
                        setSavedQueue(null);
                        setErrorMessage("");
                      }}
                      placeholder={
                        type === "Pemeriksaan lainnya"
                          ? "Tuliskan jenis pemeriksaan atau kebutuhan Anda..."
                          : "Tambahkan informasi yang perlu diketahui petugas..."
                      }
                      required={type === "Pemeriksaan lainnya"}
                      maxLength={500}
                    />
                  </div>
                </div>
              )}
            </section>

            <button
              className="appointmentSubmit"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                "Menyimpan Pengajuan..."
              ) : (
                <>
                  Kirim Pengajuan Reservasi <span aria-hidden="true">→</span>
                </>
              )}
            </button>

            <p className="appointmentDisclaimer">
              Pengajuan ini bukan konfirmasi jadwal. Jadwal resmi mengikuti
              konfirmasi dari pihak klinik.
            </p>
          </form>

          <aside className="appointmentAside">
            <article className="appointmentAsideCard">
              <div className="appointmentAsideIcon" aria-hidden="true">
                ◷
              </div>
              <h3>Jam Operasional</h3>
              <p>
                {isOpenNow === null
                  ? "Memeriksa status operasional klinik..."
                  : isOpenNow
                    ? "Klinik sedang buka. Reservasi hari ini masih tersedia."
                    : isClosedToday
                      ? "Klinik sudah tutup untuk hari ini. Reservasi dibuka untuk besok dan hari berikutnya."
                      : "Klinik belum buka (buka pukul 08.00 WIB). Reservasi untuk hari ini sudah dapat diajukan."}
              </p>

              <div className="appointmentHours">
                <div className="appointmentHoursRow">
                  <span>Jam buka</span>
                  <strong>08.00 WIB</strong>
                </div>
                <div className="appointmentHoursRow">
                  <span>Jam tutup</span>
                  <strong>20.00 WIB</strong>
                </div>
                <div className="appointmentHoursRow">
                  <span>Waktu saat ini</span>
                  <strong>{clock} WIB</strong>
                </div>
              </div>
            </article>

            <article className="appointmentAsideCard">
              <div className="appointmentAsideIcon" aria-hidden="true">
                i
              </div>
              <h3>Sebelum Reservasi</h3>
              <p>
                Pilih jenis pemeriksaan berdasarkan kebutuhan Anda. Dokter gigi
                akan menentukan tindakan yang tepat setelah pemeriksaan
                langsung.
              </p>
            </article>

            <div className="appointmentInfoNotice">
              Jika mengalami nyeri hebat, pembengkakan yang cepat membesar,
              demam, atau kesulitan bernapas/menelan, cari pertolongan medis
              segera dan jangan menunggu tanggal reservasi.
            </div>
          </aside>
        </div>

        <footer className="appointmentFooter">
          <span>© {year ? year : "2026"} SmileCare Dental Clinic</span>
          <span>Formulir reservasi pasien</span>
        </footer>
      </div>
    </main>
  );
}
