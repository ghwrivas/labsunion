-- CreateEnum
CREATE TYPE "EstatusJuego" AS ENUM ('PROGRAMADO', 'REALIZADO', 'SUSPENDIDO', 'REALIZADO_SIN_PAGO');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('PAGO_FINANZA', 'CAPITAL_INICIAL', 'GASTO');

-- CreateTable
CREATE TABLE "Juego" (
    "id" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,
    "hora" TIME NOT NULL,
    "precio" DECIMAL(3,2) NOT NULL,
    "estadioId" INTEGER NOT NULL,
    "categoriaJuegoId" INTEGER NOT NULL,
    "comentarios" VARCHAR(100),
    "estatus" "EstatusJuego" NOT NULL DEFAULT 'PROGRAMADO',

    CONSTRAINT "Juego_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Juego" ADD CONSTRAINT "Juego_estadioId_fkey" FOREIGN KEY ("estadioId") REFERENCES "Estadio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Juego" ADD CONSTRAINT "Juego_categoriaJuegoId_fkey" FOREIGN KEY ("categoriaJuegoId") REFERENCES "CategoriaJuego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
