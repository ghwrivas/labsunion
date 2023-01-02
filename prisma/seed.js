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

  await prisma.usuario.upsert({
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

  await prisma.estadio.upsert({
    where: { nombre: "Ali Primera" },
    update: {},
    create: {
      nombre: "Ali Primera",
      activo: true,
    },
  });

  await prisma.estadio.upsert({
    where: { nombre: "Ayacucho" },
    update: {},
    create: {
      nombre: "Ayacucho",
      activo: true,
    },
  });

  await prisma.estadio.upsert({
    where: { nombre: "Cuji" },
    update: {},
    create: {
      nombre: "Cuji",
      activo: true,
    },
  });

  await prisma.estadio.upsert({
    where: { nombre: "EMU" },
    update: {},
    create: {
      nombre: "EMU",
      activo: true,
    },
  });

  await prisma.estadio.upsert({
    where: { nombre: "Eneal" },
    update: {},
    create: {
      nombre: "Eneal",
      activo: true,
    },
  });

  await prisma.estadio.upsert({
    where: { nombre: "INCE" },
    update: {},
    create: {
      nombre: "INCE",
      activo: true,
    },
  });

  await prisma.estadio.upsert({
    where: { nombre: "Las Playitas" },
    update: {},
    create: {
      nombre: "Las Playitas",
      activo: true,
    },
  });

  await prisma.estadio.upsert({
    where: { nombre: "Las Tunas" },
    update: {},
    create: {
      nombre: "Las Tunas",
      activo: true,
    },
  });

  await prisma.estadio.upsert({
    where: { nombre: "Las Tunitas" },
    update: {},
    create: {
      nombre: "Las Tunitas",
      activo: true,
    },
  });

  await prisma.estadio.upsert({
    where: { nombre: "Mama Zoila" },
    update: {},
    create: {
      nombre: "Mama Zoila",
      activo: true,
    },
  });

  await prisma.estadio.upsert({
    where: { nombre: "Potrero" },
    update: {},
    create: {
      nombre: "Potrero",
      activo: true,
    },
  });

  await prisma.estadio.upsert({
    where: { nombre: "Sabana Grande" },
    update: {},
    create: {
      nombre: "Sabana Grande",
      activo: true,
    },
  });

  await prisma.estadio.upsert({
    where: { nombre: "Santos Luzardo" },
    update: {},
    create: {
      nombre: "Santos Luzardo",
      activo: true,
    },
  });

  await prisma.estadio.upsert({
    where: { nombre: "Tamaca" },
    update: {},
    create: {
      nombre: "Tamaca",
      activo: true,
    },
  });

  await prisma.estadio.upsert({
    where: { nombre: "Veritas" },
    update: {},
    create: {
      nombre: "Veritas",
      activo: true,
    },
  });

  await prisma.categoriaJuego.upsert({
    where: { nombre: "Semilla" },
    update: {},
    create: {
      nombre: "Semilla",
      precio: 10.0,
      activo: true,
    },
  });

  await prisma.categoriaJuego.upsert({
    where: { nombre: "Compota" },
    update: {},
    create: {
      nombre: "Compota",
      precio: 10.0,
      activo: true,
    },
  });

  await prisma.categoriaJuego.upsert({
    where: { nombre: "Pre-infantil" },
    update: {},
    create: {
      nombre: "Pre-infantil",
      precio: 10.0,
      activo: true,
    },
  });

  await prisma.categoriaJuego.upsert({
    where: { nombre: "Infantil" },
    update: {},
    create: {
      nombre: "Infantil",
      precio: 10.0,
      activo: true,
    },
  });

  await prisma.categoriaJuego.upsert({
    where: { nombre: "Pre-junior" },
    update: {},
    create: {
      nombre: "Pre-junior",
      precio: 10.0,
      activo: true,
    },
  });


  await prisma.categoriaJuego.upsert({
    where: { nombre: "Juvenil AA" },
    update: {},
    create: {
      nombre: "Juvenil AA",
      precio: 10.0,
      activo: true,
    },
  });

  await prisma.categoriaJuego.upsert({
    where: { nombre: "Triple AAA" },
    update: {},
    create: {
      nombre: "Triple AAA",
      precio: 10.0,
      activo: true,
    },
  });

  await prisma.categoriaJuego.upsert({
    where: { nombre: "Softball" },
    update: {},
    create: {
      nombre: "Softball",
      precio: 10.0,
      activo: true,
    },
  });

  await prisma.categoriaJuego.upsert({
    where: { nombre: "Baseball" },
    update: {},
    create: {
      nombre: "Baseball",
      precio: 10.0,
      activo: true,
    },
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
