import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const hari = String(body.hari ?? "").trim();
    const mulai = String(body.mulai ?? "").trim();
    const selesai = String(body.selesai ?? "").trim();
    const kuota = Number(body.kuota);
    const status = String(body.status ?? "Aktif");
    const dokterId = body.dokterId ? String(body.dokterId).trim() : undefined;

    if (!hari || !mulai || !selesai) {
      return NextResponse.json(
        { message: "Hari dan jam praktik wajib diisi." },
        { status: 400 },
      );
    }

    if (mulai >= selesai) {
      return NextResponse.json(
        { message: "Jam selesai harus lebih besar dari jam mulai." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(kuota) || kuota < 1) {
      return NextResponse.json(
        { message: "Kuota pasien minimal 1." },
        { status: 400 },
      );
    }

    const existing = await prisma.jadwalDokter.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Data jadwal tidak ditemukan." },
        { status: 404 },
      );
    }

    await prisma.jadwalDokter.update({
      where: { id },
      data: {
        ...(dokterId ? { dokterId } : {}),
        hari,
        jamMulai: mulai,
        jamSelesai: selesai,
        kuota,
        isAktif: status === "Aktif",
      },
    });

    return NextResponse.json(
      { message: "Perubahan jadwal dokter berhasil disimpan." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error PATCH schedule:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat memperbarui jadwal." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existing = await prisma.jadwalDokter.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Data jadwal tidak ditemukan." },
        { status: 404 },
      );
    }

    await prisma.jadwalDokter.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Jadwal dokter berhasil dihapus." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error DELETE schedule:", error);
    return NextResponse.json(
      { message: "Gagal menghapus jadwal dokter." },
      { status: 500 },
    );
  }
}
