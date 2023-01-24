import { Role, Usuario } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { hashPass } from "../../lib/crypto-pass";
import { prisma } from "../../lib/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { activo } = req.query;

    let usuarios: Usuario[];
    if (activo) {
      usuarios = await prisma.usuario.findMany({
        where: {
          activo: activo === "true",
        },
        orderBy: {
          nombre: "asc",
        },
      });
    } else {
      usuarios = await prisma.usuario.findMany({
        orderBy: {
          nombre: "asc",
        },
      });
    }

    const arbitros = usuarios.map((usuario) => {
      return {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        fecha_nacimiento: usuario.fecha_nacimiento,
        correo_electronico: usuario.correo_electronico,
        role: usuario.role,
        activo: usuario.activo,
      };
    });
    res.json(arbitros);
  } else if (req.method === "PUT") {
    try {
      const id = Number(req.query.arbitroId);
      const {
        nombre,
        apellido,
        fecha_nacimiento,
        correo_electronico,
        role: rol,
        activo,
      } = JSON.parse(req.body);
      const fechaToDate = new Date(fecha_nacimiento as string);
      const role: Role = Role[rol];
      await prisma.usuario.update({
        where: { id },
        data: {
          nombre,
          apellido,
          correo_electronico,
          role,
          activo: activo === "true",
          fecha_nacimiento: fechaToDate,
        },
      });
      res.json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  } else if (req.method === "POST") {
    try {
      const {
        nombre,
        apellido,
        fecha_nacimiento,
        correo_electronico,
        role: rol,
        activo,
      } = JSON.parse(req.body);
      const fechaToDate = new Date(fecha_nacimiento as string);
      const role: Role = Role[rol];
      const contrasenia = await hashPass(fecha_nacimiento.substring(0, 4));
      await prisma.usuario.create({
        data: {
          nombre,
          apellido,
          correo_electronico,
          role,
          activo: activo === "true",
          fecha_nacimiento: fechaToDate,
          contrasenia,
        },
      });
      res.json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  }
};
