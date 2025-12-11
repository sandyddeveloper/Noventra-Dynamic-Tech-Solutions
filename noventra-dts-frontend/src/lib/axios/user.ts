// src/lib/api/user.ts

import api from "./api";

export async function fetchCurrentUser() {
  const res = await api.get("/api/auth/me/");
  return res.data;
}
