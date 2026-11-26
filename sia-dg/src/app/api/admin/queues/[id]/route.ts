import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { StatusAntrian } from "@/generated/prisma/client";

const statusMapToDB: Record<string, StatusAntrian> = {
  Menunggu: "DIVERIFIKASI",
  Dipanggil: "DIPANGGIL",
  "Dalam Pemeriksaan": "DIPERIKSA",
  Selesai: "SELESAI",
  Batal: "DIBATALKAN",
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const statusBaru = String(body.status ?? "");
    const statusDatabase = statusMapToDB[statusBaru];

    if (!statusDatabase) {
      return NextResponse.json(
        { message: "Status antrean tidak valid." },
        { status: 400 },
      );
    }

    const existing = await prisma.antrian.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Data antrean tidak ditemukan." },
        { status: 404 },
      );
    }

    await prisma.antrian.update({
      where: { id },
      data: { status: statusDatabase },
    });

    return NextResponse.json(
      { message: `Status antrean berhasil diubah menjadi "${statusBaru}".` },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error PATCH queue status:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat memperbarui status antrean." },
      { status: 500 },
    );
  }
}
