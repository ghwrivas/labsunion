import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { EstatusCuentaCobrar, Role, TipoCuentaCobrar } from "@prisma/client";

const buildNewArbitro = (data) => {
  let montoPagado = 0;
  let montoPendiente = 0;
  if (data.estatus === "PAGADO") {
    montoPagado = Number(data.monto);
  } else {
    montoPendiente = Number(data.monto);
  }
  return {
    id: data.id,
    nombre: data.nombre,
    apellido: data.apellido,
    montoPagado,
    montoPendiente,
  };
};

async function cuentasCobrarRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { usuarioId } = req.query;
      if (usuarioId) {
        const cuentasCobrar = await prisma.cuentaCobrar.findMany({
          where: {
            usuarioId: Number(usuarioId),
          },
          include: {
            cuentaCobrarJuegos: {
              include: {
                juego: {
                  include: {
                    categoriaJuego: {},
                    estadio: {},
                  },
                },
              },
            },
            abonoCuentasCobrar: {},
          },
          orderBy: {
            id: "desc",
          },
        });
        let cuentas: any = cuentasCobrar.map((cuentaCobrar) => {
          let juego = null;
          if (cuentaCobrar.cuentaCobrarJuegos.length) {
            juego = {
              id: cuentaCobrar.cuentaCobrarJuegos[0].id,
              estatus: cuentaCobrar.cuentaCobrarJuegos[0].juego.estatus,
              fecha: cuentaCobrar.cuentaCobrarJuegos[0].juego.fecha,
              estadio: cuentaCobrar.cuentaCobrarJuegos[0].juego.estadio.nombre,
              categoria:
                cuentaCobrar.cuentaCobrarJuegos[0].juego.categoriaJuego.nombre,
            };
          }
          return {
            id: cuentaCobrar.id,
            monto: Number(cuentaCobrar.monto),
            descripcion: cuentaCobrar.descripcion,
            tipo: cuentaCobrar.tipo,
            estatus: cuentaCobrar.estatus,
            juego,
          };
        });
        res.json(cuentas);
      } else {
        const list: any = await prisma.$queryRawUnsafe(
          'SELECT "Usuario"."id", "Usuario"."nombre", "Usuario"."apellido", "estatus", SUM(monto) AS "monto" FROM "CuentaCobrar" INNER JOIN "Usuario" ON "Usuario"."id" = "CuentaCobrar"."usuarioId" GROUP BY "Usuario"."id", "Usuario"."nombre", "Usuario"."apellido", "CuentaCobrar"."estatus"'
        );

        const groups = [];

        for (let i = 0; i < list.length; i++) {
          if (!groups.length) {
            const newArbitro = buildNewArbitro(list[i]);
            groups.push(newArbitro);
          } else {
            let foundIndex = null;
            for (let j = 0; j < groups.length; j++) {
              if (groups[j].id === list[i].id) {
                foundIndex = j;
                break;
              }
            }
            if (foundIndex !== null) {
              if (list[i].estatus === "PAGADO") {
                groups[foundIndex].montoPagado = Number(list[i].monto);
              } else {
                groups[foundIndex].montoPendiente = Number(list[i].monto);
              }
            } else {
              const newArbitro = buildNewArbitro(list[i]);
              groups.push(newArbitro);
            }
          }
        }

        return res.json(groups);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error" });
    }
  } else if (req.method === "POST") {
    if (
      !req.session.user ||
      ((req.session.user.role as Role) !== Role.PRESIDENTE &&
        (req.session.user.role as Role) !== Role.TESORERO)
    ) {
      return res.status(403).json({ status: "forbidden" });
    }
    try {
      const { monto, descripcion, usuarioId, tipo } = JSON.parse(req.body);
      const periodo = await prisma.periodo.findFirst({
        where: {
          activo: true,
        },
      });
      await prisma.cuentaCobrar.create({
        data: {
          monto,
          descripcion,
          usuario: {
            connect: { id: Number(usuarioId) },
          },
          tipo: tipo as TipoCuentaCobrar,
          periodo: {
            connect: { id: periodo.id },
          },
          estatus: EstatusCuentaCobrar.PENDIENTE,
        },
      });
      res.json({ status: "ok" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error" });
    }
  }
}

export default withIronSessionApiRoute(cuentasCobrarRoute, sessionOptions);
