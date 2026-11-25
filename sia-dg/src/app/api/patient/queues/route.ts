import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { StatusAntrian } from "@/generated/prisma/client";

function getJakartaDateRange() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  const year = Number(values.year);
  const month = Number(values.month) - 1;
  const day = Number(values.day);

  // Format UTC midnight agar cocok dengan tipe @db.Date di PostgreSQL
  const todayDate = new Date(Date.UTC(year, month, day));
  const tomorrowDate = new Date(Date.UTC(year, month, day + 1));

  return { todayDate, tomorrowDate };
}

function formatQueueTime(date: Date) {
  const formatted = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${formatted.replace(":", ".")} WIB`;
}

function formatStatusLabel(status: StatusAntrian) {
  const statusMap: Record<StatusAntrian, string> = {
    MENUNGGU: "Menunggu",
    DIVERIFIKASI: "Terjadwal",
    DIPANGGIL: "Dipanggil",
    DIPERIKSA: "Sedang Diperiksa",
    SELESAI: "Selesai",
    DIBATALKAN: "Dibatalkan",
  };

  return statusMap[status] ?? status;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const { todayDate, tomorrowDate } = getJakartaDateRange();

    // Jika userId dikirim (dari session/login), filter hanya milik pasien tersebut
    const patientFilter = userId ? { pasien: { userId } } : {};

    const [todayRecords, tomorrowRecords] = await Promise.all([
      prisma.antrian.findMany({
        where: {
          tanggal: todayDate,
          ...patientFilter,
        },
        include: {
          dokter: {
            include: {
              user: {
                select: { nama: true },
              },
            },
          },
        },
        orderBy: {
          nomorAntrian: "asc",
        },
      }),
      prisma.antrian.findMany({
        where: {
          tanggal: tomorrowDate,
          ...patientFilter,
        },
        include: {
          dokter: {
            include: {
              user: {
                select: { nama: true },
              },
            },
          },
        },
        orderBy: {
          nomorAntrian: "asc",
        },
      }),
    ]);

    const mapQueue = (item: (typeof todayRecords)[number]) => ({
      id: item.id,
      number: `A-${String(item.nomorAntrian).padStart(3, "0")}`,
      doctor: item.dokter?.user?.nama ?? "Menunggu penugasan dokter",
      service: item.keluhan || "Pemeriksaan Gigi",
      time: formatQueueTime(item.createdAt),
      status: formatStatusLabel(item.status),
      rawStatus: item.status,
    });

    return NextResponse.json({
      today: todayRecords.map(mapQueue),
      tomorrow: tomorrowRecords.map(mapQueue),
    });
  } catch (error) {
    console.error("Error mengambil data antrian:", error);
    return NextResponse.json(
      { message: "Gagal memuat data antrian dari database." },
      { status: 500 },
    );
  }
}
