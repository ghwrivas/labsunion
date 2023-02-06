import useSWR from "swr";
import fetchJson from "./lib/fetchJson";
import { MovimientoResult } from "./types";

const movimientosPath = "/api/movimientos";

export const useMovimientos = () =>
  useSWR<MovimientoResult>(movimientosPath, fetchJson);
