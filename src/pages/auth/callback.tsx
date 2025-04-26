
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error(sessionError.message);
        }
        
        // Check if the user has completed their profile
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          throw new Error(userError?.message || 'Failed to get user data');
        }
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw new Error(profileError.message);
        }
        
        if (!profile || !profile.linkedin_url || !profile.github_url) {
          // User needs to complete profile setup
          toast({
            title: "Welcome to NextUP!",
            description: "Let's set up your profile to get started.",
          });
          navigate('/profile-setup');
        } else {
          // User has a complete profile
          toast({
            title: "Welcome back!",
            description: "You have been successfully signed in.",
          });
          navigate('/dashboard');
        }
      } catch (error: any) {
        console.error('Error in auth callback:', error);
        setError(error.message);
        toast({
          title: "Authentication error",
          description: error.message || "Failed to complete authentication",
          variant: "destructive"
        });
        navigate('/auth/login');
      }
    };
    
    handleAuthCallback();
  }, [navigate, toast]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {error ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-destructive">Authentication Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            className="text-primary hover:underline"
            onClick={() => navigate('/auth/login')}
          >
            Return to login
          </button>
        </div>
      ) : (
        <div className="animate-pulse text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-4">Processing your login...</h2>
          <p className="text-muted-foreground">Please wait while we complete the authentication process.</p>
        </div>
      )}
    </div>
  );
}
