
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuClass = (href: string) =>
    `admin-menu-item ${
      pathname === href ? "active" : ""
    }`;

  const menu = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: "▦",
    },
    {
      label: "Data Pasien",
      href: "/admin/patients",
      icon: "♙",
    },
    {
      label: "Verifikasi Pendaftaran",
      href: "/admin/verifications",
      icon: "☑",
    },
    {
      label: "Data Antrean",
      href: "/admin/queues",
      icon: "☷",
    },
  ];

  const pelayanan = [
    {
      label: "Jadwal Dokter",
      href: "/admin/schedules",
      icon: "▤",
    },
    {
      label: "Laporan",
      href: "/admin/reports",
      icon: "▥",
    },
  ];

  const currentMenu = [...menu, ...pelayanan].find(
    (item) => item.href === pathname
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">✚</div>
          <div>
            <h2>SIAG</h2>
            <span>Poli Gigi</span>
          </div>
        </div>

        <div className="admin-menu">
          <p className="admin-menu-label">MENU UTAMA</p>

          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={menuClass(item.href)}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <p className="admin-menu-label admin-menu-spacer">
            PELAYANAN
          </p>

          {pelayanan.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={menuClass(item.href)}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="admin-sidebar-footer">
          <div className="admin-avatar">A</div>
          <div>
            <strong>Administrator</strong>
            <span>Admin SIAG</span>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h3>{currentMenu?.label ?? "Dashboard Admin"}</h3>
            <p>Sistem Informasi Antrean Poli Gigi</p>
          </div>

          <div className="admin-topbar-right">
            <span className="admin-status">
              <span className="admin-status-dot"></span>
              Sistem Aktif
            </span>
            <div className="admin-top-avatar">A</div>
          </div>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}
