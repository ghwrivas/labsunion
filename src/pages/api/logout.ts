import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import type { User } from "../api/user";

function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  req.session.destroy();
  res.json({ isLoggedIn: false, nombre: "", correo_electronico: "", role: "" });
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions);
