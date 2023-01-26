import useSWR from "swr";
import { CategoriaData, CategoriaJuego } from "./types";

const categoriasPath = "/api/categorias";

export const useCategorias = () => useSWR<CategoriaJuego[]>(categoriasPath);

export const useCategoriasByActivo = () =>
  useSWR<CategoriaJuego[]>(`${categoriasPath}?activo=true`);

export const editCategoria = async (data: CategoriaData) => {
  const response = await fetch(`${categoriasPath}?categoriaId=${data.id}`, {
    method: "PUT",
    body: JSON.stringify({ ...data }),
  });
  if (response.status === 500) {
    throw new Error("error al editar categoria");
  }
};

export const createCategoria = async (data: CategoriaData) => {
  const response = await fetch(categoriasPath, {
    method: "POST",
    body: JSON.stringify({ ...data }),
  });
  if (response.status === 500) {
    throw new Error("error al crear categoria");
  }
};
