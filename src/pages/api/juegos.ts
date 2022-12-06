import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../lib/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { fecha } = req.query;
    if (!fecha) {
      res.json([]);
      return;
    }
    const juegos = await prisma.juego.findMany({
      where: {
        fecha: new Date(fecha as string),
      },
      include: {
        usuarioJuegos: {
          include: {
            usuario: {},
          },
        },
        estadio: {},
        categoriaJuego: {},
      },
      orderBy: [
        {
          estadioId: "asc",
        },
        {
          hora: "asc",
        },
      ],
    });
    const juegosCleaned = juegos.map((juego) => {
      let juegoCleaned: any = {
        id: juego.id,
        hora: juego.hora,
        fecha: juego.fecha,
        precio: Number(juego.precio),
        estatus: juego.estatus,
        estadio: { ...juego.estadio },
        categoriaJuego: { ...juego.categoriaJuego },
      };
      juegoCleaned.arbitros = juego.usuarioJuegos.map((usuarioJuego) => {
        return {
          id: usuarioJuego.usuario.id,
          nombre: usuarioJuego.usuario.nombre,
          apellido: usuarioJuego.usuario.apellido,
        };
      });
      return juegoCleaned;
    });
    res.json(juegosCleaned);
  } else if (req.method === "POST") {
    try {
      const { estadio, categoria, fecha, precio, arbitros } = JSON.parse(
        req.body
      );
      const fechaToDate = new Date(fecha as string);

      const juego = await prisma.$transaction(async (tx) => {
        const juego = await tx.juego.create({
          data: {
            estadio: {
              connect: { id: Number(estadio) },
            },
            categoriaJuego: {
              connect: {
                id: Number(categoria),
              },
            },
            precio,
            fecha: fechaToDate,
            hora: fechaToDate,
          },
        });

        if (arbitros.length) {
          const data = arbitros.map((arbitro) => {
            return { juegoId: juego.id, usuarioId: arbitro.id };
          });
          await tx.usuarioJuego.createMany({
            data,
          });
        }
        console.log("juego", juego);
        return juego;
      });
      res.json(juego);
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  } else if (req.method === "PUT") {
    try {
      const id = Number(req.query.juegoId);
      const { estadioId, categoriaJuegoId, fecha } = req.body;
      const fechaToDate = new Date(fecha as string);
      const juego = await prisma.juego.update({
        where: {
          id,
        },
        data: {
          estadio: {
            connect: { id: estadioId },
          },
          categoriaJuego: {
            connect: {
              id: categoriaJuegoId,
            },
          },
          fecha: fechaToDate,
          hora: fechaToDate,
        },
      });
      res.json(juego);
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  } else if (req.method === "DELETE") {
    // delete todo
    const id = req.query.todoId as string;
    await prisma.todo.delete({ where: { id } });

    res.json({ status: "ok" });
  }
};
