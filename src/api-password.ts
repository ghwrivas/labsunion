import fetchJson from "./lib/fetchJson";
import { ChangePasswordData } from "./types";

const passwordPath = "/api/change-password";

export const changePassword = async (data: ChangePasswordData) => {
  return await fetchJson(passwordPath, {
    method: "POST",
    body: JSON.stringify({ ...data }),
  });
};
