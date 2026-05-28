const AUTH_STORAGE_KEY = "gymos-auth-user";

export type MockUser = {
  username: string;
  displayName: string;
};

const mockUsers = [
  { username: "kyawkyaw", password: "Cqrity@5", displayName: "Kyaw Kyaw" },
  { username: "maungmaung", password: "Cqrity@5", displayName: "Maung Maung" },
] as const;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getCurrentUser(): MockUser | null {
  if (!canUseStorage()) return null;

  const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as MockUser;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}

export function login(username: string, password: string) {
  const user = mockUsers.find(
    (mockUser) => mockUser.username === username.trim() && mockUser.password === password,
  );

  if (!user || !canUseStorage()) return false;

  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({ username: user.username, displayName: user.displayName }),
  );
  return true;
}

export function logout() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
