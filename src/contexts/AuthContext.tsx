import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthContextType, User } from '../graphql/types';
import { gql, useApolloClient } from '@apollo/client';

const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const TOKEN_KEY = 'token';

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      email
      name
    }
  }
`;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const client = useApolloClient();

  const setTokenWithExpiry = (token: string) => {
    const expiryTime = new Date().getTime() + 6 * 60 * 60 * 1000; // 6 hours from now
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  };

  const isTokenValid = () => {
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTime) return false;
    return new Date().getTime() < parseInt(expiryTime);
  };

  const restoreSession = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !isTokenValid()) {
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
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
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
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
        
        const response = await fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              mutation LoginWithGoogle($credential: String!) {
                loginWithGoogle(credential: $credential) {
                  user {
                    id
                    email
                    name
                  }
                  token
                }
              }
            `,
            variables: {
              credential: password
            }
          }),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        setUser(data.data.loginWithGoogle.user);
        setTokenWithExpiry(data.data.loginWithGoogle.token);
        return;
      }

      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                user {
                  id
                  email
                  name
                }
                token
              }
            }
          `,
          variables: {
            email: emailOrProvider,
            password
          }
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      setUser(data.data.login.user);
      setTokenWithExpiry(data.data.login.token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Register($email: String!, $password: String!, $name: String!) {
              register(email: $email, password: $password, name: $name) {
                user {
                  id
                  email
                  name
                }
                token
              }
            }
          `,
          variables: {
            email,
            password,
            name
          }
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      setUser(data.data.register.user);
      setTokenWithExpiry(data.data.register.token);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
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