import type { User } from "./user";

import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";
import { isSamePass, hashPass } from "../../lib/crypto-pass";

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = await req.body;
  try {
    const { nombre, contrasenia, role } =
      await prisma.usuario.findUniqueOrThrow({
        where: {
          correo_electronico: username,
        },
      });
    const isValidPass = await isSamePass(password, contrasenia);
    if (!isValidPass) {
      return res
        .status(500)
        .json({ message: "Usuario o contraseña inválidossss" });
    }
    const user = {
      isLoggedIn: true,
      nombre,
      role,
      correo_electronico: username,
    } as User;
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Usuario o contraseña inválidos" });
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
