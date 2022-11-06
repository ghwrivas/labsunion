-- CreateTable
CREATE TABLE "CategoriaJuego" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(45) NOT NULL,
    "precio" DECIMAL(3,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CategoriaJuego_pkey" PRIMARY KEY ("id")
);
