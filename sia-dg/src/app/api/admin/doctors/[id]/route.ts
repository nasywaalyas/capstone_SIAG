import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const nama = String(body.nama ?? "").trim();
    const username = String(body.username ?? "").trim();
    const password = String(body.password ?? "");
    const spesialisasi = String(body.spesialisasi ?? "").trim() || null;

    if (!nama || !username) {
      return NextResponse.json(
        { message: "Nama dan username wajib diisi." },
        { status: 400 },
      );
    }

    const existingDoctor = await prisma.dokter.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingDoctor) {
      return NextResponse.json(
        { message: "Data dokter tidak ditemukan." },
        { status: 404 },
      );
    }

    const duplicate = await prisma.user.findFirst({
      where: {
        AND: [{ id: { not: existingDoctor.userId } }, { username }],
      },
    });

    if (duplicate) {
      return NextResponse.json(
        { message: "Username sudah dipakai akun lain." },
        { status: 400 },
      );
    }

    let hashedPassword: string | undefined;
    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { message: "Password baru minimal 8 karakter." },
          { status: 400 },
        );
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await prisma.dokter.update({
      where: { id },
      data: {
        spesialisasi,
        user: {
          update: {
            nama,
            username,
            ...(hashedPassword ? { password: hashedPassword } : {}),
          },
        },
      },
    });

    return NextResponse.json({
      message: "Data dokter berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Error PUT doctor:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui data dokter." },
      { status: 500 },
    );
  }
}
