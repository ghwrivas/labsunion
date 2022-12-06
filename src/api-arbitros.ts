import useSWR from "swr";
import { Arbitro } from "./types";

const arbitrosPath = "/api/arbitros";

export const useArbitros = () => useSWR<Arbitro[]>(arbitrosPath);
