import React, { useCallback, useEffect } from "react";

export interface AuthContext {
  isAuthenticated: boolean;
  login: (username: string) => Promise<void>;
  logout: () => Promise<void>;
  user: string | null;
}

const AuthContext = React.createContext<AuthContext | null>(null);

const key = "tanstack.auth.user";

const useUserStore = () => {
  const [user, setUserState] = React.useState<string | null>(() =>
    localStorage.getItem(key)
  );
  const setUser = useCallback((user: string | null) => {
    setUserState(user);
    user ? localStorage.setItem(key, user) : localStorage.removeItem(key);
  }, []);
  return { user, setUser };
};

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { user, setUser } = useUserStore();
  const isAuthenticated = !!user;

  const logout = React.useCallback(async () => {
    setUser(null);
  }, []);

  const login = React.useCallback(async (username: string) => {
    setUser(username);
  }, []);

  useEffect(() => {
    setUser(localStorage.getItem(key));
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
