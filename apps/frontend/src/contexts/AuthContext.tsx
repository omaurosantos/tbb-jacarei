import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/lib/api';
import { LoginRequest, LoginResponse, AppRole } from 'shared';
import { ApiClientError } from '@/lib/api/client';

interface AuthContextType {
  user: LoginResponse['user'] | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === AppRole.ADMIN;

  const refreshUser = async () => {
    try {
      if (authService.isAuthenticated()) {
        const response = await authService.getCurrentUser();
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      // Token inválido ou expirado
      if (error instanceof ApiClientError && error.statusCode === 401) {
        localStorage.removeItem('auth_token');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

