import useSWR from "swr";
import { Arbitro, ArbitroEditData } from "./types";

const arbitrosPath = "/api/arbitros";

export const useArbitrosByActivo = () =>
  useSWR<Arbitro[]>(`${arbitrosPath}?activo=true`);

export const useArbitros = () => useSWR<Arbitro[]>(arbitrosPath);

export const editArbitro = async (data: ArbitroEditData) => {
  const response = await fetch(`${arbitrosPath}?arbitroId=${data.id}`, {
    method: "PUT",
    body: JSON.stringify({ ...data }),
  });
  if (response.status === 500) {
    throw new Error("error al editar arbitro");
  }
};

export const createArbitro = async (data: ArbitroEditData) => {
  const response = await fetch(arbitrosPath, {
    method: "POST",
    body: JSON.stringify({ ...data }),
  });
  if (response.status === 500) {
    throw new Error("error al crear arbitro");
  }
};
