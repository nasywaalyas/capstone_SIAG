import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseDateToUTC(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function getJakartaCurrentStatus() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return {
    todayStr: `${values.year}-${values.month}-${values.day}`,
    hour: Number(values.hour),
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, complaint, type, otherDetails, userId } = body;

    if (!date || !complaint || !type) {
      return NextResponse.json(
        {
          message:
            "Tanggal kunjungan, keluhan, dan jenis pemeriksaan wajib diisi.",
        },
        { status: 400 },
      );
    }

    const { todayStr, hour } = getJakartaCurrentStatus();

    if (date < todayStr) {
      return NextResponse.json(
        { message: "Tanggal kunjungan tidak boleh sebelum hari ini." },
        { status: 400 },
      );
    }

    if (date === todayStr && hour >= 20) {
      return NextResponse.json(
        {
          message:
            "Jam operasional hari ini sudah tutup (pukul 20.00 WIB). Silakan pilih tanggal mulai besok.",
        },
        { status: 400 },
      );
    }

    if (
      type === "Pemeriksaan lainnya" &&
      (!otherDetails || !otherDetails.trim())
    ) {
      return NextResponse.json(
        { message: "Harap jelaskan pemeriksaan yang dibutuhkan." },
        { status: 400 },
      );
    }

    const pasien = userId
      ? await prisma.pasien.findUnique({ where: { userId } })
      : await prisma.pasien.findFirst();

    if (!pasien) {
      return NextResponse.json(
        {
          message:
            "Data pasien tidak ditemukan. Silakan registrasi akun pasien terlebih dahulu.",
        },
        { status: 404 },
      );
    }

    const targetDate = parseDateToUTC(date);
    const detailText = otherDetails?.trim()
      ? ` (Catatan: ${otherDetails.trim()})`
      : "";
    const formattedKeluhan = `[${type}] ${complaint.trim()}${detailText}`;

    const lastQueue = await prisma.antrian.findFirst({
      where: { tanggal: targetDate },
      orderBy: { nomorAntrian: "desc" },
    });

    const nextNumber = (lastQueue?.nomorAntrian ?? 0) + 1;

    const newQueue = await prisma.antrian.create({
      data: {
        pasienId: pasien.id,
        tanggal: targetDate,
        nomorAntrian: nextNumber,
        keluhan: formattedKeluhan,
        status: "MENUNGGU",
      },
    });

    const formattedNumber = `A-${String(newQueue.nomorAntrian).padStart(3, "0")}`;

    return NextResponse.json(
      {
        message: "Pengajuan reservasi berhasil disimpan ke database.",
        data: {
          id: newQueue.id,
          queueNumber: formattedNumber,
          date,
          keluhan: newQueue.keluhan,
          status: newQueue.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error menyimpan reservasi antrian:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat menyimpan reservasi." },
      { status: 500 },
    );
  }
}
