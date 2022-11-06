/*
  Warnings:

  - Added the required column `contrasenia` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "contrasenia" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Estadio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Estadio_pkey" PRIMARY KEY ("id")
);
