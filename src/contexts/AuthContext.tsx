import { createContext, useContext, useState, ReactNode } from 'react';
import { AuthContextType, User } from '../graphql/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (emailOrProvider: string, password?: string) => {
    try {
      if (emailOrProvider === 'google') {
        // Google OAuth is handled by the GoogleLogin component
        // This function will be called with the credential from GoogleLogin
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
        localStorage.setItem('token', data.data.loginWithGoogle.token);
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
      localStorage.setItem('token', data.data.login.token);
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
      localStorage.setItem('token', data.data.register.token);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

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