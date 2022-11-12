const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const miguelito = await prisma.usuario.upsert({
    where: { correo_electronico: "miguel.barco@gmail.com" },
    update: {},
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
    update: {},
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
