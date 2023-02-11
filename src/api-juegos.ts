import useSWR, { mutate } from "swr";
import fetchJson from "./lib/fetchJson";
import { Juego, JuegoCreateData, JuegoEditData } from "./types";

const juegosPath = "/api/juegos";

export const useJuegos = (fecha: string) =>
  useSWR<Juego[]>(`${juegosPath}?fecha=${fecha}`, fetchJson);

export const findJuego = async (juegoId: string) => {
  return await fetchJson<Juego>(`${juegosPath}?juegoId=${juegoId}`, {
    method: "GET",
  });
};

export const createJuego = async (juegoCreateData: JuegoCreateData) => {
  return await fetchJson(juegosPath, {
    method: "POST",
    body: JSON.stringify({ ...juegoCreateData }),
  });
};

export const editJuego = async (juegoEditData: JuegoEditData) => {
  return await fetchJson(`${juegosPath}?juegoId=${juegoEditData.id}`, {
    method: "PUT",
    body: JSON.stringify({ ...juegoEditData }),
  });
};

export const deleteJuego = async (juego: Juego) => {
  const fechaJuego = juego.fecha.substring(0, 10);
  mutate(
    `${juegosPath}?fecha=${fechaJuego}`,
    (juegos) => juegos.filter((j) => j.id !== juego.id),
    false
  );
  await fetch(`${juegosPath}?juegoId=${juego.id}`, {
    method: "DELETE",
  });
  mutate(`${juegosPath}?fecha=${fechaJuego}`);
};

export const changeStatus = async (juegoEditData: JuegoEditData) => {
  const response = await fetch(`${juegosPath}?juegoId=${juegoEditData.id}`, {
    method: "PATCH",
    body: JSON.stringify({ estatus: juegoEditData.estatus }),
  });
  if (response.status === 500) {
    throw new Error("error actualizando estatus");
  }
};
