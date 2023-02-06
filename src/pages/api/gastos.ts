import { Role, TipoMovimiento } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../lib/db";
import { sessionOptions } from "../../lib/session";

async function gastosRoute(req: NextApiRequest, res: NextApiResponse) {
  if (
    !req.session.user ||
    ((req.session.user.role as Role) !== Role.PRESIDENTE &&
      (req.session.user.role as Role) !== Role.TESORERO)
  ) {
    return res.status(403).json({ status: "forbidden" });
  }
  if (req.method === "POST") {
    try {
      const { monto, descripcion } = JSON.parse(req.body);
      const fecha = new Date();
      await prisma.$transaction(
        async (tx) => {
          const previousMovFinanza = await tx.movimientoFinanza.findMany({
            take: -1,
          });

          const saldo = Number(previousMovFinanza[0].saldo);
          const montoGasto = Number(monto);

          if (montoGasto > saldo) {
            return res.status(409).json({
              status: "nok",
              message: `El monto del gasto ${montoGasto} debe ser menor o igual al saldo ${saldo}`,
            });
          }
          let newSaldoFinanza = saldo - montoGasto;
          const movFinanza = await tx.movimientoFinanza.create({
            data: {
              fecha,
              descripcion,
              monto: monto,
              saldo: newSaldoFinanza,
              tipo: TipoMovimiento.GASTO,
            },
          });

          return movFinanza;
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
  }
}

export default withIronSessionApiRoute(gastosRoute, sessionOptions);
