import useSWR from "swr";
import { CuentaCobrar } from "./types";

const cuentasCobrarPath = "/api/cuentas-cobrar";

export const useCuentasCobrar = (usuarioId: string) =>
  useSWR<CuentaCobrar[]>(`${cuentasCobrarPath}?usuarioId=${usuarioId}`);
