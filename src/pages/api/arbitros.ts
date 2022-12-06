import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const usuarios = await prisma.usuario.findMany({
      where: {
        activo: true,
      },
      orderBy: {
        nombre: "asc",
      },
    });
    const arbitros = usuarios.map((usuario) => {
      return {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
      };
    });
    res.json(arbitros);
  }
};
