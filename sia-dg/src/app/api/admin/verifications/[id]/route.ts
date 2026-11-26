import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const statusBaru = String(body.status ?? "");
    const dokterId = body.dokterId ? String(body.dokterId) : undefined;

    if (statusBaru !== "Diterima" && statusBaru !== "Ditolak") {
      return NextResponse.json(
        { message: "Status verifikasi tidak valid." },
        { status: 400 },
      );
    }

    const existing = await prisma.antrian.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Data pendaftaran tidak ditemukan." },
        { status: 404 },
      );
    }

    const statusDatabase =
      statusBaru === "Diterima" ? "DIVERIFIKASI" : "DIBATALKAN";

    await prisma.antrian.update({
      where: { id },
      data: {
        status: statusDatabase,
        ...(dokterId !== undefined ? { dokterId: dokterId || null } : {}),
      },
    });

    return NextResponse.json(
      {
        message:
          statusBaru === "Diterima"
            ? "Pendaftaran berhasil diverifikasi dan diterima."
            : "Pendaftaran berhasil ditolak.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error PATCH verification:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat memperbarui status." },
      { status: 500 },
    );
  }
}
