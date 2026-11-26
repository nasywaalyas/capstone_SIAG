import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { JenisKelamin } from "@/generated/prisma/client";

function formatTanggalID(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export async function GET() {
  try {
    const patients = await prisma.pasien.findMany({
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            username: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        user: { createdAt: "desc" },
      },
    });

    const formatted = patients.map((item) => ({
      id: item.id,
      userId: item.user.id,
      nama: item.user.nama,
      username: item.user.username,
      nik: item.nik,
      telepon: item.noTelp,
      alamat: item.alamat,
      tempatLahir: item.tempatLahir,
      tanggalLahir: formatTanggalID(item.tanggalLahir),
      jenisKelamin:
        item.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan",
      tanggalDaftar: formatTanggalID(item.user.createdAt),
      status: "Aktif" as const,
    }));

    return NextResponse.json({ patients: formatted }, { status: 200 });
  } catch (error) {
    console.error("Error GET patients:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data pasien dari database." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nama = String(body.nama ?? "").trim();
    const username = String(body.username ?? "").trim();
    const password = String(body.password ?? "");
    const nik = String(body.nik ?? "").replace(/\D/g, "");
    const telepon = String(body.telepon ?? "").replace(/\D/g, "");
    const alamat = String(body.alamat ?? "").trim();
    const tempatLahir = String(body.tempatLahir ?? "").trim();
    const tanggalLahir = String(body.tanggalLahir ?? "").trim();
    const jenisKelamin = (body.jenisKelamin || "LAKI_LAKI") as JenisKelamin;

    if (
      !nama ||
      !username ||
      !password ||
      !nik ||
      !telepon ||
      !alamat ||
      !tempatLahir ||
      !tanggalLahir
    ) {
      return NextResponse.json(
        { message: "Semua kolom data pasien wajib diisi." },
        { status: 400 },
      );
    }

    if (nik.length !== 16) {
      return NextResponse.json(
        { message: "NIK harus terdiri dari 16 digit angka." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password minimal 8 karakter." },
        { status: 400 },
      );
    }

    const [existingUser, existingNik] = await Promise.all([
      prisma.user.findUnique({ where: { username } }),
      prisma.pasien.findUnique({ where: { nik } }),
    ]);

    if (existingUser) {
      return NextResponse.json(
        { message: "Username sudah digunakan." },
        { status: 400 },
      );
    }

    if (existingNik) {
      return NextResponse.json(
        { message: "NIK sudah terdaftar." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        nama,
        username,
        password: hashedPassword,
        role: "PASIEN",
        profilPasien: {
          create: {
            nik,
            noTelp: telepon,
            alamat,
            tempatLahir,
            tanggalLahir: new Date(`${tanggalLahir}T00:00:00.000Z`),
            jenisKelamin,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Data pasien berhasil disimpan ke database." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error POST patient:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat menyimpan data pasien." },
      { status: 500 },
    );
  }
}
