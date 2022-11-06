-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ARBITRO', 'COORDINADOR', 'PRESIDENTE', 'TESORERO', 'SECRETARIO', 'ADMIN');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3) NOT NULL,
    "correo_electronico" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ARBITRO',

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_electronico_key" ON "Usuario"("correo_electronico");
