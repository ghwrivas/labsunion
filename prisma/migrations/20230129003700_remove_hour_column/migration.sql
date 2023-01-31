/*
  Warnings:

  - You are about to drop the column `hora` on the `Juego` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Juego" DROP COLUMN "hora",
ALTER COLUMN "fecha" SET DATA TYPE TIMESTAMP(3);
