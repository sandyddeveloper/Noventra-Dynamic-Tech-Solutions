// src/api/auth.ts
import {
  loginUser,
  logoutUser,
  refreshTokenRotate,
  getSessions,
  registerUser,
  verifyEmail,
  requestPasswordReset,
  confirmPasswordReset,
  getUser,
} from "./api";

export const authApi = {
  register: (data: { email: string; full_name?: string; password: string }) => registerUser(data),
  verifyEmail: (token: string) => verifyEmail(token),
  login: (data: { email: string; password: string; device?: string }) => loginUser(data),
  logout: () => logoutUser(),
  refresh: () => refreshTokenRotate(),
  me: (userId?: string) => getUser(userId),
  requestPasswordReset: (email: string) => requestPasswordReset(email),
  confirmPasswordReset: (payload: { token: string; password: string }) => confirmPasswordReset(payload),
  sessions: () => getSessions(),
};

export default authApi;
