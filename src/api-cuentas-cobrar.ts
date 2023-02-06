import useSWR from "swr";
import fetchJson from "./lib/fetchJson";
import { CuentaCobrar, CuentaCobrarCreateData } from "./types";

const cuentasCobrarPath = "/api/cuentas-cobrar";

export const useCuentasCobrar = (usuarioId: string) =>
  useSWR<CuentaCobrar[]>(
    `${cuentasCobrarPath}?usuarioId=${usuarioId}`,
    fetchJson
  );

export const createCuentaPorCobrar = async (data: CuentaCobrarCreateData) => {
  const response = await fetch(cuentasCobrarPath, {
    method: "POST",
    body: JSON.stringify({ ...data }),
  });
  if (response.status === 500) {
    throw new Error("Ocurrió un error al guardar el gasto");
  }
};
