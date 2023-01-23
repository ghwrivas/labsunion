import { AbonoCreateData } from "./types";

const abonosPath = "/api/abonos";

export const createAbonos = async (abonos: AbonoCreateData[]) => {
  const responses = [];
  for await (let abono of abonos) {
    const response = await fetch(abonosPath, {
      method: "POST",
      body: JSON.stringify({ ...abono }),
    });
    responses.push(response);
  }
  responses.forEach((response) => {
    if (response.status === 500) {
      throw new Error("error registrando abonos");
    }
  });
};
