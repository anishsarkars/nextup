
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  availability: string | null;
  updated_at: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  signIn: (provider: 'github' | 'google') => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  profileComplete: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user profile is complete
  const profileComplete = !!userProfile && !!userProfile.linkedin_url && !!userProfile.github_url;

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error.message);
        return null;
      }

      setUserProfile(data || null);
      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  // Refresh user profile
  const refreshProfile = async () => {
    if (user) {
      return await fetchUserProfile(user.id);
    }
    return null;
  };

  // Update user profile
  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to update your profile",
        variant: "destructive"
      });
      return;
    }

    setProfileLoading(true);
    try {
      const updates = {
        ...profile,
        id: user.id,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      // Refresh profile data
      await fetchUserProfile(user.id);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error.message);
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          await fetchUserProfile(data.session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session) {
          // Fetch user profile on sign in
          const profile = await fetchUserProfile(session.user.id);

          // Check if user has completed profile setup
          if (!profile || !profile.linkedin_url || !profile.github_url) {
            navigate('/profile-setup');
          } else {
            navigate('/dashboard');
          }
        }

        if (event === 'SIGNED_OUT') {
          setUserProfile(null);
          navigate('/');
        }

        if (event === 'USER_UPDATED' && session) {
          await fetchUserProfile(session.user.id);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (provider: 'github' | 'google') => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification email sent",
        description: "Please check your email for a verification link."
      });
    } catch (error: any) {
      toast({
        title: "Registration error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Sign out error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    userProfile,
    loading,
    profileLoading,
    signIn,
    signInWithEmail,
    signUp,
    signOut,
    updateUserProfile,
    profileComplete,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
