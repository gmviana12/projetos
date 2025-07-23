import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, company?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('taskflow-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string, company?: string) => {
    try {
      // For demo purposes, create a mock user
      // In production, this would integrate with Supabase Auth
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        fullName,
        company: company || null,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setUser(newUser);
      localStorage.setItem('taskflow-user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Failed to create account');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // For demo purposes, create a mock user
      // In production, this would integrate with Supabase Auth
      const mockUser: User = {
        id: crypto.randomUUID(),
        email,
        fullName: email.split('@')[0],
        company: 'Demo Company',
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setUser(mockUser);
      localStorage.setItem('taskflow-user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Failed to sign in');
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('taskflow-user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
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
