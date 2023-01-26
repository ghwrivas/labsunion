import { Estadio } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { activo } = req.query;

    let estadios: Estadio[];
    if (activo) {
      estadios = await prisma.estadio.findMany({
        where: {
          activo: true,
        },
        orderBy: {
          nombre: "asc",
        },
      });
    } else {
      estadios = await prisma.estadio.findMany({
        orderBy: {
          nombre: "asc",
        },
      });
    }

    const estadiosList = estadios.map((estadio) => {
      return {
        id: estadio.id,
        nombre: estadio.nombre,
        activo: estadio.activo,
      };
    });
    res.json(estadiosList);
  } else if (req.method === "PUT") {
    try {
      const id = Number(req.query.estadioId);
      const { nombre, activo } = JSON.parse(req.body);

      await prisma.estadio.update({
        where: { id },
        data: {
          nombre,
          activo: activo === "true",
        },
      });
      res.json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  } else if (req.method === "POST") {
    try {
      const { nombre, activo } = JSON.parse(req.body);

      await prisma.estadio.create({
        data: {
          nombre,
          activo: activo === "true",
        },
      });
      res.json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  }
};
