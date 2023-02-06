import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { isSamePass, hashPass } from "../../lib/crypto-pass";

import { prisma } from "../../lib/db";
import { sessionOptions } from "../../lib/session";

async function changePasswordRoute(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user) {
    return res.status(401).json({ status: "unauthorized" });
  }
  if (req.method === "POST") {
    try {
      const { oldPassword, newPassword } = JSON.parse(req.body);
      const correo_electronico = req.session.user.correo_electronico;

      const usuario = await prisma.usuario.findFirst({
        where: {
          correo_electronico,
        },
      });

      const samePass = await isSamePass(oldPassword, usuario.contrasenia);

      if (!samePass) {
        return res
          .status(400)
          .json({ message: "Error al cambiar la contraseña" });
      }

      const newHashedPassword = await hashPass(newPassword);
      await prisma.usuario.update({
        where: {
          correo_electronico,
        },
        data: {
          contrasenia: newHashedPassword,
        },
      });
      res.json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  }
}

export default withIronSessionApiRoute(changePasswordRoute, sessionOptions);
