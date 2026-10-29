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

function getJakartaDateInput() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
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
  const [today, setToday] = useState("");
  const [clock, setClock] = useState("--:--");
  const [date, setDate] = useState("");
  const [complaint, setComplaint] = useState("");
  const [type, setType] = useState("");
  const [otherDetails, setOtherDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      setToday(getJakartaDateInput());
      setClock(formatJakartaTime(new Date()));
    };

    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const selectedType = examinationTypes.find((item) => item.value === type);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="appointmentPage">
      <div className="appointmentContainer">
        <header className="appointmentTopbar">
          <div>
            <Link href="/patient/dashboard" className="appointmentBack">
              <span aria-hidden="true">←</span> Kembali ke Dashboard
            </Link>
            <p className="appointmentEyebrow" style={{ marginTop: 22 }}>
              SMILECARE DENTAL CLINIC
            </p>
            <h1 className="appointmentTitle">Reservasi Antrian</h1>
            <p className="appointmentSubtitle">
              Isi formulir berikut untuk mengajukan jadwal kunjungan ke dokter gigi.
            </p>
          </div>

          <div className="appointmentTimeBadge">
            Waktu saat ini: <strong>{clock} WIB</strong>
          </div>
        </header>

        {submitted && (
          <div className="appointmentSuccess" role="status">
            <strong>Formulir reservasi berhasil diisi.</strong>
            Ini masih berupa demo tampilan. Reservasi belum tersimpan ke database
            dan belum menjadi jadwal kunjungan resmi.
          </div>
        )}

        <div className="appointmentLayout">
          <form className="appointmentForm" onSubmit={handleSubmit}>
            <section className="appointmentFormSection">
              <div className="appointmentSectionHeading">
                <span className="appointmentStep">1</span>
                <div>
                  <h2>Hari dan Tanggal Kunjungan</h2>
                  <p>Pilih tanggal yang Anda inginkan untuk melakukan pemeriksaan.</p>
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
                  min={today || undefined}
                  onChange={(event) => {
                    setDate(event.target.value);
                    setSubmitted(false);
                  }}
                  required
                />
                <span className="appointmentHelpText">
                  Tanggal yang dipilih belum menjamin ketersediaan jadwal. Petugas perlu
                  mengonfirmasi reservasi Anda.
                </span>
              </div>
            </section>

            <section className="appointmentFormSection">
              <div className="appointmentSectionHeading">
                <span className="appointmentStep">2</span>
                <div>
                  <h2>Keluhan yang Dirasakan</h2>
                  <p>Ceritakan keluhan utama agar petugas memahami kebutuhan Anda.</p>
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
                    setSubmitted(false);
                  }}
                  placeholder="Contoh: gigi geraham terasa ngilu saat minum dingin..."
                  minLength={5}
                  maxLength={1000}
                  required
                />
                <span className="appointmentHelpText">
                  Tulis keluhan secara singkat dan jelas. Maksimal 1.000 karakter.
                </span>
              </div>
            </section>

            <section className="appointmentFormSection">
              <div className="appointmentSectionHeading">
                <span className="appointmentStep">3</span>
                <div>
                  <h2>Jenis Pemeriksaan</h2>
                  <p>Pilih jenis layanan yang paling sesuai dengan kebutuhan Anda.</p>
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
                        setSubmitted(false);
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
                        setSubmitted(false);
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

            <button className="appointmentSubmit" type="submit">
              Kirim Pengajuan Reservasi <span aria-hidden="true">→</span>
            </button>

            <p className="appointmentDisclaimer">
              Pengajuan ini bukan konfirmasi jadwal. Jadwal resmi mengikuti konfirmasi
              dari pihak klinik.
            </p>
          </form>

          <aside className="appointmentAside">
            <article className="appointmentAsideCard">
              <div className="appointmentAsideIcon" aria-hidden="true">◷</div>
              <h3>Jam Operasional</h3>
              <p>Silakan pilih tanggal kunjungan dan tunggu konfirmasi jadwal dari klinik.</p>

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
              <div className="appointmentAsideIcon" aria-hidden="true">i</div>
              <h3>Sebelum Reservasi</h3>
              <p>
                Pilih jenis pemeriksaan berdasarkan kebutuhan Anda. Dokter gigi akan
                menentukan tindakan yang tepat setelah pemeriksaan langsung.
              </p>
            </article>

            <div className="appointmentInfoNotice">
              Jika mengalami nyeri hebat, pembengkakan yang cepat membesar, demam,
              atau kesulitan bernapas/menelan, cari pertolongan medis segera dan
              jangan menunggu tanggal reservasi.
            </div>
          </aside>
        </div>

        <footer className="appointmentFooter">
          <span>© {new Date().getFullYear()} SmileCare Dental Clinic</span>
          <span>Formulir reservasi pasien</span>
        </footer>
      </div>
    </main>
  );
}
