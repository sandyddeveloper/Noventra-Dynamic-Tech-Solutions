// src/lib/api/user.ts

import api from "./api";


/**
 * GET /ndts/api/users/me
 * expects backend to return a UserDto with at least:
 * { id, fullName, email, roleName, timezone, enabled }
 */
export async function fetchCurrentUser() {
    const res = await api.get(`/api/users`);
    return res.data;
}
