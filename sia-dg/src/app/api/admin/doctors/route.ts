import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const doctors = await prisma.dokter.findMany({
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            username: true,
            createdAt: true,
          },
        },
        _count: {
          select: { antrian: true },
        },
      },
      orderBy: {
        user: { createdAt: "desc" },
      },
    });

    return NextResponse.json({
      doctors: doctors.map((d) => ({
        id: d.id,
        userId: d.user.id,
        nama: d.user.nama,
        username: d.user.username,
        spesialisasi: d.spesialisasi ?? "",
        totalAntrian: d._count.antrian,
      })),
    });
  } catch (error) {
    console.error("Error GET doctors:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data dokter." },
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
    const spesialisasi = String(body.spesialisasi ?? "").trim() || null;

    if (!nama || !username || !password) {
      return NextResponse.json(
        { message: "Nama, username, dan password dokter wajib diisi." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password minimal 8 karakter." },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Username sudah terdaftar." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const created = await prisma.user.create({
      data: {
        nama,
        username,
        password: hashedPassword,
        role: "DOKTER",
        profilDokter: {
          create: { spesialisasi },
        },
      },
      include: { profilDokter: true },
    });

    return NextResponse.json(
      {
        message: "Data dokter berhasil ditambahkan.",
        doctor: {
          id: created.profilDokter?.id,
          userId: created.id,
          nama: created.nama,
          username: created.username,
          spesialisasi: created.profilDokter?.spesialisasi ?? "",
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error POST doctor:", error);
    return NextResponse.json(
      { message: "Gagal menambahkan data dokter." },
      { status: 500 },
    );
  }
}
