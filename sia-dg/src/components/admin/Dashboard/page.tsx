
const statistik = [
  {
    judul: "Total Pasien",
    jumlah: "128",
    keterangan: "Pasien terdaftar",
    icon: "♙",
    warna: "green",
  },
  {
    judul: "Pendaftaran Hari Ini",
    jumlah: "24",
    keterangan: "Pendaftaran masuk",
    icon: "▣",
    warna: "blue",
  },
  {
    judul: "Antrean Menunggu",
    jumlah: "12",
    keterangan: "Menunggu pelayanan",
    icon: "◷",
    warna: "orange",
  },
  {
    judul: "Antrean Selesai",
    jumlah: "12",
    keterangan: "Sudah dilayani",
    icon: "✓",
    warna: "purple",
  },
];

const antrean = [
  {
    nomor: "A-001",
    nama: "Andi Saputra",
    dokter: "drg. Siti",
    waktu: "08.00",
    status: "Menunggu",
  },
  {
    nomor: "A-002",
    nama: "Budi Santoso",
    dokter: "drg. Siti",
    waktu: "08.30",
    status: "Dipanggil",
  },
  {
    nomor: "A-003",
    nama: "Dewi Lestari",
    dokter: "drg. Siti",
    waktu: "09.00",
    status: "Selesai",
  },
  {
    nomor: "A-004",
    nama: "Rina Amelia",
    dokter: "drg. Siti",
    waktu: "09.30",
    status: "Menunggu",
  },
];

export default function DashboardAdmin() {
  return (
    <div className="admin-dashboard">
      <div className="admin-welcome">
        <div>
          <h1>Selamat Datang, Admin!</h1>
          <p>
            Berikut ringkasan informasi pelayanan Poli Gigi hari ini.
          </p>
        </div>

        <div className="admin-date">
          <span>◷</span> Dashboard Pelayanan
        </div>
      </div>

      <div className="admin-stat-grid">
        {statistik.map((item) => (
          <div className="admin-stat-card" key={item.judul}>
            <div className={`admin-stat-icon ${item.warna}`}>
              {item.icon}
            </div>

            <div>
              <p>{item.judul}</p>
              <h2>{item.jumlah}</h2>
              <span>{item.keterangan}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-section-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Antrean Hari Ini</h2>
              <p>Ringkasan antrean pasien</p>
            </div>

            <span className="admin-total-badge">
              4 Pasien
            </span>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>No. Antrean</th>
                  <th>Nama Pasien</th>
                  <th>Dokter</th>
                  <th>Waktu</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {antrean.map((item) => (
                  <tr key={item.nomor}>
                    <td><strong>{item.nomor}</strong></td>
                    <td>{item.nama}</td>
                    <td>{item.dokter}</td>
                    <td>{item.waktu}</td>
                    <td>
                      <span
                        className={`admin-queue-status ${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-panel admin-activity">
          <div className="admin-panel-heading">
            <div>
              <h2>Informasi Pelayanan</h2>
              <p>Ringkasan aktivitas</p>
            </div>
          </div>

          <div className="admin-info-item">
            <div className="admin-info-icon green">✓</div>
            <div>
              <strong>Pelayanan Pasien</strong>
              <p>Data antrean ditampilkan di dashboard.</p>
            </div>
          </div>

          <div className="admin-info-item">
            <div className="admin-info-icon blue">♙</div>
            <div>
              <strong>Data Pasien</strong>
              <p>Kelola informasi pasien terdaftar.</p>
            </div>
          </div>

          <div className="admin-info-item">
            <div className="admin-info-icon orange">◷</div>
            <div>
              <strong>Jadwal Dokter</strong>
              <p>Informasi jadwal pelayanan dokter.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
