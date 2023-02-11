import {
  EstatusJuego,
  TipoCuentaCobrar,
  EstatusCuentaCobrar,
  Role,
} from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../lib/db";

const getUTCDate = (strDate) => {
  if (strDate.length > 10) {
    // formato con hora YYYY-MM-DDTHH:MM
    const [subStrDate, subStrTime] = strDate.split("T");

    const [yearStr, monthStr, dateStr] = subStrDate.split("-");

    const intYear = parseInt(yearStr, 10);
    const intMonth = parseInt(monthStr, 10);
    const intDate = parseInt(dateStr, 10);

    const [hourStr, minStr] = subStrTime.split(":");

    const intHour = parseInt(hourStr, 10);
    const intMin = parseInt(minStr, 10);

    return new Date(
      Date.UTC(intYear, intMonth - 1, intDate, intHour, intMin, 0, 0)
    );
  } else {
    // formato YYYY-MM-DD
    const [yearStr, monthStr, dateStr] = strDate.split("-");

    const intYear = parseInt(yearStr, 10);
    const intMonth = parseInt(monthStr, 10);
    const intDate = parseInt(dateStr, 10);

    return new Date(Date.UTC(intYear, intMonth - 1, intDate, 0, 0, 0, 0));
  }
};

const isValidSchedule = async (fechaInicio, fechaFin, estadio, juegoId?) => {
  if (juegoId) {
    const count = await prisma.juego.count({
      where: {
        OR: [
          {
            fecha: {
              lte: fechaFin,
              gte: fechaInicio,
            },
          },
          {
            fechaFin: {
              lte: fechaFin,
              gte: fechaInicio,
            },
          },
        ],
        AND: {
          estadioId: estadio,
        },
        NOT: {
          id: juegoId,
        },
      },
    });
    return count === 0;
  } else {
    const count = await prisma.juego.count({
      where: {
        OR: [
          {
            fecha: {
              lte: fechaFin,
              gte: fechaInicio,
            },
          },
          {
            fechaFin: {
              lte: fechaFin,
              gte: fechaInicio,
            },
          },
        ],
        AND: {
          estadioId: estadio,
        },
      },
    });
    return count === 0;
  }
};

async function juegosRoute(req: NextApiRequest, res: NextApiResponse) {
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
        fechaFin: juego.fechaFin,
        duracion:
          (juego.fechaFin.getTime() - juego.fecha.getTime()) / 1000 / 60,
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
          nombreCompleto: `${usuarioJuego.usuario.nombre} ${usuarioJuego.usuario.apellido}`,
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
          lte: getUTCDate(`${fechaAsStr}T23:59`),
          gte: getUTCDate(`${fechaAsStr}T00:00`),
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
        fechaFin: juego.fechaFin,
        duracion:
          (juego.fechaFin.getTime() - juego.fecha.getTime()) / 1000 / 60,
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
    if (
      !req.session.user ||
      ((req.session.user.role as Role) !== Role.PRESIDENTE &&
        (req.session.user.role as Role) !== Role.COORDINADOR)
    ) {
      return res.status(403).json({ status: "forbidden" });
    }
    try {
      const { estadio, categoria, fecha, precio, arbitros, duracion } =
        JSON.parse(req.body);

      const estadioToNumber = Number(estadio);
      const fechaInicio = getUTCDate(fecha as string);
      const fechaFin = new Date(fechaInicio.getTime() + duracion * 60000);

      const validSchedule = await isValidSchedule(
        fechaInicio,
        fechaFin,
        estadioToNumber
      );
      if (!validSchedule) {
        return res.status(409).json({
          message:
            "Existen juegos registrados en la misma fecha y hora en el estadio seleccionado",
        });
      }

      const juego = await prisma.$transaction(
        async (tx) => {
          const juego = await tx.juego.create({
            data: {
              estadio: {
                connect: { id: estadioToNumber },
              },
              categoriaJuego: {
                connect: {
                  id: Number(categoria),
                },
              },
              precio,
              fecha: fechaInicio,
              fechaFin,
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
        },
        {
          maxWait: 5000,
          timeout: 10000,
        }
      );
      res.json(juego);
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  } else if (req.method === "PUT") {
    if (
      !req.session.user ||
      ((req.session.user.role as Role) !== Role.PRESIDENTE &&
        (req.session.user.role as Role) !== Role.COORDINADOR)
    ) {
      return res.status(403).json({ status: "forbidden" });
    }
    try {
      const id = Number(req.query.juegoId);
      const { estadio, categoria, fecha, precio, arbitros, duracion } =
        JSON.parse(req.body);
      const estadioToNumber = Number(estadio);

      const fechaInicio = getUTCDate(fecha as string);
      const fechaFin = new Date(fechaInicio.getTime() + duracion * 60000);

      const validSchedule = await isValidSchedule(
        fechaInicio,
        fechaFin,
        estadioToNumber,
        id
      );
      if (!validSchedule) {
        return res.status(409).json({
          message:
            "Existen juegos registrados en la misma fecha y hora en el estadio seleccionado",
        });
      }

      const juego = await prisma.$transaction(
        async (tx) => {
          const juego = await tx.juego.update({
            where: {
              id,
            },
            data: {
              estadio: {
                connect: { id: estadioToNumber },
              },
              categoriaJuego: {
                connect: {
                  id: Number(categoria),
                },
              },
              precio,
              fecha: fechaInicio,
              fechaFin,
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
        },
        {
          maxWait: 5000,
          timeout: 10000,
        }
      );
      res.json(juego);
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  } else if (req.method === "DELETE") {
    if (
      !req.session.user ||
      ((req.session.user.role as Role) !== Role.PRESIDENTE &&
        (req.session.user.role as Role) !== Role.COORDINADOR)
    ) {
      return res.status(403).json({ status: "forbidden" });
    }
    try {
      const juegoId = Number(req.query.juegoId);
      await prisma.$transaction(
        async (tx) => {
          const id = Number(juegoId);
          const juego = await tx.juego.findFirst({
            where: {
              id,
            },
          });
          if (juego.estatus === EstatusJuego.PROGRAMADO) {
            await tx.juego.delete({ where: { id } });
          }
        },
        {
          maxWait: 5000,
          timeout: 10000,
        }
      );
      res.json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  } else if (req.method === "PATCH") {
    if (
      !req.session.user ||
      ((req.session.user.role as Role) !== Role.PRESIDENTE &&
        (req.session.user.role as Role) !== Role.COORDINADOR)
    ) {
      return res.status(403).json({ status: "forbidden" });
    }
    try {
      const juegoId = Number(req.query.juegoId);
      const { estatus } = JSON.parse(req.body);
      await prisma.$transaction(
        async (tx) => {
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
        },
        {
          maxWait: 5000,
          timeout: 10000,
        }
      );
      res.json({ status: "ok" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error" });
    }
  }
}

export default withIronSessionApiRoute(juegosRoute, sessionOptions);
