import { GastoCreateData } from "./types";

const gastosPath = "/api/gastos";

export const createGasto = async (gasto: GastoCreateData) => {
  const response = await fetch(gastosPath, {
    method: "POST",
    body: JSON.stringify({ ...gasto }),
  });
  if (response.status === 409) {
    const responseBody = await response.json();
    throw new Error(responseBody.message);
  }
  if (response.status === 500) {
    throw new Error("Ocurrió un error al guardar el gasto");
  }
};
