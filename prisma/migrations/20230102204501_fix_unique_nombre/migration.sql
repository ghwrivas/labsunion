/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `CategoriaJuego` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Estadio` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CategoriaJuego_nombre_key" ON "CategoriaJuego"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Estadio_nombre_key" ON "Estadio"("nombre");
