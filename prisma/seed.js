const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const miguelito = await prisma.usuario.upsert({
    where: { correo_electronico: "miguel.barco@gmail.com" },
    update: {
      contrasenia:
        "$2a$10$Rxuc7KPqemwrtezI3rdUCu8muZzExa2Ml3t9BTBgH1OS3xB8re47W",
    },
    create: {
      nombre: "Miguel",
      apellido: "Barco",
      fecha_nacimiento: new Date(),
      correo_electronico: "miguel.barco@gmail.com",
      contrasenia: "miguelito",
    },
  });

  const gato = await prisma.usuario.upsert({
    where: { correo_electronico: "francisco.anza@gmail.com" },
    update: {
      contrasenia:
        "$2a$10$0F9sxTV3JmwVd1W0weQSv.NT3G5c9AYiCxpUX4x/iLTS59CsqzGxu",
    },
    create: {
      nombre: "Francisco",
      apellido: "Anza",
      fecha_nacimiento: new Date(),
      correo_electronico: "francisco.anza@gmail.com",
      contrasenia: "elgato",
    },
  });
  console.log({ miguelito, gato });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
