import useSWR from "swr";
import { CategoriaJuego } from "./types";

const categoriasPath = "/api/categorias";

export const useCategorias = () => useSWR<CategoriaJuego[]>(categoriasPath);
