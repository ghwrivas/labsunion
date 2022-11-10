-- CreateEnum
CREATE TYPE "TipoCuentaCobrar" AS ENUM ('FINANZA_POR_JUEGO', 'VENTA_DE_ARTICULO', 'DEUDA_PERIODO_ANTERIOR', 'OTRO');

-- CreateEnum
CREATE TYPE "EstatusCuentaCobrar" AS ENUM ('PENDIENTE', 'PAGADO');

-- CreateTable
CREATE TABLE "CuentaCobrar" (
    "id" SERIAL NOT NULL,
    "monto" DECIMAL(5,2) NOT NULL,
    "descripcion" VARCHAR(100) NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tipo" "TipoCuentaCobrar" NOT NULL DEFAULT 'OTRO',
    "periodoId" INTEGER NOT NULL,
    "estatus" "EstatusCuentaCobrar" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "CuentaCobrar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuentaCobrarJuego" (
    "id" SERIAL NOT NULL,
    "cuentaCobrarId" INTEGER NOT NULL,
    "juegoId" INTEGER NOT NULL,

    CONSTRAINT "CuentaCobrarJuego_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbonoCuentaCobrar" (
    "id" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,
    "monto" DECIMAL(5,2) NOT NULL,
    "cuentaCobrarId" INTEGER NOT NULL,

    CONSTRAINT "AbonoCuentaCobrar_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CuentaCobrar" ADD CONSTRAINT "CuentaCobrar_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaCobrar" ADD CONSTRAINT "CuentaCobrar_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "Periodo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaCobrarJuego" ADD CONSTRAINT "CuentaCobrarJuego_cuentaCobrarId_fkey" FOREIGN KEY ("cuentaCobrarId") REFERENCES "CuentaCobrar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaCobrarJuego" ADD CONSTRAINT "CuentaCobrarJuego_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbonoCuentaCobrar" ADD CONSTRAINT "AbonoCuentaCobrar_cuentaCobrarId_fkey" FOREIGN KEY ("cuentaCobrarId") REFERENCES "CuentaCobrar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
