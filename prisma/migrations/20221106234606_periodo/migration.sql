-- CreateTable
CREATE TABLE "Periodo" (
    "id" SERIAL NOT NULL,
    "anio" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Periodo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Periodo_anio_key" ON "Periodo"("anio");
