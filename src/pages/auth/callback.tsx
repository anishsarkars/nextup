
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error.message);
        navigate('/auth/login');
        return;
      }
      
      // Check if the user has completed their profile
      const { data: user } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.user.id)
          .single();
        
        if (profileError || !profile.linkedin_url || !profile.github_url) {
          // User needs to complete profile setup
          navigate('/profile-setup');
        } else {
          // User has a complete profile
          navigate('/dashboard');
        }
      } else {
        navigate('/auth/login');
      }
    };
    
    handleAuthCallback();
  }, [navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-pulse text-center">
        <h2 className="text-2xl font-semibold mb-4">Processing your login...</h2>
        <p className="text-muted-foreground">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
}
