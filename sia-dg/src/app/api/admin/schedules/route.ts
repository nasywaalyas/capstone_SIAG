import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const urutanHari: Record<string, number> = {
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
  Sabtu: 6,
  Minggu: 7,
};

export async function GET() {
  try {
    const [jadwalList, dokterList] = await Promise.all([
      prisma.jadwalDokter.findMany({
        include: {
          dokter: {
            include: {
              user: {
                select: {
                  nama: true,
                },
              },
            },
          },
        },
        orderBy: {
          jamMulai: "asc",
        },
      }),
      prisma.dokter.findMany({
        include: {
          user: {
            select: {
              nama: true,
            },
          },
        },
        orderBy: {
          user: {
            nama: "asc",
          },
        },
      }),
    ]);

    const schedules = jadwalList
      .sort((a, b) => {
        const selisihHari =
          (urutanHari[a.hari] ?? 99) - (urutanHari[b.hari] ?? 99);
        if (selisihHari !== 0) return selisihHari;
        return a.jamMulai.localeCompare(b.jamMulai);
      })
      .map((item) => ({
        id: item.id,
        dokterId: item.dokterId,
        nama: item.dokter.user.nama,
        spesialis: item.dokter.spesialisasi || "Dokter Gigi Umum",
        hari: item.hari,
        mulai: item.jamMulai,
        selesai: item.jamSelesai,
        kuota: item.kuota,
        status: item.isAktif ? ("Aktif" as const) : ("Tidak Aktif" as const),
      }));

    const doctors = dokterList.map((doc) => ({
      id: doc.id,
      nama: doc.user.nama,
      spesialis: doc.spesialisasi || "Dokter Gigi Umum",
    }));

    return NextResponse.json({ schedules, doctors }, { status: 200 });
  } catch (error) {
    console.error("Error GET schedules:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data jadwal dokter dari database." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const hari = String(body.hari ?? "").trim();
    const mulai = String(body.mulai ?? "").trim();
    const selesai = String(body.selesai ?? "").trim();
    const kuota = Number(body.kuota);
    const status = String(body.status ?? "Aktif");
    let dokterId = body.dokterId ? String(body.dokterId).trim() : "";

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

    if (!dokterId) {
      let dokter = await prisma.dokter.findFirst();

      if (!dokter) {
        const defaultPassword = await bcrypt.hash("dokter123", 10);
        const userDokter = await prisma.user.create({
          data: {
            nama: "drg. Siti",
            username: "drg.siti",
            password: defaultPassword,
            role: "DOKTER",
            profilDokter: {
              create: {
                spesialisasi: "Dokter Gigi Umum",
              },
            },
          },
          include: {
            profilDokter: true,
          },
        });
        dokter = userDokter.profilDokter!;
      }

      dokterId = dokter.id;
    }

    await prisma.jadwalDokter.create({
      data: {
        dokterId,
        hari,
        jamMulai: mulai,
        jamSelesai: selesai,
        kuota,
        isAktif: status === "Aktif",
      },
    });

    return NextResponse.json(
      { message: "Jadwal dokter berhasil disimpan ke database." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error POST schedule:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat menyimpan jadwal." },
      { status: 500 },
    );
  }
}
