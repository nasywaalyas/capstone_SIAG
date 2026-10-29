-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DOKTER', 'PASIEN');

-- CreateEnum
CREATE TYPE "StatusAntrian" AS ENUM ('MENUNGGU', 'DIVERIFIKASI', 'DIPANGGIL', 'DIPERIKSA', 'SELESAI', 'DIBATALKAN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dokter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "spesialisasi" TEXT,

    CONSTRAINT "Dokter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pasien" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "noTelpon" TEXT,
    "alamat" TEXT,

    CONSTRAINT "Pasien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Antrian" (
    "id" TEXT NOT NULL,
    "pasienId" TEXT NOT NULL,
    "dokterId" TEXT,
    "tanggal" DATE NOT NULL,
    "nomorAntrian" INTEGER NOT NULL,
    "keluhan" TEXT,
    "status" "StatusAntrian" NOT NULL DEFAULT 'MENUNGGU',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Antrian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pemeriksaan" (
    "id" TEXT NOT NULL,
    "antrianId" TEXT NOT NULL,
    "diagnosa" TEXT,
    "catatan" TEXT,
    "tanggalPeriksa" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pemeriksaan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dokter_userId_key" ON "Dokter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Pasien_userId_key" ON "Pasien"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Antrian_tanggal_nomorAntrian_key" ON "Antrian"("tanggal", "nomorAntrian");

-- CreateIndex
CREATE UNIQUE INDEX "Pemeriksaan_antrianId_key" ON "Pemeriksaan"("antrianId");

-- AddForeignKey
ALTER TABLE "Dokter" ADD CONSTRAINT "Dokter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pasien" ADD CONSTRAINT "Pasien_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Antrian" ADD CONSTRAINT "Antrian_pasienId_fkey" FOREIGN KEY ("pasienId") REFERENCES "Pasien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Antrian" ADD CONSTRAINT "Antrian_dokterId_fkey" FOREIGN KEY ("dokterId") REFERENCES "Dokter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pemeriksaan" ADD CONSTRAINT "Pemeriksaan_antrianId_fkey" FOREIGN KEY ("antrianId") REFERENCES "Antrian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
