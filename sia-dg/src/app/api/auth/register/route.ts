import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nama,
      username,
      email,
      telepon,
      nik,
      alamat,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      password,
    } = body;

    // 1. Validasi input wajib agar tidak ada yang bernilai undefined / null
    if (
      !nama ||
      !username ||
      !password ||
      !nik ||
      !alamat ||
      !tempatLahir ||
      !tanggalLahir ||
      !telepon
    ) {
      return NextResponse.json(
        { message: "Semua kolom wajib diisi." },
        { status: 400 },
      );
    }

    // 2. Cek apakah username, email (jika ada), atau NIK sudah terdaftar
    const userExist = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, ...(email ? [{ email: email }] : [])],
      },
    });

    if (userExist) {
      return NextResponse.json(
        { message: "Username atau Email sudah terdaftar." },
        { status: 400 },
      );
    }

    const pasienExist = await prisma.pasien.findUnique({
      where: { nik: nik },
    });

    if (pasienExist) {
      return NextResponse.json(
        { message: "NIK sudah terdaftar." },
        { status: 400 },
      );
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan ke database
    const newUser = await prisma.user.create({
      data: {
        nama: nama,
        username: username,
        ...(email && { email: email }), // Masukkan email jika kolom email ada di schema
        password: hashedPassword,
        role: "PASIEN",
        profilPasien: {
          create: {
            nik: nik,
            alamat: alamat,
            tempatLahir: tempatLahir,
            tanggalLahir: new Date(tanggalLahir),
            jenisKelamin: jenisKelamin,
            noTelp: telepon,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Registrasi pasien berhasil disimpan!",
        data: {
          id: newUser.id,
          nama: newUser.nama,
          username: newUser.username,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error Registrasi Database:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat menyimpan data." },
      { status: 500 },
    );
  }
}
