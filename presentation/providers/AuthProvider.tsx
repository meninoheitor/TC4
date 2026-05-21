import { container } from "@/core/di/container";
import type { AuthUser } from "@/core/domain/entities/User";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = container.repositories.auth.observeAuthState(
      (authUser) => {
        setUser(authUser);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await container.useCases.auth.login.execute(email, password);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await container.useCases.auth.register.execute(name, email, password);
    },
    [],
  );

  const logout = useCallback(async () => {
    await container.useCases.auth.logout.execute();
    await container.cache.transactions.clear();
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext deve ser usado dentro de AuthProvider");
  }

  return context;
}
