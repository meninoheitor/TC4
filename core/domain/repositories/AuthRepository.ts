import type { AuthUser } from "../entities/User";

export interface AuthRepository {
  register(name: string, email: string, password: string): Promise<AuthUser>;
  login(email: string, password: string): Promise<AuthUser>;
  logout(): Promise<void>;
  observeAuthState(callback: (user: AuthUser | null) => void): () => void;
  getCurrentUser(): AuthUser | null;
}
