-- DropForeignKey
ALTER TABLE "UsuarioJuego" DROP CONSTRAINT "UsuarioJuego_juegoId_fkey";

-- AddForeignKey
ALTER TABLE "UsuarioJuego" ADD CONSTRAINT "UsuarioJuego_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE CASCADE ON UPDATE CASCADE;
