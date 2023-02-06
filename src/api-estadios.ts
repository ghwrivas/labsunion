import useSWR from "swr";
import fetchJson from "./lib/fetchJson";
import { Estadio, EstadioData } from "./types";

const estadiosPath = "/api/estadios";

export const useEstadios = () => useSWR<Estadio[]>(estadiosPath, fetchJson);

export const useEstadiosByActivo = () =>
  useSWR<Estadio[]>(`${estadiosPath}?activo=true`, fetchJson);

export const editEstadio = async (data: EstadioData) => {
  const response = await fetch(`${estadiosPath}?estadioId=${data.id}`, {
    method: "PUT",
    body: JSON.stringify({ ...data }),
  });
  if (response.status === 500) {
    throw new Error("error al editar estadio");
  }
};

export const createEstadio = async (data: EstadioData) => {
  const response = await fetch(estadiosPath, {
    method: "POST",
    body: JSON.stringify({ ...data }),
  });
  if (response.status === 500) {
    throw new Error("error al crear estadio");
  }
};
