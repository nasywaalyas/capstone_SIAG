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

function formatNomorAntrean(nomor: number) {
  return `A${String(nomor).padStart(3, "0")}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tanggalMulai = searchParams.get("tanggalMulai");
    const tanggalSelesai = searchParams.get("tanggalSelesai");

    if (tanggalMulai && tanggalSelesai && tanggalMulai > tanggalSelesai) {
      return NextResponse.json(
        { message: "Tanggal mulai tidak boleh melebihi tanggal selesai." },
        { status: 400 },
      );
    }

    const whereTanggal =
      tanggalMulai && tanggalSelesai
        ? {
            tanggal: {
              gte: new Date(`${tanggalMulai}T00:00:00.000Z`),
              lte: new Date(`${tanggalSelesai}T00:00:00.000Z`),
            },
          }
        : {};

    const [antrianList, dokterPertama] = await Promise.all([
      prisma.antrian.findMany({
        where: whereTanggal,
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
        orderBy: [{ tanggal: "asc" }, { nomorAntrian: "asc" }],
      }),
      prisma.dokter.findFirst({
        include: {
          user: {
            select: {
              nama: true,
            },
          },
        },
      }),
    ]);

    const reports = antrianList.map((item) => ({
      id: item.id,
      nomor: formatNomorAntrean(item.nomorAntrian),
      nama: item.pasien.user.nama,
      layanan: item.layanan || "Pemeriksaan Umum",
      dokter: item.dokter?.user.nama || dokterPertama?.user.nama || "drg. Siti",
      tanggal: item.tanggal.toISOString().split("T")[0],
      status: mapStatusToUI(item.status),
    }));

    return NextResponse.json(
      {
        reports,
        doctorName: dokterPertama?.user.nama || "drg. Siti",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error GET reports:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data laporan dari database." },
      { status: 500 },
    );
  }
}
