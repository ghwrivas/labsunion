/*
  Warnings:

  - You are about to alter the column `nombre` on the `Estadio` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(45)`.
  - You are about to alter the column `nombre` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(45)`.
  - You are about to alter the column `apellido` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(45)`.
  - You are about to alter the column `correo_electronico` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(45)`.
  - You are about to alter the column `contrasenia` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "Estadio" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(45);

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(45),
ALTER COLUMN "apellido" SET DATA TYPE VARCHAR(45),
ALTER COLUMN "fecha_nacimiento" SET DATA TYPE DATE,
ALTER COLUMN "correo_electronico" SET DATA TYPE VARCHAR(45),
ALTER COLUMN "contrasenia" SET DATA TYPE VARCHAR(100);
