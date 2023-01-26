import { CategoriaJuego } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { activo } = req.query;

    let categorias: CategoriaJuego[];
    if (activo) {
      categorias = await prisma.categoriaJuego.findMany({
        where: {
          activo: true,
        },
        orderBy: {
          nombre: "asc",
        },
      });
    } else {
      categorias = await prisma.categoriaJuego.findMany({
        orderBy: {
          nombre: "asc",
        },
      });
    }

    const categoriasList = categorias.map((categoria) => {
      return {
        id: categoria.id,
        nombre: categoria.nombre,
        precio: categoria.precio,
        activo: categoria.activo,
      };
    });
    res.json(categoriasList);
  } else if (req.method === "PUT") {
    try {
      const id = Number(req.query.categoriaId);
      const { nombre, activo, precio } = JSON.parse(req.body);

      await prisma.categoriaJuego.update({
        where: { id },
        data: {
          nombre,
          activo: activo === "true",
          precio: Number(precio),
        },
      });
      res.json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  } else if (req.method === "POST") {
    try {
      const { nombre, activo, precio } = JSON.parse(req.body);

      await prisma.categoriaJuego.create({
        data: {
          nombre,
          activo: activo === "true",
          precio: Number(precio),
        },
      });
      res.json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  }
};
