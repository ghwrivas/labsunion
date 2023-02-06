import useSWR from "swr";
import fetchJson from "./lib/fetchJson";
import { CuentaCobrar } from "./types";

const cuentasCobrarPath = "/api/cuentas-cobrar";

export const useCuentasCobrar = (usuarioId: string) =>
  useSWR<CuentaCobrar[]>(
    `${cuentasCobrarPath}?usuarioId=${usuarioId}`,
    fetchJson
  );
