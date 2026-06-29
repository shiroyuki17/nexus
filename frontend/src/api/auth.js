import { httpClient } from "./httpClient";

export const authApi = {
  getCurrentUser: () => httpClient.get("/auth/me"),
  logout: () => httpClient.post("/auth/logout", {})
};
