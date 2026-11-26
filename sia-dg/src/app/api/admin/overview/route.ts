import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { StatusAntrian } from "@/generated/prisma/client";

function getJakartaTodayUTC() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return new Date(
    Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day)),
  );
}

function formatQueueTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(":", ".");
}

function formatStatusLabel(status: StatusAntrian) {
  const map: Record<StatusAntrian, string> = {
    MENUNGGU: "Menunggu",
    DIVERIFIKASI: "Diverifikasi",
    DIPANGGIL: "Dipanggil",
    DIPERIKSA: "Diperiksa",
    SELESAI: "Selesai",
    DIBATALKAN: "Dibatalkan",
  };
  return map[status] ?? status;
}

export async function GET() {
  try {
    const todayDate = getJakartaTodayUTC();

    const [totalPasien, todayQueues] = await Promise.all([
      prisma.pasien.count(),
      prisma.antrian.findMany({
        where: { tanggal: todayDate },
        include: {
          pasien: {
            include: { user: { select: { nama: true } } },
          },
          dokter: {
            include: { user: { select: { nama: true } } },
          },
        },
        orderBy: { nomorAntrian: "asc" },
      }),
    ]);

    const menungguCount = todayQueues.filter(
      (q) =>
        q.status === "MENUNGGU" ||
        q.status === "DIVERIFIKASI" ||
        q.status === "DIPANGGIL" ||
        q.status === "DIPERIKSA",
    ).length;

    const selesaiCount = todayQueues.filter(
      (q) => q.status === "SELESAI",
    ).length;

    return NextResponse.json({
      stats: {
        totalPasien,
        pendaftaranHariIni: todayQueues.length,
        antreanMenunggu: menungguCount,
        antreanSelesai: selesaiCount,
      },
      antrean: todayQueues.map((q) => ({
        id: q.id,
        nomor: `A-${String(q.nomorAntrian).padStart(3, "0")}`,
        nama: q.pasien.user.nama,
        dokter: q.dokter?.user.nama ?? "Belum ditentukan",
        waktu: formatQueueTime(q.createdAt),
        status: formatStatusLabel(q.status),
      })),
    });
  } catch (error) {
    console.error("Error admin overview:", error);
    return NextResponse.json(
      { message: "Gagal memuat ringkasan dashboard admin." },
      { status: 500 },
    );
  }
}
