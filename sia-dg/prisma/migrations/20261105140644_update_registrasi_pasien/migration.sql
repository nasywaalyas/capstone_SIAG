/*
  Warnings:

  - You are about to drop the column `noTelpon` on the `Pasien` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nik]` on the table `Pasien` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jenisKelamin` to the `Pasien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nik` to the `Pasien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noTelp` to the `Pasien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggalLahir` to the `Pasien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tempatLahir` to the `Pasien` table without a default value. This is not possible if the table is not empty.
  - Made the column `alamat` on table `Pasien` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Pasien" DROP COLUMN "noTelpon",
ADD COLUMN     "jenisKelamin" "JenisKelamin" NOT NULL,
ADD COLUMN     "nik" TEXT NOT NULL,
ADD COLUMN     "noTelp" TEXT NOT NULL,
ADD COLUMN     "tanggalLahir" DATE NOT NULL,
ADD COLUMN     "tempatLahir" TEXT NOT NULL,
ALTER COLUMN "alamat" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pasien_nik_key" ON "Pasien"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
