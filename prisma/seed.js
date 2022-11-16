const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.usuario.upsert({
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

  await prisma.estadio.createMany({
    data: [
      {
        nombre: "Ali Primera",
        activo: true,
      },
      {
        nombre: "Ayacucho",
        activo: true,
      },
      {
        nombre: "Cuji",
        activo: true,
      },
      {
        nombre: "EMU",
        activo: true,
      },
      {
        nombre: "Eneal",
        activo: true,
      },
      {
        nombre: "INCE",
        activo: true,
      },
      {
        nombre: "Las Playitas",
        activo: true,
      },
      {
        nombre: "Las Tunas",
        activo: true,
      },
      {
        nombre: "Las Tunitas",
        activo: true,
      },
      {
        nombre: "Mama Zoila",
        activo: true,
      },
      {
        nombre: "Potrero",
        activo: true,
      },
      {
        nombre: "Sabana Grande",
        activo: true,
      },
      {
        nombre: "Santos Luzardo",
        activo: true,
      },
      {
        nombre: "Tamaca",
        activo: true,
      },
      {
        nombre: "Veritas",
        activo: true,
      },
    ],
  });

  await prisma.categoriaJuego.createMany({
    data: [
      {
        nombre: "Semilla",
        precio: 10.0,
        activo: true,
      },
      {
        nombre: "Compota",
        precio: 10.0,
        activo: true,
      },
      {
        nombre: "Pre-infantil",
        precio: 10.0,
        activo: true,
      },
      {
        nombre: "Infantil",
        precio: 10.0,
        activo: true,
      },
      {
        nombre: "Pre-junior",
        precio: 10.0,
        activo: true,
      },
      {
        nombre: "Juvenil AA",
        precio: 10.0,
        activo: true,
      },
      {
        nombre: "Juvenil AA",
        precio: 10.0,
        activo: true,
      },
      {
        nombre: "Triple AAA",
        precio: 10.0,
        activo: true,
      },
      {
        nombre: "Softball",
        precio: 10.0,
        activo: true,
      },
      {
        nombre: "Baseball",
        precio: 10.0,
        activo: true,
      },
    ],
  });
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
