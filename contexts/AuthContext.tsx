'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtVerify } from 'jose';

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  country: string;
  interests: string[];
  roles: Role[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  hasRole: (roleName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const hasRole = (roleName: string) => {
    if (!user) return false;
    return user.roles.some(role => role.name === roleName);
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      // Verifică token-ul
      const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Verifică dacă token-ul a expirat
      if (payload.exp && payload.exp < Date.now() / 1000) {
        logout();
        return;
      }

      // Setează utilizatorul din token
      setUser({
        id: payload.userId as string,
        username: payload.username as string,
        email: payload.email as string,
        country: '', // Aceste date trebuie preluate din API
        interests: [], // Aceste date trebuie preluate din API
        roles: [] // Aceste date trebuie preluate din API
      });
    } catch (error) {
      console.error('Error checking auth:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 