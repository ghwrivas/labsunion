import useSWR from "swr";
import { Juego, JuegoCreateData } from "./types";

const juegosPath = "/api/juegos";

export const useJuegos = (fecha: string) =>
  useSWR<Juego[]>(`${juegosPath}?fecha=${fecha}`);

export const createJuego = async (juegoCreateData: JuegoCreateData) => {
  const response = await fetch(juegosPath, {
    method: "POST",
    body: JSON.stringify({ ...juegoCreateData }),
  });
  if (response.status === 500) {
    throw new Error("error al crear juego");
  }
};
