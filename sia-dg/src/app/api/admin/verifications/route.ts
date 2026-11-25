import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { StatusAntrian } from "@/generated/prisma/client";

function formatTanggalID(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function mapStatusToUI(
  status: StatusAntrian,
): "Menunggu" | "Diterima" | "Ditolak" {
  if (status === "MENUNGGU") return "Menunggu";
  if (status === "DIBATALKAN") return "Ditolak";
  return "Diterima";
}

export async function GET() {
  try {
    const [antrianList, dokterList] = await Promise.all([
      prisma.antrian.findMany({
        include: {
          pasien: {
            include: {
              user: {
                select: {
                  nama: true,
                  username: true,
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
          createdAt: "desc",
        },
      }),
      prisma.dokter.findMany({
        include: {
          user: {
            select: {
              nama: true,
            },
          },
        },
        orderBy: {
          user: {
            nama: "asc",
          },
        },
      }),
    ]);

    const registrations = antrianList.map((item) => ({
      id: item.id,
      nomorAntrian: item.nomorAntrian,
      nama: item.pasien.user.nama,
      username: item.pasien.user.username,
      nik: item.pasien.nik,
      telepon: item.pasien.noTelp,
      tanggal: formatTanggalID(item.tanggal),
      layanan: item.layanan || "Pemeriksaan Umum",
      dokterId: item.dokterId || "",
      dokter: item.dokter?.user.nama || "Belum ditentukan",
      keluhan: item.keluhan || "-",
      status: mapStatusToUI(item.status),
    }));

    const doctors = dokterList.map((doc) => ({
      id: doc.id,
      nama: doc.user.nama,
      spesialisasi: doc.spesialisasi || "Dokter Gigi Umum",
    }));

    return NextResponse.json({ registrations, doctors }, { status: 200 });
  } catch (error) {
    console.error("Error GET verifications:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data pendaftaran dari database." },
      { status: 500 },
    );
  }
}
