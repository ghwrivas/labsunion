-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ARBITRO', 'COORDINADOR', 'PRESIDENTE', 'TESORERO', 'SECRETARIO', 'ADMIN');

-- CreateEnum
CREATE TYPE "TipoCuentaCobrar" AS ENUM ('FINANZA_POR_JUEGO', 'VENTA_DE_ARTICULO', 'DEUDA_PERIODO_ANTERIOR', 'OTRO');

-- CreateEnum
CREATE TYPE "EstatusCuentaCobrar" AS ENUM ('PENDIENTE', 'PAGADO');

-- CreateEnum
CREATE TYPE "EstatusJuego" AS ENUM ('PROGRAMADO', 'REALIZADO', 'SUSPENDIDO', 'REALIZADO_SIN_PAGO');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('ABONO_CUENTA_COBRAR', 'CAPITAL_INICIAL', 'GASTO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(45) NOT NULL,
    "apellido" VARCHAR(45) NOT NULL,
    "fecha_nacimiento" DATE NOT NULL,
    "correo_electronico" VARCHAR(45) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ARBITRO',
    "contrasenia" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estadio" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(45) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Estadio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriaJuego" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(45) NOT NULL,
    "precio" DECIMAL(3,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CategoriaJuego_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Periodo" (
    "id" SERIAL NOT NULL,
    "anio" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Periodo_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "UsuarioJuego" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "juegoId" INTEGER NOT NULL,

    CONSTRAINT "UsuarioJuego_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "MovimientoFinanza" (
    "id" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,
    "descripcion" VARCHAR(100) NOT NULL,
    "monto" DECIMAL(5,2) NOT NULL,
    "saldo" DECIMAL(5,2) NOT NULL,
    "tipo" "TipoMovimiento" NOT NULL,

    CONSTRAINT "MovimientoFinanza_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoFinanzaAbonoCuentaCobrar" (
    "id" SERIAL NOT NULL,
    "movimientoFinanzaId" INTEGER NOT NULL,
    "abonoCuentaCobrarId" INTEGER NOT NULL,

    CONSTRAINT "MovimientoFinanzaAbonoCuentaCobrar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_electronico_key" ON "Usuario"("correo_electronico");

-- CreateIndex
CREATE UNIQUE INDEX "Periodo_anio_key" ON "Periodo"("anio");

-- AddForeignKey
ALTER TABLE "Juego" ADD CONSTRAINT "Juego_estadioId_fkey" FOREIGN KEY ("estadioId") REFERENCES "Estadio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Juego" ADD CONSTRAINT "Juego_categoriaJuegoId_fkey" FOREIGN KEY ("categoriaJuegoId") REFERENCES "CategoriaJuego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioJuego" ADD CONSTRAINT "UsuarioJuego_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioJuego" ADD CONSTRAINT "UsuarioJuego_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "MovimientoFinanzaAbonoCuentaCobrar" ADD CONSTRAINT "MovimientoFinanzaAbonoCuentaCobrar_movimientoFinanzaId_fkey" FOREIGN KEY ("movimientoFinanzaId") REFERENCES "MovimientoFinanza"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoFinanzaAbonoCuentaCobrar" ADD CONSTRAINT "MovimientoFinanzaAbonoCuentaCobrar_abonoCuentaCobrarId_fkey" FOREIGN KEY ("abonoCuentaCobrarId") REFERENCES "AbonoCuentaCobrar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
