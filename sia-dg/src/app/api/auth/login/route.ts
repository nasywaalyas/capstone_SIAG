import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username dan password wajib diisi." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { username: username },
      include: {
        profilPasien: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Username atau password salah." },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Username atau password salah." },
        { status: 401 },
      );
    }

    let redirectUrl = "/dashboard";
    if (user.role === "ADMIN") {
      redirectUrl = "/admin/dashboard";
    } else if (user.role === "DOKTER") {
      redirectUrl = "/doctor/dashboard";
    }

    return NextResponse.json(
      {
        message: "Login berhasil!",
        user: {
          id: user.id,
          nama: user.nama,
          username: user.username,
          role: user.role,
        },
        redirectUrl,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan koneksi pada server." },
      { status: 500 },
    );
  }
}
