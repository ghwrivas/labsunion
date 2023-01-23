import {
  EstatusJuego,
  TipoCuentaCobrar,
  EstatusCuentaCobrar,
  TipoMovimiento,
} from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../lib/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { monto, cuentaCobrarId, tipo } = JSON.parse(req.body);
      const fecha = new Date();
      await prisma.$transaction(async (tx) => {
        const abono = await tx.abonoCuentaCobrar.create({
          data: {
            fecha,
            monto,
            cuentaCobrar: {
              connect: { id: cuentaCobrarId },
            },
          },
        });

        await tx.cuentaCobrar.update({
          where: {
            id: cuentaCobrarId,
          },
          data: {
            estatus: EstatusCuentaCobrar.PAGADO,
          },
        });

        const previousMovFinanza = await tx.movimientoFinanza.findMany({
          take: -1,
        });

        let newSaldoFinanza =
          Number(abono.monto) + Number(previousMovFinanza[0].saldo);
        const movFinanza = await tx.movimientoFinanza.create({
          data: {
            fecha,
            descripcion: tipo,
            monto: monto,
            saldo: newSaldoFinanza,
            tipo: TipoMovimiento.ABONO_CUENTA_COBRAR,
          },
        });

        await tx.movimientoFinanzaAbonoCuentaCobrar.create({
          data: {
            abonoCuentaCobrar: {
              connect: { id: abono.id },
            },
            movimientoFinanza: {
              connect: { id: movFinanza.id },
            },
          },
        });
        return abono;
      });
      res.json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  }
};
