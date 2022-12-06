import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const estadios = await prisma.estadio.findMany({
      where: {
        activo: true,
      },
      orderBy: {
        nombre: "asc",
      },
    });
    const estadiosList = estadios.map((estadio) => {
      return {
        id: estadio.id,
        nombre: estadio.nombre,
        activo: estadio.activo,
      };
    });
    res.json(estadiosList);
  }
};
