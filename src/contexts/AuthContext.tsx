import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthContextType, User, AuthResponse } from '../graphql/types';
import { GET_CURRENT_USER, LOGIN_WITH_GOOGLE, LOGIN, REGISTER } from '../graphql/queries';
import { useApolloClient } from '@apollo/client';

// Constants
const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const TOKEN_KEY = 'token';
const TOKEN_EXPIRY_TIME = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

// Token Management
const tokenManager = {
  setToken: (token: string) => {
    const expiryTime = new Date().getTime() + TOKEN_EXPIRY_TIME;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),

  isTokenValid: () => {
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTime) return false;
    return new Date().getTime() < parseInt(expiryTime);
  },

  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }
};

// API Service
const authApi = {
  async fetchGraphQL<T>(query: string, variables?: Record<string, any>): Promise<T> {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Network request failed');
    }

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return data.data;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const client = useApolloClient();

  const restoreSession = async () => {
    const token = tokenManager.getToken();
    if (!token || !tokenManager.isTokenValid()) {
      setUser(null);
      tokenManager.clearToken();
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await client.query({
        query: GET_CURRENT_USER,
        fetchPolicy: 'no-cache'
      });

      if (data?.me) {
        setUser(data.me);
      } else {
        throw new Error('No user data received');
      }
    } catch (error) {
      console.error('Session restoration error:', error);
      setUser(null);
      tokenManager.clearToken();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const login = async (emailOrProvider: string, password?: string) => {
    try {
      if (emailOrProvider === 'google') {
        if (!password) {
          throw new Error('No Google credential provided');
        }

        const data = await authApi.fetchGraphQL<{ loginWithGoogle: AuthResponse }>(
          LOGIN_WITH_GOOGLE.loc?.source.body || '',
          { credential: password }
        );

        setUser(data.loginWithGoogle.user);
        tokenManager.setToken(data.loginWithGoogle.token);
        return;
      }

      const data = await authApi.fetchGraphQL<{ login: AuthResponse }>(
        LOGIN.loc?.source.body || '',
        { email: emailOrProvider, password }
      );

      setUser(data.login.user);
      tokenManager.setToken(data.login.token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const data = await authApi.fetchGraphQL<{ register: AuthResponse }>(
        REGISTER.loc?.source.body || '',
        { email, password, name }
      );

      setUser(data.register.user);
      tokenManager.setToken(data.register.token);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    tokenManager.clearToken();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
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