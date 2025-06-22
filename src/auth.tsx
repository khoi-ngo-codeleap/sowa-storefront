import React, { useCallback, useMemo } from "react";
import supabase from "./api/client/supabase";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { User } from "@supabase/supabase-js";

export interface AuthContext {
  logout: () => Promise<void>;
  user: User | null;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { auth } = useRouteContext({ from: "__root__" });

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate({ to: "/signin" });
  }, []);

  const value = useMemo(() => {
    return {
      logout,
      user: auth.user,
    };
  }, [auth.user, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
