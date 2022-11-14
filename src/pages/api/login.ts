import type { User } from "./user";

import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = await req.body;
  console.log(req.body);
  console.log(sessionOptions);
  try {
    const { nombre, role } = await prisma.usuario.findUniqueOrThrow({
      where: {
        correo_electronico: username,
      },
    });
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
    console.log("loginRoute", error);
    res.status(500).json({ message: (error as Error).message });
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
