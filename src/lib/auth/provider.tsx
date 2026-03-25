'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || 
                       !process.env.NEXT_PUBLIC_SUPABASE_URL;
 
  const fetchProfile = async (userId: string) => {
    // Mock profile for preview mode
    if (isPlaceholder) {
      setProfile({
        id: userId,
        full_name: user?.user_metadata?.full_name || 'Preview User',
        email: user?.email || 'user@test.com',
        role: user?.app_metadata?.role || 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        avatar_url: null
      });
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    setProfile(data);
    setLoading(false);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    if (isPlaceholder) {
      // In placeholder mode, we don't try to fetch anything
      setLoading(false);
      return;
    }

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    if (isPlaceholder) {
      // Enable mock signup for preview
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const mockUser = {
        id: 'user-id-' + Math.random().toString(36).substr(2, 9),
        email,
        user_metadata: { full_name: fullName },
        app_metadata: { role: 'user' },
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as any;
      
      setUser(mockUser);
      setSession({ access_token: 'mock', user: mockUser } as any);
      /* eslint-enable @typescript-eslint/no-explicit-any */
      setProfile({ 
        id: mockUser.id, 
        full_name: fullName, 
        email, 
        role: 'user', 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        avatar_url: null
      });
      return { error: null };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    if (isPlaceholder) {
      // Enable mock signin for preview
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const isAdmin = email.toLowerCase().includes('admin');
      const mockUser = {
        id: isAdmin ? 'admin-id' : 'user-id',
        email,
        user_metadata: { full_name: isAdmin ? 'Admin User' : 'Standard User' },
        app_metadata: { role: isAdmin ? 'admin' : 'user' },
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as any;

      setUser(mockUser);
      setSession({ access_token: 'mock', user: mockUser } as any);
      /* eslint-enable @typescript-eslint/no-explicit-any */
      setProfile({ 
        id: mockUser.id, 
        full_name: isAdmin ? 'Admin User' : 'Standard User', 
        email, 
        role: isAdmin ? 'admin' : 'user', 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        avatar_url: null
      });
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
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
