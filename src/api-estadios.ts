import useSWR from "swr";
import { CategoriaJuego, Estadio } from "./types";

const estadiosPath = "/api/estadios";

export const useEstadios = () => useSWR<Estadio[]>(estadiosPath);
