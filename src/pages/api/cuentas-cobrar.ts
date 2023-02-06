import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";

async function cuentasCobrarRoute(req: NextApiRequest, res: NextApiResponse) {
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
  }
}

export default withIronSessionApiRoute(cuentasCobrarRoute, sessionOptions);
