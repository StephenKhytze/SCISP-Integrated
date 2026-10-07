// Works out who is really logged in, for deciding which buttons this module shows.
//
// The role comes from the JWT the backend issued at login, not from the "persona switcher"
// in the Topbar (which only changes what is displayed). This keeps the screen consistent with
// what the backend will actually allow — the backend is still the one that enforces it.

const STAFF_ROLES = ['admin', 'administrator', 'teacher', 'faculty', 'superadmin'];

const normalize = (role) => String(role || '').toLowerCase().replace(/[\s_-]/g, '');

function roleFromToken() {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload)).role ?? null;
  } catch {
    return null;
  }
}

function roleFromStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')?.role ?? null;
  } catch {
    return null;
  }
}

export function isStaffUser() {
  return STAFF_ROLES.includes(normalize(roleFromToken() ?? roleFromStoredUser()));
}

/** Prefer the backend's validation message (e.g. "The event date must be today or later."). */
export function errorMessage(err, fallback) {
  const firstValidation = err.response?.data?.errors
    ? Object.values(err.response.data.errors)[0]?.[0]
    : null;
  return firstValidation || err.response?.data?.message || fallback;
}
