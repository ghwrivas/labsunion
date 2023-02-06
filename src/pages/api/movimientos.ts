import { MovimientoFinanza, Role } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";
import { sessionOptions } from "../../lib/session";

async function movimientosRoute(req: NextApiRequest, res: NextApiResponse) {
  if (
    !req.session.user ||
    ((req.session.user.role as Role) !== Role.PRESIDENTE &&
      (req.session.user.role as Role) !== Role.TESORERO)
  ) {
    return res.status(403).json({ status: "forbidden" });
  }
  if (req.method === "GET") {
    const movimientos: MovimientoFinanza[] =
      await prisma.movimientoFinanza.findMany({
        orderBy: {
          id: "desc",
        },
      });

    const saldo = movimientos[0].saldo;
    const movimientosGroups = movimientos.reduce((group, movimiento) => {
      const { fecha: date } = movimiento;
      const fecha = date.toISOString();
      group[fecha] = group[fecha] ?? [];
      group[fecha].push(movimiento);
      return group;
    }, {});

    const result = {
      saldo,
      movimientos: movimientosGroups,
    };
    res.json(result);
  }
}

export default withIronSessionApiRoute(movimientosRoute, sessionOptions);
