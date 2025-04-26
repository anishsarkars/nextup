
import { createClient } from '@supabase/supabase-js';

// Use default placeholder values for development
// In production, these should be set in your environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Log a warning if we're using placeholder values
if (supabaseUrl === 'https://placeholder-project.supabase.co' || 
    supabaseAnonKey === 'placeholder-anon-key') {
  console.warn('Using placeholder Supabase credentials. Please set up your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get the current session
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error.message);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error('Error in getSession:', error);
    return null;
  }
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error.message);
      return null;
    }
    return data.user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};
