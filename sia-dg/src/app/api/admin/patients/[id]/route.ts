import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const pasien = await prisma.pasien.findUnique({
      where: { id },
      include: {
        _count: {
          select: { antrian: true },
        },
      },
    });

    if (!pasien) {
      return NextResponse.json(
        { message: "Data pasien tidak ditemukan." },
        { status: 404 },
      );
    }

    if (pasien._count.antrian > 0) {
      return NextResponse.json(
        {
          message:
            "Pasien tidak dapat dihapus karena masih memiliki riwayat antrian.",
        },
        { status: 400 },
      );
    }

    await prisma.user.delete({
      where: { id: pasien.userId },
    });

    return NextResponse.json(
      { message: "Data pasien berhasil dihapus." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error DELETE patient:", error);
    return NextResponse.json(
      { message: "Gagal menghapus data pasien." },
      { status: 500 },
    );
  }
}
