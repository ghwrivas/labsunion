import useSWR from "swr";
import { MovimientoResult } from "./types";

const movimientosPath = "/api/movimientos";

export const useMovimientos = () => useSWR<MovimientoResult>(movimientosPath);
