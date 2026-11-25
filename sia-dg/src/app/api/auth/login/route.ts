import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { Role } from "@/generated/prisma/client";

const ROLE_REDIRECT: Record<Role, string> = {
  PASIEN: "/dashboard",
  DOKTER: "/doctor/dashboard",
  ADMIN: "/admin/dashboard",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = String(body.username ?? "").trim();
    const password = String(body.password ?? "");

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username dan password wajib diisi." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        profilPasien: { select: { id: true } },
        profilDokter: { select: { id: true } },
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

    const redirectUrl = ROLE_REDIRECT[user.role] ?? "/patient/dashboard";

    const sessionUser = {
      id: user.id,
      nama: user.nama,
      username: user.username,
      role: user.role,
      pasienId: user.profilPasien?.id ?? null,
      dokterId: user.profilDokter?.id ?? null,
    };

    const response = NextResponse.json(
      {
        message: "Login berhasil! Mengarahkan ke dashboard...",
        user: sessionUser,
        redirectUrl,
      },
      { status: 200 },
    );

    response.cookies.set("user_session", JSON.stringify(sessionUser), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan koneksi pada server." },
      { status: 500 },
    );
  }
}
