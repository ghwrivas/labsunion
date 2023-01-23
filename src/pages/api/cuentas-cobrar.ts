import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { usuarioId } = req.query;
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
        id: "asc",
      },
    });
    let cuentas: any = cuentasCobrar.map((cuentaCobrar) => {
      let juego = null;
      if (cuentaCobrar.cuentaCobrarJuegos.length) {
        const fechaIsoString = cuentaCobrar.cuentaCobrarJuegos[0].juego.fecha
          .toISOString()
          .substring(0, 11);
        const horaToIsoString = cuentaCobrar.cuentaCobrarJuegos[0].juego.hora
          .toISOString()
          .substring(11);
        const fechaUTC = new Date(fechaIsoString + horaToIsoString);
        const horaLocale = fechaUTC.toLocaleString().substring(11);
        juego = {
          id: cuentaCobrar.cuentaCobrarJuegos[0].id,
          estatus: cuentaCobrar.cuentaCobrarJuegos[0].juego.estatus,
          fecha: fechaIsoString + horaLocale + ".000Z",
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
  }
};
