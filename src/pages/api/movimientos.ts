import { MovimientoFinanza } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";
import { sessionOptions } from "../../lib/session";

async function movimientosRoute(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user) {
    return res.status(401).json({ status: "unauthorized" });
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
