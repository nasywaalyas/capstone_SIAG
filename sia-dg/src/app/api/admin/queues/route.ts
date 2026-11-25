import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { StatusAntrian } from "@/generated/prisma/client";

type StatusAntreanUI =
  | "Menunggu"
  | "Dipanggil"
  | "Dalam Pemeriksaan"
  | "Selesai"
  | "Batal";

function mapStatusToUI(status: StatusAntrian): StatusAntreanUI {
  switch (status) {
    case "DIPANGGIL":
      return "Dipanggil";
    case "DIPERIKSA":
      return "Dalam Pemeriksaan";
    case "SELESAI":
      return "Selesai";
    case "DIBATALKAN":
      return "Batal";
    case "MENUNGGU":
    case "DIVERIFIKASI":
    default:
      return "Menunggu";
  }
}

function formatWaktuWIB(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(".", ":");
}

function formatNomorAntrean(nomor: number) {
  return `A-${String(nomor).padStart(3, "0")}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tanggalParam = searchParams.get("tanggal");

    const whereClause = tanggalParam
      ? {
          tanggal: new Date(`${tanggalParam}T00:00:00.000Z`),
        }
      : {};

    const antrianList = await prisma.antrian.findMany({
      where: whereClause,
      include: {
        pasien: {
          include: {
            user: {
              select: {
                nama: true,
              },
            },
          },
        },
        dokter: {
          include: {
            user: {
              select: {
                nama: true,
              },
            },
          },
        },
      },
      orderBy: {
        nomorAntrian: "asc",
      },
    });

    const queues = antrianList.map((item) => ({
      id: item.id,
      nomor: formatNomorAntrean(item.nomorAntrian),
      nama: item.pasien.user.nama,
      telepon: item.pasien.noTelp,
      layanan: item.layanan || "Pemeriksaan Umum",
      dokter: item.dokter?.user.nama || "Belum ditentukan",
      tanggal: item.tanggal.toISOString().split("T")[0],
      waktu: item.waktu || formatWaktuWIB(item.createdAt),
      keluhan: item.keluhan || "-",
      status: mapStatusToUI(item.status),
    }));

    return NextResponse.json({ queues }, { status: 200 });
  } catch (error) {
    console.error("Error GET queues:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data antrean dari database." },
      { status: 500 },
    );
  }
}
