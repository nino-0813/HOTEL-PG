const ADMIN_KEY = 'hotel-pg-admin';

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(ADMIN_KEY) === '1';
}

export function setAdminLoggedIn(): void {
  sessionStorage.setItem(ADMIN_KEY, '1');
}

export function adminLogout(): void {
  sessionStorage.removeItem(ADMIN_KEY);
}

export function getAdminPassword(): string {
  return process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? process.env.VITE_ADMIN_PASSWORD ?? 'admin';
}
