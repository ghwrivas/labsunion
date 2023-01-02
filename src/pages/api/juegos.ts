import { EstatusJuego } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../lib/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { fecha, juegoId } = req.query;
    if (juegoId) {
      const id = Number(juegoId);
      const juego = await prisma.juego.findFirst({
        where: {
          id,
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
      });

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
      res.json(juegoCleaned);
      return;
    }
    if (!fecha) {
      res.json([]);
      return;
    }
    console.log('fecha', new Date(fecha as string))
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
      const { estadio, categoria, fecha, precio, arbitros } = JSON.parse(
        req.body
      );
      const fechaToDate = new Date(fecha as string);
      const juego = await prisma.$transaction(async (tx) => {
        const juego = await tx.juego.update({
          where: {
            id,
          },
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
          await tx.usuarioJuego.deleteMany({ where: { juegoId: juego.id } });

          const data = arbitros.map((arbitro) => {
            return { juegoId: juego.id, usuarioId: arbitro.id };
          });
          await tx.usuarioJuego.createMany({
            data,
          });
        }
        return juego;
      });
      res.json(juego);
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  } else if (req.method === "DELETE") {
    try {
      const juegoId = Number(req.query.juegoId);
      await prisma.$transaction(async (tx) => {
        const id = Number(juegoId);
        const juego = await tx.juego.findFirst({
          where: {
            id,
          },
        });
        if (juego.estatus === EstatusJuego.PROGRAMADO) {
          await tx.juego.delete({ where: { id } });
        }
      });
      res.json({ status: "ok" });
    } catch (error) {
      console.log(error)
      res.status(500).json({ status: "error" });
    }
  }
};
