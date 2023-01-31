import {
  EstatusJuego,
  TipoCuentaCobrar,
  EstatusCuentaCobrar,
} from "@prisma/client";
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
    const fechaAsStr = fecha as string;
    const juegos = await prisma.juego.findMany({
      where: {
        fecha: {
          lte: new Date(`${fechaAsStr}T23:59:59.000Z`),
          gte: new Date(`${fechaAsStr}T00:00:00.000Z`),
        },
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
          fecha: "asc",
        },
      ],
    });
    const juegosCleaned = juegos.map((juego) => {
      let juegoCleaned: any = {
        id: juego.id,
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
      res.status(500).json({ status: "error" });
    }
  } else if (req.method === "PATCH") {
    try {
      const juegoId = Number(req.query.juegoId);
      const { estatus } = JSON.parse(req.body);
      await prisma.$transaction(async (tx) => {
        const id = Number(juegoId);
        const juego = await tx.juego.findFirst({
          where: {
            id,
          },
          include: {
            usuarioJuegos: {
              include: {
                usuario: {},
              },
            },
          },
        });
        if (
          juego.estatus === EstatusJuego.PROGRAMADO ||
          juego.estatus === EstatusJuego.SUSPENDIDO
        ) {
          await tx.juego.update({ where: { id }, data: { estatus } });
          if (
            estatus === EstatusJuego.REALIZADO ||
            estatus === EstatusJuego.REALIZADO_SIN_PAGO
          ) {
            // Crear cuenta por cobrar por arbitro
            const periodo = await tx.periodo.findFirst({
              where: {
                activo: true,
              },
            });
            for (let i = 0; i < juego.usuarioJuegos.length; i++) {
              const cuentaCobrar = await tx.cuentaCobrar.create({
                data: {
                  monto: Number(juego.precio) * 0.1,
                  descripcion: "Finanza por juego arbitrado",
                  usuario: {
                    connect: { id: juego.usuarioJuegos[i].usuarioId },
                  },
                  tipo: TipoCuentaCobrar.FINANZA_POR_JUEGO,
                  periodo: {
                    connect: { id: periodo.id },
                  },
                  estatus: EstatusCuentaCobrar.PENDIENTE,
                },
              });
              await tx.cuentaCobrarJuego.create({
                data: {
                  cuentaCobrar: {
                    connect: { id: cuentaCobrar.id },
                  },
                  juego: {
                    connect: { id: juego.id },
                  },
                },
              });
            }
          }
        }
      });
      res.json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  }
};
