import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const categorias = await prisma.categoriaJuego.findMany({
      where: {
        activo: true,
      },
      orderBy: {
        nombre: "asc",
      },
    });
    const categoriasList = categorias.map((categoria) => {
      return {
        id: categoria.id,
        nombre: categoria.nombre,
        precio: categoria.precio,
        activo: categoria.activo,
      };
    });
    res.json(categoriasList);
  }
};
